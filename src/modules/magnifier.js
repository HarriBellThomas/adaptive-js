registerNamespace("uk.org.adaptive.magnifier");

self.isActive = false;
var magnifierSize = 200;
var zoom = 1.75;

var isMagnifierOn = false;
var magnifyingGlass = undefined;
var mouseX = 0;
var mouseY = 0;

registerNSMethod(self, "apply", function(properties) {
   if (!verifyArgs(properties, [["magnifierSize", NUMTYPE], ["zoom", NUMTYPE]])) return false;
   if (self.isActive) self.remove();
   
   self.isActive = true;
   magnifierSize = properties["magnifierSize"];
   zoom = properties["zoom"];
   
   doOnMouseMove(function(x, y) {
      mouseX = x;
      mouseY = y;
      
      // If we don't have the screenshot yet then don't do anything
      if (typeof magnifyingGlass == "undefined" || !self.isActive) return;
      
      if (isMagnifierOn) updatePosition();
   });

   doOnKeyDown(17, function(e) {
      // If we don't have the screenshot yet then don't do anything
      if (typeof magnifyingGlass == "undefined" || !self.isActive) return;
      
      if (!isMagnifierOn) {
         document.body.appendChild(magnifyingGlass);
         isMagnifierOn = true;
         updatePosition();
      }
   });

   doOnKeyUp(17, function(e) {
      // If we don't have the screenshot yet then don't do anything
      if (typeof magnifyingGlass == "undefined" || !self.isActive) return;
      
      if (isMagnifierOn) {
         magnifyingGlass.parentNode.removeChild(magnifyingGlass);
         isMagnifierOn = false;
      }
   });
   
   // First, make all cross-domain images not cross domain
   forall(VISUALS).do(function(a) { applyToImage(a, SOFTIDENTITY); });
   
   // Take screenshot of page
   console.log("Loading screenshot library");
   var script = document.createElement("script");
   script.type = "text/javascript";
   script.async = true;
   script.onload = function() {
      console.log("Taking screenshot");
      html2canvas(document.body, { scale: zoom, logging: true }).then(function(c) {
         magnifyingGlass = document.createElement("div");
         magnifyingGlass.style.border = "3px solid #000";
         magnifyingGlass.style.borderRadius = "50%";
         magnifyingGlass.style.cursor = "none";
         magnifyingGlass.style.backgroundImage = "url(\"" + c.toDataURL("image/png") + "\")";
         magnifyingGlass.style.backgroundRepeat = "no-repeat";
         
         magnifyingGlass.style.position = "absolute";
         magnifyingGlass.style.top = (-magnifierSize) + "px";
         magnifyingGlass.style.left = (-magnifierSize) + "px";
         magnifyingGlass.style.width = magnifierSize + "px";
         magnifyingGlass.style.height = magnifierSize + "px";
         magnifyingGlass.style.zIndex = "999999999";
      });
   };
   script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
   document.getElementsByTagName("head")[0].appendChild(script);
   
   return true;
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
});

const updatePosition = function() {
   magnifyingGlass.style.top = (mouseY - magnifierSize/2) + "px";
   magnifyingGlass.style.left = (mouseX - magnifierSize/2) + "px";
   magnifyingGlass.style.backgroundPosition = (-(mouseX * zoom - magnifierSize/2)) + "px" + " " + (-(mouseY * zoom - magnifierSize/2)) + "px";
};