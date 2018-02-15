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

registerNSMethod(self, "apply", (
  function (properties) {
    if (!verifyArgs(properties, [["blindType", STRINGTYPE]]))
      return false;

    if (self.isActive)
      self.remove();
    self.isActive = true;

    forall(VISUALS).do(
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

        bc = rgbaValue(extractColour(a, "backgroundColor"));
        c = rgbaValue(extractColour(a, "color"));

        r = Math.round(bc.r * matrix.R[0] / 100.0 + bc.g * matrix.R[1] / 100.0 + bc.b * matrix.R[2] / 100.0);
        g = Math.round(bc.r * matrix.G[0] / 100.0 + bc.g * matrix.G[1] / 100.0 + bc.b * matrix.G[2] / 100.0);
        b = Math.round(bc.r * matrix.B[0] / 100.0 + bc.g * matrix.B[1] / 100.0 + bc.b * matrix.B[2] / 100.0);

        cr = Math.round(c.r * matrix.R[0] / 100.0 + c.g * matrix.R[1] / 100.0 + c.b * matrix.R[2] / 100.0);
        cg = Math.round(c.r * matrix.G[0] / 100.0 + c.g * matrix.G[1] / 100.0 + c.b * matrix.G[2] / 100.0);
        cb = Mat.round(c.r * matrix.B[0] / 100.0 + c.g * matrix.B[1] / 100.0 + c.b * matrix.B[2] / 100.0);

        try {
          a.cacheCSSProperties(["background-color"]);
          a.cacheCSSProperties(["color"]);

        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
        console.log(bc);
        console.log(r,g,b,bc.a);
        a.style.backgroundColor = "rgba("+r+","+g+","+b+","+bc.a+")";
        /*a.style.backgroundColor = "rgba(0,0,255,1)";*/
        a.style.color = "rgba("+cr+","+cg+","+cb+","+c.a+")";
      })}));

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
    forall(VISUALS).do(
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

        bc = rgbValue(extractColour(a, "backgroundColor"));
        c = rgbValue(extractColour(a, "color"));

        let type = properties["blindType"];
        let LMSMatrix = multiply(rgb2lms, [[bc.r], [bc.g], [bc.b]]);
        let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);
        let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);
        let errorMatrix = [[Math.abs(bc.r - simulatedMatrix[0][0])], [Math.abs(bc.g - simulatedMatrix[1][0])], [Math.abs(bc.b - simulatedMatrix[2][0])]];
        let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];
        let fixedMatrix = multiply(modMatrix, errorMatrix);
        let limit = function (a) {
          if (a > 255) return 255;
          else if (a < 0) return 0;
          else return a;
        };
        r = limit(bc.r + fixedMatrix[0][0]);
        g = limit(bc.g + fixedMatrix[1][0]);
        b = limit(bc.b + fixedMatrix[2][0]);

        try {
          a.cacheCSSProperties(["background-color"]);
          a.cacheCSSProperties(["color"]);
        } catch (e) {
          /*some elements do not work with cacheCSSProperties*/
        }
        a.style.backgroundColor = "rgb("+r+","+g+","+b+")";

        type = properties["blindType"];
        LMSMatrix = multiply(rgb2lms, [[c.r], [c.g], [c.b]]);
        colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);
        simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);
        errorMatrix = [[Math.abs(c.r - simulatedMatrix[0][0])], [Math.abs(c.g - simulatedMatrix[1][0])], [Math.abs(c.b - simulatedMatrix[2][0])]];
        modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];
        fixedMatrix = multiply(modMatrix, errorMatrix);
        r = limit(c.r + fixedMatrix[0][0]);
        g = limit(c.g + fixedMatrix[1][0]);
        b = limit(c.b + fixedMatrix[2][0]);

        a.style.color = "rgb("+r+","+g+","+b+")";

      })}));


registerNSMethod(self, "remove", (
  function () {
    self.isActive = false;
    forall(VISUALS).do(function(a){applyToImage(a, function (xy,rgba) {
      return {r: rgba.r, g:rgba.g, b: rgba.b, a:rgba.a}
    })});
      forall().do(a=> {
        try {
          a.resetCSS();
        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
      }
    );
    return true;
  }
));
