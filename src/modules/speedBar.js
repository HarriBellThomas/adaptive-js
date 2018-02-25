/* This is an example module which will cause all links
    on a given page to highlight when they exprience
    a mouseover. This example exhibits the main parts of
    what each module should have to prepare for future
    integration.                                         */

/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.speedBar");

/* We can now set/use member variables */

self.isActive = false;

/* Now, we can define the member method "apply", which
    takes an object, containing the required properties.
    For example, a darken module might take the object
    {value: 30} in order to specify a darkness of 30     */

registerNSMethod(self, "apply",(
  function(properties) {
    /* Since we can't specify in the function prototype
        which properties are permitted, we can simply
        perform simple field/type-checking like:      */

    if (!verifyArgs(properties, [["default", NUMTYPE]]))
      return false;

    initVal = properties["default"];
    /* Ensure idempotence by first removing the
        effect if it is present                   */

    if (self.isActive)
      self.remove();

    self.isActive = true;

    forall(VIDEOS).do(
      function (a) {
        area = document.createElement("DIV");
        slider = document.createElement("INPUT");
        output = document.createElement("DIV");

        base = a.getBoundingClientRect();

        area.className = "slider";
        area.style.position = "absolute";
        area.style.top = base.height.toString();
        area.style.zIndex = 9999;

        slider.type = "range";
        slider.min = "0.2";
        slider.max = "2";
        slider.step = "0.1";
        slider.value = initVal;
        area.style.opacity = "0.5";

        output.innerHTML = initVal;
        a.playbackRate = initVal;
        output.style.display="inline";
        output.style.color = "white";

        area.appendChild(slider);
        area.appendChild(output);
        a.parentNode.insertBefore(area, a.nextSibling);
// Update the current slider value (each time you drag the slider handle)
        slider.oninput = function() {
          area.style.opacity = "1";
          output.innerHTML = Math.round(10*this.value)/10;
          a.playbackRate = this.value;
          window.setTimeout(function(){area.style.opacity="0.5"}, 2000);
        };
      })
  }
));

/* Now we define the method 'remove' which removes the effect
    from the page                                             */

registerNSMethod(self, "remove",(
  function(){
    self.isActive = false;
    forall().where(function(a){a.className.toString().indexOf("slider")>-1}).do(function(a) {
      if (a.parentNode) a.parentNode.removeChild(a);
    });
    return true;
  }
));

/* We can now include this module in page by adding
    "linkHighlighter" to the list of modules in the URL and then
    calling self.apply({color: "yellow"})
    on the page */
