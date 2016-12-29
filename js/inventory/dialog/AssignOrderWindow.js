/**
 *  分配订单
 */

AssignOrderWindow = function(el, options) {
    this.el = document.createElement("div");
    options || (options = {});
    AssignOrderWindow.superclass.constructor.apply(this, arguments);
    if (options.data) {
        this.data = options.data;
    }
    this.initControls();
    this.initEvents();
}


mini.extend(AssignOrderWindow, mini.Window, {
    url: "",
    title: "分配订单",
    width: 400,
    height: 250,
    allowResize: false,
    showModal: true,
    showToolbar: false,
    showFooter: true,
    allowDrag: true,
    initControls: function() {
        var bodyEl = this.getBodyEl();
        var footerEl = this.getFooterEl();
        //footer
        var footerHtml =
            '<div style="padding:8px;text-align:center;">' + '<a name="okBtn" class="mini-button" style="width:60px;">确定</a>       ' + '<span style="display:inline-block;width:25px;"></span>' + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>       ' + '</div>';
        jQuery(footerEl).html(footerHtml);

        var formId = this.getFormId();
        var bodyHtml =
            '<form id="' + formId + '" method="post">' + '<input class="mini-hidden" name="orderId" value="' + this.data.orderId + '">' + '<input class="mini-hidden" name="branchSetId">' + '<table class="table table-noborder">' + '<tr><td style="width:85px;">订单编号：</td><td>' + this.data.orderNo + '</td></tr>' + '<tr><td>将订单分配给：</td><td><input name="branchName" textName="branchName" required="true" class="mini-buttonedit searchbox" /></td></tr>' + '</table>' + '</form>';
        jQuery(bodyEl).html(bodyHtml);
        mini.parse(this.el);

        this.on('render', function(){
            this._form = new mini.Form(formId);
            mini.relMethod(this, this._form, ['setData', 'getData', 'isValid', 'validate']);
        }, this);
        this._okBtn = mini.getbyName("okBtn", this);
        this._cancelBtn = mini.getbyName("cancelBtn", this);
        this._branchNamebtn = mini.getbyName("branchName", this);

    },
    initEvents: function() {
        this._okBtn.on("click", function(e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('ok');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this._cancelBtn.on("click", function(e) {
            var ret = true;
            if (this._Callback) ret = this._Callback('cancel');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this.on("beforebuttonclick", function(e) {
            if (e.name == "close") {
                e.cancel = true;
                var ret = true;
                if (this._Callback) ret = this._Callback('close');
                if (ret !== false) {
                    this.hide();
                }
            }
        }, this);

        this._branchNamebtn.on('buttonclick', function(e) {
            if (this._Callback)
                this._Callback('buttonclick');
        }, this);
    },
    getFormId: function() {
        return this.id + "$form";
    },
    setBranch: function (id, name) {
        this.setData({
            branchSetId: id,
            branchName: name
        }, false);
    },
    listen: function(callback) {
        this._Callback = callback;
    }
});
mini.regClass(AssignOrderWindow, "assignorderwindow");
