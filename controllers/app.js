var app= angular.module('mod',['ngRoute']);

app.config(function($routeProvider)
{
    $routeProvider
    .when('/',{
        templateUrl:"./views/home.html",
        controller:"homectrl"
    })
    .when('/aboutus',{
        templateUrl:"./views/aboutus.html",
        controller:"aboutusctrl"
    })
    .when('/contactus',{
        templateUrl:"./views/contactus.html",
        controller:"contactusctrl"
    })
    .when('/login',{
        templateUrl:"./views/login.html",
        controller:"loginctrl"
    })
    .when('/signup',{
        templateUrl:"./views/signup.html",
        controller:"signupctrl"
    })
});

app.controller("ctrl",function($scope)
{
    $scope.theme=true
    $scope.toggletheme=function()
    {
        $scope.theme = $scope.theme == false ? true: false;
    }
});

app.controller("homectrl",function($scope)
{
    $scope.home=[
        {icon:  "fluent:people-audience-20-filled", descr: "Forums"},
        {icon: "emojione-monotone:newspaper",descr: 'News'},
        {icon: "bx:bxs-share-alt",descr:'Resources'},
        {icon:  "clarity:chat-bubble-solid-badged", descr:'Messaging'}
    ];
});