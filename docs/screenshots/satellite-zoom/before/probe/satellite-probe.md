# Satellite zoom probe

Generated 2026-10-30T21:13:49.724Z by `scripts/data/satellite-probe.mjs` (GitHub Actions runner). Point: Brantley, AL (31.585, -86.255). Ground size of one screen pixel there: z16 2.03 m, z17 1.02 m, z18 0.51 m.

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
| USGSImageryOnly | 200 image/jpeg 17289 B 268 ms  | * | 400 no | no | — | none |
| USGSImageryTopo | 200 image/jpeg 17635 B 297 ms  | * | 400 no | no | — | none |
| USGSNAIPImagery | 200 image/jpeg 15378 B 1370 ms  | * | 400 no | no | — | none |
| USGSNAIPPlus | 200 image/jpeg 15378 B 581 ms  | * | 400 no | no | — | none |

## Load time for one 1280×800 screen at Brantley (256 px requests, 6 at a time; plus one 1280×800 export)

| Service | Zoom | m/pixel | Mode | Requests (ok) | Total | Median / max per request | KB | One export |
|---|---|---|---|---|---|---|---|---|
| USGSImageryOnly | 16 | 2.03 | cached tiles | 24 (24) | 52 ms | 10 / 21 ms | 692 | 839 ms |
| USGSImageryOnly | 17 | 1.02 | cached tiles | 24 (0) | 756 ms | null / null ms | 0 | 728 ms |
| USGSImageryOnly | 18 | 0.51 | cached tiles | 30 (0) | 970 ms | null / null ms | 0 | 721 ms |
| USGSImageryTopo | 16 | 2.03 | cached tiles | 24 (24) | 835 ms | 205 / 225 ms | 728 | 782 ms |
| USGSImageryTopo | 17 | 1.02 | cached tiles | 24 (0) | 798 ms | null / null ms | 0 | 841 ms |
| USGSImageryTopo | 18 | 0.51 | cached tiles | 30 (0) | 982 ms | null / null ms | 0 | 836 ms |
| USGSNAIPImagery | 16 | 2.03 | export per tile | 24 (24) | 5842 ms | 977 / 3802 ms | 392 | 2385 ms |
| USGSNAIPImagery | 17 | 1.02 | export per tile | 24 (24) | 4258 ms | 740 / 1805 ms | 379 | 925 ms |
| USGSNAIPImagery | 18 | 0.51 | export per tile | 30 (30) | 4181 ms | 635 / 2764 ms | 376 | 654 ms |
| USGSNAIPPlus | 16 | 2.03 | export per tile | 24 (24) | 18504 ms | 943 / 9553 ms | 392 | 974 ms |
| USGSNAIPPlus | 17 | 1.02 | export per tile | 24 (24) | 6581 ms | 743 / 4362 ms | 440 | 5298 ms |
| USGSNAIPPlus | 18 | 0.51 | export per tile | 30 (30) | 7540 ms | 584 / 4784 ms | 376 | 860 ms |

## Image detail by zoom (512×512 export at Brantley)

Mean absolute difference between neighbouring pixels. While the source is sharper than the request, detail stays roughly level or rises; once requests are finer than the source, it roughly halves with each zoom level (the image is only being upscaled).

| Service | z15 (4.07 m) | z16 (2.03 m) | z17 (1.02 m) | z18 (0.51 m) | z19 (0.25 m) | z20 (0.13 m) |
|---|---|---|---|---|---|---|
| USGSImageryOnly | 12.63 | 12 | 6.51 | 3.89 | 2.9 | 2.54 |
| USGSImageryTopo | 12.39 | 15.76 | 7.23 | 4.33 | 3.46 | 2.91 |
| USGSNAIPImagery | 12.68 | 12.29 | 8.68 | 5.58 | 2.8 | 1.46 |
| USGSNAIPPlus | 12.68 | 12.28 | 8.02 | 5.58 | 2.8 | 1.46 |

## Handover at z16: cached tile vs export of the same tile (colour = mean RGB)

- USGSImageryOnly cached tile 16/17065/26702: mean RGB 137, 136, 114, detail 17.45
- USGSImageryTopo export of the same tile: mean RGB 137, 136, 114, detail 13.34
- USGSNAIPImagery export of the same tile: mean RGB 142, 152, 115, detail 12.9
- USGSNAIPPlus export of the same tile: mean RGB 142, 152, 115, detail 12.9

## Metadata at the point (identify)

