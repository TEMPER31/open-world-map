# Satellite zoom probe

Generated 2026-10-30T22:38:18.184Z by `scripts/data/satellite-probe.mjs` (GitHub Actions runner). Point: Brantley, AL (31.585, -86.255). **Zooms are the site's map zooms** (MapLibre, 512 px tiles): map zoom z uses 256 px web tiles of level z + 1, so the cached USGS layer (levels ≤ 16) is sharp up to map zoom 15. Ground size of one screen pixel at Brantley: z15 2.03 m, z16 1.02 m, z17 0.51 m, z18 0.25 m.

## Services directory

- https://basemap.nationalmap.gov/arcgis/rest/services: HTTP 200 — USGSHydroCached/MapServer, USGSImageryOnly/MapServer, USGSImageryTopo/MapServer, USGSShadedReliefOnly/MapServer, USGSTopo/MapServer; folders: Utilities
- https://imagery.nationalmap.gov/arcgis/rest/services: HTTP 200 — USGSNAIPImagery/ImageServer, USGSNAIPPlus/ImageServer; folders: Utilities

## Imagery services

| Service | Type | Keyless | Cached (max level) | Export | Formats | Max image | Pixel size | Max scale |
|---|---|---|---|---|---|---|---|---|
| USGSImageryOnly | MapServer | yes | yes (23) | yes | PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,BMP | 4096×4096 | — | 9027.977411 |
| USGSImageryTopo | MapServer | yes | yes (23) | yes | PNG32,PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,BMP | 4096×4096 | — | 9027.977411 |
| USGSNAIPImagery | ImageServer | yes | no | yes | — | 4000×4000 | 0.300 × 0.300 (3857) | 0 |
| USGSNAIPPlus | ImageServer | yes | no | yes | — | 4000×4000 | 0.300 × 0.300 (3857) | 0 |

**USGSImageryOnly**: USGS Imagery Only is a tile cache base map service of orthoimagery in The National Map visible to the 1:9,028 zoom scale. Orthoimagery data are typically high resolution aerial images that combine the visual attributes of an aerial photograph with the spatial accuracy and reliability of a planimetric map. USGS digital orthoimage resolution may vary from 6 inches to 1 meter. In the former resolution, every pixel in an orthoimage covers a six inch square of the earth's surface, while in the latter resolution, one meter square is represented by each pixel. Blue Marble: Next Generation and Landsat Copyright: USDA, USGS The National Map: Orthoimagery. Data refreshed June, 2024.v1.2 Layers: 0:Layers

**USGSImageryTopo**: USGS Imagery Topo is a tile cache base map of orthoimagery in The National Map and US Topo vector data visible to the 1:9,028 scale. Orthoimagery data are typically high resolution images that combine the visual attributes of an aerial photograph with the spatial accuracy and reliability of a planimetric map. USGS digital orthoimage resolution may vary from 6 inches to 1 meter. In the former resolution, every pixel in an orthoimage covers a six inch square of the earth's surface, while in the latter resolution, one meter square is represented by each pixel. Blue Marble: Next Generation source  Copyright: USGS The National Map: Orthoimagery and US Topo. Data refreshed April, 2026.v1.2. Layers: 0:USGSImageryTopo

**USGSNAIPImagery**: The USGS NAIP Imagery service from The National Map (TNM) consists of high resolution aerial images that combine the visual attributes of an aerial photograph with the spatial accuracy and reliability of a map. The USGS NAIP Imagery service is a mosaic primarily of 0.6 meter resolution 4-band imagery presented in natural color. This service also supports the use of templates that can be used to dynamically generate 'false color', also known as color-infrared (CIR), and Normalized Difference Vegetation Index (NDVI) views of the data. USGS relies on a partnership with the U.S. Department of Agri Copyright: USGS, USDA, The National Map: Orthoimagery. January 09, 2025.

