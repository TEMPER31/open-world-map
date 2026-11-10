"""Offline tests for the refresh timer's decision."""

import datetime as dt
import unittest

from scripts.data import refresh_due as rd

UTC = dt.timezone.utc


def at(s):
    return dt.datetime.fromisoformat(s).replace(tzinfo=UTC)


def run(created, status="completed"):
    return {"createdAt": created, "status": status}


class NewestReadyCycle(unittest.TestCase):
    def test_cycle_is_ready_4h45_after_it_starts(self):
        self.assertEqual(rd.newest_ready_cycle(at("2026-11-10T04:44:00")), at("2026-11-09T18:00:00"))
        self.assertEqual(rd.newest_ready_cycle(at("2026-11-10T04:45:00")), at("2026-11-10T00:00:00"))
        self.assertEqual(rd.newest_ready_cycle(at("2026-11-10T22:50:00")), at("2026-11-10T18:00:00"))


class Decide(unittest.TestCase):
    NOW = at("2026-11-10T11:20:00")          # 06Z is complete, 12Z is not

    def test_due_when_the_site_is_a_cycle_behind(self):
        due, why = rd.decide(self.NOW, at("2026-11-10T00:00:00"), [run("2026-11-10T05:00:00Z")])
        self.assertTrue(due, why)

    def test_not_due_when_the_site_has_the_newest_complete_cycle(self):
        due, why = rd.decide(self.NOW, at("2026-11-10T06:00:00"), [run("2026-11-10T10:50:00Z")])
        self.assertFalse(due)
        self.assertIn("already has", why)

    def test_never_while_a_data_run_is_queued_or_running(self):
        for status in ("queued", "in_progress", "waiting"):
            due, _ = rd.decide(self.NOW, at("2026-11-10T00:00:00"), [run("2026-11-10T11:10:00Z", status)])
            self.assertFalse(due, status)

    def test_a_recent_start_waits_two_hours_before_trying_again(self):
        due, why = rd.decide(self.NOW, at("2026-11-10T00:00:00"), [run("2026-11-10T10:00:00Z")])
        self.assertFalse(due)
        self.assertIn("80 min ago", why)
        due, _ = rd.decide(self.NOW, at("2026-11-10T00:00:00"), [run("2026-11-10T09:19:00Z")])
        self.assertTrue(due)

    def test_unreadable_site_counts_as_behind(self):
        due, why = rd.decide(self.NOW, None, [run("2026-11-10T05:00:00Z")])
        self.assertTrue(due)
        self.assertIn("could not read", why)

    def test_no_earlier_runs(self):
        self.assertTrue(rd.decide(self.NOW, at("2026-11-09T18:00:00"), [])[0])

    def test_four_runs_a_day_when_each_one_works(self):
        """Hourly checks over a day where every started run deploys the newest cycle at once."""
        site, runs, started = at("2026-11-09T18:00:00"), [], []
        t = at("2026-11-10T00:30:00")
        while t < at("2026-11-11T00:30:00"):
            due, _ = rd.decide(t, site, runs)
            if due:
                started.append(t)
                runs.append(run(t.strftime("%Y-%m-%dT%H:%M:%SZ")))
                site = rd.newest_ready_cycle(t)
            t += dt.timedelta(hours=1)
        self.assertEqual([s.strftime("%H:%M") for s in started], ["05:30", "11:30", "17:30", "23:30"])

    def test_at_most_one_try_every_two_hours_when_runs_keep_failing(self):
        site, runs, started = at("2026-11-09T18:00:00"), [], 0
        t = at("2026-11-10T00:30:00")
        while t < at("2026-11-11T00:30:00"):
            if rd.decide(t, site, runs)[0]:
                started += 1
                runs.append(run(t.strftime("%Y-%m-%dT%H:%M:%SZ")))
            t += dt.timedelta(hours=1)
        self.assertLessEqual(started, 12)


if __name__ == "__main__":
    unittest.main()
