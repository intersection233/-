// * 读取单列数据
function getColumn(j){
    var csvData = new Array();
    var rows = document.getElementsByTagName('tr');
    for (var i = 1; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll('td');
        csvData.push(cols[j].innerHTML);
    }
    plot(csvData);
}

//显示图表
function plot(arr) {
  //draw plot
  //横坐标为月份，纵坐标为对应column中2-13行的cell.value
  if (!arr) {
    arr = [26, 21, 26, 28, 20, 20, 20, 20, 20, 40, 15, 40];
  }

  var chartDom = document.getElementById("echart");
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
    },
    toolbox: {
      feature: {
        dataView: {
          show: true,
          readOnly: false,
        },
        magicType: {
          show: true,
          type: ["line", "bar"],
        },
        restore: {
          show: true,
        },
        saveAsImage: {
          show: true,
        },
      },
    },
    //no need for legend
    xAxis: [
      {
        type: "category",
        //修改横坐标
        data: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "旅客人次",
      },
    ],
    series: [
      {
        type: "bar",
        data: arr,
      },
      {
        type: "line",
        data: arr,
      },
    ],
  };

  myChart.setOption(option);

  $("#echart").show(); //显示图表
}