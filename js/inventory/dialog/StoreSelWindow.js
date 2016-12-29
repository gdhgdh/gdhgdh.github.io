/*
    标准模板：弹出选择面板
    注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
*/

StoreSelWindow = function () {
    StoreSelWindow.superclass.constructor.apply(this, arguments);
    this.onCellRender();
}
mini.extend(StoreSelWindow, mini.BaseSelectWindow, {
    keyLable: "仓库编号/名称：",
    gridcolumns: [
        { type: "checkcolumn", width: '50', headerAlign: "center" },
        { header: "仓库编号", field: "StorageNo", headerAlign: "center" },
        { header: "仓库名称", field: "StorageName", headerAlign: "center" },
        { header: "仓库管理员", field: "StorageManager", headerAlign: "center" },
        { header: "分部名称", field: "BranchName", headerAlign: "center" },
        { header: "分部编号", field: "BranchSetID", headerAlign: "center" },
        { header: "仓库电话", field: "StoragePhone", headerAlign: "center" },
        { header: "仓库地址", field: "StorageAddress", headerAlign: "center" },
        { header: "可出库", field: "IsDelivery", headerAlign: "center", align: "center" },
        { header: "审核", field: "RecordStatus", headerAlign: "center", align: "center" },
        { header: "备注", field: "Remarks", headerAlign: "center" },
        { header: "修改日期", field: "CreatedOn", dateFormat:"yyyy-MM-dd HH:mm:ss", headerAlign: "center" }
    ],
    onCellRender: function () {
        this.gridOn("drawcell", function (e) {
            var record = e.record,
                    column = e.column,
                    field = e.field,
                    value = e.value;
            var type = record.Type;
            if (field == "RecordStatus") {
                if (record.RecordStatus == 0) {
                    e.cellHtml = "未审核";
                } else {
                    e.cellHtml = "已审核";
                }
            }
            if (field == "IsDelivery") {
                if (record.IsDelivery) {
                    e.cellHtml = "是";
                } else {
                    e.cellHtml = "否";
                }
            }
        });
    }
});
mini.regClass(StoreSelWindow, "storeselwindow");