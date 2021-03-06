registerNamespace("uk.org.adaptive.colourManipulations");

self.isActive = false;

var applyingIdentity = false;
self.toXOriginFixes = 0;
var consistentCalls = 0;
var lastCall = 0;

if (rgbaValue(extractColour(document.body, "backgroundColor")).a === 0) document.body.style.backgroundColor = "rgba(255,255,255,1)";

/* apply method depending on user selected parameters */

registerNSMethod(self, "apply", (
    function (properties) {
        if ("changeSaturation" in properties) self.changeSaturation(properties["changeSaturation"]);
        if ("changeContrast" in properties) self.changeContrast(properties["changeContrast"]);
        if ("changeBrightness" in properties) self.changeBrightness(properties["changeBrightness"]);
        if ("nightShifter" in properties) self.nightShifter();
        if ("invert" in properties) self.invert();
        return true;
    }
));

/* Changing saturation of page elements */

registerNSMethod(self, "changeSaturation", (
    function (properties) {

        if (!verifyArgs(properties, [["factor", NUMTYPE]]))
            return false;

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
                    self.changeSaturation(properties);
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
                    self.changeSaturation(properties);
                }, 1000);
                return;
            }
        }

        self.isActive = true;

        limit = function (v) {
            if (v < 0) return 0;
            if (v > 1) return 1;
            return v;
        };

        value = properties["factor"];

        targets().where(a => a instanceof HTMLElement).do(
            function (a) {
                if (!self.isActive) return;

                img = window.getComputedStyle(a, null).backgroundImage;
                if (img.valueOf() != "none") {
                    a.cacheCSSProperties(["style.backgroundImage"]);
                    a.style.backgroundImage = "none";
                }
                bc = rgbaValue(extractColour(a, "backgroundColor"));
                c = rgbaValue(extractColour(a, "color"));
                boc = rgbaValue(extractColour(a, "border-color"));

                bchsl = rgbToHsl(bc.r, bc.g, bc.b);
                chsl = rgbToHsl(c.r, c.g, c.b);
                bochsl = rgbToHsl(boc.r, boc.g, boc.b);

                bchsl[1] = limit(bchsl[1] * value);
                chsl[1] = limit(chsl[1] * value);
                bochsl[1] = limit(bochsl[1] * value);

                rgb1 = hslToRgb(bchsl[0], bchsl[1], bchsl[2]);
                rgb2 = hslToRgb(chsl[0], chsl[1], chsl[2]);
                rgb3 = hslToRgb(bochsl[0], bochsl[1], bochsl[2]);

                a.cacheCSSProperties(["background-color", "color", "border-color"]);

                a.style.backgroundColor = "rgba(" + Math.round(rgb1[0]) + "," + Math.round(rgb1[1]) + "," + Math.round(rgb1[2]) + "," + bc.a + ")";
                a.style.color = "rgb(" + Math.round(rgb2[0]) + "," + Math.round(rgb2[1]) + "," + Math.round(rgb2[2])+")";
                a.style.borderColor = "rgba(" + Math.round(rgb3[0]) + "," + Math.round(rgb3[1]) + "," + Math.round(rgb3[2]) + "," + boc.a + ")";
            }
        );

        forall(VISUALS).do(
            function (a) {
                applyToImage(a, function (xy, rgba) {

                    if (!self.isActive) return;

                    hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
                    hsl[1] = limit(hsl[1] * value);

                    rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
                    return {
                        r: Math.round(rgb[0]),
                        g: Math.round(rgb[1]),
                        b: Math.round(rgb[2]),
                        a: rgba.a
                    }
                }, true);
            }
        );

        uk.org.adaptive.videoTools.apply((xy, rgba) => {

            if (!self.isActive) return;

            hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
            hsl[1] = limit(hsl[1] * value);

            rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
            return {
                r: Math.round(rgb[0]),
                g: Math.round(rgb[1]),
                b: Math.round(rgb[2]),
                a: rgba.a
            }
        }, true);
    }
));


/* Change contrast of page elements */

