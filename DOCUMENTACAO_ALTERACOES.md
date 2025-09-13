# Documentação das Alterações - Plataforma de Investimentos PeerBR

## Resumo Executivo

Este documento descreve as alterações implementadas na plataforma de investimentos em precatórios, expandindo o sistema para suportar múltiplas categorias de ativos e funcionalidades de gestão de saldo do usuário.

## Alterações no Backend (Flask)

### 1. Modelos de Dados Expandidos

#### Modelo Investment (app/models/investment.py)
- **Expansão de Categorias**: Adicionadas 9 categorias de investimento:
  - Debêntures
  - CRI (Recebíveis Imobiliários)
  - CRA (Recebíveis do Agronegócio)
  - Notas Fiscais
  - Recebíveis Judiciais
  - Operações Estruturadas
  - Precatórios (Federal, Estadual, Municipal)

- **Campos Adicionados**:
  - `categoria`: Enum com as categorias disponíveis
  - `valor_minimo`: Valor mínimo para investimento
  - `taxa_retorno`: Taxa de retorno anual
  - `prazo`: Prazo em meses
  - `status`: Status do investimento (Disponível/Esgotado)
  - `isencao_ir`: Indicador de isenção de IR
  - `valor_total`: Valor total do ativo
  - `valor_captado`: Valor já captado

#### Modelo User (app/models/user.py)
- **Campo Saldo**: Adicionado campo `saldo` (DECIMAL) com valor padrão 0
- **Relacionamentos**: Mantidos relacionamentos com investimentos e transações

#### Novo Modelo Transaction
- **Tipos de Transação**: Depósito, Saque, Investimento
- **Status**: Pendente, Aprovada, Rejeitada
- **Campos**: valor, descrição, data_criacao

#### Novo Modelo UserInvestment
- **Relacionamento**: User ↔ Investment (many-to-many)
- **Campos**: valor_aplicado, data_aplicacao

### 2. Novas Rotas da API

#### Rotas de Investimentos (app/routes/investments.py)
- `GET /api/investments/categories` - Lista categorias disponíveis
- `GET /api/investments` - Lista investimentos (com filtro por categoria)
- `GET /api/saldo` - Retorna saldo do usuário logado
- `POST /api/depositar` - Adiciona saldo ao usuário
- `POST /api/investir/<id>` - Aplica saldo em investimento
- `POST /api/gerar_pix` - Gera dados PIX para depósito

#### Funcionalidades PIX
- **Geração de QR Code**: Usando biblioteca `qrcode`
- **Dados Bancários Simulados**: Favorecido, CNPJ, banco, agência, conta
- **Chave PIX**: Configurada como email da empresa

### 3. Validações e Regras de Negócio
- **Saldo Suficiente**: Validação antes de permitir investimento
- **Status do Investimento**: Verificação se está disponível
- **Valor Mínimo**: Validação do valor mínimo para investimento
- **Autenticação JWT**: Todas as rotas protegidas por token

## Alterações no Frontend (React)

### 1. Estrutura de Componentes

#### Componentes Principais
- `App.js` - Componente raiz com roteamento
- `Navigation.js` - Barra de navegação responsiva
- `InvestmentCard.js` - Card para exibir investimentos
- `PixModal.js` - Modal para depósitos PIX

#### Páginas
- `Login.js` - Página de autenticação
- `Home.js` - Listagem de investimentos por categoria
- `Account.js` - Página da conta do usuário

### 2. Funcionalidades Implementadas

#### Página Home
- **Filtro por Categoria**: Dropdown com todas as categorias
- **Cards de Investimento**: Exibição de título, taxa, prazo, isenção IR
- **Botão Investir**: Modal para aplicação de valores
- **Saldo Disponível**: Exibido no canto superior direito

#### Página Minha Conta
- **Saldo Atual**: Exibição em destaque
- **Resumo de Investimentos**: Total investido e quantidade
- **Histórico de Transações**: Tabela com tipo, valor, status, data
- **Botão Depositar**: Acesso ao modal PIX

#### Modal PIX (Fluxo em 2 Etapas)
1. **Etapa 1**: Inserção do valor do depósito
2. **Etapa 2**: Exibição de QR Code e dados bancários

