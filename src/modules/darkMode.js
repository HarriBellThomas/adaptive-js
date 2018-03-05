/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.darkMode");

self.isActive = false;

/* This will apply the dark mode function */

registerNSMethod(self, "apply", (
    function () {

        if (self.isActive)
            self.remove();

        self.isActive = true;

        document.body.cacheCSSProperties(["color", "background-color"]);
        document.body.style.backgroundColor = "rgb(25,25,25)";
        document.body.style.color = "white";

        relevantTargets().where(a => a instanceof HTMLElement).do(
            a => {
                if (!self.isActive) return;
                /* Ensure non-destructiveness by caching CSS */
                a.cacheCSSProperties(["color", "background-color"]);
                alpha = rgbaValue(extractColour(a, "backgroundColor")).a;
                a.style.color = "white";
                a.style.backgroundColor = "rgba(25,25,25," + alpha + ")";
            }
        );

        forall(LINKS).where(a => a instanceof HTMLElement).do(
            a => {
                if (!self.isActive) return;
                a.cacheCSSProperties(["color"]);
                a.style.color = "lightblue";
            }
        );
    }
));


/* Removes the dark mode function */

registerNSMethod(self, "remove", (
    function () {
        self.isActive = false;
        forall().where(a => a instanceof HTMLElement).do(a => {
            a.resetCSS();
        });
        return true;
    }
));


/* This discards elements children to elements with background images */

const relevantTargets = function (typ) {
    var output = [];
    var queue = [document.body];
    var n;

    while (queue.length > 0) {
        n = queue.shift();
        if (!n.children) {
            continue;
        }
        if (n.className.toString().indexOf("logo") > -1) {
            for (var i = 0; i < n.children.length; i++) {
                n.children[i].className += "logo";
            }
        }
        for (var i = 0; i < n.children.length; i++) {
            img = window.getComputedStyle(n.children[i], null).backgroundImage;
            var className = n.children[i].className.toString();
            if (img.valueOf() == "none" || className.indexOf("logo") > -1) {
                queue.push(n.children[i]);
                if (typ == undefined || n.children[i].nodeName == typ.toString()) output.push(n.children[i]);
            } else {
                n.children[i].cacheCSSProperties(["background-image"]);
                n.children[i].style.backgroundImage = "none";
                queue.push(n.children[i]);
                if (typ == undefined || n.children[i].nodeName == typ.toString()) output.push(n.children[i]);
            }
        }
    }
    return new Operable(output.reverse());
};
