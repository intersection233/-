//删除行
function deleteRow(button) {
    button.parentElement.parentElement.remove();    
}

//添加行
function addRow(){
    const chart = document.getElementById("ut");
    tr = document.createElement("tr");
    for(j = 0;j<20;j++){
        td = document.createElement("td");
        td.setAttribute("contenteditable","true");
        tr.appendChild(td);
    }
        td = document.createElement("td");
        button_tmp = document.createElement("button");
        button_tmp.append("delete");
        button_tmp.setAttribute("type","button");
        //button样式填充父容器
        button_tmp.setAttribute("class","deleteButton");
        button_tmp.setAttribute("onclick","deleteRow(this)");
        td.appendChild(button_tmp);
        tr.appendChild(td);
        chart.appendChild(tr);
}

//保存现有表格
function saveFile(){
    var csvData = [];
    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll('td');
        var csvrow = [];
        for (var j = 0; j < cols.length - 1; j++) {
            csvrow.push(cols[j].innerHTML);
        }
        csvData.push(csvrow.join(","));
    }
    csvData = csvData.join('\n');

    var aLink =document.createElement('a');   
    var csv = "data:text/csv;charset=utf-8,\ufeff" + csvData;
    aLink.setAttribute("href", csv);
    aLink.setAttribute("download", new Date().getTime() + ".csv");
    aLink.click();    
}