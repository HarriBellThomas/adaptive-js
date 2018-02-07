registerNamespace("uk.org.adaptive.colourManipulations");

self.isActive = false;

registerNSMethod(self, "changeSaturation", (
  function (properties) {

    if (!verifyArgs(properties, [["factor", NUMTYPE]]))
      return false;

    if (self.isActive)
      self.remove();

    self.isActive = true;

    forall(IMAGES).do(
      function (a) {
        applyToImage(a, function () {

          if (!self.isActive) return;
          
          var value = properties["factor"];
          this.style.filter = "saturate(" + value + "%)";
        })
      });
  }
));

registerNSMethod(self, "remove", (
  function () {
    self.isActive = false;
    return true;
  }
));
