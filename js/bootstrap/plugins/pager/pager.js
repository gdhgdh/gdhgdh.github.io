
var MyPagerClass = {
    create: function () {
        return function () { }
    }
}
var MyPager = MyPagerClass.create();
MyPager.prototype = {
    _PageBtnLoad: function (data) {
        var pageIndex = parseInt(data.PageIndex);
        var pageCount = parseInt(data.PageCount);
        //                alert(pageIndex);
        var cntn = $(".dvPager .dvPagerBtnList .pagination");
        cntn.html("");
        if (pageIndex == 1 || pageCount == 0) {
            cntn.append("<li class='disabled'><a class='aBtn'>&laquo;</a></li>");

        } else {
            cntn.append("<li><a class='aBtn enabled'  type='pre' pIndex='" + (pageIndex - 1) + "'>&laquo;</a></li>");

        }

        //总页数小于10时---------------------------------
        if (pageCount > 0 && pageCount < 11) {
            for (var i = 1; i < pageCount + 1; i++) {
                if (i == pageIndex) {
                    cntn.append("<li class='active'><a class='aBtn'>" + i + "</a></li>");
                } else {
                    cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + i + "'>" + i + "</a></li>");
                }
            }
        }
        //总页数大于10时---------------------------------
        if (pageCount > 10) {
            if (pageIndex < 6) {
                for (i = 1; i < pageIndex + 1; i++) {
                    if (i == pageIndex) {
                        cntn.append("<li class='active'><a class='aBtn'>" + i + "</a></li>");
                    } else {
                        cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + i + "'>" + i + "</a></li>");
                    }
                }
                for (i = 1; i < 4; i++) {
                    cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + (pageIndex + i) + "'>" + (pageIndex + i) + "</a></li>");
                }
                cntn.append("<li><a class='omitBtn'>...</a></li>");
                cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + pageCount + "'>" + pageCount + "</a></li>");
            }
            if (pageIndex > 5 & pageIndex < pageCount - 4) {
                cntn.append("<li><a class='aBtn enabled' type='num' pIndex='1'>1</a></li>");
                cntn.append("<li><a class='omitBtn'>...</a></li>");

                for (i = 3; i > 0; i--) {
                    cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + (pageIndex - i) + "'>" + (pageIndex - i) + "</a></li>");
                }

                cntn.append("<li class='active'><a class='aBtn'>" + pageIndex + "</a></li>");

                for (i = 1; i < 4; i++) {
                    cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + (pageIndex + i) + "'>" + (pageIndex + i) + "</a></li>");
                }
                cntn.append("<li><a class='omitBtn'>...</a></li>");
                cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + pageCount + "'>" + pageCount + "</a></li>");

            }
            if (pageIndex > pageCount - 5) {
                cntn.append("<li><a class='aBtn enabled' type='num' pIndex='1'>1</a></li>");
                cntn.append("<li><a class='omitBtn'>...</a></li>");

                for (i = 3; i > 0; i--) {
                    cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + (pageIndex - i) + "'>" + (pageIndex - i) + "</a></li>");
                }

                cntn.append("<li class='active'><a class='aBtn'>" + pageIndex + "</a></li>");

                for (i = pageIndex; i < pageCount; i++) {
                    cntn.append("<li><a class='aBtn enabled' type='num' pIndex='" + (i + 1) + "'>" + (i + 1) + "</a></li>");
                }
            }
        }

        if (pageIndex == pageCount || pageCount == 0) {
            cntn.append("<li class='disabled'><a class='aBtn'>&raquo</a></li>");

        } else {
            cntn.append("<li><a class='aBtn enabled' type='next' pIndex='" + (pageIndex + 1) + "'>&raquo;</a></li>");
        }
    },
    Main: function (pData, callback) {
        this._PageBtnLoad(pData);
        $(".dvPager .dvPagerBtnList .pagination a.enabled").die("click").live("click", function () {
            var ctrl = $(this);
//            var type = ctrl.attr("type");
            var pIndex = ctrl.attr("pIndex");
//            alert(pIndex);
//           var data = { PageIndex: pIndex, PageCount: 105 }
            //            PageBtnLoad(data);
            callback(pIndex);
//            callback(pIndex, function (retData) {
//               if (retData!="null") {
//                   new MyPager()._PageBtnLoad(retData);
//               }
//           });
        });
    }
}