**USGSNAIPPlus**: The USGS NAIP Plus service from The National Map consists of National Agriculture Imagery Program (NAIP) and high resolution orthoimagery (HRO) that combine the visual attributes of an aerial photograph with the spatial accuracy and reliability of a map. Digital orthoimage resolution may vary from 6 inches to 1 meter. In the former resolution, every pixel in an orthoimage covers a six inch square of the earth’s surface, while in the latter resolution, each pixel represents a one meter square. Many states contribute orthoimagery to The National Map, and the USGS also relies on a partnership wit Copyright: USGS, USDA, The National Map: Orthoimagery. March 12, 2025.

## Export, WMS and CORS (one 256 px image at z17, request sent with Origin: https://temper31.github.io)

| Service | Export | Export CORS | WMS caps | WMS EPSG:3857 | WMS GetMap | WMS CORS |
|---|---|---|---|---|---|---|
| USGSImageryOnly | 200 image/jpeg 10983 B 293 ms  | * | 400 no | no | — | none |
| USGSImageryTopo | 200 image/jpeg 12206 B 269 ms  | * | 400 no | no | — | none |
| USGSNAIPImagery | 200 image/jpeg 12306 B 44 ms  | * | 400 no | no | — | none |
| USGSNAIPPlus | 200 image/jpeg 12301 B 12 ms  | * | 400 no | no | — | none |

## Load time for one 1280×800 screen at Brantley (256 px requests, 6 at a time; plus one 1280×800 export)

| Service | Zoom | m/pixel | Mode | Requests (ok) | Total | Median / max per request | KB | One export |
|---|---|---|---|---|---|---|---|---|
| USGSImageryOnly | 16 | 1.02 | cached tiles (level 17) | 24 (0) | 916 ms | null / null ms | 0 | 713 ms |
| USGSImageryOnly | 17 | 0.51 | cached tiles (level 18) | 30 (0) | 1119 ms | null / null ms | 0 | 771 ms |
| USGSImageryOnly | 18 | 0.25 | cached tiles (level 19) | 24 (0) | 906 ms | null / null ms | 0 | 635 ms |
| USGSImageryTopo | 16 | 1.02 | cached tiles (level 17) | 24 (0) | 900 ms | null / null ms | 0 | 757 ms |
| USGSImageryTopo | 17 | 0.51 | cached tiles (level 18) | 30 (0) | 1100 ms | null / null ms | 0 | 791 ms |
| USGSImageryTopo | 18 | 0.25 | cached tiles (level 19) | 24 (0) | 932 ms | null / null ms | 0 | 654 ms |
| USGSNAIPImagery | 16 | 1.02 | export per tile | 24 (24) | 93 ms | 16 / 49 ms | 379 | 32 ms |
| USGSNAIPImagery | 17 | 0.51 | export per tile | 30 (30) | 74 ms | 15 / 16 ms | 376 | 15 ms |
| USGSNAIPImagery | 18 | 0.25 | export per tile | 24 (24) | 64 ms | 14 / 43 ms | 219 | 14 ms |
| USGSNAIPPlus | 16 | 1.02 | export per tile | 24 (24) | 96 ms | 15 / 52 ms | 530 | 18 ms |
| USGSNAIPPlus | 17 | 0.51 | export per tile | 30 (30) | 83 ms | 14 / 40 ms | 376 | 15 ms |
| USGSNAIPPlus | 18 | 0.25 | export per tile | 24 (24) | 59 ms | 14 / 16 ms | 219 | 14 ms |

## Image detail by zoom (512×512 export at Brantley)

Mean absolute difference between neighbouring pixels. While the source is sharper than the request, detail stays roughly level or rises; once requests are finer than the source, it roughly halves with each zoom level (the image is only being upscaled).

| Service | z14 (4.07 m) | z15 (2.03 m) | z16 (1.02 m) | z17 (0.51 m) | z18 (0.25 m) | z19 (0.13 m) |
|---|---|---|---|---|---|---|
| USGSImageryOnly | 12.63 | 12 | 6.51 | 3.89 | 2.9 | 2.54 |
| USGSImageryTopo | 12.39 | 15.76 | 7.23 | 4.33 | 3.46 | 2.91 |
| USGSNAIPImagery | 12.68 | 12.29 | 8.68 | 5.58 | 2.8 | 1.46 |
| USGSNAIPPlus | 12.68 | 12.28 | 8.68 | 5.58 | 2.8 | 1.46 |

