/*
    标准模板：弹出选择面板
    注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
*/

OrderSelWindow = function () {
    OrderSelWindow.superclass.constructor.apply(this, arguments);
    this.onCellRender();
}
mini.extend(OrderSelWindow, mini.BaseSelectWindow, {
    keyLable: "订单编号/厂商名称：",
    gridcolumns:[
        { type: "checkcolumn", width: '50', headerAlign: "center" },
        { header: "审核", field: "RecordStatus", headerAlign: "center", align: "center" },
        { header: "订单编号", field: "OrderNo", headerAlign: "center", width: "220" },
        { header: "客户名称", field: "UnitName", headerAlign: "center" },
        { header: "总金额", field: "Amount", headerAlign: "center", align: "right", numberFormat: "0.0000" },
        { header: "客户订单号", field: "", headerAlign: "center" },
        { header: "已完成", field: "Status", headerAlign: "center" },
        { header: "送货地址", field: "ShippingAddress", headerAlign: "center" },
        { header: "单据日期", field: "BillsDate", dateFormat: "yyyy-MM-dd HH:mm:ss", headerAlign: "center" },
        { header: "创建时间", field: "CreatedOn", dateFormat: "yyyy-MM-dd HH:mm:ss", headerAlign: "center" },
        { header: "创建人", field: "CreatedByName", headerAlign: "center" },
        { header: "审核人", field: "VerifierName", headerAlign: "center" },
        { header: "审核时间", field: "VerifiedOn", dateFormat: "yyyy-MM-dd HH:mm:ss", headerAlign: "center" }
    ],
    onCellRender: function(){
        this.gridOn("drawcell", function (e) {
            var record = e.record,
                    column = e.column,
                    field = e.field,
                    value = e.value;
            var type = record.Type;
            if (field == "Status") {
                if (record.Status == 0) {
                    e.cellHtml = "未完成";
                } else {
                    e.cellHtml = "已完成";
                }
            }
        });
    }
});
mini.regClass(OrderSelWindow, "orderselwindow");






