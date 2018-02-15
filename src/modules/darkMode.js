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

    forall().do(
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

