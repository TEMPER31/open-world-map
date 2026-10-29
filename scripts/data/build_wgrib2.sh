#!/usr/bin/env bash
# Builds the one external tool the data job uses: NOAA's wgrib2 GRIB2 decoder, pinned to a
# release tag AND its commit hash. Minimal build (no NetCDF, no Fortran/IPOLATES, no OpenMP):
# GFS 0.25 deg uses GRIB2 template 5.3 (complex packing), which needs no optional libraries.
#   scripts/data/build_wgrib2.sh <install-prefix>
set -euo pipefail
VERSION=v3.8.0
COMMIT=986287cc4f77ed3f5f97056fd0f90d099964dba7
PREFIX=$(realpath -m "${1:?install prefix}")
SRC=$(mktemp -d)
git clone --quiet --depth 1 --branch "$VERSION" https://github.com/NOAA-EMC/wgrib2 "$SRC"
GOT=$(git -C "$SRC" rev-parse HEAD)
if [ "$GOT" != "$COMMIT" ]; then echo "wgrib2 $VERSION resolved to $GOT, expected $COMMIT" >&2; exit 1; fi
cmake -S "$SRC" -B "$SRC/build" -DCMAKE_BUILD_TYPE=Release -DUSE_TIGGE=off -DUSE_REGEX=on \
  -DBUILD_LIB=off -DBUILD_SHARED_LIB=off -DBUILD_WGRIB=off -DCMAKE_INSTALL_PREFIX="$PREFIX" > /dev/null
cmake --build "$SRC/build" -j "$(nproc)" > /dev/null
cmake --install "$SRC/build" > /dev/null
rm -rf "$SRC"
"$PREFIX/bin/wgrib2" -version
