var _ = window._ || {};
_.pick = _.pick || function(obj, arr) {
    var result = {};
    obj || (obj = {});
    for (var i = arr.length - 1; i >= 0; i--) {
        result[arr[i]] = obj[arr[i]]
    }
    return result;
}

var utils = {
    /**
     * 商品码
     * ///param  {[type]} ids product ids
     */
    printProduct: function(ids){
        if(typeof ids == 'string'){
            ids = [ids];
        }
        var url = "/Print/index.html?orderId=&proId=" + ids.join(',');
        utils.blankOpen(url);
    },
    /**
     * [printGridRows description]
     * ///param  {[type]} grid       mini.DataGrid instance
     * ///param  {String} type       print type
     * ///param  {idField} key        Optional, grid idField
     * ///param  {Boolean} onlySelect Optional
     */
    printGridRows: function(grid, type, key, onlySelect) {
        if(typeof key == 'boolean'){
            onlySelect = key;
            key = '';
        }
        if(onlySelect == undefined){
            onlySelect = true;
        }
        if(grid instanceof mini.DataGrid){
            var rows = onlySelect ? grid.getSelecteds() : grid.getRows();
            if(rows.length == 0){
                mini.alert("请选中一条记录");
                return false;
            }
            var ids = [];
            var id = key || grid.getIdField();
            mini.forEach(rows, function(item, index) {
                ids.push(item[id]);
            });
            utils.printReport(type, ids);
        } else {
            mini.alert('参数有问题');
        }
    },
    printExpress: function(ids) {
        if(typeof ids == 'string'){
            ids = [ids];
        }
        var url = "/Print/PrintCourier.html?id=" + ids.join(',');
        utils.blankOpen(url);
    },
    printReport: function (type, ids) {
        if(typeof ids == 'string'){
            ids = [ids];
        }
        var url = '';
        var reports = [
            "rptPurchaseOrder", //采购单
            "rptCustomerOrder", //客户订单
            "rptCustomerReturns", //客户退货单
            "rptInventoryAdjust", //库存盘点作业调整单
            "rptInventoryCheck", //库存盘点单
            "rptPicking", // 领料单
            "rptProductShipment", //出货单
            "rptScrapOut", //报废出库
            "rptScrapPutInStorage", //报废入库
            "rptStockAccept", //进货验收单
            "rptStockAllot", //库存调拨单
            "rptStockBack", //进料退回单
            "rptReceivables", //收款单
            "rptPayment", //付款单
            "rptBranchShipment", //分部商场自营店送货
            "rptBranchBack", //采购退货单
            "rptBranchStock", //成品采购入库单
            "rptBranchBackReceipt", //成品采购退货入库单
            "rptQuotation", //报价单
            "rptCollectOrder", //分部商场自营店订货
            "rptVariance", //采购退货差异
            "rptConsignmentStock", //代销入库单
            "rptRepair", //维修单
            "rptRetailOrder" //客户零售订单
        ];
        if(!~type.indexOf('rpt')){
            type = 'rpt' + type;
        }
        if(~reports.indexOf(type)){
            // 目前这些单据都只支持一次打印一张
            url = '/Print/FastReportViewer.aspx?rname='+ type +'&id=' + ids.join(','); // ids.slice(0,1).join(',')
        } else {
            mini.alert("没有报表供打印");
            return;
        }
        utils.blankOpen(url);
    },
    blankOpen: function (url) {
        return window.open(url, "_blank", '');
    }
};

$(document).ready(function () {
    $(".j_num").on("click", function(e) {
        e.preventDefault();
        var href = $(this).attr("href"),
            index = $(this).data("index"),
            text = $.trim($(this).text());
        if( window.parent.CreateMenuItem ) {
            window.parent.CreateMenuItem(href, text, false);
        } else {
            alert('please import contabs.js in parent frame.');
        }
    });

    $(".j_num2").on("click", function (e) {
        e.preventDefault();
        var href = $(this).attr("href"),
            index = $(this).data("index"),
            text = $.trim($(this).attr("aname"));
        if (window.parent.CreateMenuItem) {
            window.parent.CreateMenuItem(href, text, false);
        } else {
            alert('please import contabs.js in parent frame.');
        }
    });


});
// 读取cookies@
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

// 删除cookies@
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


