registerNamespace("uk.org.adaptive.passwordReveal");

self.isActive = false;
self.timeDelay = 3;

self.box = undefined;
self.countdown;
self.countDownIntervalId;

// We need to declare this function like this here because it's referenced in both removeBox and on the key down event
self.loseFocus = function(e) {
   self.removeBox(e);
}

// We pass the key event to removeBox so we can clear the "onblur" event listener we added to the password field
self.removeBox = function(e) {
   if (self.box.parentNode) {
      clearInterval(self.countdownIntervalId);
      self.box.innerHTML = "";
      self.box.parentNode.removeChild(self.box);
      e.target.removeEventListener("blur", self.loseFocus);
   }
}

self.onKeyDown = function(e) {
   if (e.keyCode === 17) {
      if (e.target.tagName === "INPUT" && e.target.type.toLowerCase() === "password" && !self.box.parentNode && e.target.value) {
         // First, put the box underneath the <input>
         var rect = e.target.getBoundingClientRect();
         self.box.style.top = (rect.bottom + 5) + "px";
         self.box.style.left = rect.left + "px";
         
         // Fade in animation
         var opacity = 0;
         var delta = 10;
         var id = setInterval(frame, delta);
         self.box.style.opacity = opacity;
         
         function frame() {
            if (opacity >= 1) clearInterval(id);
            else opacity += 0.06;
            self.box.style.opacity = opacity;
         }
         
         document.body.appendChild(self.box);
         e.target.addEventListener("blur", self.loseFocus);
         
         // Check if we need to do a countdown timer or not
         if (self.timeDelay == 0) {
            self.box.innerHTML = "Password:<br><span style=\"font-family:Ubuntu Mono, Consolas, Courier New, monospace;\">" + e.target.value + "</span>";
         } else {
            function countDownByOne() {
               // This happens in two places so we put it in a function
               self.box.innerHTML = "Showing password in " + countdown + "...";
               self.countdown--;
            };
            
            self.countdown = self.timeDelay;
            self.countdownIntervalId = setInterval(count, 1000);
            countDownByOne();
            
            function count() {
               if (countdown == 0) {
                  clearInterval(self.countdownIntervalId);
                  self.box.innerHTML = "Password:<br><span style=\"font-family:Ubuntu Mono, Consolas, Courier New, monospace;\">" + e.target.value + "</span>";
               } else {
                  countDownByOne();
               }
            }
         }
      }
   }
}

self.onKeyUp = function(e) {
   if (e.keyCode === 17) self.removeBox(e);
}

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
   window.addEventListener("keydown", self.onKeyDown);
   window.addEventListener("keyup", self.onKeyUp);
   
   self.box = document.createElement("div");
   self.box.style.display = "inline-block";
   self.box.style.padding = "1em";
   self.box.style.fontFamily = "Roboto, Open Sans, Segoe UI, Arial, sans-serif";
   self.box.style.color = "#757575";
   self.box.style.backgroundColor = "#f0f0f0";
   self.box.style.borderRadius = "3px";
   self.box.style.lineHeight = "150%";
   self.box.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.3)";
   
   self.box.style.position = "fixed";
   self.box.style.zIndex = "10000";     // TODO: this is a *really* bad way of doing it
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   window.removeEventListener("keydown", self.onKeyDown);
   window.removeEventListener("keyup", self.onKeyUp);
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   window.removeEventListener("keydown", self.onKeyDown);
   window.removeEventListener("keyup", self.onKeyUp);
});