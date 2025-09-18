# Plataforma de Investimentos PeerBR

Uma plataforma completa para investimentos em precatórios e ativos alternativos, desenvolvida com Flask (backend) e React (frontend).

## 🚀 Funcionalidades

### Backend (Flask)
- ✅ Autenticação JWT
- ✅ Múltiplas categorias de investimento
- ✅ Gestão de saldo do usuário
- ✅ Geração de PIX com QR Code
- ✅ Histórico de transações
- ✅ API RESTful completa

### Frontend (React)
- ✅ Interface responsiva e moderna
- ✅ Login/logout de usuários
- ✅ Listagem de investimentos por categoria
- ✅ Página "Minha Conta" com saldo e histórico
- ✅ Modal PIX com fluxo em 2 etapas
- ✅ Design inspirado no portal PeerBR

## 📋 Pré-requisitos

- Python 3.11+
- Node.js 18+
- npm ou yarn

## 🛠️ Instalação

### Backend (Flask)

1. Navegue para a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute o servidor:
```bash
python run.py
```

O backend estará disponível em `http://localhost:5000`

### Frontend (React)

1. Navegue para a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm start
```

O frontend estará disponível em `http://localhost:3000`

## 🔧 Configuração

### Variáveis de Ambiente (Backend)

Crie um arquivo `.env` na pasta `backend` com:

```env
SECRET_KEY=sua-chave-secreta-aqui
JWT_SECRET_KEY=sua-chave-jwt-aqui
DATABASE_URL=sqlite:///investments.db
```

### Configuração da API (Frontend)

O frontend está configurado para se conectar ao backend em `http://localhost:5000`. Para alterar, modifique o arquivo `frontend/src/services/api.js`.

## 📊 Estrutura do Projeto

```
projeto/
├── backend/                 # API Flask
│   ├── app/
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   └── __init__.py     # Configuração Flask
│   ├── requirements.txt    # Dependências Python
│   └── run.py             # Arquivo principal
│
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços (API)
│   │   └── App.js         # Componente principal
│   ├── package.json       # Dependências Node.js
│   └── public/            # Arquivos estáticos
│
└── DOCUMENTACAO_ALTERACOES.md  # Documentação detalhada
```

## 🎯 Categorias de Investimento

- Debêntures
- CRI (Recebíveis Imobiliários)
- CRA (Recebíveis do Agronegócio)
- Notas Fiscais
- Recebíveis Judiciais
- Operações Estruturadas
- Precatórios Federal
- Precatórios Estadual
- Precatórios Municipal

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Após o login, o token é armazenado no localStorage e incluído automaticamente nas requisições.

### Usuário de Teste

Para testes, você pode criar um usuário via API ou usar as credenciais:
- CPF: `123.456.789-00`
- Senha: `123456`

## 💰 Fluxo PIX

1. **Inserir Valor**: Usuário informa o valor do depósito
2. **Gerar PIX**: Sistema gera QR Code e dados bancários
3. **Pagamento**: Usuário realiza o pagamento (simulado)
4. **Aprovação**: Transação fica pendente de aprovação

## 🧪 Testes

### Testando a API

```bash
# Registrar usuário
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"cpf": "123.456.789-00", "email": "teste@teste.com", "nome": "Usuário Teste", "senha": "123456"}'

# Fazer login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"cpf": "123.456.789-00", "senha": "123456"}'

# Listar categorias (com token)
curl -X GET http://localhost:5000/api/investments/categories \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Testando o Frontend

1. Acesse `http://localhost:3000`
2. Faça login com as credenciais de teste
3. Navegue pelas páginas "Investimentos" e "Minha Conta"
4. Teste o fluxo de depósito PIX

## 🚀 Deploy

### Backend
- Configure as variáveis de ambiente de produção
- Use um servidor WSGI como Gunicorn
- Configure um banco de dados PostgreSQL

### Frontend
- Execute `npm run build` para gerar os arquivos de produção
- Sirva os arquivos estáticos com nginx ou similar
- Configure o proxy para a API backend

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do email: suporte@peerbr.com.br

---

**Desenvolvido com ❤️ pela equipe PeerBR**




## ⚙️ Alterações para Deploy no Render

Foram realizadas as seguintes alterações no projeto para facilitar o deploy no Render:

### Backend
- Adicionado `gunicorn` e `psycopg2-binary` ao `backend/requirements.txt` para o servidor WSGI e suporte a PostgreSQL.
- Ajustada a configuração do `SQLALCHEMY_DATABASE_URI` em `backend/app/__init__.py` para detectar e configurar corretamente o PostgreSQL no ambiente do Render.

### Frontend
- Criado o arquivo `frontend/public/_redirects` com `/* /index.html 200` para garantir o correto funcionamento do roteamento de Single Page Applications (SPA) no Render.

Para um guia detalhado de deploy no Render, consulte o arquivo `RENDER_DEPLOY_GUIDE.md`.

