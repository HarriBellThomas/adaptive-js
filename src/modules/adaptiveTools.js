/* 'ForAll' ENUMs */

registerENUM(["IMAGES","DIVS","VIDEOS","LINKS","TABLES","SPANS"]);

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
Operable.prototype.forEach=function(f){
  for(var i=0;i<this.elements.length;i++){
    const v=f(this.elements[i]);
    if (v==undefined) continue;
    this.elements[i] = v;
  }
  return true;
}
Operable.prototype.count=function(){
  return this.elements.length;
}
Operable.prototype.do = Operable.prototype.forEach;

const all=function(typ,$2,$3,$4,$5,$6){
  if($2!=undefined) return all($2,$3,$4,$5,$6).with(all(typ));
  switch (typ){
    case IMAGES:
      return new Operable(cam.adaptWeb.getElementsByTag("img"));
      break;
    case VIDEOS:
      return new Operable(cam.adaptWeb.getElementsByTag("video"));
      break;
    case DIVS:
      return (new Operable(cam.adaptWeb.getElementsByTag("span"))).and(
        new Operable(cam.adaptWeb.getElementsByTag("div"))
      );
      break;
    case LINKS:
      return new Operable(cam.adaptWeb.getElementsByTag("a"));
      break;
    case TABLES:
      return (new Operable(cam.adaptWeb.getElementsByTag("table"))).and(
        (new Operable(cam.adaptWeb.getElementsByTag("tbody"))).and(
          new Operable(cam.adaptWeb.getElementsByTag("td"))
        )
      );
      break;
    case SPANS:
      return new Operable(cam.adaptWeb.getElementsByTag("span"));
      break;
    default:
      return new Operable(cam.adaptWeb.getElementsByTag("*"));
      break;
  }
}
const forAll = all;
const forall = all;

applyToImage = function(img, f){
  cam.adaptWeb.imageReplaceSmart(img, f, img.uid);
}
var imageIndex = 0;
forall(IMAGES).do(function(a){ imageIndex++; a.uid = imageIndex; });
HTMLElement.prototype.delete = function(){ this.outerHTML = ""; };
HTMLElement.prototype.remove = HTMLElement.prototype.delete;


/* CSS Caching */

/*    Use this for writing CSS-altering functions that maintain
      the idempotence property */

const cachedCSS = function(elm, props){
  this.properties = [];
  this.values = [];
  for(var i=0;i<props.length;i++){
    if (elm.style[props[i]]!=undefined){
      this.properties.push(props[i]);
      this.values.push(elm.style[props[i]]);
    }
  }
}

cachedCSS.prototype.applyTo = function(elm){
  for(var i=0;i<this.properties.length;i++){
    elm.style[this.properties[i]] = this.values[i];
  }
}

HTMLElement.prototype.cacheCSSProperties = function(props){
  this.cachedCSS = new cachedCSS(this, props);
}
HTMLElement.prototype.cacheCSS = HTMLElement.prototype.cacheCSSProperties;
HTMLElement.prototype.resetCSS = function(){
  if (this.cachedCSS != undefined){
    this.cachedCSS.applyTo(this);
    this.cachedCSS = undefined;
  }
}




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

registerENUM(["STRINGTYPE", "NUMTYPE", "ARRAYTYPE"])

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
      default:
        return false;
        break;
    }
  }
  return true;
}





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
