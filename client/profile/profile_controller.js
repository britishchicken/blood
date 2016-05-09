app.controller('ProfileController', ['$routeParams' , 'Profile', '$rootScope', function($routeParams, Profile, $rootScope) {
  let ProfileCtrl = this;

  if ($routeParams.donorid) ProfileCtrl.id = $routeParams.donorid;

  ProfileCtrl.user = {
    uid:'',
    name: '',
    email: '',
    photo:'',
    address:'',
    latitude: '',
    longitude:'',
    bloodtype: ''
  };

  ProfileCtrl.edit = false;

  ProfileCtrl.Edit = function() {
    ProfileCtrl.edit = !ProfileCtrl.edit;
  };

  ProfileCtrl.getlatlong = () => {
    let address = document.getElementById('address').value;
    console.log(address);
    // address = address || 'Ferrol, Galicia, Spain';
    // Initialize the Geocoder
    let geocoder = new google.maps.Geocoder();
    if (geocoder) {
    console.log(geocoder);

        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log(results);
              ProfileCtrl.user.latitude = results[0].geometry.location.lat();
              ProfileCtrl.user.longitude = results[0].geometry.location.lng();
            }
        });
    }
};


  ProfileCtrl.updateUser = () => {
    Profile.update(ProfileCtrl.user)
      .then((profile) => {
        ProfileCtrl.user = profile;
        ProfileCtrl.Edit();
      })
      .catch((error) => {
        console.error(error);
      });
  };


   let displayUser = function () {
    Profile.get(ProfileCtrl.id)
    .then((user) => {
      ProfileCtrl.user = user;
    })
    .catch((error) => {
      console.log(error);
    });
  };

  displayUser();

}]);
