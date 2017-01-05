;define(['mock','common'],function (Mock, common) {
    $(document).ready(function () {

        var w=$("body").width();
        $("body").css({width:w+"px"});

    	  mini.parse();
        var grid1 = mini.get("datagrid1");
        var grid2 = mini.get("datagrid2");
        var grid3 = mini.get("datagrid3");
        var form = new mini.Form("form1");

        function loadData(orderListPageIndex, SearchStartTime, SearchEndTime){

            $.post("http://tututech.f3322.net:9092/api.do?action=settlementService.getById",{
              shopId:common.getQueryString("shopId"),
               pageIndex:orderListPageIndex,
               pageSize:grid2.pageSize,
               SearchStartTime:SearchStartTime || "",
               SearchEndTime: SearchEndTime || ""
              },function(result){
                console.log(result)
                if (result.isSuccess) {
                    // var data = result.data;
                    var info = result.info;
                    var data = result.data;
                    var listVerify = result.listVerify;
                    form.setData(info);
                    // var data1 = [result.settlement]
                    // grid1.setData(data1);
                    /*                grid2.setData(data);   // 订单明细列表
                                    grid2.setTotalCount(result.total);
                                    grid2.setPageIndex(result.page.PageIndex);
                                    grid2.setPageSize(result.page.PageSize);*/

                    fillData(result.page.PageIndex, result.page.PageSize, result.total, data, grid2);

                    // grid3.setData(listVerify);


                }
            },'json');
        }
        loadData(0);       // 首次加载
        //单元格绘制-----------------------------------------
        grid2.on("drawcell", function (e) {
            var record = e.record,
                    column = e.column,
                    field = e.field,
                    value = e.value;
            var type = record.Type;

            if (column.name == "action") {
                if (0) {
                    var str = '<a class="list-action-cannot">解冻</a>';
                } else {
                    var str = '<a class="list-action-can">冻结</a>';
                }

                e.cellHtml = str;
                $(".list-action-can").bind("click",function(){
                    console.log(this)
                });
            }
        });
        grid2.on("load", function (e) {
                console.log($(".list-action-can"))

            $(".list-action-can").bind("click",function(){
                console.log(this)
            });
        });
        //  订单列表分页事件
        grid2.on("beforeload",function(e){
             e.cancel = true;
             console.log("分页前事件")
             console.log(e)
             loadData(e.data.pageIndex);
        });

        function fillData(pageIndex, pageSize,totalCount, dataArray, grid){
            grid.setData(dataArray);   // 订单明细列表
            grid.setTotalCount(totalCount);
            grid.setPageIndex(pageIndex);
            grid.setPageSize(pageSize);
        }
        // 日期检索
        $("#btnSearch").bind("click", function () {
            // var key = mini.get("key").getValue();
            var SearchStartTime = mini.get("SearchStartTime").getFormValue();
            if( SearchStartTime !=""){SearchStartTime += " 00:00:00.000";} 
            var SearchEndTime = mini.get("SearchEndTime").getFormValue();
            if(SearchEndTime != ""){SearchEndTime += " 23:59:59.999"}
            loadData(0, SearchStartTime, SearchEndTime);


        });

        // 批量冻结
        $("#onBatchFreeze").bind("click",function(){
            var arr = grid2.getSelecteds();
            console.log(arr)
            if (arr.length < 1) {
                mini.alert("请选择要冻结的订单！");
                return false;
            }else{
                var submitArr = [];
                for(var i=0;i<arr.length;i++){
                    var item=arr[i];
                    submitArr.push({orderId: item.orderId, blockedReason: item.blockedReason})
                }
                console.log(submitArr)
            }
            $.post("http://tututech.f3322.net:9092/api.do?action=settlementService.updateFreezeSettlement",{orderId:submitArr},function(result){
                    if (result.isSuccess) {
                            mini.alert("操作成功！");
                    }

            },'json');
        });
        // 导出
        $("#onExport").bind("click",function(){
            mini.alert("等待导出接口！");
        });
        // 提交结算
        $("#onSave").bind("click",function(){
            mini.confirm("提交后系统将改变这批订单为已结算状态，确定提交吗？",function(action){
                if (action == "ok") {
                    mini.alert("等待提交接口！");
                }
            });
        });
    })
});