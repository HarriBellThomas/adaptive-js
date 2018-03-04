registerNamespace("uk.org.adaptive.magnifier");

self.isActive = false;
var magnifierSize = 200;
var zoom = 1.75;

var isMagnifierOn = false;
var magnifyingGlass = undefined;
var mouseX = 0;
var mouseY = 0;
var takingScreenshot = false;

registerNSMethod(self, "apply", function(properties) {
   if (!verifyArgs(properties, [["size", NUMTYPE], ["zoom", NUMTYPE]])) return false;
   if (self.isActive) self.remove();

   self.isActive = true;
   magnifierSize = properties["size"];
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
   
   // Take another screenshot on window resize
   window.addEventListener("resize", takeScreenshot);

   // Take screenshot of page
   console.log("Loading screenshot library");
   var script = document.createElement("script");
   script.type = "text/javascript";
   script.async = true;
   script.onload = takeScreenshot;
   script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
   document.getElementsByTagName("head")[0].appendChild(script);

   return true;
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   window.removeEventListener("resize", takeScreenshot);
});

const takeScreenshot = function() {
   if (takingScreenshot) {
      // If we're in the middle of taking a screenshot then try again in 2 seconds
      setTimeout(takeScreenshot, 2000);
   } else {
      console.log("Taking screenshot");
      takingScreenshot = true;
      html2canvas(document.body, { proxy:"https://js.adaptive.org.uk/helpers/canvas.php", scale: zoom, logging: true }).then(function(c) {
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
         
         takingScreenshot = false;
      });
   }
}

const updatePosition = function() {
   magnifyingGlass.style.top = (mouseY - magnifierSize/2) + "px";
   magnifyingGlass.style.left = (mouseX - magnifierSize/2) + "px";
   magnifyingGlass.style.backgroundPosition = (-(mouseX * zoom - magnifierSize/2)) + "px" + " " + (-(mouseY * zoom - magnifierSize/2)) + "px";
};
