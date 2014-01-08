angular.module('sotos.crop-image', []);
angular.module('sotos.crop-image').directive('imageCrop', [function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        cropOptions: '=cropOptions',
        imageOut: '='
      },
      controller: [
        '$scope',
        function ($scope) {
          var editCanvas, viewCanvas, mainCanvas, srcCanvas;
          var editCanvasCtx, viewCanvasCtx, mainCanvasCtx, srcCanvasCtx;
          var image = new Image();
          var watermarkImage = new Image();
          var watermarkRatio = 0;
          var ratio_width;
          var self = this;
          var imageType;
          $scope.cropOptions = $scope.cropOptions || {};
          $scope.cropOptions.viewSizeWidth = $scope.cropOptions.viewSizeWidth || 480;
          $scope.cropOptions.viewSizeHeight = $scope.cropOptions.viewSizeHeight || 360;
          $scope.cropOptions.viewSizeFixed = $scope.cropOptions.viewSizeFixed || false;
          $scope.cropOptions.viewShowFixedBtn = false;
          $scope.cropOptions.viewShowRotateBtn = $scope.cropOptions.viewShowRotateBtn || true;
          $scope.cropOptions.outputImageWidth = $scope.cropOptions.outputImageWidth || 0;
          $scope.cropOptions.outputImageHeight = $scope.cropOptions.outputImageHeight || 0;
          $scope.cropOptions.outputImageRatioFixed = $scope.cropOptions.outputImageRatioFixed || true;
          $scope.cropOptions.outputImageType = $scope.cropOptions.outputImageType || 'jpeg';
          $scope.cropOptions.outputImageSelfSizeCrop = $scope.cropOptions.outputImageSelfSizeCrop || true;
          $scope.cropOptions.viewShowCropTool = $scope.cropOptions.viewShowCropTool || true;
          $scope.cropOptions.watermarkType = $scope.cropOptions.watermarkType || 'image';
          $scope.cropOptions.watermarkImage = $scope.cropOptions.watermarkImage || null;
          $scope.cropOptions.watermarkText = $scope.cropOptions.watermarkText || null;
          $scope.cropOptions.watermarkTextFillColor = $scope.cropOptions.watermarkTextFillColor || 'rgba(0,0, 0, 0.8)';
          $scope.cropOptions.watermarkTextStrokeColor = $scope.cropOptions.watermarkTextFillColor || 'rgba(255,0, 0, 0.8)';
          $scope.cropOptions.watermarkTextStrokeLineWidth = $scope.cropOptions.watermarkTextStrokeLineWidth || 1;
          $scope.cropOptions.watermarkTextFont = $scope.cropOptions.watermarkTextFont || 'Arial';
          imageType = 'image/jpeg';
          if ($scope.cropOptions.outputImageType === 'jpg') {
            imageType = 'image/jpeg';
          }
          if ($scope.cropOptions.outputImageType === 'png') {
            imageType = 'image/png';
          }
          var SelectionCrop = function (x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.px = x;
            this.py = y;
            this.csize = 6;
            this.csizeh = 10;
            this.bHow = [
              false,
              false,
              false,
              false,
              false
            ];
            this.iCSize = [
              this.csize,
              this.csize,
              this.csize,
              this.csize,
              this.csize
            ];
            this.bDrag = [
              false,
              false,
              false,
              false,
              false
            ];
            this.bDragAll = false;
            this.rotateCenter = {};
            this.rotateCenter.angle = 0.005;
            this.rotateCenter.angleRotate = 1;
            this.rotateCenter.isrotate = false;
            this.rotateCenter.r = this.w > this.h ? this.w : this.h;
            this.rotateCenter.r = this.rotateCenter.r / Math.PI;
            this.rotateCenter.x = this.x + this.w / 2;
            this.rotateCenter.sx = this.rotateCenter.x + this.rotateCenter.r * Math.cos(this.rotateCenter.angle);
            this.rotateCenter.y = this.y + this.h / 2;
            this.rotateCenter.sy = this.rotateCenter.y + this.rotateCenter.r * Math.sin(this.rotateCenter.angle);
            this.ratioHover = false;
            this.ratioOn = false;
            this.ratioSize = 6;
            this.sizeOutRatio = 0;
            this.watermarkTextSpace = 20;
          };
          SelectionCrop.prototype.drawRatio = function () {
            if ($scope.cropOptions.viewShowFixedBtn) {
              editCanvasCtx.lineWidth = 1;
              editCanvasCtx.strokeStyle = '#eee';
              editCanvasCtx.font = '20px Arial';
              editCanvasCtx.fillStyle = '#eee';
              editCanvasCtx.fillText('Ratio', 8, 60);
              editCanvasCtx.beginPath();
              editCanvasCtx.arc(65, 55, this.ratioSize, 0, 2 * Math.PI, false);
              if ($scope.cropOptions.outputImageRatioFixed) {
                editCanvasCtx.fillStyle = 'rgba(51,184, 229, 0.9)';
                editCanvasCtx.fill();
              }
              editCanvasCtx.lineWidth = 3;
              editCanvasCtx.strokeStyle = 'rgba(0,153, 205, 0.8)';
              editCanvasCtx.stroke();
            }
          };
          SelectionCrop.prototype.drawWaterMarkImage = function () {
            if (this.w > this.h) {
              this.h = this.w / watermarkRatio;
            } else {
              this.w = this.h * watermarkRatio;
            }
            editCanvasCtx.drawImage(watermarkImage, this.x, this.y, this.w, this.h);
            editCanvasCtx.strokeStyle = '#000';
            editCanvasCtx.lineWidth = 2;
            editCanvasCtx.strokeRect(this.x, this.y, this.w, this.h);
            if (this.w > 0 && this.h > 0) {
              viewCanvasCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
              srcCanvasCtx.drawImage(watermarkImage, this.x * ratio_width, this.y * ratio_width, this.w * ratio_width, this.h * ratio_width);
              viewCanvasCtx.drawImage(srcCanvas, 0, 0, mainCanvas.width, mainCanvas.height);
            }
            editCanvasCtx.fillStyle = 'rgba(119,206, 238, 0.9)';
            editCanvasCtx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
            editCanvasCtx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
            editCanvasCtx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
            editCanvasCtx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
            editCanvasCtx.lineWidth = 1;
            editCanvasCtx.strokeRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
            editCanvasCtx.strokeRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
            editCanvasCtx.strokeRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
            editCanvasCtx.strokeRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
          };
          SelectionCrop.prototype.drawWaterMarkText = function () {
            editCanvasCtx.font = this.h + 'px ' + $scope.cropOptions.watermarkTextFont;
            editCanvasCtx.fillStyle = $scope.cropOptions.watermarkTextFillColor;
            editCanvasCtx.fillText($scope.cropOptions.watermarkText, this.x + this.watermarkTextSpace, this.y + this.h - this.h / 4, this.w - this.watermarkTextSpace - this.watermarkTextSpace);
            editCanvasCtx.strokeStyle = '#000';
            editCanvasCtx.lineWidth = 2;
            editCanvasCtx.strokeRect(this.x, this.y, this.w, this.h);
            if (this.w > 0 && this.h > 0) {
              viewCanvasCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
              srcCanvasCtx.lineWidth = $scope.cropOptions.watermarkTextStrokeLineWidth;
              srcCanvasCtx.strokeStyle = $scope.cropOptions.watermarkTextFillColor;
              var fontSize = this.h * ratio_width;
              srcCanvasCtx.font = fontSize + 'px ' + $scope.cropOptions.watermarkTextFont;
              srcCanvasCtx.fillStyle = $scope.cropOptions.watermarkTextFillColor;
              srcCanvasCtx.fillText($scope.cropOptions.watermarkText, (this.x + this.watermarkTextSpace) * ratio_width, (this.y + this.h - this.h / 4) * ratio_width, (this.w - this.watermarkTextSpace - this.watermarkTextSpace) * ratio_width);
              viewCanvasCtx.drawImage(srcCanvas, 0, 0, mainCanvas.width, mainCanvas.height);
            }
            editCanvasCtx.fillStyle = 'rgba(119,206, 238, 0.9)';
            editCanvasCtx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
            editCanvasCtx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
            editCanvasCtx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
            editCanvasCtx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
            editCanvasCtx.lineWidth = 1;
            editCanvasCtx.strokeRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
            editCanvasCtx.strokeRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
            editCanvasCtx.strokeRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
            editCanvasCtx.strokeRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
          };
          SelectionCrop.prototype.drawRotate = function () {
            if ($scope.cropOptions.viewShowRotateBtn) {
              this.rotateCenter.r = this.w > this.h ? this.w : this.h;
              this.rotateCenter.r = Math.floor(this.rotateCenter.r / Math.PI);
              this.rotateCenter.x = Math.floor(this.x + this.w / 2);
              this.rotateCenter.sx = Math.floor(this.rotateCenter.x + this.rotateCenter.r * Math.cos(this.rotateCenter.angleRotate));
              this.rotateCenter.y = Math.floor(this.y + this.h / 2);
              this.rotateCenter.sy = Math.floor(this.rotateCenter.y + this.rotateCenter.r * Math.sin(this.rotateCenter.angleRotate));
              editCanvasCtx.beginPath();
              editCanvasCtx.arc(this.rotateCenter.x, this.rotateCenter.y, this.rotateCenter.r, 0, 2 * Math.PI, false);
              editCanvasCtx.lineWidth = 5;
              editCanvasCtx.strokeStyle = 'rgba(200,200, 200, 0.5)';
              editCanvasCtx.stroke();
              editCanvasCtx.closePath();
              editCanvasCtx.beginPath();
              editCanvasCtx.arc(this.rotateCenter.x, this.rotateCenter.y, this.rotateCenter.r, 0, this.rotateCenter.angleRotate, false);
              editCanvasCtx.lineWidth = 5;
              editCanvasCtx.strokeStyle = 'rgba(153, 205,0, 0.8)';
              editCanvasCtx.stroke();
              editCanvasCtx.closePath();
              editCanvasCtx.beginPath();
              editCanvasCtx.arc(this.rotateCenter.sx, this.rotateCenter.sy, this.iCSize[4], 0, 2 * Math.PI, false);
              editCanvasCtx.fillStyle = 'rgba(51,184, 229,0.8)';
              editCanvasCtx.fill();
              editCanvasCtx.lineWidth = 5;
              editCanvasCtx.strokeStyle = 'rgba(0, 153,204, 0.6)';
              editCanvasCtx.stroke();
              editCanvasCtx.closePath();
            }
          };
          SelectionCrop.prototype.draw = function () {
            this.sizeOutRatio = $scope.cropOptions.outputImageWidth / $scope.cropOptions.outputImageHeight;
            if ($scope.cropOptions.outputImageRatioFixed) {
              if (this.w > this.h) {
                this.h = this.w / this.sizeOutRatio;
              } else {
                this.w = this.h * this.sizeOutRatio;
              }
            }
            editCanvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            editCanvasCtx.fillRect(0, 0, editCanvasCtx.canvas.width, editCanvasCtx.canvas.height);
            editCanvasCtx.strokeStyle = '#000';
            editCanvasCtx.lineWidth = 2;
            editCanvasCtx.strokeRect(this.x, this.y, this.w, this.h);
            if (this.w > 0 && this.h > 0) {
              editCanvasCtx.drawImage(mainCanvas, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
              viewCanvasCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
              viewCanvasCtx.drawImage(srcCanvas, this.x * ratio_width, this.y * ratio_width, this.w * ratio_width, this.h * ratio_width, this.x, this.y, this.w, this.h);
            }
            editCanvasCtx.fillStyle = 'rgba(119,206, 238, 0.9)';
            editCanvasCtx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
            editCanvasCtx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
            editCanvasCtx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
            editCanvasCtx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
            editCanvasCtx.lineWidth = 1;
            editCanvasCtx.strokeRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
            editCanvasCtx.strokeRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
            editCanvasCtx.strokeRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
            editCanvasCtx.strokeRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
          };
          this.drawScene = function () {
            editCanvasCtx.clearRect(0, 0, editCanvasCtx.canvas.width, editCanvasCtx.canvas.height);
            editCanvasCtx.drawImage(image, 0, 0, editCanvasCtx.canvas.width, editCanvasCtx.canvas.height);
            mainCanvasCtx.save();
            srcCanvasCtx.save();
            mainCanvasCtx.clearRect(0, 0, editCanvasCtx.canvas.width, editCanvasCtx.canvas.height);
            srcCanvasCtx.clearRect(0, 0, image.width, image.height);
            mainCanvasCtx.translate(mainCanvas.width / 2, mainCanvas.height / 2);
            srcCanvasCtx.translate(image.width / 2, image.height / 2);
            mainCanvasCtx.rotate(theSelection.rotateCenter.angleRotate);
            srcCanvasCtx.rotate(theSelection.rotateCenter.angleRotate);
            mainCanvasCtx.drawImage(image, -editCanvas.width / 2, -editCanvas.height / 2, editCanvas.width, editCanvas.height);
            srcCanvasCtx.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
            mainCanvasCtx.restore();
            srcCanvasCtx.restore();
            if ($scope.cropOptions.viewShowCropTool) {
              theSelection.draw();
              theSelection.drawRotate();
            } else {
              if ($scope.cropOptions.watermarkType === 'image') {
                if ($scope.cropOptions.watermarkImage) {
                  theSelection.drawWaterMarkImage();
                } else {
                  viewCanvasCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                  viewCanvasCtx.drawImage(srcCanvas, 0, 0, mainCanvas.width, mainCanvas.height);
                }
              }
              if ($scope.cropOptions.watermarkType === 'text') {
                if (angular.isString($scope.cropOptions.watermarkText)) {
                  theSelection.drawWaterMarkText();
                } else {
                  viewCanvasCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                  viewCanvasCtx.drawImage(srcCanvas, 0, 0, mainCanvas.width, mainCanvas.height);
                }
              }
            }
          };
          this.getEditCanvas = function () {
            return editCanvas;
          };
          this.getViewCanvas = function () {
            return viewCanvas;
          };
          this.getImage = function () {
            if ($scope.cropOptions.viewShowCropTool) {
              var temp_ctx, temp_canvas;
              temp_canvas = document.createElement('canvas');
              temp_ctx = temp_canvas.getContext('2d');
              if ($scope.cropOptions.outputImageRatioFixed) {
                temp_canvas.width = $scope.cropOptions.outputImageWidth;
                temp_canvas.height = $scope.cropOptions.outputImageHeight;
              } else {
                if (theSelection.w > theSelection.h) {
                  temp_canvas.width = theSelection.w / (theSelection.w / $scope.cropOptions.outputImageWidth);
                  temp_canvas.height = theSelection.h / (theSelection.w / $scope.cropOptions.outputImageWidth);
                } else {
                  temp_canvas.width = theSelection.w / (theSelection.h / $scope.cropOptions.outputImageHeight);
                  temp_canvas.height = theSelection.h / (theSelection.h / $scope.cropOptions.outputImageHeight);
                }
              }
              if ($scope.cropOptions.outputImageSelfSizeCrop) {
                temp_canvas.width = theSelection.w * ratio_width;
                temp_canvas.height = theSelection.h * ratio_width;
              }
              temp_ctx.drawImage(srcCanvas, theSelection.x * ratio_width, theSelection.y * ratio_width, theSelection.w * ratio_width, theSelection.h * ratio_width, 0, 0, temp_canvas.width, temp_canvas.height);
              $scope.cropOptions.image = temp_canvas.toDataURL(imageType);
              $scope.imageOut = $scope.cropOptions.image;
              $scope.cropOptions.viewShowCropTool = false;
              $scope.$apply();
            }
          };
          var theSelection = new SelectionCrop(100, 100, 100, 100);
          editCanvas = document.createElement('canvas');
          editCanvasCtx = editCanvas.getContext('2d');
          viewCanvas = document.createElement('canvas');
          viewCanvasCtx = viewCanvas.getContext('2d');
          mainCanvas = document.createElement('canvas');
          mainCanvasCtx = mainCanvas.getContext('2d');
          srcCanvas = document.createElement('canvas');
          srcCanvasCtx = srcCanvas.getContext('2d');
          image.onload = function () {
            theSelection.rotateCenter.angleRotate = 0;
            if ($scope.cropOptions.outputImageWidth === 0 || $scope.cropOptions.outputImageHeight === 0) {
              $scope.cropOptions.outputImageWidth = image.width;
              $scope.cropOptions.outputImageHeight = image.height;
            }
            ratio_width = image.width / $scope.cropOptions.viewSizeWidth;
            if (image.width < image.height) {
              ratio_width = image.height / $scope.cropOptions.viewSizeHeight;
            }
            srcCanvas.width = image.width;
            srcCanvas.height = image.height;
            editCanvas.width = image.width / ratio_width;
            editCanvas.height = image.height / ratio_width;
            viewCanvas.width = editCanvas.width;
            viewCanvas.height = editCanvas.height;
            mainCanvas.width = editCanvas.width;
            mainCanvas.height = editCanvas.height;
            self.drawScene();
          };
          this.theSelection = theSelection;
          var loadImage = function () {
            image.src = $scope.cropOptions.image;
          };
          watermarkImage.onload = function () {
            watermarkRatio = watermarkImage.width / watermarkImage.height;
            theSelection.x = editCanvas.width / 4;
            theSelection.y = editCanvas.height / 5;
            theSelection.w = editCanvas.width / 2;
            theSelection.h = editCanvas.width / 2 / watermarkRatio;
            self.drawScene();
          };
          var loadWatermarkImage = function () {
            if ($scope.cropOptions.watermarkImage) {
              watermarkImage.src = $scope.cropOptions.watermarkImage;
            } else {
              watermarkImage.src = null;
              self.drawScene();
            }
          };
          $scope.$watch('cropOptions.image', loadImage);
          $scope.$watch('cropOptions.watermarkImage', loadWatermarkImage);
          $scope.$watch('cropOptions.watermarkText', loadImage);
          $scope.$on('cropImageSave', function () {
            $scope.imageOut = srcCanvas.toDataURL(imageType);
            window.open(srcCanvas.toDataURL(imageType).replace(imageType, 'image/octet-stream'));
          });
          $scope.$on('cropImageShow', function () {
            $scope.imageOut = srcCanvas.toDataURL(imageType);
          });
          $scope.$on('cropImage', self.getImage);
          loadImage();
        }
      ]
    };
  }]);
