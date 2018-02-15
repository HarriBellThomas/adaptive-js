/* 'ForAll' ENUMs */

registerENUM(["IMAGES","DIVS","VIDEOS","LINKS","TABLES","SPANS","BUTTONS","VISUALS","PARAGRAPHS", "HEADERS"]);

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
      return forall().where(a=> a.tagName != "SCRIPT" && a.src != undefined);
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
}
const documentKeyUp = function(e) {
  e = e || window.event;
  removeKeyIndicator(e.keyCode);

  for (var i=0; i<KEYUPLISTENERS.length; i++){
    const keycode = KEYUPLISTENERS[i][0];
    if (keycode == e.keyCode){
      KEYUPLISTENERS[i][1]();
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







<<<<<<< HEAD



/* Extracting rgb/hex values from element
=======
/* Extracting rgb/hex values from element

>>>>>>> a27dea8bf95dbb1c0cd3db93a6dd00714a69d161
 Example: colour = rgbaValue(extractColour(element, "backgroundColor"))
            colour = hexValue(extractColour(element, "color"))
*/


const extractColour = function (element, property) {
  return window.getComputedStyle(element, null)[property];
};

const hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 1
  } : null;
};

const rgbToHex = function (red, green, blue) {
  var rgb = blue | (green << 8) | (red << 16);
  return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

const colourNameToHex = function (colour) {
  var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};
  if (typeof colours[colour.toLowerCase()] != 'undefined')
    return colours[colour.toLowerCase()];
  return false;
};

const rgbaValue = function (c) {
  if (c.startsWith("rgba")) {
    c = c.substring(5, c.length - 1)
      .replace(/ /g, '')
      .split(',');
    return {
      r: parseInt(c[0]),
      g: parseInt(c[1]),
      b: parseInt(c[2]),
      a: parseInt(c[3])
    }
  } else if (c.startsWith("rgb")) {
    c = c.substring(4, c.length - 1)
      .replace(/ /g, '')
      .split(',');
    return {
      r: parseInt(c[0]),
      g: parseInt(c[1]),
      b: parseInt(c[2]),
      a: 1
    }
  } else {
    if (!c.startsWith("#")) {
      c = colourNameToHex(c);
    }
    return hexToRgb(c);
  }
};

const hexValue = function (c) {
  if (c.startsWith("rgba")) {
    c = c.substring(5, c.length - 3)
      .replace(/ /g, '')
      .split(',');
    return rgbToHex(c[0],c[1],c[2]);
  } else if (c.startsWith("rgb")) {
    c = c.substring(4, c.length - 1)
      .replace(/ /g, '')
      .split(',');
    return rgbToHex(c[0],c[1],c[2]);
  } else {
    if (!c.startsWith("#")) {
      c = colourNameToHex(c);
    }
    return c;
  }
};