registerNSMethod(self, "changeContrast", (
    function (properties) {

        if (!verifyArgs(properties, [["factor", NUMTYPE]]))
            return false;

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
                    self.changeContrast(properties);
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
                    self.changeContrast(properties);
                }, 1000);
                return;
            }
        }

        self.isActive = true;

        limit = function (v) {
            if (v < 0) return 0;
            if (v > 255) return 255;
            return v;
        };

        value = properties["factor"];
        factor = (259 * (value + 255)) / (255 * (259 - value));

        targets().where(a => a instanceof HTMLElement).do(
            function (a) {
                if (!self.isActive) return;

                img = window.getComputedStyle(a, null).backgroundImage;
                if (img.valueOf() != "none") {
                    a.cacheCSSProperties(["style.backgroundImage"]);
                    a.style.backgroundImage = "none";
                }
                bc = rgbaValue(extractColour(a, "backgroundColor"));
                c = rgbaValue(extractColour(a, "color"));
                boc = rgbaValue(extractColour(a, "border-color"));

                bc = {
                    r: Math.round(limit(factor * (bc.r - 128) + 128)),
                    g: Math.round(limit(factor * (bc.g - 128) + 128)),
                    b: Math.round(limit(factor * (bc.b - 128) + 128)),
                    a: bc.a
                };
                c = {
                    r: Math.round(limit(factor * (c.r - 128) + 128)),
                    g: Math.round(limit(factor * (c.g - 128) + 128)),
                    b: Math.round(limit(factor * (c.b - 128) + 128)),
                    a: c.a
                };
                boc = {
                    r: Math.round(limit(factor * (boc.r - 128) + 128)),
                    g: Math.round(limit(factor * (boc.g - 128) + 128)),
                    b: Math.round(limit(factor * (boc.b - 128) + 128)),
                    a: boc.a
                };

                a.cacheCSSProperties(["background-color", "color", "border-color"]);

                a.style.backgroundColor = "rgba(" + bc.r + "," + bc.g + "," + bc.b + "," + bc.a + ")";
                a.style.color = "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
                a.style.borderColor = "rgba(" + boc.r + "," + boc.g + "," + boc.b + "," + boc.a + ")";
            }
        );

        forall(VISUALS).do(
            function (a) {
                applyToImage(a, function (xy, rgba) {

                    if (!self.isActive) return;

                    return {
                        r: Math.round(limit(factor * (rgba.r - 128) + 128)),
                        g: Math.round(limit(factor * (rgba.g - 128) + 128)),
                        b: Math.round(limit(factor * (rgba.b - 128) + 128)),
                        a: rgba.a
                    }
                }, true)
            }
        );

        uk.org.adaptive.videoTools.apply((xy, rgba) => {

            if (!self.isActive) return;

            return {
                r: Math.round(limit(factor * (rgba.r - 128) + 128)),
                g: Math.round(limit(factor * (rgba.g - 128) + 128)),
                b: Math.round(limit(factor * (rgba.b - 128) + 128)),
                a: rgba.a
            }
        }, true);
    }
));


/* Change brightness of page elements */

