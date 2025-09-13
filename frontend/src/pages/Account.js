import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import PixModal from '../components/PixModal';
import './Account.css';

const Account = () => {
  const [user, setUser] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPixModal, setShowPixModal] = useState(false);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setLoading(true);
      const [userData, saldoData, investmentsData, transactionsData] = await Promise.all([
        ApiService.getProfile(),
        ApiService.getSaldo(),
        ApiService.getMeusInvestimentos(),
        ApiService.getTransacoes()
      ]);

      setUser(userData);
      setSaldo(saldoData.saldo);
      setInvestments(investmentsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Erro ao carregar dados da conta:', error);
      alert('Erro ao carregar dados da conta');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeLabel = (type) => {
    const types = {
      'deposito': 'Depósito',
      'investimento': 'Investimento',
      'resgate': 'Resgate'
    };
    return types[type] || type;
  };

  const getTransactionStatusLabel = (status) => {
    const statuses = {
      'pendente': 'Pendente',
      'aprovado': 'Aprovado',
      'rejeitado': 'Rejeitado'
    };
    return statuses[status] || status;
  };

  const calculateTotalInvested = () => {
    return investments.reduce((total, inv) => total + inv.valor_aplicado, 0);
  };

  const handlePixSuccess = () => {
    setShowPixModal(false);
    loadAccountData(); // Recarregar dados após depósito
  };

  if (loading) {
    return (
      <div className="account-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados da conta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>Minha Conta</h1>
        <p>Bem-vindo, {user?.nome}</p>
      </div>

      <div className="account-grid">
        {/* Saldo e Ações */}
        <div className="balance-card">
          <div className="balance-header">
            <h2>Saldo Disponível</h2>
            <div className="balance-value">{formatCurrency(saldo)}</div>
          </div>
          <div className="balance-actions">
            <button 
              className="deposit-button"
              onClick={() => setShowPixModal(true)}
            >
              Depositar via PIX
            </button>
          </div>
        </div>

        {/* Resumo de Investimentos */}
        <div className="summary-card">
          <h2>Resumo de Investimentos</h2>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Investido:</span>
              <span className="stat-value">{formatCurrency(calculateTotalInvested())}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Quantidade de Investimentos:</span>
              <span className="stat-value">{investments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meus Investimentos */}
      <div className="section-card">
        <h2>Meus Investimentos</h2>
        {investments.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não possui investimentos.</p>
          </div>
        ) : (
          <div className="investments-table">
            <div className="table-header">
              <div>Investimento</div>
              <div>Valor Aplicado</div>
              <div>Taxa</div>
              <div>Prazo</div>
              <div>Data</div>
            </div>
            {investments.map((investment, index) => (
              <div key={index} className="table-row">
                <div className="investment-title">{investment.titulo}</div>
                <div className="investment-value">{formatCurrency(investment.valor_aplicado)}</div>
                <div className="investment-rate">{investment.taxa_retorno}% a.a.</div>
                <div className="investment-term">{investment.prazo} meses</div>
                <div className="investment-date">{formatDate(investment.data_aplicacao)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Histórico de Transações */}
      <div className="section-card">
        <h2>Histórico de Transações</h2>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <div className="transactions-table">
            <div className="table-header">
              <div>Tipo</div>
              <div>Valor</div>
              <div>Status</div>
              <div>Descrição</div>
              <div>Data</div>
            </div>
            {transactions.map((transaction) => (
              <div key={transaction.id} className="table-row">
                <div className={`transaction-type ${transaction.tipo}`}>
                  {getTransactionTypeLabel(transaction.tipo)}
                </div>
                <div className="transaction-value">{formatCurrency(transaction.valor)}</div>
                <div className={`transaction-status ${transaction.status}`}>
                  {getTransactionStatusLabel(transaction.status)}
                </div>
                <div className="transaction-description">{transaction.descricao}</div>
                <div className="transaction-date">{formatDate(transaction.data_criacao)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal PIX */}
      {showPixModal && (
        <PixModal
          onClose={() => setShowPixModal(false)}
          onSuccess={handlePixSuccess}
        />
      )}
    </div>
  );
};

export default Account;

