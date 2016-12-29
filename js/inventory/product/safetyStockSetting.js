mini.parse();
var searchOptions = {};

    function SetData(data) {
        console.log(data);
        window.data = data;
         mini.getbyName("StorageName").setValue(data.storageName);
         searchOptions.StorageID = data.Id;
        
        // var grid = mini.get("datagrid1");
        grid.load(searchOptions);



    }
    $(document).keypress(function (e) {
        if (!e) e = window.event; //火狐中是 window.event
        if ((e.keyCode || e.which) == 13) {
            var obtnSearch = document.getElementById("btnSearch");
            obtnSearch.focus(); //让另一个控件获得焦点就等于让文本输入框失去焦点
            obtnSearch.click();
            return false;
        }
    }); 
    function search() {
        var productNameOrCode = mini.get("productNameOrCode").getValue();
        var skuNameOrCode = mini.get("skuNameOrCode").getValue();
        searchOptions.productNameOrCode = productNameOrCode;
        searchOptions.skuNameOrCode = skuNameOrCode;

        grid.load(searchOptions);

    }


    // 传百分比到后端获取计算后的库存数，并赋值到表格------discard
    function getQuantityByPercent(percent){
        var api = "/InventoryPrice/ComputeSafetyStock";
        var products = [];
        for (var i = 0; i < grid.data.length; i++) {
            var item = grid.data[i];
            products.push(item.ProductID);
        }
        _erp.Ajax.Post(api, { storageID: data.Id, percent:percent, products: mini.encode(products)}, function (retData) {
            // 设置
            if (retData) {
                retData = mini.decode(retData);
                retData.Data = [ {ProductID: "2b798472-9d12-4d7f-bd67-751972fd5129",value: 20},
                                {ProductID: "c074e50d-9e81-4a0f-8b5f-d56fc9ca88ba",value: 21},
                                {ProductID: "662694c9-6913-4379-8844-0085c246860d",value: 22}];
                if(retData.StatuName == "ok" && retData.Data.length>0){
                    for(var i=0;i<retData.Data.length;i++){
                        var item = retData.Data[i];
                        var existRow = grid.findRow("ProductID", item.ProductID);
                        if (existRow) {
                            existRow.SafetyStock = item.value;
                        }

                    }
                    grid.loadData(grid.data);

                }else{
                    mini.alert(retData.Msg);
                }
            }
        });
    
    }
    // 批量编辑设置
    function onBatchEdit(action) {
        if (action=="ok") {
            var reg = new RegExp(/^\d+$/);
            var batchQuantity = mini.getbyName("batchQuantity").value;
            var batchPercent = mini.getbyName("batchPercent").value;
            if (reg.test(batchPercent)) {
                // 执行百分比流程
                // getQuantityByPercent(batchPercent); // 接口计算
                for(var i=0;i<grid.data.length;i++){
                    grid.data[i].SafetyStock = Math.ceil(grid.data[i].MaxStockAccQty * batchPercent);
                }
                grid.loadData(grid.data);

            } else if(reg.test(batchQuantity)) {
                // 执行数量流程
                for(var i=0;i<grid.data.length;i++){
                    grid.data[i].SafetyStock = batchQuantity;
                }
                grid.loadData(grid.data);
            }else{
                return;
            }
        } 
        // close
        var win = mini.get("batchEditDialog");
        win.hide();

    }
    // 批量弹框
    function openBatchEdit(){
        var win = mini.get("batchEditDialog");
        win.show("center","middle");
        if (data.BranchType == 53) {// 集采
            $("#batchEditDialog_percent").show();
            $("#batchEditDialog_tips").show();
        }
    }

   $(document).ready(function () {
        mini.parse();
        var categoryTree = mini.get("tree1");
         grid = mini.get("datagrid1");

        /////////////////////////////////////////////
        ///搜索----------------------------------------------
        mini.get("productNameOrCode").focus();




        ///tree事件----------------------------------------------

        categoryTree.on("nodeclick", function (e) {
            var tree = e.sender;
            if (!e.isLeaf) {
                if (!tree.isExpandedNode(e.node)) {
                    tree.expandNode(e.node);

                    //收缩其他同级节点
                    var nowNode = e.node;
                    var level = tree.getLevel(nowNode);
                    var root = tree.getRootNode();
                    tree.cascadeChild(root, function (node) {
                        if (tree.isExpandedNode(node)) {
                            var level2 = tree.getLevel(node);
                            if (node != nowNode && !tree.isAncestor(node, nowNode) && level == level2) {
                                tree.collapseNode(node, true);
                            }
                        }
                    });
                } else {
                    tree.collapseNode(e.node);
                }
            }
            var showPathLabel = function(){
                var path = tree.getAncestors(e.node);
                var pathname = "";
                for (var i=0;i< path.length ;  i++) {
                    pathname += path[i].CategoryName +">";
                }

                pathname = pathname+e.node.CategoryName;
                mini.get("categoryPathName").setValue(pathname)
                
            }();

            switch(e.node._level){
                case 0:
                    searchOptions.BidProductCategoryId = e.node.ProductCategoryId;
                    searchOptions.MidProductCategoryId = null;
                    searchOptions.SmallProductCategoryId = null;
                    break;
                case 1:
                    searchOptions.BidProductCategoryId = null;
                    searchOptions.MidProductCategoryId = e.node.ProductCategoryId;
                    searchOptions.SmallProductCategoryId = null;
                    break;
                case 2:
                    searchOptions.BidProductCategoryId = null;
                    searchOptions.MidProductCategoryId = null;
                    searchOptions.SmallProductCategoryId = e.node.ProductCategoryId;
                    break;
                default:
                    searchOptions.BidProductCategoryId = null;
                    searchOptions.MidProductCategoryId = null;
                    searchOptions.SmallProductCategoryId = null;
            }
            // var categoryId = e.node.ProductCategoryId;
            grid.load(searchOptions);
        });
        //单元格绘制-----------------------------------------
        grid.on("drawcell", function (e) {
            var record = e.record,
                    column = e.column,
                    field = e.field,
                    value = e.value;
            if (field == "SkuCode") {
                var number = record.ProductNumber;
                if (record.SkuCode != "") {
                    number += "<br/>" + "<span style='color:#06b8fa;font-size:13px;font-weight:500;'>" + record.SkuCode + "</span>";
                }
                e.cellHtml = number;
            }
        });

        // 编辑产品安全库存数量
        grid.on("cellcommitedit", function (e) {
            if (e.field == "SafetyStock") {
                var reg = new RegExp(/^\d+$/);
                if (!reg.test(e.value) ) {
                    mini.alert("请输入正整数！");
                    e.cancel = true;
                }
            }
        });
        grid.on("beforeload",function(e){
            if (hasChanged()) {
                e.cancel = true;
                // 在mini.confirm回调中阻止加载无效，在cancel后无法再恢复
                // mini包装的confirm和alert都不阻塞，特别是ajax
                mini.confirm("当前页面有未保存的数据，确定要放弃？", "未保存提醒",function(action){
                    if (action == "ok") {
                        e.cancel = false;
                        grid.accept();
                        grid.load(e.params);
                    } else {
                        e.cancel = true;
                    }

                });
                
            }
        })
        ///////////////////////////////////////////////////////////////
    });


    /////////////////////////////////////////////////////////////////////////////
    // 退出或重新加载数据前,检查是否有未保存的修改
    function hasChanged(){
        if (grid.getChanges().length > 0) {
            return true;
            
        }else{
            return false;
        }
        
    }


    function CloseWindow(closeAction) {
        if (closeAction == "close" && hasChanged()) {
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
    // 退出
    function onCancel(e) {
        CloseWindow("close");
    }
    // 保存
    function onSave(){
        var api = "/InventoryPrice/Save";
        var detailData = [];
        // var reg = new RegExp(/^\d+$/);
        for (var i = 0; i < grid.data.length; i++) {
            var item = grid.data[i];
            // if (!reg.test(item.SafetyStock)) {
            //     grid.scrollIntoView(grid.getRow(i));
            //     mini.alert("数据不合法！")
            //     return false;
            // }
            detailData.push({
                ProductID: item.ProductID,
                SkuCode:  item.SkuCode,
                SafetyStock:   item.SafetyStock,
            })
        }
        _erp.Ajax.Post(api, { storageID: data.Id, data: mini.encode(detailData)}, function (retData) {
            if (retData) {
                retData = mini.decode(retData);
                if(retData.StatuName == "ok"){
                    mini.alert(retData.Msg,"",function(){
                        grid.accept(); // 不关闭当前页面
                        // CloseWindow("ok");
                        
                    });
                }else{
                    mini.alert(retData.Msg);
                }
            }
        });
    }

    ///重载--------------------
    function reload() {
        mini.parse();
        var grid = mini.get("datagrid1");
        grid.load(searchOptions);
    }