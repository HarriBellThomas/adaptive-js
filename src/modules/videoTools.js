registerNamespace("uk.org.adaptive.videoTools");

/* We can now set/use member variables */

self.isActive = false;

const MOVINGALPHA = 0.1;
self.domainFixesRequired = 0;
self.domainFixApplied = false;
self.ytSpecialFeatures = false;
self.ytID = false;

self.f = ((xy,rgba)=>rgba);



registerNSMethod(self, "applyDomainFix",(
  function(){
    if(window.location.href.indexOf("youtube.com")>0){
      self.ytSpecialFeatures = true;
      const regex = /watch\?v=([A-z0-9_-]*)[&$]?/g;
      m = regex.exec(window.location);
      self.ytID = m[1];
    }
    forall(VIDEOS).do(self.applyDomainFixToVideo);
  }
));


registerNSMethod(self, "applyDomainFixToVideo",(
  function(v){
    if (self.ytSpecialFeatures){
      /* If this is YouTube, then get raw stream URL */
      self.ytVideoDescription(self.ytID, function(o){
        v.src = appropriateYTSource(o.sources).url;
        osources = o.sources;
        console.log(o.sources);
        v.onprogress = function(){
          self.domainFixesRequired --;
          if (self.domainFixesRequired == 0){
            self.domainFixApplied = true;
            self.apply();
          }
        }
      });
    }else{
      v.oldsrc = v.currentSrc;
      v.src = "";
      setTimeout(function(){
        v.src = v.oldsrc;
        v.onprogress = function(){
          self.domainFixesRequired --;
          if (self.domainFixesRequired == 0){
            self.domainFixApplied = true;
            self.apply();
          }
        }
      }, 100);
    }
  }
));


registerNSMethod(self, "apply",(
  function(func, composite){
    const oldf = self.f;
    self.f = (composite)?((xy,rgba)=>func(xy,oldf(xy,rgba))):
              (func==undefined)?self.f:func;
    self.isActive = true;
    if (self.domainFixApplied){
      forall(VIDEOS).do(a=>{
          const fVid = document.createElement("canvas");
          fVid.style.position = "absolute";
          fVid.style.top = (a.offsetTop)+"px";
          fVid.style.left = (a.offsetLeft)+"px";
          fVid.width = a.offsetWidth;
          fVid.height = a.offsetHeight;
          const fFPS = document.createElement("div");
          fFPS.style.position = "absolute";
          fFPS.style.left = (a.offsetLeft+a.offsetWidth - 100)+"px";
          fFPS.style.top = (a.offsetTop+5)+"px";
          fFPS.style.width = "95px";
          fFPS.style.height = "36px";
          fFPS.style.lineHeight = "36px";
          fFPS.style.fontSize = "36px";
          fFPS.style.color = "red";
          fFPS.style.textAlign = "right";
          fFPS.innerHTML = "0fps";

          a.parentElement.appendChild(fVid);
          a.parentElement.appendChild(fFPS);

          var ctx = fVid.getContext("2d");
          ctx.drawImage(a, 0, 0, fVid.width, fVid.height);
          a.delegatedCanvas = fVid;
          a.delegatedFPS = fFPS;
          a.avgFPS = -1;
          a.cachedTime = a.currentTime;
          a.frameApplyTime = window.performance.now();
          a.style.visibility = "hidden";
      })
      setTimeout(self.updateFrames, 5);
    }else{
      forall(VIDEOS).do(a=> {
        a.crossOrigin = "Anonymous";
        self.domainFixesRequired++;
      });
      self.applyDomainFix();
    }
  }
));

