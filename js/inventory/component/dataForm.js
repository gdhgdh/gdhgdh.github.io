/*
    扩展mini.Form
    

    var form = new mini.DataForm({
        template: function(data){
            return "template";
        },
        // columns: [{ type: 'textbox', label: 'xxxx'}, { type: ''}, {}, {}],
        // cols: 3,


    });
    form.render(document.body);

    form.validate()
    form.isValid();
    form.getData();
    form.setData();
*/

mini.DataForm = function (options) {
    options || (options = {});
    this.template = options.template || this.template;
    mini.DataForm.superclass.constructor.apply(this, arguments);
    this.initControls();
    this.initEvents();
}
mini.extend(mini.DataForm, mini.Control, {
    el: null,
    uiCls: 'mini-dataform',
    _create: function () {
        var html = this.template() || '';
        var d = document.createElement("div");
        d.innerHTML = html;
        this.el = d;
    },
    template: function (data, columns) {
        return "This is a template";
    },
    doLayout: function() {

    },
    doUpdate: function() {

    },
    getFields: function () {
        if (!this.el) return [];
        var controls = mini.findControls(function (control) {
            if (!control.el || control.formField != true) return false;
            if (mini.isAncestor(this.el, control.el)) return true;
            return false;
        }, this);
        return controls;
    },
    getFieldsMap: function () {
        var fields = this.getFields();
        var map = {};
        for (var i = 0, l = fields.length; i < l; i++) {
            var field = fields[i];
            if (field.name) map[field.name] = field;
        }
        return map;
    },
    getField: function (name) {
        if (!this.el) return null;
        return mini.getbyName(name, this.el);
    },

    getData: function (formatted, deep) {
        if (mini.isNull(deep)) deep = true;
        var valueFn = formatted ? "getFormValue" : "getValue";
        var controls = this.getFields();
        var data = {};
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            var fn = control[valueFn];
            if (!fn) continue;
            if (control.name) {
                if (deep == true) {
                    mini._setMap(control.name, fn.call(control), data);
                } else {
                    data[control.name] = fn.call(control);
                }
            }
            if (control.textName && control.getText) {
                if (deep == true) {
                    mini._setMap(control.textName, control.getText(), data);
                } else {
                    data[control.textName] = control.getText();
                }
            }
        }
        return data;
    },
    setData: function (options, all, deep) {
        if (mini.isNull(deep)) deep = true;
        if (typeof options != "object") options = {};
        var map = this.getFieldsMap();
        for (var name in map) {
            var control = map[name];
            if (!control) continue;
            if (control.setValue) {
                var v = options[name];
                if (deep == true) {
                    v = mini._getMap(name, options);
                }
                if (v === undefined && all === false) continue;
                if (v === null) v = "";
                control.setValue(v);
            }
            if (control.setText && control.textName) {
                var text = options[control.textName];
                if (deep == true) {
                    text = mini._getMap(control.textName, options);
                }
                if (mini.isNull(text)) text = "";
                control.setText(text);
            }
        }
        
    },
    reset: function () {
        var controls = this.getFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            if (!control.setValue) continue;
            if (control.setText && control._clearText !== false) {
                var text = control.defaultText;
                if (mini.isNull(text)) text = "";
                control.setText(text);
            }
            control.setValue(control.defaultValue);
            if (control.clear) control.clear();
        }
        this.setIsValid(true);
    },
    clear: function () {
        var controls = this.getFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            if (!control.setValue) continue;
            if (control.setText && control._clearText !== false) {
                control.setText("");
            }
            control.setValue("");
            if (control.clear) control.clear();
        }
        this.setIsValid(true);
    },
    getValidateFields: function (disableValid) {
        function isDisplay(control) {
            return control.isDisplay(function (p) {
                if (mini.hasClass(p, 'mini-tabs-body')) return true;
            });
        }

        var fields = [];
        var controls = this.getFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            if (!control.validate || !control.isDisplay) continue;
            if (isDisplay(control)) { 

                if (control.enabled || disableValid) {

                    fields.push(control);
                }
            }
        }
        return fields;
    },
    validate: function (all, disableValid) {
        var controls = this.getValidateFields(disableValid);
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            var succ = control.validate();
            if (succ == false && all === false) {
                break;
            }
        }
        return this.isValid();
    },
    isValid: function () {
        var controls = this.getValidateFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            if (control.isValid() == false) return false;
        }
        return true;
    },
    setIsValid: function (isValid) {
        var controls = this.getFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            if (!control.setIsValid) continue;
            control.setIsValid(isValid);
        }
    },

    getErrorTexts: function () {
        var errorTexts = [];
        var errors = this.getErrors();
        for (var i = 0, l = errors.length; i < l; i++) {
            var control = errors[i];
            errorTexts.push(control.errorText);
        }
        return errorTexts;
    },
    getErrors: function () {
        var errors = [];
        var controls = this.getFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            if (!control.isValid) continue;
            if (control.isValid() == false) {
                errors.push(control);
            }
        }
        return errors;
    },
    
    mask: function (options) {
        if (typeof options == "string") options = { html: options };
        options = options || {};
        options.el = this.el;
        if (!options.cls) options.cls = this._maskCls;
        mini.mask(options);
    },
    unmask: function () {
        mini.unmask(this.el);
    },
    _maskCls: "mini-mask-loading",
    loadingMsg: "Loading...",
    loading: function (msg) {
        this.mask(msg || this.loadingMsg);
    },
    
    __OnValueChanged: function (e) {

        this._changed = true;
    },
    _changed: false,
    setChanged: function (value) {
        this._changed = value;

        var controls = this.getFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];

            control.on("valuechanged", this.__OnValueChanged, this);
        }
    },
    isChanged: function () {
        return this._changed;
    },
    
    setEnabled: function (value) {
        var controls = this.getFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            control.setEnabled(value);
        }
    },
    initControls: function () {

    },
    initEvents: function () {

    }
});
mini.regClass(mini.DataForm, "dataform");