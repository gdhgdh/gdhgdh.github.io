
    $(document).ready(function () {
        mini.parse();
        var grid = mini.get("datagrid1");
            grid.setData(mydata);
        // grid.load();
        /////////////////////////////////////////////
        ///搜索----------------------------------------------
        mini.get("key").focus();
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
            var key = mini.get("key").getValue();
            var starttime = mini.get("SearchStartTime").getFormValue();
            if( starttime !=""){starttime += " 00:00:00.000";} 
            var endtime = mini.get("SearchEndTime").getFormValue();
            if(endtime != ""){endtime += " 23:59:59.999"}
            grid.load({ key: key, StartTime: starttime, EndTime: endtime });

        });

        //单元格绘制-----------------------------------------
        grid.on("drawcell", function (e) {
            var record = e.record,
                    column = e.column,
                    field = e.field,
                    value = e.value;
            var type = record.Type;


            if (column.name == "action") {
                if (record.RecordStatusName == "已审核") {
                    var str = '<a class="list-action-cannot">审核</a>';
                } else {
                    var str = '<a class="list-action-can" onclick="onAudit(' + "'" + record.StockAllotID + "'" + ',' + record.RecordStatus + ')"' + '>审核</a>';
                }

                e.cellHtml = str;
            }
        });
        ///////////////////////////////////////////////////////////////
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
        window.parent.CreateMenuItem("../merchant/merchantSettlementBill.html"+"?id="+id,"结算账单详细",false)
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
