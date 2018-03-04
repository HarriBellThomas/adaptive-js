<?php
  function writeOutput($str){
    global $outputFile;
    $outputFile .= $str;
  }

  function popChar(){
    global $fileIndex, $length, $input, $escaped, $outputFile;
    $escaped = false;
    if ($fileIndex < $length){
      $fileIndex ++;
      $outputFile .= $input[$fileIndex-1];
      return $input[$fileIndex-1];
    } else {
      return false;
    }
  }
  function popChars($n){
    global $fileIndex, $escaped;
    for ($i=0; $i<$n; $i++){
      popChar();
    }
  }
  function popCharsClean($n){
    global $fileIndex, $escaped;
    $escaped = false;
    $fileIndex += $n;
  }
  function peekChars($n){
    global $fileIndex, $length, $input;
    if (!($fileIndex < $length)) return false;
    $output = "";
    for($i=0;$i<$n;$i++){
      if (($fileIndex+$i) < $length){
        $output .= $input[$fileIndex+$i];
      }
    }
    return $output;
  }
  function validPosition(){
    global $fileIndex, $length;
    return ($fileIndex < $length);
  }

  function compileFile($fl, $stringsC,$modSimple){
    global $fileIndex, $length, $output, $escaped, $input, $outputFile;
    $input = file_get_contents($fl);
    /* Single line comments removal */
    //$input = preg_replace("/\/\/(.)*[\n|\r|\r\n]/", "", $input);

    $length = strlen($input);
    $fileIndex = 0;
    $vars = $stringsC;
    //$outputFile = "DEBUGMESSAGES['".$modSimple."']=[];\ntry{ \n";
    $outputFile = "";
    $currentString = "";


    $stringsFile = "";
    $testsFile = "";

    $moduleName = false;


    $commentLevel = 0;
    $mode = 0;
    $escaped = false;
    /* Modes:
        - 0 = nothing
        - 1 = comment
        - 2 = string '
        - 3 = string "
        - 4 = comment line
        - 5 = external resource
    */

    while(validPosition()){
      if (peekChars(2) == "/*" && $mode == 0){
        $mode = 1;
        popCharsClean(2);
        continue;
      }

      if (peekChars(2) == "(<" && $mode == 0){
        $mode = 5;
        popCharsClean(2);
        continue;
      }

      if (peekChars(2) == ">)" && $mode == 5){
        $mode = 0;
        popCharsClean(2);
        continue;
      }

      if (peekChars(2) == "//" && $mode == 0){
        $mode = 4;
        popCharsClean(2);
        continue;
      }

      if (peekChars(1) == "\n" && $mode == 4){
        $mode = 0;
        popCharsClean(1);
        continue;
      }

      if (peekChars(2) == "*/" && $mode == 1){
        $mode = 0;
        popCharsClean(2);
        continue;
      }

      $forceEscape = false;

      if (!$escaped){
        if (peekChars(1) == "'" && ($mode == 2 || $mode == 0)){
          if ($mode == 2){
            if ($moduleName === false){
              $moduleName = $currentString;
            }
            writeOutput("String_".$vars);
            $stringsFile .= "var "."String_".$vars." = '".$currentString."'; \n";
            $vars++;
            $currentString = "";
            $mode = 0;
          }else{
            $mode = 2;
          }
          popCharsClean(1);
          continue;
        }

        if (peekChars(1) == "\"" && ($mode == 3 || $mode == 0)){
          if ($mode == 3){
            if ($moduleName === false){
              $moduleName = $currentString;
            }
            writeOutput("String_".$vars);
            $stringsFile .= "var "."String_".$vars." = \"".$currentString."\"; \n";
            $vars++;
            $currentString = "";
            $mode = 0;
          }else{
            $mode = 3;
          }
          popCharsClean(1);
          continue;
        }
        if (peekChars(1) == "\\"){
          $forceEscape = true;
        }
      }


      if ($mode == 2 || $mode == 3){
        $currentString .= peekChars(1);
        popCharsClean(1);
      }else if ($mode == 5){
        $testsFile .= peekChars(1);
        popCharsClean(1);
      }else if($mode ==1 || $mode ==4){
        popCharsClean(1);
      }else{
        popChar();
      }
      $escaped = $forceEscape;
    }




    /* Simple arrow functions */
  //  $outputFile = preg_replace("/\(\s*([A-Za-z\ \r\n\,\)\(]*)\s*\=\>\s*([^[\;\r\n]+)\)/", "(function($1){ return $2; })", $outputFile);

    /* Multi-line arrow functions */
  //  $outputFile = preg_replace("/\(\s*\(([A-Za-z\ \r\n\,\)\(]*)\)\s*\=\>\s*\{(.*?)\}\)/s", "(function($1){ $2 })", $outputFile);


    /* Multi-line arrow functions */
  //  $outputFile = preg_replace("/\(\s*([A-Za-z\ \r\n\,\)\(]*)\s*\=\>\s*\{(.*?)\}\)/s", "(function($1){ $2 })", $outputFile);

    /* Replace 'const' and 'let' with var */

    //$outputFile = preg_replace("/([^[A-Za-z\_\-\.]]*)?(const)\ /s", "$1var ", $outputFile);
    $outputFile = preg_replace("/([^A-Za-z\_\-\.\n])+(const)\ |(\n)(const)\ /", "\n$1var ", $outputFile);

    //$outputFile = preg_replace("/([^[A-Za-z\_\-\.]]*)?(let)\ /s", "$1var ", $outputFile);
    $outputFile = preg_replace("/([^A-Za-z\_\-\.\n])+(let)\ |(\n)(let)\ /", "\n$1var ", $outputFile);

    /* Replace self with package name */
    $outputFile = preg_replace("/([^[A-Za-z\_\-]]*)?self([^[A-Za-z\_\-]]*)?/s", "$1".$moduleName."$2", $outputFile);

    /* Remove new lines */
    $outputFile = preg_replace("/[\n]+/", "\n", $outputFile);

    /* Make sure tests conform to requirements */
    $outputFile = preg_replace("/[\n]+/", "\n", $outputFile);

    $testsFile = preg_replace("/(?:([^A-Za-z\_\-\.]+)(require\())|(?:(^)(require\())/", "$1require(()=> ", $testsFile);

/*
    $outputFile .= "\nDEBUGMESSAGES['".$modSimple."'].push(true);
}catch(e){
  console.log('Module ".$modSimple." exception: '+e);
  DEBUGMESSAGES['".$modSimple."'].push(e.message);
  DEBUGMESSAGES['".$modSimple."'].push(false);
}";
*/
    $fp = fopen($fl."-compiled", "w+");
    fwrite($fp, $outputFile);
    fclose($fp);

    $fp = fopen($fl."-strings", "w+");
    fwrite($fp, $stringsFile);
    fclose($fp);

    $fp = fopen($fl."-tests", "w+");
    fwrite($fp, $testsFile);
    fclose($fp);




    return array($outputFile, $stringsFile, $vars, $testsFile);
  }


?>
