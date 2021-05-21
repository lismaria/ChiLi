var obj= angular.module('mod2',[]);

obj.controller("ctrl2",function($scope)
{
    $scope.theme=true
    $scope.toggletheme=function()
    {
        $scope.theme = $scope.theme == false ? true: false;
    }
    
    $scope.navicon=true
    $scope.togglenavicon=function()
    {
        $scope.navicon = $scope.navicon == false ? true: false;
    }

    $scope.popupcard=false
    $scope.popup=function()
    {
        $scope.popupcard = $scope.popupcard == false ? true: false;
    }

    $scope.createModal=false
    $scope.createGrp=function()
    {
        $scope.createModal = $scope.createModal == false ? true: false;
    }

    $scope.leaveModal=false
    $scope.leaveGrp=function()
    {
        $scope.leaveModal = $scope.leaveModal == false ? true: false;
    }

    $scope.joinModal=false
    $scope.joinGrp=function()
    {
        $scope.joinModal = $scope.joinModal == false ? true: false;
    }

    $scope.resourceModal=false
    $scope.resource=function()
    {
        $scope.resourceModal = $scope.resourceModal == false ? true: false;
    }

    $scope.newsModal=false
    $scope.news=function()
    {
        $scope.newsModal = $scope.newsModal == false ? true: false;
    }
    
    $scope.forumModal=false
    $scope.forum=function()
    {
        $scope.forumModal = $scope.forumModal == false ? true: false;
    }
    $scope.answercard=true
    $scope.answer=function()
    {
        $scope.answercard = $scope.answercard == false ? true: false;
    }
});
