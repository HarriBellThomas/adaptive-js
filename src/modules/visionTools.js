registerNamespace("uk.org.adaptive.visionTools");

self.isActive = false;

registerNSMethod(self, "requestDescriptions",(
  function(imagesrc_orig, cb){
    var xhttp = new XMLHttpRequest();
    var formd = new FormData();
    var imagesrcs;
    if (imagesrc_orig.length < 16){
      imagesrcs = imagesrc_orig;
    }else{
      imagesrcs = imagesrc_orig.slice(0,16);
    }
    formd.append('input', JSON.stringify(imagesrcs));

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4){
        if (this.status == 200) {
          console.log(imagesrcs);
          console.log(JSON.parse(this.responseText));
          cb(JSON.parse(this.responseText));
        }else{
          cb(false);
        }
      }
    };
    xhttp.open("POST", "https://cp.md/adaptive/vx/cognitive.php", true);
    xhttp.send(formd);
}));

registerNSMethod(self, "apply", (
  function(properties){
    const k = document.createElement("div");
    k.style.backgroundColor = "black";
    k.style.position = "fixed";
    k.style.top = "0px";
    k.style.left = ((window.innerWidth-200)/2)+"px";
    k.style.height = "40px";
    k.style.width = "200px";
    k.style.borderRadius = "0px 0px 6px 6px";
    k.style.textAlign = "center";

    k.style.fontSize = "16px";
    k.style.lineHeight = "40px";
    k.style.fontFamily = "Arial";
    k.style.zIndex = "9999999999";
    k.style.color = "white";
    document.body.appendChild(k);

    var inputImages = forall(VISUALS).where(a=> a.hasModifiedSourceBehavior || (a.width*a.height > 1000 && a.alt.length < 1)
                          && (a.src.indexOf("://")>0||(a.oldsrc!=undefined && a.oldsrc.indexOf("://")>0)) > -1);

    k.innerHTML = "<img src='https://cp.md/adaptive/vx/spin.gif?0' width=40/> Describing "+inputImages.count()+" images...";
    self.requestDescriptions(inputImages.having(a=>(a.oldsrc==undefined)?a.src:a.oldsrc).elements, function(tags){
      if (tags === false){
        k.innerHTML = "<img src='https://cp.md/adaptive/vx/spin.gif?0' width=40/> Failed...";
        setTimeout(function(){k.outerHTML = "";}, 1000);
        return;
      }
      for (var i=0;i<tags.length;i++) {
        inputImages.elements[i].alt = tags[i];
      }
      inputImages.do(function(a){
        console.log(a);applyToImage(a, function(xy, rgba){
        if (xy.x < 10 && xy.y < 10) return {r:255,g:0,b:0,a:255};
        return rgba;
      })});
      debug("DOne");
      k.outerHTML = "";
    });
  }
));

/* Now we define the method 'remove' which removes the effect
    from the page                                       */


registerNSMethod(self, "remove",(
  function(){
    // But why would you want to do that??
  }
));
