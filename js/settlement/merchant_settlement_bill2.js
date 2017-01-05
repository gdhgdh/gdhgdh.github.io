;define(['mock','common'],function (Mock, common) {
        var grid1data = Mock.mock({
              "array": [
              {
                "name|1": ["供应商1","2222","3333"],
                "NUMBER|+1": /[1-9](\d){16}/,
                "StorageName1|1": ["劲沃牌柴油车专用全合成润滑油4L装", "Java编程思想（第4版） [thinking in java]", "Spring实战（第4版）", "西部数据（WD） Elements 新元素系列 2.5英寸", "东芝（TOSHIBA）新黑甲虫系列 2TB", "东芝（TOSHIBA）新北极熊系列", "星期六（ST&SAT)黑色牛皮细跟尖头单鞋SS5311506210", "阿迪达斯男鞋2016新款运动鞋", "保时捷轮胎", "迪士尼汽车用品头枕一对", "绿帝新货建宁莲子无芯通芯白莲去芯干货土特产"], //Mock.Random.ctitle(10, 15),
                 "IsOutStorage|1": ["广州仁浩商贸有限公司", "东莞市银石礼品制造有限公司", "景德镇秋虎陶瓷有限公司", "上海乾瓷祥贸易有限公司", "广州市天录雪工艺品有限公司", "广州腾洪工艺品有限公司", "上海锦途广告制作有限公司"],
                 "amount|100-999.2-2": 100.20,
                 "amount1|100-999.2-2": 100.20,
                 "amount2|100-999.2-2": 100.20,
                 "amount3|100-999.2-2": 100.20,
                 "RecordStatusName|1-99": 10,
                 "invdate": function (){
                   return Mock.Random.datetime()
                 }
              }
              ]
        }).array; 

        var grid2data = Mock.mock({
              "array|15": [
              {
                "no|+1":/[1-9](\d){6}/,
                "name|+1": ["供应商1","2222","3333"],
                "StockAllotNo|+1": /[1-9](\d){16}/,
                "StorageName1|+1": ["劲沃牌柴油车专用全合成润滑油4L装", "Java编程思想（第4版） [thinking in java]", "Spring实战（第4版）", "西部数据（WD） Elements 新元素系列 2.5英寸", "东芝（TOSHIBA）新黑甲虫系列 2TB", "东芝（TOSHIBA）新北极熊系列", "星期六（ST&SAT)黑色牛皮细跟尖头单鞋SS5311506210", "阿迪达斯男鞋2016新款运动鞋", "保时捷轮胎", "迪士尼汽车用品头枕一对", "绿帝新货建宁莲子无芯通芯白莲去芯干货土特产"], //Mock.Random.ctitle(10, 15),
                 "IsOutStorage|1": ["广州仁浩商贸有限公司", "东莞市银石礼品制造有限公司", "景德镇秋虎陶瓷有限公司", "上海乾瓷祥贸易有限公司", "广州市天录雪工艺品有限公司", "广州腾洪工艺品有限公司", "上海锦途广告制作有限公司"],
                 "amount|100-999.2-2": 100.20,
                 "total|1000-9999.2-2": 1000,
                 "workstock|1-99": 10,
                 "freeze|1-99": 10,
                 "invdate": function (){
                   return Mock.Random.datetime()
                 }
              }
              ]
        }).array; 
        var grid3data = Mock.mock({
              "array|3": [
              {

                "name|1": ["劲沃牌柴油车专用全合成润滑油4L装", "Java编程思想（第4版） [thinking in java]", "Spring实战（第4版）", "西部数据（WD） Elements 新元素系列 2.5英寸", "东芝（TOSHIBA）新黑甲虫系列 2TB", "东芝（TOSHIBA）新北极熊系列", "星期六（ST&SAT)黑色牛皮细跟尖头单鞋SS5311506210", "阿迪达斯男鞋2016新款运动鞋", "保时捷轮胎", "迪士尼汽车用品头枕一对", "绿帝新货建宁莲子无芯通芯白莲去芯干货土特产"], //Mock.Random.ctitle(10, 15),
                 "text|1": ["广州仁浩商贸有限公司", "东莞市银石礼品制造有限公司", "景德镇秋虎陶瓷有限公司", "上海乾瓷祥贸易有限公司", "广州市天录雪工艺品有限公司", "广州腾洪工艺品有限公司", "上海锦途广告制作有限公司"],
                 "remark|1-99": 10,
                 "VerifiedOn": function (){
                   return Mock.Random.datetime()
                 }
              }
              ]
        }).array; 
    $(document).ready(function () {

      var w=$("body").width();
      $("body").css({width:w+"px"});
      // w--;
      //   $("body").css({width:w+"px"});


    	mini.parse();
        var grid1 = mini.get("datagrid1");
        // grid1.setData(grid1data);
        var grid2 = mini.get("datagrid2");
        // grid2.setData(grid2data);
        var grid3 = mini.get("datagrid3");
        // grid3.setData(grid3data);
    	// mini.parse();
        var form = new mini.Form("form1");
            
        $.post("http://tututech.f3322.net:9092/api.do?action=settlementService.getById",{id:common.getQueryString("id"),shopId:common.getQueryString("shopId")},function(result){
            console.log(result)
            if (result.isSuccess) {
                var data = result.data;
                var wholesaleShop = data.wholesaleShop;
                var listOrder = data.listOrder;
                var listVerify = data.listVerify;
                form.setData(wholesaleShop);
                var data1 = [data.settlement]
                grid1.setData(data1);
                grid2.setData(listOrder);

                // grid3.setData(listVerify);


            }
        },'json');
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