- **USGSImageryOnly** (HTTP 200): ```[{"layer":"Layers","RGB.Red":"NoData","RGB.Green":"NoData","RGB.Blue":"NoData"}]```
- **USGSImageryTopo** (HTTP 200): ```[{"layer":"USGSImageryTopo","RGB.Red":"180","RGB.Green":"179","RGB.Blue":"177","RGB.Alpha":"255"}]```
- **USGSNAIPImagery** (HTTP 200): ```[{"OBJECTID":658,"Name":"m_3108630_ne_16_060_20230528","MinPS":0,"MaxPS":19.1,"Category":1,"CenterX":-9604782.082959171,"CenterY":3710101.071590861,"State":"AL","Year":2023,"raster_name":"m_3108630_ne_16_060_20230528","download_url":"https://earthexplorer.usgs.gov/download/options/naip/3339685","acquisition_date":1685232000000,"agency":"USDA","vendor":"USDA-FSA-APFO","resolution_value":0.6,"resolution_units":"METER","band_count":4,"sensor_type":"CNIR","projection_name":"UTM","projection_zone":"16N","datum":"NAD83"},{"OBJECTID":3559,"Name":"Ov_i02_L01_R0000015B_C0000006A.tif","MinPS":19.1,"MaxPS":38.19999999999892,"Category":2,"CenterX":-9622642.9617,"CenterY":3741760.963299997,"State":"AL","Year":2023,"raster_name":null,"download_url":null,"acquisition_date":null,"agency":null,"vendor":null,"resolution_value":null,"resolution_units":null,"band_count":null,"sensor_type":null,"projection_name":null,"projection_zone":null,"datum":null},{"OBJECTID":3581,"Name":"Ov_i02_L02_R000000AD_C00000035.tif","MinPS":38.1999999999989,"MaxPS":76.39999999999844,"Category":2,"CenterX":-9573863.264073875,"CenterY":3711333.830113428,"State":"AL","Year":2023,"raster_name":null,"download_url":null,"acquisition_date":null,"agency":null,"vendor":null,"resolution_value":null,"resolution_units":null,"band_count":null,"sensor_type":null,"projection_name":null,"projection_zone":null,"datum":null},{"OBJECTID":3588,"Name":"Ov_i02_L03_R00000056_C0000001A.tif","MinPS":76.3999999999984,"MaxPS":152.8,"Category"```
- **USGSNAIPPlus** (HTTP 200): ```[{"OBJECTID":739,"Name":"m_3108630_ne_16_060_20230528","MinPS":0,"MaxPS":19.1,"Category":1,"CenterX":-9604782.082959171,"CenterY":3710101.071590861,"State":"AL","Year":2023,"raster_name":"m_3108630_ne_16_060_20230528","download_url":"https://earthexplorer.usgs.gov/download/options/naip/3339685","acquisition_date":1685232000000,"agency":"USDA","vendor":"USDA-FSA-APFO","resolution_value":0.6,"resolution_units":"METER","band_count":4,"sensor_type":"CNIR","projection_name":"UTM","projection_zone":"16N","datum":"NAD83"},{"OBJECTID":3640,"Name":"Ov_i02_L01_R0000015B_C0000006A.tif","MinPS":19.1,"MaxPS":38.19999999999892,"Category":2,"CenterX":-9622642.9617,"CenterY":3741760.963299997,"State":"AL","Year":2023,"raster_name":null,"download_url":null,"acquisition_date":null,"agency":null,"vendor":null,"resolution_value":null,"resolution_units":null,"band_count":null,"sensor_type":null,"projection_name":null,"projection_zone":null,"datum":null},{"OBJECTID":3662,"Name":"Ov_i02_L02_R000000AD_C00000035.tif","MinPS":38.1999999999989,"MaxPS":76.39999999999844,"Category":2,"CenterX":-9573863.264073875,"CenterY":3711333.830113428,"State":"AL","Year":2023,"raster_name":null,"download_url":null,"acquisition_date":null,"agency":null,"vendor":null,"resolution_value":null,"resolution_units":null,"band_count":null,"sensor_type":null,"projection_name":null,"projection_zone":null,"datum":null},{"OBJECTID":3669,"Name":"Ov_i02_L03_R00000056_C0000001A.tif","MinPS":76.3999999999984,"MaxPS":152.8,"Category"```

## MapLibre 5.24.0 drawing the endpoint as raster tiles ({bbox-epsg-3857}, z17)

| Service | Kind | Idle after | All tiles loaded | Errors |
|---|---|---|---|---|
| USGSImageryOnly | export | 833 ms | yes | none |
| USGSImageryTopo | export | 770 ms | yes | none |
| USGSNAIPImagery | export | 2778 ms | yes | none |
| USGSNAIPPlus | export | 6967 ms | yes | none |
