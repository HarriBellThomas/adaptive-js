/* This is an example module which will cause all links
    on a given page to highlight when they exprience
    a mouseover. This example exhibits the main parts of
    what each module should have to prepare for future
    integration.                                         */

/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.paragraphReader");

/* We can now set/use member variables */

self.activeElement = false;
self.isActive = false;
self.activePanelCover = false;
self.activePanel = false;
self.wordReadIndex = 0;
self.reading = false;
self.words = false;
self.rate = 0;
self.reduceTransparency;
self.size;

/* Now, we can define the member method "apply", which
    takes an object, containing the required properties.
    For example, a darken module might take the object
    {value: 30} in order to specify a darkness of 30     */

registerNSMethod(self, "apply",(
  function(properties){
    /* Since we can't specify in the function prototype
        which properties are permitted, we can simply
        perform simple field/type-checking like:      */

    if (!verifyArgs(properties, [["reduceTransparency", BOOLTYPE],
                                  ["size", STRINGTYPE],
                                  ["defaultRate", NUMTYPE]])) return false;

    self.rate = properties["defaultRate"];
    self.reduceTransparency = properties["reduceTransparency"];
    self.size = properties["size"];

    /* Ensure idempotence by first removing the
        effect if it is present                   */

    if (self.isActive) self.remove();

    if (forall(PARAGRAPHS).count() < 5) return false;
    self.isActive = true;

    forall(PARAGRAPHS).do(a=>{
      a.style["-khtml-user-select"] = "none";
      a.style["-webkit-user-select"] = "none";
      a.style["-moz-user-select"] = "none";
      a.style["-ms-user-select"] = "none";
      a.style["-webkit-touch-callout"] = "none";
      a.style["user-select"] = "none";


      a.decorateMouseOver(function(){ if (!hasKeyDown(16)) return;
      this.resetCSS();
      differentto(this).where(a=> a.resetCSS != undefined).
      do(c=>{c.cacheCSSProperties(["opacity"]); c.style.opacity = 0.4})})});


    forall(PARAGRAPHS).do(a=>{
      a.decorateMouseUp(function(){ if (!hasKeyDown(16)) return;
        self.initDisplayForegroundPanel(this.innerText);
      })});

    doOnKeyUp(16, function(){
      self.removeImmediateEffect();
    });

}));

/* Now we define the method 'remove' which removes the effect
    from the page                                       */

registerNSMethod(self, "removeImmediateEffect", function(){
  forall().where(function(a){return a.cachedCSS != undefined}).do(function(a){a.resetCSSProperty("opacity")});
});

registerNSMethod(self, "remove",(
  function(){
  }
));

registerNSMethod(self, "controlBar", function(bottom, onPlay, onPause, onFast, onSlow) {
   var slowSrc = "https://js.adaptive.org.uk/assets/slow.png";
   var playSrc = "https://js.adaptive.org.uk/assets/play.png";
   var pauseSrc = "https://js.adaptive.org.uk/assets/pause.png";
   var fastSrc = "https://js.adaptive.org.uk/assets/fast.png";

   // div container
   var width = 288;
   var div = document.createElement("div");
   div.style.position = "absolute";
   div.style.bottom = bottom + "px";
   div.style.left = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)/2 - width/2;
   div.style.display = "block";
   div.style.width = width + "px";
   div.style.backgroundColor = "#e5e5e5";
   div.style.paddingLeft = div.style.paddingRight = "1.5em";
   div.style.borderRadius = "5em";
   div.style.boxShadow = "5px 5px 5px -2px rgba(0,0,0,0.53)";
   
   // UI element template
   const createUIElem = function(src) {
      var elem = document.createElement("img");
      elem.src = src;
      elem.style.position = "relative";
      elem.style.top = "0px";
      elem.style.left = "0px";
      elem.ondragstart = function() { return false; };
      return elem;
   };
   
   // Rewind button
   var fr = createUIElem(slowSrc);
   fr.onmousedown = function() {
      fr.style.top = "1px";
      fr.style.left = "-1px";
   }
   fr.onmouseup = function() {
      fr.style.top = "0px";
      fr.style.left = "0px";
      onSlow();
   }
   fr.onmouseout = function() {
      fr.style.top = "0px";
      fr.style.left = "0px";
   }
   
   // Play/pause button
   var pp = createUIElem(playSrc);
   pp.state = "play";
   pp.onmouseup = function() {
      if (pp.state === "play") {
         pp.state = "pause";
         pp.src = pauseSrc;
         onPlay();
      } else {
         pp.state = "play";
         pp.src = playSrc;
         onPause();
      }
   }
   
   // Fast forward button
   var ff = createUIElem(fastSrc);
   ff.onmousedown = function() {
      ff.style.top = "1px";
      ff.style.left = "-1px";
   }
   ff.onmouseup = function() {
      ff.style.top = "0px";
      ff.style.left = "0px";
      onFast();
   }
   ff.onmouseout = function() {
      ff.style.top = "0px";
      ff.style.left = "0px";
   }
   
   div.appendChild(fr);
   div.appendChild(pp);
   div.appendChild(ff);
   
   return div;
});

registerNSMethod(self, "disposeDisplayForegroundPanel", function(){
  if (self.activePanel === false) return;
  self.activePanel.innerHTML = self.activePanel.decoyText;
  var pos = [self.activePanel.dOffset,window.innerHeight];
  const diff = pos[1]-pos[0];

  window.speechSynthesis.cancel();
/*
  (function(){var l=function(){
    setTimeout(function(){
      pos[0]+=20;
      if (pos[0] < pos[1]){
        self.activePanel.style.top = pos[0]+"px";
        self.activePanelCover.style.backgroundColor = "rgba(255,255,255,"+(0.8*(pos[1]-pos[0])/diff)+")";
        l();
      }else{
        self.activePanelCover.outerHTML = "";
        self.activePanelCover = false;
        self.activePanel = false;
      }
    }, 7)
  }
  l();})();
*/
    self.activePanel.style.top = pos[1]+"px";
    setTimeout(function(){
      self.activePanelCover.outerHTML = "";
      self.activePanelCover = false;
      self.activePanel = false;
    }, 500)

});

