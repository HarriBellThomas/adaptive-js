registerNamespace("uk.org.adaptive.magnifier");

self.isActive = false;
self.isMagnifierOn = false;
self.magnifierSize = 200;
self.zoom = 1.75;
self.magnifyingGlass = undefined;

self.onMouseMove = function(e) {
   // If we don't have the screenshot yet then don't do anything
   if (typeof self.magnifyingGlass == "undefined") return;
   
   if (self.isMagnifierOn) {
      e.preventDefault();
      
      var x = e.pageX;
      var y = e.pageY;
      
      self.magnifyingGlass.style.top = (y - self.magnifierSize/2) + "px";
      self.magnifyingGlass.style.left = (x - self.magnifierSize/2) + "px";
      self.magnifyingGlass.style.backgroundPosition = (-(x * self.zoom - self.magnifierSize/2)) + "px" + " " + (-(y * self.zoom - self.magnifierSize/2)) + "px";
   }
}

self.onKeyDown = function(e) {
   // If we don't have the screenshot yet then don't do anything
   if (typeof self.magnifyingGlass == "undefined") return;
   
   if (e.keyCode === 17 && !self.isMagnifierOn) {
      document.body.appendChild(self.magnifyingGlass);
      self.isMagnifierOn = true;
   }
}

self.onKeyUp = function(e) {
   // If we don't have the screenshot yet then don't do anything
   if (typeof self.magnifyingGlass == "undefined") return;
   
   if (e.keyCode === 17 && self.isMagnifierOn) {
      self.magnifyingGlass.parentNode.removeChild(self.magnifyingGlass);
      self.isMagnifierOn = false;
   }
}

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
   window.addEventListener("mousemove", self.onMouseMove);
   window.addEventListener("keydown", self.onKeyDown);
   window.addEventListener("keyup", self.onKeyUp);
   
   // First, make all cross-domain images not cross domain
   forall(VISUALS).do(function(a) { applyToImage(a, function(xy, rgba) { return rgba; }); });
   
   // Take screenshot of page
   console.log("Loading screenshot library");
   var script = document.createElement("script");
   script.type = "text/javascript";
   script.async = true;
   script.onload = function() {
      console.log("Taking screenshot");
      html2canvas(document.body, { scale: self.zoom, logging: true }).then(function(c) {
         self.magnifyingGlass = document.createElement("div");
         self.magnifyingGlass.style.border = "3px solid #000";
         self.magnifyingGlass.style.borderRadius = "50%";
         self.magnifyingGlass.style.cursor = "none";
         self.magnifyingGlass.style.backgroundImage = "url(\"" + c.toDataURL("image/png") + "\")";
         self.magnifyingGlass.style.backgroundRepeat = "no-repeat";
         
         self.magnifyingGlass.style.position = "absolute";
         self.magnifyingGlass.style.top = (-self.magnifierSize) + "px";
         self.magnifyingGlass.style.left = (-self.magnifierSize) + "px";
         self.magnifyingGlass.style.width = self.magnifierSize + "px";
         self.magnifyingGlass.style.height = self.magnifierSize + "px";
         self.magnifyingGlass.style.zIndex = "10000";     // TODO: this is a *really* bad way of doing it
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