//*************************************注册命名空间功能start**********************************
(function () {
    var _ERP = window._ERP;
    if (!_ERP) {
        _ERP = {
            RegisterNS: function (fullNameSpace) {
                var nsArray = fullNameSpace.split('.');
                var parent = _ERP;
                for (var i = 0; i < nsArray.length; i++) {

                    if (typeof (parent[nsArray[i]]) === 'undefined') {
                        for (var ii = i; ii < nsArray.length; ii++) {
                            parent = parent[nsArray[ii]] = new Object();
                        }
                        break;
                    } else {
                        parent = parent[nsArray[i]];
                    }
                }
            },
            IsExistObject: function (objectFullStr) {
                var nsArray = objectFullStr.split('.');
                var parent = _ERP;
                for (var i = 0; i < nsArray.length; i++) {

                    if (typeof (parent[nsArray[i]]) === 'undefined') {
                        return false;
                    }
                    parent = parent[nsArray[i]];
                }
                return true;
            }
        };
        window._ERP = _ERP;
    }
}());
//*************************************注册命名空间功能end**********************************

(function (_ERP) {

    if (!_ERP.IsExistObject("ERPBaseClass")) {
        _ERP.RegisterNS("ERPBaseClass");

        //初始化
        _ERP.ERPBaseClass.Initialize = function () {
            $(document).ready(function () {
                //自动填充------
                $(".dats-fit").each(function () {
                    var fit = $(this);
                    var parent = fit.parent();
                    var pHeight = parent.height();
                    var sHeight = 0;
                    fit.siblings().each(function () {
                        sHeight += $(this).outerHeight();
                    });
                    fit.css("height", pHeight - sHeight + "px");
                });

            });
        },
        //*************************Ajax  start**********
        _ERP.ERPBaseClass.Ajax = {
            Get: function (url, data, callback, isLoad) {
                if (!arguments[3]) isLoad = false;//默认为false
                var index = -1;
                if (isLoad) {
                    mini.mask({
                        el: document.body,
                        cls: 'mini-mask-loading',
                        html: '正在获取...'
                    });
                }
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json",
                    dataType: "json",
                    data: data,
                    success: function (retData) {
                        mini.unmask(document.body);
                        callback(retData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        mini.unmask(document.body);
                        alert(jqXHR.responseText, "错误提示");
                    }
                });
            },
            Post: function (url, data, callback, isLoad) {
                if (!arguments[3]) isLoad = true;//默认为true
                var index = -1;
                if (isLoad) {
                    mini.mask({
                        el: document.body,
                        cls: 'mini-mask-loading',
                        html: '提交中...'
                    });
                }
                $.ajax({
                    url: url,
                    type: "POST",
                    data: data,
                    success: function (retData) {
                        mini.unmask(document.body);
                        callback(retData);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        mini.unmask(document.body);
                        //                        callback({ status: 0, msg: jqXHR.responseText,data:""});
                        alert(jqXHR.responseText, "错误提示");
                        //                        callback("");
                    }
                });
            }
        }
        //*************************Ajax  end**********


        //*************************RootOpen  start**********
        _ERP.ERPBaseClass.RootOpen = {
            _url: "",
            _type: "post",
            _title: "",
            _width: 600,
            _height: 400,
            _cache: false,
            _showMaxButton: true,
            _Open: function (data, callback) {
                mini.open({
                    url: this._url,
                    title: this._title,
                    allowResize: false,
                    width: this._width,
                    height: this._height,
                    showMaxButton: this._showMaxButton,
//                    showCloseButton: false,
                    onload: function () {
                        if (data != "" && data != null && data != "null") {
                            var iframe = this.getIFrameEl();
                            iframe.contentWindow.SetData(data);
                        }
                    },
                    ondestroy: function (retData) {
                        var iframe = this.getIFrameEl();
                        callback(retData, iframe);
                    }
                });
            },
            _OpenMax: function (data, callback) {
                mini.open({
                    url: this._url,
                    title: this._title,
                    allowResize: false,
                    width: this._width,
                    height: this._height,
                    showMaxButton: this._showMaxButton,
//                    showCloseButton:false,
//                    showHeader: false,
                    onload: function () {
                        this.max();//窗口最大化
                        if (data != "" && data !=null && data !="null") {
                            //console.log(data)
                            var iframe = this.getIFrameEl();
                            iframe.contentWindow.SetData(data);
                        }
                    },
                    ondestroy: function (retData) {
                        var iframe = this.getIFrameEl();
                        callback(retData, iframe);
                    }
                });
            }
            //-------------------------------   
        }
        //*************************RootOpen  end**********

        //*************************CommonOpen  start**********
        _ERP.ERPBaseClass.CommonOpen = {
            _rootOpen: _ERP.ERPBaseClass.RootOpen,
            OpenProviderSelect: function (callback) {
                this._rootOpen._url = "/Common/ProviderSelect",
                this._rootOpen._title = "供应商选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenProducCategorySelect: function (callback) {
                this._rootOpen._url = "/Common/ProductCategorySelect",
                this._rootOpen._title = "商品类别选择";
                this._rootOpen._width = 320;
                this._rootOpen._height = 440;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenStorageSelect: function (data, callback) {
                // chenfu说要用true/false   2016.12.7
                //                data 的格式  { IsOut: IsOut, IsProduct: IsProduct, OnlyBranch: OnlyBranch, OrderType:OrderType};
                //                IsOut,是否选择出库仓，true为是、false为否（默认为false）
                //                IsProduct,是否产地仓，true为是、false为否（默认为false）
                //                OnlyBranch,只获取当前部门的仓库，true为是、false为否（默认为false）
                //                OrderType订单类型，purchase表示采购单，allot调拨单
                if (data === "") data = {};
                var json = mini.encode(data);
                this._rootOpen._url = "/Common/StorageSelect?whereJson=" + json,
                this._rootOpen._title = "仓库选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenProductSelect: function (data, callback) {
                //                data 的格式  { ProviderId: ProviderId,
                //                               ProductStorageId:ProductStorageId,
                //                               StorageId: 出库仓ID, InStorageId: 入库仓ID,  };
                console.log(data)
                if (data === "") data = {};
                var json = mini.encode(data);
                this._rootOpen._url = "/Common/ProductSelect?whereJson=" + json,
                this._rootOpen._title = "商品选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenPurchaseOrderSelect: function (data, callback) {
                //                data 的格式  { RecordStatus: RecordStatus, Status:Status };
                if (data === "") data = {};
                var json = mini.encode(data);
                this._rootOpen._url = "/Common/PurchaseOrderSelect?whereJson=" + json,
                this._rootOpen._title = "采购单选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenCustomerOrderSelect: function (data, callback) {
                //                data 的格式  { RecordStatus: RecordStatus, Status:Status };
                if (data === "") data = {};
                var json = mini.encode(data);
                this._rootOpen._url = "/Common/CustomerOrderSelect?whereJson=" + json,
                this._rootOpen._title = "客户订单(分单)选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenBranchBackSelect: function (data, callback) {//采购退货单选择
                //                data 的格式  { RecordStatus: RecordStatus, Status:Status };
                if (data === "") data = {};
                var json = mini.encode(data);
                this._rootOpen._url = "/Common/BranchBackSelect?whereJson=" + json,
                this._rootOpen._title = "采购退货单选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenBranchSetSelect: function (data, callback) {
                //                data 的格式  { OnlyBranch: OnlyBranch, Directly:Directly };
                if (data === "") data = {};
                var json = mini.encode(data);
                this._rootOpen._url = "/Common/BranchSetSelect?whereJson=" + json,
                this._rootOpen._title = "部门选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenInventoryCheckBillsSelect: function (data, callback) {
                //                data 的格式  {  };
                if (data === "") data = {};
                var json = mini.encode(data);
                this._rootOpen._url = "/Common/InventoryCheckSelect?whereJson=" + json,
                this._rootOpen._title = "盘点单选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            },
            OpenSystemUserSelect: function (data, callback) {
                //                data 的格式  { OnlyBranch: OnlyBranch, Directly:Directly,BranchSetId:BranchSetId };
                if (data === "") data = {};
                var json = mini.encode(data);
                this._rootOpen._url = "/Common/SystemUserSelect?whereJson=" + json,
                this._rootOpen._title = "用户选择";
                this._rootOpen._width = 900;
                this._rootOpen._height = 420;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._Open("", callback);
            }
            //-------------------------------   
        }
        //*************************CommonOpen  end**********

        //*************************ProductOpen  start**********
        _ERP.ERPBaseClass.ProductOpen = {
            _rootOpen: _ERP.ERPBaseClass.RootOpen,
            OpenGoodsDetail: function (data, callback) {
                this._rootOpen._url = "/Product/ProductDetail",
                this._rootOpen._title = "商品管理";
                this._rootOpen._width = 960;
                this._rootOpen._height = 480;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenSafetyStockSetting: function (data, callback) {
                this._rootOpen._url = "/Product/SafetyStockSetting",
                this._rootOpen._title = "安全库存设置";
                this._rootOpen._width = 960;
                this._rootOpen._height = 480;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            }
            //-------------------------------   
        }
        //*************************ProductOpen  end**********
        //*************************JiCaiOrderOpen  start**********
        _ERP.ERPBaseClass.JiCaiOrderOpen = {
            _rootOpen: _ERP.ERPBaseClass.RootOpen,
            OpenPurchaseJobDetail: function (data, callback) {
                this._rootOpen._url = "/JiCaiOrder/PurchaseJobDetail",
                this._rootOpen._title = "采购单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenAllocationDetail: function (data, callback) {
                this._rootOpen._url = "/JiCaiOrder/StockAllotDetail"+"/"+data.Id,
                this._rootOpen._title = "库存调拨单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenIncomingInboundDetail: function (data, callback) {
                this._rootOpen._url = "/JiCaiOrder/IncomingInboundDetail",
                this._rootOpen._title = "进货验收单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            //进货退回
            OpenPurchaseReturnDetail: function (data, callback) {
                this._rootOpen._url = "/JiCaiOrder/PurchaseReturnDetail",
                this._rootOpen._title = "进货退回单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            
            OpenApplicationDetail: function (data, callback) {
                this._rootOpen._url = "/JiCaiOrder/ReceivingApplyDetail",
                this._rootOpen._title = "辅料领取单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenOrderDeliveryDetail: function (data, callback) {
                this._rootOpen._url = "/JiCaiOrder/OrderDeliveryDetail",
                this._rootOpen._title = "订单送货单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            //集采的采购退货入库
            OpenpurchasingReturnDetail: function (data, callback) {
                this._rootOpen._url = "/JiCaiOrder/purchasingReturnDetail",
                this._rootOpen._title = "采购退货入库单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            //省仓的采购退货入库
            OpenpurchasReturnorderDetail: function (data, callback) {
                this._rootOpen._url = "/ShengCangOrder/PurchaseReturnOrderDetail",
                this._rootOpen._title = "采购退货入库单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            //差异
            OpenDifferenceDetail: function (data, callback) {
                this._rootOpen._url = "/JiCaiOrder/DifferenceDetail",
            this._rootOpen._title = "数量差异单";
            this._rootOpen._width = 1000;
            this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
            this._rootOpen._OpenMax(data, callback);
        }

            //-------------------------------   
        }
        //*************************JiCaiOrderOpen  end**********
        //*************************StorageOpen  start**********
        _ERP.ERPBaseClass.StorageOpen = {
            _rootOpen: _ERP.ERPBaseClass.RootOpen,
            OpenInventoryCheckDetail: function (data, callback) {
                this._rootOpen._url = "/Storage/InventoryCheckDetail",
                this._rootOpen._title = "库存盘点建立";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 580;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenInventoryAdjustDetail: function (data, callback) {
                this._rootOpen._url = "/Storage/InventoryAdjustDetail",
                this._rootOpen._title = "库存盘点调整";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 580;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenAllotOutDetail: function (data, callback) {
                this._rootOpen._url = "/Storage/StockAllotOutDetail"+"/"+data.Id,
                this._rootOpen._title = "调拨出库";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenAllotInDetail: function (data, callback) {
                this._rootOpen._url = "/Storage/StockAllotInDetail"+"/"+data.Id,
                this._rootOpen._title = "调拨入库";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            //-------------------------------   
        }
        //*************************StorageOpen  end**********

        //*************************SettingOpen  start**********
        _ERP.ERPBaseClass.SettingOpen = {
            _rootOpen: _ERP.ERPBaseClass.RootOpen,
            OpenProviderDetail: function (data, callback) {
                this._rootOpen._url = "/Setting/ProviderDetail",
                this._rootOpen._title = "供应商详情";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 580;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenStorageInfo: function (data, callback) {
                this._rootOpen._url = "/Setting/StorageDetail",
                this._rootOpen._title = "仓库基本信息维护";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 580;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenSystemRoleDetail: function (data, callback) {
                this._rootOpen._url = "/Setting/SystemRoleDetail?roleId="+data.RoleId,
                this._rootOpen._title = "用户权限配置";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 580;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            },
            OpenSystemUserDetail: function (data, callback) {
                this._rootOpen._url = "/Setting/SystemUserDetail",
                this._rootOpen._title = "用户管理";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 580;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            }
            //-------------------------------   
        }
        //*************************SettingOpen  end**********
        //*************************shengcang  start**********
        _ERP.ERPBaseClass.shengcangOpen = {
            _rootOpen: _ERP.ERPBaseClass.RootOpen,
            OpenOrderDeliveryDetail: function (data, callback) {
                this._rootOpen._url = "/Common/OrderDeliveryDetail",
                this._rootOpen._title = "订单送货单";
                this._rootOpen._width = 1000;
                this._rootOpen._height = 500;
                //                this._rootOpen._showMaxButton = true;
                this._rootOpen._OpenMax(data, callback);
            }
            //-------------------------------   
        }
    }


})(window._ERP);
var _erp = _ERP.ERPBaseClass;
_erp.Initialize();






