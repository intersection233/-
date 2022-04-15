// * 读取单列数据
function getColumn(j){
    var csvData = new Array();
    var rows = document.getElementsByTagName('tr');
    for (var i = 1; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll('td');
        csvData.push(cols[j].innerHTML);
    }
    //echarts
    plot(csvData);
    //d3
    D3chart(csvData);
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


function D3chart(arr){
  if (!arr) {
    arr = [26, 21, 26, 28, 20, 20, 20, 20, 20, 40, 15, 40];
  }
  var d3chart = document.getElementById("d3chart");
  // 删除旧的SVG
  if (!d3.select(d3chart).selectAll("svg").filter(".mySVG").empty()) {
    d3.select(d3chart).selectAll("svg").filter(".mySVG").remove();
  }

  // 设置幕布尺寸
  let width = 500;
  let height = 400;
  // 创建SVG
  let svg = d3.select(d3chart)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  // 添加类名
  d3.select("svg").classed("mySVG", true);

  // 数据，类型为string，需要转化为int，否则在比较大小时会把9判定为大于23
  // 注意若为空，则在画图时默认为0
  let dataset = arr;
  for(let i = 0; i < dataset.length; i++) {
    // dataset[i] = parseInt(dataset[i]);
    if (dataset[i] !== "") {
        dataset[i] = parseFloat(dataset[i]);
    } else {
        dataset[i] = 0;
    } 
  }
  console.log(dataset)
  console.log(d3.max(dataset))

    // 绘制矩形
    svg.selectAll("rect")
        .data(dataset)//绑定列数据
        .enter()
        .append("rect")
        .attr("x", function (d, i) { return (i + 1.6) * (width / (dataset.length + 2)); })
        .attr("y", function (d) { return (height - (d / d3.max(dataset)) * (18 / 20) * height) - (height / 20); })
        .attr("width", (width / (dataset.length + 2)) * 0.8)
        .attr("height", function (d) { return (d / d3.max(dataset)) * (18 / 20) * height; })
        .attr("fill", function (d, i) { return '#ffdf5dff'; })
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("fill", function (d, i) { return '#e6a500ff'; });
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("fill", function (d, i) { return '#ffdf5dff'; });
        });

    // x坐标轴设置
    // 比例尺
    let x_scale = d3.scaleLinear()
        .domain([0, dataset.length])
        .range([(width / (dataset.length + 2)), width - (width / (dataset.length + 2))]);

    let x_axis = d3.axisBottom()            // axisBottom表示数字显示在坐标轴的下方
        .scale(x_scale)
        .ticks(dataset.length);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "x_axis")
        .attr('transform', `translate(0, ${height - (height / 20)})`)           // 访问变量
        .call(x_axis);
        
    // y坐标轴设置
    // 比例尺
    let y_scale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        // .range([(height / 20), height * (19 / 20)]);
        .range([height * (19 / 20), (height / 20)]);

    let y_axis = d3.axisLeft()            // axisBottom表示数字显示在坐标轴的下方
        .scale(y_scale)
        .ticks(10);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "y_axis")
        .attr('transform', `translate(${(width / (dataset.length + 2))}, 0)`)           // 访问变量
        .call(y_axis);

    // 绘制折线
    // 重新构造数据数组
    let new_dataset = new Array(dataset.length - 1);
    for (let i = 0; i < new_dataset.length; i++) {
        new_dataset[i] = [];
        new_dataset[i].push(dataset[i]);
        new_dataset[i].push(dataset[i + 1]);
    }
    // 绘制线段
    for(let i = 0; i < new_dataset.length; i++) {

        svg.append("line")
            .attr("x1",  (i + 2) * (width / (new_dataset.length + 3)))
            .attr("y1", (height - (new_dataset[i][0] / d3.max(dataset)) * (18 / 20) * height) - (height / 20))
            .attr("x2", (i + 3) * (width / (new_dataset.length + 3)))
            .attr("y2", (height - (new_dataset[i][1] / d3.max(dataset)) * (18 / 20) * height) - (height / 20))
            .attr("stroke", 'rgba(128, 42, 42)')
            .attr("stroke-width", 3);
    }
    // 绘制数据点圆圈
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) { return (i + 2) * (width / (dataset.length + 2)); })
        .attr("cy", function (d) { return (height - (d / d3.max(dataset)) * (18 / 20) * height) - (height / 20); })
        .attr("r", 5)
        .attr("fill", "white")
        .attr("stroke", function (d, i) { return '#d60000ff'; })
        .attr("stroke-width", 1.5);
        
    // console.log(cur_text);
    svg.append("text")
        .style("font-size", "1.5vw")
        .attr("x", (width * 3 / 7))
        .attr("y", (height / 25));


}
