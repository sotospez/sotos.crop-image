angular.module('sotos.crop-image').directive('viewCrop', [ function() {
    return {
        require: '^imageCrop',
        restrict: 'E',
        scope: false,
        link: function(scope, element, attrs, cropCtrl) {

          element.append(cropCtrl.getViewCanvas());

        }

    };

}]);


