var obj= angular.module('mod2',['ngRoute']);

obj.config(function($routeProvider)
{
    $routeProvider
    .when('/',{
        templateUrl:"./partials/welcome.ejs"
    })
    .when('/chat',{
        templateUrl:"./partials/chat.ejs"
    })
    .when('/news',{
        templateUrl:"./partials/news.ejs"
    })
    .when('/resource',{
        templateUrl:"./partials/resource.ejs"
    })
    .when('/forums',{
        templateUrl:"./partials/forums.ejs"
    })
    .when('/info',{
        templateUrl:"./partials/info.ejs"
    })
});

obj.controller("ctrl2",function($scope)
{
    $scope.theme=true
    $scope.toggletheme=function()
    {
        $scope.theme = $scope.theme == false ? true: false;
    }
});
