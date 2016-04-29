(function(){
  angular.module('my-module', [])
    .controller('MyController', [
      '$scope',
      function($scope){
        let self = this;

        self.firstName = '';
        self.lastName = '';

        self.getFullName = () => {
          return `${self.firstName} ${self.lastName}`;
        };

        self.songs = [
        'Here Comes The Sun'
        ];

        self.addSong = (song) => {
          self.songs.push(song);
        };

        return self;
      }
  ]);
})();
