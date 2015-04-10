var jStat = require('jsonstat'),
    _ = require('lodash');

var sortSect = function(arrays, x, time){
  var temp = [];
  var master = [];
  console.log(arrays.length);
  for(i = 0; i < arrays.length; i++){
    for (var j = x; j < time.length; j++) {
      temp.push(arrays[i][j]);
    }
    master.push(temp);
    temp=[];
  }
  return master;
}

var sortStat = function(mult, dataLen, ds, dimLen){
  var i = 0;
  var arrays = {
    nums: [],
    labels: []
  };
  var array = [];
  var datarays = [];
  var categories = [];
  var dataTab = [];
  var category = '';
  var label = ds.Dimension(dimLen).label;

  for(var j = 0; j < mult; j++){
    //console.log(ds.Dimension(dimLen).Category(j).label);
    category = ds.Dimension(dimLen).Category(j).label;
    categories[j] = category;

    for(i = j; i<dataLen; i+=mult){
      array.push(parseInt(ds.Data(i).value));
    }

    //Object.defineProperty(arrays, j+"", {value : array});
    //Object.defineProperty(arrays[j], label+'', {value : category});
    datarays.push(array);
    array = [];
  }
  arrays.nums = datarays;
  arrays.labels = categories;
  return(arrays);
}

var getStats = function(data){
  console.log(" ");
  console.log("getStats");
  console.log("--------");
  console.log(" ");
  var master = [];
  var ds = data.Dataset(0);
  var t = ds.id[ds.id.length-2];//change everything to lodash
  var col = [t];
  var dimLen = ds.Dimension().length-1;
  var mult = ds.Dimension(dimLen).Category().length;
  var dataLen = ds.Data().length;
  var getTime = ds.Dimension(dimLen-1).Category();
  var time = [];
  var temp = [];
  var sectors = [];
  console.log(ds.Dimension(0).Category(0).label);

  _.forIn(ds.Dimension(0).Category(), function(n){
    sectors.push(n.label);
  })
  //var leng = ds.Dimension(0).Category().length;
  var arrays = sortStat(mult, dataLen, ds, dimLen);
  //categories and arrays seperated by sector
  _.forIn(arrays.labels, function(n){
    col.push(n);
  });
  console.log(col);
  master = col;

  _.forIn(getTime, function(n){
    time.push(n.label);
  });

  var size = ds.Dimension(0).Category().length;
  //var temp = sortSect(arrays.nums, 0, time);
  console.log(typeof arrays.nums[0][0]);
  var sendData = {
    mast:master,
    nums:arrays.nums,
    sect:sectors,
    ds:ds.label,
    t:time,
    //x:leng
  };

  return sendData;
}

var algo = function(set, i){
  //console.log(set);

  var b = set[0];
  var c = set[set.length-i];

  set[0] = c;
  set[set.length-i] = b;
  set[0].type = "number";
  return set;
}

var assimilate = function(data){
  //var t0 = performance.now();
  console.log(" ");
  console.log("Assimilate");
  console.log("--------");

  var master = getStats(data);
  //var t1 = performance.now();
  //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
  return master;
}

module.exports = assimilate;
