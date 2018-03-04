
/* 'ForAll' ENUMs */
registerENUM(["IMAGES","DIVS","VIDEOS","LINKS","TABLES","SPANS","BUTTONS","VISUALS","PARAGRAPHS", "HEADERS", "ELEMENTS"]);

const Operable=function(ls){this.elements = ls;}
Operable.prototype.where=function(p){
  const comply=[];
  for(var i=0;i<this.elements.length;i++)
    if (p(this.elements[i])) comply.push(this.elements[i]);
  return new Operable(comply);
}
Operable.prototype.with=function(k){
  const comply=[];
  for(var i=0;i<this.elements.length;i++)
    comply.push(this.elements[i]);
  for(var i=0;i<k.elements.length;i++)
    comply.push(k.elements[i]);
  return new Operable(comply);
}
Operable.prototype.and = Operable.prototype.with;


Operable.prototype.contains = function(x,ls){
  for(var i=0;i<ls.length;i++)
    if (ls[i]==x) return true;
  return false;
}

Operable.prototype.unique = function(){
  const comply=[];
  for(var i=0;i<this.elements.length;i++)
    if (!this.contains(this.elements[i], comply))
      comply.push(this.elements[i]);
  return new Operable(comply);
}
Operable.prototype.forEach=function(f){
  for(var i=0;i<this.elements.length;i++){
    const v=f(this.elements[i]);
    if (v==undefined) continue;
    this.elements[i] = v;
  }
  return this;
}
Operable.prototype.count=function(){
  return this.elements.length;
}
Operable.prototype.do = Operable.prototype.forEach;

const all=function(typ,$2,$3,$4,$5,$6){
  if($2!=undefined) return all($2,$3,$4,$5,$6).with(all(typ));
  switch (typ){
    case IMAGES:
      return new Operable(uk.org.adaptive.core.getElementsByTag("img"));
      break;
    case VIDEOS:
      return new Operable(uk.org.adaptive.core.getElementsByTag("video"));
      break;
    case DIVS:
      return (new Operable(uk.org.adaptive.core.getElementsByTag("span"))).and(
        new Operable(uk.org.adaptive.core.getElementsByTag("div"))
      );
      break;
    case LINKS:
      return new Operable(uk.org.adaptive.core.getElementsByTag("a"));
      break;
    case TABLES:
      return (new Operable(uk.org.adaptive.core.getElementsByTag("table"))).and(
        (new Operable(uk.org.adaptive.core.getElementsByTag("tbody"))).and(
          new Operable(uk.org.adaptive.core.getElementsByTag("td"))
        )
      );
      break;
    case SPANS:
      return new Operable(uk.org.adaptive.core.getElementsByTag("span"));
      break;
    case BUTTONS:
      return new Operable(uk.org.adaptive.core.getElementsByTag("button"));
      break;
    case VISUALS:
      return forall().where(a=> a.hasModifiedSourceBehavior).with(forall(IMAGES));
      break;
     case PARAGRAPHS:
      return new Operable(uk.org.adaptive.core.getElementsByTag("p"));
      break;
     case HEADERS:
      return  new Operable(uk.org.adaptive.core.getElementsByTag("h1")).with(
              new Operable(uk.org.adaptive.core.getElementsByTag("h2")).with(
              new Operable(uk.org.adaptive.core.getElementsByTag("h3")).with(
              new Operable(uk.org.adaptive.core.getElementsByTag("h4")).with(
              new Operable(uk.org.adaptive.core.getElementsByTag("h5"))))));
      break;
    case ELEMENTS:
      return forall().where(a=> a instanceof HTMLElement);
    default:
      return new Operable(uk.org.adaptive.core.getElementsByTag("*"));
      break;
  }
}
const forAll = all;
const forall = all;


const differentto = function(el){
  var output = [];
  var target = document.body;
  var ntarget;
  while(target != el){
    for(var i=0; i<target.children.length; i++){
      if (target.children[i].contains(el) || target.children[i] == el){
        ntarget = target.children[i];
      }else{
        output.push(target.children[i]);
      }
    }
    target = ntarget;
  }
  return new Operable(output);
}

var KEYSDOWN = [];
var KEYUPLISTENERS = [];
var KEYDOWNLISTENERS = [];
var MOUSEMOVELISTENERS = [];

