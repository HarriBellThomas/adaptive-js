registerNamespace("uk.org.adaptive.showMouse");

self.isActive = false;

var mouseX = undefined;
var mouseY = undefined;
var ctrlDown = false;
var performingAnimation = false;

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
   window.addEventListener("keydown", self.onKeyDown);
   window.addEventListener("keyup", self.onKeyUp);
   window.addEventListener("mousemove", self.onMouseMove);
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   window.removeEventListener("keydown", self.onKeyDown);
   window.removeEventListener("keyup", self.onKeyUp);
   window.removeEventListener("mousemove", self.onMouseMove);
});

self.onMouseMove = function(e) {
   mouseX = e.pageX;
   mouseY = e.pageY;
}

self.onKeyDown = function(e) {
   if (e.keyCode === 16 && !ctrlDown) {
      showMouse();
      ctrlDown = true;
   }
}

self.onKeyUp = function(e) {
   if (e.keyCode === 16) ctrlDown = false;
}

const showMouse = function() {
   if (typeof mouseX == "undefined" || typeof mouseY == "undefined" || performingAnimation) return;
   console.log("Showing mouse at X: " + mouseX + ", Y: " + mouseY);
   
   var startSize = 400;
   var borderWidth = 8;
   var delta = 5;
   
   var circle = document.createElement("div");
   circle.style.border = borderWidth + "px solid #000";
   circle.style.borderRadius = "50%";
   circle.style.zIndex = "999999999";
   circle.style.position = "absolute";
   circle.style.top = (mouseY - startSize/2) + "px";
   circle.style.left = (mouseX - startSize/2) + "px";
   circle.style.width = startSize + "px";
   circle.style.height = startSize + "px";
   document.body.appendChild(circle);
   
   // Animation
   var size = startSize;
   var id = setInterval(frame, delta);
   performingAnimation = true;
   
   function frame() {
      if (size <= 0) {
         clearInterval(id);
         circle.parentNode.removeChild(circle);
         performingAnimation = false;
      } else {
         circle.style.top = (mouseY - size/2) + "px";
         circle.style.left = (mouseX - size/2) + "px";
         circle.style.width = size + "px";
         circle.style.height = size + "px";
         
         var scale = (startSize - size)/startSize;
         var colour = 255 * scale;
         circle.style.borderWidth = (borderWidth - scale * borderWidth) + "px";
         circle.style.borderColor = "rgb(" + colour + ", " + colour + ", " + colour + ")";
         
         size -= 4;
      }
   }
};