registerNSMethod(self, "updateFrames", (
  function(){
    if (!self.isActive) return false;
    forall(VIDEOS).do(a=>{
      if (a.cachedTime != a.currentTime){

        a.cachedTime = a.currentTime;
        var ctx = a.delegatedCanvas.getContext("2d");
        ctx.drawImage(a, 0, 0, a.delegatedCanvas.width, a.delegatedCanvas.height);

        const canvasDataOld = ctx.getImageData(0, 0, a.delegatedCanvas.width, a.delegatedCanvas.height);
        const canvasDataNew = uk.org.adaptive.core.applyRGBAFunctionToImageData(canvasDataOld, self.f, a.delegatedCanvas.width, a.delegatedCanvas.height);
        ctx.putImageData(canvasDataNew, 0, 0);
        const delta = window.performance.now() - a.frameApplyTime;
        const fps = 1000/delta;
        if (a.avgFPS < 0){
          a.avgFPS = fps;
        }else{
          a.avgFPS = MOVINGALPHA*fps + (1-MOVINGALPHA)*a.avgFPS;
        }
        a.delegatedFPS.innerHTML = Math.round(a.avgFPS)+"fps";
        a.frameApplyTime = window.performance.now();
      }
    });
    setTimeout(self.updateFrames, 5);
  }
))

var osources = false;
// IMPORTANT
registerNSMethod(self, "remove",(
  function(){
    self.isActive = false;
    forall(VIDEOS).do(a=>{
      a.style.visibility = "visible";
      a.delegatedFPS.outerHTML = "";
      a.delegatedCanvas.outerHTML = "";
    });
  }
));

const appropriateYTSource = function(sources){
  var out = false;
  for (s in sources){
    if (sources[s].quality == "medium" && sources[s].type.indexOf("mp4")){
      out = s;
    }
  }
  if (out==false){
    for (s in sources){
      if (sources[s].quality == "small" && sources[s].type.indexOf("mp4")){
        out = s;
      }
    }
  }
  return sources[out];
}

registerNSMethod(self, "ytVideoDescription",(
  function(id, callback){
    var decodeQueryString = function(queryString) {
      var key, keyValPair, keyValPairs, r, val, _i, _len;
      r = {};
      keyValPairs = queryString.split("&");
      for (_i = 0, _len = keyValPairs.length; _i < _len; _i++) {
        keyValPair = keyValPairs[_i];
        key = decodeURIComponent(keyValPair.split("=")[0]);
        val = decodeURIComponent(keyValPair.split("=")[1] || "");
        r[key] = val;
      }
      return r;
    };

    var decodeStreamMap = function(url_encoded_fmt_stream_map) {
      var quality, sources, stream, type, urlEncodedStream, _i, _len, _ref;
      sources = {};
      _ref = url_encoded_fmt_stream_map.split(",");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        urlEncodedStream = _ref[_i];
        stream = decodeQueryString(urlEncodedStream);
        type = stream.type.split(";")[0];
        quality = stream.quality.split(",")[0];
        stream.original_url = stream.url;
        stream.url = "" + stream.url + "&signature=" + stream.sig;
        sources["" + type + " " + quality] = stream;
      }
      return sources;
    };

    var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function (data) {
      if (this.readyState == 4 && this.status == 200) {
        const video_info = this.responseText;
        var video;
        video = decodeQueryString(video_info);
        if (video.status === "fail") {
          return callback(video);
        }
        video.sources = decodeStreamMap(video.url_encoded_fmt_stream_map);
        video.getSource = function(type, quality) {
          var exact, key, lowest, source, _ref;
          lowest = null;
          exact = null;
          _ref = this.sources;
          for (key in _ref) {
            source = _ref[key];
            if (source.type.match(type)) {
              if (source.quality.match(quality)) {
                exact = source;
              } else {
                lowest = source;
              }
            }
          }
          return exact || lowest;
        };
        return callback(video);
      }
    }
    httpRequest.open('GET', "https://www.youtube.com/get_video_info?video_id="+id);
    httpRequest.send();
  }
));


(<

  if(window.location.href.indexOf("youtube.com")>0){
    ASYNC_TEST();
    var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function (data) {
      if (this.readyState == 4){
        debug("Checking YT support...")
        require(this.status == 200);
        pass();
      }
    }
    httpRequest.open('GET', "https://www.youtube.com/get_video_info?video_id=aqz-KE-bpKQ");
    httpRequest.send();
  }
>)
