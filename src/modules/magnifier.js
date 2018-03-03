registerNamespace("uk.org.adaptive.magnifier");

self.isActive = false;
self.isMagnifierOn = false;
self.magnifierSize = 200;
self.zoom = 1.75;
self.screenshot = undefined;

self.onMouseMove = function(e) {
   // If we don't have the screenshot yet then don't do anything
   if (typeof self.screenshot == "undefined") return;
   
   if (self.isMagnifierOn) {
      e.preventDefault();
      
      var glass = document.getElementById("uk-org-adaptive-magnifier");
      var x = e.pageX;
      var y = e.pageY;
      
      glass.style.top = (y - self.magnifierSize/2) + "px";
      glass.style.left = (x - self.magnifierSize/2) + "px";
      glass.style.backgroundPosition = (-(x * self.zoom - self.magnifierSize/2)) + "px" + " " + (-(y * self.zoom - self.magnifierSize/2)) + "px";
   }
}

self.onKeyDown = function(e) {
   // If we don't have the screenshot yet then don't do anything
   if (typeof self.screenshot == "undefined") return;
   
   if (e.keyCode === 17 && !self.isMagnifierOn) {
      self.showMagnifier();
      self.isMagnifierOn = true;
   }
}

self.onKeyUp = function(e) {
   // If we don't have the screenshot yet then don't do anything
   if (typeof self.screenshot == "undefined") return;
   
   if (e.keyCode === 17 && self.isMagnifierOn) {
      self.hideMagnifier();
      self.isMagnifierOn = false;
   }
}

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
   window.addEventListener("mousemove", self.onMouseMove);
   window.addEventListener("keydown", self.onKeyDown);
   window.addEventListener("keyup", self.onKeyUp);
   
   // Take screenshot of page
   console.log("Including screenshot library");
   var lib = document.createElement("script");
   lib.src = "http://html2canvas.hertzen.com/dist/html2canvas.min.js";
   document.body.appendChild(lib);
   
   console.log("Taking screenshot");
   html2canvas(document.body, { scale: self.zoom, logging: true }).then(function(c) {
      self.screenshot = c.toDataURL("image/png");
   });
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   window.removeEventListener("mousemove", self.onMouseMove);
   window.removeEventListener("keydown", self.onKeyDown);
   window.removeEventListener("keyup", self.onKeyUp);
});

registerNSMethod(self, "showMagnifier", function() {
   // If we don't have the screenshot yet then don't do anything
   if (typeof self.screenshot == "undefined") return;
   
   console.log("Showing magnifier");
});

registerNSMethod(self, "hideMagnifier", function() {
   // If we don't have the screenshot yet then don't do anything
   if (typeof self.screenshot == "undefined") return;
   
   console.log("Hiding magnifier");
});