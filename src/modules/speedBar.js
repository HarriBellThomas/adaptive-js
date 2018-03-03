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

        area.className = "slider";
        area.style.position = "absolute";
        //(window.getComputedStyle(a).top == undefined) ? area.style.top = "0px" : area.style.top = a.style.top;
        //(window.getComputedStyle(a).top == undefined) ? area.style.left = "0px" : area.style.left = a.style.left;
        area.style.top = a.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        area.style.left = a.getBoundingClientRect().left - document.body.getBoundingClientRect().left;
        area.style.zIndex = 9999;

        slider.type = "range";
        slider.min = "0.2";
        slider.max = "2";
        slider.step = "0.1";
        slider.value = initVal;
        area.style.opacity = "0.25";

        output.innerHTML = initVal;
        a.playbackRate = initVal;
        output.style.display="inline";
        output.style.color = "rgb(127,127,127)";
        output.style.height = area.height;

        area.appendChild(slider);
        area.appendChild(output);
        a.parentNode.insertBefore(area, a.nextSibling);
        fadeTimer = window.setTimeout(function(){},0);
// Update the current slider value (each time you drag the slider handle)

        slider.oninput = function() {
          window.clearTimeout(fadeTimer);
          a.nextSibling.style.opacity = "1";
          a.nextSibling.children[1].innerHTML = Math.round(10*this.value)/10;
          a.nextSibling.children[1].style.color = "yellow";
          a.playbackRate = this.value;
          fadeTimer = window.setTimeout(function(){a.nextSibling.style.opacity="0.25";a.nextSibling.children[1].style.color = "rgb(127,127,127)"
          }, 2000);
        };
      })
  }
));

/* Now we define the method 'remove' which removes the effect
    from the page                                             */

registerNSMethod(self, "remove",(
  function(){
    if(self.isActive = false) return true;
    self.isActive = false;
    forall(VIDEOS).do(function(a) {
      b = a.nextSibling;
      b.parentNode.removeChild(b);
    });
    return true;
  }
));

/* We can now include this module in page by adding
    "linkHighlighter" to the list of modules in the URL and then
    calling self.apply({color: "yellow"})
    on the page */
