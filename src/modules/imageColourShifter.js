registerNamespace("uk.org.adaptive.imageColourShifter");

uk.org.adaptive.imageColourShifter.isActive = false;

registerNSMethod(uk.org.adaptive.imageColourShifter, "red-green",(
    function(){

        if (uk.org.adaptive.imageColourShifter.isActive)
            uk.org.adaptive.imageColourShifter.remove();

        uk.org.adaptive.imageColourShifter.isActive = true;

        forall(IMAGES).do(
            function(a){
                applyToImage(a, function(xy,rgba){

                    if (!uk.org.adaptive.imageColourShifter.isActive) return;

                    if (rgba.r > 200 && rgba.g<150 && rgba.b<150) {
                        return {
                            /* Shift red to pink */

                            r:rgba.r-50,
                            g:rgba.g,
                            b:rgba.b+50,
                            a:rgba.a
                        }
                    } else if (rgba.r<100 && rgba.g>150 && rgba.b>150) {
                        return {
                            /* Shift turquoise to green  */

                            r:rgba.r,
                            g:rgba.g,
                            b:rgba.b-50,
                            a:rgba.a
                        }
                    } else {
                        return {
                            /* Do nothing */

                            r:rgba.r,
                            g:rgba.g,
                            b:rgba.b,
                            a:rgba.a
                        }
                    }
                })
            });
    }
));

registerNSMethod(uk.org.adaptive.imageColourShifter, "green-red",(
    function(){

        if (uk.org.adaptive.imageColourShifter.isActive)
            uk.org.adaptive.imageColourShifter.remove();

        uk.org.adaptive.imageColourShifter.isActive = true;

        forall(IMAGES).do(
            function(a){
                applyToImage(a, function(xy,rgba){

                    if (!uk.org.adaptive.imageColourShifter.isActive) return;

                    if (rgba.r > 200 && rgba.g<150 && rgba.b<200) {
                        return {
                            /* Shift red to pink/pink to purple */

                            r:rgba.r-50,
                            g:rgba.g,
                            b:rgba.b+50,
                            a:rgba.a
                        }
                    } else if (rgba.r<100 && rgba.g>150 && rgba.b>150) {
                        return {
                            /* Shift red to pink */

                            r: rgba.r+50,
                            g: rgba.g,
                            b: rgba.b-50,
                            a: rgba.a
                        }
                    } else if (rgba.r>100 && rgba.g>150 && rgba.b<150) {
                        return {
                            /* Shift yellow/green to yellow */

                            r: rgba.r+50,
                            g: rgba.g,
                            b: rgba.b,
                            a: rgba.a
                        }
                    } else return {
                        /* Do nothing */

                        r:rgba.r,
                        g:rgba.g,
                        b:rgba.b,
                        a:rgba.a
                    }
                })
            });
    }
));

/* Now we define the method 'remove' which removes the effect
    from the page                                             */

registerNSMethod(uk.org.adaptive.imageColourShifter, "remove",(
    function(){
        uk.org.adaptive.imageColourShifter.isActive = false;
        return true;
    }
));
