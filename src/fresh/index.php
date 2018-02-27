<?php
  require("compileFile.php");
  header("Access-Control-Allow-Origin: *");
  $modules = explode(",",$_GET['mod']);
  $customScope = $_GET['negateglobal'];
  $selfURL = "https://js.adaptive.org.uk/fresh/?negateglobal=".$_GET['negateglobal']."&mod=".$_GET['mod'];

  $debugMode = false;
  $noOfStrings = 0;
  $stringsF = "";
  $testsF = "
    var DEBUGMESSAGES=new Object();
    console.log('Running tests...');
    var no_passed = 0;
    ";

  function debugPreamble($mod){
    return "
    DEBUGMESSAGES['$mod']=[];
    (function(){
      var failed = false;
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
      try{
    ";
  }
  function debugPost($mod){
    return "
      if (!failed){
        console.log('✅ $mod');
        no_passed++;
        DEBUGMESSAGES['$mod'].push('✅');
      }else{
        console.log('❌ $mod');
        DEBUGMESSAGES['$mod'].push('❌');
      }
    }catch(e){
      console.log('           $mod.js/ERROR: '+e.message);
      DEBUGMESSAGES['$mod'].push(e.message);
      DEBUGMESSAGES['$mod'].push('❌');
      console.log('❌ $mod');
    }
      })()
      ";
  }
  $compiled = "\nvar SOURCEJS='".$selfURL."';\n\n";

  for($i=0;$i<count($modules);$i++){
    if( file_exists("../modules/".$modules[$i].".js") ){
        if ($modules[$i] == "debug"){
          $debugMode = true;
        }

        $o1 = compileFile("../modules/".$modules[$i].".js", $noOfStrings);
        //$compiled .= "\n\n/* File: ".$modules[$i]."*/ \n\n".$o1[0];

        //$compiled .= "\n\n/* File: ".$modules[$i]."*/ \n\ntry{\n".$o1[0]."\n}catch(e){if (debug!=undefined) debug(e.message+' in file "+$modules[$i]+"');}";

        $compiled .= "\n\n/* File: ".$modules[$i]."*/ \n\n".$o1[0];
        $stringsF .= $o1[1];
        $noOfStrings = $o1[2];
        if ($modules[$i] != "debug"){
          $testsF .= debugPreamble($modules[$i]).$o1[3].debugPost($modules[$i]);
        }
    }else{
      $compiled = $compiled."\n\n/* Unknown file: ".$modules[$i]."*/";
    }
  }
  if ($customScope=="Y"){
    $compiled = "\n\n(function(){".$compiled."})();";
  }
  header('Content-Type:text/plain');
  $countmodules = count($modules)-1;
  $testsF .= "\nconsole.log('Finished tests with '+no_passed+' of $countmodules modules passing.');";
  $compiled = "/* \nAdaptiveWeb JS compilation at ".time()." \n\n\nTo use:\ndocument.body.appendChild(function(){(k=document.createElement('script')).src='".$selfURL."';return k;}()); \n\n*/\n".$stringsF."\n\n".$compiled;
  print($debugMode?$compiled."\n\n".$testsF:$compiled);

  $f = fopen("../tests.js", "wb");
  fwrite($f, $testsF);
  fclose($f);

  $f = fopen("../output.js", "wb");
  fwrite($f, $debugMode?$compiled."\n\n".$testsF:$compiled);
  fclose($f);
?>
