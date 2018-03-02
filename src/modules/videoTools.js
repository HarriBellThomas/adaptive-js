/* This is an example module which will cause all links
    on a given page to highlight when they exprience
    a mouseover. This example exhibits the main parts of
    what each module should have to prepare for future
    integration.                                         */

/* We register a unique namespace for the module, so that
    it can be referenced later                           */

registerNamespace("uk.org.adaptive.videoTools");

/* We can now set/use member variables */

self.isActive = false;

const MOVINGALPHA = 0.2;

self.f = ((xy,rgba)=>rgba);

registerNSMethod(self, "apply",(
  function(func){
    self.f = func;
    if (self.isActive) return true;
    self.isActive = true;
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
  }
));

registerNSMethod(self, "updateFrames", (
  function(){
    forall(VIDEOS).do(a=>{
      if (a.cachedTime != a.currentTime){

        a.cachedTime = a.currentTime;
        var ctx = a.delegatedCanvas.getContext("2d");
        ctx.drawImage(a, 0, 0, a.delegatedCanvas.width, a.delegatedCanvas.height);

        const canvasDataOld = ctx.getImageData(0, 0, a.delegatedCanvas.width, a.delegatedCanvas.height);
        const canvasDataNew = uk.org.adaptive.core.applyRGBAFunctionToImageData(canvasDataOld, self.f, a.delegatedCanvas.width, a.delegatedCanvas.height);
        ctx.putImageData(canvasDataNew, 0, 0);
        const delta = window.performance.now() - a.frameApplyTime;
        const fps = 1/(delta/1000);
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


// IMPORTANT
registerNSMethod(self, "remove",(
  function(){
  }
));
