from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.investment import Investment, UserInvestment, InvestmentCategory, InvestmentStatus
from app.models.user import User, Transaction, TransactionType, TransactionStatus
from app.models import db
import qrcode
import io
import base64
import uuid
from datetime import datetime

investments_bp = Blueprint('investments', __name__)

@investments_bp.route('/api/investments', methods=['GET'])
@jwt_required()
def get_investments():
    """Lista todos os investimentos disponíveis"""
    try:
        categoria = request.args.get('categoria')
        
        query = Investment.query
        
        if categoria:
            try:
                categoria_enum = InvestmentCategory(categoria)
                query = query.filter_by(categoria=categoria_enum)
            except ValueError:
                return jsonify({'error': 'Categoria inválida'}), 400
        
        investments = query.all()
        return jsonify([investment.to_dict() for investment in investments])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/api/investments/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Lista todas as categorias de investimento"""
    try:
        categories = [
            {
                'value': category.value,
                'label': category.value.replace('_', ' ').title()
            }
            for category in InvestmentCategory
        ]
        return jsonify(categories)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/api/saldo', methods=['GET'])
@jwt_required()
def get_saldo():
    """Retorna o saldo do usuário logado"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify({'saldo': float(user.saldo)})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/api/depositar', methods=['POST'])
@jwt_required()
def depositar():
    """Adiciona saldo ao usuário logado (após aprovação)"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or 'valor' not in data:
            return jsonify({'error': 'Valor é obrigatório'}), 400
        
        valor = float(data['valor'])
        
        if valor <= 0:
            return jsonify({'error': 'Valor deve ser positivo'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        # Criar transação de depósito
        transaction = Transaction(
            user_id=user_id,
            tipo=TransactionType.DEPOSITO,
            valor=valor,
            status=TransactionStatus.PENDENTE,
            descricao=f'Depósito de R$ {valor:.2f}'
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'message': 'Depósito registrado. Aguardando aprovação.',
            'transaction_id': transaction.id
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/api/gerar_pix', methods=['POST'])
@jwt_required()
def gerar_pix():
    """Gera dados PIX para depósito"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or 'valor' not in data:
            return jsonify({'error': 'Valor é obrigatório'}), 400
        
        valor = float(data['valor'])
        
        if valor <= 0:
            return jsonify({'error': 'Valor deve ser positivo'}), 400
        
        # Dados bancários simulados
        dados_bancarios = {
            'favorecido': 'PeerBR Investimentos LTDA',
            'cnpj': '12.345.678/0001-90',
            'banco': '341 - Itaú Unibanco S.A.',
            'agencia': '1234',
            'conta': '12345-6',
            'chave_pix': 'pix@peerbr.com.br'
        }
        
        # Gerar ID único para o PIX
        pix_id = str(uuid.uuid4())
        
        # Criar string para QR Code (simulado)
        pix_string = f"00020126580014BR.GOV.BCB.PIX0136{dados_bancarios['chave_pix']}520400005303986540{valor:.2f}5802BR5925{dados_bancarios['favorecido']}6009SAO PAULO62070503***6304"
        
        # Gerar QR Code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(pix_string)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Converter para base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        # Criar transação PIX
        transaction = Transaction(
            user_id=user_id,
            tipo=TransactionType.DEPOSITO,
            valor=valor,
            status=TransactionStatus.PENDENTE,
            descricao=f'Depósito PIX de R$ {valor:.2f}',
            pix_id=pix_id,
            pix_qr_code=qr_code_base64
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'pix_id': pix_id,
            'dados_bancarios': dados_bancarios,
            'qr_code': qr_code_base64,
            'valor': valor,
            'transaction_id': transaction.id
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/api/investir/<int:investment_id>', methods=['POST'])
@jwt_required()
def investir(investment_id):
    """Aplica saldo em um investimento"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or 'valor' not in data:
            return jsonify({'error': 'Valor é obrigatório'}), 400
        
        valor = float(data['valor'])
        
        if valor <= 0:
            return jsonify({'error': 'Valor deve ser positivo'}), 400
        
        # Buscar usuário e investimento
        user = User.query.get(user_id)
        investment = Investment.query.get(investment_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        if not investment:
            return jsonify({'error': 'Investimento não encontrado'}), 404
        
        # Validações
        if investment.status != InvestmentStatus.DISPONIVEL:
            return jsonify({'error': 'Investimento não está disponível'}), 400
        
        if valor < investment.valor_minimo:
            return jsonify({'error': f'Valor mínimo para este investimento é R$ {investment.valor_minimo:.2f}'}), 400
        
        if not user.debitar_saldo(valor):
            return jsonify({'error': 'Saldo insuficiente'}), 400
        
        # Criar aplicação
        user_investment = UserInvestment(
            user_id=user_id,
            investment_id=investment_id,
            valor_aplicado=valor
        )
        
        # Atualizar valor captado do investimento
        investment.valor_captado += valor
        
        # Criar transação de investimento
        transaction = Transaction(
            user_id=user_id,
            tipo=TransactionType.INVESTIMENTO,
            valor=valor,
            status=TransactionStatus.APROVADO,
            descricao=f'Investimento em {investment.titulo}',
            data_aprovacao=datetime.utcnow()
        )
        
        db.session.add(user_investment)
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'message': 'Investimento realizado com sucesso',
            'investment': user_investment.to_dict(),
            'saldo_restante': float(user.saldo)
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/api/meus_investimentos', methods=['GET'])
@jwt_required()
def meus_investimentos():
    """Lista os investimentos do usuário logado"""
    try:
        user_id = int(get_jwt_identity())
        
        user_investments = db.session.query(UserInvestment, Investment).join(
            Investment, UserInvestment.investment_id == Investment.id
        ).filter(UserInvestment.user_id == user_id).all()
        
        result = []
        for user_inv, investment in user_investments:
            investment_data = investment.to_dict()
            investment_data['valor_aplicado'] = float(user_inv.valor_aplicado)
            investment_data['data_aplicacao'] = user_inv.data_aplicacao.isoformat()
            result.append(investment_data)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@investments_bp.route('/api/transacoes', methods=['GET'])
@jwt_required()
def get_transacoes():
    """Lista as transações do usuário logado"""
    try:
        user_id = int(get_jwt_identity())
        
        transactions = Transaction.query.filter_by(user_id=user_id).order_by(
            Transaction.data_criacao.desc()
        ).all()
        
        return jsonify([transaction.to_dict() for transaction in transactions])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

