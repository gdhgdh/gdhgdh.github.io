    mini.parse();

var form = new mini.Form("form1");
var grid = mini.get("gridProducts");
var productsRows=[];
function SetData(data) {
    console.log(data);
    window.data = data;
    if (data.action == "new") {
        mini.getbyName("BillsPropertyID").load("/CommonGetAjax/GetBillsPropertyByBillsType?billsType=42");
        mini.getbyName("BillsPropertyID").select(0);
        //mini.getbyName("ProviderId").disable();
       $("#billdate").hide();
       $("#BillNo").hide();
       $("#onPrint").hide();
       
        return;
    }
    _erp.Ajax.Get("/StorageGetAjax/GetInventoryAdjustDetail/" + data.Id, "", function (retData) {
        if (retData) {
            form.setData(retData);
            // 出入仓库，传递字段是ID，显示字段是Name
            // mini.get("StorageID").setText(retData.StorageName);
            // 商品列表
            productsRows = retData.details;
            grid.setData(productsRows);
            mini.getbyName("InventoryCheckId").setText(retData.InventoryCheckNo);
            mini.getbyName("ManagerId").setText(retData.ManagerName);
            mini.getbyName("BillsPropertyID").setText(retData.BillsName);
            mini.getbyName("BillsPropertyID").disable();
            form.setChanged(false);

        }
        if (data.action == "view") {
                form.setEnabled(false);
                grid.hideColumn("action");
                // mini.get("onAddProduct").disable();
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

    var api = "/StoragePostAjax/";
    //o.products = grid.data;
    if (grid.data.length < 1) {
        mini.alert("盘点的产品不能为空！");
        return false;
    } else {
        mini.confirm("确定要提交数据吗？","", function (action) {
            if (action == "ok") {
                submitData();
            }
        });
    }

    function submitData(){
        var detailData = [];
        for (var i = 0; i < grid.data.length; i++) {
            var item = grid.data[i];
            detailData.push({
                // Id:         item.Id,
                ProductId:  item.ProductId,
                InventoryCheckId:  data.Id,
                PhysicalHoldingOfStock:   item.PhysicalHoldingOfStock,
                BookBalance:   item.BookBalance,
                AdjustQty:   item.AdjustQty,
                Remarks:    item.Remarks,
            })
        }
        console.log(o);
        console.log(detailData);
        if (data.action == "update") {
            var jsondata = mini.encode(o);

        } else if (data.action == "new") {
            var newO = {
                InventoryCheckId: o.InventoryCheckId,
                StorageName:o.StorageName,
                BillsDate: o.BillsDate,
                BillsPropertyID: o.BillsPropertyID,
                BillsName: o.BillsName,
                ManagerId: o.ManagerId,

            };

            var jsondata = mini.encode(newO);
        }
        var isnew = data.action == "update" && false || data.action == "new" && true;

            _erp.Ajax.Post(api + "UpdateInventoryAdjust/", { jsonEntity: jsondata, jsonDetail: mini.encode(detailData) , isNew: isnew }, function (retData) {
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



}

$(document).ready(function () {
    mini.parse();

});


///选择盘点单
function toSelectCheckBill(e) {
    var buttonEdit = e.sender;
    _erp.CommonOpen.OpenInventoryCheckBillsSelect({OnlyBranch:true},function (retData) {
        console.log(retData)
        if (retData !== "close") {
            buttonEdit.setValue(retData.Id);
            buttonEdit.setText(retData.InventoryCheckNo);
            mini.getbyName("StorageName").setValue(retData.StorageName);
            grid.setUrl("/StorageGetAjax/SelectInventoryCheckDetail?id="+retData.Id);
            grid.load();

        }
    });
}
///选择主管
function toSelectManager(e) {
    var buttonEdit = e.sender;
    _erp.CommonOpen.OpenSystemUserSelect({OnlyBranch:true},function (retData) {
        console.log(retData)
        if (retData !== "close") {
            buttonEdit.setValue(retData.SystemUserID);
            buttonEdit.setText(retData.SystemUserName);
        }
    });
}
// 选择商品
function onAddProduct() {
    var options = { StorageId: mini.getbyName("StorageID").getValue()};
    _erp.CommonOpen.OpenProductSelect(options, function (retData) {
        if (retData !== "close" && retData.length>0) {
            for (var i=0;i<retData.length;i++) {
                var item = retData[i];
                var existRow = grid.findRow("SkuCode", item.SkuCode);
                // 不存在才加
                if (!existRow) {
                    item["ProductId"] = item.Id;
                    // item["Id"] = "";
                    item["CODE_CN"] = item.UnitName;
                    item["Quantity"] = item.CurrentInventory;
                    grid.addRow(item, grid.data.length);
                }
            }
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
// 处理两边detail字段差异
// Here's a real fact, that you can never modify the raw data applied to the grid.
// once it's loaded from the server,it will be rendered immediately.
// before load event means before getting data from server
// while load event means after the grid is rendered.
// so the only solution is as below
// unless server field changes
// grid.on("drawcell",function(e){
//     var record = e.record,
//         column = e.column,
//         field = e.field;
//     if (data.action == "new" ) {// 不能判断field，会使赋值失效，也就是说在渲染到目标field再赋值的话无效，所以在第一列就进行赋值，缺陷是会执行多次
//         record.PhysicalHoldingOfStock = record.Quantity  ; // 系统库存
//     }
//     // if (field == "BookBalance") {
//     //     record.BookBalance = record.InventoryQty;    // 实际库存
//     // }
//     // if (field == "AdjustQty") {
//     //     if(record.BookBalance){
//     //         record.AdjustQty = record.BookBalance - record.PhysicalHoldingOfStock;  // 差异数
//     //     }
//     // }

// })
// 实际仓库盘点数量
grid.on("cellcommitedit", function (e) {
    if (e.field == "BookBalance") {
        var reg = new RegExp(/^\d+$/);
        if (!reg.test(e.value) || e.value < 0) {
            mini.alert("库存数量输入有误！");
            e.cancel = true;
        }
        else {
            e.row.AdjustQty = e.value - e.row.PhysicalHoldingOfStock;
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
    utils.printReport("rptInventoryAdjust",data.Id);
}