## Handover: last cached tile (level 16) vs an export of the same area (colour = mean RGB)

- USGSImageryOnly cached tile 16/17065/26702: mean RGB 137, 136, 114, detail 17.45
- USGSImageryTopo export of the same tile: mean RGB 137, 136, 114, detail 13.34
- USGSNAIPImagery export of the same tile: mean RGB 142, 152, 115, detail 12.9
- USGSNAIPPlus export of the same tile: mean RGB 142, 152, 115, detail 12.9

## Metadata at the point (identify)

- **USGSImageryOnly** (HTTP 200): ```[{"layer":"Layers","RGB.Red":"NoData","RGB.Green":"NoData","RGB.Blue":"NoData"}]```
- **USGSImageryTopo** (HTTP 200): ```[{"layer":"USGSImageryTopo","RGB.Red":"180","RGB.Green":"179","RGB.Blue":"177","RGB.Alpha":"255"}]```
- **USGSNAIPImagery** (HTTP 200): ```[{"OBJECTID":658,"Name":"m_3108630_ne_16_060_20230528","MinPS":0,"MaxPS":19.1,"Category":1,"CenterX":-9604782.082959171,"CenterY":3710101.071590861,"State":"AL","Year":2023,"raster_name":"m_3108630_ne_16_060_20230528","download_url":"https://earthexplorer.usgs.gov/download/options/naip/3339685","acquisition_date":1685232000000,"agency":"USDA","vendor":"USDA-FSA-APFO","resolution_value":0.6,"resolution_units":"METER","band_count":4,"sensor_type":"CNIR","projection_name":"UTM","projection_zone":"16N","datum":"NAD83"},{"OBJECTID":3559,"Name":"Ov_i02_L01_R0000015B_C0000006A.tif","MinPS":19.1,"MaxPS":38.19999999999892,"Category":2,"CenterX":-9622642.9617,"CenterY":3741760.963299997,"State":"AL","Year":2023,"raster_name":null,"download_url":null,"acquisition_date":null,"agency":null,"vendor":null,"resolution_value":null,"resolution_units":null,"band_count":null,"sensor_type":null,"projection_name":null,"projection_zone":null,"datum":null},{"OBJECTID":3581,"Name":"Ov_i02_L02_R000000AD_C00000035.tif","MinPS":38.1999999999989,"MaxPS":76.39999999999844,"Category":2,"CenterX":-9573863.264073875,"CenterY":3711333.830113428,"State":"AL","Year":2023,"raster_name":null,"download_url":null,"acquisition_date":null,"agency":null,"vendor":null,"resolution_value":null,"resolution_units":null,"band_count":null,"sensor_type":null,"projection_name":null,"projection_zone":null,"datum":null},{"OBJECTID":3588,"Name":"Ov_i02_L03_R00000056_C0000001A.tif","MinPS":76.3999999999984,"MaxPS":152.8,"Category"```
- **USGSNAIPPlus** (HTTP 200): ```[{"OBJECTID":739,"Name":"m_3108630_ne_16_060_20230528","MinPS":0,"MaxPS":19.1,"Category":1,"CenterX":-9604782.082959171,"CenterY":3710101.071590861,"State":"AL","Year":2023,"raster_name":"m_3108630_ne_16_060_20230528","download_url":"https://earthexplorer.usgs.gov/download/options/naip/3339685","acquisition_date":1685232000000,"agency":"USDA","vendor":"USDA-FSA-APFO","resolution_value":0.6,"resolution_units":"METER","band_count":4,"sensor_type":"CNIR","projection_name":"UTM","projection_zone":"16N","datum":"NAD83"},{"OBJECTID":3640,"Name":"Ov_i02_L01_R0000015B_C0000006A.tif","MinPS":19.1,"MaxPS":38.19999999999892,"Category":2,"CenterX":-9622642.9617,"CenterY":3741760.963299997,"State":"AL","Year":2023,"raster_name":null,"download_url":null,"acquisition_date":null,"agency":null,"vendor":null,"resolution_value":null,"resolution_units":null,"band_count":null,"sensor_type":null,"projection_name":null,"projection_zone":null,"datum":null},{"OBJECTID":3662,"Name":"Ov_i02_L02_R000000AD_C00000035.tif","MinPS":38.1999999999989,"MaxPS":76.39999999999844,"Category":2,"CenterX":-9573863.264073875,"CenterY":3711333.830113428,"State":"AL","Year":2023,"raster_name":null,"download_url":null,"acquisition_date":null,"agency":null,"vendor":null,"resolution_value":null,"resolution_units":null,"band_count":null,"sensor_type":null,"projection_name":null,"projection_zone":null,"datum":null},{"OBJECTID":3669,"Name":"Ov_i02_L03_R00000056_C0000001A.tif","MinPS":76.3999999999984,"MaxPS":152.8,"Category"```

