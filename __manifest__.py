# -*- coding: utf-8 -*-
{
    'name': '引入echarts样式',
    'version': '1.0',
    'category': '引入echarts样式',
    'summary': '引入echarts样式',
    'author': 'Qin',
    'depends': ['base', 'web'],
    'data': [
        'views/home_view.xml',
        'views/sale_order.xml',
    ],

    'qweb': [
        'static/src/xml/load_echarts2.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
}
