#sotos.image-crop module for angular
================
directive in angular 

crop images, put watermark and save directive in angular 

###v0.0.1 - v0.0.6

fix firefox

fix rotate

fix modal with Option Parameter inModal

fix save (add function )

fix touch

Limiting crop object inside area. by zaidchauhan

fix image crossOrigin

src folder

Fixes logic for default options. by Nick Darvey

###v0.0.7
Fixes Issues #16 lock rotation 45º step

###v0.0.8
Fixes Issues #3 Responsive canvases

Fixes Issues #13 404 in console watermark

Fixes Issues #17 Remove Double clicking the editable


[Demos http://sotos.gr/demos/crop-image/ ](http://sotos.gr/demos/crop-image/)


###Bower Install
```
bower install sotos.crop-image
```

###Use
```
 <html>
  <body>
    <image-crop image-out="imageOut"  crop-options="options" ng-transclude crop-image-save="saveCrop">
       <edit-crop></edit-crop>
       <view-crop></view-crop>
    </image-crop>
  </body>
  </html>
```
  
 
###set the module
`var app = angular.module('app',['sotos.crop-image']);`
 
in controller required  

```
 //the image to output
 $scope.imageOut='';
 // required
 $scope.options={}; 
 // image for crop required
 $scope.options.image="image.jpg";       
```
 
##Crop Options
```
         app.controller('cropFullCtrl',['$scope',function($scope){
            //the image to output
            $scope.imageOut='';
 
            //make the options settings
 
            $scope.options={};                      // required
            $scope.options.image="image.jpg";       // image for crop required
            $scope.options.viewSizeWidth= 500;      // canvas size default 480 or 30% 50% 80%...
            $scope.options.viewSizeHeight= 500;
 
            $scope.options.viewShowRotateBtn= true;   //if rotate tool show default true
            $scope.options.rotateRadiansLock= true;  // lock radians default true

            $scope.options.outputImageWidth= 0 ; //output size of image 0 take the size of source image
            $scope.options.outputImageHeight= 0;
            $scope.options.outputImageRatioFixed= true; //keep the ratio of source image
            $scope.options.outputImageType= "jpeg"; //output image type
            //if this check the image crop by the original size off image and no resize
            $scope.options.outputImageSelfSizeCrop= true;
 
            //show the crop tool use only for crop and crop again one image
            $scope.options.viewShowCropTool= true;
 
            //this is the watermark if is set the watermark tool
            //show after crop
            //watermark type = text or image
            $scope.options.watermarkType='image';
            //set the image
            $scope.options.watermarkImage= null;
            //set text if type is text
            $scope.options.watermarkText= null;
            //settings for the text canvas textfill
            $scope.options.watermarkTextFillColor= 'rgba(0,0, 0, 0.8)'; //color of the letters
            $scope.options.watermarkTextFont= 'Arial'; //font
```
##functions
``` 
            // $broadcast functions
 
            // cropImage : crop the image and data fill the imageOut with the image.
            // reload the view with the crop image if watermark is set then watermark tool shows.
 
             $scope.cropImage= function(){
                $scope.$broadcast('cropImage');
             };
 
            // cropImageSave : send the image to the window.open() to save the image
            $scope.saveImage= function(){
                  $scope.$broadcast('cropImageSave');
            };
 
            // cropImageShow : after crop output the image with the watermark to the imageOut
 
            $scope.cropImageShow= function(){
                $scope.$broadcast('cropImageShow');
            };
         }]);
```

thanks for this tutorial http://www.script-tutorials.com/html5-image-crop-tool/

sotos.crop-image