const hasKeyDown = function(key){
    for(var i=0;i<KEYSDOWN.length;i++){
      if (KEYSDOWN[i] == key) return true;
    }
    return false;
}
const documentKeyDown = function(e) {
    e = e || window.event;
    removeKeyIndicator(e.keyCode);
    KEYSDOWN.push(e.keyCode);

    for (var i=0; i<KEYDOWNLISTENERS.length; i++){
      const keycode = KEYDOWNLISTENERS[i][0];
      if (keycode == e.keyCode || keycode == -1){
        KEYDOWNLISTENERS[i][1](e);
      }
    }
}
const documentKeyUp = function(e) {
  e = e || window.event;
  removeKeyIndicator(e.keyCode);

  for (var i=0; i<KEYUPLISTENERS.length; i++){
    const keycode = KEYUPLISTENERS[i][0];
    if (keycode == e.keyCode || keycode == -1){
      KEYUPLISTENERS[i][1](e);
    }
  }
}
const removeKeyIndicator = function(toRemove){
  var removeIndex = -1;
  for(var i=0;i<KEYSDOWN.length;i++){
    if (KEYSDOWN[i] == toRemove){
      removeIndex = i;
      break;
    }
  }
  if (removeIndex > -1) KEYSDOWN.splice(removeIndex);
}
const doOnKeyUp = function(keycode, funct){
  KEYUPLISTENERS.push([keycode, funct]);
}

const doOnKeyDown = function(keycode, funct){
  KEYDOWNLISTENERS.push([keycode, funct]);
}

const documentMouseMove = function(e) {
   e = e || window.event;
   for (var i = 0; i < MOUSEMOVELISTENERS.length; i++) MOUSEMOVELISTENERS[i](e.pageX, e.pageY);
};

const doOnMouseMove = function(f) {
   MOUSEMOVELISTENERS.push(f);
}

document.onmousemove = documentMouseMove;
document.onkeydown = documentKeyDown;
document.onkeyup = documentKeyUp;



const applyToImage = function(img, f){
  if (img.tagName != "IMG"){
    // we create a proxy image to apply changes to
    const prox = document.createElement("img");
    imageIndex++;
    prox.uid = img.uid;
    prox.src = img.src;
    prox.onload = function(){
      uk.org.adaptive.core.imageReplaceSmart(prox, f, prox.uid, function(){
        img.style.backgroundImage = "url("+prox.src+")";
      });
    }
  }
  uk.org.adaptive.core.imageReplaceSmart(img, f, img.uid, function(){});
}
var imageIndex = 0;
forall().do(function(a){ imageIndex++; a.uid = imageIndex; });
HTMLElement.prototype.delete = function(){ this.outerHTML = ""; };
HTMLElement.prototype.remove = HTMLElement.prototype.delete;


/* CSS Caching */

/*    Use this for writing CSS-altering functions that maintain
      the idempotence property */

const cachedCSS = function(elm, props){
  this.properties = [];
  this.values = [];
  this.element = elm;
  this.includeAll(props);
}

cachedCSS.prototype.hasCached = function(prop){
  for(var i=0;i<this.properties.length;i++){
    if (this.properties[i] == prop) return true;
  }
}

cachedCSS.prototype.includeAll = function(props){
  for(var i=0;i<props.length;i++){
    if (window.getComputedStyle(this.element,null)[props[i]]!=undefined){
      if (!this.hasCached(props[i])){
        this.properties.push(props[i]);
        this.values.push(window.getComputedStyle(this.element,null)[props[i]]);
      }
    }
  }
}

cachedCSS.prototype.applyTo = function(elm){
  for(var i=0;i<this.properties.length;i++){
    elm.style[this.properties[i]] = this.values[i];
  }
}

cachedCSS.prototype.partApply = function(elm, val){
  for(var i=0;i<this.properties.length;i++){
    if (this.properties[i] == val){
      elm.style[this.properties[i]] = this.values[i];
      return true;
    }
  }
  return false;
}


HTMLElement.prototype.cacheCSSProperties = function(props){
  if (this.cachedCSS == undefined){
    this.cachedCSS = new cachedCSS(this, props);
  }else{
    this.cachedCSS.includeAll(props);
  }
}
HTMLElement.prototype.cacheCSS = HTMLElement.prototype.cacheCSSProperties;
HTMLElement.prototype.resetCSS = function(){
  if (this.cachedCSS != undefined){
    this.cachedCSS.applyTo(this);
    this.cachedCSS = undefined;
  }
}

