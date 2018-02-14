registerNamespace("uk.org.adaptive");

self.data = null; /* To be initialised by JSON */

/* Library initialisation */
registerNSMethod(uk.org.adaptive, "init", (
    function(properties) {

        var requireAuth = true;
        var hasAuth = false;
        var userMode = false;
        var loginRoute = "https://adaptive.org.uk/api/login/#";
        var userJSONRoute = "https://adaptive.org.uk/api/default/";
        var styleJSONRoute = "https://html.adaptive.org.uk/json/example.json#";

        var setCookie = ((cname, cvalue, exdays) => {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        });

        var getCookie = ((cname) => {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        });

        var retrieveJSON = ((url) => {
            console.log("Starting async JSON retrieval");
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            self.data = JSON.parse(xhr.responseText);
                            applyStyles();
                        } catch (e) {
                            console.log("JSON Parsing failed: " + e);
                        }
                        console.log(self.data);
                    } else {
                        console.error(xhr.statusText);
                        // alert("Well that hasn't gone well...");
                    }
                }
            };
            xhr.onerror = function (e) {
                console.error(xhr.statusText);
            };
            xhr.send(null);
        });

        var applyStyles = function() {
            if(self.data != null && "modules" in self.data) {
                for(i = 0; i < self.data["modules"].length; i++) {
                    var module = self.data["modules"][i];
                    if(module["module"] in uk.org.adaptive) {
                        // Module has been defined
                        console.log("Loading module: " + module["module"]);
                        uk.org.adaptive[module["module"]].apply(module["properties"]);
                    }
                }
            }

        }

        var userID = getCookie("ADAPTIVE_A");
        var styleID = getCookie("ADAPTIVE_B");

        if(window.location.hash) {
            // Check for auth return
            try {
                var hash = window.atob(window.location.hash.substr(1, window.location.hash.length - 1));
                var data = JSON.parse(hash);
                console.log(data);

                if("user_id" in data) {
                    setCookie("ADAPTIVE_A", data["user_id"], 365);
                    userID = data["user_id"];
                }
                if("style_id" in data) {
                    setCookie("ADAPTIVE_B", data["style_id"], 365);
                    styleID = data["style_id"];
                }

            } catch(e) {
                // something failed
                console.log("Failed to parse hash.");

                // if you want to be specific and only catch the error which means
                // the base 64 was invalid, then check for 'e.code === 5'.
                // (because 'DOMException.INVALID_CHARACTER_ERR === 5')
            }
        }

        if (verifyArgs(properties, [["id", STRINGTYPE]]) && properties["id"] != "") {
            requireAuth = false;
            setCookie("ADAPTIVE_B", properties["id"], 365);
        } else if (styleID != "") {
            requireAuth = false;
            userMode = false;
        } else if (userID != "") {
            requireAuth = false;
            userMode = true;
        } else {
            requireAuth = true;
        }


        var style = document.createElement("style");
        style.innerHTML = "div#adaptive-bar{position:fixed;z-index:999999;bottom:0;right:0;height:40px;padding:0;margin:0;background-color:#fff;font-family:Helvetica,system;font-weight:400;font-size:1em;line-height:40px;vertical-align:middle;border-color:#000;border-width:1px 0 0 1px;border-style:solid;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}div#adaptive-bar img{max-height:16px;padding:12px;float:right}div#adaptive-bar #status{padding:12px;float:right;max-height:16px;font-family:monospace;font-size:1em;line-height:16px;font-weight:1000;background-color:#fff}div#adaptive-bar #status:hover{opacity:.7}div#adaptive-bar #status.enabled{background-color:green;color:#fff;cursor:pointer}div#adaptive-bar #status.disabled{background-color:#e20000;color:#fff;cursor:pointer}div#adaptive-bar #status.login{background-color:#e20000;color:#fff;cursor:pointer}";
        document.body.appendChild(style);

        var adaptiveBar = document.createElement("div");
        adaptiveBar.id = "adaptive-bar";

        var imageLink = document.createElement("a");
        imageLink.href = "https://adaptive.org.uk/";

        var image = document.createElement("img");
        image.src = "https://adaptive.org.uk/images/logo-colourful.png";

        imageLink.appendChild(image);

        var status = document.createElement("span");
        status.id = "status";

        adaptiveBar.appendChild(imageLink);
        adaptiveBar.appendChild(status);

        document.body.appendChild(adaptiveBar);



        if(requireAuth) {
            // Will redirect away...

            status.className = "disabled";
            status.innerHTML = "Disabled";

            status.addEventListener("click", function(event){
                event.preventDefault();
                var lastIndex = window.location.href.indexOf('#');
                if(lastIndex > -1) {
                    var url = window.location.href.substr(0, lastIndex);
                    var hash = window.location.href.substr(lastIndex + 1, window.location.href.length - window.location.hash.length - 1);
                }
                else {
                    var url = window.location.href;
                    var hash = "";
                }
                var pageData = JSON.stringify({
                    redirect_url: url,
                    hash: hash,
                    time: Date.now(),
                    hostname: window.location.hostname
                });
                window.location.replace(loginRoute + window.btoa(pageData));
            });

            return false;
        }

        else {
            status.className = "enabled";
            status.innerHTML = "Enabled";
        }

        if(userMode) {
            // get style from user default style url
            retrieveJSON(userJSONRoute + userID);
        }

        else {
            // get style from style route
            retrieveJSON(userJSONRoute + styleID);
        }

        /* Initialise from Style JSON */
        applyStyles();

    }
));


/* Shall we begin? */
uk.org.adaptive.init({id:""});
