
const registerNSMethod=function(p,k,f){p[k]=f;};
const registerNamespace= function(nmsp){
  var m = window;var c=nmsp.split(".");
  for (var j=0;j<c.length;j++){
    if (m[c[j]]==undefined) m[c[j]] = {};m = m[c[j]];}}
const registerENUM = function(lst){
  for (var j=0;j<lst.length;j++){window[lst[j]]=j;}}

registerNamespace("cam.adaptWeb");

registerNSMethod(cam.adaptWeb, "main",(function(){

// Set-up:

cam.adaptWeb.IMAGE_DOMAIN_FIX = false;
cam.adaptWeb.IMAGE_CACHE = {};

registerNSMethod(cam.adaptWeb, "getElementsByTag",function(k){
  return cam.adaptWeb.elementsToArray(document.getElementsByTagName(k));
});


registerNSMethod(cam.adaptWeb, "elementsToArray",function(els){
  var ig, elarr = [];
  for (var i=function(){ig = els; return 0;}
      ();;i++){
    elarr.push(ig[i]); if (i==ig.length-1) return elarr;
  }
});

registerNSMethod(cam.adaptWeb, "copyImageDataFromArray", function(canvasdata, width, height){
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

registerNSMethod(cam.adaptWeb, "imageReplaceSmartUnchecked", function(img, indx, cache, f){
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    ctx.drawImage(img,0,0);
    var canvasDataOld = ctx.getImageData(0, 0, img.width, img.height);
    if (cam.adaptWeb.IMAGE_CACHE[indx] == undefined){
      img.adaptiveMode = true;
      var copy = cam.adaptWeb.copyImageDataFromArray(canvasDataOld, c.width, c.height);
      cam.adaptWeb.IMAGE_CACHE[indx] = copy;
    }else{
      canvasDataOld = cam.adaptWeb.copyImageDataFromArray(cam.adaptWeb.IMAGE_CACHE[indx], c.width, c.height);
    }
    const canvasDataNew = cam.adaptWeb.applyRGBAFunctionToImageData(canvasDataOld, f, img.width, img.height);
    ctx.putImageData(canvasDataNew, 0, 0);
    const newdata = c.toDataURL("image/png");
    img.src = newdata;
});

registerNSMethod(cam.adaptWeb, "imageReplaceSmart", function(img, f, i){
  if (!cam.adaptWeb.IMAGE_DOMAIN_FIX){
    const imageurl = img.src;
    img.oldsrc = imageurl;
    img.src = "";
    img.srcset = "";
    img.crossOrigin = "Anonymous";
    setTimeout(function(){
      img.src = imageurl;
      img.onload = function(){
        this.onload = function(){};
        cam.adaptWeb.imageReplaceSmartUnchecked(img, i, true, f);
      }
    }, 100);
  }else{
    cam.adaptWeb.imageReplaceSmartUnchecked(img, i, false, f);
  }
});


registerNSMethod(cam.adaptWeb, "applyRGBAFunctionToImageData", function(canvasDataOld, f, width, height){
  for(var x=0; x<width; x++){
    for(var y=0; y<height; y++){
      cam.adaptWeb.setPixelWithData(x, y,
        f({"x":x, "y":y}, cam.adaptWeb.getPixelWithData(x,y,canvasDataOld,width)),
        canvasDataOld, width);
    }
  }
  return canvasDataOld;
});

registerNSMethod(cam.adaptWeb, "getPixelWithData", function (x, y, DATA, width) {
  const index = (x + y * width) * 4;
  return {r: DATA.data[index + 0],
          g: DATA.data[index + 1],
          b: DATA.data[index + 2],
          a: DATA.data[index + 3]};
});

registerNSMethod(cam.adaptWeb, "setPixelWithData", function (x, y, COLOR, DATA, width) {
  const index = (x + y * width) * 4;
  DATA.data[index + 0] = COLOR.r;
  DATA.data[index + 1] = COLOR.g;
  DATA.data[index + 2] = COLOR.b;
  DATA.data[index + 3] = COLOR.a;
});


registerNSMethod(cam.adaptWeb, "willPersistUsingWindowingMethod", function (src) {
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

registerNSMethod(cam.adaptWeb, "shouldPersistWithinDomain", function (ack) {
  if (ack || (ack == undefined)){
    const outcome = "("+cam.adaptWeb.willPersistUsingWindowingMethod.toString()+")('"+SOURCEJS+"')";
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

registerNSMethod(cam.adaptWeb, "scriptCapturesEnclosingScope", function(tr){
  if (tr){
    const s = document.createElement("script");
    s.innerHTML = "("+cam.adaptWeb.main.toString()+")();";
    document.body.appendChild(s);
  }else{
    cam.adaptWeb.main();
  }
});

cam.adaptWeb.scriptCapturesEnclosingScope(true);
