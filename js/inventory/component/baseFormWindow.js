/**
 * Base Form View Window
 * 
 */
mini.BaseFormWindow = function (el, options) {
    options || (options = {});
    mini.BaseFormWindow.superclass.constructor.apply(this, arguments);
    if($.isFunction(options.getBodyHtml)){
        this.getBodyHtml = options.getBodyHtml;
    }
    if($.isFunction(options.getFooterHtml)){
        this.getFooterHtml = options.getFooterHtml;
    }
    // for(var i in options){
    //     this[i] = options[i];
    // }
    this.formId = this.id + "$form";
    this.initControls();
    this.initEvents();
}
mini.extend(mini.BaseFormWindow, mini.Window, {
    url: "",
    title: "title",
    width: 700,
    height: 480,
    allowResize: true,
    showModal: true,
    showToolbar: false,
    showFooter: true,
    allowDrag: true,
    getBodyHtml: function() {
        return ''
    },
    getFooterHtml: function() {
        var footerHtml =
            '<div style="padding:8px;text-align:center;">'
                + '<a name="okBtn" class="mini-button" style="width:60px;">确定</a>       '
                + '<span style="display:inline-block;width:25px;"></span>'
                + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>       '
            + '</div>';
        return footerHtml;
    },
    initControls: function () {
        var me = this;
        var footerEl = this.getFooterEl();
        var bodyEl = this.getBodyEl();
        

        jQuery(bodyEl).append(this.getBodyHtml());

        if(this.showFooter){
            jQuery(footerEl).append(this.getFooterHtml());
        }
        //组件对象
        mini.parse(this.el);

        this._okBtn = mini.getbyName("okBtn", this);
        this._cancelBtn = mini.getbyName("cancelBtn", this);

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
            this.form = new mini.Form(this.formId);
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
    listen: function(callback){
        this._Callback = callback;
    },
    // form method
    getForm: function() {
        return this.form;
    }
});
mini.regClass(mini.BaseFormWindow, "baseformwindow");