from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    """Registra um novo usuário"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        required_fields = ['cpf', 'email', 'nome', 'senha']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se usuário já existe
        if User.query.filter_by(cpf=data['cpf']).first():
            return jsonify({'error': 'CPF já cadastrado'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Criar novo usuário
        user = User(
            cpf=data['cpf'],
            email=data['email'],
            nome=data['nome']
        )
        user.set_password(data['senha'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'Usuário criado com sucesso'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/login', methods=['POST'])
def login():
    """Autentica um usuário"""
    try:
        data = request.get_json()
        
        if not data or 'cpf' not in data or 'senha' not in data:
            return jsonify({'error': 'CPF e senha são obrigatórios'}), 400
        
        user = User.query.filter_by(cpf=data['cpf']).first()
        
        if not user or not user.check_password(data['senha']):
            return jsonify({'error': 'CPF ou senha inválidos'}), 401
        
        if not user.ativo:
            return jsonify({'error': 'Usuário inativo'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Retorna o perfil do usuário logado"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify(user.to_dict())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

