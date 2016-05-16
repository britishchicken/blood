app.controller('FeedController', ['$scope', '$rootScope','Feed', function($scope,$rootScope, Feed) {
  let FeedCtrl = this;
  FeedCtrl.posts = [];

  setTimeout(() => {
    Feed.get($scope.bounds.H.H, $scope.bounds.j.j, $scope.bounds.H.j, $scope.bounds.j.H).then(posts => FeedCtrl.posts = posts);
  }, 1000);

  let updatePosts = () => {
    let lastUpdated = FeedCtrl.posts.length ? FeedCtrl.posts[0].createdAt : 0;
    Feed.get($scope.bounds.H.H, $scope.bounds.j.j, $scope.bounds.H.j, $scope.bounds.j.H, lastUpdated)
    .then(posts => FeedCtrl.posts = posts.concat(FeedCtrl.posts));
  };
  setInterval(updatePosts, 5000);

  FeedCtrl.submit = () => {
    Feed.submit(FeedCtrl.content, {latitude: $rootScope.latitude, longitude: $rootScope.longitude});
    updatePosts();
  };
}]);
