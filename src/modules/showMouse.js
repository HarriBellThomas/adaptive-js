registerNamespace("uk.org.adaptive.showMouse");

self.circle;
self.isActive = false;
self.speed = "fast";

var mouseX = undefined;
var mouseY = undefined;
var keyDown = false;
var performingAnimation = false;

registerNSMethod(self, "apply", function(properties) {
   if (!verifyArgs(properties, [["speed", STRINGTYPE]])) return false;
   if (self.isActive) self.remove();
   
   self.isActive = true;
   self.speed = properties["speed"];
   
   doOnMouseMove(function(x, y) {
      mouseX = x;
      mouseY = y;
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
   if (typeof mouseX == "undefined" || typeof mouseY == "undefined" || performingAnimation || !self.isActive) return;
   debug("Showing mouse at X: " + mouseX + ", Y: " + mouseY);
   
   var startSize = 400;
   var borderWidth = 8;
   var delta = 5;
   
   self.circle = document.createElement("div");
   self.circle.style.border = borderWidth + "px solid #000";
   self.circle.style.borderRadius = "50%";
   self.circle.style.zIndex = "999999999";
   self.circle.style.position = "absolute";
   self.circle.style.top = (mouseY - startSize/2) + "px";
   self.circle.style.left = (mouseX - startSize/2) + "px";
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
         self.circle.style.top = (mouseY - size/2) + "px";
         self.circle.style.left = (mouseX - size/2) + "px";
         self.circle.style.width = size + "px";
         self.circle.style.height = size + "px";
         
         var scale = (startSize - size)/startSize;
         var colour = 255 * scale;
         self.circle.style.borderWidth = (borderWidth - scale * borderWidth) + "px";
         self.circle.style.borderColor = "rgb(" + colour + ", " + colour + ", " + colour + ")";
         
         size -= self.speed === "fast" ? 6 : 2;
      }
   }
});

(<
   ASYNC_TEST();
   require(self.speed === "fast");
   self.showMouse();
   require(self.circle.parentNode);
   setTimeout(function() { require(!self.circle.parentNode); }, 350);
>)