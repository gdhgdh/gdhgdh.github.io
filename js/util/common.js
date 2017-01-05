define(['jquery','error','config','cookie', 'encryp'],function ($, error, config, cookie, encryp){

// $(document).ajaxSend(function(event,xhr,options){
//     console.log("before ajxa send..")
//     console.log(options)
// })
$.ajaxSetup({
    processData: false,
    beforeSend: function(xhr, settings){
        console.log(xhr)
        // if (settings.data.pageIndex != undefined) {settings.data.pageIndex++;}
        settings.data.userId = 1;
        settings.data = "jsonString="+encryp(settings.data);
        console.log(settings)

    }
})
        //清除loading
        var removeLoading = function(){
            $(".loadingBg").remove();
            $("body").removeAttr("style");
        };

        //超时提示
        var errMsg = function(){

                $(".loadingBg").html("<div style='margin-top:50%'>数据出错, 请稍后再试……</div>");

        };


        /* 从URL字符串中取参*/
        var getQueryString = function(para){
            var str = window.location.search;
            if (str.indexOf(para)!=-1){
                var pos_start=str.indexOf(para)+para.length+1;
                var pos_end=str.indexOf("&",pos_start);
                if (pos_end==-1){
                    return str.substring(pos_start);
                }else{
                    return str.substring(pos_start,pos_end);
                }
            }

        };


        /*表单验证 start

            一个form里面多个元素验证，以数组方式存放配置数据，
            其中每个对象包含以下配置属性：
            value,          reg,    tipLabel,        tip
            监控对象的值，匹配规则，DOM提示载体ID，提示信息
            example:
            var validateData = [
            {value: vm2.name,
             reg: /^[0-9a-zA-Z\u4e00-\u9fa5]{2,15}$/,
             tipLabel: "checktip_name",
             tip: "2到15位中文或英文字母或数字"
            },{},{}];
        */

         function validateForm(dataArray){
            var result = true,isValid=[];
            for(var i in dataArray )
            {
                isValid[i] = validateFormElement(dataArray[i]);
                result = result && isValid[i];
            }
            return result;

        }
        // 监控对象的值，匹配规则，提示载体，提示信息
        function validateFormElement(o){//value,reg,tipLabel,tip
            var exp = new RegExp(o.reg);
            var re = exp.test(o.value);
            if(!re) {$("#"+o.tipLabel).show().text(o.tip); } 
            else {$("#"+o.tipLabel).hide();}
           
         return re;
        }

      // 表单验证end

    // };

        // 固定底部导航菜单，idx从0开始
        function renderMenu(idx){
            var html =  '<div style="height:50px"></div>' +
                '<ul class="menu">' +
                    '<li id="menu_index"><p>&#xe608;</p>首页</li>' +
                    '<li id="menu_cate"><p>&#xe606;</p>分类</li>' + 
                    // '<li id="menu_o2o"><p>&#xe605;</p>生活发现</li>' + 
                    '<li id="menu_cart"><p>&#xe60f;</p>购物车</li>' + 
                    '<li id="menu_user"><p>&#xe607;</p>我的</li>' + 
                '</ul>';
            $('body').append(html);
            $("ul.menu>li").eq(idx).addClass('on');
            $("li#menu_index").bind('click', function() {   postForm(ctx + '/index/indexPage','post');  });
            $("li#menu_cate").bind('click', function() {   postForm(ctx + '/category/categoryPage','post', {parentId:0});  });
            $("li#menu_cart").bind('click', function() {   postForm(ctx + '/cart/listCart2','post');  });
            $("li#menu_user").bind('click', function() {   postForm(ctx + '/user/index','post');  });

        }

        /*post方式提交表单*/
        function postForm(actionURL, actionType, map){
            var form = document.createElement("form");
            form.action = actionURL;
            form.method = actionType;
            $('body').prepend(form);
            if(map!= null && typeof map == 'object'){
                for(key in map){
                    var input = document.createElement('input');
                    $(input).attr({
                        name: key,
                        hidden: 'hidden',
                        value: map[key]
                    });
                    $(form).prepend(input);    
                }
            }
            $(form).submit();
        }

        var token = getQueryString("token");

return  {   /*输出接口，首字母排列*/
            ajaxTimeout : error.ajaxTimeout,
            apiUrl : config.apiUrl,         
            // checkLogin : checkLogin,
            cookie : cookie,
            encryp:encryp,
            getQueryString : getQueryString,
            imgServer : config.imgServer,
            postForm : postForm,
            removeLoading : removeLoading,
            renderMenu : renderMenu,
            token : token,
            validateForm : validateForm,
            errMsg : errMsg
        };
});// end of module define
