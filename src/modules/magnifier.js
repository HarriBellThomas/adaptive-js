registerNamespace("uk.org.adaptive.magnifier");

self.isActive = false;
var magnifierSize = 200;
var zoom = 1.75;

var isMagnifierOn = false;
var magnifyingGlass;
var mouseX = 0;
var mouseY = 0;

var dirty = true;
var dirtyCheckIntervalId;
var applyingIdentity = false;
self.toXOriginFixes = 0;
var consistentCalls = 0;
var lastCall = 0;
registerNSMethod(self, "apply", function(properties) {

   if (applyingIdentity){
      if (lastCall == self.toXOriginFixes){
        consistentCalls++;
      }else{
        consistentCalls = 0;
      }
      lastCall = self.toXOriginFixes;

      debug(self.toXOriginFixes+" remain to be fixed");
      if (self.toXOriginFixes > 0 && consistentCalls < 3){
        setTimeout(function(){
          self.apply(properties);
        }, 1000);
        return;
      }else{
        applyingIdentity = false;
      }
   }else{
     forall(VISUALS).where(a=> !a.originFix).do(a=>{
       self.toXOriginFixes ++;
       applyToImage(a, HARDIDENTITY, false, function(){
         self.toXOriginFixes --;
       }
     )});
     debug(self.toXOriginFixes+" remain to be fixed");
     lastCall = self.toXOriginFixes;
     if (self.toXOriginFixes>0){
       applyingIdentity = true;
       setTimeout(function(){
         self.apply(properties);
       }, 1000);
       return;
     }
   }


   if (!verifyArgs(properties, [["size", NUMTYPE], ["zoom", NUMTYPE]])) return false;
   if (self.isActive) self.remove();

   self.isActive = true;
   magnifierSize = properties["size"];
   zoom = properties["zoom"];

   doOnMouseMove(function(x, y) {
      mouseX = x;
      mouseY = y;

      // If we don't have the screenshot yet then don't do anything
      if (magnifyingGlass == undefined || !self.isActive) return;

      if (isMagnifierOn) updatePosition();
   });

   doOnKeyDown(77, function(e) {
      // If we don't have the screenshot yet then don't do anything
      if (magnifyingGlass == undefined || !self.isActive) return;

      if (!isMagnifierOn && e.ctrlKey) {
         document.body.appendChild(magnifyingGlass);
         isMagnifierOn = true;
         updatePosition();
      }
   });

   doOnKeyUp(17, function(e) {
      // If we don't have the screenshot yet then don't do anything
      if (magnifyingGlass == undefined || !self.isActive) return;

      if (isMagnifierOn) {
         magnifyingGlass.parentNode.removeChild(magnifyingGlass);
         isMagnifierOn = false;
      }
   });

   // Check if we need to take another screenshot every 2 seconds
   dirtyCheckIntervalId = setInterval(function() {
      if (dirty) takeScreenshot();
   }, 2000);

   window.addEventListener("resize", onResize);

   // Initialise magnifying glass
   magnifyingGlass = document.createElement("div");
   magnifyingGlass.style.border = "3px solid #000";
   magnifyingGlass.style.borderRadius = "50%";
   magnifyingGlass.style.cursor = "none";
   magnifyingGlass.style.backgroundRepeat = "no-repeat";

   magnifyingGlass.style.position = "absolute";
   magnifyingGlass.style.top = (-magnifierSize) + "px";
   magnifyingGlass.style.left = (-magnifierSize) + "px";
   magnifyingGlass.style.width = magnifierSize + "px";
   magnifyingGlass.style.height = magnifierSize + "px";
   magnifyingGlass.style.zIndex = "999999999";

   // Take screenshot of page
   debug("Loading screenshot library");
   var script = document.createElement("script");
   script.type = "text/javascript";
   script.async = true;
   script.onload = takeScreenshot;
   script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
   document.getElementsByTagName("head")[0].appendChild(script);

   return true;
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
   clearInterval(dirtyCheckIntervalId);
   window.removeEventListener("resize", onResize);
});

const onResize = function(e) {
   dirty = true;
}

const takeScreenshot = function() {
   dirty = false;
   debug("Taking screenshot");
   magnifyingGlass.style.visibility = "hidden";
   html2canvas(document.body, { allowTaint:false, useCORS:false, proxy:"https://js.adaptive.org.uk/helpers/canvas.php", scale: zoom, logging: true }).then(function(c) {
      magnifyingGlass.style.backgroundImage = "url('" + c.toDataURL("image/png") + "')";
      magnifyingGlass.style.visibility = "visible";
   });
}

const updatePosition = function() {
   var x = mouseX - Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
   var y = mouseY - Math.max(document.body.scrollTop, document.documentElement.scrollTop);
   magnifyingGlass.style.top = (y - magnifierSize/2) + "px";
   magnifyingGlass.style.left = (x - magnifierSize/2) + "px";
   magnifyingGlass.style.backgroundPosition = (-(x * zoom - magnifierSize/2)) + "px" + " " + (-(y * zoom - magnifierSize/2)) + "px";
};
