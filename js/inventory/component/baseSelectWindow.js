/*
    标准模板：弹出选择面板
    注意，只需要修改搜索框和mini.DataGrid相关的列配置信息即可。
*/

mini.BaseSelectWindow = function (el, options) {
    options || (options = {});
    mini.BaseSelectWindow.superclass.constructor.apply(this, arguments);
    if(options.gridcolumns){
        this.gridcolumns = options.gridcolumns;
    }
    if(options.keyLable){
        this.keyLable = options.keyLable;
    }
    if(options.multiSelect !== undefined){
        this.multiSelect = options.multiSelect;
    }
    if(options.keyField){
        this.keyField = options.keyField;
    }
    if(options.params){
        this.params = options.params || {};
    }
    if(options.closeAction){
        this.closeAction = options.closeAction;
    }
    this.initControls();
    this.initEvents();
}
mini.extend(mini.BaseSelectWindow, mini.Window, {
    url: "",
    keyField: "key",
    multiSelect: false,
    title: "查询",
    keyLable: "KEYLABLE：",  // optional
    searchLable: "查询：",
    width: 760,
    height: 400,
    bodyStyle: "padding:0;",
    allowResize: true,
    showModal: true,
    showToolbar: true,
    showFooter: true,
    dblClickSelect: true,
    gridcolumns: [],
    initControls: function () {
        var toolbarEl = this.getToolbarEl();
        var footerEl = this.getFooterEl();
        var bodyEl = this.getBodyEl();

        //toolbar
        var labelId = this.id + "$label";
        var topHtml =
            '<div style="padding:5px;text-align:left;">'
                + '<span id="' + labelId + '">' + this.keyLable + '</span>    '
                + '<input name="keyText" class="mini-textbox" style="width:160px;"/> '
                + '<a name="searchBtn" class="mini-button">查找</a>       '
            + '</div>';
        jQuery(toolbarEl).append(topHtml);

        //footer
        var footerHtml =
            '<div style="padding:8px;text-align:center;">'
                + '<a name="okBtn" class="mini-button" style="width:60px;">确定</a>       '
                + '<span style="display:inline-block;width:25px;"></span>'
                + '<a name="cancelBtn" class="mini-button" style="width:60px;">取消</a>       '
            + '</div>';
        jQuery(footerEl).append(footerHtml);

        /////////////////////////////////////////////////////
        //body        
        this.grid = new mini.DataGrid();


        this.grid.on("drawcell", function (e) {
            var record = e.record,
                    column = e.column,
                    field = e.field,
                    value = e.value;
            var type = record.Type;
            if (field == "RecordStatus") {
                if (record.RecordStatus == 0) {
                    e.cellHtml = "未审核";
                } else {
                    e.cellHtml = "已审核";
                }
            }
        });

        this.grid.set({
            multiSelect: this.multiSelect,
            allowCellSelect: true,
            style: "width: 100%;height: 100%;",
            borderStyle: "border:0",
            columns: this.gridcolumns
        });

        this.grid.setUrl(this.url);
        this.grid.render(bodyEl);
        mini.relMethod(this, this.grid, ['load','setIdField', 'getIdField', 'setColumns', 'getColumns']);
        //组件对象
        mini.parse(this.el);

        this._okBtn = mini.getbyName("okBtn", this);
        this._cancelBtn = mini.getbyName("cancelBtn", this);
        this._searchBtn = mini.getbyName("searchBtn", this);
        this._keyText = mini.getbyName("keyText", this);
    },
    initEvents: function () {
        var me = this;
        this._searchBtn.on("click", function (e) {
            var key = this._keyText.getValue();
            key = $.trim(key);
                this.search(key);
        }, this);
        this._keyText.on("enter", function (e) {
            var key = this._keyText.getValue();
                key = $.trim(key);
                this.search(key);
        }, this);

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

        if(this.dblClickSelect){
            this.grid.on('rowdblclick', function(e){
                me._okBtn.fire("click");
            })
        }
    },
    setDblClickSelect: function(value) {
        this.dblClickSelect = value;
    },
    setKeyLable: function (value) {
        var labelId = this.id + "$label";
        var label = document.getElementById(label);
        if (label) {
            label.innerHTML = value;
            this.keyLable = value;
        }
    },
    setSearchLable: function (value) {
        this._searchBtn.setText(value);
    },
    setUrl: function (value) {
        this.url = value;
        this.grid.setUrl(value);
    },
    setKeyField: function (value) {
        this.keyField = value;
    },
    setMultiSelect: function (value) {
        this.multiSelect = value;
        this.grid.setMultiSelect(value);
    },
    search: function (key) {
        if(!key){
            return;
        }
        var args = {};
        args[this.keyField] = key;
        args = $.extend({}, args, this.params);
        this.grid.load(args);
    },
    gridOn: function(){
        this.grid.on.apply(this.grid, arguments);
    },
    setSortBy: function(key, value) {
        this.grid.sortBy(key, value);
    },
    setData: function (data, callback) {
        this._Callback = callback;
    },
    getData: function () {
        var row;
        if(this.multiSelect) {
            row = this.grid.getSelecteds();
        } else {
            row = this.grid.getSelected();
        }
        return row;
    }
});
mini.regClass(mini.BaseSelectWindow, "baseselectwindow");