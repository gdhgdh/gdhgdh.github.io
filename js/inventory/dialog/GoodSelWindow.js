/*
    标准模板：弹出选择面板
    注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
*/

GoodSelWindow = function () {
    GoodSelWindow.superclass.constructor.apply(this, arguments);
    this.initGrid();
}
mini.extend(GoodSelWindow, mini.BaseSelectWindow, {
    multiSelect: true,
    keyLable: "名称/规格/编号/条形码：",
    gridcolumns: [
        { type: "checkcolumn", field:"checkbox", width:'50', headerAlign: "center" },
        { header: "审核", field: "RecordStatus", headerAlign: "center" , align: "center" },
        // { header: "大类", field: "BigProductCategoryName", headerAlign: "center" },
        // { header: "中类", field: "MidProductCategoryName", headerAlign: "center" },
        // { header: "小类", field: "SmallProductCategoryName", headerAlign: "center" },
        { header: "产品编号", field: "ProductNumber", headerAlign: "center", allowsort: "true" },
        { header: "Sku编号", field: "SkuCode", headerAlign: "center", allowsort: "true" },
        { header: "产品名称", field: "ProductName", headerAlign: "center", allowsort: "true" },
        { header: "供应商", field: "ProviderName", headerAlign: "center", allowsort: "true" },
        { header: "规格型号", field: "ProductModel", headerAlign: "center", allowsort: "true" },
        { header: "标准成本", field: "StandardCost", headerAlign: "center", allowsort: "true" },
        { header: "参考售价", field: "ReferencePrice", headerAlign: "center", allowsort: "true" },
        { header: "最低售价", field: "LowestPrice", headerAlign: "center", allowsort: "true" },
        { header: "单位", field: "UnitName", headerAlign: "center" },
        { header: "单位", field: "Unit", headerAlign: "center" },
        { header: "安全存量", field: "SafetyStock", headerAlign: "center" },
        // { header: "分部名称", field: "BranchName", headerAlign: "center" },
        // { header: "分部编号", field: "BranchSetId", headerAlign: "center" },
        { header: "添加时间", field: "CreatedOn", dateFormat:"yyyy-MM-dd HH:mm:ss", headerAlign: "center" },
        { header: "尺寸", field: "Size", headerAlign: "center" },
        { header: "颜色", field: "Color", headerAlign: "center" },
        { header: "单重", field: "PieceWeight", headerAlign: "center" },
        { header: "类别", field: "CategoryName", headerAlign: "center" },
        { header: "代销产品", field: "IsConsignment", headerAlign: "center" },
        // { header: "产品类别", field: "CODE_CN1", headerAlign: "center" },
        { header: "最低折扣", field: "LowestDiscount", headerAlign: "center" },
        { header: "物料属性", field: "MaterialProperty", headerAlign: "center" },
        { header: "产品等级", field: "ProductLevel", headerAlign: "center" },
        { header: "机种", field: "TypeOf", headerAlign: "center" },
        { header: "材质", field: "Texture", headerAlign: "center" },
        { header: "分销价", field: "DistributionPrice", headerAlign: "center" },
        { header: "最近进价", field: "RecentlyPurchasePrice", headerAlign: "center" },
        { header: "最近入库日", field: "LastInputDate", headerAlign: "center" },
        { header: "最近出库日", field: "LastOutputDate", headerAlign: "center" },
        { header: "备注", field: "Remarks", headerAlign: "center" },
        { header: "综合仓进货价比率(%)", field: "ChannelFee", headerAlign: "center" },
        { header: "金牌销售价比率(%)", field: "SellFee", headerAlign: "center" },
        { header: "工厂商品编号", field: "ProductCode", headerAlign: "center" },
        { header: "产地仓", field: "StorageName", headerAlign: "center" }
    ],
    initGrid: function(){
        this.setSortBy('Id','desc');
        this.setIdField('Id');
        this.hooksData();
    },
    isOldDataSelected: function(id){
        var data = this._selectData;
        for (var i = 0; i < data.length; i++) {
            if(data[i].Id == id){
                return true;
            }
        }
        return false;
    }, 
    hooksData: function() { // hooks for product select
        var me = this;
        this.grid.on("drawcell", function (e) {
            var record = e.record,
                    column = e.column,
                    field = e.field,
                    value = e.value;
            var type = record.Type;
            if (field == "checkbox") {
                if (me.isOldDataSelected(record.Id)) {
                    e.cellHtml = "已选";
                    e.column.readOnly = true;
                }
            }
        });
        this.grid.on('beforeselect', function(e){
            var record = e.record;
            if (me.isOldDataSelected(record.Id)) {
                e.cancel = true;
            }
        });
        this.gridOn('preload', function(e) {
            var data = e.data;
            for (var i = 0; i < data.length; i++) {
                data[i].Price = data[i].StandardCost;
                data[i].ProductNo = data[i].ProductNumber;
                data[i].StorageName = data[i].ProductStorageName;
                data[i].CODE_CN = data[i].UnitName;
                data[i].ProductID = data[i].Id;
                data[i].ProductId = data[i].Id;
            }
            e.data = data;
        })
    },
    setData: function (data, callback) {
        this._selectData = data || [];
        this._Callback = callback;
    }
});
mini.regClass(GoodSelWindow, "goodselwindow");