// 1000 commits!
registerNamespace("uk.org.adaptive");

self.data = null; /* To be initialised by JSON */
self.pluginActivation = false;

/* Library initialisation */
registerNSMethod(uk.org.adaptive, "init", (
    function(properties) {

        /* Set a persistant cookie for the current domain */
        var setCookie = ((cname, cvalue, exdays) => {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        });

        /* Try to retrieve a persistant cookie from the current domain's scope */
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

        /* Loop through every module removing them */
        var removeStyles = function() {
            if(self.data != null && "modules" in self.data) {
                for(i = 0; i < self.data["modules"][0].length; i++) {
                    var module = self.data["modules"][0][i];
                    if(module["module"] in uk.org.adaptive) {
                        // Module has been defined
                        console.log("Removing module: " + module["module"]);
                        uk.org.adaptive[module["module"]].remove();
                    }
                }
            }
        }

        /* Retrieve remove JSON configurations */
        var retrieveJSON = ((url) => {
            console.log("Starting async JSON retrieval");
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            self.data = JSON.parse(xhr.responseText);
                            console.log(self.data);
                            self.applyStyles();
                        } catch (e) {
                            console.log("JSON Parsing failed: " + e);
                        }
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


        /* Initialisation parameters */
        var requireAuth = true;
        var hasAuth = false;
        var userMode = false;
        var loginRoute = "https://adaptive.org.uk/api/login/#";
        var userJSONRoute = "https://adaptive.org.uk/api/default/";
        var styleJSONRoute = "https://adaptive.org.uk/api/style/";


        /* Demo Mode Bypass */
        var url = new URL(window.location.href);
        var demoMode = url.searchParams.get("adaptive_demo");
        if(demoMode != null) {
            retrieveJSON(styleJSONRoute + demoMode);
            self.applyStyles();
        }
        /* End Demo Mode Bypass */


        else {

            /* Plugin Return */
            if (verifyArgs(properties, [["user", STRINGTYPE]]) && properties["user"] != "") {
                setCookie("ADAPTIVE_A", properties["user"]);
            }
            /* End */

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
                    // console.log("Failed to parse hash.");

                    // if you want to be specific and only catch the error which means
                    // the base 64 was invalid, then check for 'e.code === 5'.
                    // (because 'DOMException.INVALID_CHARACTER_ERR === 5')
                }
            }

            /* Assess the mode we want to load into */
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


            /* Build the page's markup */
            var style = document.createElement("style");
            style.innerHTML = "div#adaptive-bar,div#adaptive-bar #status{background-color:#fff}div#adaptive-bar{position:fixed;z-index:999999;bottom:0;right:0;height:40px;padding:0;margin:0;font-family:Helvetica,system;font-weight:400;font-size:13px;line-height:40px;vertical-align:middle;border-color:#000;border-width:1px 0 0 1px;border-style:solid;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}div#adaptive-bar .box,div#adaptive-bar img{padding:12px;float:right;max-height:16px;box-sizing:content-box}div#adaptive-bar .box{font-family:monospace;font-size:13px;line-height:16px;font-weight:1000}div#adaptive-bar #status:hover{opacity:.7}div#adaptive-bar #status.enabled{background-color:green;color:#fff;cursor:pointer}div#adaptive-bar #status.disabled,div#adaptive-bar #status.login{background-color:#e20000;color:#fff;cursor:pointer}div#adaptive-bar #number{cursor:pointer;background-color:#353535;color:#989898}";
            document.body.appendChild(style);

            var adaptiveBar = document.createElement("div");
            adaptiveBar.setAttribute("data-adaptive", "ignore");
            adaptiveBar.id = "adaptive-bar";

            var imageLink = document.createElement("a");
            imageLink.setAttribute("data-adaptive", "ignore");
            imageLink.href = "https://adaptive.org.uk/";

            var image = document.createElement("img");
            image.setAttribute("data-adaptive", "ignore");
            image.src = "https://adaptive.org.uk/images/logo-colourful.png";

            imageLink.appendChild(image);

            var status = document.createElement("span");
            status.setAttribute("data-adaptive", "ignore");
            status.id = "status";
            status.classList.add("box");

            var number = document.createElement("span");
            number.setAttribute("data-adaptive", "ignore");
            number.id = "number";
            number.innerHTML = "#";
            number.classList.add("box");

            adaptiveBar.appendChild(imageLink);
            adaptiveBar.appendChild(status);
            adaptiveBar.appendChild(number);

            document.body.appendChild(adaptiveBar);

            /* Interaction with the UI elements */
            status.addEventListener("click", function(event){
                event.preventDefault();
                if(status.classList.contains("disabled")) {
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
                }

                else {
                    removeStyles();
                    status.classList
                    status.classList.add("disabled");
                    status.classList.add("box");
                    status.innerHTML = "Disabled";
                }
            });


            /* On clicking the Grey Hash button */
            number.addEventListener("click", function(event) {
                var input_id = prompt("Style ID (0 for default)", "0");
                if (input_id == null || input_id == "") {
                    //alert("Cancelled");
                } else {
                    var n = Math.floor(Number(input_id));
                    if(n !== Infinity && String(n) === input_id && n >= 0) {
                        if(n == 0) setCookie("ADAPTIVE_B", "", 365);
                        else setCookie("ADAPTIVE_B", n, 365);
                        location.reload();
                    }
                    else {
                        //alert("Invalid");
                    }
                }
            });

            if(requireAuth) {
                status.classList.add("disabled");
                status.classList.add("box");
                status.innerHTML = "Disabled";
            } else {
                status.classList.add("enabled");
                status.classList.add("box");
                status.innerHTML = "Enabled";

                if(userMode) {
                    // Get style from user default style url
                    retrieveJSON(userJSONRoute + userID);
                }

                else {
                    // Get style from style route
                    retrieveJSON(styleJSONRoute + styleID);
                }

                /* Initialise from Style JSON */
                self.applyStyles();
            }
        }
    }
));

 /* Public method, take loaded data and apply it to loaded modules */
registerNSMethod(uk.org.adaptive, "applyStyles", (function(properties) {
    if(self.data != null && "modules" in self.data) {
        for(i = 0; i < self.data["modules"].length; i++) {
            var module = self.data["modules"][i];
            if(module["module"] in uk.org.adaptive) {
                // Module has been defined
                console.log("Loading module: " + module["module"]);
                var result = uk.org.adaptive[module["module"]].apply(module["properties"]);
                if(!result) fail("Failed to initialise " + module["module"]);
            }
        }
    }
}));


/* Shall we begin? */
if (typeof _adaptiveAuth !== 'undefined') uk.org.adaptive.init({id:"", user: _adaptiveAuth});
else uk.org.adaptive.init({id:"", user: ""});



(<
    /**** Testing Block ****/

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /* Cookies Testing */

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

    var cookiesRandomGuid = guid();
    setCookie("ADAPTIVE_test", cookiesRandomGuid, 365);
    require(getCookie("ADAPTIVE_test") == cookiesRandomGuid)

    /* End Cookies Testing */

>)
