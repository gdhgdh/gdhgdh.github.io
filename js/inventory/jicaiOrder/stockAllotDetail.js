    mini.parse();

var form = new mini.Form("form1");
var grid = mini.get("gridProducts");
var productsRows=[];
function SetData(data) {
    console.log(data);
    window.data = data;
    if (data.action == "new") {
        mini.getbyName("BillsPropertyID").load("/CommonGetAjax/GetBillsPropertyByBillsType?billsType=29");
        mini.getbyName("BillsPropertyID").select(0);
        //mini.getbyName("ProviderId").disable();
       $("#billdate").hide();
       $("#allotNo").hide();
       $("#onPrint").hide();
       $("#area_logistics").hide();
       $("#area_out #area_Deduction").hide();
       $("#area_out").removeClass("col-xs-4").addClass("col-xs-6");
       $("#area_in").removeClass("col-xs-4").addClass("col-xs-6");
        return;
    }
    _erp.Ajax.Get("/JiCaiOrderGetAjax/GetStockAllotDetail/" + data.Id, "", function (retData) {
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

        }
        if (data.action == "view") {
                form.setEnabled(false);
                // form.setEnabled(true);
                grid.hideColumn("action");
                mini.get("onAddProduct").disable();
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
    form.validate();
	if (form.isValid() == false) {
	    return;
	}
    if (grid.data.length < 1) {
        mini.alert("调拨的产品不能为空！");
        return false;
    } else {
        mini.confirm("确定要提交数据吗？","", function (action) {if (action != "ok") {return false;}});
        
    }

    var api = "/JiCaiOrderPostAjax/";
    //o.products = grid.data;
    console.log(o);
    console.log(grid);
    if (data.action == "update") {
        var jsondata = mini.encode(o);

    } else if (data.action == "new") {
        var newO = {
            OutStorageID: o.OutStorageID,
            InStorageID: o.InStorageID,
            Sender: o.Sender,
            SenderTel: o.SenderTel,
            SendAddress: o.SendAddress,
            ContactName: o.ContactName,
            ContactTel: o.ContactTel,
            ShippingAddress: o.ShippingAddress,
            BillsPropertyID: o.BillsPropertyID
        };
        var jsondata = mini.encode(newO);
    }
    var actionAPI = data.action == "update" && "UpdateAllotDetail/" || data.action == "new" && "NewAllot/";
        _erp.Ajax.Post(api + actionAPI, { data: jsondata, productList: mini.encode(grid.data) }, function (retData) {
            if (retData) {
                retData = mini.decode(retData);
                mini.alert(retData.Msg,"",function(){
        			if(retData.StatuName == "ok"){
                        form.setChanged(false);
                        CloseWindow("ok");
                    }
                    
                });
            }
        });



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
// 查看物流轨迹
function viewShippingFlow(){
            var info =  new LogisticsInfoWindow();
            info.setUrl('/Express/GetLogisticsLocus');
            info.load({
                ExpressNo: mini.getbyName('LogisticsOrder').getValue(),
                ExpressCompanyID: mini.getbyName('LogisticsID').getValue()
            })
            info.show();
}
///选择仓库
function toSelectWarehouse(e) {
    var buttonEdit = e.sender;
    var options = {}, buttonID = buttonEdit.id;
    if (buttonID == "outStorage" && grid.data.length > 0) {
        mini.alert("已选择商品不能变更调出仓库！如需更改请先清空下面商品表格");
        return false;
    }
    // 出库仓筛选字段，有些仓库不能出库
    buttonID == "outStorage" && (options = { IsOut: 1, OrderType: "allot" }) || buttonID == "inStorage" && (options = { OrderType: "allot"});

    _erp.CommonOpen.OpenStorageSelect(options,function (retData) {
        if (retData !== "close") {
            console.log(retData)
            buttonEdit.setValue(retData.StorageID);
            buttonEdit.setText(retData.StorageName);
            if (buttonID == "outStorage") {//出库
                mini.getbyName("Sender").setValue(retData.StorageManager);
                mini.getbyName("SenderTel").setValue(retData.StoragePhone);
                mini.getbyName("SendAddress").setValue(retData.StorageAddress);
            } else {//入库
                mini.getbyName("ContactName").setValue(retData.StorageManager);
                mini.getbyName("ContactTel").setValue(retData.StoragePhone);
                mini.getbyName("ShippingAddress").setValue(retData.StorageAddress);
            }

        }
    });
}
// 选择商品
function onAddProduct() {
    var OutStorageID =  mini.getbyName("OutStorageID").getValue();
    if(OutStorageID==""){
        mini.alert("请先选择出库仓库！");
        return false;
    }
    var InStorageID =  mini.getbyName("InStorageID").getValue();
    if(InStorageID==""){
        mini.alert("请先选择入库仓库！");
        return false;
    }
    var options = { StorageId: OutStorageID,
                    InStorageId: InStorageID,
     };
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
    if (e.field == "Quantity") {
        var reg = new RegExp(/^\d+$/);
        if (reg.test(e.value) ) {
            if (e.value < 1) {
                mini.alert("调拨数量至少为1！");
                e.cancel = true;
            }
            
            else{e.row.totalCost = e.value * e.row.Price;}
        }
        else {
            mini.alert("输入格式不正确！");
            e.cancel = true;
        }
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