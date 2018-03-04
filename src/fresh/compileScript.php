<?php

require("compileFile.php");
function COMPILE($modules, $customScope, $selfURL, $outputLocation, $outputToBrowser){
  $debugMode = false;
  $noOfStrings = 0;
  $stringsF = "";
  $testsF = "
    console.log('Running tests...');
    ";

  function debugPreamble($mod){
    return "
    DEBUGMESSAGES['$mod']=[];
    (function(){
      var failed = false;
      var passing = true;
      var debug=function(a){
        console.log('           $mod.js/DEBUG: '+a);
        DEBUGMESSAGES['$mod'].push(a);
      }
      var require=function(a){
        if (!a()) fail('Failed require('+a.toString().substring(5)+')');
      }
      var fail=function(a){
        failed = true;
        console.log('           $mod.js/ERROR: '+a);
        DEBUGMESSAGES['$mod'].push(a);
      }
      var ASYNC_TEST = function(){
        passing = false;
      }
      var pass = function(){
        if (!failed){
          console.log('✅ $mod');
          DEBUGMESSAGES['$mod'].push(true);
        }else{
          FAIL_TEST();
        }
      }
      var FAIL_TEST = function(){
        console.log('❌ $mod');
        DEBUGMESSAGES['$mod'].push(false);
      }
      try{
    ";
  }
  function debugPost($mod){
    return "
      if (passing){
        pass();
      }
    }catch(e){
      console.log('           $mod.js/ERROR: '+e.message);
      DEBUGMESSAGES['$mod'].push(e.message);
      DEBUGMESSAGES['$mod'].push(false);
      console.log('❌ $mod');
    }
      })()
      ";
  }
  $compiled = "\nvar SOURCEJS='".$selfURL."';\n\n\n";

  for($i=0;$i<count($modules);$i++){
    if( file_exists("../modules/".$modules[$i].".js") ){
        if ($modules[$i] == "debug"){
          $debugMode = true;
        }

        $o1 = compileFile("../modules/".$modules[$i].".js", $noOfStrings,$modules[$i]);
        //$compiled .= "\n\n/* File: ".$modules[$i]."*/ \n\n".$o1[0];

        //$compiled .= "\n\n/* File: ".$modules[$i]."*/ \n\ntry{\n".$o1[0]."\n}catch(e){if (debug!=undefined) debug(e.message+' in file "+$modules[$i]+"');}";

        $enclosed = ($modules[$i]=="adaptiveBase"||$modules[$i]=="adaptiveTools"||$modules[$i]=="onDOMChange"||$modules[$i]=="colourTools")?$o1[0]:
                          (debugPreamble($modules[$i]).$o1[0].debugPost($modules[$i]));
        $compiled .= "\n\n/* File: ".$modules[$i]." */ \n\n".$enclosed;
        $stringsF .= $o1[1];
        $noOfStrings = $o1[2];
        if ($modules[$i] != "debug"){
          $testsF .= debugPreamble($modules[$i]."-tests").$o1[3].debugPost($modules[$i]."-tests");
        }
    }else{
      $compiled = $compiled."\n\n/* Unknown file: ".$modules[$i]."*/";
    }
  }
  if ($customScope=="Y"){
    $compiled = "\n\n(function(){".$compiled."})();";
  }
  $compiled = "var MODULESLOADED=0;
  var DEBUGMESSAGES=new Object();
  \n".$compiled."\n\nMODULESLOADED=1;";
    header('Content-Type:text/plain');
    $countmodules = count($modules)-1;
    $testsF .= "
  const testSuccess = function(){
    for (A in DEBUGMESSAGES){
      if (!DEBUGMESSAGES[A][DEBUGMESSAGES[A].length-1]) return false;
    }
    return true;
  }
  MODULESLOADED=2;";
  $compiled = "/* \nAdaptiveWeb JS compilation at ".time()." \n\n\nTo use:\ndocument.body.appendChild(function(){(k=document.createElement('script')).src='".$selfURL."';return k;}()); \n\n*/\n".$stringsF."\n\n".$compiled."\n";

  if ($outputToBrowser){
    print($debugMode?$compiled."\n\n".$testsF:$compiled);
  }

  $f = fopen($outputLocation, "wb");
  fwrite($f, $debugMode?$compiled."\n\n".$testsF:$compiled);
  fclose($f);
}


?>
