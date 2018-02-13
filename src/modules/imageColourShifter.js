registerNamespace("uk.org.adaptive.imageColourShifter");

self.isActive = false;

ColorMatrixMatrixes = {
  Normal: {
    R: [100, 0, 0],
    G: [0, 100, 0],
    B: [0, 0, 100]
  },
  Protanopia: {
    R: [56.667, 43.333, 0],
    G: [55.833, 44.167, 0],
    B: [0, 24.167, 75.833]
  },
  Protanomaly: {
    R: [81.667, 18.333, 0],
    G: [33.333, 66.667, 0],
    B: [0, 12.5, 87.5]
  },
  Deuteranopia: {
    R: [62.5, 37.5, 0],
    G: [70, 30, 0],
    B: [0, 30, 70]
  },
  Deuteranomaly: {
    R: [80, 20, 0],
    G: [25.833, 74.167, 0],
    B: [0, 14.167, 85.833]
  },
  Tritanopia: {
    R: [95, 5, 0],
    G: [0, 43.333, 56.667],
    B: [0, 47.5, 52.5]
  },
  Tritanomaly: {
    R: [96.667, 3.333, 0],
    G: [0, 73.333, 26.667],
    B: [0, 18.333, 81.667]
  },
  Achromatopsia: {
    R: [29.9, 58.7, 11.4],
    G: [29.9, 58.7, 11.4],
    B: [29.9, 58.7, 11.4]
  },
  Achromatomaly: {
    R: [61.8, 32, 6.2],
    G: [16.3, 77.5, 6.2],
    B: [16.3, 32.0, 51.6]
  }
};

colourNameToHex = function (colour) {
  var colours = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred ": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgrey": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370d8",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#d87093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
  };

  if (typeof colours[colour.toLowerCase()] != 'undefined')
    return colours[colour.toLowerCase()];

  return false;
};

hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

registerNSMethod(self, "apply", (
  function (properties) {

    if (!verifyArgs(properties, [["blindType", STRINGTYPE]]))
      return false;

    if (self.isActive)
      self.remove();

    self.isActive = true;

    forall(IMAGES).do(
      function (a) {
        applyToImage(a, function (xy, rgba) {

          if (!self.isActive) return;

          type = properties["blindType"];
          matrix = ColorMatrixMatrixes[type];

          return {

            r: rgba.r * matrix.R[0] / 100.0 + rgba.g * matrix.R[1] / 100.0 + rgba.b * matrix.R[2] / 100.0,
            g: rgba.r * matrix.G[0] / 100.0 + rgba.g * matrix.G[1] / 100.0 + rgba.b * matrix.G[2] / 100.0,
            b: rgba.r * matrix.B[0] / 100.0 + rgba.g * matrix.B[1] / 100.0 + rgba.b * matrix.B[2] / 100.0,
            a: rgba.a
          }
        })
      });

    forall().do(
      function (a) {

        if (!self.isActive) return;

        type = properties["blindType"];
        matrix = ColorMatrixMatrixes[type];


        bc = window.getComputedStyle(a,null).backgroundColor;
        c = window.getComputedStyle(a,null).color;

        if (bc.startsWith("rgb") && !bc.includes("rgba(0,0,0,0)")) {

          bc = bc.substring(5, bc.length - 3)
            .replace(/ /g, '')
            .split(',');


          r = bc[0] * matrix.R[0] / 100.0 + bc[1] * matrix.R[1] / 100.0 + bc[2] * matrix.R[2] / 100.0;
          g = bc[0] * matrix.G[0] / 100.0 + bc[1] * matrix.G[1] / 100.0 + bc[2] * matrix.G[2] / 100.0;
          b = bc[0] * matrix.B[0] / 100.0 + bc[1] * matrix.B[1] / 100.0 + bc[2] * matrix.B[2] / 100.0;

          a.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";

        } else {
          if (!bc.startsWith("#")) {
            bc = colourNameToHex(bc);
          }

          rgb = hexToRgb(bc);

          r = rgb.r * matrix.R[0] / 100.0 + rgb.g * matrix.R[1] / 100.0 + rgb.b * matrix.R[2] / 100.0;
          g = rgb.r * matrix.G[0] / 100.0 + rgb.g * matrix.G[1] / 100.0 + rgb.b * matrix.G[2] / 100.0;
          b = rgb.r * matrix.B[0] / 100.0 + rgb.g * matrix.B[1] / 100.0 + rgb.b * matrix.B[2] / 100.0;

          a.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        }

        if (c.startsWith("rgb") && !c.includes("rgba(0,0,0,0)")) {

          c = c.substring(4, c.length - 1)
            .replace(/ /g, '')
            .split(',');

          cr = c[0] * matrix.R[0] / 100.0 + c[1] * matrix.R[1] / 100.0 + c[2] * matrix.R[2] / 100.0;
          cg = c[0] * matrix.G[0] / 100.0 + c[1] * matrix.G[1] / 100.0 + c[2] * matrix.G[2] / 100.0;
          cb = c[0] * matrix.B[0] / 100.0 + c[1] * matrix.B[1] / 100.0 + c[2] * matrix.B[2] / 100.0;
          a.style.color = "rgb(" + cr + "," + cg + "," + cb + ")";

        } else {
          if (!c.startsWith("#")) {
            c = colourNameToHex(c);
          }
          crgb = hexToRgb(c);

          cr = crgb.r * matrix.R[0] / 100.0 + crgb.g * matrix.R[1] / 100.0 + crgb.b * matrix.R[2] / 100.0;
          cg = crgb.r * matrix.G[0] / 100.0 + crgb.g * matrix.G[1] / 100.0 + crgb.b * matrix.G[2] / 100.0;
          cb = crgb.r * matrix.B[0] / 100.0 + crgb.g * matrix.B[1] / 100.0 + crgb.b * matrix.B[2] / 100.0;

          a.style.color = "rgb(" + cr + "," + cg + "," + cb + ")";
        }
      }
    )
  }
));

