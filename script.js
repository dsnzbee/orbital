/* ============================================================
   StarTracker — script.js
   Requires: astronomy.browser.js loaded before this file.
   ============================================================ */
"use strict";

if (typeof Astronomy === "undefined") {
  throw new Error("Astronomy Engine is not loaded. Add astronomy.browser.js before script.js.");
}

// ============================================================
// Settings
// ============================================================
const USE_GEOLOCATION = false;
const DEMO_LOCATION = {
  latitude:  28.6139,   // New Delhi (change to your city)
  longitude: 77.2090,
  elevationMeters: 216
};

const MAX_FOV_DEG = 160;

// Optional external catalogs — override from outside if needed.
const STAR_CATALOG = Array.isArray(window.STAR_CATALOG)
  ? window.STAR_CATALOG
  : [
      { name: "Sirius",      raHours:  6.7525, decDeg: -16.7161, mag: -1.46, color: "#cce4ff" },
      { name: "Canopus",     raHours:  6.3992, decDeg: -52.6957, mag: -0.74, color: "#fff5e0" },
      { name: "Arcturus",    raHours: 14.2610, decDeg:  19.1825, mag: -0.05, color: "#ffd580" },
      { name: "Vega",        raHours: 18.6156, decDeg:  38.7837, mag:  0.03, color: "#d4eeff" },
      { name: "Capella",     raHours:  5.2782, decDeg:  45.9979, mag:  0.08, color: "#ffe8a0" },
      { name: "Rigel",       raHours:  5.2423, decDeg:  -8.2016, mag:  0.13, color: "#c8dfff" },
      { name: "Betelgeuse",  raHours:  5.9195, decDeg:   7.4071, mag:  0.42, color: "#ffb870" },
      { name: "Procyon",     raHours:  7.6550, decDeg:   5.2250, mag:  0.38, color: "#fff0d0" },
      { name: "Altair",      raHours: 19.8464, decDeg:   8.8683, mag:  0.77, color: "#e8f8ff" },
      { name: "Aldebaran",   raHours:  4.5987, decDeg:  16.5093, mag:  0.85, color: "#ff9040" },
      { name: "Antares",     raHours: 16.4901, decDeg: -26.4320, mag:  1.09, color: "#ff7050" },
      { name: "Spica",       raHours: 13.4199, decDeg: -11.1613, mag:  1.04, color: "#b8d8ff" },
      { name: "Pollux",      raHours:  7.7553, decDeg:  28.0262, mag:  1.14, color: "#ffd090" },
      { name: "Fomalhaut",   raHours: 22.9609, decDeg: -29.6223, mag:  1.16, color: "#ddf0ff" },
      { name: "Deneb",       raHours: 20.6905, decDeg:  45.2803, mag:  1.25, color: "#e8f0ff" },
      { name: "Mimosa",      raHours: 12.7953, decDeg: -59.6888, mag:  1.25, color: "#b0ccff" },
      { name: "Regulus",     raHours: 10.1395, decDeg:  11.9672, mag:  1.40, color: "#c8dcff" },
      { name: "Adhara",      raHours:  6.9771, decDeg: -28.9722, mag:  1.50, color: "#b8d0ff" },
      { name: "Castor",      raHours:  7.5766, decDeg:  31.8883, mag:  1.58, color: "#f0f8ff" },
      { name: "Gacrux",      raHours: 12.5194, decDeg: -57.1132, mag:  1.59, color: "#ff8060" },
      { name: "Shaula",      raHours: 17.5601, decDeg: -37.1038, mag:  1.62, color: "#d0e8ff" },
      { name: "Bellatrix",   raHours:  5.4189, decDeg:   6.3497, mag:  1.64, color: "#b0d0ff" },
      { name: "Elnath",      raHours:  5.4381, decDeg:  28.6075, mag:  1.65, color: "#e0f0ff" },
      { name: "Miaplacidus", raHours:  9.2200, decDeg: -69.7172, mag:  1.67, color: "#c0e0ff" },
      { name: "Alnilam",     raHours:  5.6036, decDeg:  -1.2020, mag:  1.69, color: "#c8e0ff" },
      { name: "Alnitak",     raHours:  5.6793, decDeg:  -1.9426, mag:  1.77, color: "#c0dcff" },
      { name: "Mintaka",     raHours:  5.5334, decDeg:  -0.2991, mag:  2.23, color: "#d0e8ff" },
      { name: "Acrux",       raHours: 12.4433, decDeg: -63.0990, mag:  0.76, color: "#c8d8ff" },
      { name: "Hadar",       raHours: 14.0637, decDeg: -60.3730, mag:  0.61, color: "#b8d0ff" },
      { name: "Rigil Kent",  raHours: 14.6598, decDeg: -60.8337, mag: -0.27, color: "#ffe8a8" }
    ];

