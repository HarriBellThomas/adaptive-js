registerNamespace("uk.org.adaptive.colourManipulations");

self.isActive = false;

registerNSMethod(self, "changeSaturation", (
  function (properties) {

    if (!verifyArgs(properties, [["factor", NUMTYPE]]))
      return false;

    if (self.isActive)
      self.remove();

    self.isActive = true;

    limit = function(v) {
      if (v<0) return 0;
      if (v>1) return 1;
      return v;
    };

    value = properties["factor"];

    forall(VISUALS).do(
      function (a) {
        applyToImage(a, function (xy,rgba) {

          if (!self.isActive) return;

          hsl = rgbToHsl(rgba.r,rgba.g,rgba.b);
          hsl[1] = limit(hsl[1]*value);

          rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
          return {
            r: Math.round(rgb[0]),
            g: Math.round(rgb[1]),
            b: Math.round(rgb[2]),
            a: rgba.a
          }
        })
      });

    forall().do(
      function (a) {
        if (!self.isActive) return;

        bc = rgbaValue(extractColour(a, "backgroundColor"));
        c = rgbaValue(extractColour(a, "color"));
        boc = rgbaValue(extractColour(a, "border-color"));

        bchsl = rgbToHsl(bc.r,bc.g,bc.b);
        chsl = rgbToHsl(c.r,c.g,c.b);
        bochsl = rgbToHsl(boc.r,boc.g,boc.b);

        bchsl[1] = limit(bchsl[1]*value);
        chsl[1] = limit(chsl[1]*value);
        bochsl[1] = limit(bochsl[1]*value);

        rgb1 = hslToRgb(bchsl[0],bchsl[1],bchsl[2]);
        rgb2 = hslToRgb(chsl[0],chsl[1],chsl[2]);
        rgb3 = hslToRgb(bochsl[0],bochsl[1],bochsl[2]);

        try {
          a.cacheCSSProperties(["background-color"]);
          a.cacheCSSProperties(["color"]);
          a.cacheCSSProperties(["border-color"]);

        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
        a.style.backgroundColor = "rgba("+Math.round(rgb1[0])+","+Math.round(rgb1[1])+","+Math.round(rgb1[2])+","+bc.a+")";
        a.style.color = "rgba("+Math.round(rgb2[0])+","+Math.round(rgb2[1])+","+Math.round(rgb2[2])+","+c.a+")";
        a.style.borderColor = "rgba("+Math.round(rgb3[0])+","+Math.round(rgb3[1])+","+Math.round(rgb3[2])+","+boc.a+")";
      }
    )
  }
));

registerNSMethod(self, "changeContrast", (
  function (properties) {

    if (!verifyArgs(properties, [["factor", NUMTYPE]]))
      return false;

    if (self.isActive)
      self.remove();

    limit = function(v) {
      if (v<0) return 0;
      if (v>1) return 1;
      return v;
    };

    value = properties["factor"];

    forall(VISUALS).do(
      function (a) {
        applyToImage(a, function (xy,rgba) {

          if (!self.isActive) return;

          hsl = rgbToHsl(rgba.r,rgba.g,rgba.b);
          hsl[1] = limit(hsl[1]*value);

          rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
          return {
            r: Math.round(rgb[0]),
            g: Math.round(rgb[1]),
            b: Math.round(rgb[2]),
            a: rgba.a
          }
        })
      });

    forall().do(
      function (a) {
        if (!self.isActive) return;

        bc = rgbaValue(extractColour(a, "backgroundColor"));
        c = rgbaValue(extractColour(a, "color"));
        boc = rgbaValue(extractColour(a, "border-color"));

        bchsl = rgbToHsl(bc.r,bc.g,bc.b);
        chsl = rgbToHsl(c.r,c.g,c.b);
        bochsl = rgbToHsl(boc.r,boc.g,boc.b);

        bchsl[1] = limit(bchsl[1]*value);
        chsl[1] = limit(chsl[1]*value);
        bochsl[1] = limit(bochsl[1]*value);

        rgb1 = hslToRgb(bchsl[0],bchsl[1],bchsl[2]);
        rgb2 = hslToRgb(chsl[0],chsl[1],chsl[2]);
        rgb3 = hslToRgb(bochsl[0],bochsl[1],bochsl[2]);

        try {
          a.cacheCSSProperties(["background-color"]);
          a.cacheCSSProperties(["color"]);
          a.cacheCSSProperties(["border-color"]);

        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
        a.style.backgroundColor = "rgba("+Math.round(rgb1[0])+","+Math.round(rgb1[1])+","+Math.round(rgb1[2])+","+bc.a+")";
        a.style.color = "rgba("+Math.round(rgb2[0])+","+Math.round(rgb2[1])+","+Math.round(rgb2[2])+","+c.a+")";
        a.style.borderColor = "rgba("+Math.round(rgb3[0])+","+Math.round(rgb3[1])+","+Math.round(rgb3[2])+","+boc.a+")";
      }
    )
  }
));

registerNSMethod(self, "changeBrightness", (
  function (properties) {

    if (!verifyArgs(properties, [["factor", NUMTYPE]]))
      return false;

    if (self.isActive)
      self.remove();

    self.isActive = true;

    limit = function(v) {
      if (v<0) return 0;
      if (v>1) return 1;
      return v;
    };

    value = properties["factor"];

    forall(VISUALS).do(
      function (a) {
        applyToImage(a, function (xy,rgba) {

          if (!self.isActive) return;

          hsl = rgbToHsl(rgba.r,rgba.g,rgba.b);
          hsl[2] = limit(hsl[2]*value);

          rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
          return {
            r: Math.round(rgb[0]),
            g: Math.round(rgb[1]),
            b: Math.round(rgb[2]),
            a: rgba.a
          }
        })
      });

    forall().do(
      function (a) {
        if (!self.isActive) return;

        bc = rgbaValue(extractColour(a, "backgroundColor"));
        c = rgbaValue(extractColour(a, "color"));
        boc = rgbaValue(extractColour(a, "border-color"));

        bchsl = rgbToHsl(bc.r,bc.g,bc.b);
        chsl = rgbToHsl(c.r,c.g,c.b);
        bochsl = rgbToHsl(boc.r,boc.g,boc.b);

        bchsl[2] = limit(bchsl[2]*value);
        chsl[2] = limit(chsl[2]*value);
        bochsl[2] = limit(bochsl[2]*value);

        rgb1 = hslToRgb(bchsl[0],bchsl[1],bchsl[2]);
        rgb2 = hslToRgb(chsl[0],chsl[1],chsl[2]);
        rgb3 = hslToRgb(bochsl[0],bochsl[1],bochsl[2]);

        try {
          a.cacheCSSProperties(["background-color"]);
          a.cacheCSSProperties(["color"]);
          a.cacheCSSProperties(["border-color"]);

        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
        a.style.backgroundColor = "rgba("+Math.round(rgb1[0])+","+Math.round(rgb1[1])+","+Math.round(rgb1[2])+","+bc.a+")";
        a.style.color = "rgba("+Math.round(rgb2[0])+","+Math.round(rgb2[1])+","+Math.round(rgb2[2])+","+c.a+")";
        a.style.borderColor = "rgba("+Math.round(rgb3[0])+","+Math.round(rgb3[1])+","+Math.round(rgb3[2])+","+boc.a+")";
      }
    )
  }
));

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
