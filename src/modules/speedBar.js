/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.speedBar");

self.isActive = false;


/* Applies the module to add speed bar to all video elements */

registerNSMethod(self, "apply", (
    function (properties) {

        if (!verifyArgs(properties, [["default", NUMTYPE]]))
            return false;

        initVal = properties["default"];

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
                area.style.top = a.offsetTop + "px";
                area.style.left = a.offsetLeft + "px";
                area.style.zIndex = "9999";

                slider.type = "range";
                slider.min = "0.2";
                slider.max = "2";
                slider.step = "0.1";
                slider.value = initVal;
                area.style.opacity = "0.25";

                output.innerHTML = initVal;
                a.playbackRate = initVal;
                output.style.display = "inline";
                output.style.color = "rgb(127,127,127)";
                output.style.height = area.height;

                area.appendChild(slider);
                area.appendChild(output);
                a.parentNode.insertBefore(area, a.nextSibling);
                fadeTimer = window.setTimeout(function () {
                }, 0);


                // Update the current slider value (each time you drag the slider handle)

                slider.oninput = function () {
                    window.clearTimeout(fadeTimer);
                    a.nextSibling.style.opacity = "1";
                    a.nextSibling.children[1].innerHTML = Math.round(10 * this.value) / 10;
                    a.nextSibling.children[1].style.color = "yellow";
                    a.play();
                    a.playbackRate = this.value;
                    fadeTimer = window.setTimeout(function () {
                        a.nextSibling.style.opacity = "0.25";
                        a.nextSibling.children[1].style.color = "rgb(127,127,127)"
                    }, 2000);
                };
            })
    }
));

/* Now we define the method 'remove' which removes the effect
    from the page                                             */

registerNSMethod(self, "remove", (
    function () {
        if (self.isActive = false) return true;
        self.isActive = false;
        forall(VIDEOS).do(function (a) {
            b = a.nextSibling;
            b.parentNode.removeChild(b);
        });
        return true;
    }
));
