registerNamespace("uk.org.adaptive.showMouse");

self.circle;
self.isActive = false;
self.speed = "fast";

self.mouseX = undefined;
self.mouseY = undefined;
var keyDown = false;
var performingAnimation = false;

registerNSMethod(self, "apply", function(properties) {
   if (!verifyArgs(properties, [["speed", STRINGTYPE]])) return false;
   if (self.isActive) self.remove();
   
   self.isActive = true;
   self.speed = properties["speed"];
   
   doOnMouseMove(function(x, y) {
      self.mouseX = x;
      self.mouseY = y;
   });

   doOnKeyDown(17, function(e) {
      if (!keyDown) {
         self.showMouse();
         keyDown = true;
      }
   });

   doOnKeyUp(17, function(e) {
      keyDown = false;
   });
   
   return true;
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
});

registerNSMethod(self, "showMouse", function() {
   if (typeof self.mouseX == "undefined" || typeof self.mouseY == "undefined" || performingAnimation || !self.isActive) return false;
   debug("Showing mouse at X: " + self.mouseX + ", Y: " + self.mouseY);
   
   var startSize = 400;
   var borderWidth = 8;
   var delta = 5;
   
   self.circle = document.createElement("div");
   self.circle.style.border = borderWidth + "px solid #000";
   self.circle.style.borderRadius = "50%";
   self.circle.style.zIndex = "999999999";
   self.circle.style.position = "absolute";
   self.circle.style.top = (self.mouseY - startSize/2) + "px";
   self.circle.style.left = (self.mouseX - startSize/2) + "px";
   self.circle.style.width = startSize + "px";
   self.circle.style.height = startSize + "px";
   document.body.appendChild(self.circle);
   
   // Animation
   var size = startSize;
   var id = setInterval(frame, delta);
   performingAnimation = true;
   
   function frame() {
      if (size <= 0) {
         clearInterval(id);
         self.circle.parentNode.removeChild(self.circle);
         performingAnimation = false;
      } else {
         self.circle.style.top = (self.mouseY - size/2) + "px";
         self.circle.style.left = (self.mouseX - size/2) + "px";
         self.circle.style.width = size + "px";
         self.circle.style.height = size + "px";
         
         var scale = (startSize - size)/startSize;
         var colour = 255 * scale;
         self.circle.style.borderWidth = (borderWidth - scale * borderWidth) + "px";
         self.circle.style.borderColor = "rgb(" + colour + ", " + colour + ", " + colour + ")";
         
         size -= self.speed === "fast" ? 6 : 2;
      }
   }
   
   return true;
});

(<
   ASYNC_TEST();
   uk.org.adaptive.showMouse.isActive = true;               // Make sure the module is active
   require(uk.org.adaptive.showMouse.speed === "fast");     // Test default parameter value
   require(uk.org.adaptive.showMouse.showMouse());          // Check that the function works
   require(uk.org.adaptive.showMouse.circle.parentNode);    // Check that the circle exists
   
   // Check that the circle has now disappeared
   setTimeout(function() { require(!uk.org.adaptive.showMouse.circle.parentNode); pass(); }, 350);
>)