;define(['mock','common'],function (Mock, common) {

    console.log("this is merchantSettlement list")
            var mydata = Mock.mock({
                  "array|50": [
                  {
                    "id|+1":/[1-9](\d){10}/,
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

    $(document).ready(function () {
        var encryptedParams = {settlementCode:1};
        mini.parse();
        var grid = mini.get("datagrid1");
            // grid.setData(mydata);
        grid.load();
        /////////////////////////////////////////////
        ///搜索----------------------------------------------
        // mini.get("key").focus();
        $(document).keypress(function (e) {
            if (!e) e = window.event; //火狐中是 window.event
            if ((e.keyCode || e.which) == 13) {
                var obtnSearch = document.getElementById("btnSearch");
                obtnSearch.focus(); //让另一个控件获得焦点就等于让文本输入框失去焦点
                obtnSearch.click();
                return false;
            }
        });
        $("#btnSearch").bind("click", function () {
            // var key = mini.get("key").getValue();
            // var starttime = mini.get("SearchStartTime").getFormValue();
            // if( starttime !=""){starttime += " 00:00:00.000";} 
            // var endtime = mini.get("SearchEndTime").getFormValue();
            // if(endtime != ""){endtime += " 23:59:59.999"}
            // grid.load({ key: key, StartTime: starttime, EndTime: endtime });
            var settlementCode = mini.get("settlementCode").getValue();
            var businesslicensecomname = mini.get("businesslicensecomname").getValue();
            var businesslicenseno = mini.get("businesslicenseno").getValue();
            grid.load({
                settlementCode :settlementCode,
                businesslicensecomname: businesslicensecomname,
                businesslicenseno: businesslicenseno
            })

        });
        $("#reload").bind("click",function(){
            grid.reload()
        });

        //单元格绘制-----------------------------------------
        // grid.on("beforeload", function (e) {
        //     var param = e.data;
        //     var p2 = {systemSource:1,type:1,userId:1,pageIndex:0,pageSize:50};
        //     var p3 = {userId:1 , pageIndex:1 , pageSize:150};
        //     var finalp = common.encryp(p3);
        //     console.log("beforeload.....")
        //     console.log(finalp)
        //     encryptedParams = {jsonString:finalp};
        //     // eyJwYWdlU2l6ZSI6IjE1MCIsInVzZXJJZCI6IjEiLCJwYWdlSW5kZXgiOiIxIiwidG9rZW4iOiJjZWRjNGJlNDE4ODE3N2E5ODgyNWExZDlhNWNhODFkMiJ9

        // });
        ///////////////////////////////////////////////////////////////
        grid.on("rowdblclick",function(e){
            onRowDblClick(e)
        });
    });





    /////////////////////////////////////////////////////////////////////////////
    ///新增调拨单------------------------------------------------------
    function AddNew() {
        var data = { action: "new" };
        _erp.JiCaiOrderOpen.OpenAllocationDetail(data, function (retData) {
            if (retData == "ok") {
                var grid = mini.get("datagrid1");
                grid.reload();
            }
        });
    };
    //修改调拨单--------------------------------
    function UpdateAllocationFile(pid, audited) {
        if (audited == 1) {
            var data = { action: "view", Id: pid };
        }
        else {
            var data = { action: "update", Id: pid };
        }
        _erp.JiCaiOrderOpen.OpenAllocationDetail(data, function (retData) {
            if (retData == "ok") {
                var grid = mini.get("datagrid1");
                grid.reload(function () {
                    var r = grid.findRow(function (row) {
                        if (row.Id == pid) return true;
                    });
                    grid.select(r);
                });
            }
        });
    }

    //审核预判
    function onAudit(id, status) {
        // 状态值：0未审核，1已审核
        var msg = status == 0 ? "确认审核？" : "取消审核？";
        var tgt = status == 0 ? 1 : 0;
        mini.confirm(msg, "", function (action) {
            if (action == "ok") {
                var options = { Id: id, status: tgt };
                audit(options);

            }
        })
    }
    // 审核执行
    function audit(options) {
        _erp.Ajax.Post("/JiCaiOrderPostAjax/" + "AuditStockAllot/", options, function (retData) {
            if (retData && retData != "" && retData != "null") {
                retData = mini.decode(retData);
            }
            if (retData.StatuName == "ok") {
                mini.alert(retData.Msg);
                //刷新
                var grid = mini.get("datagrid1");
                grid.reload();
            }
        });
    }
    //验收
    function acceptance(goodsId) {
        mini.confirm("dd", "审核确认", function (action) {
            if (action == "ok") {
                alert(goodsId);
                //刷新
                var grid = mini.get("datagrid1");
                grid.reload();
            }
        })
    }

    // 双击行------------------------------------------------------------
    function onRowDblClick(e) {
        var row = e.record;
        var id = row.id;
        console.log(row)
        window.parent.CreateMenuItem("../merchant/merchantSettlementBill2.html"+"?id="+id + "&shopId=" + row.shopId,".结算账单详细.",false)
        // UpdateAllocationFile(id,row.RecordStatus);
    }
    // 单击行------------------------------------------------------------
    function onRowClick(e) {

    }
    ///重载--------------------
    function reload() {
        mini.parse();
        var grid = mini.get("datagrid1");
        grid.load();
    }
    //打印
    function print() {
        mini.parse();
        var grid = mini.get("datagrid1");
        var rows = grid.getSelecteds();
        var idList = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            idList.push(row._ObjectID);
        }
        var ids = idList.join(",");
        if (ids == "") {
            mini.alert("请先选择一条数据！");
            return false;
        }
        utils.printReport("rptStockAllot", ids);
    }




    return {}
});