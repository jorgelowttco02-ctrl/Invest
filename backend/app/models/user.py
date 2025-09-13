from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from enum import Enum
from decimal import Decimal
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.types import DECIMAL
from app.models import db

class TransactionType(Enum):
    DEPOSITO = "deposito"
    INVESTIMENTO = "investimento"
    RESGATE = "resgate"

class TransactionStatus(Enum):
    PENDENTE = "pendente"
    APROVADO = "aprovado"
    REJEITADO = "rejeitado"

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
    saldo = db.Column(DECIMAL(15, 2), default=0, nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    
    # Relacionamentos
    investimentos = db.relationship('UserInvestment', backref='user', lazy=True)
    transacoes = db.relationship('Transaction', backref='user', lazy=True)
    
    def set_password(self, password):
        self.senha_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.senha_hash, password)
    
    def adicionar_saldo(self, valor):
        """Adiciona valor ao saldo do usuário"""
        self.saldo += valor
        return self.saldo
    
    def debitar_saldo(self, valor):
        """Debita valor do saldo do usuário se houver saldo suficiente"""
        if self.saldo >= valor:
            self.saldo -= valor
            return True
        return False
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'cpf': self.cpf,
            'email': self.email,
            'nome': self.nome,
            'saldo': float(self.saldo),
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'ativo': self.ativo
        }

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tipo = db.Column(db.Enum(TransactionType), nullable=False)
    valor = db.Column(DECIMAL(15, 2), nullable=False)
    status = db.Column(db.Enum(TransactionStatus), default=TransactionStatus.PENDENTE)
    descricao = db.Column(db.String(255), nullable=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_aprovacao = db.Column(db.DateTime, nullable=True)
    
    # Campos específicos para PIX
    pix_id = db.Column(db.String(100), nullable=True)
    pix_qr_code = db.Column(db.Text, nullable=True)
    
    def __repr__(self):
        return f'<Transaction {self.id} - {self.tipo.value}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'tipo': self.tipo.value if self.tipo else None,
            'valor': float(self.valor),
            'status': self.status.value if self.status else None,
            'descricao': self.descricao,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_aprovacao': self.data_aprovacao.isoformat() if self.data_aprovacao else None,
            'pix_id': self.pix_id,
            'pix_qr_code': self.pix_qr_code
        }

