<?php
  require("compileScript.php");
  header("Access-Control-Allow-Origin: *");

  $modules = explode(",",$_GET['mod']);
  $customScope = $_GET['negateglobal'];
  $selfURL = "https://js.adaptive.org.uk/fresh/?negateglobal=".$_GET['negateglobal']."&mod=".$_GET['mod'];

  compile($modules, $customScope, $selfURL, "../out.js", true);
?>
