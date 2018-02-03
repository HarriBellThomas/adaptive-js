/* This is an example module which will cause all links
    on a given page to highlight when they exprience
    a mouseover. This example exhibits the main parts of
    what each module should have to prepare for future
    integration.                                         */

/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.linkHighlighter");

/* We can now set/use member variables */

uk.org.adaptive.linkHighlighter.activeElement = false;

/* Now, we can define the member method "apply", which
    takes an object, containing the required properties.
    For example, a darken module might take the object
    {value: 30} in order to specify a darkness of 30     */

registerNSMethod(uk.org.adaptive.linkHighlighter, "apply",(
  function(properties){
    /* Since we can't specify in the function prototype
        which properties are permitted, we can simply
        perform simple field/type-checking like:      */

    if (!verifyArgs(properties, [["color", STRINGTYPE]))
                                              return false;

    /* Ensure idempotence by first removing the
        effect if it is present                   */

    if (uk.org.adaptive.linkHighlighter.activeElement !== false)
                        uk.org.adaptive.linkHighlighter.remove();

    forall(LINKS).do(
      function(a){
        a.onmouseover = function(){
        /* Ensure non-destructiveness by caching CSS */
        this.cacheCSSProperties(["color", "background-color",
                                "padding", "margin",
                                "border-radius"]);
        this.style.color = "black";
        this.style.backgroundColor = properties["color"];
        this.style.borderRadius = "8px";
        this.style.padding = "15px 15px 15px 15px";
        this.style.margin = "-15px -15px";
        uk.org.adaptive.linkHighlighter.activeElement = this;
      }
      a.onmouseout = function(){
        uk.org.adaptive.linkHighlighter.activeElement = false;
        this.resetCSS();
      }
    });
  }
);

/* Now we define the method 'remove' which removes the effect
    from the page                                             */

registerNSMethod(uk.org.adaptive.linkHighlighter, "remove",(
  function(){
    if (uk.org.adaptive.linkHighlighter.activeElement === false)
                                                      return true;
    uk.org.adaptive.linkHighlighter.activeElement.resetCSS();
    uk.org.adaptive.linkHighlighter.activeElement = false;
    return true;
  }
);

/* We can now include this module in page by adding
    "linkHighlighter" to the list of modules in the URL and then
    calling uk.org.adaptive.linkHighlighter.apply({color: "yellow"})
    on the page */
