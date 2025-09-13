import React, { useState } from 'react';
import ApiService from '../services/api';
import './PixModal.css';

const PixModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: valor, 2: dados PIX
  const [valor, setValor] = useState('');
  const [pixData, setPixData] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleGeneratePix = async () => {
    if (!valor || parseFloat(valor) <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    setLoading(true);
    try {
      const data = await ApiService.gerarPix(parseFloat(valor));
      setPixData(data);
      setStep(2);
    } catch (error) {
      alert(error.message || 'Erro ao gerar PIX');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPixKey = () => {
    if (pixData?.dados_bancarios?.chave_pix) {
      navigator.clipboard.writeText(pixData.dados_bancarios.chave_pix);
      alert('Chave PIX copiada para a área de transferência!');
    }
  };

  const handleConfirmPayment = () => {
    alert('Depósito registrado! Aguarde a aprovação para que o valor seja creditado em sua conta.');
    onSuccess();
  };

  return (
    <div className="modal-overlay">
      <div className="pix-modal">
        <div className="modal-header">
          <h3>Depósito via PIX</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {step === 1 && (
          <div className="modal-body">
            <div className="step-indicator">
              <div className="step active">1</div>
              <div className="step-line"></div>
              <div className="step">2</div>
            </div>
            <div className="step-title">Informe o valor do depósito</div>

            <div className="input-group">
              <label htmlFor="valor">Valor (R$):</label>
              <input
                type="number"
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                min="0.01"
                step="0.01"
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
              <button 
                className="continue-button"
                onClick={handleGeneratePix}
                disabled={loading || !valor}
              >
                {loading ? 'Gerando...' : 'Continuar'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && pixData && (
          <div className="modal-body">
            <div className="step-indicator">
              <div className="step completed">✓</div>
              <div className="step-line completed"></div>
              <div className="step active">2</div>
            </div>
            <div className="step-title">Dados para pagamento</div>

            <div className="pix-info">
              <div className="pix-value">
                <span className="pix-label">Valor:</span>
                <span className="pix-amount">{formatCurrency(pixData.valor)}</span>
              </div>

              <div className="qr-code-section">
                <h4>QR Code PIX</h4>
                <div className="qr-code-container">
                  <img 
                    src={`data:image/png;base64,${pixData.qr_code}`}
                    alt="QR Code PIX"
                    className="qr-code"
                  />
                </div>
                <p className="qr-instruction">
                  Escaneie o QR Code com o app do seu banco ou copie a chave PIX abaixo
                </p>
              </div>

              <div className="bank-details">
                <h4>Dados Bancários</h4>
                <div className="detail-row">
                  <span className="detail-label">Favorecido:</span>
                  <span className="detail-value">{pixData.dados_bancarios.favorecido}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">CNPJ:</span>
                  <span className="detail-value">{pixData.dados_bancarios.cnpj}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Banco:</span>
                  <span className="detail-value">{pixData.dados_bancarios.banco}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Agência:</span>
                  <span className="detail-value">{pixData.dados_bancarios.agencia}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Conta:</span>
                  <span className="detail-value">{pixData.dados_bancarios.conta}</span>
                </div>
              </div>

              <div className="pix-key-section">
                <h4>Chave PIX</h4>
                <div className="pix-key-container">
                  <input 
                    type="text" 
                    value={pixData.dados_bancarios.chave_pix}
                    readOnly
                    className="pix-key-input"
                  />
                  <button 
                    className="copy-button"
                    onClick={handleCopyPixKey}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            <div className="payment-warning">
              <p>⚠️ Após realizar o pagamento, o valor será creditado em sua conta após aprovação.</p>
            </div>

            <div className="modal-actions">
              <button className="back-button" onClick={() => setStep(1)}>
                Voltar
              </button>
              <button 
                className="confirm-button"
                onClick={handleConfirmPayment}
              >
                Já realizei o pagamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PixModal;

