/* Library initialisation */
registerNSMethod(uk.org.adaptive, "init", (
    function(properties) {
        var requireAuth = true;
        if (verifyArgs(properties, [["id", STRINGTYPE]]) && properties["id"] != "") {
            requireAuth = false;
        }

        return true;
    }
));
