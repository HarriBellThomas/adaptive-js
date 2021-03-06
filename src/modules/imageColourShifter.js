registerNamespace("uk.org.adaptive.imageColourShifter");

self.isActive = false;

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
var applyingIdentity = false;
self.toXOriginFixes = 0;
var consistentCalls = 0;
var lastCall = 0;

/* Applies the simulation of colour blindness based on input */
registerNSMethod(self, "apply", (
    function (properties) {


        if (applyingIdentity){
            if (lastCall == self.toXOriginFixes){
                consistentCalls++;
            }else{
                consistentCalls = 0;
            }
            lastCall = self.toXOriginFixes;

            debug(self.toXOriginFixes+" remain to be fixed");
            if (self.toXOriginFixes > 0 && consistentCalls < 3){
                setTimeout(function(){
                    self.apply(properties);
                }, 1000);
                return;
            }else{
                applyingIdentity = false;
            }
        }else{
            forall(VISUALS).where(a=> !a.originFix).do(a=>{
                self.toXOriginFixes ++;
                applyToImage(a, HARDIDENTITY, false, function(){
                        self.toXOriginFixes --;
                    }
                )});
            debug(self.toXOriginFixes+" remain to be fixed");
            lastCall = self.toXOriginFixes;
            if (self.toXOriginFixes>0){
                applyingIdentity = true;
                setTimeout(function(){
                    self.apply(properties);
                }, 1000);
                return;
            }
        }


        if (!verifyArgs(properties, [["identifier", STRINGTYPE]]))
            return false;

        self.isActive = true;

        targets().where(a => a instanceof HTMLElement).do(
            function (a) {
                if (!self.isActive) return;

                type = properties["identifier"];
                matrix = ColorMatrixMatrixes[type];

                bc = rgbaValue(extractColour(a, "backgroundColor"));
                c = rgbaValue(extractColour(a, "color"));
                boc = rgbaValue(extractColour(a, "border-color"));

                r = Math.round(bc.r * matrix.R[0] / 100.0 + bc.g * matrix.R[1] / 100.0 + bc.b * matrix.R[2] / 100.0);
                g = Math.round(bc.r * matrix.G[0] / 100.0 + bc.g * matrix.G[1] / 100.0 + bc.b * matrix.G[2] / 100.0);
                b = Math.round(bc.r * matrix.B[0] / 100.0 + bc.g * matrix.B[1] / 100.0 + bc.b * matrix.B[2] / 100.0);

                cr = Math.round(c.r * matrix.R[0] / 100.0 + c.g * matrix.R[1] / 100.0 + c.b * matrix.R[2] / 100.0);
                cg = Math.round(c.r * matrix.G[0] / 100.0 + c.g * matrix.G[1] / 100.0 + c.b * matrix.G[2] / 100.0);
                cb = Math.round(c.r * matrix.B[0] / 100.0 + c.g * matrix.B[1] / 100.0 + c.b * matrix.B[2] / 100.0);

                bocr = Math.round(boc.r * matrix.R[0] / 100.0 + boc.g * matrix.R[1] / 100.0 + boc.b * matrix.R[2] / 100.0);
                bocg = Math.round(boc.r * matrix.G[0] / 100.0 + boc.g * matrix.G[1] / 100.0 + boc.b * matrix.G[2] / 100.0);
                bocb = Math.round(boc.r * matrix.B[0] / 100.0 + boc.g * matrix.B[1] / 100.0 + boc.b * matrix.B[2] / 100.0);

                a.cacheCSSProperties(["background-color", "color", "border-color"]);

                a.style.backgroundColor = "rgba(" + r + "," + g + "," + b + "," + bc.a + ")";
                a.style.color = "rgb(" + cr + "," + cg + "," + cb + ")";
                a.style.borderColor = "rgba(" + bocr + "," + bocg + "," + bocb + "," + boc.a + ")";
            });

        forall(VISUALS).do(
            function (a) {
                applyToImage(a, function (xy, rgba) {
                    if (!self.isActive) return;
                    type = properties["identifier"];
                    matrix = ColorMatrixMatrixes[type];
                    return {
                        r: rgba.r * matrix.R[0] / 100.0 + rgba.g * matrix.R[1] / 100.0 + rgba.b * matrix.R[2] / 100.0,
                        g: rgba.r * matrix.G[0] / 100.0 + rgba.g * matrix.G[1] / 100.0 + rgba.b * matrix.G[2] / 100.0,
                        b: rgba.r * matrix.B[0] / 100.0 + rgba.g * matrix.B[1] / 100.0 + rgba.b * matrix.B[2] / 100.0,
                        a: rgba.a
                    }
                }, true);
            });
        uk.org.adaptive.videoTools.apply((xy, rgba) => {
            if (!self.isActive) return;
            type = properties["identifier"];
            matrix = ColorMatrixMatrixes[type];
            return {
                r: rgba.r * matrix.R[0] / 100.0 + rgba.g * matrix.R[1] / 100.0 + rgba.b * matrix.R[2] / 100.0,
                g: rgba.r * matrix.G[0] / 100.0 + rgba.g * matrix.G[1] / 100.0 + rgba.b * matrix.G[2] / 100.0,
                b: rgba.r * matrix.B[0] / 100.0 + rgba.g * matrix.B[1] / 100.0 + rgba.b * matrix.B[2] / 100.0,
                a: rgba.a
            }
        }, true);
    }));


