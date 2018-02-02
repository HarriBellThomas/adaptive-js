# Adaptive - Javascript Libraries

[![Build Status](https://travis-ci.com/HarriBellThomas/adaptive-js.svg?token=zdqxmjKjYitf3HJEzgrp&branch=master)](https://travis-ci.com/HarriBellThomas/adaptive-js)

#### Choosing Modules

In order to run the main functions used inside of the augmenting code, you should include the at least:

* onDOMChange
* adaptiveBase
* adaptiveTools

in *that* order. To do this, as to run the most minimal compilation, you would include the script:

​	`[BASE_URL]/fresh/?mod=onDOMChange,adaptiveBase,adaptiveTools`

To include other modules, simply ensure that they exist within the directory 

​	`[BASE_URL]/modules/`

and then use them within the script URL as above

_Note: `file.js` should be included simply as `file` within the URL_



#### Custom Scope

To prevent conflict within the webpage on the client-side, production versions of the script should be able run outside of global scope. This can be toggled at runtime by setting the value of

​	`negateglobal=[Y|N]`