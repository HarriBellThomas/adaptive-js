registerNamespace("uk.org.adaptive.typeWarning");

self.isActive = false;
self.flashColour = "#ff0000";
self.currentlyFlashing = false;

self.onKeyPress = function(e) {
   if (!e.ctrlKey && !e.altKey && !e.metaKey && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "INPUT") flash();
}

registerNSMethod(self, "apply", function() {
   console.log("typeWarning apply");
   if (self.isActive) self.remove();
   
   self.isActive = true;
   window.addEventListener("onkeypress", self.onKeyPress);
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   window.removeEventListener("onkeypress", self.onKeyPress);
});

registerNSMethod(self, "flash", function() {
   if (self.currentlyFlashing) return;
   self.currentlyFlashing = true;
   console.log("Flash");
   
   var cover = document.createElement("div");
   
   cover.style.position = "fixed";
   cover.style.left = "0px";
   cover.style.top = "0px";
   cover.style.width = "100%";
   cover.style.height = "100%";
   cover.style.zIndex = "10001";    // TODO: this is a *really* bad way of doing it
   
   var opacity = 0.7;
   
   cover.style.backgroundColor = self.flashColour;
   cover.style.opacity = opacity;
   document.body.appendChild(cover);
   
   // Animation
   var delta = 5;
   var id = setInterval(frame, delta);
   
   function frame() {
      if (opacity <= 0) {
         clearInterval(id);
         cover.parentNode.removeChild(cover);
         self.currentlyFlashing = false;
      } else {
         opacity -= 0.01;
         cover.style.opacity = opacity;
      }
   }
});