## Source images around the point (5 × 5 identify grid, about 4.8 km across)

- **USGSNAIPImagery**: m_3108630_ne_16_060_20230528 (2023-05-28, 0.6 m, USDA; 15 of 25 points); m_3108631_nw_16_060_20230528 (2023-05-28, 0.6 m, USDA; 10 of 25 points)
- **USGSNAIPPlus**: m_3108630_ne_16_060_20230528 (2023-05-28, 0.6 m, USDA; 15 of 25 points); m_3108631_nw_16_060_20230528 (2023-05-28, 0.6 m, USDA; 10 of 25 points)

## Spot check: teal strip near 31.588 N, 86.258 W

Export of the strip area (86.272–86.244 W, 31.5865–31.5895 N, 1400×180 px, about 1.9 m/px) straight from each service; images saved as `spot-<service>.png`.

- **USGSImageryOnly**: HTTP 200, saved
- **USGSImageryTopo**: HTTP 200, saved
- **USGSNAIPImagery**: HTTP 200, saved; pixel value at the point: 76, 87, 80, 115; source images: m_3108630_ne_16_060_20230528 (2023-05-28)
- **USGSNAIPPlus**: HTTP 200, saved; pixel value at the point: 76, 87, 80, 115; source images: m_3108630_ne_16_060_20230528 (2023-05-28)

## Tile colour check (NAIP Plus, 3 × 3 tiles of 512 px at map zoom 16, 3 rounds)

| Variant | Responses | Teal / off-colour | Partly transparent | Types | Mean KB |
|---|---|---|---|---|---|
| layer (jpgpng) | 27 | 0 | 0 | image/jpeg ×24, image/png ×3 | 87 |
| jpgpng + bandIds=0,1,2 | 27 | 0 | 0 | image/jpeg ×24, image/png ×3 | 87 |
| jpg + bandIds=0,1,2 | 27 | 0 | 0 | image/jpeg ×27 | 60 |
| png | 27 | 0 | 0 | image/png ×27 | 282 |

## Format variants on two tiles (NAIP Plus, map zoom 16, full-precision bbox)

teal-seam: the tile that drew teal in the page; miami-coast: half sea. Pixel shares: transparent / black / white / teal (red under half of green and blue).

