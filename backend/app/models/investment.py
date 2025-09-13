from datetime import datetime
from enum import Enum
from decimal import Decimal
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.types import DECIMAL
from app.models import db

class InvestmentCategory(Enum):
    DEBENTURES = "debentures"
    CRI = "cri"  # Recebíveis Imobiliários
    CRA = "cra"  # Recebíveis do Agronegócio
    NOTAS_FISCAIS = "notas_fiscais"
    RECEBIVEIS_JUDICIAIS = "recebiveis_judiciais"
    OPERACOES_ESTRUTURADAS = "operacoes_estruturadas"
    PRECATORIOS_FEDERAL = "precatorios_federal"
    PRECATORIOS_ESTADUAL = "precatorios_estadual"
    PRECATORIOS_MUNICIPAL = "precatorios_municipal"

class InvestmentStatus(Enum):
    DISPONIVEL = "disponivel"
    ESGOTADO = "esgotado"

class Investment(db.Model):
    __tablename__ = 'investments'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    categoria = db.Column(db.Enum(InvestmentCategory), nullable=False)
    valor_minimo = db.Column(DECIMAL(15, 2), nullable=False)
    taxa_retorno = db.Column(DECIMAL(5, 2), nullable=False)  # Percentual anual
    prazo = db.Column(db.Integer, nullable=False)  # Prazo em meses
    status = db.Column(db.Enum(InvestmentStatus), default=InvestmentStatus.DISPONIVEL)
    isencao_ir = db.Column(db.Boolean, default=False)
    valor_total = db.Column(DECIMAL(15, 2), nullable=True)
    valor_captado = db.Column(DECIMAL(15, 2), default=0)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_vencimento = db.Column(db.DateTime, nullable=True)
    
    # Relacionamentos
    aplicacoes = db.relationship('UserInvestment', backref='investment', lazy=True)
    
    def __repr__(self):
        return f'<Investment {self.titulo}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'categoria': self.categoria.value if self.categoria else None,
            'valor_minimo': float(self.valor_minimo),
            'taxa_retorno': float(self.taxa_retorno),
            'prazo': self.prazo,
            'status': self.status.value if self.status else None,
            'isencao_ir': self.isencao_ir,
            'valor_total': float(self.valor_total) if self.valor_total else None,
            'valor_captado': float(self.valor_captado),
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_vencimento': self.data_vencimento.isoformat() if self.data_vencimento else None
        }

class UserInvestment(db.Model):
    __tablename__ = 'user_investments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    investment_id = db.Column(db.Integer, db.ForeignKey('investments.id'), nullable=False)
    valor_aplicado = db.Column(DECIMAL(15, 2), nullable=False)
    data_aplicacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<UserInvestment {self.user_id} - {self.investment_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'investment_id': self.investment_id,
            'valor_aplicado': float(self.valor_aplicado),
            'data_aplicacao': self.data_aplicacao.isoformat() if self.data_aplicacao else None
        }

