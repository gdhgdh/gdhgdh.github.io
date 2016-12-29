/*
    标准模板：弹出选择面板
    注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
*/

ShipmentSelWindow = function () {
    ShipmentSelWindow.superclass.constructor.apply(this, arguments);
}
mini.extend(ShipmentSelWindow, mini.BaseSelectWindow, {
    keyLable: "出货单号："
});
mini.regClass(ShipmentSelWindow, "shipmentselwindow");