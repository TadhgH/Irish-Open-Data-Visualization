(function(){
	'use strict';

	angular.module('odDirectives', [])

	.directive('framework', function(){
		return {
			restrict: 'E',
			templateUrl: './src/views/framework.html'
		};
	})

	.directive('mainContent', function(){
		return {
			restrict: 'E',
			templateUrl: './src/views/mainContent.html'
		};
	})

  .directive('selectData', function(){
    return {
      restrict: 'E',
      templateUrl: './src/views/selectData.html'
    };
  })
	.directive('gChart',function (){
   return {
      restrict: 'A',
      link: function ($scope, elm, attrs) {
        $scope.$watch('ul.chart', function () {

				var type = $scope.ul.chart.type;
				var chart = "";
				if(type=="1"){
					chart = new google.visualization.LineChart(elm[0]);
				}
				else if(type=="2"){
					chart = new google.visualization.BarChart(elm[0]);
				}
				else if(type=="3"){
					chart = new google.visualization.ColumnChart(elm[0]);
				}
				else if(type=="4"){
					chart = new google.visualization.PieChart(elm[0]);
				}

				if(typeof chart.draw === 'undefined'){
				   console.log("chart.draw is undefined");
				} else {
					chart.draw($scope.ul.chart.data, $scope.ul.chart.options);
				}

				},true);
      }
    }
  })
	.directive('enter', function(){
		return function(scope, element, attrs){
			element.bind("mouseenter", function(){
				element.addClass("md-fab");
				//scope.$apply(attrs.enter);
			})
		}
	})

	.directive('leave', function(){
		return function(scope, element, attrs){
			element.bind("mouseleave", function(){
				element.toggleClass("md-fab");
				//scope.$apply(attrs.leave);
			})
		}
	})

	/*.directive('changeActiveClass', function(){
		return {
			restrict: 'A',
			link: function ($scope, element, attrs) {
				element.bind("click", function(){
					console.log("we in here");
					if(element.hasClass("chartButtonsClick")){
						console.log("has");
						console.log(element.parent().children().find("div"));
						element.removeClass("chartButtonsClick");
					}
					else{
						element.addClass("chartButtonsClick");
					}
				});
			}
		}
	})*/;
/*	.directive('changeActiveClass', function(){
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				element.bind("click", function(){
				console.log("we in here");
				element.toggleClass("chartButtonsClick");
				}
			}
		}
	})
				//scope.$apply(attrs.leave);
			})*/
})();
