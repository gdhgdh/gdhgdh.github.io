/**
 * Branch Edit View Window
 * 
 */
BranchWindow = function (el, options) {
    options || (options = {});
    BranchWindow.superclass.constructor.apply(this, arguments);
    if(options.action){
        this.action = options.action;
    }
    // if(options.keyLable){
    //     this.keyLable = options.keyLable;
    // }
    // if(options.multiSelect !== undefined){
    //     this.multiSelect = options.multiSelect;
    // }
    // if(options.keyField){
    //     this.keyField = options.keyField;
    // }
    // if(options.params){
    //     this.params = options.params || {};
    // }
    this.initControls();
    this.initEvents();
}
mini.extend(BranchWindow, mini.Window, {
    url: "",
    title: "分部信息",
    width: 700,
    height: 480,
    allowResize: true,
    showModal: true,
    showToolbar: false,
    showFooter: true,
    allowDrag: true,
    action: 'default',
    initControls: function () {
        var me = this;
        var footerEl = this.getFooterEl();
        var bodyEl = this.getBodyEl();
        var formId = this.id + "$form";
        var bodyHtmlArr = [];
        bodyHtmlArr.push("<form id=\""+ formId +"\" method=\"post\" name=\"" + formId +"\" class=\"form\" >");
        if(this.action != 'create'){
            bodyHtmlArr.push("    <input name=\"Id\" class=\"mini-hidden\" />");
        }
        bodyHtmlArr.push("    <div style=\"padding-left:11px;padding-bottom:5px;\">");
        bodyHtmlArr.push("        <table class=\"table table-noborder\">");
        bodyHtmlArr.push("            <tr>");
        bodyHtmlArr.push("                <td style=\"width:70px;\">部门设置编号：</td>");
        bodyHtmlArr.push("                <td style=\"width:150px;\">    ");
        bodyHtmlArr.push("                    <input name=\"BranchCode\" class=\"mini-textbox\" required=\"true\"  emptyText=\"请输入帐号\"/>");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("                <td style=\"width:70px;\" >部门设置名称：</td>");
        bodyHtmlArr.push("                <td  style=\"width:150px;\" >    ");
        bodyHtmlArr.push("                    <input name=\"BranchName\" class=\"mini-textbox\" required=\"true\"/>");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("            </tr>");
        bodyHtmlArr.push("            <tr>");
        bodyHtmlArr.push("                <td >单位设置类型：</td>");
        bodyHtmlArr.push("                <td >    ");
        bodyHtmlArr.push("                    <input name=\"BranchType\" required=\"true\" textField=\"CODE_CN\" valueField=\"CODE_ID\" class=\"mini-combobox\" url=\"/CommonGetAjax/GetBranchTypeList\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("                <td >上级部门：</td>");
        bodyHtmlArr.push("                <td >    ");
        bodyHtmlArr.push("                    <input name=\"ParentId\" class=\"mini-hidden\" /><input required=\"true\" allowInput=\"false\" name=\"ParentName\" textName=\"ParentName\" class=\"mini-buttonedit searchbox\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("            </tr>");
        bodyHtmlArr.push("          <tr>");
        bodyHtmlArr.push("                <td >收货人：</td>");
        bodyHtmlArr.push("                <td >    ");
        bodyHtmlArr.push("                    <input name=\"ContactName\" required=\"true\" class=\"mini-textbox\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("                <td >收货人电话：</td>");
        bodyHtmlArr.push("                <td >    ");
        bodyHtmlArr.push("                    <input name=\"ContactTel\" required=\"true\" vtype=\"tel\" class=\"mini-textbox\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("            </tr>");
        bodyHtmlArr.push("          <tr>");
        bodyHtmlArr.push("                <td >所在地区：</td>");
        bodyHtmlArr.push("                <td colspan=\"3\">    ");
        bodyHtmlArr.push("<input name=\"ProvinceCode\" class=\"mini-combobox\" style=\"width:100px;\" valueField=\"Code\" textField=\"Name\" required=\"true\" />");
        bodyHtmlArr.push("&nbsp;<input name=\"CityCode\" class=\"mini-combobox\" style=\"width:100px;\" valueField=\"Code\" textField=\"Name\" required=\"true\" />");
        bodyHtmlArr.push("&nbsp;<input name=\"AreaCode\" class=\"mini-combobox\" style=\"width:100px;\" valueField=\"Code\" textField=\"Name\" required=\"true\" />");
        bodyHtmlArr.push("&nbsp;<input name=\"StreetCode\" class=\"mini-combobox\" style=\"width:150px;\" valueField=\"Code\" textField=\"Name\" required=\"true\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("            </tr>");
        bodyHtmlArr.push("          <tr>");
        bodyHtmlArr.push("                <td >收货地址：</td>");
        bodyHtmlArr.push("                <td colspan=\"3\" >    ");
        bodyHtmlArr.push("                    <input name=\"Address\" class=\"mini-textbox\" required=\"true\" style=\"width:85%;\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("            </tr>");
        bodyHtmlArr.push("          <tr>");
        bodyHtmlArr.push("                <td >银行账户名称：</td>");
        bodyHtmlArr.push("                <td >    ");
        bodyHtmlArr.push("                    <input name=\"AccountName\" class=\"mini-textbox\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("                <td >银行账号：</td>");
        bodyHtmlArr.push("                <td >    ");
        bodyHtmlArr.push("                    <input name=\"AccountNum\" class=\"mini-textbox\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("            </tr>");
        bodyHtmlArr.push("          <tr>");
        bodyHtmlArr.push("                <td >开户行编号：</td>");
        bodyHtmlArr.push("                <td >    ");
        bodyHtmlArr.push("                    <input name=\"BankNum\" textName=\"BankNum\" allowInput=\"false\" class=\"mini-buttonedit searchbox\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("                <td >开户行名称：</td>");
        bodyHtmlArr.push("                <td>    ");
        bodyHtmlArr.push("                    <input name=\"BankName\" class=\"mini-textbox\" readOnly />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("");
        bodyHtmlArr.push("            </tr>");
        bodyHtmlArr.push("          <tr>");
        bodyHtmlArr.push("                <td >账号类型：</td>");
        bodyHtmlArr.push("                <td >    ");
        bodyHtmlArr.push("                    <input name=\"AccountType\" class=\"mini-combobox\" textField=\"text\" valueField=\"key\" data=\"[{text: \'对公账号\', key:0 },{text: \'对私账号\', key: 1}]\" />");
        bodyHtmlArr.push("                </td>");
        bodyHtmlArr.push("            </tr>");
        bodyHtmlArr.push("        </table>");
        bodyHtmlArr.push("    </div>");
        bodyHtmlArr.push("</form>");
        jQuery(bodyEl).append(bodyHtmlArr.join(""));
        //footer
        if(this.action == 'edit' || this.action == 'create'){
            var footerHtml =
                '<div style="padding:8px;text-align:center;">'
                    + '<a name="okBtn" class="mini-button" style="width:60px;">确定</a>       '
                    + '<span style="display:inline-block;width:25px;"></span>'
                    + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>       '
                + '</div>';
            jQuery(footerEl).append(footerHtml);
        }
        //组件对象
        mini.parse(this.el);
        this._okBtn = mini.getbyName("okBtn", this);
        this._cancelBtn = mini.getbyName("cancelBtn", this);

        var ProvinceCode = mini.getbyName('ProvinceCode', this);
        var CityCode = mini.getbyName('CityCode', this);
        var AreaCode = mini.getbyName('AreaCode', this);
        var StreetCode = mini.getbyName('StreetCode', this);
        /// <param name="type">类型，p省，c市，a区，s街道</param>
        /// <param name="pCode">父级Code</param>
        ProvinceCode.load('/CommonGetAjax/PositionLoad?type=p'); 
        ProvinceCode.on('valuechanged', function(e){
            CityCode.load('/CommonGetAjax/PositionLoad?type=c&pCode='+ e.value);
            AreaCode.setData([]);
            StreetCode.setData([]);
        });
        CityCode.on('valuechanged', function(e){
            AreaCode.load('/CommonGetAjax/PositionLoad?type=a&pCode='+ e.value);
            StreetCode.setData([]);
        });
        AreaCode.on('valuechanged', function(e){
            StreetCode.load('/CommonGetAjax/PositionLoad?type=s&pCode='+ e.value);
        });
        StreetCode.on('valuechanged', function(e){
        })

        var BankNum = mini.getbyName('BankNum', this);
        BankNum.on('buttonclick', function(){
            me.showBankWin();
        })
        var ParentName = mini.getbyName('ParentName', this);
        ParentName.on('buttonclick', function(){
            me.showParentWin();
        })

        var BranchType = mini.getbyName('BranchType', this);

        ParentName.on('validation', function(e){
            if(BranchType.getValue() == 52){
                e.isValid = true;
            }
        })

        if(this.action == 'edit' || this.action == 'view'){
            this.on('load', function(){
                CityCode.load('/CommonGetAjax/PositionLoad?type=c&pCode='+ me.getCacheData('ProvinceCode'));
                AreaCode.load('/CommonGetAjax/PositionLoad?type=a&pCode='+ me.getCacheData('CityCode'));
                StreetCode.load('/CommonGetAjax/PositionLoad?type=s&pCode='+ me.getCacheData('AreaCode'));
            })
        }
    },
    load: function (id) {
        var me = this;
        if(this.action != 'create'){
            mini.ajax({
                url: this.url || '/SettingGetAjax/GetDepartmentDetail',
                type: 'GET',
                dataType: 'json',
                data: { id: id},
            })
            .done(function(data) {
                me.setData(data, false); // form.setData
                me.setCacheData(data);
                me.fire('load');
            })
            .fail(function() {
                console.log("error");
            });
        }
    },
    setCacheData: function(data){
        this.__data = data;
    },
    getCacheData: function(key) {
        this.__data || (this.__data = {});
        if(key){
            return this.__data[key] || '';
        }
    },
    showBankWin: function() {
        var me = this;
        var userWin = new mini.BaseSelectWindow(null, {
            // title: ''
            keyLable: "支行编号/银行名称：",
            gridcolumns: [
                { type: "checkcolumn", width:'5%', headerAlign: "center" }, 
                { header: "ID", type: "indexcolumn", headerAlign: "center" },
                { header: "支行编号", field: "bankCode", headerAlign: "center" , align: "center" },
                { header: "银行名称", field: "bankName", headerAlign: "center" , align: "center" },
            ],
            closeAction: 'destroy'
        })
        userWin.set({
            width: 700,
            height: 400,
            url: "/CommonGetAjax/GetBankCodeList"
        })
        userWin.search = function(key) {
            if(key){
                userWin.grid.filter(function (row) {
                    //name
                    var r1 = true;
                    var r2 = true;
                    if (key) {
                        r1 = String(row.bankCode).toLowerCase().indexOf(key) != -1;
                        r2 = String(row.bankName).toLowerCase().indexOf(key) != -1;
                    }
                    return r1 || r2;
                });
            } else {
                userWin.grid.clearFilter();
            }
        }
        userWin.setSortBy('Id', 'desc');
        userWin.show();
        userWin.load();
        userWin.setData(null, function (action) {
            if (action == "ok") {
                //获取数据
                var data = userWin.getData();
                me.setData({BankNum: data.bankCode, BankName: data.bankName}, false);
            }
        });        
    },
    showParentWin: function() {
        var me = this;
        var BranchType = mini.getbyName('BranchType', this);
        var type = BranchType.getValue();
        if(!type){
            mini.toast('请选择分部类型');
            return false;
        }

        pbranch = new BranchSelWindow(null,{
            closeAction: 'destroy'
        });
        pbranch.set({
            url: '/CommonGetAjax/GetCommBranchSetList',
        });
        pbranch.setSortBy("CreatedOn", "desc");
        pbranch.show();
        pbranch.load({
            branchType: type
        });
        //初始化数据
        pbranch.setData(null, function (action) {
            if (action == "ok") {
                //获取数据
                var data = pbranch.getData();
                // ParentId
                // ParentName
                me.setData({ ParentId: data.Id, ParentName: data.BranchName}, false);
            }
        });
    },
    initEvents: function () {
        /////////////////////////////////////
        this._okBtn && this._okBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('ok');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this._cancelBtn && this._cancelBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('cancel');
            if (ret !== false) {
                this.hide();
            }
        }, this);

        this.on('render', function(){
            this.form = new mini.Form(this.id + "$form");
            mini.relMethod(this, this.form, ['setData', 'getData', 'isValid', 'validate', 'clear', 'reset']);
        }, this);

        this.on("beforebuttonclick", function (e) {
            if (e.name == "close") {
                e.cancel = true;
                var ret = true;
                if (this._Callback) ret = this._Callback('close');
                if (ret !== false) {
                    this.hide();
                }
            }
        }, this);
    },
    // privide method:  formWindow.setClick(function(action){ });
    listen: function(callback){
        this._Callback = callback;
    },
    // form method
    getForm: function() {
        return this.form;
    }
});
mini.regClass(BranchWindow, "branchwindow");