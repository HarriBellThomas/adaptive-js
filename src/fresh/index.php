<?php
  require("compileFile.php");
  header("Access-Control-Allow-Origin: *");
  $modules = explode(",",$_GET['mod']);
  $customScope = $_GET['negateglobal'];
  $selfURL = "https://js.adaptive.org.uk/fresh/?negateglobal=".$_GET['negateglobal']."&mod=".$_GET['mod'];

  $noOfStrings = 0;
  $stringsF = "";
  $testsF = "";
  $compiled = "\nvar SOURCEJS='".$selfURL."';\n\n";

  for($i=0;$i<count($modules);$i++){
    if( file_exists("../modules/".$modules[$i].".js") ){

        $o1 = compileFile("../modules/".$modules[$i].".js", $noOfStrings);
        //$compiled .= "\n\n/* File: ".$modules[$i]."*/ \n\n".$o1[0];

        $compiled .= "\n\n/* File: ".$modules[$i]."*/ \n\ntry{\n".$o1[0]."\n}catch(e){if (debug!=undefined) debug(e.message+' in file "+$modules[$i]+"');}";
        $stringsF .= $o1[1];
        $noOfStrings = $o1[2];
        $testsF .= $o1[3];

    }else{
      $compiled = $compiled."\n\n/* Unknown file: ".$modules[$i]."*/";
    }
  }
  if ($customScope=="Y"){
    $compiled = "\n\n(function(){".$compiled."})();";
  }
  header('Content-Type:text/plain');
  $compiled = "/* \nAdaptiveWeb JS compilation at ".time()." \n\n\nTo use:\ndocument.body.appendChild(function(){(k=document.createElement('script')).src='".$selfURL."';return k;}()); \n\n*/\n".$stringsF."\n\n".$compiled;
  print($compiled);



  $f = fopen("../tests.js", "wb");
  fwrite($f, $testsF);
  fclose($f);

  $f = fopen("../output.js", "wb");
  fwrite($f, $compiled);
  fclose($f);
?>
