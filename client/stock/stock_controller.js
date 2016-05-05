app.controller('StockController', ['$routeParams', '$http', "$scope", function($routeParams, $http, $scope) {
  let StockCtrl = this;

  StockCtrl.rename = {
    opos: 'O Pos',
    oneg: 'O Neg',
    apos: 'A Pos',
    aneg: 'A Neg',
    bpos: 'B Pos',
    bneg: 'B Neg',
    abpos: 'AB Pos',
    abneg: 'AB Neg'
  }

  ////////////////////////////////////////
  //          D3 shit goes here
  ////////////////////////////////////////

  $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                x: function(d){return StockCtrl.rename[d.label];},
                y: function(d){return d.value;},
                showValues: true,
                color: function(){return '#700000';},
                valueFormat: function(d){ return d3.format(',f')(d); },
                dispatch: {
                
                },
                discretebar: {
                  dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function(e) {
                      StockCtrl.currentSelectedType = e.data.label;
                      $scope.$apply();
                      // console.log(StockCtrl.currentSelectedType);
                    }
                  }
                },
                callback: function(e){console.log('! callback !')}
            }
        };

        $scope.data = [
            {
                key: "Blood Levels",
                values: [
                    {
                        "label" : "opos" ,
                        "value" : 6
                    } ,
                    {
                        "label" : "oneg" ,
                        "value" : 5
                    } ,
                    {
                        "label" : "apos" ,
                        "value" : 18
                    } ,
                    {
                        "label" : "aneg" ,
                        "value" : 8
                    } ,
                    {
                        "label" : "bpos" ,
                        "value" : 17
                    } ,
                    {
                        "label" : "bneg" ,
                        "value" : 7
                    } ,
                    {
                        "label" : "abpos" ,
                        "value" : 16
                    } ,
                    {
                        "label" : "abneg" ,
                        "value" : 6
                    }
                ]
            }
        ];

        let d3DataValues = $scope.data[0].values;
////////////////////////////////////////
//      end d3 shit
////////////////////////////////////////

  StockCtrl.setLevel = 0;

  StockCtrl.currentSelectedType = 'opos';

  StockCtrl.yAxis = 'Amount';
  StockCtrl.xAxis = 'Types';

  StockCtrl.put = (data) => {
    return $http({
      method: 'PUT',
      url: '/api/hospital/profile',
      data: data
    })
    .then((res) => {
      return res.data;
    });
  };

  StockCtrl.get = () => {
    return $http({
      method: 'GET',
      url: '/api/hospital/profile'
    })
    .then((res) => {
      d3DataValues[0].value = res.data.opos;
      d3DataValues[1].value = res.data.oneg;
      d3DataValues[2].value = res.data.apos;
      d3DataValues[3].value = res.data.aneg;
      d3DataValues[4].value = res.data.bpos;
      d3DataValues[5].value = res.data.bneg;
      d3DataValues[6].value = res.data.abpos;
      d3DataValues[7].value = res.data.abneg;
      return res.data;
    });
  };

  StockCtrl.handleClick = (keyName) => {
    StockCtrl.currentSelectedType = keyName;
  }

  StockCtrl.setTypeLevel = (type) => {

    for( i = 0; i < $scope.data[0].values.length; i++) {
      if ($scope.data[0].values[i].label === StockCtrl.currentSelectedType ) {
        $scope.data[0].values[i].value = parseInt(StockCtrl.setLevel);
      }
    }

    let saveData = {
    }
    saveData[StockCtrl.currentSelectedType] = parseInt(StockCtrl.setLevel);
    StockCtrl.put(saveData);
    // $scope.api.refresh();
  }

  StockCtrl.get();

  StockCtrl.test = () => {
    console.log('type: ', StockCtrl.currentSelectedType);
  }

}]);


