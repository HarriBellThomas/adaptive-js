registerNamespace("uk.org.adaptive.magnifier");

self.isActive = false;
const magnifierSize = 200;
const zoom = 1.75;

var isMagnifierOn = false;
var magnifyingGlass = undefined;
var mouseX = 0;
var mouseY = 0;

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
   window.addEventListener("mousemove", self.onMouseMove);
   window.addEventListener("keydown", self.onKeyDown);
   window.addEventListener("keyup", self.onKeyUp);
   
   // First, make all cross-domain images not cross domain
   // forall(VISUALS).do(function(a) { applyToImage(a, function(xy, rgba) { return {r: 255, g: 0, b: 0, a: rgba.a}; }); });
   
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
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   window.removeEventListener("mousemove", self.onMouseMove);
   window.removeEventListener("keydown", self.onKeyDown);
   window.removeEventListener("keyup", self.onKeyUp);
});

self.onMouseMove = function(e) {
   mouseX = e.pageX;
   mouseY = e.pageY;
   
   // If we don't have the screenshot yet then don't do anything
   if (typeof magnifyingGlass == "undefined") return;
   
   if (isMagnifierOn) updatePosition();
}

self.onKeyDown = function(e) {
   // If we don't have the screenshot yet then don't do anything
   if (typeof magnifyingGlass == "undefined") return;
   
   if (e.keyCode === 17 && !isMagnifierOn) {
      document.body.appendChild(magnifyingGlass);
      isMagnifierOn = true;
      updatePosition();
   }
}

self.onKeyUp = function(e) {
   // If we don't have the screenshot yet then don't do anything
   if (typeof magnifyingGlass == "undefined") return;
   
   if (e.keyCode === 17 && isMagnifierOn) {
      magnifyingGlass.parentNode.removeChild(magnifyingGlass);
      isMagnifierOn = false;
   }
}

const updatePosition = function() {
   magnifyingGlass.style.top = (mouseY - magnifierSize/2) + "px";
   magnifyingGlass.style.left = (mouseX - magnifierSize/2) + "px";
   magnifyingGlass.style.backgroundPosition = (-(mouseX * zoom - magnifierSize/2)) + "px" + " " + (-(mouseY * zoom - magnifierSize/2)) + "px";
};