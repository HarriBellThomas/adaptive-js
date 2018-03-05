/* This is an example module which will cause all links
    on a given page to highlight when they exprience
    a mouseover. This example exhibits the main parts of
    what each module should have to prepare for future
    integration.                                         */

/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.linkHighlighter");

/* We can now set/use member variables */

self.activeElement = false;
self.isActive = false;

/* Now, we can define the member method "apply", which
    takes an object, containing the required properties.
    For example, a darken module might take the object
    {value: 30} in order to specify a darkness of 30     */

registerNSMethod(self, "apply",(
  function(properties){
    /* Since we can't specify in the function prototype
        which properties are permitted, we can simply
        perform simple field/type-checking like:      */

    if (!verifyArgs(properties, [["size", NUMTYPE], ["backgroundColour", STRINGTYPE], ["textColour", STRINGTYPE]])) return false;

    /* Ensure idempotence by first removing the
        effect if it is present                   */

    if (self.isActive) self.remove();

    self.isActive = true;

    forall(LINKS).do(
      function(a){
        a.onmouseover = function(){
          if (!self.isActive) return;
          /* Ensure non-destructiveness by caching CSS */
          this.cacheCSSProperties(["color", "background-color",
                                  "padding", "margin", "font-size",
                                  "border-radius"]);
          this.style.fontSize = properties["size"] + "pt";
          this.style.backgroundColor = properties["backgroundColour"];
          this.style.color = properties["textColour"];
          this.style.borderRadius = "8px";
          this.style.padding = "15px 15px 15px 15px";
          this.style.margin = "-15px -15px";
          self.activeElement = this;
      }
      a.onmouseout = function(){
        self.activeElement = false;
        this.resetCSS();
      }
    });
  }
));

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
