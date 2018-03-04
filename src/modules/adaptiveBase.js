// Adaptive Base
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

self.IMAGE_CACHE = {};
self.IMAGE_SIZES = {};

registerNSMethod(self, "getElementsByTag",function(k){
  return self.elementsToArray(document.getElementsByTagName(k));
});


registerNSMethod(self, "elementsToArray",function(els){
  // var ig, elarr = [];
  // for (   var i=function(){ig = els; return 0;}();   i<ig.length;   i++){
  //   elarr.push(ig[i]); if (i==ig.length-1) return elarr;
  // } return [];

  var elarr = [];
  for(var i = 0; i < els.length; i++) {
    if(els[i].getAttribute("data-adaptive") != "ignore") elarr.push(els[i]);
  }
  return elarr;
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

registerENUM(["STATEBASE","STATESTRING","STATESTRINGSINGLE","STATETAG","TAGNAME"]);

registerNSMethod(self, "simpleTagParseComponents", function(el){
  var outer = el.outerHTML;
  var indx = 0;
  var state = STATETAG;
  var output = {tags: [], inner:el.innerHTML, outer:[]};
  var currentTag = "";
  while(indx<outer.length){
    const v = outer[indx];
    const vp = (indx+1<outer.length)?outer[indx+1]:false;
    if ((state==STATETAG)||(state==STATESTRINGSINGLE)||(state==STATESTRING)){
      currentTag += v;
    }
    if (v=="'"){
      if (state==STATETAG){
        state=STATESTRINGSINGLE; // Increase to string
      }else if (state==STATESTRINGSINGLE){
        state=STATETAG; // Decrease to tag
      }
    }
    if (v=="\""){
      if (state==STATETAG){
        state=STATESTRING; // Increase to string
      }else if (state==STATESTRING){
        state=STATETAG; // Decrease to tag
      }
    }
    if (v=="<" && vp!=" " && state==STATEBASE){
      currentTag += v;
      state=STATETAG;
    }
    if (v==">"&&state==STATETAG){
      output.tags.push(currentTag);
      currentTag="";
      state=STATEBASE;
    }
    indx++;
  }
  output.outer = [output.tags[0], output.tags[output.tags.length-1]];
  return output;
});





registerNSMethod(self, "closestMinAndNotNeg", function(v1,v2){
  const u = (v1>0)?((v2>0)?Math.min(v1,v2):v1):((v2>0)?v2:-1);
  if (u==-1) throw "Malformed string input";
  return u;
});

registerNSMethod(self, "transformTags", function(tgs,tagname){
  const startTag = tgs[0];
  const endTag = tgs[1];
  const pStart = self.closestMinAndNotNeg(startTag.indexOf(" "), startTag.indexOf(">"));
  const pEnd = self.closestMinAndNotNeg(endTag.indexOf(" "), endTag.indexOf(">"));
  const startTagOutput = "<"+tagname+startTag.substring(pStart);
  const endTagOutput = "</"+tagname+endTag.substring(pEnd);
  return [startTagOutput,endTagOutput];
});

registerNSMethod(self, "removeTrailingQuote", function(a){
  if (a[a.length-1] == "'" || a[a.length-1] == "\""){
    return a.substring(0, a.length-1);
  }else{
    return a;
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

registerNSMethod(self, "imageGetRawSize", function(src,callback){
  const i=document.createElement("img");
  i.style.visibility = "hidden";
  i.onload = function(){
    const output = {width:i.clientWidth, height:i.clientHeight};
    i.outerHTML = "";
    callback(output);
  }
  document.body.appendChild(i);
  i.src = src;

});

registerNSMethod(self, "imageReplaceSmartUnchecked", function(img, indx, cache, f, cb){
    const c = document.createElement("canvas");
    const IMAGEWIDTH = self.IMAGE_SIZES[indx].width;
    const IMAGEHEIGHT = self.IMAGE_SIZES[indx].height;
    c.width = IMAGEWIDTH;
    c.height = IMAGEHEIGHT;
    const ctx = c.getContext("2d");
    ctx.drawImage(img,0,0);
    var canvasDataOld = ctx.getImageData(0, 0, c.width, c.height);
    if (self.IMAGE_CACHE[indx] == undefined){
      img.adaptiveMode = true;
      var copy = self.copyImageDataFromArray(canvasDataOld, c.width, c.height);
      self.IMAGE_CACHE[indx] = copy;
    }else{
      canvasDataOld = self.copyImageDataFromArray(self.IMAGE_CACHE[indx], c.width, c.height);
    }
    const canvasDataNew = self.applyRGBAFunctionToImageData(canvasDataOld, f, IMAGEWIDTH, IMAGEHEIGHT);
    ctx.putImageData(canvasDataNew, 0, 0);
    const newdata = c.toDataURL("image/png");
    img.src = newdata;
    img.onload = cb;
});

registerENUM(["SOFTIDENTITY"]);

registerNSMethod(self, "imageReplaceSmart", function(img, f, i, cb){
  if (!img.originFix){
    var imageurl;
    if (self.extractHostname(img.src) == document.domain){
      imageurl = img.src;
    }else{
      // Need to apply domain fix
      imageurl = "https://js.adaptive.org.uk/helpers/image.php?url="+encodeURIComponent(img.src);
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
        self.imageGetRawSize(imageurl, function(j){
          self.IMAGE_SIZES[i] = j;
          if (f!==SOFTIDENTITY) self.imageReplaceSmartUnchecked(img, i, true, f, cb);
        });

      }
    }, 100);

  }else{
    if (f!==SOFTIDENTITY) self.imageReplaceSmartUnchecked(img, i, false, f, cb);
  }
});


registerNSMethod(self, "applyRGBAFunctionToImageData", function(canvasDataOld, f, width, height){
  for(var x=0; x<width; x++){
    for(var y=0; y<height; y++){
      self.setPixelWithData(x, y,
        f({x:x, y:y}, self.getPixelWithData(x,y,canvasDataOld,width)),
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

self.scriptCapturesEnclosingScope(false);

(<
  debug("Existence check: "+window.location.href);
>)
