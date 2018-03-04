<?php
  require("compileScript.php");
  header("Access-Control-Allow-Origin: *");

  $modules = ["onDOMChange", "adaptiveBase", "adaptiveTools", "colorTools", "linkHighligher", "visionTools", "showMouse", "typeWarning", "passwordReveal", "magnifier", "videoTools","darkMode", "imageColourShifter", "colorManipulations", "motorFeatures", "paragraphReader", "speedBar", "init"];
  $customScope = "NO";
  $selfURL = "https:/js.adaptive.org.uk/adaptive.js";

  compile($modules, $customScope, $selfURL, "../adaptive.js", false);
?>
