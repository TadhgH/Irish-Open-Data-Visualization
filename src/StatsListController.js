(function(){
'use strict';

angular.module('stats').controller('StatsListController', ['menuData', 'statData', 'sortData', 'color', '$mdSidenav', '$mdBottomSheet', '$log',
StatsListController]);

function StatsListController(menuData, statData, sortData, color, $mdSidenav, $mdBottomSheet, $log){
  var self = this;


  self.selected = null;
  self.One = null;
  self.Two = null;
  self.addr = null;
  self.checkSet = true;
  self.sector = '';
  self.params = 0;
  self.paramsMax = 0;
  self.mergeData = [];
  self.datasets = [];
  self.datasets.Environment = [];
  self.datasets.Climate = [];
  self.selectDataset = selectDataset;
  self.toggleList = toggledatasetsList;
  self.share = share;
  self.isDatasetOne = isDatasetOne;
  self.isDatasetTwo = isDatasetTwo;
  self.activeType = 'chartButtons';
  self.masterset = {};
  self.masterset.array = [];
  self.masterset.dataset = {};
  self.masterset.option = {};
  self.masterset.colors = {};
  self.masterset.t = [];
  //self.chartBoilerPlate = chartBoilerPlate;
  //self.createChart = createChart;
  self.chartType = {};
  self.chart = {};

  self.chartTypes = [
  { typeName: 'LineChart', typeValue: '1' },
  { typeName: 'BarChart', typeValue: '2' },
  { typeName: 'ColumnChart', typeValue: '3' },
  { typeName: 'PieChart', typeValue: '4' }
  ];

  self.incParams = incParams;
  self.decParams = decParams;

  var user = menuData;
  var find = self.chartTypes[0];

  self.selectedChart = 1;

  self.setCurrentChart = setCurrentChart;
  self.isCurrentChart = isCurrentChart;

  self.datasets = [].concat(user);
  self.selected = user[0].One[0];
  getStats(self.selected.addr);


  // *********************************
  // Internal methods
  // *********************************
  function setCurrentChart(chart){
    self.selectedChart = chart;

    find = _.find(self.chartTypes, function(temp){
      return temp.typeValue == self.selectedChart;
    });

    self.chart.type = find.typeValue;
    self.chart.typeName = find.typeName;
  }

  function isCurrentChart(chart){
    return self.selectedChart !== null && chart === self.selectedChart;
  }

  function incParams(){
    if(self.params < self.paramsMax-1){
      self.params++;
      createChart(self.selected.data);
    }
  }

  function decParams(){
    if(self.params > 0){
      self.params--;
      createChart(self.selected.data);
    }
  }

  function getStats(addr){
   //var a = performance.now();
   statData.getStats(addr).then(function(res){
     self.selected.data = res;
     createChart(res);
   }, function(err){
     console.log("There was an error in stat.getStats / promise");
   });

  }

  function createChart(data){
    var master = [];
    var final = [];
    var sectoredStats = [];
    var selectedSector = self.params; //this should be bound to a click event
    var colorPicker = [];
    var colors = [];
    var years = [];
    /*if(self.checkSet == true){
      self.masterset.dataset = data;
    } else {

      //define different protocols for processing different data types
      console.log("wein here");
      console.log(self.masterset.dataset);
      console.log(data);
      //self.masterset.dataset = data;
    }*/

    self.paramsMax = data.sect.length;

    self.sector = data.sect[self.params];

    sectoredStats = sortData.sortSect(data.nums, selectedSector, data.t);
    //master = data.mast.splice(data.mast.length-1, 1
    master = data.mast.slice();
    master.splice(master.length, 1);
    final.push(master);

    for (var i = 0; i < sectoredStats.length; i++) {
      final.push(sectoredStats[i]);
    }

    if(self.selected.xaxis == 'year'){
      self.masterset.t = data.t;
      console.log(self.masterset.t);
    } else if(self.selected.xaxis == 'month'){
      final = yearify(final, self.masterset.t);
    }

    setMasterset(final, data.ds);

  }

  function setMasterset(final, d){
    self.masterset.array = final;
    self.masterset.option = d;

    if(self.checkSet == true){
      self.masterset.colors = colorPick(final);
      chartBoilerPlate(self.masterset.array, self.masterset.option, self.masterset.colors);
    } else {
      self.masterset.colors = colorPick(final);
      chartBoilerPlate(self.masterset.array, self.masterset.option, self.masterset.colors);
    }
  }

  function yearify(data, year){
    console.log(self.selected.xaxis);
    //console.log(data);

    //var t0 = performance.now();
    var i = 0;
    var x = 0;
    var tempYear = '';

    //shud go through this array backwards then reverse result
    for(i=0;i<data.length;i++){

      //tempYear = year[x];
      //console.log(year[0+x]);
      //console.log(data[i][0].indexOf(year[0+x]));
      if(data[i][0].indexOf(year[x]) > -1){
        console.log(data[i][0]);

        if(i > 0 && i % 12 == 0){
          x++;
        }
      }


    }

    /*_.forEach(data, function(n){

      if(n[0].indexOf(year[i]) > -1){
        console.log(year[x]);
      }

      if(i<11){
        i++;
      } else {
        x++;
        i = 0;
      }
      console.log(year[x]);
    });*/

    //var t1 = performance.now();

    //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    return data;
  }

  function colorPick(data){
    var array = [];
    var colors = [];
    _.forEach(data, function(n){
      array.push(n.length);
    });
    colors = color.returnColors(array);
    return colors;
  }

  function chartBoilerPlate(array, option, colors){
    var data = google.visualization.arrayToDataTable(array);

    var options = {
      title: option,
      colors: colors
    };
    var chart = {};
    chart.data = data;
    chart.options = options;
    //console.log(chart);

    chart.type = find.typeValue;
    chart.typeName = find.typeName;

    self.chartType = self.chartTypes[0];
    self.chart = chart;

  }

  function toggledatasetsList() {
    $mdSidenav('left').toggle();
  }

  /**
  * Select the current dataset
  */

  function isDatasetOne(dataset){
    self.checkSet = true;
    self.masterset.datasets = [];
    selectDataset(dataset);
  }

  function isDatasetTwo(dataset){
    self.checkSet = false;
    selectDataset(dataset);
  }

  function selectDataset(dataset){
    //console.log(self.datasets[0].Two);
    self.params = 0;
    self.selected = angular.isNumber(dataset) ? $scope.datasets[dataset] : dataset;
    if(self.checkSet == true && self.selected.data != null){
      console.log("using stored dataset");
      createChart(self.selected.data);
    } else if(self.checkSet == false && self.selected.data != null){
      //do stuff related to 2nd dataset having already been acquired
    } else {
      console.log("http");
      getStats(self.selected.addr);
    }

    self.toggleList();
  }

  /**
  * Show the bottom sheet
  */
  function share($event){
    var dataset = self.selected;

    $mdBottomSheet.show({
      parent: angular.element(document.getElementById('contentRow')),
      templateUrl: 'src/views/contactSheet.html',
      controller: [ '$mdBottomSheet', StatSheetController],
      controllerAs: "vm",
      bindToController : true,
      targetEvent: $event
    }).then(function(){
      $log.debug( clickedItem.name + ' clicked!');
    });

    /**
     * Bottom Sheet controller for the Avatar Actions
     */
    function StatSheetController( $mdBottomSheet ) {
      this.dataset = dataset;
      this.items = [
        { name: 'Phone'       , icon: 'phone'       },
        { name: 'Twitter'     , icon: 'twitter'     },
        { name: 'Google+'     , icon: 'google_plus' },
        { name: 'Hangout'     , icon: 'hangouts'    }
      ];
      this.performAction = function(action) {
        $mdBottomSheet.hide(action);
      };
    }
  }

}
})();
