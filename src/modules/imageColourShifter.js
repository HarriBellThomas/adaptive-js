registerNamespace("uk.org.adaptive.imageColourShifter");

uk.org.adaptive.imageColourShifter.isActive = false;

var ColorMatrixMatrixes = {
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

registerNSMethod(uk.org.adaptive.imageColourShifter, "apply", (
    function (properties) {

        if (!verifyArgs(properties, [["blindType", STRINGTYPE]]))
            return false;

        if (uk.org.adaptive.imageColourShifter.isActive)
            uk.org.adaptive.imageColourShifter.remove();

        uk.org.adaptive.imageColourShifter.isActive = true;

        forall(IMAGES).do(
            function (a) {
                applyToImage(a, function (xy, rgba) {

                    if (!uk.org.adaptive.imageColourShifter.isActive) return;

                    var type = properties["blindType"];
                    var matrix = ColorMatrixMatrixes[type];

                    return {

                        r: rgba.r * matrix.R[0] / 100.0 + rgba.g * matrix.R[1] / 100.0 + rgba.b * matrix.R[2] / 100.0,
                        g: rgba.r * matrix.G[0] / 100.0 + rgba.g * matrix.G[1] / 100.0 + rgba.b * matrix.G[2] / 100.0,
                        b: rgba.r * matrix.B[0] / 100.0 + rgba.g * matrix.B[1] / 100.0 + rgba.b * matrix.B[2] / 100.0,
                        a: rgba.a
                    }
                })
            });
    }
));

/*Colorspace transformation matrices*/
var cb_matrices = {
    Deuteranopia: [[1, 0, 0], [0.494207, 0, 1.24827], [0, 0, 1]],
    Protanopia: [[0, 2.02344, -2.52581], [0, 1, 0], [0, 0, 1]],
    Tritanopia: [[1, 0, 0], [0, 1, 0], [-0.395913, 0.801109, 0]]
};
var rgb2lms = [[17.8824, 43.5161, 4.11935],
    [3.45565, 27.1554, 3.86714],
    [0.0299566, 0.184309, 1.46709]];

/*Precomputed inverse*/
var lms2rgb = [[8.09444479e-02, -1.30504409e-01, 1.16721066e-01],
    [-1.02485335e-02, 5.40193266e-02, -1.13614708e-01],
    [-3.65296938e-04, -4.12161469e-03, 6.93511405e-01]];


registerNSMethod(uk.org.adaptive.imageColourShifter, "daltonize", (
    function (properties) {

        if (!verifyArgs(properties, [["blindType", STRINGTYPE]]))
            return false;

        if (uk.org.adaptive.imageColourShifter.isActive)
            uk.org.adaptive.imageColourShifter.remove();

        uk.org.adaptive.imageColourShifter.isActive = true;

        var multiply = function (a, b) {
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

                    if (!uk.org.adaptive.imageColourShifter.isActive) return;

                    var type = properties["blindType"];

                    var LMSMatrix = multiply(rgb2lms, [[rgba.r], [rgba.g], [rgba.b]]);

                    var colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);

                    var simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);

                    var errorMatrix = Math.abs([[rgba.r], [rgba.g], [rgba.b]] - simulatedMatrix);

                    var modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];

                    var fixedMatrix = multiply(modMatrix, errorMatrix);

                    var limit = function (a) {
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
            })
    }));

registerNSMethod(uk.org.adaptive.imageColourShifter, "remove", (
    function () {
        uk.org.adaptive.imageColourShifter.isActive = false;
        return true;
    }
));
