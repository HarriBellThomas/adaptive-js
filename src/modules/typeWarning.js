registerNamespace("uk.org.adaptive.typeWarning");

self.isActive = false;
const flashColour = "#ff0000";

var currentlyFlashing = false;

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
   
   doOnKeyDown(-1, function(e) {
      if (!e.ctrlKey && !e.altKey && !e.metaKey &&
          e.target.tagName !== "TEXTAREA" && e.target.tagName !== "INPUT" &&
          (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode >= 106 && e.keyCode <= 111 || e.keyCode >= 186 && e.keyCode <= 223 || e.keyCode === 32)) flash();
   });
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
});

const flash = function() {
   if (currentlyFlashing) return;
   currentlyFlashing = true;
   
   var cover = document.createElement("div");
   
   cover.style.position = "fixed";
   cover.style.left = "0px";
   cover.style.top = "0px";
   cover.style.width = "100%";
   cover.style.height = "100%";
   cover.style.zIndex = "999999999";
   
   var opacity = 0.7;
   
   cover.style.backgroundColor = flashColour;
   cover.style.opacity = opacity;
   document.body.appendChild(cover);
   
   // Animation
   var delta = 5;
   var id = setInterval(frame, delta);
   
   function frame() {
      if (opacity <= 0) {
         clearInterval(id);
         cover.parentNode.removeChild(cover);
         currentlyFlashing = false;
      } else {
         opacity -= 0.01;
         cover.style.opacity = opacity;
      }
   }
};