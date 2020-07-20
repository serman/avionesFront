import * as THREE from 'three';
import {
  geoInterpolate
} from 'd3-geo';

const DEGREE_TO_RADIAN = Math.PI / 180;

export function clamp(num, min, max) {
  return num <= min ? min : (num >= max ? max : num);
}

export function coordinateToPosition(lat, lng, radius) {
  const phi = (90 - lat) * DEGREE_TO_RADIAN;
  const theta = (lng + 180) * DEGREE_TO_RADIAN;

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function getSplineFromCoords(coords) {
  const GLOBE_RADIUS = 0.5

  let CURVE_MIN_ALTITUDE = 2/100 // 20;
  let CURVE_MAX_ALTITUDE = 9/100 // 26;

  //los datos estan en formato longitud latitud
  const startLng = coords[0];
  const startLat = coords[1]; 
  const endLng = coords[2];
  const endLat = coords[3];
  

  // spline vertices
  const start = coordinateToPosition(startLat, startLng, GLOBE_RADIUS);
  const end = coordinateToPosition(endLat, endLng, GLOBE_RADIUS);
  const altitude = clamp(start.distanceTo(end) * .75, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);
  const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);
  const midCoord1 = interpolate(0.25);
  const midCoord2 = interpolate(0.75);
  const mid1 = coordinateToPosition(midCoord1[1], midCoord1[0], GLOBE_RADIUS + altitude);
  const mid2 = coordinateToPosition(midCoord2[1], midCoord2[0], GLOBE_RADIUS + altitude);

  return {
    start,
    end,
    spline: new THREE.CubicBezierCurve3(start, mid1, mid2, end)
  };
}

export function getCatmullFromCoords(coords) {
  const GLOBE_RADIUS = 100.5

  let CURVE_MIN_ALTITUDE = 0.1 // 20;
  let CURVE_MAX_ALTITUDE = 0.8 // 26;
  //datos vienen en formato longitud latitud

  const startLng = coords[0];
  const startLat = coords[1];
    const endLng = coords[2];
  const endLat = coords[3];
  

  // spline vertices

//
  const start = coordinateToPosition(startLat, startLng, GLOBE_RADIUS);
  const end = coordinateToPosition(endLat, endLng, GLOBE_RADIUS);
  const altitude = clamp(start.distanceTo(end) * .75, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE);
  const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);
  const midCoord1 = interpolate(0.25);
  const midCoord2 = interpolate(0.75);
  const mid1 = coordinateToPosition(midCoord1[1], midCoord1[0], GLOBE_RADIUS);
  const mid2 = coordinateToPosition(midCoord2[1], midCoord2[0], GLOBE_RADIUS);
  let midCoords = []
  let mid = []
  mid.push(start)
  for (let ii = 0.1; ii <= 0.9; ii += 0.1) {
    let interpol = interpolate(ii)
    midCoords.push(interpol)
    mid.push(coordinateToPosition(interpol[1], interpol[0], GLOBE_RADIUS))
  }
  mid.push(end)

  return {
    start,
    end,
    spline: new THREE.CatmullRomCurve3(mid, false)
  };
}

var perlin;
var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;
var perlin_octaves = 4; // default to medium smooth
var perlin_amp_falloff = 0.5; // 50% reduction/octave

var scaled_cosine = function (i) {
  return 0.5 * (1.0 - Math.cos(i * Math.PI));
};

export function noise(x, y, z) {
  y = y || 0;
  z = z || 0;

  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (z < 0) {
    z = -z;
  }

  var xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  var xf = x - xi;
  var yf = y - yi;
  var zf = z - zi;
  var rxf, ryf;

  var r = 0;
  var ampl = 0.5;

  var n1, n2, n3;

  for (var o = 0; o < perlin_octaves; o++) {
    var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[ of & PERLIN_SIZE];
    n1 += rxf * (perlin[( of +1) & PERLIN_SIZE] - n1);
    n2 = perlin[( of +PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[( of +PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[ of & PERLIN_SIZE];
    n2 += rxf * (perlin[( of +1) & PERLIN_SIZE] - n2);
    n3 = perlin[( of +PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[( of +PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
}

export function calcPosFromLatLonRad(lat, lon, radius) {
  let x, y, z = 0

  var phi = (90 - lat) * (Math.PI / 180)
  var theta = (lon + 180) * (Math.PI / 180)

  x = -((radius) * Math.sin(phi) * Math.cos(theta))
  z = ((radius) * Math.sin(phi) * Math.sin(theta))
  y = ((radius) * Math.cos(phi))

  return [x, y, z]
}
