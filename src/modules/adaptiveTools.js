
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

var TITLESCROLLTIMER;
var TITLESCROLLPOSITION;
var TITLESCROLLSTRING;
const sectionTitle = function(indx, str){
  const rval = (indx%str.length);
  return "..."+str.substring(rval)+" "+str;
}
const SCROLLINGTITLE = function(){
  TITLESCROLLPOSITION = 0;
  TITLESCROLLSTRING = document.title;
  TITLESCROLLTIMER = setInterval(function(){
    TITLESCROLLPOSITION++;
    document.title = sectionTitle(TITLESCROLLPOSITION, TITLESCROLLSTRING);
  }, 400);
}
const KILLSCROLLINGTITLE = function(){
  document.title = TITLESCROLLSTRING;
  clearInterval(TITLESCROLLTIMER);
}
