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

/* Now, we can define the member method "apply", which
    takes an object, containing the required properties.
    For example, a darken module might take the object
    {value: 30} in order to specify a darkness of 30     */

registerNSMethod(self, "apply",(
  function(){
    /* Since we can't specify in the function prototype
        which properties are permitted, we can simply
        perform simple field/type-checking like:      */

    /* Ensure idempotence by first removing the
        effect if it is present                   */

    if (self.isActive)
      self.remove();

    self.isActive = true;

    forall(IMAGES,DIVS,VIDEOS,TABLES,SPANS,BUTTONS).do(
      a => {
          if (!self.isActive) return;
          /* Ensure non-destructiveness by caching CSS */
          a.cacheCSSProperties(["color", "background-color"]);
          a.style.color = "white";
          a.style.backgroundColor = "rgb(38,38,38)";
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

/* Now we define the method 'remove' which removes the effect
    from the page                                             */

registerNSMethod(self, "remove",(
  function(){
    self.isActive = false;
    this.resetCSS();
    return true;
  }
));

