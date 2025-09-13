import React, { useState } from 'react';
import ApiService from '../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara do CPF
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({
      ...prev,
      cpf: formatted
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cpf || !formData.senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(formData.cpf, formData.senha);
      onLogin(response.user);
    } catch (error) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-text">PeerBR</span>
          </div>
          <h1>Seja bem-vindo!</h1>
          <p>Faça Login ou Cadastre-se</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="cpf" className="form-label">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="Digite o CPF"
              className="form-input"
              maxLength="14"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha com números, letras"
              className="form-input"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Lembrar meu usuário
            </label>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>

          <div className="login-links">
            <a href="#" className="link">CADASTRE-SE</a>
            <a href="#" className="link">ESQUECI A SENHA</a>
          </div>
        </form>

        <div className="login-features">
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <div className="feature-content">
              <h3>Acesso simplificado à Renda Fixa</h3>
              <p>Revolucionamos a forma de investir em Renda Fixa, ampliando o acesso a investimentos seguros e com alta rentabilidade.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">✓</div>
            <div className="feature-content">
              <h3>Transparência em cada passo</h3>
              <p>Nossa equipe seleciona os melhores ativos com análise jurídica rigorosa.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">📋</div>
            <div className="feature-content">
              <h3>Plataforma regulada pela CVM</h3>
              <p>Plataforma de crowdfunding conforme CVM nº 88/2022, facilitando investimentos rentáveis em Renda Fixa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

