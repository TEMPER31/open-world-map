# Sources probe

Generated 2026-11-01T01:51:04.554Z by `scripts/data/sources-probe.mjs` from GitHub Actions, with `Origin: https://temper31.github.io`.

## Data endpoints

### USGS M2.5+ past 7 days

`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson`

- HTTP 200 in 195 ms · 236,960 bytes · content-type application/json; charset=utf-8
- Access-Control-Allow-Origin: ***** · cache-control: public, max-age=60 · last-modified: Sun, 01 Nov 2026 01:50:07 GMT
- features: 335; metadata: {"generated":1793497807000,"url":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson","title":"USGS Magnitude 2.5+ Earthquakes, Past Week","status":200,"api":"2.8.2","count":335}
- property keys: mag, place, time, updated, tz, url, detail, felt, cdi, mmi, alert, status, tsunami, sig, net, code, ids, sources, types, nst, dmin, rms, gap, magType, type, title
- first feature: {"geometry":"Point","coords":[165.6627,-13.8748,10],"properties":{"mag":4.8,"place":"199 km NW of Port-Olry, Vanuatu","time":1793491075354,"updated":1793492226040,"tz":null,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/us7000tule","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000tule.geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"reviewed","tsunami":0,"sig":354,"net":"us","code":"7000tule","ids":",us7000tule,","sources":",us,","types":",origin,phase-data,","nst":33,"dmin":6.768,"rms":0.71,"gap":110,"magType":"mb","type":"earthquake","title":"M 4.8 - 199 km NW of Port-Olry, Vanuatu"}}
- geometry/class counts: {"Point":335}

### USGS significant past 7 days

`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson`

- HTTP 200 in 26 ms · 1,778 bytes · content-type application/json; charset=utf-8
- Access-Control-Allow-Origin: ***** · cache-control: public, max-age=60 · last-modified: Sun, 01 Nov 2026 01:50:58 GMT
- features: 2; metadata: {"generated":1793497858000,"url":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson","title":"USGS Significant Earthquakes, Past Week","status":200,"api":"2.8.2","count":2}
- property keys: mag, place, time, updated, tz, url, detail, felt, cdi, mmi, alert, status, tsunami, sig, net, code, ids, sources, types, nst, dmin, rms, gap, magType, type, title
- first feature: {"geometry":"Point","coords":[-98.0489,-36.4058,10],"properties":{"mag":6.4,"place":"southeast of Easter Island","time":1793260190928,"updated":1793356727040,"tz":null,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/us7000ttxz","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000ttxz.geojson","felt":null,"cdi":null,"mmi":0,"alert":"green","status":"reviewed","tsunami":0,"sig":630,"net":"us","code":"7000ttxz","ids":",us7000ttxz,","sources":",us,","types":",losspager,moment-tensor,origin,phase-data,shakemap,","nst":83,"dmin":13.321,"rms":1.32,"gap":39,"magType":"mww","type":"earthquake","title":"M 6.4 - southeast of Easter Island"}}
- geometry/class counts: {"Point":2}

### EONET v3 open events, 7 days

`https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=7`

- HTTP 200 in 1528 ms · 68,887 bytes · content-type application/rss+xml; charset=utf-8
- Access-Control-Allow-Origin: ***** · cache-control: no-cache, private · last-modified: —
- rate headers: x-ratelimit-limit: 60; x-ratelimit-remaining: 59
- events: 14; keys: id, title, description, link, closed, categories, sources, geometry
- category counts: {"seaLakeIce":6,"wildfires":4,"severeStorms":4}
- first event: {"id":"EONET_6051","title":"Iceberg C39","description":null,"link":"https://eonet.gsfc.nasa.gov/api/v3/events/EONET_6051","closed":null,"categories":[{"id":"seaLakeIce","title":"Sea and Lake Ice"}],"sources":[{"id":"NATICE","url":"https://usicecenter.gov/pub/Iceberg_Tabular.csv"}],"geometry":[{"magnitudeValue":120,"magnitudeUnit":"NM^2","date":"2022-04-29T00:00:00Z","type":"Point","coordinates":[99.61,-65.68]},{"magnitudeValue":105,"magnitudeUnit":"NM^2","date":"2023-02-03T00:00:00Z","type":"Point","coordinates":[99.15,-65.16]},{"magnitudeValue":120,"magnitudeUnit":"NM^2","date":"2023-08-11T00:00:00Z","type":"Point","coordinates":[98.37,-64.78]},{"magnitudeValue":120,"magnitudeUnit":"NM^2","date":"2025-04-24T00:00:00Z","type":"Point","coordinates":[97.94,-64.27]},{"magnitudeValue":120,"magnitudeUnit":"NM^2","date":"2025-05-02T00:00:00Z","type":"Point","coordinates":[95.86,-64.34]},{"magnitudeValue":120,"magnitudeUnit":"NM^2","date":"2025-05-09T00:00:00Z","type":"Point","coordinates":[92.92,-65.05]},{"magnitudeValue":120,"magnitudeUnit":"NM^2","date":"2025-05-22T00:00:00Z","type":"Point","coordinates":[90.81,-65.46]},{"magnitudeValue":120,"magnitudeUnit":"NM^2","date":"2025-05-29T00:00:00Z","type":"Point","coordinates":[89.37,-65.8]},{"magnitudeValue":120,"magnitudeUnit":"NM^2","date":"2025-06-05T00:00:00Z","type":"Point","coordinates":[85.51,-65.96]},{"magnitudeValue":120,"magn…

### EONET v3 categories

`https://eonet.gsfc.nasa.gov/api/v3/categories`

- HTTP 200 in 270 ms · 4,469 bytes · content-type application/rss+xml; charset=utf-8
- Access-Control-Allow-Origin: ***** · cache-control: no-cache, private · last-modified: —
- categories: drought (Drought), dustHaze (Dust and Haze), earthquakes (Earthquakes), floods (Floods), landslides (Landslides), manmade (Manmade), seaLakeIce (Sea and Lake Ice), severeStorms (Severe Storms), snow (Snow), tempExtremes (Temperature Extremes), volcanoes (Volcanoes), waterColor (Water Color), wildfires (Wildfires)

### GDACS event list MAP

`https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP`

- HTTP 400 in 545 ms · 36 bytes · content-type application/json; charset=utf-8
- Access-Control-Allow-Origin: ***** · cache-control: — · last-modified: —
- json: {"message":"Eventtype is required."}

### GDACS event list SEARCH

`https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromDate=2026-10-25&toDate=2026-11-02&alertlevel=Green;Orange;Red`

- HTTP 200 in 1223 ms · 136,437 bytes · content-type application/json; charset=utf-8
- Access-Control-Allow-Origin: ***** · cache-control: — · last-modified: —
- features: 100; metadata: undefined
- property keys: eventtype, eventid, episodeid, eventname, glide, name, description, htmldescription, icon, iconoverall, url, alertlevel, alertscore, episodealertlevel, episodealertscore, istemporary, iscurrent, country, fromdate, todate, datemodified, iso3, source, sourceid, polygonlabel, Class, affectedcountries, severitydata
- first feature: {"geometry":"Point","coords":[165.6627,-13.8748],"properties":{"eventtype":"EQ","eventid":1575004,"episodeid":1743986,"eventname":"","glide":"","name":"Earthquake in Vanuatu","description":"Earthquake in Vanuatu","htmldescription":"Green M 4.8 Earthquake in Vanuatu at: 31 Oct 2026 23:57:55.","icon":"https://www.gdacs.org/images/gdacs_icons/maps/Green/EQ.png","iconoverall":"https://www.gdacs.org/images/gdacs_icons/maps/Green/EQ.png","url":{"geometry":"https://www.gdacs.org/gdacsapi/api/polygons/getgeometry?eventtype=EQ&eventid=1575004&episodeid=1743986","report":"https://www.gdacs.org/report.aspx?eventid=1575004&episodeid=1743986&eventtype=EQ","details":"https://www.gdacs.org/gdacsapi/api/events/geteventdata?eventtype=EQ&eventid=1575004"},"alertlevel":"Green","alertscore":1,"episodealertlevel":"Green","episodealertscore":0,"istemporary":"false","iscurrent":"true","country":"Vanuatu","fromdate":"2026-10-31T23:57:55","todate":"2026-10-31T23:57:55","datemodified":"2026-11-01T00:19:22","iso3":"VUT","source":"NEIC","sourceid":"","polygonlabel":"Centroid","Class":"Point_Centroid","affectedcountries":[{"iso2":"VU","iso3":"VUT","countryname":"Vanuatu"}],"severitydata":{"severity":4.8,"severitytext":"Magnitude 4.8M, Depth:10km","severityunit":"M"}}}
- geometry/class counts: {"Point Point_Centroid EQ":13,"Point Point_Centroid TC":1,"Point Point_Centroid FL":2,"Point Point_Centroid WF":84}

### GDACS swagger

`https://www.gdacs.org/gdacsapi/swagger/v1/swagger.json`

- HTTP 200 in 309 ms · 151,598 bytes · content-type application/json;charset=utf-8
- Access-Control-Allow-Origin: **—** · cache-control: — · last-modified: —
- paths: /api/AdaptiveCard/getevent/data | /api/AdaptiveCard/getevent/card | /api/AdaptiveCard/geteventlist/data | /api/AdaptiveCard/geteventlist/card | /api/AdaptiveCard/geteventlist/schema | /api/CopernicusActivation/getcopernicusaoi | /api/CopernicusActivation/getcopernicusobserved | /api/Cyclonesurge/getdetails | /api/Cyclonesurge/gettcactive4de | /api/admin/Documents/download | /api/admin/Documents/getdocumentsbyevent | /api/admin/Documents/getdocumentsbytext | /api/Emdat/getemdatbyeventkey | /api/Emdat/getemdatbydisno | /api/Emdat/getemdatbyiso3 | /api/Emdat/getemdatbyiso3list | /api/Emdat/getemdatlist | /api/Emm/getemmnewsbykey | /api/Emm/getemmnewsstatisticbykey | /api/Events/geteventdata | /api/Events/geteventdataapp | /api/Events/getepisodedata | /api/Events/geteventlist/map | /api/Events/geteventlist/homepagetable | /api/Events/geteventlist/forsocial | /api/Events/geteventlist/allpaging | /api/Events/geteventlist/archive | /api/Events/geteventlist/eventsbyarea | /api/Events/geteventlist/search | /api/Events/geteventlist/latest | /api/Events/geteventlist/statistic | /api/Events/geteventlist/events4app | /api/Events/getstructure/forsocial | /api/Events/getepisodealertlevel | /api/Events/geteventalertlevel | /api/Events/getnpp | /api/Export/getlocations | /api/Export/getids | /api/Export/getaffectedlocations | /api/Export/getimpact | /api/Export/gettimeline | /api/Export/getpopdense | /api/Export/getaoi | /api/FloodGfm/getfloodgfmwmsbykeys/bydate | /api/FloodGfm/getfloodgfmwmsbykeys/overall | /api/Gts/getdatabykey | /api/Gts/getdatabyperiod | /Api/InfoProduct/getinfoproduct | /api/News/getnewsbygdacskey | /api/Polygons/getgeometry | /api/Polygons/getgeometry/aoi | /api/Shakemap/getdetails | /api/Shakemap/getgeometry | /api/azurecontent/StaticData/comparefiles | /api/azurecontent/StaticData/updaterepository | /api/azurecontent/StaticData/updategenericrepository | /api/azurecontent/StaticData/updategenericrepositorysync | /api/Vaac/getgeometry | /api/Vaac/getvaacdata | /api/Vaac/getvaacbulletin | /api/Vaac/getvaacbulletintext | /api/Vaac/getgeometrypop | /api/Volcano/getseismicdata | /api/Volcano/getvolcanoesinfo | /api/Volcano/getvolcanoesinfoinperiod | /api/Volcano/getvolcanoinfo | /api/Volcano/getseismicdata_area | /api/VolcanoAdditional/getmountdata | /api/VolcanoAdditional/getmirovadata | /api/VolcanoSmithNews/getsmithsonianbyvolcanoid | /api/VolcanoSmithNews/getsmithsonianbykey
- event list params: {"get":{"tags":["AdaptiveCard"],"summary":"Search a list of events by parameter, it returns the first 100 elements, it is possible to obtain record by paging specifying the page size and page number.\r\nThe records are ordered by todate desc","parameters":[{"name":"eventlist","in":"query","description":"the list of eventtypes to search","schema":{"type":"string"}},{"name":"alertlevel","in":"query","description":"the alertlevel filter","schema":{"type":"string"}},{"name":"fromDate","in":"query","description":"Optional: the datestart to filter","schema":{"type":"string","format":"date-time"}},{"name":"toDate","in":"query","description":"Optional: the dateend  to filter","schema":{"type":"string","format":"date-time"}},{"name":"country","in":"query","description":"Optional: the country  to filter","schema":{"type":"string"}},{"name":"pageSize","in":"query","description":"Optional: the number of record in the page (Max 100)","schema":{"type":"integer","format":"int32"}},{"name":"pageNumber","in":"query","description":"Optional: the page number of recordset","schema":{"type":"integer","format":"int32"}}],"responses":{"200":{"description":"OK"}}}}

### NHC CurrentStorms.json

`https://www.nhc.noaa.gov/CurrentStorms.json`

- HTTP 200 in 191 ms · 24 bytes · content-type application/json
- Access-Control-Allow-Origin: **—** · cache-control: max-age=300 · last-modified: Fri, 30 Oct 2026 10:42:00 GMT
- activeStorms: 0

### NHC JSON sample

`https://www.nhc.noaa.gov/productexamples/NHC_JSON_Sample.json`

- HTTP 200 in 212 ms · 15,363 bytes · content-type application/json
- Access-Control-Allow-Origin: **—** · cache-control: max-age=300 · last-modified: Fri, 14 Feb 2025 16:02:12 GMT
- activeStorms: 4
- storm: {"id":"al062023","binNumber":"AT1","name":"Gert","classification":"TD","intensity":"25","pressure":"1008","latitude":"17.1N","longitude":"58.4W","latitudeNumeric":17.1,"longitudeNumeric":-58.4,"movementDir":285,"movementSpeed":9,"lastUpdate":"2023-08-22T03:00:00.000Z","publicAdvisory":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCPAT1.shtml"},"forecastAdvisory":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCMAT1.shtml"},"windSpeedProbabilities":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIAPWSAT1.shtml"},"forecastDiscussion":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCDAT1.shtml"},"forecastGraphics":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/graphics_at1.shtml"},"forecastTrack":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al062023_5day_011.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL062023_011adv_TRACK.kmz"},"windWatchesWarnings":null,"trackCone":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al062023_5day_011.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL062023_011adv_CONE.kmz"},"initialWindExtent":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al062023_fcst_011.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL062023_initialradii_011adv.kmz"},"forecastWindRadiiGIS":{"advNum":"011","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al062023_fcst_011.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL062023_forecastradii_011adv.kmz"},"bestTrackGIS":{"issuance":"2023-08-22T00:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/best_track/al062023_best_track.zip","kmzFile":"https://www.nhc.noaa.gov/g…
- storm: {"id":"al082023","binNumber":"AT3","name":"Franklin","classification":"TS","intensity":"45","pressure":"1002","latitude":"14.5N","longitude":"70.2W","latitudeNumeric":14.5,"longitudeNumeric":-70.2,"movementDir":335,"movementSpeed":5,"lastUpdate":"2023-08-22T03:00:00.000Z","publicAdvisory":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCPAT3.shtml"},"forecastAdvisory":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCMAT3.shtml"},"windSpeedProbabilities":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIAPWSAT3.shtml"},"forecastDiscussion":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCDAT3.shtml"},"forecastGraphics":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/graphics_at3.shtml"},"forecastTrack":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al082023_5day_006.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL082023_006adv_TRACK.kmz"},"windWatchesWarnings":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al082023_5day_006.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL082023_006adv_WW.kmz"},"trackCone":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al082023_5day_006.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL082023_006adv_CONE.kmz"},"initialWindExtent":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al082023_fcst_006.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL082023_initialradii_006adv.kmz"},"forecastWindRadiiGIS":{"advNum":"006","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al082023_fcst_006.zip","kmzFile":"https://www.nhc.noaa.gov/storm_gra…
- storm: {"id":"al092023","binNumber":"AT4","name":"Nine","classification":"TD","intensity":"30","pressure":"1008","latitude":"25.7N","longitude":"93.3W","latitudeNumeric":25.7,"longitudeNumeric":-93.3,"movementDir":285,"movementSpeed":18,"lastUpdate":"2023-08-22T03:00:00.000Z","publicAdvisory":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCPAT4.shtml"},"forecastAdvisory":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCMAT4.shtml"},"windSpeedProbabilities":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIAPWSAT4.shtml"},"forecastDiscussion":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCDAT4.shtml"},"forecastGraphics":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","url":"https://www.nhc.noaa.gov/graphics_at4.shtml"},"forecastTrack":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al092023_5day_003.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL092023_003adv_TRACK.kmz"},"windWatchesWarnings":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al092023_5day_003.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL092023_003adv_WW.kmz"},"trackCone":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al092023_5day_003.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL092023_003adv_CONE.kmz"},"initialWindExtent":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al092023_fcst_003.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphics/api/AL092023_initialradii_003adv.kmz"},"forecastWindRadiiGIS":{"advNum":"003","issuance":"2023-08-22T03:00:00.000Z","fileUpdateTime":"2023-08-22T02:55:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/forecast/archive/al092023_fcst_003.zip","kmzFile":"https://www.nhc.noaa.gov/storm_graphi…
- storm: {"id":"ep092023","binNumber":"EP4","name":"Hilary","classification":"PTC","intensity":"25","pressure":"1005","latitude":"44.6N","longitude":"115.5W","latitudeNumeric":44.6,"longitudeNumeric":-115.5,"movementDir":40,"movementSpeed":30,"lastUpdate":"2023-08-21T21:00:00.000Z","publicAdvisory":{"advNum":"022","issuance":"2023-08-21T21:00:00.000Z","fileUpdateTime":"2023-08-21T20:57:52.439Z","url":"https://www.nhc.noaa.gov/text/MIAWPCEP4.shtml"},"forecastAdvisory":{"advNum":"022","issuance":"2023-08-21T21:00:00.000Z","fileUpdateTime":"2023-08-21T20:57:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCMEP4.shtml"},"windSpeedProbabilities":null,"forecastDiscussion":{"advNum":"022","issuance":"2023-08-21T21:00:00.000Z","fileUpdateTime":"2023-08-21T20:57:52.439Z","url":"https://www.nhc.noaa.gov/text/MIATCDEP4.shtml"},"forecastGraphics":{"advNum":"020","issuance":"2023-08-21T21:00:00.000Z","fileUpdateTime":"2023-08-21T20:57:52.439Z","url":"https://www.nhc.noaa.gov/graphics_ep4.shtml"},"forecastTrack":null,"windWatchesWarnings":null,"trackCone":null,"initialWindExtent":null,"forecastWindRadiiGIS":null,"bestTrackGIS":{"issuance":"2023-08-21T06:00:00.000Z","fileUpdateTime":"2023-08-21T05:57:52.439Z","zipFile":"https://www.nhc.noaa.gov/gis/best_track/ep092023_best_track.zip","kmzFile":"https://www.nhc.noaa.gov/gis/best_track/ep092023_best_track.kmz"},"earliestArrivalTimeTSWindsGIS":null,"mostLikelyTimeTSWindsGIS":null,"windSpeedProbabilitiesGIS":null,"stormSurgeWatchWarningGIS":null,"potentialStormSurgeFloodingGIS":null,"peakSurgeKML":null}

### NHC ArcGIS MapServer

`https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer?f=json`

- HTTP 200 in 394 ms · 92,075 bytes · content-type application/json;charset=UTF-8
- Access-Control-Allow-Origin: **https://temper31.github.io** · cache-control: max-age=0,must-revalidate · last-modified: —
- forecast layers: 4 AT1 | 6 AT1 Forecast Points | 7 AT1 Forecast Track | 8 AT1 Forecast Cone | 30 AT2 | 32 AT2 Forecast Points | 33 AT2 Forecast Track | 34 AT2 Forecast Cone | 56 AT3 | 58 AT3 Forecast Points | 59 AT3 Forecast Track | 60 AT3 Forecast Cone | 82 AT4 | 84 AT4 Forecast Points | 85 AT4 Forecast Track | 86 AT4 Forecast Cone | 108 AT5 | 110 AT5 Forecast Points | 111 AT5 Forecast Track | 112 AT5 Forecast Cone | 134 EP1 | 136 EP1 Forecast Points | 137 EP1 Forecast Track | 138 EP1 Forecast Cone | 160 EP2 | 162 EP2 Forecast Points | 163 EP2 Forecast Track | 164 EP2 Forecast Cone | 186 EP3 | 188 EP3 Forecast Points | 189 EP3 Forecast Track | 190 EP3 Forecast Cone | 212 EP4 | 214 EP4 Forecast Points | 215 EP4 Forecast Track | 216 EP4 Forecast Cone | 238 EP5 | 240 EP5 Forecast Points | 241 EP5 Forecast Track | 242 EP5 Forecast Cone | 264 CP1 | 266 CP1 Forecast Points | 267 CP1 Forecast Track | 268 CP1 Forecast Cone | 290 CP2 | 292 CP2 Forecast Points | 293 CP2 Forecast Track | 294 CP2 Forecast Cone | 316 CP3 | 318 CP3 Forecast Points | 319 CP3 Forecast Track | 320 CP3 Forecast Cone | 342 CP4 | 344 CP4 Forecast Points | 345 CP4 Forecast Track | 346 CP4 Forecast Cone | 368 CP5 | 370 CP5 Forecast Points | 371 CP5 Forecast Track | 372 CP5 Forecast Cone

### NHC AT1 Forecast Points layer

`https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer/6?f=json`

- HTTP 200 in 47 ms · 22,949 bytes · content-type application/json;charset=UTF-8
- Access-Control-Allow-Origin: **https://temper31.github.io** · cache-control: max-age=0,must-revalidate · last-modified: —
- layer 6 AT1 Forecast Points: fields objectid (OID), stormname (String), stormtype (String), dvlbl (String), basin (String), advdate (String), advisnum (String), fcstprd (Double), gust (Double), maxwind (Double), mslp (Double), ssnum (Double), datelbl (String), tcdvlp (String), tcdir (Double), tcspd (Double), fldatelbl (String), lat (Double), lon (Double), stormnum (Double), stormsrc (String), tau (Double), timezone (String), validtime (String), idp_source (String), idp_filedate (Date), idp_ingestdate (Date), shape (Geometry), binnumber (String)

### NHC AT1 Forecast Points query

`https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer/6/query?where=1%3D1&outFields=*&f=geojson`

- HTTP 200 in 63 ms · 42 bytes · content-type application/geo+json;charset=UTF-8
- Access-Control-Allow-Origin: **https://temper31.github.io** · cache-control: max-age=0,must-revalidate · last-modified: —
- features: 0; metadata: undefined

### NHC AT1 Forecast Cone layer

`https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer/8?f=json`

- HTTP 200 in 46 ms · 5,447 bytes · content-type application/json;charset=UTF-8
- Access-Control-Allow-Origin: **https://temper31.github.io** · cache-control: max-age=0,must-revalidate · last-modified: —
- layer 8 AT1 Forecast Cone: fields objectid (OID), stormname (String), stormtype (String), basin (String), advdate (String), advisnum (String), fcstprd (Double), stormnum (Double), idp_source (String), idp_filedate (Date), idp_ingestdate (Date), shape (Geometry), st_area(shape) (Double), st_perimeter(shape) (Double), binnumber (String)

### Mapillary tiles (no token)

`https://tiles.mapillary.com/maps/vtp/mly1_public/2/2/1/1`

- HTTP 403 in 298 ms · 0 bytes · content-type text/html; charset="utf-8"
- Access-Control-Allow-Origin: **—** · cache-control: — · last-modified: —
- not JSON (Unexpected end of JSON input); body: 

### Mapillary Graph API (no token)

`https://graph.mapillary.com/images?limit=1&bbox=-73.99,40.75,-73.98,40.76`

- HTTP 500 in 233 ms · 145 bytes · content-type application/json; charset=UTF-8
- Access-Control-Allow-Origin: ***** · cache-control: no-store · last-modified: —
- json: {"error":{"message":"Invalid OAuth 2.0 Access Token","type":"MLYApiException","code":190,"error_data":{},"fbtrace_id":"AGhj2KqGb7z7yF19ZvqAm0u"}}
- OPTIONS preflight: HTTP 200 · allow-origin * · allow-headers authorization

## Terms and documentation (matching sentences)

### USGS GeoJSON feed docs

`https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php`

- HTTP 200 · 2,459 chars of text · final URL https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
  - Output { type: "FeatureCollection", metadata: { generated : Long Integer, url : String, title : String, api : String, count : Integer, status : Integer }, bbox: [ minimum longitude , minimum latitude , minimum depth , maximum longitude , maximum latitude , maximum depth ], features: [ { type: "Feature", properties: { mag : Decimal, place : String, time : Long Integer, updated : Long Integer, tz : 
  - Significant Earthquakes M4.5+ Earthquakes M2.5+ Earthquakes M1.0+ Earthquakes All Earthquakes Past Day Updated every minute.
  - Significant Earthquakes M4.5+ Earthquakes M2.5+ Earthquakes M1.0+ Earthquakes All Earthquakes Past 7 Days Updated every minute.
  - Significant Earthquakes M4.5+ Earthquakes M2.5+ Earthquakes M1.0+ Earthquakes All Earthquakes Past 30 Days Updated every minute.
  - links: generated -> /data/comcat/data-eventterms.php#metadata_generated | url -> /data/comcat/data-eventterms.php#metadata_url | title -> /data/comcat/data-eventterms.php#metadata_title | api -> /data/comcat/data-eventterms.php#metadata_api | count -> /data/comcat/data-eventterms.php#metadata_count | status -> /data/comcat/data-eventterms.php#metadata_status | minimum longitude -> /data/comcat/data-eventterms.php#longitude | minimum latitude -> /data/comcat/data-eventterms.php#latitude | minimum depth -> /data/comcat/data-eventterms.php#depth | maximum longitude -> /data/comcat/data-eventterms.php#longitude | maximum latitude -> /data/comcat/data-eventterms.php#latitude | maximum depth -> /data/comcat/data-eventterms.php#depth | mag -> /data/comcat/data-eventterms.php#mag | place -> /data/comcat/data-eventterms.php#place | time -> /data/comcat/data-eventterms.php#time

### USGS summary feed docs

`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/`

- HTTP 404 · 124 chars of text · final URL https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/
  - (no matching sentences; page may be rendered by JavaScript)

### USGS copyrights and credits

`https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits`

- HTTP 200 · 5,876 chars of text · final URL https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits
  - Copyrights and Credits | U.S.
  - Board on Geographic Names The National Map USGS Library USGS Store Park Passes News News Releases Featured Stories Science Snippets Technical Announcements Media Contacts Connect Headquarters Locations Staff Profiles Social Media Careers Contact Us About About Us Survey Manual Key Officials Organization Congressional Budget Careers and Employees Office of Civil Rights Doing Business Emergency Mana
  - Public Domain, not all information, illustrations, or photographs on our site are.
  - Some non-USGS photographs, images, and/or graphics that appear on USGS websites are used by the USGS with permission from the copyright holder (as required by USGS policy on the use of copyrighted material ).
  - These materials are generally marked as being copyrighted.
  - To use these copyrighted materials, you must obtain permission from the copyright holder under copyright law .
  - For any content or multimedia containing USGS personnel or staff, and regardless of the license applied, their likeness, or voice, the person may have publicity rights.
  - For commercial use of that multimedia, permission may be required.
  - When using information from USGS information products, publications, or websites, we ask that proper credit be given.
  - Credit can be provided by including a citation such as the following: Credit: U.S.
  - Geological Survey/photo by Jane Doe (if the photographer/artist is known) Additional information on Acknowledging or Crediting USGS as Information Source is available.
  - links: About Us -> /about/about-us | Who We Are -> /about/about-us/who-we-are | Past Directors -> /about/about-us/past-directors | Key Officials -> /about/key-officials | Organization -> /about/organization | Science Support Offices -> /about/organization/science-support-offices | Congressional -> /about/congressional | Statements -> /about/congressional/statements | Contacts -> /about/about-us/congressional/contactss | Doing Business -> /about/doing-business | Copyrights and Credits -> /information-policies-and-instructions/copyrights-and-credits | Public Domain -> http://www.doi.gov/disclaimer.html | USGS policy on the use of copyrighted material -> /about/organization/science-support/survey-manual/use-copyrighted-material-usgs-information-products | copyright law -> http://www.copyright.gov/ | USGS Visual Identity System -> /about/organization/science-support/survey-manual/usgs-visual-identity-system

### EONET v3 docs

`https://eonet.gsfc.nasa.gov/docs/v3`

- HTTP 200 · 12,480 chars of text · final URL https://eonet.gsfc.nasa.gov/docs/v3
  - This can include &ldquo;id,&rdquo; &ldquo;title,&rdquo; &ldquo;description,&rdquo; &ldquo;link,&rdquo; open/closed status, &ldquo;date,&rdquo; &ldquo;magnitudeValue,&rdquo; &ldquo;magnitudeUnit,&rdquo; &ldquo;magnitudeDescription,&rdquo; &ldquo;categories,&rdquo; and &ldquo;sources.&rdquo; id Unique id for this event.
  - https://eonet.gsfc.nasa.gov/api/v3/events?category=severeStorms https://eonet.gsfc.nasa.gov/api/v3/events?category=severeStorms,wildfires status open | closed | all Events that have ended are assigned a closed date and the existence of that date will allow you to filter for only-open or only-closed events.
  - Omitting the status parameter will return only the currently open events (default).
  - https://eonet.gsfc.nasa.gov/api/v3/events?status=open limit &#35; Limits the number of events returned https://eonet.gsfc.nasa.gov/api/v3/events?limit=5 days &#35; Limit the number of prior days (including today) from which events will be returned.
  - https://eonet.gsfc.nasa.gov/api/v3/events?days=20 start end YYYY-MM-DD YYYY-MM-DD Select a range of dates for the events to fall between (inclusive) in a YYYY-MM-DD format.
  - https://eonet.gsfc.nasa.gov/api/v3/events?bbox=-129.02,50.73,-58.71,12.89 Example: https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&days=20&source=InciWeb&status=open Return the most recent 5 events within the past 20 days that have an InciWeb source and are open (still active events).
  - https://eonet.gsfc.nasa.gov/api/v3/events/geojson?category=severeStorms https://eonet.gsfc.nasa.gov/api/v3/events/geojson?category=severeStorms,wildfires status open | closed | all Events that have ended are assigned a closed date and the existence of that date will allow you to filter for only-open or only-closed events.
  - https://eonet.gsfc.nasa.gov/api/v3/events/geojson?status=open limit &#35; Limits the number of events returned https://eonet.gsfc.nasa.gov/api/v3/events/geojson?limit=5 days &#35; Limit the number of prior days (including today) from which events will be returned.
  - https://eonet.gsfc.nasa.gov/api/v3/events/geojson?days=20 start end YYYY-MM-DD YYYY-MM-DD Select a range of dates for the events to fall between (inclusive) in a YYYY-MM-DD format.
  - https://eonet.gsfc.nasa.gov/api/v3/events/geojson?bbox=-129.02,50.73,-58.71,12.89 Example: https://eonet.gsfc.nasa.gov/api/v3/events/geojson?limit=5&days=20&source=InciWeb&status=open Return the most recent 5 events within the past 20 days that have an InciWeb source and are open (still active events).
  - https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires?source=InciWeb https://eonet.gsfc.nasa.gov/api/v3/categories/landslides?source=InciWeb,EO status open | closed Events that have ended are assigned a closed date and the existence of that date will allow you to filter for only-open or only-closed events.
  - Omitting the status parameter will return only the currently open events.
  - https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires?status=open limit &#35; Limits the number of events returned https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires?limit=5 days &#35; Limit the number of prior days (including today) from which events will be returned.
  - https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires?days=20 start end YYYY-MM-DD YYYY-MM-DD Select a range of dates for the events to fall between (inclusive) in a YYYY-MM-DD format.
  - links: About -> https://eonet.gsfc.nasa.gov/what-is-eonet | disclaimer. -> https://eonet.gsfc.nasa.gov/what-is-eonet#disclaimer | About NASA's Mission -> https://www.nasa.gov/about/

### EONET about and disclaimer

`https://eonet.gsfc.nasa.gov/what-is-eonet`

- HTTP 200 · 1,716 chars of text · final URL https://eonet.gsfc.nasa.gov/what-is-eonet
  - links: About -> https://eonet.gsfc.nasa.gov/what-is-eonet | Web Strategy and Communications Team -> https://www.earthdata.nasa.gov/about/wsct | About NASA's Mission -> https://www.nasa.gov/about/
  - (no matching sentences; page may be rendered by JavaScript)

### GDACS terms of use

`https://www.gdacs.org/About/termofuse.aspx`

- HTTP 200 · 4,888 chars of text · final URL https://www.gdacs.org/About/termofuse.aspx
  - MENU HOME GDACS EVENTS VIRTUAL OSOCC MAPS & SATELLITE IMAGERY KNOWLEDGE ABOUT GDACS specific Disclaimer and Terms of Use: GDACS is a cooperation framework among United Nations (OCHA - Office for the Coordination of Humanitarian Affairs and UNOSAT – United Nations Satellite Center) and the European Commission (JRC - Joint Research Centre and ECHO - Directorate-General for European Civil Protection 
  - The information and data contained in GDACS is provided "as is" without warranty of any kind, either express or implied, including, but not limited to, any implied warranty against infringement of merchantability, integration, satisfactory quality and fitness for a particular purpose.
  - GThe designations employed and the presentation of material on this website do not imply the expression of any opinion on the part of the Governing Board of GDACS concerning the legal status of any country, territory, area, city or area or of its authorities, or concerning the delimitation of its frontiers or boundaries.
  - THE GDACS STAKEHOLDERS AND ADVISORY BOARD (INCLUDING BUT NOT LIMITED TO THE EUROPEAN COMMISSION, UN-OCHA AND UNOSAT) DO NOT ASSUME ANY RESPONSIBILITY OR LIABILITY WHATSOEVER WITH REGARD TO THE INFORMATION PROVIDED BY GDACS AND WILL NOT BE LIABLE FOR ANY DAMAGE, INJURY OR LOSS OF LIFE THAT MIGHT RESULT FROM THE USE OF ITS CONTENT.
  - MENU HOME GDACS EVENTS VIRTUAL OSOCC MAPS & SATELLITE IMAGERY KNOWLEDGE ABOUT Brexit content disclaimer --> cookies Disclaimer - Copyright While we try everything to ensure accuracy, this information is purely indicative and should not be used for any decision making without alternate sources of information.
  - The designations employed and the presentation of material on the map do not imply the expression of any opinion whatsoever on the part of the European Union concerning the legal status of any country, territory or area or of its authorities, or concerning the delimitation of its frontiers or boundaries.
  - links: contact us -> https://www.gdacs.org/About/contactus.aspx | term of use -> https://www.gdacs.org/About/termofuse.aspx | ABOUT -> https://www.gdacs.org/About/overview.aspx | Brexit content disclaimer -> https://ec.europa.eu/info/brexit-content-disclaimer | cookies -> https://www.gdacs.org/About/cookies.aspx | Disclaimer -> https://ec.europa.eu/info/legal-notice_en | Copyright -> https://commission.europa.eu/legal-notice_en#copyright-notice

### GDACS about

`https://www.gdacs.org/About/overview.aspx`

- HTTP 200 · 5,385 chars of text · final URL https://www.gdacs.org/About/overview.aspx
  - MENU HOME GDACS EVENTS VIRTUAL OSOCC MAPS & SATELLITE IMAGERY KNOWLEDGE ABOUT GDACS overview Partners What is GDACS?
  - During the first days after major sudden-onset disasters, the affected country and a vast number of international actors collect and analyse information in order to plan their response.
  - MENU HOME GDACS EVENTS VIRTUAL OSOCC MAPS & SATELLITE IMAGERY KNOWLEDGE ABOUT Brexit content disclaimer --> cookies Disclaimer - Copyright While we try everything to ensure accuracy, this information is purely indicative and should not be used for any decision making without alternate sources of information.
  - The designations employed and the presentation of material on the map do not imply the expression of any opinion whatsoever on the part of the European Union concerning the legal status of any country, territory or area or of its authorities, or concerning the delimitation of its frontiers or boundaries.
  - links: contact us -> https://www.gdacs.org/About/contactus.aspx | term of use -> https://www.gdacs.org/About/termofuse.aspx | ABOUT -> https://www.gdacs.org/About/overview.aspx | Brexit content disclaimer -> https://ec.europa.eu/info/brexit-content-disclaimer | cookies -> https://www.gdacs.org/About/cookies.aspx | Disclaimer -> https://ec.europa.eu/info/legal-notice_en | Copyright -> https://commission.europa.eu/legal-notice_en#copyright-notice

### GDACS feed reference

`https://www.gdacs.org/feed_reference.aspx`

- HTTP 200 · 1,452 chars of text · final URL https://www.gdacs.org/feed_reference.aspx
  - MENU HOME GDACS EVENTS VIRTUAL OSOCC MAPS & SATELLITE IMAGERY KNOWLEDGE ABOUT Introduction to GDACS: Video (format MPG, 02:41) --> Latest news Feed Reference This page contains the most popular feeds required updated every 6 minutes: All events GDACS events in the last 24 hours; GDACS events in the last week; Earthquakes Last 24 hours; Magnitude>=4.5 in the last 48 hours; Magnitude>=5.5 in the las
  - The designations employed and the presentation of material on the map do not imply the expression of any opinion whatsoever on the part of the European Union concerning the legal status of any country, territory or area or of its authorities, or concerning the delimitation of its frontiers or boundaries.
  - links: contact us -> About/contactus.aspx | term of use -> About/termofuse.aspx | ABOUT -> About/overview.aspx | Brexit content disclaimer -> https://ec.europa.eu/info/brexit-content-disclaimer | cookies -> About/cookies.aspx | Disclaimer -> https://ec.europa.eu/info/legal-notice_en | Copyright -> https://commission.europa.eu/legal-notice_en#copyright-notice

### GDACS home

`https://www.gdacs.org/`

- HTTP 200 · 5,192 chars of text · final URL https://www.gdacs.org/
  - Map of disaster alerts in the past 4 days.
  - Map produced by EC-JRC.The designations employed and the presentation of material on the map do not imply the expression of any opinion whatsoever on the part of the European Union concerning the legal status of any country, territory or area or of its authorities, or concerning the delimitation of its frontiers or boundaries.
  - The blurred events in the list below are the past events before last 4 days .
  - A new EC/ECHO daily map is now available (hide) GDACS related Apps - -> - -> --> Disaster event feeds --> Community --> MENU HOME GDACS EVENTS VIRTUAL OSOCC MAPS & SATELLITE IMAGERY KNOWLEDGE ABOUT Brexit content disclaimer --> cookies Disclaimer - Copyright The JRC is not responsible for any damage or loss resulting from the use of the information presented on this website.
  - The designations employed and the presentation of material on the map do not imply the expression of any opinion whatsoever on the part of the European Union concerning the legal status of any country, territory or area or of its authorities, or concerning the delimitation of its frontiers or boundaries.
  - links: contact us -> About/contactus.aspx | term of use -> About/termofuse.aspx | ABOUT -> About/overview.aspx | Brexit content disclaimer -> https://ec.europa.eu/info/brexit-content-disclaimer | cookies -> About/cookies.aspx | Disclaimer -> https://ec.europa.eu/info/legal-notice_en | Copyright -> https://commission.europa.eu/legal-notice_en#copyright-notice

### NHC GIS

`https://www.nhc.noaa.gov/gis/`

- HTTP 200 · 8,317 chars of text · final URL https://www.nhc.noaa.gov/gis/
  - The wind speed probabilities data also can be found through the National Digital Forecast Database (NDFD) at the following locations: Forecast Days GRIB2 Download Locations (HTTP & FTP) 1-3 http://tgftp.nws.noaa.gov/SL.us008001/ST.opnl/DF.gr2/DC.ndfd/AR.oceanic/VP.001-003/ ftp://tgftp.nws.noaa.gov/SL.us008001/ST.opnl/DF.gr2/DC.ndfd/AR.nhemi/VP.001-003/ 4+ http://tgftp.nws.noaa.gov/SL.us008001/ST.o
  - links: RSS -> /aboutrss.shtml | RSS Feeds -> /aboutrss.shtml | Alternate Formats -> /aboutalternate.shtml | Tropical Cyclone Product Descriptions -> /aboutnhcprod.shtml | Marine Product Descriptions -> /abouttafbprod.shtml | Tropical Cyclone Names -> /aboutnames.shtml | Wind Scale -> /aboutsshws.php | NHC Publications -> /aboutpubs.shtml | NHC Glossary -> /aboutgloss.shtml | National Hurricane Center -> /aboutintro.shtml | Central Pacific Hurricane Center -> /aboutcphc.php | Library -> /aboutlibrary.php | Worldwide Tropical Cyclone Centers -> /aboutrsmc.shtml | Other Tropical Cyclone Centers -> /aboutrsmc.shtml | Disclaimer -> http://www.weather.gov/disclaimer

### NHC JSON notice

`https://www.nhc.noaa.gov/aboutnhcgis.shtml`

- HTTP 404 · 3,115 chars of text · final URL https://www.nhc.noaa.gov/aboutnhcgis.shtml
  - links: RSS -> /aboutrss.shtml | RSS Feeds -> /aboutrss.shtml | Alternate Formats -> /aboutalternate.shtml | Tropical Cyclone Product Descriptions -> /aboutnhcprod.shtml | Marine Product Descriptions -> /abouttafbprod.shtml | Tropical Cyclone Names -> /aboutnames.shtml | Wind Scale -> /aboutsshws.php | NHC Publications -> /aboutpubs.shtml | NHC Glossary -> /aboutgloss.shtml | National Hurricane Center -> /aboutintro.shtml | Central Pacific Hurricane Center -> /aboutcphc.php | Library -> /aboutlibrary.php | Worldwide Tropical Cyclone Centers -> /aboutrsmc.shtml | Other Tropical Cyclone Centers -> /aboutrsmc.shtml | Disclaimer -> http://www.weather.gov/disclaimer
  - (no matching sentences; page may be rendered by JavaScript)

### NWS disclaimer

`https://www.weather.gov/disclaimer`

- HTTP 200 · 13,979 chars of text · final URL https://www.weather.gov/disclaimer
  - This server is available 24 hours a day, seven days a week .
  - NOAA Weather Radio NOAA Weather Wire EMWIN&reg; NOAAPORT National Weather Service Offices and Centers Use of NOAA/NWS Data and Products The information on National Weather Service (NWS) Web pages are in the public domain, unless specifically noted otherwise, and may be used without charge for any lawful purpose so long as you do not: 1) claim it is your own (e.g., by claiming copyright for NWS inf
  - NWS is provides such information "as is," and NWS disclaims any and all warranties, whether express or implied, including (without limitation) any implied warranties of merchantability or fitness for a particular purpose.
  - &sect; 403, third parties producing copyrighted works consisting predominantly of the material appearing in NWS Web pages must provide notice with such work(s) identifying the NWS material incorporated and stating that such material is not subject to copyright protection.
  - We have a responsibility to protect the integrity of these systems and maintain the boundary of any resource limitations.
  - We are constantly monitoring those IT limits and adjusting thresholds that define the abusive usage policy.
  - - Example: If the forecast data is updated every 6 hours you should only make requests during those cycle output windows.
  - React appropriately to return status and error codes If a Web Service isn't available users should limit the number of retries to 1 minute intervals.
  - --> Use of Third-Party Data and Products Third-party information and imagery are used under license by the individual third-party provider.
  - Content is sized and displayed based on the screen resolution and other display attributes of your device.
  - Google Earth &trade; /Google Maps&trade;/Esri ArcGIS Online Google Maps and Google Earth map information and photographic imagery are used under license by Google.
  - Esri ArcGIS Online map information and photographic imagery are used under license by Esri.
  - NOAA/National Weather Service data presented using Google Earth, Google Maps, or Esri ArcGIS Online map services are in the public domain and are also made available in open geospatial standard formats such as KML/KMZ (Google) and shapefile (Esri) among other common formats from NOAA/NWS websites.
  - Under the terms of the license, you are permitted to copy or use the Google Earth, Google Maps and/or the Esri ArcGIS Online images on your site so long as the Google Earth, Google Maps and/or Esri trade names, trademarks, service marks, logos, domain names, and other distinctive brand features are not deleted or in any manner altered.
  - Failure to comply with NWS comment policy may result in a possible bar to your participation, or a complaint to the service provider that your account has violated Terms of Service agreements Linking to Our Site The information on National Weather Service Web servers and Web sites is in the public domain, unless specifically annotated otherwise, and may be used freely by the public.
  - links: ABOUT -> https://www.weather.gov/about/ | About NWS -> https://www.weather.gov/about/ | Disclaimer -> https://www.weather.gov/disclaimer | About Us -> https://www.weather.gov/about

### Mapillary API docs

`https://www.mapillary.com/developer/api-documentation`

- HTTP 200 · 39,363 chars of text · final URL https://www.mapillary.com/developer/api-documentation
  - using a header such as Authorization: OAuth XXX , where XXX is the token obtained either through the OAuth flow that your application implements or a client token from https://mapillary.com/dashboard/developers This method works for the Entity API calls.
  - camera_type - enum, type of camera projection: "perspective", "fisheye", "equirectangular" (or equivalently "spherical") captured_at - int, capture time as a Unix timestamp in milliseconds since epoch (e.g.
  - creator - &#123; username: string, id: string &#125;, the username and user ID who owns and uploaded the image.
  - thumb_256_url - string, URL to the 256px wide thumbnail.
  - thumb_1024_url - string, URL to the 1024px wide thumbnail.
  - For example /images?sequence_ids=123,456 start_captured_at - string: filter images captured after.
  - For example: "2022-08-16T16:42:46Z" end_captured_at - string: filter images captured before.
  - all image IDs, or all detection IDs) Rate limits # There are 3 tiers of rate limits applied to different APIs/tile endpoints: Requests to entity APIs, e.g.
  - graph.mapillary.com/:image_id , are limited to 60,000 per minute per app.
  - graph.mapillary.com/images?bbox=minx,miny,maxx,maxy , are limited to 10,000 per minute per app.
  - Requests to tiles.mapillary.com are limited to 50,000 per day (not per minute).
  - Exceeding the Graph API rate limit your app will be throttled and users will receive "Application request limit reached" error.
  - Here is a response example: &#123;"error":&#123;"message":"Application request limit reached","type":"OAuthException","is_transient":true,"code":4,"error_subcode":1349210,"error_user_title":"Rate Limit Exceeded","error_user_msg":"You are hitting rate-limits on the node that you are attempting to fetch.
  - Please wait and try again later.","fbtrace_id":"A-ZiBnH0_13Dq2KIXeAkenU"&#125;&#125; Exceeding the Tile API rate limit your app will get status code 4xx.
  - Get an Access Token FAQs & Examples Live Demo On this page Authentication Vector tiles Coverage tiles Coverage tiles (computed) Map feature tiles, points Map feature tiles, traffic signs Entities Image Map feature Detection Organization Sequence Rate limits Embed images Glossary Object values ► Points ► Traffic signs ► Detections ► MUTCD Apps Android and iOS Desktop uploader Command line uploader 
  - links: About Mapillary -> https://www.mapillary.com/about | Terms of use -> https://www.mapillary.com/terms

### Mapillary terms

`https://www.mapillary.com/terms`

- HTTP 200 · 33,428 chars of text · final URL https://www.mapillary.com/terms
  - Terms of Use Mapillary Terms of Use Effective date: February 15, 2024 These Terms of Use (“Terms”) apply to your access to and use of the websites, mobile apps and other services, features, APIs, and functionality (collectively, the “Mapillary Services”) provided by Meta Platforms Ireland Limited (“Mapillary” or “we”).
  - By creating an account or otherwise using the Mapillary Services, you agree to these Terms.
  - If you do not agree to these Terms, do not use the Mapillary Services.
  - If you have any questions about these Terms or the Mapillary Services, please contact us at support&#064;mapillary.com .
  - Meta Platforms Ireland Limited Merrion Road Dublin 4 D04 X2K5 Ireland 1.
  - If you are under 18 years of age (or the age of legal majority where you live), you may use the Mapillary Services only under the supervision of a parent or legal guardian who agrees to be bound by these Terms.
  - If you use the Mapillary Services on behalf of an entity, (i) all references to “you” throughout the remainder of these Terms will include that entity, (ii) you represent that you are authorized to accept these Terms on that entity’s behalf, and (iii) in the event you or the entity violates these Terms, the entity agrees to be responsible to us.
  - Licenses The Mapillary Services, and all data and content included therein, including User Content as defined below, (collectively, “Content”) are owned by Mapillary or our licensors and are protected under relevant intellectual property laws.
  - Except as explicitly stated in these Terms, all rights in and to the Mapillary Services are reserved by us or our licensors.
  - Subject to your compliance with these Terms, you are hereby granted a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Mapillary Services (excluding User Content, which is subject to Section 3(b) below), including to install our mobile apps on a device you own or control.
  - Any use of the Mapillary Services for commercial purposes is subject to the additional terms in Section 12 below.
  - Your use of any User Content provided by other users is subject to the Creative Commons Share Alike (CC BY-SA) license , unless we indicate otherwise.
  - For instance, we may provide access to certain User Content (alone or in combination with other data sets) under a separate set of license terms (such as the Creative Commons Attribution NonCommercial Share Alike (CC BY-NC-SA license).
  - You agree to comply with the license terms that apply to any of the data sets we make available via the Mapillary Services, including User Content provided by other users.
  - Those license terms will apply to the extent of any conflict between those license terms and these Terms.
  - Except for the license you grant below, you retain all rights in and to your User Content, as between you and Mapillary.
  - Without limiting your rights and our obligations under data protection law, you grant Mapillary a nonexclusive, royalty-free, irrevocable, worldwide, fully paid, transferable and sublicensable license to use, reproduce, publish, create derivative works from, distribute, publicly perform and display your User Content, for the term of its protection by intellectual property rights, and any name, use
  - To the extent possible under applicable law, you waive any moral, neighboring or other rights you may have (including rights in the nature of attribution, integrity, privacy, paternity, and rights to object to derogatory treatment) in your User Content that would otherwise preclude us from exercising our rights under the license granted by you in this Section.
  - Prohibited Conduct and Content You represent and warrant that your User Content, and our use of such User Content as permitted by these Terms, will not violate any rights of or cause injury to any person or entity.
  - Use any Mapillary Services with any products, systems, or applications for or in connection with real-time navigation or route guidance, such as to turn-by-turn route guidance that is synchronized to the position of a sensor-enabled device, or with any systems or functions for automatic or autonomous control of vehicle or device behavior; Make any attempt to re-identify or unblur any aspect of any
  - Engage in any harassing, threatening, intimidating, predatory or stalking conduct; Use or attempt to use another user’s account; Impersonate or post on behalf or any person or entity or otherwise misrepresent your affiliation with a person or entity; Sell or resell the Mapillary Services (unless permitted under a separate writing between you and Mapillary); Copy, reproduce, distribute, publicly pe
  - You may not create, post, store or share any User Content that is confidential, violates these Terms, or for which you do not have all the rights necessary to grant us and users the license described in Section 4 above.
  - You may not create, post, store or share any User Content that: Is unlawful, libelous, defamatory, obscene, pornographic, indecent, lewd, suggestive, harassing, threatening, hateful, invasive of privacy or publicity rights, abusive, inflammatory or fraudulent; Captures images of individuals where they would have a reasonable expectation of privacy, including images of individuals in or around priv
  - We may use various procedures, measures and tools to moderate content on the Mapillary Services on the basis of these Terms, including the use of both technology and human review teams to detect, review and take action on content that is illegal or violates these Terms.
  - If we remove, block, or restrict Content for violations of these Terms, or restrict your use of the Mapillary Services in whole or in part, we will attempt to notify you of this and the reason(s) why, unless notice is not required or prohibited by applicable law.
  - Notifications Regarding Content Blurring We use technology designed to blur the faces of individuals and vehicle license plates.
  - If you observe any Content on the Mapillary Services that reveals faces, license plates, or other information that may contain personal information, use the content flagging tools in the Mapillary Services to alert us so that we may review and address the issue, as appropriate.
  - You understand that we and our affiliates may use such Feedback for any purpose, commercial or otherwise, without acknowledgment or compensation to you, including to develop, copy, publish, or improve the Feedback in our sole discretion.
  - Reports and Complaints We have reporting systems in place for users to report Content that is illegal or that goes against our Terms.
  - You may also contact support&#064;mapillary.com to notify us of any Content on the Mapillary Services that you believe is illegal or otherwise violates our Terms.
  - When submitting a notice, please provide: (i) a clear indication of the exact electronic location of the Content being reported, such as the URL; (ii) a sufficiently substantiated explanation of the reasons why the Content being reported constitutes illegal or Terms-violating Content; (iii) your name and email address; and (iv) a statement confirming your belief that the information and allegation
  - You are solely responsible for compliance with any applicable terms that govern Third-Party Content.
  - Additional Terms for Developers Certain Mapillary Services, including the Mapillary API, Mapillary vector tiles, and the MapillaryJS library, (“Developer Tools”) are tools we offer to software developers who work on building map platforms, geospatial tools, and location-based services (“Developer”).
  - Mapillary reserves the right to throttle usage, revoke client_ids, or exercise any other rights we have under these Terms if we suspect you are misusing the developer resources or if we otherwise believe necessary to protect our or any third party’s rights or interests.
  - You authorize us to monitor your use of Developer Tools to ensure compliance with these Terms.
  - You must adhere to the attribution requirements set forth below and as applicable to any User Content provided by others that you obtain.
  - If you are downloading individual images and serving them from your own servers, you must attribute the image(s) by visibly displaying the Mapillary logo and linking back to the Mapillary homepage or corresponding Mapillary image page.
  - If you integrate data that Mapillary extracts from street-level images using the Mapillary API or our vector tiles in your application, you must attribute the source of the data by visibly displaying the Mapillary logo and linking back to the Mapillary homepage.
  - Use of the Mapillary Services for Commercial Purposes If you choose to use the Mapillary Services for a commercial purpose (whether as a sole proprietor or on behalf of a legal entity), the following additional terms apply: You may use the Mapillary Services only for the following commercial purposes: (i) improvement, training, and development of products, services, maps, studies, platforms, websi
  - You will implement and maintain (i) technical safeguards and business processes that prohibit reidentification or unblurring of any Content, including any individual or license plate; and (ii) business processes to prevent inadvertent disclosure or release of any Content, and notify vendor-incident&#064;meta.com of any incident, infraction, or other activity related to the foregoing i and/or ii th
  - links: Creative Commons Share Alike (CC BY-SA) license -> http://creativecommons.org/licenses/by-sa/4.0/ | About Mapillary -> https://www.mapillary.com/about | Terms of use -> https://www.mapillary.com/terms

### Mapillary licence help

`https://help.mapillary.com/hc/en-us/articles/115001770409`

- HTTP 403 · 60 chars of text · final URL https://help.mapillary.com/hc/en-us/articles/115001770409
  - (no matching sentences; page may be rendered by JavaScript)

### Mapillary help home

`https://help.mapillary.com/hc/en-us`

- HTTP 403 · 60 chars of text · final URL https://help.mapillary.com/hc/en-us
  - (no matching sentences; page may be rendered by JavaScript)

### Mapillary attribution help

`https://help.mapillary.com/hc/en-us/search?query=attribution`

- HTTP 403 · 60 chars of text · final URL https://help.mapillary.com/hc/en-us/search?query=attribution
  - (no matching sentences; page may be rendered by JavaScript)