registerNSMethod(self, "changeBrightness", (
    function (properties) {

        if (!verifyArgs(properties, [["factor", NUMTYPE]]))
            return false;

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
                    self.changeBrightness(properties);
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
                    self.changeBrightness(properties);
                }, 1000);
                return;
            }
        }

        self.isActive = true;
        value = properties["factor"];

        limit = function (v) {
            if (v < 0) return 0;
            if (v > 1) return 1;
            return v;
        };

        targets().where(a => a instanceof HTMLElement).do(
            function (a) {
                if (!self.isActive) return;

                img = window.getComputedStyle(a, null).backgroundImage;
                if (img.valueOf() != "none") {
                    a.cacheCSSProperties(["style.backgroundImage"]);
                    a.style.backgroundImage = "none";
                }
                bc = rgbaValue(extractColour(a, "backgroundColor"));
                c = rgbaValue(extractColour(a, "color"));
                boc = rgbaValue(extractColour(a, "border-color"));

                bc = {r: bc.r + Math.round(value), g: bc.g + Math.round(value), b: bc.b + Math.round(value), a: bc.a};
                c = {r: c.r + Math.round(value), g: c.g + Math.round(value), b: c.b + Math.round(value), a: c.a};
                boc = {r: boc.r + Math.round(value), g: boc.g + Math.round(value), b: boc.b + Math.round(value), a: boc.a};

                a.cacheCSSProperties(["background-color", "color", "border-color"]);

                a.style.backgroundColor = "rgba(" + bc.r + "," + bc.g + "," + bc.b + "," + bc.a + ")";
                a.style.color = "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
                a.style.borderColor = "rgba(" + boc.r + "," + boc.g + "," + boc.b + "," + boc.a + ")";
            }
        );

        forall(VISUALS).do(
            function (a) {
                applyToImage(a, function (xy, rgba) {

                    if (!self.isActive) return;

                    return {
                        r: rgba.r + Math.round(value),
                        g: rgba.g + Math.round(value),
                        b: rgba.b + Math.round(value),
                        a: rgba.a
                    }
                }, true)
            }
        );

        uk.org.adaptive.videoTools.apply((xy, rgba) => {

            if (!self.isActive) return;

            return {
                r: rgba.r + Math.round(value),
                g: rgba.g + Math.round(value),
                b: rgba.b + Math.round(value),
                a: rgba.a
            }
        }, true);
    }
));


/* Invert colour of page elements */

registerNSMethod(self, "invert", (
    function () {

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
                    self.invert();
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
                    self.invert();
                }, 1000);
                return;
            }
        }

        self.isActive = true;

        targets().where(a => a instanceof HTMLElement).do(
            function (a) {
                if (!self.isActive) return;

                img = window.getComputedStyle(a, null).backgroundImage;
                if (img.valueOf() != "none") {
                    a.cacheCSSProperties(["style.backgroundImage"]);
                    a.style.backgroundImage = "none";
                }
                bc = rgbaValue(extractColour(a, "backgroundColor"));
                c = rgbaValue(extractColour(a, "color"));
                boc = rgbaValue(extractColour(a, "border-color"));

                bc = {r: 255 - bc.r, g: 255 - bc.g, b: 255 - bc.b, a: bc.a};
                c = {r: 255 - c.r, g: 255 - c.g, b: 255 - c.b, a: (c.a == 0) ? 1 : c.a};
                boc = {r: 255 - boc.r, g: 255 - boc.g, b: 255 - boc.b, a: boc.a};

                a.cacheCSSProperties(["background-color", "color", "border-color"]);

                a.style.backgroundColor = "rgba(" + bc.r + "," + bc.g + "," + bc.b + "," + bc.a + ")";
                a.style.color = "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
                a.style.borderColor = "rgba(" + boc.r + "," + boc.g + "," + boc.b + "," + boc.a + ")";
            }
        )

        forall(VISUALS).do(
            function (a) {
                applyToImage(a, function (xy, rgba) {

                    if (!self.isActive) return;

                    return {
                        r: 255 - rgba.r,
                        g: 255 - rgba.g,
                        b: 255 - rgba.b,
                        a: rgba.a
                    }
                }, true)
            }
        );

        uk.org.adaptive.videoTools.apply((xy, rgba) => {

            if (!self.isActive) return;

            return {
                r: 255 - rgba.r,
                g: 255 - rgba.g,
                b: 255 - rgba.b,
                a: rgba.a
            }
        }, true);
    }
));


/* Apply night shift function to reduce blue hue during the night */