const CONSTELLATION_LINES = Array.isArray(window.CONSTELLATION_LINES)
  ? window.CONSTELLATION_LINES
  : [];

const PLANETS = [
  { body: Astronomy.Body.Mercury, name: "Mercury", color: "#c9c9c9" },
  { body: Astronomy.Body.Venus,   name: "Venus",   color: "#f3ebca" },
  { body: Astronomy.Body.Mars,    name: "Mars",    color: "#ff8e6a" },
  { body: Astronomy.Body.Jupiter, name: "Jupiter", color: "#ffd9a0" },
  { body: Astronomy.Body.Saturn,  name: "Saturn",  color: "#f2d49b" },
  { body: Astronomy.Body.Uranus,  name: "Uranus",  color: "#9de7ff" },
  { body: Astronomy.Body.Neptune, name: "Neptune", color: "#7ab0ff" }
];

// ============================================================
// Math helpers
// ============================================================
const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function degToRad(d) { return d * DEG; }
function radToDeg(r) { return r * RAD; }
function normalizeAngle(d) { return ((d % 360) + 360) % 360; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function hoursToDegrees(h) { return h * 15; }
function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
function cross(a, b) {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}
function normalize(v) {
  const l = Math.hypot(v.x, v.y, v.z);
  return l < 1e-9 ? { x: 0, y: 0, z: 1 } : { x: v.x / l, y: v.y / l, z: v.z / l };
}

function cardinalFromHeading(h) {
  h = normalizeAngle(h);
  if (h >= 337.5 || h < 22.5)  return "N";
  if (h < 67.5)  return "NE";
  if (h < 112.5) return "E";
  if (h < 157.5) return "SE";
  if (h < 202.5) return "S";
  if (h < 247.5) return "SW";
  if (h < 292.5) return "W";
  return "NW";
}

function magnitudeToRadius(mag) {
  if (mag <= -1)  return 5.5;
  if (mag <= 0)   return 4.5;
  if (mag <= 0.5) return 3.8;
  if (mag <= 1)   return 3.2;
  if (mag <= 1.5) return 2.6;
  if (mag <= 2)   return 2.1;
  if (mag <= 3)   return 1.7;
  return 1.2;
}

function magnitudeToGlow(mag) {
  if (mag <= 0) return 22;
  if (mag <= 1) return 14;
  if (mag <= 2) return 8;
  return 4;
}

function starToEquator(star) {
  return { ra: hoursToDegrees(star.raHours), dec: star.decDeg };
}

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function formatDate(d) {
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

// ============================================================
// DOM references
// ============================================================
const galaxyCanvas  = document.getElementById("galaxy-bg");
const skyCanvas     = document.getElementById("sky-canvas");
const gctx          = galaxyCanvas.getContext("2d");
const sctx          = skyCanvas.getContext("2d");

const statusLine    = document.getElementById("status-line");
const locationLine  = document.getElementById("location-line");
const motionLine    = document.getElementById("motion-line");
const countLine     = document.getElementById("count-line");
const compassLabel  = document.getElementById("compass-label");
const pitchLabel    = document.getElementById("pitch-label");
const timeValue     = document.getElementById("time-value");
const dateValue     = document.getElementById("date-value");
const motionBtn     = document.getElementById("motion-btn");

// ============================================================
// State
// ============================================================
const state = {
  width: 0, height: 0,
  observer: null,
  lat: null, lon: null, elevationMeters: 0,
  sensorHeadingDeg: 0,
  sensorPitchDeg: 55,
  hasSensor: false,
  manualHeadingDeg: 0,
  manualPitchDeg: 0,
  dragging: false,
  lastPointerX: 0,
  lastPointerY: 0,
  renderQueued: false,
  galaxySeeds: null,         // pre-baked star field for galaxy bg
  galaxyOffsetX: 0,
  galaxyOffsetY: 0
};

// ============================================================
// Canvas resize
// ============================================================
function resize() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = Math.floor(window.innerWidth * dpr);
  const h = Math.floor(window.innerHeight * dpr);

  if (galaxyCanvas.width !== w || galaxyCanvas.height !== h) {
    galaxyCanvas.width  = w;
    galaxyCanvas.height = h;
    skyCanvas.width     = w;
    skyCanvas.height    = h;
    state.width  = w;
    state.height = h;
    state.galaxySeeds = null; // regenerate on next draw
  }
}
window.addEventListener("resize", () => { resize(); scheduleRender(); });

// ============================================================
// Galaxy background generation
// ============================================================

/** Build a persistent off-screen nebula that's larger than the viewport
 *  so panning reveals different parts. */
function buildGalaxyTexture() {
  const W = state.width  * 3;   // 3× wide so we can pan
  const H = state.height * 3;

  const off = new OffscreenCanvas(W, H);
  const ctx = off.getContext("2d");

  // Base deep-space black
  ctx.fillStyle = "#000005";
  ctx.fillRect(0, 0, W, H);

  // Large nebula clouds (very blurry ellipses)
  const nebulaColors = [
    "rgba(40, 20, 80, 0.18)",
    "rgba(15, 30, 70, 0.20)",
    "rgba(60, 10, 30, 0.14)",
    "rgba(10, 40, 60, 0.16)",
    "rgba(50, 30, 10, 0.12)",
    "rgba(20, 50, 40, 0.10)"
  ];

  const rng = seededRng(42);

  for (let i = 0; i < 14; i++) {
    const cx   = rng() * W;
    const cy   = rng() * H;
    const rx   = W * (0.15 + rng() * 0.35);
    const ry   = H * (0.12 + rng() * 0.28);
    const col  = nebulaColors[Math.floor(rng() * nebulaColors.length)];
    const rot  = rng() * Math.PI;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
    grad.addColorStop(0, col);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(rx, ry), 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // Milky Way band — a wide diagonal streak
  const mwGrad = ctx.createLinearGradient(0, H * 0.2, W, H * 0.8);
  mwGrad.addColorStop(0,   "rgba(0,0,0,0)");
  mwGrad.addColorStop(0.2, "rgba(30,40,70,0.22)");
  mwGrad.addColorStop(0.5, "rgba(55,65,100,0.28)");
  mwGrad.addColorStop(0.8, "rgba(30,40,70,0.22)");
  mwGrad.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.fillStyle = mwGrad;
  ctx.fillRect(0, 0, W, H);

  // Background micro-stars (dense, tiny)
  const microCount = Math.floor((W * H) / 280);
  for (let i = 0; i < microCount; i++) {
    const x   = rng() * W;
    const y   = rng() * H;
    const r   = rng() < 0.85 ? 0.4 : 0.8;
    const a   = 0.1 + rng() * 0.55;
    const hue = rng() < 0.3 ? `rgba(180,210,255,${a})` : `rgba(255,245,230,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = hue;
    ctx.fill();
  }

  // Medium background stars with subtle glow
  const medCount = Math.floor((W * H) / 3200);
  for (let i = 0; i < medCount; i++) {
    const x   = rng() * W;
    const y   = rng() * H;
    const r   = 0.8 + rng() * 1.4;
    const a   = 0.35 + rng() * 0.55;
    const col = rng() < 0.4
      ? `rgba(160,200,255,${a})`
      : rng() < 0.6
        ? `rgba(255,230,180,${a})`
        : `rgba(255,255,255,${a})`;

    // tiny glow
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    grd.addColorStop(0,   col);
    grd.addColorStop(0.4, col.replace(/[\d.]+\)$/, a * 0.3 + ")"));
    grd.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(x, y, r * 4, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  }

  state.galaxySeeds = { canvas: off, W, H };
}

/** Simple seeded pseudo-random (mulberry32) */
function seededRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = Math.imul(s ^ (s >>> 15), 0x1 | s);
    s ^= s + Math.imul(s ^ (s >>> 7), 0x61 | s);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================================
// Camera / projection
// ============================================================
function horizonToVector(az, alt) {
  const a = degToRad(az);
  const e = degToRad(alt);
  return {
    x:  Math.cos(e) * Math.sin(a),
    y:  Math.cos(e) * Math.cos(a),
    z:  Math.sin(e)
  };
}

function getViewAngles() {
  const heading = normalizeAngle(
    (state.hasSensor ? state.sensorHeadingDeg : 0) + state.manualHeadingDeg
  );
  const pitch = clamp(
    (state.hasSensor ? state.sensorPitchDeg : 55) + state.manualPitchDeg,
    -5, 85
  );
  return { heading, pitch };
}

function buildBasis(headingDeg, pitchDeg) {
  const h = degToRad(headingDeg);
  const p = degToRad(pitchDeg);
  const forward = normalize({
    x: Math.cos(p) * Math.sin(h),
    y: Math.cos(p) * Math.cos(h),
    z: Math.sin(p)
  });
  const worldUp = { x: 0, y: 0, z: 1 };
  let right = cross(forward, worldUp);
  right = normalize(right);
  if (Math.hypot(right.x, right.y, right.z) < 1e-6) right = { x: 1, y: 0, z: 0 };
  const up = normalize(cross(right, forward));
  return { forward, right, up };
}

function project(v, basis) {
  const cx = state.width  * 0.5;
  const cy = state.height * 0.5;
  const radius = Math.min(state.width, state.height) * 0.48;

  const lx = dot(v, basis.right);
  const ly = dot(v, basis.up);
  const lz = dot(v, basis.forward);

  if (lz <= 0) return null;

  const angle    = Math.acos(clamp(lz, -1, 1));
  const maxAngle = degToRad(MAX_FOV_DEG * 0.5);
  if (angle > maxAngle) return null;

  const r   = radius * (angle / maxAngle);
  const phi = Math.atan2(ly, lx);

  return {
    x: cx + Math.cos(phi) * r,
    y: cy - Math.sin(phi) * r
  };
}

// ============================================================
// Drawing helpers
// ============================================================

function drawGlowStar(x, y, radius, color, glowSize) {
  const ctx = sctx;
  // Outer glow
  const grd = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
  grd.addColorStop(0,   color);
  grd.addColorStop(0.3, colorWithAlpha(color, 0.4));
  grd.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(x, y, glowSize, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  // Core dot
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/** Add alpha to a hex/rgb color string — simple parser */
function colorWithAlpha(color, alpha) {
  if (color.startsWith("rgba")) return color;
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }
  // Hex
  const c = color.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawStarLabel(text, x, y) {
  const ctx = sctx;
  ctx.save();
  ctx.font = `300 11px 'Exo 2', sans-serif`;
  ctx.fillStyle = "rgba(220, 240, 255, 0.70)";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + 9, y);
  ctx.restore();
}

function drawPlanetLabel(text, x, y) {
  const ctx = sctx;
  ctx.save();
  ctx.font = `600 12px 'Exo 2', sans-serif`;
  ctx.fillStyle = "rgba(255, 235, 180, 0.88)";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + 11, y);
  ctx.restore();
}

function drawConstellationLine(x1, y1, x2, y2) {
  const ctx = sctx;
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = "#e8505a";   // classic StarTracker red lines
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 5]);
  ctx.shadowColor = "rgba(255, 80, 90, 0.6)";
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawPlanetCircle(x, y, r, color) {
  const ctx = sctx;
  // Glow
  const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
  grd.addColorStop(0,   color);
  grd.addColorStop(0.5, colorWithAlpha(color, 0.4));
  grd.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(x, y, r * 4, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  // Core
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSun(x, y) {
  const ctx = sctx;
  const r = 10;
  // Bright corona
  const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
  grd.addColorStop(0,   "rgba(255,240,120,1)");
  grd.addColorStop(0.2, "rgba(255,200,60,0.5)");
  grd.addColorStop(1,   "rgba(255,160,0,0)");
  ctx.beginPath();
  ctx.arc(x, y, r * 5, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#fff5b0";
  ctx.fill();
  drawPlanetLabel("Sun", x, y);
}

function drawMoon(x, y) {
  const ctx = sctx;
  const r = 8;
  const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
  grd.addColorStop(0,   "rgba(240,240,255,1)");
  grd.addColorStop(0.3, "rgba(200,210,255,0.35)");
  grd.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(x, y, r * 3, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#f0f2ff";
  ctx.fill();
  drawPlanetLabel("Moon", x, y);
}

// Cardinal & altitude grid labels on the sky canvas
function drawCardinals(basis) {
  const cardinals = [
    { label: "N", az: 0 },
    { label: "NE", az: 45 },
    { label: "E", az: 90 },
    { label: "SE", az: 135 },
    { label: "S", az: 180 },
    { label: "SW", az: 225 },
    { label: "W", az: 270 },
    { label: "NW", az: 315 }
  ];

  const ctx = sctx;

  for (const c of cardinals) {
    const v   = horizonToVector(c.az, 0);
    const pos = project(v, basis);
    if (!pos) continue;

    ctx.save();
    ctx.font = `600 13px 'Rajdhani', sans-serif`;
    ctx.fillStyle = "rgba(120, 180, 255, 0.55)";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(c.label, pos.x, pos.y);
    ctx.restore();
  }

  // Horizon arc dots
  ctx.save();
  for (let az = 0; az < 360; az += 10) {
    const v   = horizonToVector(az, 0);
    const pos = project(v, basis);
    if (!pos) continue;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(100, 160, 255, 0.25)";
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================
// Render
// ============================================================
function render() {
  resize();

  const now = new Date();
  const { heading, pitch } = getViewAngles();
  const basis = buildBasis(heading, pitch);

  // ── Galaxy background ──
  if (!state.galaxySeeds) buildGalaxyTexture();

  const { canvas: gc, W, H } = state.galaxySeeds;

  // Map heading → horizontal pan, pitch → vertical pan within the texture
  const panX = ((heading / 360) * W * 0.6) % W;
  const panY = ((1 - (pitch + 5) / 90) * H * 0.5);

  // We tile the texture for seamless horizontal wrap
  const dstW = state.width;
  const dstH = state.height;

  gctx.clearRect(0, 0, dstW, dstH);

  // Draw background from texture with wrap
  const srcX = Math.floor(panX) % W;
  const srcY = clamp(Math.floor(panY), 0, H - dstH);

  // Left portion
  const leftW = Math.min(dstW, W - srcX);
  gctx.drawImage(gc, srcX, srcY, leftW, dstH, 0, 0, leftW, dstH);

  // Right wrap-around portion
  if (leftW < dstW) {
    gctx.drawImage(gc, 0, srcY, dstW - leftW, dstH, leftW, 0, dstW - leftW, dstH);
  }

  // Darken edges (vignette)
  const vign = gctx.createRadialGradient(
    dstW * 0.5, dstH * 0.5, dstH * 0.1,
    dstW * 0.5, dstH * 0.5, dstH * 0.8
  );
  vign.addColorStop(0,   "rgba(0,0,0,0)");
  vign.addColorStop(0.6, "rgba(0,0,0,0.1)");
  vign.addColorStop(1,   "rgba(0,0,0,0.72)");
  gctx.fillStyle = vign;
  gctx.fillRect(0, 0, dstW, dstH);

  // ── Sky canvas ──
  sctx.clearRect(0, 0, dstW, dstH);

  // Cardinals / grid
  drawCardinals(basis);

  let starsVisible = 0;
  let planetsVisible = 0;
  let conLines = 0;

  // ── Stars ──
  for (const star of STAR_CATALOG) {
    if (!star || typeof star.raHours !== "number") continue;
    const eq  = starToEquator(star);
    const hor = Astronomy.Horizon(now, state.observer, eq.ra, eq.dec, "normal");
    if (hor.altitude < -2) continue;
    const v   = horizonToVector(hor.azimuth, hor.altitude);
    const pos = project(v, basis);
    if (!pos) continue;

    const mag  = typeof star.mag === "number" ? star.mag : 3;
    const r    = magnitudeToRadius(mag);
    const glow = magnitudeToGlow(mag);
    drawGlowStar(pos.x, pos.y, r, star.color || "#ffffff", glow);

    if (star.name && r >= 3 && hor.altitude > 8) {
      drawStarLabel(star.name, pos.x, pos.y);
    }
    starsVisible++;
  }

  // ── Constellation lines ──
  for (const seg of CONSTELLATION_LINES) {
    if (!Array.isArray(seg) || seg.length !== 2) continue;
    const [a, b] = seg;
    if (!Array.isArray(a) || !Array.isArray(b)) continue;

    const starA = STAR_CATALOG[a[1]];
    const starB = STAR_CATALOG[b[1]];
    if (!starA || !starB) continue;

    const eqA  = starToEquator(starA);
    const eqB  = starToEquator(starB);
    const horA = Astronomy.Horizon(now, state.observer, eqA.ra, eqA.dec, "normal");
    const horB = Astronomy.Horizon(now, state.observer, eqB.ra, eqB.dec, "normal");

    if (horA.altitude < -2 && horB.altitude < -2) continue;

    const posA = project(horizonToVector(horA.azimuth, horA.altitude), basis);
    const posB = project(horizonToVector(horB.azimuth, horB.altitude), basis);
    if (!posA || !posB) continue;

    drawConstellationLine(posA.x, posA.y, posB.x, posB.y);
    conLines++;
  }

  // ── Planets ──
  for (const planet of PLANETS) {
    const eq  = Astronomy.Equator(planet.body, now, state.observer, true, true);
    const hor = Astronomy.Horizon(now, state.observer, eq.ra, eq.dec, "normal");
    if (hor.altitude < -2) continue;
    const pos = project(horizonToVector(hor.azimuth, hor.altitude), basis);
    if (!pos) continue;

    const r = planet.name === "Jupiter" ? 7 : planet.name === "Saturn" ? 6.5 : 5;
    drawPlanetCircle(pos.x, pos.y, r, planet.color);
    drawPlanetLabel(planet.name, pos.x, pos.y);
    planetsVisible++;
  }

  // ── Sun + Moon ──
  for (const body of [Astronomy.Body.Sun, Astronomy.Body.Moon]) {
    const eq  = Astronomy.Equator(body, now, state.observer, true, true);
    const hor = Astronomy.Horizon(now, state.observer, eq.ra, eq.dec, "normal");
    if (hor.altitude < -2) continue;
    const pos = project(horizonToVector(hor.azimuth, hor.altitude), basis);
    if (!pos) continue;
    body === Astronomy.Body.Sun ? drawSun(pos.x, pos.y) : drawMoon(pos.x, pos.y);
    planetsVisible++;
  }

  // ── HUD update ──
  const cardinal = cardinalFromHeading(heading);
  compassLabel.textContent = cardinal;
  pitchLabel.textContent   = `↑ ${Math.round(pitch)}°`;
  timeValue.textContent    = formatTime(now);
  dateValue.textContent    = formatDate(now);

  statusLine.textContent = `Heading: ${Math.round(heading)}°`;
  locationLine.textContent = state.observer
    ? `${state.lat.toFixed(4)}°, ${state.lon.toFixed(4)}° · ${Math.round(state.elevationMeters)} m`
    : "No observer";
  motionLine.textContent = state.hasSensor
    ? `Compass active · pitch ${Math.round(pitch)}°`
    : `Manual · drag to look around`;
  countLine.textContent = `★ ${starsVisible}  ⬤ ${planetsVisible} planets`;
}

function scheduleRender() {
  if (state.renderQueued) return;
  state.renderQueued = true;
  requestAnimationFrame(() => {
    state.renderQueued = false;
    if (state.observer) render();
  });
}

// ============================================================
// Input — drag
// ============================================================
skyCanvas.addEventListener("pointerdown", (e) => {
  state.dragging = true;
  state.lastPointerX = e.clientX;
  state.lastPointerY = e.clientY;
  skyCanvas.setPointerCapture(e.pointerId);
  skyCanvas.style.cursor = "grabbing";
});

skyCanvas.addEventListener("pointermove", (e) => {
  if (!state.dragging) return;
  const dx = e.clientX - state.lastPointerX;
  const dy = e.clientY - state.lastPointerY;
  state.lastPointerX = e.clientX;
  state.lastPointerY = e.clientY;
  state.manualHeadingDeg = normalizeAngle(state.manualHeadingDeg + dx * 0.25);
  state.manualPitchDeg   = clamp(state.manualPitchDeg - dy * 0.12, -50, 35);
  scheduleRender();
});

skyCanvas.addEventListener("pointerup",    () => { state.dragging = false; skyCanvas.style.cursor = "grab"; });
skyCanvas.addEventListener("pointercancel",() => { state.dragging = false; skyCanvas.style.cursor = "grab"; });
skyCanvas.addEventListener("wheel",        (e) => e.preventDefault(), { passive: false });

// ============================================================
// Motion / compass
// ============================================================
async function enableMotion() {
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    const perm = await DeviceOrientationEvent.requestPermission();
    if (perm !== "granted") return false;
  }

  const handleOrientation = (e) => {
    if (typeof e.webkitCompassHeading === "number") {
      state.sensorHeadingDeg = e.webkitCompassHeading;
    } else if (typeof e.alpha === "number") {
      state.sensorHeadingDeg = normalizeAngle(360 - e.alpha);
    }
    if (typeof e.beta === "number") {
      state.sensorPitchDeg = clamp(90 - Math.abs(e.beta), -5, 85);
    }
    state.hasSensor = true;
    scheduleRender();
  };

  window.addEventListener("deviceorientation", handleOrientation, true);
  window.addEventListener("deviceorientationabsolute", handleOrientation, true);
  state.hasSensor = true;
  scheduleRender();
  return true;
}

motionBtn.addEventListener("click", async () => {
  try {
    const ok = await enableMotion();
    motionBtn.textContent = ok ? "Motion on" : "Unavailable";
    motionBtn.disabled    = true;
    motionBtn.style.opacity = "0.55";
  } catch {
    motionBtn.textContent = "Unavailable";
    motionBtn.disabled    = true;
    motionBtn.style.opacity = "0.55";
  }
});

// ============================================================
// Location
// ============================================================
function setObserver(lat, lon, elev) {
  state.lat = lat;
  state.lon = lon;
  state.elevationMeters = elev;
  state.observer = new Astronomy.Observer(lat, lon, elev);
  scheduleRender();
}

function startDemo() {
  setObserver(DEMO_LOCATION.latitude, DEMO_LOCATION.longitude, DEMO_LOCATION.elevationMeters);
  statusLine.textContent   = "Demo location active";
  locationLine.textContent = `Delhi (${DEMO_LOCATION.latitude.toFixed(4)}, ${DEMO_LOCATION.longitude.toFixed(4)})`;
  motionLine.textContent   = "Drag to rotate · tap Enable motion on mobile";
}

function startGeo() {
  if (!navigator.geolocation) { startDemo(); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setObserver(
        pos.coords.latitude,
        pos.coords.longitude,
        Number.isFinite(pos.coords.altitude) ? pos.coords.altitude : 0
      );
      statusLine.textContent   = "Live location";
      locationLine.textContent = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
      motionLine.textContent   = "Tap Enable motion for compass";
    },
    () => startDemo(),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

// ============================================================
// Boot
// ============================================================
function boot() {
  resize();
  if (USE_GEOLOCATION) startGeo(); else startDemo();

  // Full render loop at ~1 fps (sky moves slowly)
  // Plus scheduleRender fires on interaction for instant response
  setInterval(scheduleRender, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}