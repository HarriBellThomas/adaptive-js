const puppeteer = require('puppeteer');
var browser;
var page;

var numberOfImages = 0;
var numberOfImagesWithAlt = 0;
var siteSuccess = 0;
var sitesChecked= 0;

const sitesToCheck = ["https://en.wikipedia.org","https://www.amazon.com   ","https://www.google.com","https://www.youtube.com/watch?v=dQw4w9WgXcQ","http://www.huffingtonpost.co.uk/entry/frances-mcdormand-oscars-speech-three-billboards_uk_5a9cce5de4b089ec353bf973?utm_hp_ref=uk-homepage","https://stackoverflow.com/questions/49105472/how-to-convert-whole-column-of-dates-times-from-one-time-zone-to-another-in-r","https://qz.com/1214787/how-the-nras-money-forces-republicans-to-fight-gun-control/","https://www.vox.com/2018/3/5/17079238/oscars-2018-winners-losers-lady-bird-shape-water-haddish-rudolph-kimmel-kobe-bryant","https://boingboing.net/2018/03/03/decency.html","https://techcrunch.com/2018/03/03/2018-vc-investment-into-crypto-startups-set-to-surpass-2017-tally/","https://kottke.org/","https://dooce.com/","http://perezhilton.com/cocoperez/2018-03-05-oscars-2018-red-carpet-photos-academy-awards-fashion#.Wpz0FWTxw_U","https://talkingpointsmemo.com/","http://www.beppegrillo.it/prodotti-ignifughi-naturali","http://gawker.com/","http://www.drudgereport.com/","https://www.treehugger.com/","http://www.microsiervos.com/","http://www.tmz.com/","https://www.engadget.com/uk/","http://chezpim.com/","https://www.basicthinking.de/blog/","http://www.thesartorialist.com/","https://www.studentsforafreetibet.org/","https://jezebel.com/","https://mashable.com/","http://www.dirtydirtydancing.com/","https://www.buzzfeed.com/?utm_term=.mbM2D3GZ#.lbAal9oM","http://uk.businessinsider.com/?r=US&IR=T","https://www.thedailybeast.com/","https://thinkprogress.org/"];
var checkingSite = 0;

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

(async () => {

  browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  page = await browser.newPage();

  const siteCheck = async (site)=>{
    await page.goto(site);

    await page.evaluate(()=>{
      document.body.appendChild(function(){(k=document.createElement('script')).src='https://js.adaptive.org.uk/fresh/?negateglobal=N&mod=onDOMChange,adaptiveBase,adaptiveTools,colourTools,linkHighlighter,visionTools,showMouse,typeWarning,passwordReveal,magnifier,videoTools,darkMode,imageColourShifter,colorManipulations,motorFeatures,paragraphReader,speedBar,debug,init';return k;}());
    });

    const checker = async () => {
      const MODULES = await page.evaluate(()=>{return (MODULESLOADED==undefined)?0:MODULESLOADED;});
      if (MODULES == 2){
        clearInterval(checker);
        const outpt = await page.evaluate(()=>{return JSON.stringify(DEBUGMESSAGES);});
        //console.log(outpt);

        const successLoad = await page.evaluate(()=>{return testSuccess();});
        sitesChecked++;
        if (successLoad){
          siteSuccess++;
          console.log("Success for "+site);
        }else{
          console.log("Failed for "+site);
          console.log(outpt);
        }

        const images = await page.evaluate(()=>{return forall(IMAGES).where(a=>a.width>30&&a.height>30).count();});
        const imagesWOAlt = await page.evaluate(()=>{return forall(IMAGES).where(a=>(a.alt==undefined||a.alt.length<1)&&a.width>30&&a.height>30).count();});

        numberOfImagesWithAlt += (images-imagesWOAlt);
        numberOfImages += images;

        console.log("Out of a total of "+images+" images, "+imagesWOAlt+" have no alt tags.");
        console.log("In total, "+numberOfImagesWithAlt+" have alt tags out of "+numberOfImages+" tested so far.");
        console.log("Overall, "+siteSuccess + " sites are successful out of "+sitesChecked+" tested so far.");


        checkingSite++;
        if (checkingSite >= sitesToCheck.length){
          await browser.close();
          console.log("Closed");
          console.log("Checked: "+numberOfImages);
          console.log("W/ Alt tags: "+numberOfImagesWithAlt);
        }else{
          siteCheck(sitesToCheck[checkingSite]);
        }
      }else{
        (async () =>{
          await delay(7000);
          checker();
        })();
      }
    }
    (async () =>{
      await delay(7000);
      checker();
    })();

  }
  siteCheck(sitesToCheck[checkingSite]);


})();
