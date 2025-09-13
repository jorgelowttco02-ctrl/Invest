const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Autenticação
  async login(cpf, senha) {
    const data = await this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ cpf, senha }),
    });
    
    if (data.access_token) {
      this.setToken(data.access_token);
    }
    
    return data;
  }

  async register(userData) {
    return this.request('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/api/profile');
  }

  // Investimentos
  async getInvestments(categoria = null) {
    const params = categoria ? `?categoria=${categoria}` : '';
    return this.request(`/api/investments${params}`);
  }

  async getCategories() {
    return this.request('/api/investments/categories');
  }

  async investir(investmentId, valor) {
    return this.request(`/api/investir/${investmentId}`, {
      method: 'POST',
      body: JSON.stringify({ valor }),
    });
  }

  async getMeusInvestimentos() {
    return this.request('/api/meus_investimentos');
  }

  // Saldo e transações
  async getSaldo() {
    return this.request('/api/saldo');
  }

  async depositar(valor) {
    return this.request('/api/depositar', {
      method: 'POST',
      body: JSON.stringify({ valor }),
    });
  }

  async gerarPix(valor) {
    return this.request('/api/gerar_pix', {
      method: 'POST',
      body: JSON.stringify({ valor }),
    });
  }

  async getTransacoes() {
    return this.request('/api/transacoes');
  }

  logout() {
    this.setToken(null);
  }
}

export default new ApiService();

