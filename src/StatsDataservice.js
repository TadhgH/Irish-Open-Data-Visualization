(function(){
  'use strict';

  angular.module('stats').service('menuData', ['$q', MenuDataservice]);
  angular.module('stats').service('statData', ['$http', '$q', requestDataservice]);
  angular.module('stats').service('sortData', [sortDataService]);
  angular.module('stats').service('color', [colorService]);
  angular.module('stats').service('emailService', ['$http', emailService]);

  function MenuDataservice($q){

    var userService = this;

    var users =[{

      One: [
      {
        name: 'Greenhouse Gas Emissions',
        avatar: 'svg-1',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/EAA05',
        data: null,
        num: 0,
        xaxis: 'year',
        content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
      },
      {
        name: 'Sequestration of Carbon Dioxide',
        avatar: 'svg-2',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/EAA06',
        data: null,
        num: 0,
        xaxis: 'year',
        content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
      },
      {
        name: 'Acid Rain Precursors',
        avatar: 'svg-3',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/EAA07',
        data: null,
        num: 0,
        xaxis: 'year',
        content: "Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeney's blog. Try-hard art party Shoreditch selfies. Odd Future butcher VHS, disrupt pop-up Thundercats chillwave vinyl jean shorts taxidermy master cleanse letterpress Wes Anderson mustache Helvetica. Schlitz bicycle rights chillwave irony lumbersexual Kickstarter next level sriracha typewriter Intelligentsia, migas kogi heirloom tousled. Disrupt 3 wolf moon lomo four loko. Pug mlkshk fanny pack literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS."
      },
      {
        name: 'Rainfall',
        avatar: 'svg-1',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/MTM01',
        data: null,
        num: 0,
        xaxis: 'month',
        content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
      },
      {
        name: 'Temperature',
        avatar: 'svg-2',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/MTM02',
        data: null,
        num: 0,
        xaxis: 'month',
        content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
      },
      {
        name: 'Sunshine',
        avatar: 'svg-3',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/MTM03',
        data: null,
        num: 0,
        xaxis: 'month',
        content: "Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeney's blog. Try-hard art party Shoreditch selfies. Odd Future butcher VHS, disrupt pop-up Thundercats chillwave vinyl jean shorts taxidermy master cleanse letterpress Wes Anderson mustache Helvetica. Schlitz bicycle rights chillwave irony lumbersexual Kickstarter next level sriracha typewriter Intelligentsia, migas kogi heirloom tousled. Disrupt 3 wolf moon lomo four loko. Pug mlkshk fanny pack literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS."
      }],

      Two: [
      {
        name: 'Rainfall',
        avatar: 'svg-1',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/MTM01',
        data: null,
        num: 1,
        content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
      },
      {
        name: 'Temperature',
        avatar: 'svg-2',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/MTM02',
        data: null,
        num: 1,
        content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
      },
      {
        name: 'Sunshine',
        avatar: 'svg-3',
        addr: 'http://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/MTM03',
        data: null,
        num: 1,
        content: "Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeney's blog. Try-hard art party Shoreditch selfies. Odd Future butcher VHS, disrupt pop-up Thundercats chillwave vinyl jean shorts taxidermy master cleanse letterpress Wes Anderson mustache Helvetica. Schlitz bicycle rights chillwave irony lumbersexual Kickstarter next level sriracha typewriter Intelligentsia, migas kogi heirloom tousled. Disrupt 3 wolf moon lomo four loko. Pug mlkshk fanny pack literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS."
      }]
  }];

    userService.returnUsers = function(){
      return users;
    }

    return users;
}

  function requestDataservice($http, $q){

    var stat = this;
    var api = '/api/data';

    stat.getStats = function(address){
      var defer = $q.defer();
      var data = {addr: address};
      $http.post(api, data)
      .success(function(res){
        defer.resolve(res);
      }).error(function(err, status){
        defer.reject(err);
      })

      return defer.promise;
    }

    return stat;
  }

  function sortDataService(){

    var stat = this;

    stat.sortSect = function(arrays, x, time){
      var temp = [];
      var master = [];
      var final = [];
      var count = 0;
      var z = [];
      var zipper = [];

      for(var i = 0; i < arrays.length; i++){
        for (var j = x * time.length; count < time.length; j++) {
          if(arrays[i][j] == null){
            temp.push(0);
          } else {
            temp.push(arrays[i][j]);
          }
          count++;
        }
        master.push(temp);
        temp=[];
        count = 0;
      }

      //var weird = _.map([time], _.parseInt);
      var t = [];
      for (var i = 0; i < time.length; i++) {
        //weird[i] = parseInt(time[i]);
        t[i] = time[i];
      }

      zipper.push(t);
      for(i = 0; i < master.length; i++){
        zipper.push(master[i]);
      }

      z = _.unzip(zipper);

      //Worked out algorithm here, replacing with lodash function unzip,
      //lodash is supposed to be very fast with this kind of sorting.
      //Here is the algorithm

      /*for(i = 0; i < time.length; i++){
        //temp.push(weird[0][i]);
        temp.push(t[i]);
        for(j = 0; j < master.length; j++){
          temp.push(master[j][i]);
        }
        final.push(temp);
        temp = [];
      }
      console.log(final);
      return final;*/
      return z;
    }
  }

  function colorService(){

    var color = this;

    var red = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688'];
    var blu = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E'];
    var colors = [red, blu];
    //var colors =

    color.returnColors = function(set){
      var colray = [];
      var colr = [];
      var colb = [];
      var i = 0;

      _.forEach(set, function(n){
        colr = _.take(colors[i], n);
        colray.push(colr);
        i++;
      });

      if(colray.length > 1){
        colray = colray[0].concat(colray[1]);
      } else {
        colray = colray[0];
      }

      return colray;
    }
  }

  function emailService($http){
    var email = this;
    var api = '/api/email';

    email.postEmail = function(emailData){
      $http.post(api, emailData).success(function(data){
        if(!data.success) {
           console.log(data);
           // if not successful, bind errors to error variables
         } else {
           console.log(data);
           // if successful, bind success message to message
         }
      });
    }
  }

})();
