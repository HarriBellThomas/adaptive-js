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

    self.isActive = true;

    limit = function(v) {
      if (v<0) return 0;
      if (v>255) return 255;
      return v;
    };

    value = properties["factor"];
    factor = (259*(value+255))/(255*(259-value));

    forall(VISUALS).do(
      function (a) {
        applyToImage(a, function (xy,rgba) {

          if (!self.isActive) return;

          return {
            r: Math.round(limit(factor*(rgba.r-128)+128)),
            g: Math.round(limit(factor*(rgba.g-128)+128)),
            b: Math.round(limit(factor*(rgba.b-128)+128)),
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

        bc = {r: Math.round(limit(factor*(bc.r-128)+128)), g: Math.round(limit(factor*(bc.g-128)+128)), b: Math.round(limit(factor*(bc.b-128)+128)), a: bc.a};
        c = {r: Math.round(limit(factor*(c.r-128)+128)), g: Math.round(limit(factor*(c.g-128)+128)), b: Math.round(limit(factor*(c.b-128)+128)), a: c.a};
        boc = {r: Math.round(limit(factor*(boc.r-128)+128)), g: Math.round(limit(factor*(boc.g-128)+128)), b: Math.round(limit(factor*(boc.b-128)+128)), a: boc.a};

        try {
          a.cacheCSSProperties(["background-color"]);
          a.cacheCSSProperties(["color"]);
          a.cacheCSSProperties(["border-color"]);

        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
        a.style.backgroundColor = "rgba("+bc.r+","+bc.g+","+bc.b+","+bc.a+")";
        a.style.color = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
        a.style.borderColor = "rgba("+boc.r+","+boc.g+","+boc.b+","+boc.a+")";
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

          return {
            r: rgba.r + Math.round(value),
            g: rgba.g + Math.round(value),
            b: rgba.b + Math.round(value),
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

        bc.r = bc.r + Math.round(value);
        bc.g = bc.g + Math.round(value);
        bc.b = bc.b + Math.round(value);

        c.r = c.r + Math.round(value);
        c.g = c.g + Math.round(value);
        c.b = c.b + Math.round(value);

        boc.r = boc.r + Math.round(value);
        boc.g = boc.g + Math.round(value);
        boc.b = boc.b + Math.round(value);

        try {
          a.cacheCSSProperties(["background-color"]);
          a.cacheCSSProperties(["color"]);
          a.cacheCSSProperties(["border-color"]);

        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
        a.style.backgroundColor = "rgba("+bc.r+","+bc.g+","+bc.b+","+bc.a+")";
        a.style.color = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
        a.style.borderColor = "rgba("+boc.r+","+boc.g+","+boc.b+","+boc.a+")";
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