/*Colorspace transformation matrices*/
const cb_matrices = {
  Deuteranopia: [[1, 0, 0], [0.494207, 0, 1.24827], [0, 0, 1]],
  Protanopia: [[0, 2.02344, -2.52581], [0, 1, 0], [0, 0, 1]],
  Tritanopia: [[1, 0, 0], [0, 1, 0], [-0.395913, 0.801109, 0]]
};
const rgb2lms = [[17.8824, 43.5161, 4.11935],
  [3.45565, 27.1554, 3.86714],
  [0.0299566, 0.184309, 1.46709]];

/*Precomputed inverse*/
const lms2rgb = [[8.09444479e-02, -1.30504409e-01, 1.16721066e-01],
  [-1.02485335e-02, 5.40193266e-02, -1.13614708e-01],
  [-3.65296938e-04, -4.12161469e-03, 6.93511405e-01]];


registerNSMethod(self, "daltonize", (
  function (properties) {

    if (!verifyArgs(properties, [["blindType", STRINGTYPE]]))
      return false;

    if (self.isActive)
      self.remove();

    self.isActive = true;

    multiply = function (a, b) {
      var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
      for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
          m[r][c] = 0;             // initialize the current cell
          for (var i = 0; i < aNumCols; ++i) {
            m[r][c] += a[r][i] * b[i][c];
          }
        }
      }
      return m;
    };
    forall(IMAGES).do(
      function (a) {
        applyToImage(a, function (xy, rgba) {

          if (!self.isActive) return;

          let type = properties["blindType"];

          let LMSMatrix = multiply(rgb2lms, [[rgba.r], [rgba.g], [rgba.b]]);

          let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);

          let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);

          let errorMatrix = [[Math.abs(rgba.r - simulatedMatrix[0][0])], [Math.abs(rgba.g - simulatedMatrix[1][0])], [Math.abs(rgba.b - simulatedMatrix[2][0])]];

          let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];

          let fixedMatrix = multiply(modMatrix, errorMatrix);

          let limit = function (a) {
            if (a > 255) return 255;
            else if (a < 0) return 0;
            else return a;
          };
          return {
            r: limit(rgba.r + fixedMatrix[0][0]),
            g: limit(rgba.g + fixedMatrix[1][0]),
            b: limit(rgba.b + fixedMatrix[2][0]),
            a: rgba.a
          }
        })
      });

    forall().do(
      function (a) {

        if (!self.isActive) return;

        type = properties["blindType"];
        matrix = ColorMatrixMatrixes[type];

        bc = window.getComputedStyle(a).backgroundColor;
        c = window.getComputedStyle(a).color;


        if (bc.startsWith("rgb")) {

          bc = bc.substring(5, bc.length - 3)
            .replace(/ /g, '')
            .split(',');

          let type = properties["blindType"];

          let LMSMatrix = multiply(rgb2lms, [[bc[0]], [bc[1]], [bc[2]]]);

          let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);

          let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);

          let errorMatrix = [[Math.abs(bc[0] - simulatedMatrix[0][0])], [Math.abs(bc[1] - simulatedMatrix[1][0])], [Math.abs(bc[2] - simulatedMatrix[2][0])]];

          let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];

          let fixedMatrix = multiply(modMatrix, errorMatrix);

          let limit = function (a) {
            if (a > 255) return 255;
            else if (a < 0) return 0;
            else return a;
          };
            r= limit(bc[0] + fixedMatrix[0][0]);
            g= limit(bc[1] + fixedMatrix[1][0]);
            b= limit(bc[2] + fixedMatrix[2][0]);

          a.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";

        } else {
          if (!bc.startsWith("#")) {
            bc = colourNameToHex(bc);
          }
          rgb = hexToRgb(bc);

          let type = properties["blindType"];

          let LMSMatrix = multiply(rgb2lms, [[rgb.r], [rgb.g], [rgb.b]]);

          let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);

          let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);

          let errorMatrix = [[Math.abs(rgb.r - simulatedMatrix[0][0])], [Math.abs(rgb.g - simulatedMatrix[1][0])], [Math.abs(rgb.b - simulatedMatrix[2][0])]];

          let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];

          let fixedMatrix = multiply(modMatrix, errorMatrix);

          let limit = function (a) {
            if (a > 255) return 255;
            else if (a < 0) return 0;
            else return a;
          };
          r= limit(rgb.r + fixedMatrix[0][0]);
          g= limit(rgb.g + fixedMatrix[1][0]);
          b= limit(rgb.b + fixedMatrix[2][0]);

          a.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        }

        if (c.startsWith("rgb")) {

          c = c.substring(4, c.length - 1)
            .replace(/ /g, '')
            .split(',');

          let type = properties["blindType"];

          let LMSMatrix = multiply(rgb2lms, [[c[0]], [c[1]], [c[2]]]);

          let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);

          let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);

          let errorMatrix = [[Math.abs(c[0] - simulatedMatrix[0][0])], [Math.abs(c[1] - simulatedMatrix[1][0])], [Math.abs(c[2] - simulatedMatrix[2][0])]];

          let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];

          let fixedMatrix = multiply(modMatrix, errorMatrix);

          let limit = function (a) {
            if (a > 255) return 255;
            else if (a < 0) return 0;
            else return a;
          };
          r= limit(c[0] + fixedMatrix[0][0]);
          g= limit(c[1] + fixedMatrix[1][0]);
          b= limit(c[2] + fixedMatrix[2][0]);

          a.style.color = "rgb(" + r + "," + g + "," + b + ")";

        } else {
          if (!c.startsWith("#")) {
            c = colourNameToHex(c);
          }
          rgb = hexToRgb(c);

          let type = properties["blindType"];

          let LMSMatrix = multiply(rgb2lms, [[rgb.r], [rgb.g], [rgb.b]]);

          let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);

          let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);

          let errorMatrix = [[Math.abs(rgb.r - simulatedMatrix[0][0])], [Math.abs(rgb.g - simulatedMatrix[1][0])], [Math.abs(rgb.b - simulatedMatrix[2][0])]];

          let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];

          let fixedMatrix = multiply(modMatrix, errorMatrix);

          let limit = function (a) {
            if (a > 255) return 255;
            else if (a < 0) return 0;
            else return a;
          };
          r= limit(rgb.r + fixedMatrix[0][0]);
          g= limit(rgb.g + fixedMatrix[1][0]);
          b= limit(rgb.b + fixedMatrix[2][0]);

          a.style.color = "rgb(" + r + "," + g + "," + b + ")";
        }
      }
    )
  }));

registerNSMethod(self, "remove", (
  function () {
    self.isActive = false;
    return true;
  }
));
