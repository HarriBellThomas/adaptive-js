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

          rgb = hslToRgb(hsl);
          return {
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
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

        rgb1 = hslToRgb(bchsl);
        rgb2 = hslToRgb(chsl);
        rgb3 = hslToRgb(bochsl);

        try {
          a.cacheCSSProperties(["background-color"]);
          a.cacheCSSProperties(["color"]);
          a.cacheCSSProperties(["border-color"]);

        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
        a.style.backgroundColor = "rgba("+rgb1[0]+","+rgb1[1]+","+rgb1[2]+","+bc.a+")";
        a.style.color = "rgba("+rgb2[0]+","+rgb2[1]+","+rgb2[2]+","+c.a+")";
        a.style.borderColor = "rgba("+rgb3[0]+","+rgb3[1]+","+rgb3[2]+","+boc.a+")";
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

    forall(VISUALS).do(
      function (a) {
        applyToImage(a, function () {

          if (!self.isActive) return;

          value = properties["factor"];
          filterString = "contrast("+value+")";
          a.style.filter = filterString;
        })
      });
  }
));

registerNSMethod(self, "changeBrightness", (
  function (properties) {

    if (!verifyArgs(properties, [["factor", NUMTYPE]]))
      return false;

    if (self.isActive)
      self.remove();

    self.isActive = true;

    forall(VISUALS).do(
      function (a) {
        applyToImage(a, function () {

          if (!self.isActive) return;

          value = properties["factor"];
          filterString = "brightness("+value+")";
          a.style.filter = filterString;
        })
      });
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
    });
    return true;
  }
));
