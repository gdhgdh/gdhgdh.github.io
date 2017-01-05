// avalon.config.debug = false;


require.config({
   // baseUrl : 'js',
    paths : {
        //第三方基础库
        // 'zepto' : 'lib/zepto/zepto.min.cmd',
        // 'avalon' : 'lib/avalon/avalon.mobile.min',
        'jquery': 'jquery.min',

        // 公用
        'md5' : 'util/md5.amd',
        'base64': 'util/base64',
        'encryp' : 'util/encryp',
        // 'generateSign' : 'util/generateSignature',
        // 'dropload' : 'util/dropload',
        'error' : 'util/error',
        'config' : 'util/config',
        'cookie' : 'util/cookie',
        'common' : 'util/common',



        // 业务模块
        'test' : 'util/test',
        'merchant_st_list' : 'settlement/merchant_settlement_list',
        'merchant_st_bill' : 'settlement/merchant_settlement_bill',
        'merchant_st_list2' : 'settlement/merchant_settlement_list2',   // 临时功能
        'merchant_st_bill2' : 'settlement/merchant_settlement_bill2',
        //插件
        // 'swiper' : 'util/swiper.min',
        // 'skuModule' : 'util/skuModule',
        // 'selectCity' : "util/selectCity"
        'mock' : 'plugins/mock-min'
    }
});





