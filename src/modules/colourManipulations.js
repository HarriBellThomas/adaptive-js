registerNamespace("uk.org.adaptive.colourManipulations");

self.isActive = false;

registerNSMethod(self, "changeSaturation", (
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
          filterString = "saturate("+value+")";
          a.style.filter = filterString;
        })
      });
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

    return true;
  }
));
