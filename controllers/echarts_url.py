#!/usr/bin/env python
# coding=utf-8

from odoo import http
from odoo.http import request
import time
import datetime
import json
from odoo import api
from odoo.tools import misc
import random
import logging
_logger = logging.getLogger(__name__)



class Academy(http.Controller):
    # 创建接口测试

    @http.route('/method/echarts/api', auth='public', type='http', methods=['POST', 'GET'], csrf=False)
    def method_echarts_api(self):
        _logger.info('调用echarts成功！')
        order_count_list = []
        complaint_orders_obj = http.request.env['linxun.complaint_case']
        # 获取本月一号
        first_day_this_month_tmp = datetime.date.today().replace(day=1)
        first_day_this_month = datetime.datetime.strftime(first_day_this_month_tmp, '%Y-%m-%d')
        for r in range(1, 10):
            o_count = complaint_orders_obj.sudo().search_count([('complaint_reason','=', r),('created_at','>=',first_day_this_month)])
            order_count_list.append(o_count)
        data_list = order_count_list
        return json.dumps([])

    @http.route(['/custom_page/data'], auth='public', type='json', methods=['GET', 'POST'])
    def index(self, **kw):
        x_data = ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        y_data = list(range(10000))
        random.shuffle(x_data)
        return {
            'x_data': x_data,
            'y_data': random.choices(y_data, k=len(x_data)),
        }