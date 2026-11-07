"""Offline tests for GFS source selection and per-hour fallback."""

import datetime as dt
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import DEFAULT, call, patch

from scripts.data import build_data


RUN = dt.datetime(2026, 11, 4, 18, tzinfo=dt.timezone.utc)
OLDER = RUN - dt.timedelta(hours=6)
HOURS = [0, 1, 2]


class BuildGfsTests(unittest.TestCase):
    def setUp(self):
        self.out = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.report = {}
        self.mocks = self.enterContext(patch.multiple(
            build_data,
            HOURS=HOURS,
            ALIGN_POINTS=[],
            SPOT_CITIES=[],
            SERIES_HOURS=[],
            find_cycle=DEFAULT,
            fetch_nomads=DEFAULT,
            fetch_aws=DEFAULT,
            decode=DEFAULT,
            decode_smooth=DEFAULT,
            write_gfs_frame=DEFAULT,
            write_series=DEFAULT,
            notice=DEFAULT,
        ))
        self.find_cycle = self.mocks["find_cycle"]
        self.nomads = self.mocks["fetch_nomads"]
        self.aws = self.mocks["fetch_aws"]
        self.find_cycle.return_value = (RUN, {"f000": None, "f168": None})
        self.nomads.return_value = b"GRIB nomads"
        self.aws.return_value = b"GRIB aws"
        self.mocks["decode"].return_value = {}
        self.mocks["decode_smooth"].side_effect = lambda _wgrib2, _src, _tmp, keys, _raw: {
            key: [0.0] for key in keys
        }
        self.mocks["write_gfs_frame"].side_effect = self.write_frame
        self.mocks["write_series"].side_effect = self.write_series

    @staticmethod
    def write_frame(gdir, hour, fields, run, valid, generated, sizes, rain_hours):
        for size in sizes.values():
            size.append(1)
        return {"f": hour, "rain_hours": rain_hours}

    @staticmethod
    def write_series(gdir, series, run, generated):
        (gdir / "series.png").write_bytes(b"fixture")
        return {"file": "series.png"}

    def build(self, *, prefer_aws=False):
        return build_data.build_gfs(SimpleNamespace(prefer_aws=prefer_aws), self.out, RUN, self.report)

    def test_all_nomads(self):
        gfs = self.build()
        self.find_cycle.assert_called_once_with("nomads")
        self.assertEqual(self.nomads.call_args_list, [call(RUN, hour) for hour in HOURS])
        self.aws.assert_not_called()
        self.assertEqual(gfs["source"], "nomads")
        self.assertEqual([frame["f"] for frame in gfs["frames"]], HOURS)

    def test_one_nomads_failure_uses_aws_for_same_hour_and_cycle(self):
        self.nomads.side_effect = [b"GRIB", RuntimeError("missing"), b"GRIB"]
        gfs = self.build()
        self.find_cycle.assert_called_once_with("nomads")
        self.aws.assert_called_once_with(RUN, 1)
        self.assertEqual(self.nomads.call_args_list, [call(RUN, hour) for hour in HOURS])
        self.assertEqual(gfs["run"], build_data.iso(RUN))

    def test_both_missing_one_hour_restarts_from_f000_on_other_cycle(self):
        pub = {"f000": None, "f168": None}
        self.find_cycle.side_effect = [(RUN, pub), (OLDER, pub)]
        self.nomads.side_effect = [b"GRIB", RuntimeError("missing")]
        self.aws.side_effect = [RuntimeError("also missing"), b"GRIB", b"GRIB", b"GRIB"]
        gfs = self.build()
        self.assertEqual(self.find_cycle.call_args_list, [call("nomads"), call("aws")])
        self.assertEqual(self.nomads.call_args_list, [call(RUN, 0), call(RUN, 1)])
        self.assertEqual(self.aws.call_args_list, [call(RUN, 1)] + [call(OLDER, hour) for hour in HOURS])
        self.assertEqual(gfs["source"], "aws")
        self.assertEqual(gfs["run"], build_data.iso(OLDER))
        self.assertEqual(gfs["nomads_hours"], [])
        self.assertEqual(gfs["aws_hours"], HOURS)

    def test_prefer_aws_falls_back_to_nomads_then_resumes_aws(self):
        self.aws.side_effect = [b"GRIB", RuntimeError("missing"), b"GRIB"]
        gfs = self.build(prefer_aws=True)
        self.find_cycle.assert_called_once_with("aws")
        self.nomads.assert_called_once_with(RUN, 1)
        self.assertEqual(self.aws.call_args_list, [call(RUN, hour) for hour in HOURS])
        self.assertEqual(gfs["source"], "aws")
        self.assertEqual(gfs["aws_hours"], [0, 2])
        self.assertEqual(gfs["nomads_hours"], [1])

    def test_per_hour_source_records_match_manifest_report_and_log(self):
        self.nomads.side_effect = [RuntimeError("missing"), b"GRIB", RuntimeError("missing")]
        gfs = self.build()
        expected = {"nomads_hours": [1], "aws_hours": [0, 2]}
        self.assertEqual({key: gfs[key] for key in expected}, expected)
        self.assertEqual(self.report["gfs_hour_sources"], expected)
        self.mocks["notice"].assert_any_call(
            "GFS hour sources", f"{build_data.iso(RUN)}: cycle from nomads; NOMADS 1, AWS 2 of 3 hours"
        )

    def test_both_whole_run_attempts_raise_for_stale_handling(self):
        self.nomads.side_effect = RuntimeError("NOMADS missing")
        self.aws.side_effect = RuntimeError("AWS missing")
        with self.assertRaisesRegex(RuntimeError, "NOMADS missing.*AWS missing"):
            self.build()
        self.assertEqual(self.find_cycle.call_args_list, [call("nomads"), call("aws")])
        self.assertNotIn("gfs_hour_sources", self.report)


if __name__ == "__main__":
    unittest.main()
