/* This is an example module which will cause all links
    on a given page to highlight when they exprience
    a mouseover. This example exhibits the main parts of
    what each module should have to prepare for future
    integration.                                         */

/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.darkMode");

/* We can now set/use member variables */

self.isActive = false;


/* This will apply the dark mode function */

registerNSMethod(self, "apply",(
  function(){

    if (self.isActive)
      self.remove();

    self.isActive = true;

    document.body.cacheCSSProperties(["color", "background-color"]);
    document.body.style.backgroundColor = "rgb(25,25,25)";

    relevantTargets().do(
      a => {
          if (!self.isActive) return;
          /* Ensure non-destructiveness by caching CSS */
          try {
              a.cacheCSSProperties(["color", "background-color"]);
          } catch  (e) {}

          alpha = rgbaValue(extractColour(a, "backgroundColor")).a;
          a.style.color = "white";
          a.style.backgroundColor = "rgba(25,25,25,"+alpha+")";
        }
      );

    forall(LINKS).do(
      a => {
        if (!self.isActive) return;
        /* Ensure non-destructiveness by caching CSS */
        try {
            a.cacheCSSProperties(["color"]);
        } catch (e){}
        a.style.color = "lightblue";
      }
    );
  }
));

registerNSMethod(self, "remove",(
  function(){
    self.isActive = false;
    forall().do(a=> {
      try {
        a.resetCSS();
      } catch(e){
        /* some elements do not work with cacheCSSProperties */
      }
    });
    return true;
  }
));


/* This discards elements children to elements with background images */
const relevantTargets = function(typ){
  var output = [];
  var queue=[document.body];
  var n;

  while(queue.length>0) {
    n = queue.shift();
    if (!n.children) {
      continue;
    }
    if (n.className.toString().indexOf("logo")>-1) {
      for (var i=0; i<n.children.length; i++) {
        n.children[i].className+="logo";
      }
    }
    for (var i = 0; i< n.children.length; i++) {
      img = window.getComputedStyle(n.children[i], null).backgroundImage;
      var className = n.children[i].className.toString();
      if (className.indexOf("overlay") > -1) {
        queue.push(n.children[i]);
      }
      else if (img.valueOf() == "none" || className.indexOf("logo") > -1) {
        queue.push(n.children[i]);
        if (typ == undefined || n.children[i].nodeName == typ.toString()) output.push(n.children[i]);
      } else {
        n.children[i].style.backgroundImage = "none";
        queue.push(n.children[i]);
        if (typ == undefined || n.children[i].nodeName == typ.toString()) output.push(n.children[i]);
      }
    }
  }
  return new Operable(output);
};
