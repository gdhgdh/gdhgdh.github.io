/**
 * 弹窗选择 回显value和text			
 * @param {mini control} sender        - 按钮输入框对象
 * @param {obj}          retData       - 返回数据
 * @param {string}       retValueField - 返回数据中要赋给value的字段名
 * @param {string}       retTextField  - 返回数据中要赋给text的字段名
 */
function setButtonEditDataAndState(sender, retData, retValueField, retTextField){
    if (retData !== "close") {
        sender.setValue(retData[retValueField]);
        sender.setText(retData[retTextField]);
        sender.doValueChanged(); // 消除验证警告
        form.setChanged(true);  // 未保存退出警告
    }
}
/**
 * 表单只读
 * @param {boolean} value - true or false
 */
mini.Form.prototype.setReadOnly = function(value){
	    var controls = this.getFields();
	    for (var i = 0, l = controls.length; i < l; i++) {
	        var control = controls[i];
	        control.setReadOnly(value);
	    }
    }
