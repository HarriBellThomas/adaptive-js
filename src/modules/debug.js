var msg = "%cDebug mode enabled \nWithin unit tests, call:";
msg +=    "\n   debug(x): prints x to the console, ";
msg +=    "\n   require(p): will fail if p is false, ";
msg +=    "\n   fail(x): will fail the test and print x to the console.";
msg +=    "\nExceptions will fail the test immediately and report to the console.";
msg +=    "\nThe array DEBUGMESSAGES contains the output of tests.";
console.log(msg, 'font-size: 14pt; font-weight: bold;');
