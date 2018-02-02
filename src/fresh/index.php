<?php
  $modules = explode(",",$_GET['mod']);
  $customScope = $_GET['negateglobal'];
  $selfURL = "https://js.adaptive.org.uk/fresh/?negateglobal=".$_GET['negateglobal']."&mod=".$_GET['mod'];
  $body = "\nvar SOURCEJS='".$selfURL."';\n\n";
  for($i=0;$i<count($modules);$i++){
    if( file_exists("../modules/".$modules[$i].".js") ){
      $body = $body."\n\n/* File: ".$modules[$i]."*/ \n\n".file_get_contents("../modules/".$modules[$i].".js");
    }else{
      $body = $body."\n\n/* Unknown file: ".$modules[$i]."*/";
    }
  }
  if ($customScope=="Y"){
    $body = "\n\n(function(){".$body."})();";
  }
  $body = "/* \nAdaptiveWeb JS compilation at ".time()." \n\n\nTo use:\ndocument.body.appendChild(function(){(k=document.createElement('script')).src='".$selfURL."';return k;}()); \n\n*/ ".$body;
  print($body);

  $f = fopen("../cache/output.js", "wb");
  fwrite($f, $body);
  fclose($f);
?>
