    mini.parse();

var form = new mini.Form("form1");
var grid = mini.get("gridProducts");
var productsRows=[];
function SetData(data) {
    console.log(data);
    window.data = data;

    _erp.Ajax.Get("/StorageGetAjax/GetAllotDetail/" + data.Id, "", function (retData) {
        if (retData) {
            form.setData(retData);
            form.setChanged(false);
            // 出入仓库，传递字段是ID，显示字段是Name
            mini.get("inStorage").setText(retData.InStorageName);
            mini.get("outStorage").setText(retData.OutStorageName);
            // 商品列表
            productsRows = mini.decode(retData.productList).data;
            grid.setData(productsRows);
            mini.getbyName("BillsPropertyID").setText(retData.BillsName);
            mini.getbyName("BillsPropertyID").disable();
            mini.get("onAddProduct").disable(); // 出库不允许再加商品

        }
        if (data.action == "view") {
                form.setReadOnly(true);
                grid.hideColumn("action");
                mini.get("onSave").hide();
                mini.get("prodFilter").enable();
        }
    });


}

///------------------------------------------------------

function CloseWindow(closeAction) {
    if (closeAction == "close" && form.isChanged()) {
        mini.confirm("数据已被修改了，确定要退出吗？", "退出确认", function (action) {
            if (action == "ok") {
                if (window.CloseOwnerWindow) return window.CloseOwnerWindow(closeAction);
                else window.close();
            }
        });
    } else {
        if (window.CloseOwnerWindow) return window.CloseOwnerWindow(closeAction);
        else window.close();
    }
}
function onCancel(e) {
    var action = mini.getbyName("ColseAction").getValue();
    clearFilter();
    CloseWindow(action);
}
function onSave() {
    var o = form.getData();
    var api = "/StoragePostAjax/";
    form.validate();
    if (form.isValid() == false) {
        return;
    }
    if (grid.data.length < 1) {
        mini.alert("调拨的产品不能为空！");
        return false;
    } else{
        mini.confirm("确定要提交数据吗？","", function (action) {
            if (action == "ok") {
                submitData();
            // return false;
            }
        });
        
    }

    //o.products = grid.data;
    console.log(o);
    console.log(grid);
    function submitData(){
        if (data.action == "update") {
            var jsondata = mini.encode(o);

        } 
        var actionAPI = data.action == "update" && "UpdateStockAllotOutIn/" ;
            _erp.Ajax.Post(api + actionAPI, { jsonEntity: jsondata, jsonDetail: mini.encode(grid.data), action: "out" }, function (retData) {
                if (retData) {
                    retData = mini.decode(retData);
                    if(retData.StatuName == "ok"){
                        mini.alert(retData.Msg,"",function(){
                            form.setChanged(false);
                            CloseWindow("ok");
                            
                        });
                    } else if (retData.StatuName == "hangup" && retData.Statu == 2) {
                        // 手动输入运单号
                        mini.prompt("生成物流单号失败，"+ retData.Msg , "手动输入",
                            function (action, value) {
                                if (action == "ok") {
                                    var inputLogisticsNo = mini.getbyName("LogisticsOrder");
                                    inputLogisticsNo.enable();
                                    inputLogisticsNo.setValue(value);

                                    onSave();
                                } else {
                                    console.log("取消");
                                }

                            }
                        );
                    }
                    else{
                        mini.alert(retData.Msg);

                    }
                }
            });
        
    }



}

$(document).ready(function () {
    mini.parse();

});



///重载--------------------
function reload() {
    mini.parse();
    var grid = mini.get("datagrid1");
    grid.load();
}
// 选择物流
function onSelectLogitics(e){
    var inputLogisticsNo = mini.getbyName("LogisticsOrder");
    // 前三种物流不要运单号，其中蜘点物流反单失败可以手动填写
    if(e.selected.CODE<=0){
        inputLogisticsNo.setValue("");
        inputLogisticsNo.setIsValid(true);
        inputLogisticsNo.disable();
    }
    else{
        inputLogisticsNo.enable();
    }
}
// 查看物流轨迹
function viewShippingFlow(){
    var info = new LogisticsInfoWindow();
    info.setUrl('/Express/GetLogisticsLocus');
    info.load({
        ExpressNo: mini.getbyName("LogisticsOrder").value,//'784428670681',
        ExpressCompanyID: mini.getbyName("LogisticsID").value//822
    })
    info.show();
}
// 选择商品
function onAddProduct() {
    var options = { ProductStorageId: mini.getbyName("OutStorageID").getValue };
    _erp.CommonOpen.OpenProductSelect(options, function (retData) {
        console.log(retData)
        if (retData !== "close" && retData.length>0) {
            for (var i=0;i<retData.length;i++) {
                var item = retData[i];
                var existRow = grid.findRow("SkuCode", item.SkuCode);
                // 不存在才加
                if (!existRow) {
                    item["ProductID"] = item.Id;
                    item["Price"] = item.StandardCost;
                    item["unit"] = item.UnitName;
                    item["Quantity"] = 1;
                    item["OutQuantity"] = 0;
                    item["InQuantity"] = 0;
                    grid.addRow(item, grid.data.length);
                }
            }

            console.log(form.getData())
            console.log(grid.data)
        }
    });
}
// 商品列表过滤
function onFilterChanged() {
    var searchbox = mini.get("prodFilter");
    var key = searchbox.getValue().toLowerCase();
    // 模糊搜索
    grid.filter(function (row) {
        if (key) {
            return String(row.SkuCode).toLowerCase().indexOf(key) != -1 || String(row.ProductName).toLowerCase().indexOf(key) != -1;
        }
    })
}
// 退出前需要清除，否则会认为form状态为改变
function clearFilter() {
    var searchbox = mini.get("prodFilter");
    searchbox.setValue("");
    grid.clearFilter();
    //form.setChanged(false);
}
// 商品表格操作栏
function onActionRenderer(e) {
    var grid = e.sender;
    var record = e.record;
    var uid = record._uid;
    var rowIndex = e.rowIndex;

    var str = '<a class="icon-remove" onclick="removeProductRow(' + uid + ')" style="padding-left:20px; cursor:pointer;"></a>';
    return str;
}
// UI层移除商品
function removeProductRow(row_uid) {
    var row = grid.getRowByUID(row_uid);
    grid.removeRow(row);
    grid.getChanges('removed', false);
}
// 编辑产品调拨数量
grid.on("cellcommitedit", function (e) {
    if (e.field == "OutQuantity") {
        var reg = new RegExp(/^\d+$/);
        if (reg.test(e.value) ) {// 允许为0
            e.value = parseInt(e.value);
            e.row.totalCost = e.value * e.row.Price;
        }
        else {
            mini.alert("输入格式不正确！");
            e.cancel = true;
        }
    }
});
 grid.on("drawcell", function (e) {
    if (e.field == "totalCost") {
        e.value = e.row.OutQuantity * e.row.Price;
    }
 });
// 汇总
function onDrawSummaryCell(e) {
    var result = e.result;
    var grid = e.sender;
    //客户端汇总计算
    if (e.column.name == "action") {
        e.cellHtml = "合计：";
    }
    if (e.field == "Quantity") {
        e.cellHtml = "总数量: " + e.cellHtml;
    }
    if (e.field == "totalCost") {
        e.cellHtml = "总金额: ￥" + e.value.toFixed(2);
    }
}
// 打印单
function printBill(){
    utils.printReport("rptStockAllot",data.Id);
}