HTMLElement.prototype.resetCSSProperty = function(prop){
  if (this.cachedCSS != undefined){
    this.cachedCSS.partApply(this,prop);
  }
}


forall().where(function(a){
  var style = window.getComputedStyle(a, null);
  return (style.backgroundImage.indexOf("url(") > -1);}
).do(
    function(a){
      var style = window.getComputedStyle(a, null);
      a.src = uk.org.adaptive.core.removeTrailingQuote((/[\'\"]?(.*)/g).exec(
              (/(?:url\()(.*)\)/g).exec(style.backgroundImage)[1]
            )[1]);
      a.hasModifiedSourceBehavior = true;
    });


HTMLElement.prototype.switchTag = function(to){
  const components = uk.org.adaptive.core.transformTags(uk.org.adaptive.core.simpleTagParseComponents(this).outer, to);
  this.outerHTML = components[0]+this.innerHTML+components[1];
}

const decorateMouseUp = function(el, funct){
  el.onmouseupdecorated = (el.onmouseup!=undefined)?el.onmouseup:function(){};
  el.onmouseuppaint = funct;
  el.onmouseup = function(){
    this.onmouseuppaint.apply(this);
    this.onmouseupdecorated.apply(this);
  };
}

const decorateMouseOver = function(el, funct){
  el.onmouseoverdecorated = (el.onmouseover!=undefined)?el.onmouseover:function(){};
  el.onmouseoverpaint = funct;
  el.onmouseover = function(){
    this.onmouseoverpaint.apply(this);
    this.onmouseoverdecorated.apply(this);
  };
}

HTMLElement.prototype.decorateMouseUp = function(funct){
  decorateMouseUp(this,funct);
}
HTMLElement.prototype.decorateMouseOver = function(funct){
  decorateMouseOver(this,funct);
}


(< // Tests

  debug("Hello World");

>)




/* Persistence */

var PERSISTENT=[];
const persist = function(fn){
  PERSISTENT.push(fn);
}
const unpersist = function(fn){
  PERSISTENT = [];
}

onDomChange(function(){
    for(var i=0;i<PERSISTENT.length;i++){
      PERSISTENT[i]();
    }
});


/* Argument/Type checking */

registerENUM(["STRINGTYPE", "NUMTYPE", "ARRAYTYPE", "BOOLTYPE"])

const verifyArgs = function(obj, typs){
  for(var i=0;i<typs.length;i++){
    if (obj[typs[i][0]] == undefined) return false;
    const ky = obj[typs[i][0]];
    switch (typs[i][1]) {
      case ARRAYTYPE:
        if (!(ky.constructor === Array
              || ky instanceof Array
              || Array.isArray(ky))) return false;
        break;
      case NUMTYPE:
        if (isNaN(ky) && (typeof ky != 'number'))
                                      return false;
        break;
      case STRINGTYPE:
        if (typeof ky != 'string') return false;
        break;
      case BOOLTYPE:
        if (typeof ky != 'boolean') return false;
      default:
        return false;
        break;
    }
  }
  return true;
}



const isLowestLevel = function(){
  return (this.innerHTML!=undefined&&this.innerHTML.indexOf("<") < 0);
};

/* Scrolling title bars */

registerNamespace("uk.org.adaptive.scrollingTitle");

registerNSMethod(uk.org.adaptive.scrollingTitle, "scroll",function(){
  uk.org.adaptive.scrollingTitle.TITLESCROLLPOSITION = 0;
  uk.org.adaptive.scrollingTitle.TITLESCROLLSTRING = document.title;
  uk.org.adaptive.scrollingTitle.TITLESCROLLTIMER = setInterval(function(){
    uk.org.adaptive.scrollingTitle.TITLESCROLLPOSITION++;
    document.title = uk.org.adaptive.scrollingTitle.sectionTitle(uk.org.adaptive.scrollingTitle.TITLESCROLLPOSITION, uk.org.adaptive.scrollingTitle.TITLESCROLLSTRING);
  }, 400);
});

registerNSMethod(uk.org.adaptive.scrollingTitle, "sectionTitle",function(indx, str){
  const rval = (indx%str.length);
  return "..."+str.substring(rval)+" "+str;
});

registerNSMethod(uk.org.adaptive.scrollingTitle, "killScrollingTitle",function(indx, str){
  document.title = uk.org.adaptive.scrollingTitle.TITLESCROLLSTRING;
  clearInterval(uk.org.adaptive.scrollingTitle.TITLESCROLLTIMER);
});
