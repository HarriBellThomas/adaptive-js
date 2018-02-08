const namespace = "uk.org.adaptive.core";

const registerNSMethod=function(p,k,f){p[k]=f;};
const registerNamespace= function(nmsp){
  var m = window;var c=nmsp.split(".");
  for (var j=0;j<c.length;j++){
    if (m[c[j]]==undefined) m[c[j]] = {};m = m[c[j]];}}
const registerENUM = function(lst){
  for (var j=0;j<lst.length;j++){window[lst[j]]=j;}}

registerNamespace(namespace);

registerNSMethod(self, "main",(function(){

// Set-up:

self.IMAGE_DOMAIN_FIX = [];
self.IMAGE_CACHE = {};

registerNSMethod(self, "getElementsByTag",function(k){
  return self.elementsToArray(document.getElementsByTagName(k));
});


registerNSMethod(self, "elementsToArray",function(els){
  var ig, elarr = [];
  for (var i=function(){ig = els; return 0;}
      ();i<ig.length;i++){
    elarr.push(ig[i]); if (i==ig.length-1) return elarr;
  }
});

registerNSMethod(self, "copyImageDataFromArray", function(canvasdata, width, height){
  const d = canvasdata.data;
  const c1 = document.createElement("canvas");
  c1.width = width;
  c1.height = height;
  const ctx1 = c1.getContext("2d");
  const newdata = ctx1.getImageData(0, 0, width, height);
  for(var i=0;i<d.length;i++){
      newdata.data[i] = d[i];
  }
  return newdata;
});

registerNSMethod(self, "imageReplaceSmartUnchecked", function(img, indx, cache, f){
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img,0,0);
    var canvasDataOld = ctx.getImageData(0, 0, img.width, img.height);
    if (self.IMAGE_CACHE[indx] == undefined){
      img.adaptiveMode = true;
      var copy = self.copyImageDataFromArray(canvasDataOld, c.width, c.height);
      self.IMAGE_CACHE[indx] = copy;
    }else{
      canvasDataOld = self.copyImageDataFromArray(self.IMAGE_CACHE[indx], c.width, c.height);
    }
    const canvasDataNew = self.applyRGBAFunctionToImageData(canvasDataOld, f, img.width, img.height);
    ctx.putImageData(canvasDataNew, 0, 0);
    const newdata = c.toDataURL("image/png");
    img.src = newdata;
});

registerNSMethod(self, "extractHostname", function(url){
  // Stolen from SO:
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }
  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];
  return hostname;
});

registerNSMethod(self, "imageReplaceSmart", function(img, f, i){
  if (!img.originFix){
    var imageurl;
    if (self.extractHostname(img.src) == document.domain){
      imageurl = img.src;
    }else{
      // Need to apply domain fix
      console.log("Fixing "+img.src);
      imageurl = "https://cp.md/adaptive/v2/src/helpers/image.php?url="+encodeURIComponent(img.src);
    }
    console.log(img.oldsrc);
    // The security fix:
    img.src = "";
    img.srcset = "";
    img.crossOrigin = "Anonymous";
    setTimeout(function(){
      img.src = imageurl;
      img.onload = function(){
        this.onload = function(){};
        img.originFix = true;
        self.imageReplaceSmartUnchecked(img, i, true, f);
      }
    }, 100);

  }else{
    self.imageReplaceSmartUnchecked(img, i, false, f);
  }
});


registerNSMethod(self, "applyRGBAFunctionToImageData", function(canvasDataOld, f, width, height){
  for(var x=0; x<width; x++){
    for(var y=0; y<height; y++){
      self.setPixelWithData(x, y,
        f({"x":x, "y":y}, self.getPixelWithData(x,y,canvasDataOld,width)),
        canvasDataOld, width);
    }
  }
  return canvasDataOld;
});

registerNSMethod(self, "getPixelWithData", function (x, y, DATA, width) {
  const index = (x + y * width) * 4;
  return {r: DATA.data[index + 0],
          g: DATA.data[index + 1],
          b: DATA.data[index + 2],
          a: DATA.data[index + 3]};
});

registerNSMethod(self, "setPixelWithData", function (x, y, COLOR, DATA, width) {
  const index = (x + y * width) * 4;
  DATA.data[index + 0] = COLOR.r;
  DATA.data[index + 1] = COLOR.g;
  DATA.data[index + 2] = COLOR.b;
  DATA.data[index + 3] = COLOR.a;
});


registerNSMethod(self, "willPersistUsingWindowingMethod", function (src) {
    var timeout = setInterval(function(){
      try{
        var endURL = window.opener.document.location.href;
        if (document.startURL!=endURL){
          clearInterval(timeout);
          var s=document.createElement("script");
          s.src=src;
          window.opener.SENDER = window;
          window.opener.onload = function(){
            window.opener.document.body.appendChild(s);
            this.SENDER.close();
          }
        }
      }catch(e){
        window.close();
      }
    }, 10);
});

registerNSMethod(self, "shouldPersistWithinDomain", function (ack) {
  if (ack || (ack == undefined)){
    const outcome = "("+self.willPersistUsingWindowingMethod.toString()+")('"+SOURCEJS+"')";
    window.onbeforeunload = (function(){
      var c = window.open("", "", "width=100, height=100, top=0, left=0, resizable=no, status=no, titlebar=no, toolbar=no, scrollbars=no");
      c.document.startURL = document.location.href;
      c.document.write("<script type='text/javascript'>"+outcome+"</script>");
      c.blur();
    });
  }else{
    window.onbeforeunload = null;
  }
});
}));

registerNSMethod(self, "scriptCapturesEnclosingScope", function(tr){
  if (tr){
    const s = document.createElement("script");
    s.innerHTML = "("+self.main.toString()+")();";
    document.body.appendChild(s);
  }else{
    self.main();
  }
});

self.scriptCapturesEnclosingScope(true);
