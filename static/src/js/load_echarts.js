
odoo.define('custom_page.echart', function (require) {

    var AbstractAction = require('web.AbstractAction');
    var core = require('web.core');
    var ajax = require('web.ajax');

    var CustomPageEchart = AbstractAction.extend({
        template: 'custom_page.EchartPage',
        // 需要额外引入的css文件
        cssLibs: [

        ],
        // 需要额外引入的js文件
        jsLibs: [

        ],
        // 事件绑定相关定义
        events: {
            'click #btn1': 'on_btn1_click',
            'change #end_date': 'onDateChange',
        },
        // action的构造器，可以自行根据需求填入需要初始化的数据，比如获取context里的参数，根据条件判断初始化一些变量。
        init: function(parent, context) {
            this._super(parent, context);
            this.dashboard_data = {};
            console.log("in action init!");
            this.echart_option = {
               title: {
                text: 'Sales Count',
                left: 'center'
              },
              tooltip: {
                trigger: 'item'
              },
              series: [
                {
                  name: 'Access From',
                  type: 'pie',
                  radius: '50%',
                  data: [

                  ],
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            };
            this.echart_option3 = {
               title: {
                text: 'Agent saas fee',
                left: 'center'
              },
              tooltip: {
                trigger: 'item'
              },
              series: [
                {
                  name: 'Access From',
                  type: 'pie',
                  radius: '50%',
                  data: [

                  ],
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            };
            this.echart_option4 = {
              tooltip: {
                formatter: '{a} <br/>{b} : {c}%'
              },
              title: {
                text: 'record count',
                left: 'center'
              },
              series: [
                {

                  type: 'gauge',
                  detail: {
                    formatter: '{value}'
                  },
                  data: [
                    {
                      value: 0,
                    }
                  ]
                }
              ]
            };

        },
        // willStart是执行介于init和start中间的一个异步方法，一般会执行向后台请求数据的请求，并储存返回来的数据。
        // 其中ajax.loadLibs(this)会帮加载定义在cssLibs，jsLibs的js组件。
        willStart: function() {
            var self = this;

//            self.render_ul();
            return $.when(ajax.loadLibs(this), this._super()).then(function() {
                console.log("in action willStart!");
            });
        },
        // start方法会在渲染完template后执行，此时可以做任何需要处理的事情。
        // 比如根据willStart返回来数据，初始化引入的第三方js库组件
        start: function() {
            var self = this;
            console.log("in action start!");

            var from = new Date();
            var from = from.getTime();
            this.load_data(from-20*24*60*60*1000, from);
            self.render_chart();


        },
        render_chart: function() {
            var el = this.$el.find('#app1')[0];
            this.myChart = echarts.init(el);
            this.myChart.setOption(this.echart_option);

            var el3 = this.$el.find('#app3')[0];
            this.myChart3 = echarts.init(el3);
            this.myChart3.setOption(this.echart_option3);

            var el4 = this.$el.find('#app4')[0];
            this.myChart4 = echarts.init(el4);
            this.myChart4.setOption(this.echart_option4);

        },
        on_btn1_click: function(event) {
            console.log('on_btn1_click!');
            var self = this;
            return this._rpc({
                route: '/custom_page/data/',
                params: {},
            }).then(function(result) {
                console.log(result);
                var data = result;
                self.echart_option.series[0].data = data['data'];
                self.myChart.setOption(self.echart_option, true);

                self.echart_option.series[0].data = data['agent_saas_fee_data'];
                self.myChart3.setOption(self.echart_option3, true);
            });
        },
        onDateChange: function(event) {

            console.log('on change  on end_date!');
            console.log(event.target.value);

            var from = document.getElementById('start_date').valueAsNumber;
            var end = document.getElementById('end_date').valueAsNumber;

            console.log(from);
            console.log(end);

            console.log(from < end);
            if (from >= end)
            {
                alert("from date can not be larger than end date!")
            }else{
                this.load_data(from, end);
            }
            //Return the result of the comparison

        },
//        render_ul: function() {
//            var self = this;
//            var template = "custom_page.EchartPage2"
//            $('.container-fluid').append(core.qweb.render(template, {widget: self}));
//        },

        load_data: function (start,end) {
           console.log("load data!!!!");
           console.log("start :%s,end: %s",start,end);
           var self = this;
           this._rpc({
                route: '/custom_page/data/',
                params: {'start_time': parseInt(start),
                         'end_time': parseInt(end)},
           }).then(function(result) {
                console.log(result);
                var data = result;
                self.echart_option.series[0].data = data['data'];
                self.myChart.setOption(self.echart_option, true);

                self.echart_option3.series[0].data = data['agent_saas_fee_data'];
                self.myChart3.setOption(self.echart_option3, true);

                self.echart_option4.series[0].data[0].value = data['record_count'];
                self.myChart4.setOption(self.echart_option4, true);


                 for(i=0;i<data['data'].length;i++){
                    $('#body1').append( '<tr><th scope="row">'+i+ '</th><td>'  +  data['data'][i].name +'</td><td>'+data['data'][i].value + '</td></tr>' );
                }
           });
        },

    });

    core.action_registry.add('custom_page.echart', CustomPageEchart);

    return CustomPageEchart;

});