registerNSMethod(self, "nightShifter", (
    function () {

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
                    self.nightShifter();
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
                    self.nightShifter();
                }, 1000);
                return;
            }
        }

        self.isActive = true;

        limit = function (v) {
            if (v < 0) return 0;
            if (v > 1) return 1;
            return v;
        };

        date = new Date();
        sevenPM = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 19, 0, 0);
        sevenAM = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7, 0, 0);
        timeUntilPM = sevenPM.getTime() - date.getTime();
        timeUntilAM = sevenAM.getTime() - date.getTime();

        if (timeUntilAM < 0 && timeUntilPM > 0) {
            forall(VISUALS).do(
                function (a) {
                    applyToImage(a, SOFTIDENTITY, true);
                    img = window.getComputedStyle(a, null).backgroundImage;
                    if (img.valueOf() != "none") {
                        a.cacheCSSProperties(["style.backgroundImage"]);
                    }
                });
        }

        const apply = function (value) {
            targets().where(a => a instanceof HTMLElement).do(
                function (a) {
                    if (!self.isActive) self.remove();
                    self.isActive = true;

                    bc = rgbaValue(extractColour(a, "backgroundColor"));
                    c = rgbaValue(extractColour(a, "color"));
                    boc = rgbaValue(extractColour(a, "border-color"));

                    bc.b = bc.b + Math.round(value);
                    c.b = c.b + Math.round(value);
                    boc.b = boc.b + Math.round(value);

                    a.cacheCSSProperties(["background-color", "color", "border-color"]);

                    a.style.backgroundColor = "rgba(" + bc.r + "," + bc.g + "," + bc.b + "," + bc.a + ")";
                    a.style.color = "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
                    a.style.borderColor = "rgba(" + boc.r + "," + boc.g + "," + boc.b + "," + boc.a + ")";
                });

            forall(VISUALS).do(
                function (a) {
                    applyToImage(a, function (xy, rgba) {

                        if (!self.isActive) return;

                        return {
                            r: rgba.r,
                            g: rgba.g,
                            b: rgba.b + Math.round(value),
                            a: rgba.a
                        }
                    }, true)
                }
            );

            uk.org.adaptive.videoTools.apply((xy, rgba) => {

                if (!self.isActive) return;

                return {
                    r: rgba.r,
                    g: rgba.g,
                    b: rgba.b + Math.round(value),
                    a: rgba.a
                }
            }, true);
            return true;
        };

        const applyVisuals = function (value) {
            forall(VISUALS).where(a => window.getComputedStyle(a).backgroundImage.valueOf() != "none").do(
                function (a) {
                    applyToImage(a, function (xy, rgba) {

                        if (!self.isActive) return;

                        return {
                            r: rgba.r,
                            g: rgba.g,
                            b: rgba.b + Math.round(value),
                            a: rgba.a
                        }
                    }, true)
                }
            );
            return true;
        };

        /* Applies the nightShift function depending on the current time of Day */

        const fadeIn = function (number, init) {
            window.setTimeout(function () {
                if (number > 0) {
                    apply(-2);
                    applyVisuals(number - 2 * init);
                    fadeIn(number - 2, init);
                }
            }, 1000)
        };
        const fadeOut = function (number) {
            window.setTimeout(function () {
                if (number > 0) {
                    if (apply(2)) ;
                    applyVisuals(0 - 2 * number);
                    fadeOut(number - 2);
                }
            }, 1000)
        };

        if (timeUntilAM < 0 && timeUntilPM > 0) {
            window.setTimeout(function () {
                fadeIn(25, 25);
            }, timeUntilPM);
        } else if (timeUntilAM < 0 && timeUntilPM < 0) {
            apply(-25);
            applyVisuals(-25);
        } else {
            apply(-25);
            applyVisuals(-25);
            window.setTimeout(function () {
                fadeOut(25);
            }, timeUntilAM);
        }
        ;

    }
));


/* Remove function to reset the manipulated HTML elements */

registerNSMethod(self, "remove", (
    function () {
        if (!self.isActive) return true;
        self.isActive = false;
        forall(VISUALS).do(function (a) {
            applyToImage(a, HARDIDENTITY)
        });
        uk.org.adaptive.videoTools.apply(HARDIDENTITY);
        forall().where(a => a instanceof HTMLElement).do(function (a) {
            a.resetCSS();
        });
        return true;
    }
));


/* Scans through elements based on breadth first search */

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
