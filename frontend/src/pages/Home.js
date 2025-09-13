import React, { useState, useEffect } from 'react';
import InvestmentCard from '../components/InvestmentCard';
import ApiService from '../services/api';
import './Home.css';

const Home = () => {
  const [investments, setInvestments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadInvestments();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const [categoriesData, saldoData] = await Promise.all([
        ApiService.getCategories(),
        ApiService.getSaldo()
      ]);
      
      setCategories(categoriesData);
      setSaldo(saldoData.saldo);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getInvestments(selectedCategory);
      setInvestments(data);
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
      alert('Erro ao carregar investimentos');
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (investmentId, valor) => {
    try {
      await ApiService.investir(investmentId, valor);
      // Recarregar saldo após investimento
      const saldoData = await ApiService.getSaldo();
      setSaldo(saldoData.saldo);
      // Recarregar investimentos para atualizar valores captados
      loadInvestments();
    } catch (error) {
      throw error;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-content">
          <h1>Investimentos Disponíveis</h1>
          <div className="saldo-display">
            <span className="saldo-label">Saldo Disponível:</span>
            <span className="saldo-value">{formatCurrency(saldo)}</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="category-filter">Filtrar por categoria:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="investments-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando investimentos...</p>
          </div>
        ) : investments.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum investimento encontrado</h3>
            <p>Não há investimentos disponíveis para a categoria selecionada.</p>
          </div>
        ) : (
          <div className="investments-grid">
            {investments.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                onInvest={handleInvest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

