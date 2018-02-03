<?php
  if (file_exists("output.js")){
    readfile("output.js");
  }else{
    print("/*\nNo cached copy available\n*/");
  }
?>