### 3. Integração com API

#### Serviço API (services/api.js)
- **Autenticação**: Login/logout com JWT
- **Gestão de Token**: Armazenamento no localStorage
- **Interceptadores**: Adição automática do token nas requisições
- **Tratamento de Erros**: Respostas padronizadas

#### Endpoints Consumidos
- Login/Register de usuários
- Listagem de categorias e investimentos
- Consulta de saldo
- Geração de PIX
- Aplicação em investimentos

### 4. Design e UX

#### Estilo Visual
- **Paleta de Cores**: Gradientes roxo/azul inspirados no PeerBR
- **Tipografia**: Fontes system (Apple/Google)
- **Layout Responsivo**: Mobile-first design
- **Componentes**: Cards, modais, formulários estilizados

#### Experiência do Usuário
- **Navegação Intuitiva**: Menu fixo com indicadores visuais
- **Feedback Visual**: Loading states, mensagens de erro/sucesso
- **Fluxos Guiados**: Processo PIX em etapas numeradas
- **Validações**: Campos obrigatórios e formatos

## Arquivos Criados/Modificados

### Backend
```
backend/
├── app/
│   ├── __init__.py (modificado)
│   ├── models/
│   │   ├── __init__.py (criado)
│   │   ├── user.py (expandido)
│   │   └── investment.py (criado)
│   └── routes/
│       ├── auth.py (criado)
│       └── investments.py (criado)
├── requirements.txt (criado)
└── run.py (criado)
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.js (criado)
│   │   ├── Navigation.css (criado)
│   │   ├── InvestmentCard.js (criado)
│   │   ├── InvestmentCard.css (criado)
│   │   ├── PixModal.js (criado)
│   │   └── PixModal.css (criado)
│   ├── pages/
│   │   ├── Home.js (criado)
│   │   ├── Home.css (criado)
│   │   ├── Account.js (criado)
│   │   ├── Account.css (criado)
│   │   ├── Login.js (criado)
│   │   └── Login.css (criado)
│   ├── services/
│   │   └── api.js (criado)
│   ├── App.js (modificado)
│   ├── App.css (criado)
│   └── index.js (modificado)
├── public/
│   └── index.html (modificado)
└── package.json (criado)
```

## Testes Realizados

### Backend
- ✅ Registro de usuário
- ✅ Login com JWT
- ✅ Listagem de categorias
- ✅ Consulta de saldo
- ✅ Geração de PIX com QR Code
- ✅ Validações de segurança

### Frontend
- ✅ Interface de login responsiva
- ✅ Navegação entre páginas
- ✅ Exibição de saldo e dados do usuário
- ✅ Modal PIX com fluxo completo
- ✅ Integração com API backend
- ✅ Design responsivo mobile/desktop

## Regras de Negócio Implementadas

1. **Autenticação Obrigatória**: Todas as funcionalidades requerem login
2. **Saldo Suficiente**: Usuário só pode investir se tiver saldo
3. **Status de Investimento**: Apenas investimentos "Disponíveis" podem receber aportes
4. **Valor Mínimo**: Respeitado o valor mínimo de cada investimento
5. **Isenção de IR**: Informação destacada na interface
6. **Histórico Completo**: Todas as transações são registradas
7. **PIX Simulado**: Processo completo mas sem integração real

## Próximos Passos Sugeridos

1. **Integração PIX Real**: Conectar com gateway de pagamento
2. **Aprovação de Depósitos**: Sistema administrativo para aprovar transações
3. **Notificações**: Email/SMS para confirmações
4. **Dashboard Admin**: Gestão de investimentos e usuários
5. **Relatórios**: Extratos e comprovantes em PDF
6. **KYC**: Processo de conhecimento do cliente
7. **Assinatura Digital**: Para contratos de investimento

## Conclusão

A evolução da plataforma foi implementada com sucesso, mantendo a arquitetura original e expandindo significativamente as funcionalidades. O sistema agora suporta múltiplas categorias de investimento, gestão completa de saldo do usuário e um fluxo de depósito via PIX intuitivo e profissional.

Todas as alterações seguiram as melhores práticas de desenvolvimento, com código limpo, componentização adequada e design responsivo inspirado na referência do portal PeerBR.

