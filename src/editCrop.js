
angular.module('sotos.crop-image').directive('editCrop', ['$window',function($window) {
    return {
        require: '^imageCrop',
        restrict: 'E',
        scope: false,
        link: function(scope, element, attrs, cropCtrl)
        {





            var iMouseX=0;
            var iMouseY=1;
            var myPos;
            var isTouch=false;

            var canvasEdit=cropCtrl.getEditCanvas();


            //find the position of element  not in modal
            function offset(elm) {
                try {return elm.offset();} catch(e) {}
                var rawDom = elm[0];
                var _x = 0;
                var _y = 0;
                var body = document.documentElement || document.body;
                var scrollX = window.pageXOffset || body.scrollLeft;
                var scrollY = window.pageYOffset || body.scrollTop;
                _x = rawDom.getBoundingClientRect().left + scrollX;
                _y = rawDom.getBoundingClientRect().top + scrollY;
                return { left: _x, top:_y };
            }


            //find the position of elemen work also with modal
            //fix the offset in firefox and modal
           var findPos= function (obj) {
               obj =obj[0];
                var curleft = 0;
                var  curtop = 0;

                if (obj.offsetParent) {
                    do {
                        curleft += obj.offsetLeft;
                        curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
                return  { left: curleft, top:curtop };
            }
            };
            
  var detectBrowser = function (){
  var val = navigator.userAgent.toLowerCase(); 
  
  if(val.indexOf("firefox") > -1)
  {
 return 'firefox';
  }
  else if(val.indexOf("chrome") > -1)
  {
 return 'chrome';
  }
  else if(val.indexOf("opera") > -1)
  {
     return 'opera';
  }
  else if(val.indexOf("msie") > -1)
  {
 return 'msie';
  }
  else if(val.indexOf("safari") > -1)
  {
 return 'safari';
  }
}; 

            var mousemove =function(e){
                myPos=findPos(element.children());

                //fix the offset in firefox and modal
                //thanks to yasar
                if(cropCtrl.inModal){
                iMouseX = Math.floor(e.clientX  -myPos.left);
                iMouseY = Math.floor(e.clientY  -myPos.top);
                   }else{
                    if( isTouch){
                        iMouseX = Math.floor(e.targetTouches[0].pageX -myPos.left);
                        iMouseY = Math.floor(e.targetTouches[0].pageY -myPos.top);

                    }else{
                        iMouseX = Math.floor(e.pageX -myPos.left);
                        iMouseY = Math.floor(e.pageY -myPos.top);

                    }
                  	}
                
               
                cropCtrl.theSelection.rotateCenter.isrotate=false;
                // in case of drag of whole selector
                if (cropCtrl.theSelection.bDragAll) {
                    cropCtrl.theSelection.x = iMouseX - cropCtrl.theSelection.px;
                    cropCtrl.theSelection.y = iMouseY - cropCtrl.theSelection.py;
                }

                for (var i = 0; i < 5; i++) {
                    cropCtrl.theSelection.bHow[i] = false;
                    cropCtrl.theSelection.iCSize[i] = cropCtrl.theSelection.csize;
                }

                //ratio hover reset
                cropCtrl.theSelection.ratioHover= false;
                cropCtrl.theSelection.ratioSize =6;

                // hovering over resize cubes
                if (iMouseX >  cropCtrl.theSelection.x -  cropCtrl.theSelection.csizeh && iMouseX <  cropCtrl.theSelection.x +  cropCtrl.theSelection.csizeh &&
                    iMouseY >  cropCtrl.theSelection.y -  cropCtrl.theSelection.csizeh && iMouseY <  cropCtrl.theSelection.y +  cropCtrl.theSelection.csizeh) {

                     cropCtrl.theSelection.bHow[0] = true;
                     cropCtrl.theSelection.iCSize[0] =  cropCtrl.theSelection.csizeh;
                }
                if (iMouseX >  cropCtrl.theSelection.x +  cropCtrl.theSelection.w- cropCtrl.theSelection.csizeh && iMouseX <  cropCtrl.theSelection.x +  cropCtrl.theSelection.w +  cropCtrl.theSelection.csizeh &&
                    iMouseY >  cropCtrl.theSelection.y -  cropCtrl.theSelection.csizeh && iMouseY <  cropCtrl.theSelection.y +  cropCtrl.theSelection.csizeh) {

                     cropCtrl.theSelection.bHow[1] = true;
                     cropCtrl.theSelection.iCSize[1] =  cropCtrl.theSelection.csizeh;
                }
                if (iMouseX >  cropCtrl.theSelection.x +  cropCtrl.theSelection.w- cropCtrl.theSelection.csizeh && iMouseX <  cropCtrl.theSelection.x +  cropCtrl.theSelection.w +  cropCtrl.theSelection.csizeh &&
                    iMouseY >  cropCtrl.theSelection.y +  cropCtrl.theSelection.h- cropCtrl.theSelection.csizeh && iMouseY <  cropCtrl.theSelection.y +  cropCtrl.theSelection.h +  cropCtrl.theSelection.csizeh) {

                     cropCtrl.theSelection.bHow[2] = true;
                     cropCtrl.theSelection.iCSize[2] =  cropCtrl.theSelection.csizeh;
                }
                if (iMouseX >  cropCtrl.theSelection.x -  cropCtrl.theSelection.csizeh && iMouseX <  cropCtrl.theSelection.x +  cropCtrl.theSelection.csizeh &&
                    iMouseY >  cropCtrl.theSelection.y +  cropCtrl.theSelection.h- cropCtrl.theSelection.csizeh && iMouseY <  cropCtrl.theSelection.y +  cropCtrl.theSelection.h +  cropCtrl.theSelection.csizeh) {

                     cropCtrl.theSelection.bHow[3] = true;
                     cropCtrl.theSelection.iCSize[3] =  cropCtrl.theSelection.csizeh;
                }


                // hovering over resize rotate
                if (iMouseX >  cropCtrl.theSelection.rotateCenter.sx -  cropCtrl.theSelection.csizeh && iMouseX <  cropCtrl.theSelection.rotateCenter.sx +  cropCtrl.theSelection.csizeh &&
                    iMouseY >  cropCtrl.theSelection.rotateCenter.sy -  cropCtrl.theSelection.csizeh && iMouseY <  cropCtrl.theSelection.rotateCenter.sy +  cropCtrl.theSelection.csizeh) {

                    cropCtrl.theSelection.bHow[4] = true;
                    cropCtrl.theSelection.iCSize[4] =  cropCtrl.theSelection.csizeh;
                }


                // hovering ratio
                if (iMouseX >  40 && iMouseX <  70 &&
                    iMouseY >  50 && iMouseY <  60) {
                    cropCtrl.theSelection.ratioHover= true;
                    cropCtrl.theSelection.ratioSize = 10;
                }


                // in case of dragging of resize cubes
                var iFW, iFH, iFX, iFY;

                if (cropCtrl.theSelection.bDrag[0]) {
                    iFX = iMouseX - cropCtrl.theSelection.px;
                    iFY = iMouseY - cropCtrl.theSelection.py;
                    iFW = cropCtrl.theSelection.w + cropCtrl.theSelection.x - iFX;
                    iFH = cropCtrl.theSelection.h + cropCtrl.theSelection.y - iFY;
                }
                if (cropCtrl.theSelection.bDrag[1]) {

                    iFX = cropCtrl.theSelection.x;
                    iFY = iMouseY - cropCtrl.theSelection.py;
                    iFW = iMouseX - cropCtrl.theSelection.px - iFX;
                    iFH = cropCtrl.theSelection.h + cropCtrl.theSelection.y - iFY;
                }
                if (cropCtrl.theSelection.bDrag[2]) {

                    iFX = cropCtrl.theSelection.x;
                    iFY = cropCtrl.theSelection.y;
                    iFW = iMouseX - cropCtrl.theSelection.px - iFX;
                    iFH = iMouseY - cropCtrl.theSelection.py - iFY;
                }
                if (cropCtrl.theSelection.bDrag[3]) {

                    iFX = iMouseX - cropCtrl.theSelection.px;
                    iFY = cropCtrl.theSelection.y;
                    iFW = cropCtrl.theSelection.w + cropCtrl.theSelection.x - iFX;
                    iFH = iMouseY - cropCtrl.theSelection.py - iFY;
                }

                //the rotate
                if (cropCtrl.theSelection.bDrag[4]) {
                    cropCtrl.theSelection.rotateCenter.isrotate=true;

                    //Issues #16
                    // fix rotation step 45º
                    var rotate = Math.atan2(iMouseY-cropCtrl.theSelection.rotateCenter.y, iMouseX-cropCtrl.theSelection.rotateCenter.x);

                    //if set true
                    if(cropCtrl.theSelection.rotateCenter.rotateRadiansLock){
                    var myPi = Math.PI/180;

                    //from 0º - 20º = 0º
                    //    20º - 45º = 45º
                    //    45º - 90º = 90º
                    //    90º - 135º = 135º
                    //    135º - 180º = 180º
                    if(rotate>0 &&  rotate< 20 * myPi){
                        cropCtrl.theSelection.rotateCenter.angleRotate=0;
                    }
                    if(rotate> 20 * myPi &&  rotate< 45 * myPi){
                        cropCtrl.theSelection.rotateCenter.angleRotate=myPi*45;
                    }
                    if(rotate> 45 * myPi &&  rotate< 90 * myPi){
                        cropCtrl.theSelection.rotateCenter.angleRotate=myPi*90;
                    }
                    if(rotate> 90 * myPi &&  rotate< 135 * myPi){
                        cropCtrl.theSelection.rotateCenter.angleRotate=myPi*135;
                    }
                    if(rotate> 135 * myPi &&  rotate< 180 * myPi){
                        cropCtrl.theSelection.rotateCenter.angleRotate=myPi*180;
                    }

                     //negative radians check
                    if(rotate<0 &&  rotate> 20 * myPi*-1){
                        cropCtrl.theSelection.rotateCenter.angleRotate=0;
                    }
                    if(rotate< 20 * myPi*-1 &&  rotate> 45 * myPi*-1){
                        cropCtrl.theSelection.rotateCenter.angleRotate=myPi*45*-1;
                    }
                    if(rotate< 45 * myPi*-1 &&  rotate> 90 * myPi*-1){
                        cropCtrl.theSelection.rotateCenter.angleRotate=myPi*90*-1;
                    }
                    if(rotate< 90 * myPi*-1 &&  rotate> 135 * myPi*-1){
                        cropCtrl.theSelection.rotateCenter.angleRotate=myPi*135*-1;
                    }
                    if(rotate< 135 * myPi*-1 &&  rotate> 180 * myPi*-1){
                        cropCtrl.theSelection.rotateCenter.angleRotate=myPi*180*-1;
                    }
                    }else{
                    cropCtrl.theSelection.rotateCenter.angleRotate=rotate;


                    }

                }




                if (iFW >  cropCtrl.theSelection.csizeh * 2 && iFH >  cropCtrl.theSelection.csizeh * 2) {
                    cropCtrl.theSelection.w = iFW;
                    cropCtrl.theSelection.h = iFH;
                    cropCtrl.theSelection.x = iFX;
                    cropCtrl.theSelection.y = iFY;
                }
                //console.log(iMouseX+"  my "+iMouseY+"   x "+ cropCtrl.theSelection.x+" y "+ cropCtrl.theSelection.y);
                cropCtrl.drawScene();

            };



            var  mousedown = function(e) {
                myPos=findPos(element.children());

                
               //fix the offset in firefox and modal
                //thanks to yasar
                if(cropCtrl.inModal){
                iMouseX = Math.floor(e.clientX  -myPos.left);
                iMouseY = Math.floor(e.clientY  -myPos.top);
                   }else{
                    if( isTouch){

                        iMouseX = Math.floor(e.targetTouches[0].pageX -myPos.left);
                        iMouseY = Math.floor(e.targetTouches[0].pageY -myPos.top);
                    }else{
                        iMouseX = Math.floor(e.pageX -myPos.left);
                        iMouseY = Math.floor(e.pageY -myPos.top);

                    }
              	
                  	}
                
                cropCtrl.theSelection.px = iMouseX -   cropCtrl.theSelection.x;
                cropCtrl.theSelection.py = iMouseY -   cropCtrl.theSelection.y;

                if (  cropCtrl.theSelection.bHow[0]) {
                    cropCtrl.theSelection.px = iMouseX -   cropCtrl.theSelection.x;
                    cropCtrl.theSelection.py = iMouseY -   cropCtrl.theSelection.y;
                }
                if (  cropCtrl.theSelection.bHow[1]) {
                    cropCtrl.theSelection.px = iMouseX -   cropCtrl.theSelection.x -   cropCtrl.theSelection.w;
                    cropCtrl.theSelection.py = iMouseY -   cropCtrl.theSelection.y;
                }
                if (  cropCtrl.theSelection.bHow[2]) {
                    cropCtrl.theSelection.px = iMouseX -   cropCtrl.theSelection.x -   cropCtrl.theSelection.w;
                    cropCtrl.theSelection.py = iMouseY -   cropCtrl.theSelection.y -   cropCtrl.theSelection.h;
                }
                if (  cropCtrl.theSelection.bHow[3]) {
                    cropCtrl.theSelection.px = iMouseX -   cropCtrl.theSelection.x;
                    cropCtrl.theSelection.py = iMouseY -   cropCtrl.theSelection.y -   cropCtrl.theSelection.h;
                }


                if (  cropCtrl.theSelection.ratioHover) {

                    cropCtrl.theSelection.ratioOn=!cropCtrl.theSelection.ratioOn;
                }


                if (iMouseX >   cropCtrl.theSelection.x +   cropCtrl.theSelection.csizeh && iMouseX <   cropCtrl.theSelection.x+  cropCtrl.theSelection.w -   cropCtrl.theSelection.csizeh &&
                    iMouseY >   cropCtrl.theSelection.y +   cropCtrl.theSelection.csizeh && iMouseY <   cropCtrl.theSelection.y+  cropCtrl.theSelection.h -   cropCtrl.theSelection.csizeh) {

                    if(! cropCtrl.theSelection.bHow[4]){
                        cropCtrl.theSelection.bDragAll = true;
                    }
                }

                for (var i = 0; i < 5; i++) {
                    if (  cropCtrl.theSelection.bHow[i]) {
                        cropCtrl.theSelection.bDrag[i] = true;
                    }
                }
            };


            var mouseUp = function(e) {

                cropCtrl.theSelection.bDragAll = false;
                for (var i = 0; i < 5; i++) {
                    cropCtrl.theSelection.bDrag[i] = false;
                }
                cropCtrl.theSelection.px = 0;
                cropCtrl.theSelection.py = 0;
            };




            var  touchDown = function(e) {
                isTouch=true;
                mousedown(e);

            };
            var  touchMove = function(e) {
                isTouch=true;
                mousemove(e);
            };

            var  touchUp = function(e) {
                isTouch=false;
                mouseUp(e);
            };

            element.bind('mousemove', mousemove);
            element.bind('mousedown', mousedown);
            element.bind('mouseup', mouseUp);

            element.bind('touchstart', touchDown);
            element.bind('touchmove', touchMove);
            element.bind('touchend', touchUp);





            //element.bind('dblclick', cropCtrl.getImage);
            element.append(canvasEdit);

        }
    };

}]);

