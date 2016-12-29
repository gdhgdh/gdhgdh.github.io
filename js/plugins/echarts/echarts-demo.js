$(function () {

    _erp.Ajax.Get("/JiCaiOrderGetAjax/JiCaiIndexLoad", "", function (retData) {
        var mapChart = echarts.init(document.getElementById("echarts-map-chart"));
        var mapoption = {
            title: {
                text: '蜘点集团仓库分布图',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                //                data: ["省仓", "综合仓", "线下店"]
                data: ["省仓库存"]
            },
            dataRange: {
                min: 0,
                max: 10000,
                x: 'left',
                y: 'bottom',
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true
            },
            toolbox: {
                show: false,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            roamController: {
                show: false,
                x: 'right',
                mapTypeControl: {
                    'china': true
                }
            },
            series: [
            {
                name: '省仓库存',
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle: {
                    normal: { label: { show: true } },
                    emphasis: { label: { show: true } }
                },
                data: retData
//                    data: [
//                        { name: '北京', value: Math.round(Math.random() * 1000) },
//                        { name: '天津', value: Math.round(Math.random() * 1000) },
//                        { name: '上海', value: Math.round(Math.random() * 1000) },
//                        { name: '重庆', value: Math.round(Math.random() * 1000) },
//                        { name: '河北', value: Math.round(Math.random() * 1000) },
//                        { name: '河南', value: Math.round(Math.random() * 1000) },
//                        { name: '云南', value: Math.round(Math.random() * 1000) },
//                        { name: '辽宁', value: Math.round(Math.random() * 1000) },
//                        { name: '黑龙江', value: Math.round(Math.random() * 1000) },
//                        { name: '湖南', value: Math.round(Math.random() * 1000) },
//                        { name: '安徽', value: Math.round(Math.random() * 1000) },
//                        { name: '山东', value: Math.round(Math.random() * 1000) },
//                        { name: '新疆', value: Math.round(Math.random() * 1000) },
//                        { name: '江苏', value: Math.round(Math.random() * 1000) },
//                        { name: '浙江', value: Math.round(Math.random() * 1000) },
//                        { name: '江西', value: Math.round(Math.random() * 1000) },
//                        { name: '湖北', value: Math.round(Math.random() * 1000) },
//                        { name: '广西', value: Math.round(Math.random() * 1000) },
//                        { name: '甘肃', value: Math.round(Math.random() * 1000) },
//                        { name: '山西', value: Math.round(Math.random() * 1000) },
//                        { name: '内蒙古', value: Math.round(Math.random() * 1000) },
//                        { name: '陕西', value: Math.round(Math.random() * 1000) },
//                        { name: '吉林', value: Math.round(Math.random() * 1000) },
//                        { name: '福建', value: Math.round(Math.random() * 1000) },
//                        { name: '贵州', value: Math.round(Math.random() * 1000) },
//    //                    {name: '广东',value: Math.round(Math.random()*1000)},
//                        { name: '广东', value: Math.round(Math.random() * 1000), Id: "gd" },
//                        { name: '青海', value: Math.round(Math.random() * 1000) },
//                        { name: '西藏', value: Math.round(Math.random() * 1000) },
//                        { name: '四川', value: Math.round(Math.random() * 1000) },
//                        { name: '宁夏', value: Math.round(Math.random() * 1000) },
//                        { name: '海南', value: Math.round(Math.random() * 1000) },
//                        { name: '台湾', value: Math.round(Math.random() * 1000) },
//                        { name: '香港', value: Math.round(Math.random() * 1000) },
//                        { name: '澳门', value: Math.round(Math.random() * 1000) }
//                    ]
            }
//    ,
//                {
//                    name: '综合仓',
//                    type: 'map',
//                    mapType: 'china',
//                    itemStyle: {
//                        normal: { label: { show: true } },
//                        emphasis: { label: { show: true } }
//                    },
//                    data: [
//                        { name: '北京', value: Math.round(Math.random() * 1000) },
//                        { name: '天津', value: Math.round(Math.random() * 1000) },
//                        { name: '上海', value: Math.round(Math.random() * 1000) },
//                        { name: '重庆', value: Math.round(Math.random() * 1000) },
//                        { name: '河北', value: Math.round(Math.random() * 1000) },
//                        { name: '安徽', value: Math.round(Math.random() * 1000) },
//                        { name: '新疆', value: Math.round(Math.random() * 1000) },
//                        { name: '浙江', value: Math.round(Math.random() * 1000) },
//                        { name: '江西', value: Math.round(Math.random() * 1000) },
//                        { name: '山西', value: Math.round(Math.random() * 1000) },
//                        { name: '内蒙古', value: Math.round(Math.random() * 1000) },
//                        { name: '吉林', value: Math.round(Math.random() * 1000) },
//                        { name: '福建', value: Math.round(Math.random() * 1000) },
//                        { name: '广东', value: Math.round(Math.random() * 1000) },
//                        { name: '西藏', value: Math.round(Math.random() * 1000) },
//                        { name: '四川', value: Math.round(Math.random() * 1000) },
//                        { name: '宁夏', value: Math.round(Math.random() * 1000) },
//                        { name: '香港', value: Math.round(Math.random() * 1000) },
//                        { name: '澳门', value: Math.round(Math.random() * 1000) }
//                    ]
//                },
//                {
//                    name: '线下店',
//                    type: 'map',
//                    mapType: 'china',
//                    itemStyle: {
//                        normal: { label: { show: true } },
//                        emphasis: { label: { show: true } }
//                    },
//                    data: [
//                        { name: '北京', value: Math.round(Math.random() * 1000) },
//                        { name: '天津', value: Math.round(Math.random() * 1000) },
//                        { name: '上海', value: Math.round(Math.random() * 1000) },
//                        { name: '广东', value: Math.round(Math.random() * 1000) },
//                        { name: '台湾', value: Math.round(Math.random() * 1000) },
//                        { name: '香港', value: Math.round(Math.random() * 1000) },
//                        { name: '澳门', value: Math.round(Math.random() * 1000) }
//                    ]
//                }
            ]
        };
        mapChart.setOption(mapoption);
        $(window).resize(mapChart.resize);

        mapChart.on('click', function (params) {
            var provinceCode = params.data.Code;
            if (!provinceCode) {
                mini.alert("该省份不存在任何库存！");
                return;
            }
            var provinceName = params.data.name;
           
        
            window.parent.CreateMenuItem("/JiCaiOrder/StorageView?provinceCode="+provinceCode,provinceName+ "省仓库统计", false);
        });
    }, true);

 
});
