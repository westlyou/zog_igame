# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models


class GameRound(models.Model):
    _inherit = "og.round"
    table_ids = fields.Many2many('og.table', compute='_compute_table')

    @api.multi
    def _compute_table(self):
        for rec in self:
            matchs = rec.match_ids
            open  = matchs.mapped('open_table_id')
            close = matchs.mapped('close_table_id')
            rec.table_ids = open | close

    state = fields.Selection([
        ('draft',  'Draft'),
        ('todo',  'Todo'),
        ('doing', 'Doing'),
        ('done',  'Done'),
        ('cancel', 'Cancelled')
    ], string='Status', compute='_compute_state')

    @api.multi
    def _compute_state(self):
        for rec in self:
            rec.state = rec._get_state()

    def _get_state(self):
        ts = self.table_ids
        if not ts:
            return 'draft'
        
        tts = ts.filtered(lambda t: t.state not in ['done','cancel'])
        if not tts:
            return 'done'
        
        tts = ts.filtered(lambda t: t.state in ['doing'])
        return tts and 'doing' or 'todo'



class Table(models.Model):
    _inherit = "og.table"

    board_ids = fields.One2many('og.board', 'table_id', string='Boards')
    
    state = fields.Selection([
        ('draft',  'Draft'),
        ('todo',  'Todo'),
        ('doing', 'Doing'),
        ('done',  'Done'),
        ('cancel', 'Cancelled')
    ], string='Status', compute='_compute_state')

    @api.multi
    def _compute_state(self):
        for rec in self:
            rec.state = rec._get_state()

    def _get_state(self):
        bd_num = self.board_ids.mapped('number')
        dl_num = self.deal_ids.mapped('number')

        if not dl_num:
            return 'draft'

        if not bd_num:
            return 'todo'
        
        bd_num = list(set(bd_num))
        dl_num = list(set(dl_num))
        
        list.sort(bd_num)
        list.sort(dl_num)
        
        if cmp(dl_num, bd_num) > 0:
            return bd_num and 'doing' or 'todo'
        
        bd = self.board_ids.filtered(lambda bd: bd.state not in ['done','cancel'])
        return bd and 'doing' or 'done'

            
    
    """ 
    
    @api.multi
    def _compute_board(self):
        for rec in self:
            rec.board_id = rec._get_board()
    
    def _get_board(self):
        bd = self.board_ids.filtered(lambda bd: bd.state not in ['done','cancel'])
        if bd:
            return bd[0]
        
        numbers = self.board_ids.mapped('number')
        deal_no = numbers and max(numbers) or 0
        deals = self.deal_ids.filtered(lambda deal: deal.number > deal_no).sorted('number')
        if not deals:
            return self.env['og.board']
        deal = deals[0]
        return self.env['og.board'].create({'deal_id': deal.id, 'table_id':self.id})

    """
