app.controller('D3Controller', ['$routeParams', '$http', '$scope', function($routeParams, $http, $scope) {

        let D3Ctrl = this;

        $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                color: function(){return '#700000';},
                valueFormat: function(d){ return d3.format(',f')(d); },
                dispatch: {
              
                },
                discretebar: {
                  dispatch: {
                    //chartClick: function(e) {console.log("! chart Click !")},
                    elementClick: function(e) {console.log("! element Click !")},
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
                        "value" : 15
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

    }]);