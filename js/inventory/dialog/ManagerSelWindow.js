/*
    标准模板：弹出选择面板
    注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
*/

ManagerSelWindow = function () {
    ManagerSelWindow.superclass.constructor.apply(this, arguments);
}
mini.extend(ManagerSelWindow, mini.BaseSelectWindow, {
    keyLable: "用户编号/名称：",
    gridcolumns: [
        { type: "checkcolumn", width: '50', headerAlign: "center" },
        { header: "用户编号", field: "StorageNo", headerAlign: "center" },
        { header: "用户名称", field: "StorageManager", headerAlign: "center" },
        { header: "审核", field: "RecordStatus", headerAlign: "center", align: "center" },
        { header: "分部名称", field: "BranchName", headerAlign: "center" }
    ]
});
mini.regClass(ManagerSelWindow, "storeselwindow");