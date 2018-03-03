registerNamespace("uk.org.adaptive.passwordReveal");

self.isActive = false;
const timeDelay = 3;

var box = undefined;
var countdown;
var countDownIntervalId;

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
   
   doOnKeyDown(17, function() {
      if (e.target.tagName === "INPUT" && e.target.type.toLowerCase() === "password" && !box.parentNode && e.target.value) {
         // First, put the box underneath the <input>
         var rect = e.target.getBoundingClientRect();
         box.style.top = (rect.bottom + 5) + "px";
         box.style.left = rect.left + "px";
         
         // Fade in animation
         var opacity = 0;
         var delta = 10;
         var id = setInterval(frame, delta);
         box.style.opacity = opacity;
         
         function frame() {
            if (opacity >= 1) clearInterval(id);
            else opacity += 0.06;
            box.style.opacity = opacity;
         }
         
         document.body.appendChild(box);
         e.target.addEventListener("blur", loseFocus);
         
         // Check if we need to do a countdown timer or not
         if (timeDelay == 0) {
            box.innerHTML = "Password:<br><span style=\"font-family:Ubuntu Mono, Consolas, Courier New, monospace;\">" + e.target.value + "</span>";
         } else {
            function countDownByOne() {
               // This happens in two places so we put it in a function
               box.innerHTML = "Showing password in " + countdown + "...";
               countdown--;
            };
            
            countdown = timeDelay;
            countdownIntervalId = setInterval(count, 1000);
            countDownByOne();
            
            function count() {
               if (countdown == 0) {
                  clearInterval(countdownIntervalId);
                  box.innerHTML = "Password:<br><span style=\"font-family:Ubuntu Mono, Consolas, Courier New, monospace;\">" + e.target.value + "</span>";
               } else {
                  countDownByOne();
               }
            }
         }
      }
   });

   doOnKeyUp(17, function(e) { removeBox(e); });
   
   box = document.createElement("div");
   box.style.display = "inline-block";
   box.style.padding = "1em";
   box.style.fontFamily = "Roboto, Open Sans, Segoe UI, Arial, sans-serif";
   box.style.color = "#757575";
   box.style.backgroundColor = "#f0f0f0";
   box.style.borderRadius = "3px";
   box.style.lineHeight = "150%";
   box.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.3)";
   
   box.style.position = "fixed";
   box.style.zIndex = "999999999";
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
});

// We need to declare this function like this here because it's referenced in both removeBox and on the key down event
const loseFocus = function(e) {
   removeBox(e);
}

// We pass the key event to removeBox so we can clear the "onblur" event listener we added to the password field
const removeBox = function(e) {
   if (box.parentNode) {
      clearInterval(countdownIntervalId);
      box.innerHTML = "";
      box.parentNode.removeChild(box);
      e.target.removeEventListener("blur", loseFocus);
   }
}