/**
 * 弹出扫描表单
 * 
 */
ScanFormWindow = function () {
    ScanFormWindow.superclass.constructor.apply(this, arguments);
    this.initControls();
    this.initEvents();
}
mini.extend(ScanFormWindow, mini.Window, {
    url: "",
    title: "扫描功能",
    width: 500,
    // height: 320,
    allowResize: true,
    showModal: true,
    showToolbar: false,
    showFooter: true,
    allowDrag: true,
    initControls: function () {
        var footerEl = this.getFooterEl();
        var bodyEl = this.getBodyEl();
        var formId = this.id + "$form";
        var bodyHtmlArr = [];

        // 字段没有设置
        bodyHtmlArr.push("<div id=\""+ formId +"\" name=\"" + formId +"\" class=\"form\" >");
        bodyHtmlArr.push("<input class=\"mini-hidden\" name=\"id\"/>");
        bodyHtmlArr.push("<table class=\"table table-noborder\" style=\"width:100%;\">");
        bodyHtmlArr.push("    <tr>");
        bodyHtmlArr.push("        <td style=\"width:80px;\">条码编号：</td>");
        bodyHtmlArr.push("        <td style=\"width:150px;\"><input name=\"xxx\" class=\"mini-textbox\" required=\"true\" /></td>");
        bodyHtmlArr.push("        <td style=\"width:80px;\">数 量：</td>");
        bodyHtmlArr.push("        <td style=\"width:150px;\"><input name=\"name\" class=\"mini-textbox\" /></td>");
        bodyHtmlArr.push("   </tr>");
        bodyHtmlArr.push("   <tr>");
        bodyHtmlArr.push("      <td>产品编号：</td>");
        bodyHtmlArr.push("      <td><input name=\"xxxxx\" class=\"mini-textbox\" /></td>");
        bodyHtmlArr.push("      <td>产品名称：</td>");
        bodyHtmlArr.push("      <td><input name=\"name\" class=\"mini-textbox\" /></td>");
        bodyHtmlArr.push("    </tr>");
        bodyHtmlArr.push("    <tr>");
        bodyHtmlArr.push("        <td>规格型号：</td>");
        bodyHtmlArr.push("        <td><input name=\"xxxxxx\" class=\"mini-textbox\" /></td>");
        bodyHtmlArr.push("        <td>类 别：</td>");
        bodyHtmlArr.push("        <td><input name=\"namae\" class=\"mini-textbox\" /></td>");
        bodyHtmlArr.push("    </tr>");
        bodyHtmlArr.push("    <tr>");
        bodyHtmlArr.push("        <td>颜 色：</td>");
        bodyHtmlArr.push("        <td><input name=\"aaaaaa\" class=\"mini-textbox\" /></td>");
        bodyHtmlArr.push("        <td>尺 寸：</td>");
        bodyHtmlArr.push("        <td><input name=\"name\" class=\"mini-textbox\" /></td>");
        bodyHtmlArr.push("    </tr>");
        bodyHtmlArr.push("    <tr>");
        bodyHtmlArr.push("        <td>单 重：</td>");
        bodyHtmlArr.push("        <td><input name=\"ssssss\" class=\"mini-textbox\" /></td>");
        bodyHtmlArr.push("        <td>单 价：</td>");
        bodyHtmlArr.push("        <td><input name=\"aaaaaaaa\" class=\"mini-textbox\"  /></td>");
        bodyHtmlArr.push("    </tr>");
        bodyHtmlArr.push("    <tr>");
        bodyHtmlArr.push("        <td>自动添加：</td>");
        bodyHtmlArr.push("        <td><input name=\"zzzzzzz\" class=\"mini-checkbox\" checked trueValue=\"1\" falseValue=\"0\" /></td>");
        bodyHtmlArr.push("        <td></td>");
        bodyHtmlArr.push("        <td></td>");
        bodyHtmlArr.push("    </tr>");
        bodyHtmlArr.push("</table>");
        bodyHtmlArr.push("</div>");
        jQuery(bodyEl).append(bodyHtmlArr.join(""));

        //footer
        var footerHtml =
            '<div style="padding:8px;text-align:center;">'
                + '<a name="okBtn" class="mini-button" style="width:60px;">确定</a>       '
                + '<span style="display:inline-block;width:25px;"></span>'
                + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>       '
            + '</div>';
        jQuery(footerEl).append(footerHtml);

        //组件对象
        mini.parse(this.el);
        this._okBtn = mini.getbyName("okBtn", this);
        this._cancelBtn = mini.getbyName("cancelBtn", this);
    },
    initEvents: function () {
        /////////////////////////////////////
        this._okBtn.on("click", function (e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('ok');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this._cancelBtn.on("click", function (e) {
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
    setClick: function(callback){ 
        this._Callback = callback;
    },
    // form method
    getForm: function() {
        return this.form;
    }
});
mini.regClass(ScanFormWindow, "scanformwindow");