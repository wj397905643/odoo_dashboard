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

        start_millise = kw['start_time']
        end_millise = kw['end_time']
        start_time = datetime.datetime.fromtimestamp(start_millise / 1000.0)
        end_time = datetime.datetime.fromtimestamp(end_millise / 1000.0)

        domain = [('sale_order_type', 'in', ['new', 'conversion']),
                  ('create_date', '>=', start_time), ('create_date', '<=', end_time)]
        orders = request.env['sale.order'].sudo().search(domain)
        agent_dict = {}
        agent_saas_fee = {}
        for order in orders:
            if order.x_studio_many2one_field_8mpil.name:
                agent_dict[order.x_studio_many2one_field_8mpil.name] = agent_dict.get(order.x_studio_many2one_field_8mpil.name, 0) + 1;
                subscription_total = 0
                for item in order.order_line:
                    if 'Subscription' in item.name:
                        subscription_total = subscription_total + item.price_total
                agent_saas_fee[order.x_studio_many2one_field_8mpil.name] = agent_saas_fee.get(order.x_studio_many2one_field_8mpil.name, 0) + subscription_total;

        data = []
        for key in agent_dict:
            tmp = {'name': key, 'value': agent_dict[key]}
            data.append(tmp)

        agent_saas_fee_data = []
        for key in agent_saas_fee:
            tmp = {'name': key, 'value': agent_saas_fee[key]}
            agent_saas_fee_data.append(tmp)
        return {
            'data': data,
            'agent_saas_fee_data': agent_saas_fee_data,
            'record_count': len(orders)
        }