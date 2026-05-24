/* ============================================================
   constellations.js
   Load this BEFORE script.js in index.html.

   Provides:
     window.STAR_CATALOG          – extended catalog (named entries)
     window.CONSTELLATION_LINES   – line segments by star index
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// STAR CATALOG
// Each entry: { name, raHours, decDeg, mag, color }
// INDEX matters — CONSTELLATION_LINES reference these by index.
// ─────────────────────────────────────────────────────────────
window.STAR_CATALOG = [
  // ── Orion ──────────────────────────────────── 0-6
  { name: "Rigel",       raHours:  5.2423, decDeg:  -8.2016, mag:  0.13, color: "#c8dfff" }, // 0
  { name: "Betelgeuse",  raHours:  5.9195, decDeg:   7.4071, mag:  0.42, color: "#ffb870" }, // 1
  { name: "Bellatrix",   raHours:  5.4189, decDeg:   6.3497, mag:  1.64, color: "#b0d0ff" }, // 2
  { name: "Alnilam",     raHours:  5.6036, decDeg:  -1.2020, mag:  1.69, color: "#c8e0ff" }, // 3
  { name: "Alnitak",     raHours:  5.6793, decDeg:  -1.9426, mag:  1.77, color: "#c0dcff" }, // 4
  { name: "Mintaka",     raHours:  5.5334, decDeg:  -0.2991, mag:  2.23, color: "#d0e8ff" }, // 5
  { name: "Saiph",       raHours:  5.7954, decDeg: -10.1670, mag:  2.06, color: "#c8dcff" }, // 6

  // ── Ursa Major ─────────────────────────────── 7-13
  { name: "Alioth",      raHours: 12.9004, decDeg:  55.9598, mag:  1.76, color: "#e8f0ff" }, // 7
  { name: "Dubhe",       raHours: 11.0621, decDeg:  61.7510, mag:  1.81, color: "#ffd080" }, // 8
  { name: "Alkaid",      raHours: 13.7923, decDeg:  49.3133, mag:  1.85, color: "#c8dcff" }, // 9
  { name: "Mizar",       raHours: 13.3988, decDeg:  54.9254, mag:  2.04, color: "#e8f0ff" }, // 10
  { name: "Merak",       raHours: 11.0307, decDeg:  56.3824, mag:  2.34, color: "#e0ecff" }, // 11
  { name: "Phecda",      raHours: 11.8971, decDeg:  53.6948, mag:  2.44, color: "#e8f0ff" }, // 12
  { name: "Megrez",      raHours: 12.2572, decDeg:  57.0326, mag:  3.31, color: "#e0ecff" }, // 13

  // ── Cassiopeia ─────────────────────────────── 14-18
  { name: "Schedar",     raHours:  0.6751, decDeg:  56.5373, mag:  2.24, color: "#ffd090" }, // 14
  { name: "Caph",        raHours:  0.1529, decDeg:  59.1498, mag:  2.28, color: "#fff0d0" }, // 15
  { name: "Gamma Cas",   raHours:  0.9451, decDeg:  60.7167, mag:  2.47, color: "#c8e4ff" }, // 16
  { name: "Ruchbah",     raHours:  1.4302, decDeg:  60.2353, mag:  2.68, color: "#e0f0ff" }, // 17
  { name: "Segin",       raHours:  1.9061, decDeg:  63.6700, mag:  3.35, color: "#d8ecff" }, // 18

  // ── Leo ────────────────────────────────────── 19-24
  { name: "Regulus",     raHours: 10.1395, decDeg:  11.9672, mag:  1.40, color: "#c8dcff" }, // 19
  { name: "Algieba",     raHours: 10.3327, decDeg:  19.8414, mag:  2.01, color: "#ffc870" }, // 20
  { name: "Denebola",    raHours: 11.8177, decDeg:  14.5720, mag:  2.14, color: "#e8f8ff" }, // 21
  { name: "Zosma",       raHours: 11.2352, decDeg:  20.5237, mag:  2.56, color: "#e8f0ff" }, // 22
  { name: "Chertan",     raHours: 11.2351, decDeg:  15.4297, mag:  3.33, color: "#e8f0ff" }, // 23
  { name: "Eta Leonis",  raHours: 10.1222, decDeg:  16.7630, mag:  3.48, color: "#d0e8ff" }, // 24

  // ── Scorpius ───────────────────────────────── 25-31
  { name: "Antares",     raHours: 16.4901, decDeg: -26.4320, mag:  1.09, color: "#ff7050" }, // 25
  { name: "Shaula",      raHours: 17.5601, decDeg: -37.1038, mag:  1.62, color: "#d0e8ff" }, // 26
  { name: "Sargas",      raHours: 17.6219, decDeg: -42.9978, mag:  1.86, color: "#ffe8a0" }, // 27
  { name: "Dschubba",    raHours: 16.0055, decDeg: -22.6217, mag:  2.29, color: "#c8dcff" }, // 28
  { name: "Epsilon Sco", raHours: 16.8355, decDeg: -34.2936, mag:  2.29, color: "#ffd080" }, // 29
  { name: "Lesath",      raHours: 17.5308, decDeg: -37.2961, mag:  2.69, color: "#c8dcff" }, // 30
  { name: "Graffias",    raHours: 16.0913, decDeg: -19.8056, mag:  2.50, color: "#c8dcff" }, // 31

  // ── Taurus ─────────────────────────────────── 32-35
  { name: "Aldebaran",   raHours:  4.5987, decDeg:  16.5093, mag:  0.85, color: "#ff9040" }, // 32
  { name: "Elnath",      raHours:  5.4381, decDeg:  28.6075, mag:  1.65, color: "#e0f0ff" }, // 33
  { name: "Alcyone",     raHours:  3.7913, decDeg:  24.1051, mag:  2.87, color: "#c8e0ff" }, // 34 (Pleiades rep)
  { name: "Ain",         raHours:  4.4773, decDeg:  19.1804, mag:  3.53, color: "#ffd090" }, // 35

  // ── Gemini ─────────────────────────────────── 36-40
  { name: "Pollux",      raHours:  7.7553, decDeg:  28.0262, mag:  1.14, color: "#ffd090" }, // 36
  { name: "Castor",      raHours:  7.5766, decDeg:  31.8883, mag:  1.58, color: "#f0f8ff" }, // 37
  { name: "Alhena",      raHours:  6.6285, decDeg:  16.3993, mag:  1.93, color: "#e8f8ff" }, // 38
  { name: "Tejat",       raHours:  6.3824, decDeg:  22.5139, mag:  2.88, color: "#ffc870" }, // 39
  { name: "Mebsuda",     raHours:  6.7324, decDeg:  25.1311, mag:  3.06, color: "#ffe0a0" }, // 40

  // ── Virgo ──────────────────────────────────── 41-45
  { name: "Spica",       raHours: 13.4199, decDeg: -11.1613, mag:  1.04, color: "#b8d8ff" }, // 41
  { name: "Porrima",     raHours: 12.6942, decDeg:  -1.4494, mag:  2.74, color: "#f0f8ff" }, // 42
  { name: "Minelauva",   raHours: 12.9268, decDeg:   3.3974, mag:  3.38, color: "#ffd080" }, // 43
  { name: "Vindemiatrix", raHours: 13.0362, decDeg:  10.9591, mag:  2.83, color: "#ffe0a0" }, // 44
  { name: "Heze",        raHours: 13.5782, decDeg:  -0.5958, mag:  3.37, color: "#e8f0ff" }, // 45

  // ── Aquila ─────────────────────────────────── 46-48
  { name: "Altair",      raHours: 19.8464, decDeg:   8.8683, mag:  0.77, color: "#e8f8ff" }, // 46
  { name: "Tarazed",     raHours: 19.7709, decDeg:  10.6132, mag:  2.72, color: "#ffc870" }, // 47
  { name: "Alshain",     raHours: 19.9218, decDeg:   6.4069, mag:  3.71, color: "#fff0d0" }, // 48

  // ── Cygnus ─────────────────────────────────── 49-53
  { name: "Deneb",       raHours: 20.6905, decDeg:  45.2803, mag:  1.25, color: "#e8f0ff" }, // 49
  { name: "Sadr",        raHours: 20.3705, decDeg:  40.2567, mag:  2.23, color: "#ffe8c0" }, // 50
  { name: "Gienah Cyg",  raHours: 20.7702, decDeg:  33.9703, mag:  2.48, color: "#ffe0a0" }, // 51
  { name: "Delta Cyg",   raHours: 19.7497, decDeg:  45.1308, mag:  2.87, color: "#d8ecff" }, // 52
  { name: "Albireo",     raHours: 19.5121, decDeg:  27.9597, mag:  3.08, color: "#ffc860" }, // 53

  // ── Lyra ───────────────────────────────────── 54-56
  { name: "Vega",        raHours: 18.6156, decDeg:  38.7837, mag:  0.03, color: "#d4eeff" }, // 54
  { name: "Sheliak",     raHours: 18.8348, decDeg:  33.3627, mag:  3.52, color: "#e0f0ff" }, // 55
  { name: "Sulafat",     raHours: 18.9820, decDeg:  32.6896, mag:  3.24, color: "#e0f8ff" }, // 56

  // ── Perseus ────────────────────────────────── 57-61
  { name: "Mirfak",      raHours:  3.4056, decDeg:  49.8612, mag:  1.79, color: "#ffe0a0" }, // 57
  { name: "Algol",       raHours:  3.1361, decDeg:  40.9557, mag:  2.12, color: "#e8f0ff" }, // 58
  { name: "Zeta Per",    raHours:  3.9022, decDeg:  31.8836, mag:  2.84, color: "#c8e0ff" }, // 59
  { name: "Epsilon Per", raHours:  3.9640, decDeg:  40.0103, mag:  2.89, color: "#c0d8ff" }, // 60
  { name: "Delta Per",   raHours:  3.7154, decDeg:  47.7877, mag:  3.01, color: "#e0f0ff" }, // 61

  // ── Auriga ─────────────────────────────────── 62-65
  { name: "Capella",     raHours:  5.2782, decDeg:  45.9979, mag:  0.08, color: "#ffe8a0" }, // 62
  { name: "Menkalinan",  raHours:  5.9922, decDeg:  44.9474, mag:  1.90, color: "#e8f0ff" }, // 63
  { name: "Theta Aur",   raHours:  5.9958, decDeg:  37.2126, mag:  2.62, color: "#c8dcff" }, // 64
  { name: "Iota Aur",    raHours:  4.9497, decDeg:  33.1661, mag:  2.69, color: "#ffd090" }, // 65

  // ── Boötes ─────────────────────────────────── 66-69
  { name: "Arcturus",    raHours: 14.2610, decDeg:  19.1825, mag: -0.05, color: "#ffd580" }, // 66
  { name: "Izar",        raHours: 14.7498, decDeg:  27.0742, mag:  2.35, color: "#ffc870" }, // 67
  { name: "Muphrid",     raHours: 13.9115, decDeg:  18.3977, mag:  2.68, color: "#ffe0a0" }, // 68
  { name: "Seginus",     raHours: 14.5350, decDeg:  38.3083, mag:  3.03, color: "#e8f0ff" }, // 69

  // ── Centaurus ──────────────────────────────── 70-73
  { name: "Rigil Kent",  raHours: 14.6598, decDeg: -60.8337, mag: -0.27, color: "#ffe8a8" }, // 70
  { name: "Hadar",       raHours: 14.0637, decDeg: -60.3730, mag:  0.61, color: "#b8d0ff" }, // 71
  { name: "Menkent",     raHours: 14.1115, decDeg: -36.3700, mag:  2.06, color: "#ffd080" }, // 72
  { name: "Muhlifain",   raHours: 12.6924, decDeg: -48.9597, mag:  2.55, color: "#e0f0ff" }, // 73

  // ── Crux ───────────────────────────────────── 74-77
  { name: "Acrux",       raHours: 12.4433, decDeg: -63.0990, mag:  0.76, color: "#c8d8ff" }, // 74
  { name: "Gacrux",      raHours: 12.5194, decDeg: -57.1132, mag:  1.59, color: "#ff8060" }, // 75
  { name: "Mimosa",      raHours: 12.7953, decDeg: -59.6888, mag:  1.25, color: "#b0ccff" }, // 76
  { name: "Delta Cru",   raHours: 12.3523, decDeg: -58.7489, mag:  2.79, color: "#d8ecff" }, // 77

  // ── Canis Major ────────────────────────────── 78-81
  { name: "Sirius",      raHours:  6.7525, decDeg: -16.7161, mag: -1.46, color: "#cce4ff" }, // 78
  { name: "Adhara",      raHours:  6.9771, decDeg: -28.9722, mag:  1.50, color: "#b8d0ff" }, // 79
  { name: "Wezen",       raHours:  7.1397, decDeg: -26.3932, mag:  1.83, color: "#ffe0a0" }, // 80
  { name: "Mirzam",      raHours:  6.3783, decDeg: -17.9559, mag:  1.98, color: "#c8dcff" }, // 81

  // ── Aquarius ───────────────────────────────── 82-85
  { name: "Sadalsuud",   raHours: 21.5260, decDeg:  -5.5711, mag:  2.90, color: "#ffe0a0" }, // 82
  { name: "Sadalmelik",  raHours: 22.0961, decDeg:  -0.3198, mag:  2.95, color: "#ffd080" }, // 83
  { name: "Skat",        raHours: 22.9108, decDeg: -15.8208, mag:  3.27, color: "#e0f0ff" }, // 84
  { name: "Albali",      raHours: 20.7943, decDeg:  -9.4957, mag:  3.77, color: "#e8f8ff" }, // 85

  // ── Sagittarius ────────────────────────────── 86-90
  { name: "Kaus Australis", raHours: 18.4029, decDeg: -34.3846, mag:  1.79, color: "#ffd080" }, // 86
  { name: "Nunki",       raHours: 18.9211, decDeg: -26.2967, mag:  2.05, color: "#c8dcff" }, // 87
  { name: "Ascella",     raHours: 19.0435, decDeg: -29.8801, mag:  2.59, color: "#e8f8ff" }, // 88
  { name: "Kaus Media",  raHours: 18.3491, decDeg: -29.8281, mag:  2.70, color: "#e8f0ff" }, // 89
  { name: "Kaus Borealis", raHours: 18.3493, decDeg: -25.4217, mag:  2.81, color: "#ffe0a0" }, // 90

  // ── Pisces / misc bright ───────────────────── 91-95
  { name: "Fomalhaut",   raHours: 22.9609, decDeg: -29.6223, mag:  1.16, color: "#ddf0ff" }, // 91
  { name: "Canopus",     raHours:  6.3992, decDeg: -52.6957, mag: -0.74, color: "#fff5e0" }, // 92
  { name: "Miaplacidus", raHours:  9.2200, decDeg: -69.7172, mag:  1.67, color: "#c0e0ff" }, // 93
  { name: "Procyon",     raHours:  7.6550, decDeg:   5.2250, mag:  0.38, color: "#fff0d0" }, // 94
  { name: "Achernar",    raHours:  1.6285, decDeg: -57.2367, mag:  0.46, color: "#c0d8ff" }, // 95
];