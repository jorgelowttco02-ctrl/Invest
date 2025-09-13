from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import os

def create_app():
    app = Flask(__name__)
    
    # Configurações
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///investments.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    
    # Inicializar extensões
    from app.models import db
    db.init_app(app)
    
    jwt = JWTManager()
    jwt.init_app(app)
    CORS(app, origins="*")  # Permitir CORS para todas as origens
    
    # Registrar blueprints
    from app.routes.auth import auth_bp
    from app.routes.investments import investments_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(investments_bp)
    
    # Criar tabelas
    with app.app_context():
        db.create_all()
    
    return app