;
angular.module('sotos.crop-image').directive('editCrop', [function () {
    return {
      require: '^imageCrop',
      restrict: 'E',
      scope: false,
      link: function (scope, element, attrs, cropCtrl) {
        var iMouseX = 0;
        var iMouseY = 1;
        var myPos;
        var canvasEdit = cropCtrl.getEditCanvas();
        function offset(elm) {
          try {
            return elm.offset();
          } catch (e) {
          }
          var rawDom = elm[0];
          var _x = 0;
          var _y = 0;
          var body = document.documentElement || document.body;
          var scrollX = window.pageXOffset || body.scrollLeft;
          var scrollY = window.pageYOffset || body.scrollTop;
          _x = rawDom.getBoundingClientRect().left + scrollX;
          _y = rawDom.getBoundingClientRect().top + scrollY;
          return {
            left: _x,
            top: _y
          };
        }
        var findPos = function (obj) {
          obj = obj[0];
          var curleft = 0;
          var curtop = 0;
          if (obj.offsetParent) {
            do {
              curleft += obj.offsetLeft;
              curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return {
              left: curleft,
              top: curtop
            };
          }
        };
        var mousemove = function (e) {
          myPos = findPos(element.children());
          iMouseX = Math.floor(e.pageX - myPos.left);
          iMouseY = Math.floor(e.pageY - myPos.top);
          cropCtrl.theSelection.rotateCenter.isrotate = false;
          if (cropCtrl.theSelection.bDragAll) {
            cropCtrl.theSelection.x = iMouseX - cropCtrl.theSelection.px;
            cropCtrl.theSelection.y = iMouseY - cropCtrl.theSelection.py;
          }
          for (var i = 0; i < 5; i++) {
            cropCtrl.theSelection.bHow[i] = false;
            cropCtrl.theSelection.iCSize[i] = cropCtrl.theSelection.csize;
          }
          cropCtrl.theSelection.ratioHover = false;
          cropCtrl.theSelection.ratioSize = 6;
          if (iMouseX > cropCtrl.theSelection.x - cropCtrl.theSelection.csizeh && iMouseX < cropCtrl.theSelection.x + cropCtrl.theSelection.csizeh && iMouseY > cropCtrl.theSelection.y - cropCtrl.theSelection.csizeh && iMouseY < cropCtrl.theSelection.y + cropCtrl.theSelection.csizeh) {
            cropCtrl.theSelection.bHow[0] = true;
            cropCtrl.theSelection.iCSize[0] = cropCtrl.theSelection.csizeh;
          }
          if (iMouseX > cropCtrl.theSelection.x + cropCtrl.theSelection.w - cropCtrl.theSelection.csizeh && iMouseX < cropCtrl.theSelection.x + cropCtrl.theSelection.w + cropCtrl.theSelection.csizeh && iMouseY > cropCtrl.theSelection.y - cropCtrl.theSelection.csizeh && iMouseY < cropCtrl.theSelection.y + cropCtrl.theSelection.csizeh) {
            cropCtrl.theSelection.bHow[1] = true;
            cropCtrl.theSelection.iCSize[1] = cropCtrl.theSelection.csizeh;
          }
          if (iMouseX > cropCtrl.theSelection.x + cropCtrl.theSelection.w - cropCtrl.theSelection.csizeh && iMouseX < cropCtrl.theSelection.x + cropCtrl.theSelection.w + cropCtrl.theSelection.csizeh && iMouseY > cropCtrl.theSelection.y + cropCtrl.theSelection.h - cropCtrl.theSelection.csizeh && iMouseY < cropCtrl.theSelection.y + cropCtrl.theSelection.h + cropCtrl.theSelection.csizeh) {
            cropCtrl.theSelection.bHow[2] = true;
            cropCtrl.theSelection.iCSize[2] = cropCtrl.theSelection.csizeh;
          }
          if (iMouseX > cropCtrl.theSelection.x - cropCtrl.theSelection.csizeh && iMouseX < cropCtrl.theSelection.x + cropCtrl.theSelection.csizeh && iMouseY > cropCtrl.theSelection.y + cropCtrl.theSelection.h - cropCtrl.theSelection.csizeh && iMouseY < cropCtrl.theSelection.y + cropCtrl.theSelection.h + cropCtrl.theSelection.csizeh) {
            cropCtrl.theSelection.bHow[3] = true;
            cropCtrl.theSelection.iCSize[3] = cropCtrl.theSelection.csizeh;
          }
          if (iMouseX > cropCtrl.theSelection.rotateCenter.sx - cropCtrl.theSelection.csizeh && iMouseX < cropCtrl.theSelection.rotateCenter.sx + cropCtrl.theSelection.csizeh && iMouseY > cropCtrl.theSelection.rotateCenter.sy - cropCtrl.theSelection.csizeh && iMouseY < cropCtrl.theSelection.rotateCenter.sy + cropCtrl.theSelection.csizeh) {
            cropCtrl.theSelection.bHow[4] = true;
            cropCtrl.theSelection.iCSize[4] = cropCtrl.theSelection.csizeh;
          }
          if (iMouseX > 40 && iMouseX < 70 && iMouseY > 50 && iMouseY < 60) {
            cropCtrl.theSelection.ratioHover = true;
            cropCtrl.theSelection.ratioSize = 10;
          }
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
          if (cropCtrl.theSelection.bDrag[4]) {
            cropCtrl.theSelection.rotateCenter.isrotate = true;
            cropCtrl.theSelection.rotateCenter.angleRotate = Math.atan2(iMouseY - cropCtrl.theSelection.rotateCenter.y, iMouseX - cropCtrl.theSelection.rotateCenter.x);
          }
          if (iFW > cropCtrl.theSelection.csizeh * 2 && iFH > cropCtrl.theSelection.csizeh * 2) {
            cropCtrl.theSelection.w = iFW;
            cropCtrl.theSelection.h = iFH;
            cropCtrl.theSelection.x = iFX;
            cropCtrl.theSelection.y = iFY;
          }
          cropCtrl.drawScene();
        };
        var mousedown = function (e) {
          myPos = findPos(element.children());
          iMouseX = Math.floor(e.pageX - myPos.left);
          iMouseY = Math.floor(e.pageY - myPos.top);
          cropCtrl.theSelection.px = iMouseX - cropCtrl.theSelection.x;
          cropCtrl.theSelection.py = iMouseY - cropCtrl.theSelection.y;
          if (cropCtrl.theSelection.bHow[0]) {
            cropCtrl.theSelection.px = iMouseX - cropCtrl.theSelection.x;
            cropCtrl.theSelection.py = iMouseY - cropCtrl.theSelection.y;
          }
          if (cropCtrl.theSelection.bHow[1]) {
            cropCtrl.theSelection.px = iMouseX - cropCtrl.theSelection.x - cropCtrl.theSelection.w;
            cropCtrl.theSelection.py = iMouseY - cropCtrl.theSelection.y;
          }
          if (cropCtrl.theSelection.bHow[2]) {
            cropCtrl.theSelection.px = iMouseX - cropCtrl.theSelection.x - cropCtrl.theSelection.w;
            cropCtrl.theSelection.py = iMouseY - cropCtrl.theSelection.y - cropCtrl.theSelection.h;
          }
          if (cropCtrl.theSelection.bHow[3]) {
            cropCtrl.theSelection.px = iMouseX - cropCtrl.theSelection.x;
            cropCtrl.theSelection.py = iMouseY - cropCtrl.theSelection.y - cropCtrl.theSelection.h;
          }
          if (cropCtrl.theSelection.ratioHover) {
            cropCtrl.theSelection.ratioOn = !cropCtrl.theSelection.ratioOn;
          }
          if (iMouseX > cropCtrl.theSelection.x + cropCtrl.theSelection.csizeh && iMouseX < cropCtrl.theSelection.x + cropCtrl.theSelection.w - cropCtrl.theSelection.csizeh && iMouseY > cropCtrl.theSelection.y + cropCtrl.theSelection.csizeh && iMouseY < cropCtrl.theSelection.y + cropCtrl.theSelection.h - cropCtrl.theSelection.csizeh) {
            if (!cropCtrl.theSelection.bHow[4]) {
              cropCtrl.theSelection.bDragAll = true;
            }
          }
          for (var i = 0; i < 5; i++) {
            if (cropCtrl.theSelection.bHow[i]) {
              cropCtrl.theSelection.bDrag[i] = true;
            }
          }
        };
        var mouseUp = function (e) {
          cropCtrl.theSelection.bDragAll = false;
          for (var i = 0; i < 5; i++) {
            cropCtrl.theSelection.bDrag[i] = false;
          }
          cropCtrl.theSelection.px = 0;
          cropCtrl.theSelection.py = 0;
        };
        element.bind('mousemove', mousemove);
        element.bind('mousedown', mousedown);
        element.bind('mouseup', mouseUp);
        element.bind('dblclick', cropCtrl.getImage);
        element.append(canvasEdit);
      }
    };
  }]);
;
angular.module('sotos.crop-image').directive('viewCrop', [function () {
    return {
      require: '^imageCrop',
      restrict: 'E',
      scope: false,
      link: function (scope, element, attrs, cropCtrl) {
        element.append(cropCtrl.getViewCanvas());
      }
    };
  }]);