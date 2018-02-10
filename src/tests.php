<?php
  header("Access-Control-Allow-Origin: *");
  if (file_exists("tests.js")){
    readfile("tests.js");
  }else{
    print("/*\nNo tests available\n*/");
  }
?>
