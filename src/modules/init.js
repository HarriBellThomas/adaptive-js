registerNamespace("uk.org.adaptive");

self.data = null; /* To be initialised by JSON */

/* Library initialisation */
registerNSMethod(uk.org.adaptive, "init", (
    function(properties) {

        var requireAuth = true;
        var hasAuth = false;
        var userMode = false;
        var loginRoute = "https://adaptive.org.uk/api/login/#";
        var userJSONRoute = "https://html.adaptive.org.uk/json/example.json#";
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
                            reinitialise();
                        } catch (e) {
                            console.log("JSON Parsing failed");
                        }
                        console.log(self.data);
                    } else {
                        console.error(xhr.statusText);
                        alert("Well that hasn't gone well...");
                    }
                }
            };
            xhr.onerror = function (e) {
                console.error(xhr.statusText);
            };
            xhr.send(null);
        });

        var reinitialise = function() {
            if(self.data != null) {
                for(i = 0; i < self.data["modules"].length; i++) {
                    uk.org.adaptive[self.data["modules"][i]["module"]].apply(self.data["modules"][i]["properties"]);
                }
                //return true;
            } //else return false;
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


        if(requireAuth) {
            // Run run auth
            // Will redirect away
            var elt = document.createElement("div");
            elt.style.cssText = "position: fixed;bottom: 0;z-index: 999999;width: 100%;background-color: aliceblue;padding: 10px;";

            var link = document.createElement("a");
            link.innerHTML = "Login";
            link.href = loginRoute;
            elt.appendChild(link);

            document.body.appendChild(elt);

            link.addEventListener("click", function(event){
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
            var elt = document.createElement("div");
            elt.style.cssText = "position: fixed;bottom: 0;z-index: 999999;width: 100%;background-color: greenyellow;padding: 10px;font-weight: 700;";

            var text = document.createElement("p");
            text.innerHTML = "Success";
            elt.appendChild(text);

            document.body.appendChild(elt);
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
        if(self.data != null && "modules" in self.data) reinitialise();

    }
));


/* Shall we begin? */
uk.org.adaptive.init({id:""});
