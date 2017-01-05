define(['jquery'],function ($){
	// alert("errroorrr加载");
    $(document).on('ajaxError',function(event, xhr, settings, thrownError) {
        /* Stuff to do when an AJAX call returns an error */

        if(xhr.status>=500){
            showErrorPage("error-server","服务器出错……");
        }
        else if(xhr.status==404){
            showErrorPage("error-404","页面不存在，请检查请求地址是否有误……");
        }
        else if(xhr.status==408){
            showErrorPage("error-network","您的网络有点慢，请稍后再试……");
        }
        else{
            showErrorPage("error-timeout","响应超时，稍后再试……");
        }

        function showErrorPage(typeClass, words){
            var img = document.createElement("div");
            $(img).addClass('page-error '+typeClass);   
            $(".loadingBg").html(img);
            $(img).after("<div style='margin-top:35px'>" + words+ "</div>");
        }

        $(".top-nav .back").click(function(){

            if(Zepto.os.android) {
                myJsObject.backNativePage();
            }else if(Zepto.os.ios){
                window.location="objc://"+"doFunc1"+"/"+"back";
            }

        });

    });
    var ajaxTimeout = 5000;

    return {ajaxTimeout:ajaxTimeout}
});