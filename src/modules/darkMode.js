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

registerNSMethod(self, "apply",(
  function(){

    if (self.isActive)
      self.remove();

    self.isActive = true;

    relevantTargets().out.do(
      a => {
          if (!self.isActive) return;
          /* Ensure non-destructiveness by caching CSS */
          try {
            a.cacheCSSProperties(["color", "background-color"]);
          } catch (e) {
            /* some elements do not work with cacheCSSProperties */
          }

          a.style.color = "white";
          a.style.backgroundColor = "rgb(25,25,25)";
        }
      );
    relevantTargets().white.do(
      a => {
        if (!self.isActive) return;
        /* Ensure non-destructiveness by caching CSS */
        try {
          a.cacheCSSProperties(["color", "background-color"]);
        } catch (e) {
          /* some elements do not work with cacheCSSProperties */
        }
        a.style.color = "black";
      }
    );

    forall(LINKS).do(
      a => {
        if (!self.isActive) return;
        /* Ensure non-destructiveness by caching CSS */
        a.cacheCSSProperties(["color"]);
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
  var output = [document.body];
  var queue=[document.body];
  var whiteOutput = [];
  var n;

  while(queue.length>0) {
    n = queue.shift();
    if (!n.children) {
      continue;
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
      /*
      whiteness = 0;
      for(var x=0; x<img.width; x++){
        for(var y=0; y<img.height; y++){
          const c = document.createElement("canvas");
          const ctx = c.getContext("2d");
          ctx.drawImage(img,0,0);
          var canvasData = ctx.getImageData(0, 0, c.width, c.height);

          rgba = uk.org.adaptive.core.getPixelWithData(x, y,canvasData, img.width);
          if (rgba.r +rgba.g +rgba.b > 386) {
            whiteness ++;
          } else {
            whiteness --;
          }
        }
      }
      console.log(whiteness);
      if (whiteness > 0) {
        whiteOutput.push(n.children[i]);
      }*/
    };
  return {out: new Operable(output), white: new Operable(whiteOutput)};
};
