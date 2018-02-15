/* This is an example module which will cause all links
    on a given page to highlight when they exprience
    a mouseover. This example exhibits the main parts of
    what each module should have to prepare for future
    integration.                                         */

/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.paragraphReader");

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

    if (!verifyArgs(properties, [["fadeCoefficient", NUMTYPE]]))
                                              return false;

    /* Ensure idempotence by first removing the
        effect if it is present                   */

    if (self.isActive)
            self.remove();

    if (forall(PARAGRAPHS).count() < 5) return false;
    self.isActive = true;

    forall(PARAGRAPHS).do(a=>{
      a.decorateMouseOver(function(){ if (!hasKeyDown(16)) return;
      this.resetCSS();
      differentto(this).where(a=> a.resetCSS != undefined).
      do(c=>{c.cacheCSSProperties(["opacity"]); c.style.opacity = 0.4})})});

    doOnKeyUp(16, function(){
      self.removeImmediateEffect();
    });
}));

/* Now we define the method 'remove' which removes the effect
    from the page                                       */

registerNSMethod(self, "removeImmediateEffect", function(){
  forall().where(function(a){return a.cachedCSS != undefined}).do(function(a){a.resetCSSProperty("opacity")});
});

registerNSMethod(self, "remove",(
  function(){
  }
));

/* We can now include this module in page by adding
    "linkHighlighter" to the list of modules in the URL and then
    calling self.apply({color: "yellow"})
    on the page */
