__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

var bootPATH = __CreateJSPath("boot.js");

//debugger
mini_debugger = true;
var debug = true;
var hash = "";

if (debug) {
    hash = "?" + new Date().getTime();
}

//miniui
document.write('<script src="' + bootPATH + 'jquery.min.js"></script>');
document.write('<script src="' + bootPATH + 'miniui-last/miniui-source.js' + hash + '" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'plugins/contabs.js' + hash + '" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'plugins/layer2.4/layer.js' + hash + '" type="text/javascript" ></sc' + 'ript>');
document.write('<link href="' + bootPATH + 'miniui-last/themes/default/miniui.css' + hash + '" rel="stylesheet" type="text/css" />');
//document.write('<link href="' + bootPATH + 'miniui/themes/blue2010/skin.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'miniui-last/themes/icons.css' + hash + '" rel="stylesheet" type="text/css" />');


var mode = getCookie("miniuiMode");
mode="medium";
if (mode) {
    document.write('<link href="' + bootPATH + 'miniui-last/themes/default/' + mode + '-mode.css' + hash + '" rel="stylesheet" type="text/css" />');
}

//skin
var skin = getCookie("miniuiSkin");
skin = "bootstrap";
if (skin) {
    document.write('<link href="' + bootPATH + 'miniui-last/themes/' + skin + '/skin.css' + hash + '" rel="stylesheet" type="text/css" />');
}

document.write('<link href="' + bootPATH + 'miniui-last/themes/inventory.css' + hash + '" rel="stylesheet" type="text/css" />');


////////////////////////////////////////////////////////////////////////////////////////
function getCookie(sName) {
    var aCookie = document.cookie.split("; ");
    var lastMatch = null;
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0]) {
            lastMatch = aCrumb;
        }
    }
    if (lastMatch) {
        var v = lastMatch[1];
        if (v === undefined) return v;
        return unescape(v);
    }
    return null;
}