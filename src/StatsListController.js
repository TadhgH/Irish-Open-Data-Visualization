(function(){
'use strict';

angular.module('stats').controller('StatsListController', ['md5', 'menuData', 'statData', 'sortData', 'color', '$mdSidenav', '$mdBottomSheet', '$log',
StatsListController]);

function StatsListController(md5, menuData, statData, sortData, color, $mdSidenav, $mdBottomSheet, $log, emailService){
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
  self.activeType = 'chartButtons';
  self.masterset = {};
  self.masterset.final = [];
  self.masterset.base = [];
  self.masterset.merge = [];
  self.masterset.dataset = {};
  self.masterset.option = {};
  self.masterset.colors = {};
  self.masterset.t = [];
  self.showList = true;
  //self.chartBoilerPlate = chartBoilerPlate;
  //self.createChart = createChart;
  self.chartType = {};
  self.chart = {};

  self.radio = {
    group1 : 'Line'
  };

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
     console.log(res);
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
    var selectedSector = self.params;
    var colorPicker = [];
    var colors = [];
    var years = [];
    var i = 0;

    self.paramsMax = data.sect.length;
    self.sector = data.sect[self.params];
    sectoredStats = sortData.sortSect(data.nums, selectedSector, data.t);

    master = data.mast.slice();
    master.splice(master.length, 1);
    final.push(master);

    for (i = 0; i < sectoredStats.length; i++) {
      final.push(sectoredStats[i]);
    }

    if(self.selected.xaxis == 'year'){
      self.masterset.t = data.t;

    } else if(self.selected.xaxis == 'month'){
      final = yearify(final, self.masterset.t);
    }

    setMasterset(final, data.ds);

  }

  function setMasterset(final, d){
    self.masterset.option = d;

    if(self.checkSet == true){
      self.masterset.colors = colorPick(final);
      chartBoilerPlate(final, self.masterset.option, self.masterset.colors);
    } else {
      self.masterset.colors = colorPick(final);
      chartBoilerPlate(final, self.masterset.option, self.masterset.colors);
    }
  }

  function yearify(data, year){

    var i = 0;
    var j = 0;
    var x = 0;
    var num = 0;
    var yearData = [];
    var tempData = [];
    var master = [];
    var avgs = [];
    var highs = [];
    var lows = [];
    var tempAvgs = [];
    var tempHighs = [];
    var tempLows = [];

    master.push(data[0]);
    tempData = Array.apply(null, new Array(data[0].length-1)).map(Number.prototype.valueOf,0);

    for(j=0; j<data[0].length-1; j++){
      if(data[0][j+1].indexOf('Average')>-1 || data[0][j+1].indexOf('Mean')>-1){
        avgs.push(j);
      } else if(data[0][j+1].indexOf('Highest')>-1 || data[0][j+1].indexOf('Most')>-1){
        highs.push(j);
        tempData[j] = -99999999999;
      } else if(data[0][j+1].indexOf('Lowest')>-1){
        lows.push(j);
        tempData[j] = 99999999999;
      }
    }

    //shud go through this array backwards then reverse result
    for(i=0;i<data.length;i++){

      if(data[i][0].indexOf(year[x]) > -1){
        for(j=0; j<data[i].length-1; j++){
          if(highs.indexOf(j)>-1){
            if(data[i][j+1] > tempData[j]){
              tempData[j] = data[i][j+1];
            }
          } else if(lows.indexOf(j)>-1){
            if(data[i][j+1] < tempData[j]){
              tempData[j] =  data[i][j+1];
            }
          }else{
            tempData[j] += data[i][j+1];
          }
        }

        if(i > 0 && i % 12 == 0){
          yearData.push(year[x]);
          for(j=0; j<tempData.length; j++){
            if(avgs.indexOf(j)>-1){
              yearData.push(tempData[j]/12);
            } else {
              yearData.push(tempData[j]);
            }
          }
          x++;
          master.push(yearData);
          yearData = [];
          tempData = Array.apply(null, new Array(data[0].length-1)).map(Number.prototype.valueOf,0);
        }
      }
    }

    return master;
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
      colors: colors,
      height: 350
    };
    var chart = {};
    chart.data = data;
    chart.options = options;

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

  function selectDataset(dataset){
    self.params = 0;
    self.selected = angular.isNumber(dataset) ? $scope.datasets[dataset] : dataset;
    if(self.checkSet == true && self.selected.data != null){
      createChart(self.selected.data);
    } else if(self.checkSet == false && self.selected.data != null){

    } else {
      getStats(self.selected.addr);
    }

    self.toggleList();
  }

  /**
  * Show the bottom sheet
  */
  function share($event, emailService){
    var dataset = self.selected;

    $mdBottomSheet.show({
      parent: angular.element(document.getElementById('contentRow')),
      templateUrl: 'src/views/contactSheet.html',
      controller: [ '$mdBottomSheet', 'emailService', StatSheetController],
      controllerAs: "vm",
      bindToController : true,
      targetEvent: $event
    }).then(function(){
      $log.debug( clickedItem.name + ' clicked!');
    });

    /**
     * Bottom Sheet controller for the Avatar Actions
     */
    function StatSheetController($mdBottomSheet, emailService) {
      this.dataset = dataset;
      this.emailData = {};
      this.showList = true;
      this.showEmail = false;
      this.showAbout = false;
      this.items = [
        { name: 'Email'       , icon: 'mail'},
        { name: 'About'     , icon: 'about' }
      ];
      this.performAction = function(action) {
        if(action.name == "Email"){
          this.showList = false;
          this.showEmail = true;
          this.showAbout = false;
        } else if(action.name == "About"){
          this.showList = false;
          this.showEmail = false;
          this.showAbout = true;
        } else {
          $mdBottomSheet.hide(action);
        }
      };

      this.sendEmail = function(isValid){

        if(isValid) {
          this.emailData.secret = md5.createHash("heptameron");
          emailService.postEmail(this.emailData);
        } else {
        }
      }

      this.resetBottomSheet = function(){
        this.showList = true;
        this.showEmail = false;
        this.showAbout = false;
      }
    }
  }

}
})();
