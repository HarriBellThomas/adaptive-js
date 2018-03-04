/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.motorFeatures");

/* We can now set/use member variables */

self.activeTimer = false;
self.isActive = false;
self.waitTime = 0;
self.activeElement = false;
self.clearToLand = false;
self.buttonMappings = {};

var mouseX = -1000;
var mouseY = -1000;

registerNSMethod(self, "buttonMapping", function(a, omd, omu, omo, oc){
  this.caller = a;
  this.omd = (omd!=undefined)?omd:function(){}; // onmousedown
  this.omu = (omu!=undefined)?omu:function(){}; // onmouseup
  this.omo = (omo!=undefined)?omo:function(){}; // onmouseout
  this.oc = (oc!=undefined)?oc:function(){};   // onclick
});
self.buttonMapping.prototype.call = function(){
  this.omd.call(this.caller);
  this.omo.call(this.caller);
  this.omu.call(this.caller);
  this.oc.call(this.caller);
}

registerNSMethod(self, "apply",(
  function(properties){
    /* Since we can't specify in the function prototype
        which properties are permitted, we can simply
        perform simple field/type-checking like:      */

    if (!verifyArgs(properties, [["delay", NUMTYPE]]))
                                              return false;

    if (properties["delay"] < 1) return false;
    self.waitTime = properties["delay"];
    /* Ensure idempotence by first removing the
        effect if it is present                   */

    if (self.isActive)
            self.remove();

    self.isActive = true;
    forall(LINKS).where(a=> a.src == undefined||a.src =="")
                                      .do(a=> a.switchTag("button"));
    self.buttonID = 0;
    self.buttonMappings = {};

    doOnMouseMove(function(x, y) {
      mouseX = x;
      mouseY = y;
    });
    
    // Config for the animation
    const circleRadius = 40;
    const lineWidth = 10;

    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.width = canvas.height = 2*circleRadius;
    var context = canvas.getContext("2d");
    var animationIntervalId;

    forall(BUTTONS).do(a=> {
      a.buttonID = self.buttonID;
      self.buttonID++;

      a.style["-webkit-appearance"] = "none";
      a.style["border"] = "2px solid red";
      a.style["border-radius"] = "4px";
      a.style["background-color"] = "rgba(0,0,0,0)";
      a.style["color"] = "red";
      a.style["outline"] = "0";
    });
    forall(BUTTONS).do(
      function(a){
        const prof = new self.buttonMapping(a, a.onmousedown, (a.href == "" || a.href == "undefined")?a.onmouseup:function(){
          document.location = this.getAttribute("href");
        }, a.onmouseout, a.onclick);
        self.buttonMappings[a.buttonID] = prof;
        
        a.onmousedown = function() {
          canvas.style.top = (mouseY - circleRadius) + "px";
          canvas.style.left = (mouseX - circleRadius) + "px";
          
          var elapsed = 0;
          var delta = 5;

          animationIntervalId = setInterval(function() {
            if (elapsed >= self.waitTime) {
              clearInterval(animationIntervalId);
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.beginPath();
              context.arc(circleRadius, circleRadius, circleRadius - lineWidth, -Math.PI/2, -Math.PI/2 + 2*Math.PI*elapsed/self.waitTime);
              context.strokeStyle = "green";
              context.lineWidth = lineWidth;
              context.stroke();
            } else {
              elapsed += delta;
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.beginPath();
              context.arc(circleRadius, circleRadius, circleRadius - lineWidth, -Math.PI/2, -Math.PI/2 + 2*Math.PI*elapsed/self.waitTime);
              context.strokeStyle = "#000";
              context.lineWidth = lineWidth;
              context.stroke();
            }
          }, delta);
          
          document.body.appendChild(canvas);
          
          self.activeElement = this;
          self.prepareTimer();
        }
        
        a.onmouseup = function() {
          if (canvas.parentNode) {
            clearInterval(animationIntervalId);
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.parentNode.removeChild(canvas);
          }
          
          self.activeElement.style.cursor = "default";
          self.queryOutcome();
        }
        
        a.onmouseout = function() {
          if (canvas.parentNode) {
            clearInterval(animationIntervalId);
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.parentNode.removeChild(canvas);
          }
          
          if (self.activeElement) self.activeElement.style.cursor = "default";
          self.cancelOutcome();
        }
        
        a.onmouseover = function() {};
        a.onclick = function() {};
    });
  }
));

registerNSMethod(self, "prepareTimer", function(){
  console.log("Waiting...");
  if (self.activeTimer === false){
    clearTimeout(self.activeTimer);
  }
  self.clearToLand = false;
  self.activeTimer = setTimeout(function(){
    self.activeElement.style.cursor = "context-menu";
    self.clearToLand = true;
  }, self.waitTime);
});

registerNSMethod(self, "cancelOutcome", function(){
  clearTimeout(self.activeTimer);
  self.clearToLand = false;
  self.activeTimer = false;
});

registerNSMethod(self, "queryOutcome", function(){
  if (self.clearToLand){
    self.clearToLand = false;
    self.activeTimer = false;
    self.buttonMappings[self.activeElement.buttonID].call();
  }else{
    clearTimeout(self.activeTimer);
    self.clearToLand = false;
  }
});

/* Now we define the method 'remove' which removes the effect
    from the page                                             */

registerNSMethod(self, "remove",(
  function(){
    self.isActive = false;
    if (self.activeElement === false)
                                                      return true;
    self.activeElement.resetCSS();
    self.activeElement = false;
    return true;
  }
));

/* We can now include this module in page by adding
    "linkHighlighter" to the list of modules in the URL and then
    calling self.apply({color: "yellow"})
    on the page */
