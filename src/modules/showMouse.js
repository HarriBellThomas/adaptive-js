registerNamespace("uk.org.adaptive.showMouse");

self.isActive = false;
self.mouseX = undefined;
self.mouseY = undefined;
self.ctrlDown = false;
self.performingAnimation = false;

self.onMouseMove = function(e) {
   self.mouseX = e.pageX;
   self.mouseY = e.pageY;
}

self.onKeyDown = function(e) {
   if (e.keyCode === 17 && !self.ctrlDown) {
      showMouse();
      self.ctrlDown = true;
   }
}

self.onKeyUp = function(e) {
   if (e.keyCode === 17) self.ctrlDown = false;
}

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
   window.addEventListener("onkeydown", self.onKeyDown);
   window.addEventListener("onkeyup", self.onKeyUp);
   window.addEventListener("onmousemove", self.onMouseMove);
   console.log("showMouse apply");
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   window.removeEventListener("onkeydown", self.onKeyDown);
   window.removeEventListener("onkeyup", self.onKeyUp);
   window.removeEventListener("onmousemove", self.onMouseMove);
});

registerNSMethod(self, "showMouse", function() {
   if (typeof self.mouseX == "undefined" || typeof self.mouseY == "undefined" || self.performingAnimation) return;
   console.log("Showing mouse at X: " + self.mouseX + ", Y: " + self.mouseY);
   
   var startSize = 400;
   var borderWidth = 8;
   var delta = 5;
   
   var circle = document.createElement("div");
   circle.style.border = borderWidth + "px solid #000";
   circle.style.borderRadius = "50%";
   circle.style.zIndex = "10000";     // TODO: this is a *really* bad way of doing it
   circle.style.position = "absolute";
   circle.style.top = (self.mouseY - startSize/2) + "px";
   circle.style.left = (self.mouseX - startSize/2) + "px";
   circle.style.width = startSize + "px";
   circle.style.height = startSize + "px";
   document.body.appendChild(circle);
   
   // Animation
   var size = startSize;
   var id = setInterval(frame, delta);
   self.performingAnimation = true;
   
   function frame() {
      if (size <= 0) {
         clearInterval(id);
         circle.parentNode.removeChild(circle);
         self.performingAnimation = false;
      } else {
         circle.style.top = (self.mouseY - size/2) + "px";
         circle.style.left = (self.mouseX - size/2) + "px";
         circle.style.width = size + "px";
         circle.style.height = size + "px";
         
         var scale = (startSize - size)/startSize;
         var colour = 255 * scale;
         circle.style.borderWidth = (borderWidth - scale * borderWidth) + "px";
         circle.style.borderColor = "rgb(" + colour + ", " + colour + ", " + colour + ")";
         
         size -= 4;
      }
   }
});