import React, { useState } from 'react';
import './InvestmentCard.css';

const InvestmentCard = ({ investment, onInvest }) => {
  const [showModal, setShowModal] = useState(false);
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleInvest = async () => {
    if (!valor || parseFloat(valor) <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    if (parseFloat(valor) < investment.valor_minimo) {
      alert(`Valor mínimo para este investimento é ${formatCurrency(investment.valor_minimo)}`);
      return;
    }

    setLoading(true);
    try {
      await onInvest(investment.id, parseFloat(valor));
      setShowModal(false);
      setValor('');
      alert('Investimento realizado com sucesso!');
    } catch (error) {
      alert(error.message || 'Erro ao realizar investimento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="investment-card">
        <div className="investment-header">
          <h3 className="investment-title">{investment.titulo}</h3>
          <span className={`investment-status ${investment.status}`}>
            {investment.status === 'disponivel' ? 'Disponível' : 'Esgotado'}
          </span>
        </div>
        
        <div className="investment-category">
          {formatCategory(investment.categoria)}
        </div>
        
        <div className="investment-details">
          <div className="detail-item">
            <span className="detail-label">Taxa de Retorno:</span>
            <span className="detail-value">{investment.taxa_retorno}% a.a.</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Prazo:</span>
            <span className="detail-value">{investment.prazo} meses</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Valor Mínimo:</span>
            <span className="detail-value">{formatCurrency(investment.valor_minimo)}</span>
          </div>
          
          {investment.isencao_ir && (
            <div className="tax-exempt">
              <span>✓ Isento de IR</span>
            </div>
          )}
        </div>
        
        {investment.descricao && (
          <div className="investment-description">
            <p>{investment.descricao}</p>
          </div>
        )}
        
        <div className="investment-actions">
          <button 
            className="invest-button"
            onClick={() => setShowModal(true)}
            disabled={investment.status !== 'disponivel'}
          >
            {investment.status === 'disponivel' ? 'Investir' : 'Esgotado'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Investir em {investment.titulo}</h3>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="investment-summary">
                <p><strong>Taxa:</strong> {investment.taxa_retorno}% a.a.</p>
                <p><strong>Prazo:</strong> {investment.prazo} meses</p>
                <p><strong>Valor Mínimo:</strong> {formatCurrency(investment.valor_minimo)}</p>
              </div>
              
              <div className="input-group">
                <label htmlFor="valor">Valor do Investimento:</label>
                <input
                  type="number"
                  id="valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="Digite o valor"
                  min={investment.valor_minimo}
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="confirm-button"
                onClick={handleInvest}
                disabled={loading}
              >
                {loading ? 'Investindo...' : 'Confirmar Investimento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentCard;