| Tile | Variant | HTTP | Type | KB | Mean RGBA | Transparent % | Black % | White % | Teal % | File |
|---|---|---|---|---|---|---|---|---|---|---|
| teal-seam 16/17064/26702 | jpgpng | 200 | image/jpeg | 57 | 142, 148, 112, 255 | 0 | 0 | 0 | 0 | variant-teal-seam-0.jpg |
| teal-seam 16/17064/26702 | jpgpng+bands | 200 | image/jpeg | 57 | 142, 148, 112, 255 | 0 | 0 | 0 | 0 | variant-teal-seam-1.jpg |
| teal-seam 16/17064/26702 | jpg | 200 | image/jpeg | 57 | 142, 148, 112, 255 | 0 | 0 | 0 | 0 | variant-teal-seam-2.jpg |
| teal-seam 16/17064/26702 | jpg+bands | 200 | image/jpeg | 57 | 142, 148, 112, 255 | 0 | 0 | 0 | 0 | variant-teal-seam-3.jpg |
| teal-seam 16/17064/26702 | png | 200 | image/png | 276 | 142, 148, 112, 255 | 0 | 0 | 0 | 0 | variant-teal-seam-4.png |
| teal-seam 16/17064/26702 | png+bands | 200 | image/png | 276 | 142, 148, 112, 255 | 0 | 0 | 0 | 0 | variant-teal-seam-5.png |
| miami-coast 16/18181/27905 | jpgpng | 200 | image/jpeg | 36 | 90, 159, 160, 255 | 0 | 0 | 0 | 53 | variant-miami-coast-6.jpg |
| miami-coast 16/18181/27905 | jpgpng+bands | 200 | image/jpeg | 36 | 90, 159, 160, 255 | 0 | 0 | 0 | 53 | variant-miami-coast-7.jpg |
| miami-coast 16/18181/27905 | jpg | 200 | image/jpeg | 36 | 90, 159, 160, 255 | 0 | 0 | 0 | 53 | variant-miami-coast-8.jpg |
| miami-coast 16/18181/27905 | jpg+bands | 200 | image/jpeg | 36 | 90, 159, 160, 255 | 0 | 0 | 0 | 53 | variant-miami-coast-9.jpg |
| miami-coast 16/18181/27905 | png | 200 | image/png | 230 | 89, 159, 160, 255 | 0 | 0 | 0 | 53.2 | variant-miami-coast-10.png |
| miami-coast 16/18181/27905 | png+bands | 200 | image/png | 230 | 89, 159, 160, 255 | 0 | 0 | 0 | 53.2 | variant-miami-coast-11.png |
| offshore-20km 16/18217/27905 | jpgpng | 200 | image/png | 1 | 0, 0, 0, 0 | 100 | 0 | 0 | 0 | variant-offshore-20km-12.png |
| offshore-20km 16/18217/27905 | jpgpng+bands | 200 | image/png | 1 | 0, 0, 0, 0 | 100 | 0 | 0 | 0 | variant-offshore-20km-13.png |
| offshore-20km 16/18217/27905 | jpg | 200 | image/jpeg | 5 | 0, 0, 0, 255 | 0 | 100 | 0 | 0 | variant-offshore-20km-14.jpg |
| offshore-20km 16/18217/27905 | jpg+bands | 200 | image/jpeg | 5 | 0, 0, 0, 255 | 0 | 100 | 0 | 0 | variant-offshore-20km-15.jpg |
| offshore-20km 16/18217/27905 | png | 200 | image/png | 2 | 0, 0, 0, 0 | 100 | 0 | 0 | 0 | variant-offshore-20km-16.png |
| offshore-20km 16/18217/27905 | png+bands | 200 | image/png | 2 | 0, 0, 0, 0 | 100 | 0 | 0 | 0 | variant-offshore-20km-17.png |

## Full 1280×800 screen in MapLibre (until idle, fresh cache each run)

| Service | Zoom | Request size | Requests | Runs (ms) | Median |
|---|---|---|---|---|---|
| USGSNAIPImagery | 17 | 256 px | 30 | 543, 550, 515 | 543 ms |
| USGSNAIPImagery | 17 | 512 px | 9 | 473, 459, 447 | 459 ms |
| USGSNAIPImagery | 18 | 256 px | 24 | 520, 499, 504 | 504 ms |
| USGSNAIPImagery | 18 | 512 px | 12 | 472, 479, 466 | 472 ms |
| USGSNAIPPlus | 17 | 256 px | 30 | 521, 522, 543 | 522 ms |
| USGSNAIPPlus | 17 | 512 px | 9 | 476, 461, 467 | 467 ms |
| USGSNAIPPlus | 18 | 256 px | 24 | 498, 514, 488 | 498 ms |
| USGSNAIPPlus | 18 | 512 px | 12 | 472, 450, 492 | 472 ms |

## MapLibre 5.24.0 drawing the endpoint as raster tiles ({bbox-epsg-3857}, z17)

| Service | Kind | Idle after | All tiles loaded | Errors |
|---|---|---|---|---|
| USGSImageryOnly | export | 893 ms | yes | none |
| USGSImageryTopo | export | 807 ms | yes | none |
| USGSNAIPImagery | export | 428 ms | yes | none |
| USGSNAIPPlus | export | 433 ms | yes | none |
