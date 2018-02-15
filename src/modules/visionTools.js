/* This is an example module which will cause all links
    on a given page to highlight when they exprience
    a mouseover. This example exhibits the main parts of
    what each module should have to prepare for future
    integration.                                         */

/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.visionTools");

self.isActive = false;

registerNSMethod(self, "requestDescriptions",(
  function(imagesrcs, cb){
    var xhttp = new XMLHttpRequest();
    var formd = new FormData();
    formd.append('input', JSON.stringify(imagesrcs));

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(imagesrcs);
        console.log(JSON.parse(this.responseText));
        cb(JSON.parse(this.responseText));
      }
    };
    xhttp.open("POST", "https://cp.md/adaptive/vx/cognitive.php", true);
    xhttp.send(formd);
}));

registerNSMethod(self, "apply", (
  function(properties){
    var inputImages = forall(IMAGES).where(a=> a.width*a.height > 1000
                      && a.alt.length < 1 && a.src.indexOf("://") > -1);
    self.requestDescriptions(inputImages.where(function(a){return true;}).do(function(a){return a.src}).elements, function(tags){
      for (var i=0;i<tags.length;i++) {
        inputImages.elements[i].alt = tags[i];
    }});
  }
));

/* Now we define the method 'remove' which removes the effect
    from the page                                       */


registerNSMethod(self, "remove",(
  function(){
  }
));
