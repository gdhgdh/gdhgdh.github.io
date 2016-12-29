/**
 *  物流信息
 */

LogisticsInfoWindow = function (options) {
    LogisticsInfoWindow.superclass.constructor.apply(this, arguments);
    this.initControls();
}


mini.extend(LogisticsInfoWindow, mini.Window, {
    url: "",
    title: "物流轨迹信息",
    width: 500,
    height: 400,
    allowResize: false,
    showModal: true,
    showToolbar: false,
    showFooter: false,
    allowDrag: true,
    ajaxAsync: false,
    ajaxType: "POST",
    autoLoad: false,
    template: function (data) {
        var data = data.traceList;
        var str = '<table class="table table-noborder" width="100%" cellpadding="0" cellspacing="0">'
        for (var i = 0, l = data.length; i < l; i++) {
            str += '<tr'+ (i == l-1 ? ' class="text-success"' : '') +'>'+ '<td width="30%">'+ data[i].acceptTime+'</td>' + '<td width="70%">'+ data[i].acceptAddress+'</td>' +'</tr>'
        }
        str += "</table>";
        return str;
    },
    load: function (params, success, error, complete) {
        if (typeof params == "string") {
            this.setUrl(params);
            return;
        }
        if (this._loadTimer) clearTimeout(this._loadTimer);
        this.loadParams = params || {};
        if (this._xhr) {
            this._xhr.abort();
        }
        if (this.ajaxAsync && mini_ajaxAsyncInvoke) {  
            var me = this;
            this._loadTimer = setTimeout(function () {
                me._doLoad(me.loadParams, success, error, complete);
                me._loadTimer = null;
            }, 1);
        } else {
            this._doLoad(this.loadParams, success, error, complete);
        }
    },
    _doLoad: function (loadParams, success, error, complete) { // 重载
    	var me  = this;
    	if(me.url){
        	this._xhr = mini.ajax({
        		url: me.url,
        		type: me.ajaxType || "GET",
        		dataType: 'json',
        		data: loadParams,
        	})
        	.done(function(data) {
        		if (success) success.apply(me, arguments);
                if (data.Statu == 0){
                    me.setData(data.Data);
                    me.setStatus('ok');
                } else {
                    me.setData([]);
                    me.setError(data.Msg);
                    me.setStatus('error');
                }
        		me.fire("load");
        	})
        	.fail(function() {
        		if (error) error.apply(me, arguments);
        	})
    	}	
    },
    setStatus: function(status) {
        this.loadStatus = status;
    },
    setError: function(msg) {
        this.loadError = msg;
    },  
    setData: function(data) {
        this.data = data;
    },
    setUrl: function(value){
        this.url = value;
    },
    initControls: function () {
        var me = this;
        var footerEl = this.getFooterEl();
        var bodyEl = this.getBodyEl();
        jQuery(bodyEl).append(this.loadingMsg);
        this.on('load', function(e){
            var source = e.source;
            if(source.loadStatus == 'ok'){
                jQuery(bodyEl).html(me.template(source.data));
            } else {
                jQuery(bodyEl).html('<div class="text-center pt-20 pb-20">'+ source.loadError + '</div>');
            }
            // console.info(arguments);
        }.bind(this));
    },
    initEvents: function() {

    }
});
mini.regClass(LogisticsInfoWindow, "logisticsinfowindow");
