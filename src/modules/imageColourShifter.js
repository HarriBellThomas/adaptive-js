registerNamespace("uk.org.adaptive.imageColourShifter");

uk.org.adaptive.imageColourShifter.isActive = false;

registerNSMethod(uk.org.adaptive.imageColourShifter, "red_green",(
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

registerNSMethod(uk.org.adaptive.imageColourShifter, "green_red",(
    function(){

        if (uk.org.adaptive.imageColourShifter.isActive)
            uk.org.adaptive.imageColourShifter.remove();

        uk.org.adaptive.imageColourShifter.isActive = true;

        forall(IMAGES).do(
            function(a){
                applyToImage(a, function(xy,rgba){

                    if (!uk.org.adaptive.imageColourShifter.isActive) return;

                    var type = properties["blindtype"]; 
                    var matrix = ColorMatrixMatrixes[type];

                    return {
                        r: rgba.r * matrix.R[0] / 100.0 + rgba.g * matrix.R[1] / 100.0 + rgba.b * matrix.R[2] / 100.0,
                        g: rgba.r * matrix.G[0] / 100.0 + rgba.g * matrix.G[1] / 100.0 + rgba.b * matrix.G[2] / 100.0,
                        b: rgba.r * matrix.B[0] / 100.0 + rgba.g * matrix.B[1] / 100.0 + rgba.b * matrix.B[2] / 100.0,
                        a: rgba.a
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
