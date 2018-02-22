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

    /* Ensure idempotence by first removing the
        effect if it is present                   */

    if (self.isActive)
      self.remove();

    self.isActive = true;

    forall(VIDEOS).do(
      function (a) {
        vid = a.getBoundingClientRect();
        area = document.createElement("DIV");
        slider = document.createElement("INPUT");
        area.appendChild(slider);
        area.style.width = vid.width.toString();
        area.style.height = "30px";
        area.style.position = "absolute";
        area.style.left = vid.left.toString();
        area.style.top = vid.bottom.toString();
        area.style.backgroundColor = "rgb(255,255,255)";

        slider.type = "range";
        slider.min = "0.25";
        slider.max = "2.5";
        slider.value = properties["factor"];
        slider.style.width = "100%";

        area.innerHTML = slider.value; // Display the default slider value

        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = function() {
          area.innerHTML = this.value;
          a.playbackRate = this.value;
        }

      })
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