(<
>)

registerNSMethod(self, "initDisplayForegroundPanel", function(txt){
  var text = txt.replace(/\ \[[0-9]*\]/g, "");

  if (self.activePanel !== false) return;
  self.removeImmediateEffect();
  const foregroundCover = document.createElement("div");
  foregroundCover.style.position = "fixed";
  foregroundCover.style.width = "100%";
  foregroundCover.style.height = "100%";
  foregroundCover.style.top = "0px";
  foregroundCover.style.left = "0px";
  console.log(self.reduceTransparency);
  foregroundCover.style.backgroundColor = self.reduceTransparency ? "rgba(255,255,200,1)" : "rgba(255,255,255,0.8)";
  foregroundCover.style.overflow = "hidden";
  foregroundCover.style.backdropFilter = "blur(4px)";
  foregroundCover.style.webkitBackdropFilter = "blur(4px)";
  foregroundCover.onmouseup = function(){
    self.disposeDisplayForegroundPanel();
  }


  document.fonts.add(new FontFace("Comic Neue Bold", "url(https://js.adaptive.org.uk/assets/comic-neue-bold.woff)"));
  
  const foregroundPanel = document.createElement("div");
  foregroundPanel.style.width = "600px";
  foregroundPanel.style.position = "absolute";
  foregroundPanel.style.backgroundColor = "white";
  foregroundPanel.style.borderRadius = "10px";
  foregroundPanel.style.border = "1px solid black";
  foregroundPanel.style.fontFamily = "Comic Neue Bold";
  console.log(self.size);
  foregroundPanel.style.fontSize = self.size;
  foregroundPanel.style.color = "black";
  foregroundPanel.style.padding = "40px 40px 40px 40px";
  foregroundPanel.style.textAlign = "center";
  foregroundPanel.style.lineHeight = "54px";
  foregroundPanel.style.lineHeight = "54px";



  foregroundPanel.innerHTML = text;
  foregroundPanel.decoyText = text;


  foregroundCover.appendChild(foregroundPanel);
  document.body.appendChild(foregroundCover);

  self.activePanelCover = foregroundCover;
  self.activePanel = foregroundPanel;

  if (isSafari){

  }
  // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    var isIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11
    var isEdge = !isIE && !!window.StyleMedia; // Edge 20+
    var isChrome = !!window.chrome && !!window.chrome.webstore; // Chrome 1+

  var boundaryEx = /[^\s\.\,\!]+|\.|\,|\!/g;
  if (isSafari) boundaryEx = /[^\s\.\,]+|\.\,/g;
  var foregroundOutput = text.replace(boundaryEx, a=>"<span>"+a+"</span>");
  foregroundPanel.style.top = window.innerHeight + "px";
  foregroundPanel.style.left = ((window.innerWidth-foregroundPanel.clientWidth)/2) + "px";
  var aimTop = 0;
  if (foregroundPanel.clientHeight > 0.8*window.innerHeight){
    aimTop = 0.1*window.innerHeight;
    foregroundPanel.innerHTML = foregroundPanel.innerHTML.substring(0, 700);
    foregroundPanel.decoyText = foregroundPanel.innerHTML.substring(0, 700);
  }else{
    aimTop = ((window.innerHeight-foregroundPanel.clientHeight)/2);
  }
  var pos = [window.innerHeight, aimTop];
  self.activePanel.dOffset = pos[1];


  foregroundPanel.style["-webkit-transition"] = "top 0.5s";
  foregroundPanel.style.transition = "top 0.5s";
  foregroundPanel.style.top = pos[1] + "px";
  foregroundPanel.innerHTML = foregroundOutput;

/*
  (function(){var l=function(){
    setTimeout(function(){
      pos[0]-=20;
      if (pos[0] > pos[1]){
        foregroundPanel.style.top = pos[0]+"px";
        l();
      }else{
        foregroundPanel.style.top = pos[1] + "px";
        foregroundPanel.innerHTML = foregroundOutput;
      }
    }, 7)
  }
  l();})();
*/
  self.wordReadIndex = 0;
  self.reading = new SpeechSynthesisUtterance(text);
  self.reading.rate = self.rate;
  self.reading.pitch = 0.1;
  window.speechSynthesis.speak(self.reading);
  self.reading.onboundary = self.onWordBoundary;
  self.words = self.activePanel.getElementsByTagName("span");
  self.words[self.wordReadIndex].style.backgroundColor = "yellow";
});


registerNSMethod(self, "onWordBoundary", function(text){
  self.words[self.wordReadIndex].style.backgroundColor = "yellow";
  if(self.wordReadIndex>0)self.words[self.wordReadIndex-1].style.backgroundColor = "";

  if (self.words[self.wordReadIndex].offsetTop+self.activePanel.dOffset > (window.innerHeight/2)){
    self.activePanel.dOffset -= self.words[self.wordReadIndex].offsetHeight;
    self.activePanel.style.top = self.activePanel.dOffset + "px";
  }
  self.wordReadIndex++;

});

/* We can now include this module in page by adding
    "linkHighlighter" to the list of modules in the URL and then
    calling self.apply({color: "yellow"})
    on the page */
