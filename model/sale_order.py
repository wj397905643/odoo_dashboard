#!/usr/bin/env python
# -*- coding: utf-8 -*-
from odoo import api, models, fields


class SaleOrder(models.Model):
    _inherit = 'sale.order'
    _description = "销售表单中添加百度echarts"