/* Colorspace transformation matrices */

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


/* Applies a colour blind shift to help relieve color blindness */

registerNSMethod(self, "daltonize", (
    function (properties) {

        if (applyingIdentity){
            if (lastCall == self.toXOriginFixes){
                consistentCalls++;
            }else{
                consistentCalls = 0;
            }
            lastCall = self.toXOriginFixes;

            debug(self.toXOriginFixes+" remain to be fixed");
            if (self.toXOriginFixes > 0 && consistentCalls < 3){
                setTimeout(function(){
                    self.daltonize(properties);
                }, 1000);
                return;
            }else{
                applyingIdentity = false;
            }
        }else{
            forall(VISUALS).where(a=> !a.originFix).do(a=>{
                self.toXOriginFixes ++;
                applyToImage(a, HARDIDENTITY, false, function(){
                        self.toXOriginFixes --;
                    }
                )});
            debug(self.toXOriginFixes+" remain to be fixed");
            lastCall = self.toXOriginFixes;
            if (self.toXOriginFixes>0){
                applyingIdentity = true;
                setTimeout(function(){
                    self.daltonize(properties);
                }, 1000);
                return;
            }
        }

        if (!verifyArgs(properties, [["identifier", STRINGTYPE]]))
            return false;

        self.isActive = true;

        let type = properties["identifier"];

        const multiply = function (a, b) {
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

        let limit = function (a) {
            if (a > 255) return 255;
            else if (a < 0) return 0;
            else return a;
        };

        forall(VISUALS).do(a => applyToImage(a, SOFTIDENTITY));

        targets().where(a => a instanceof HTMLElement).do(
            function (a) {

                if (!self.isActive) return;

                matrix = ColorMatrixMatrixes[type];

                bc = rgbaValue(extractColour(a, "backgroundColor"));
                c = rgbaValue(extractColour(a, "color"));
                boc = rgbaValue(extractColour(a, "border-color"));

                let LMSMatrix = multiply(rgb2lms, [[bc.r], [bc.g], [bc.b]]);
                let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);
                let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);
                let errorMatrix = [[Math.abs(bc.r - simulatedMatrix[0][0])], [Math.abs(bc.g - simulatedMatrix[1][0])], [Math.abs(bc.b - simulatedMatrix[2][0])]];
                let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];
                let fixedMatrix = multiply(modMatrix, errorMatrix);

                r = Math.round(limit(bc.r + fixedMatrix[0][0]));
                g = Math.round(limit(bc.g + fixedMatrix[1][0]));
                b = Math.round(limit(bc.b + fixedMatrix[2][0]));

                a.cacheCSSProperties(["background-color", "color", "border-color"]);
                a.style.backgroundColor = "rgba(" + r + "," + g + "," + b + "," + bc.a + ")";

                LMSMatrix = multiply(rgb2lms, [[c.r], [c.g], [c.b]]);
                colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);
                simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);
                errorMatrix = [[Math.abs(c.r - simulatedMatrix[0][0])], [Math.abs(c.g - simulatedMatrix[1][0])], [Math.abs(c.b - simulatedMatrix[2][0])]];
                fixedMatrix = multiply(modMatrix, errorMatrix);

                r = Math.round(limit(c.r + fixedMatrix[0][0]));
                g = Math.round(limit(c.g + fixedMatrix[1][0]));
                b = Math.round(limit(c.b + fixedMatrix[2][0]));

                a.style.color = "rgb(" + r + "," + g + "," + b + ")";

                LMSMatrix = multiply(rgb2lms, [[boc.r], [boc.g], [boc.b]]);
                colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);
                simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);
                errorMatrix = [[Math.abs(boc.r - simulatedMatrix[0][0])], [Math.abs(boc.g - simulatedMatrix[1][0])], [Math.abs(boc.b - simulatedMatrix[2][0])]];
                fixedMatrix = multiply(modMatrix, errorMatrix);

                r = Math.round(limit(boc.r + fixedMatrix[0][0]));
                g = Math.round(limit(boc.g + fixedMatrix[1][0]));
                b = Math.round(limit(boc.b + fixedMatrix[2][0]));

                a.style.borderColor = "rgba(" + r + "," + g + "," + b + "," + boc.a + ")";

            });

        forall(VISUALS).do(
            function (a) {
                applyToImage(a, function (xy, rgba) {
                    if (!self.isActive) return;

                    let LMSMatrix = multiply(rgb2lms, [[rgba.r], [rgba.g], [rgba.b]]);
                    let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);
                    let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);
                    let errorMatrix = [[Math.abs(rgba.r - simulatedMatrix[0][0])], [Math.abs(rgba.g - simulatedMatrix[1][0])], [Math.abs(rgba.b - simulatedMatrix[2][0])]];
                    let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];
                    let fixedMatrix = multiply(modMatrix, errorMatrix);

                    return {
                        r: limit(rgba.r + fixedMatrix[0][0]),
                        g: limit(rgba.g + fixedMatrix[1][0]),
                        b: limit(rgba.b + fixedMatrix[2][0]),
                        a: rgba.a
                    }
                }, true)
            });

        uk.org.adaptive.videoTools.apply((xy, rgba) => {
            if (!self.isActive) return;

            let LMSMatrix = multiply(rgb2lms, [[rgba.r], [rgba.g], [rgba.b]]);
            let colourBlindChangeMatrix = multiply(cb_matrices[type], LMSMatrix);
            let simulatedMatrix = multiply(lms2rgb, colourBlindChangeMatrix);
            let errorMatrix = [[Math.abs(rgba.r - simulatedMatrix[0][0])], [Math.abs(rgba.g - simulatedMatrix[1][0])], [Math.abs(rgba.b - simulatedMatrix[2][0])]];
            let modMatrix = [[0, 0, 0], [0.7, 1, 0], [0.7, 0, 1]];
            let fixedMatrix = multiply(modMatrix, errorMatrix);

            return {
                r: limit(rgba.r + fixedMatrix[0][0]),
                g: limit(rgba.g + fixedMatrix[1][0]),
                b: limit(rgba.b + fixedMatrix[2][0]),
                a: rgba.a
            }
        }, true);
    }));


/* Removes any active functions by resetting the HTML elements */

registerNSMethod(self, "remove", (
    function () {
        self.isActive = false;
        forall(VISUALS).do(function (a) {
            applyToImage(a, HARDIDENTITY)
        });
        uk.org.adaptive.videoTools.apply(HARDIDENTITY);
        forall().where(a => a instanceof HTMLElement).do(a => {
                a.resetCSS();
            }
        );
        return true;
    }
));


/* Scans elements based on breadth first search */

const targets = function (typ) {
    var output = [document.body];
    var queue = [document.body];
    var n;

    while (queue.length > 0) {
        n = queue.shift();
        if (!n.children) {
            continue;
        }
        for (var i = 0; i < n.children.length; i++) {
            queue.push(n.children[i]);
            if (typ == undefined || n.children[i].nodeName == typ.toString()) output.push(n.children[i]);
        }
    }
    return new Operable(output.reverse());
};
