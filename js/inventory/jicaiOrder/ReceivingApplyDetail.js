    mini.parse();

var form = new mini.Form("form1");
var grid = mini.get("gridProducts");
var productsRows=[];
function SetData(data) {
    console.log(data);
    window.data = data;
    if (data.action == "new") {
       $("#onPrint").hide();
        mini.getbyName("BillsPropertyID").load("/CommonGetAjax/GetBillsPropertyByBillsType?billsType=37");
        mini.getbyName("BillsPropertyID").select(0);
        mini.getbyName("ProviderId").disable();
        mini.getbyName("BillsDate").setValue(new Date());

        return;
    }
    _erp.Ajax.Get("/JiCaiOrderGetAjax/GetPickingById/" + data.Id, "", function (retData) {
        if (retData) {
            form.setData(retData);
            form.setChanged(false);

            // 仓库&厂商&采购单&领料人，传递字段是ID，显示字段是Name
            mini.getbyName("StorageId").setText(retData.StorageName);
            mini.getbyName("ProviderId").setText(retData.ProviderName);
            mini.getbyName("PurchaseNo").setText(retData.PurchaseNo);
            mini.getbyName("Picker").setText(retData.PickerName);
            // 商品列表
            productsRows = retData.details;
            //grid.sortBy("SkuCode", "asc");
            grid.setData(productsRows);
            mini.getbyName("BillsPropertyID").setText(retData.BillsName);
            mini.getbyName("BillsPropertyID").disable();
            if (!retData.IsToProvider) {
                mini.getbyName("ProviderId").disable();
            }

            // 当前仓库下有选商品，不能改变仓库，除非清掉
            if (productsRows.length > 0) {
                mini.getbyName("StorageId").disable();
            }
        }
        if (data.action == "view") {
                form.setEnabled(false);
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
    CloseWindow(action);
}
function onSave() {
    var o = form.getData();

    if (!o.IsToProvider || o.IsToProvider == "false") { 
        o.ProviderId = "00000000-0000-0000-0000-000000000000";
    }  // 供应商黑科技
	 form.validate();

	if (form.isValid() == false) {return false;}
    var api = "/JiCaiOrderPostAjax/";    
    var jsondata = mini.encode(o);
    if (grid.data.length < 1) {
        mini.alert("领取的产品不能为空！");
        return false;
    } else {
        var detailData = [];
        for (var i = 0; i < grid.data.length; i++) {
            var item = grid.data[i];
            detailData.push({
                ProductId:  item.ProductId,
                PickingId:  data.Id || "",
                PickingDetailId: item.PickingDetailId || "",
                Price:      item.Price,
                Quantity:   item.Quantity,
                Remarks:    item.Remarks,
                StorageId:  item.StorageId

            })
            
            if (detailData[i].PickingDetailId =="") {delete detailData[i].PickingDetailId;}// temperory hack 
            if (detailData[i].PickingId =="") {delete detailData[i].PickingId;}// temperory hack 
        }
    }
    mini.confirm("确定要提交数据吗？","", function (action) {
        if (action =="ok") {
            submitData();
        }
    });

    function submitData(){
        console.log(o);
        console.log(detailData);
        var isnew = data.action == "update" && false || data.action == "new" && true;
        _erp.Ajax.Post(api + "UpdatePickingOrder/", { jsonPicking: jsondata, jsonDetail: mini.encode(detailData), isNew: isnew }, function (retData) {
            if (retData.StatuName=="ok") {
                mini.alert(retData.Msg,"",function(){
                    form.setChanged(false);
                    CloseWindow("ok");
                    
                });
            }else {
                mini.alert(retData.Msg);
            }
        });
        
    }



}

$(document).ready(function () {
    mini.parse();
    // 是否厂商领料
    mini.getbyName("IsToProvider").on("checkedchanged", function () {
        if (this.checked) {
            // 因为数据库的bug，即使不是厂商领料也有为0 的guid返回，所以这里只好也清空了
            mini.getbyName("ProviderId").set({
                enabled : true,
                value : "",
                text : ""
            });
        } else {
            mini.getbyName("ProviderId").set({
                enabled : false,
                value : "",
                text : "",
                isValid: true
            });
        }
    });
});



///重载--------------------
function reload() {
    mini.parse();
    var grid = mini.get("datagrid1");
    grid.load();
}
///选择采购单
function toSelectPurchaseOrder(e) {
    var buttonEdit = e.sender;
    _erp.CommonOpen.OpenPurchaseOrderSelect({ RecordStatus: 1, Status: 1 }, function (retData) {
        setButtonEditDataAndState(buttonEdit, retData, "PurchaseNo", "PurchaseNo");
    });
}
///选择厂商
function toSelectProvider(e) {
    var buttonEdit = e.sender;
    _erp.CommonOpen.OpenProviderSelect(function (retData) {
        setButtonEditDataAndState(buttonEdit, retData, "Id", "ProviderName");
    });
}
///选择仓库
function toSelectWarehouse(e) {
    if (grid.data.length>0) {
        mini.alert("已选择商品不能变更仓库！如需更改请先清空下面商品表格");
        return false;
    }
    var buttonEdit = e.sender;
    var options={IsOut: 1,OrderType:"picking"};
    // 出库仓筛选字段，有些仓库不能出库

    _erp.CommonOpen.OpenStorageSelect(options,function (retData) {
        setButtonEditDataAndState(buttonEdit, retData, "StorageID", "StorageName");
    });
}
///选择领料人
function toSelectManager(e) {
    var buttonEdit = e.sender;
    _erp.CommonOpen.OpenSystemUserSelect({Directly:true},function (retData) {
        setButtonEditDataAndState(buttonEdit, retData, "SystemUserID", "SystemUserName");
    });
}
// 选择商品
function onAddProduct() {
    var StorageID = mini.getbyName("StorageId").value;
    //先选择仓库才能选商品
    if (!StorageID) {
        mini.alert("请先选择出料仓库");
        return;
    }
    var options = { StorageID: StorageID };
    _erp.CommonOpen.OpenProductSelect(options, function (retData) {
        console.log(retData)
        if (retData !== "close" && retData.length>0) {
            for (var i=0;i<retData.length;i++) {
                var item = retData[i];
                var existRow = grid.findRow("SkuCode", item.SkuCode);
                // 不存在才加
                if (!existRow) {
                    item["Id"] = "";
                    item["Price"] = item.StandardCost;
                    item["CODE_CN"] = item.UnitName;
                    item["Quantity"] = 1;
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
    // 商品为0后放开仓库选择
    if (grid.data.length == 0) {
        mini.getbyName("StorageId").enable();
    }
}
// 编辑产品调拨数量
grid.on("cellcommitedit", function (e) {
    if (e.field == "Quantity") {
        var reg = new RegExp(/^\d+$/);
        if (!reg.test(e.value) || e.value < 1) {
            mini.alert("调拨数量应为正整数！");
            e.cancel = true;
        }
        else {
            e.row.totalCost = e.value * e.row.Price;
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
    utils.printReport("rptPicking",data.Id);
}
