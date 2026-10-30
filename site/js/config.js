// Open World Map: static configuration. No keys or tokens belong in this file (or any other).
// Every external host listed here is also recorded in docs/sources-register.md.

// Sample-mode timeline length. With live data the timeline runs from now to the run's f048.
export const HOURS = 48;

// Sample weather grid, used only when live data (data/live/) is unavailable.
export const SAMPLE_GRID_DEG = 1;

// ---- Basemaps -------------------------------------------------------------
// Dark and Light share one keyless vector source (OpenFreeMap, OpenMapTiles schema)
// and differ only in paint. Satellite is a stack of keyless raster sources that are
// added only while Satellite is selected and removed (tiles released) when you leave it.

export const OPENFREEMAP = {
  tilejson: 'https://tiles.openfreemap.org/planet',
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  maxzoom: 14 // OpenMapTiles planet tiles; MapLibre overzooms above this
};

const yesterdayUTC = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);

// Zoom ranges below come from each provider's published documentation and are
// UNVERIFIED: the hosts were unreachable from the build environment. See
// docs/sources-register.md for what to check against the live capabilities.
export const SATELLITE = [
  {
    id: 'sat-gibs',
    // NASA GIBS, VIIRS SNPP corrected-reflectance true colour, previous UTC day.
    // GoogleMapsCompatible_Level9 => z0-9, 256 px tiles.
    tiles: () => [`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${yesterdayUTC()}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`],
    tileSize: 256, maxzoom: 9,
    layer: { maxzoom: 7 },
    credit: 'Imagery: <a href="https://earthdata.nasa.gov/gibs">NASA GIBS</a> / ESDIS (VIIRS SNPP)'
  },
  {
    id: 'sat-eox',
    // EOX Sentinel-2 cloudless. Default is the 2016 mosaic (CC BY 4.0). The newer
    // yearly mosaics (e.g. s2cloudless-2024_3857) are CC BY-NC-SA 4.0: switch only
    // after the owner confirms the licence (docs/sources-register.md, "EOX licence").
    tiles: () => ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg'],
    tileSize: 256, maxzoom: 14,
    layer: { minzoom: 4.5, fadeIn: [5, 6.5] },
    credit: '<a href="https://s2maps.eu">Sentinel-2 cloudless</a> by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 &amp; 2017)'
  },
  {
    id: 'sat-usgs',
    // USGS The National Map, Imagery Only (mostly USDA NAIP). Restricted to the
    // contiguous US by `bounds`; Alaska, Hawaii and Puerto Rico are not enabled until
    // coverage there is checked.
    tiles: () => ['https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256, maxzoom: 16,
    bounds: [-124.85, 24.4, -66.88, 49.39],
    layer: { minzoom: 11, fadeIn: [11.5, 13] },
    credit: 'Imagery: <a href="https://www.usgs.gov/programs/national-geospatial-program/national-map">USGS The National Map</a> (USDA NAIP)'
  },
  {
    id: 'sat-naip',
    // Street zoom: the cached layer above stops at web tile level 16 (1:9,028), which is
    // map zoom 15 here (MapLibre zooms count 512 px tiles), and only blurs past it.
    // USGS NAIP Plus (USDA NAIP, 0.6 m, plus state high-resolution orthoimagery where USGS has
    // it) is a dynamic ImageServer: each 512 px tile is one exportImage request for the
    // tile's bbox (fewer, larger requests than 256 px; see docs/screenshots/satellite-zoom).
    // format=jpg, not jpgpng: jpgpng sometimes comes back as a ~270 KB PNG (JPEG is ~60 KB),
    // and in CI one such PNG had no red on one side of a source-image seam (a teal tile).
    // Keyless, CORS-enabled. The cached layer stays underneath while these load.
    tiles: () => ['https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer/exportImage?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=512,512&format=jpg&f=image'],
    tileSize: 512, maxzoom: 18,
    bounds: [-124.85, 24.4, -66.88, 49.39],
    layer: { minzoom: 15, fadeIn: [15, 15.5] },
    credit: 'Imagery: <a href="https://www.usgs.gov/programs/national-geospatial-program/national-map">USGS The National Map</a> NAIP Plus (USDA NAIP, state orthoimagery)'
  }
];

export const CREDITS = {
  vector: '<a href="https://openfreemap.org">OpenFreeMap</a> · <a href="https://openmaptiles.org">© OpenMapTiles</a> · Data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  naturalEarth: '<a href="https://www.naturalearthdata.com">Natural Earth</a>',
  sample: '<b>Weather: generated sample data</b>',
  gfs: 'Weather: <a href="https://www.nco.ncep.noaa.gov/pmb/products/gfs/">NOAA/NCEP GFS</a>',
  cams: 'Air quality: <a href="https://atmosphere.copernicus.eu/">CAMS</a> via <a href="https://open-meteo.com/">Open-Meteo.com</a> (CC BY 4.0)',
  maplibre: '<a href="https://maplibre.org">MapLibre</a>'
};
