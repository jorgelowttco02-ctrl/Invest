# Guia de Deploy no Render (Frontend e Backend)

Este guia detalha os passos para fazer o deploy tanto do frontend (React) quanto do backend (Flask) da sua aplicação no Render.

## Pré-requisitos

- Uma conta no [Render](https://render.com/)
- Seu código frontend (`frontend/`) e backend (`backend/`) em um repositório Git (GitHub, GitLab, Bitbucket).

## 🚀 Deploy do Backend (Flask)

O backend será implantado como um **Web Service** no Render.

### 1. Preparação do Backend

1.  **Instalar Gunicorn**: Adicione `gunicorn` ao seu `backend/requirements.txt`.
    ```
    Flask==2.3.3
    Flask-SQLAlchemy==3.0.5
    Flask-JWT-Extended==4.5.3
    Flask-Cors==4.0.0
    SQLAlchemy==2.0.43
    qrcode==7.4.2
    Pillow==10.0.1
    PyJWT==2.10.1
    gunicorn
    psycopg2-binary # Para PostgreSQL no Render
    ```
2.  **Atualizar `run.py`**: Certifique-se de que seu `run.py` expõe a aplicação Flask para o Gunicorn. Se você tem `app = create_app()`, o Gunicorn pode ser configurado para usar `run:app`.

### 2. Criação do Web Service no Render

1.  Faça login no seu dashboard do Render.
2.  Clique em **"New"** e selecione **"Web Service"**.
3.  Conecte seu repositório Git e selecione o repositório que contém seu projeto.
4.  Configure as opções do serviço:
    -   **Name**: `peerbr-backend` (ou outro nome de sua preferência)
    -   **Region**: Escolha a região mais próxima dos seus usuários.
    -   **Branch**: `main` (ou a branch principal do seu projeto)
    -   **Root Directory**: `backend/` (A pasta onde seu código Flask está localizado)
    -   **Runtime**: `Python 3`
    -   **Build Command**: `pip install -r requirements.txt`
    -   **Start Command**: `gunicorn --bind 0.0.0.0:$PORT run:app`

### 3. Configuração do Banco de Dados (PostgreSQL)

O Render oferece um serviço de banco de dados PostgreSQL. É altamente recomendável usá-lo para o ambiente de produção.

1.  No seu dashboard do Render, clique em **"New"** e selecione **"PostgreSQL"**.
2.  Configure o banco de dados (nome, região, etc.) e crie-o.
3.  Após a criação, vá para as configurações do seu banco de dados e copie a **Internal Database URL**.
4.  Volte para as configurações do seu **Web Service do Backend**.
5.  Vá para a seção **"Environment"** e adicione as seguintes variáveis de ambiente:
    -   `SECRET_KEY`: Uma chave secreta forte para sua aplicação Flask.
    -   `JWT_SECRET_KEY`: Uma chave secreta forte para o JWT.
    -   `DATABASE_URL`: Cole a **Internal Database URL** do seu banco de dados PostgreSQL.

### 4. Deploy Inicial do Backend

1.  Após configurar tudo, clique em **"Create Web Service"**.
2.  O Render irá clonar seu repositório, instalar as dependências e iniciar o serviço.
3.  Acompanhe os logs para garantir que o deploy foi bem-sucedido.
4.  Uma vez online, o Render fornecerá uma URL pública para o seu backend (ex: `https://peerbr-backend.onrender.com`).

## 🚀 Deploy do Frontend (React)

O frontend será implantado como um **Static Site** no Render.

### 1. Preparação do Frontend

1.  **Arquivo `_redirects`**: Para aplicações React (Single Page Applications), crie um arquivo `_redirects` dentro da pasta `frontend/public` com o seguinte conteúdo:
    ```
    /*    /index.html   200
    ```
    Isso garante que todas as rotas sejam direcionadas para o `index.html`, permitindo que o React Router lide com o roteamento no lado do cliente.

### 2. Criação do Static Site no Render

1.  Faça login no seu dashboard do Render.
2.  Clique em **"New"** e selecione **"Static Site"**.
3.  Conecte seu repositório Git e selecione o repositório que contém seu projeto.
4.  Configure as opções do site:
    -   **Name**: `peerbr-frontend` (ou outro nome de sua preferência)
    -   **Region**: Escolha a região mais próxima dos seus usuários.
    -   **Branch**: `main` (ou a branch principal do seu projeto)
    -   **Root Directory**: `frontend/` (A pasta onde seu código React está localizado)
    -   **Build Command**: `npm run build`
    -   **Publish Directory**: `build` (A pasta onde os arquivos estáticos são gerados pelo `npm run build`)

### 3. Configuração de Variáveis de Ambiente

1.  Vá para as configurações do seu **Static Site do Frontend**.
2.  Vá para a seção **"Environment"** e adicione a URL do seu backend:
    -   `REACT_APP_API_URL`: Cole a URL pública do seu backend (ex: `https://peerbr-backend.onrender.com/api`).

### 4. Deploy Inicial do Frontend

1.  Após configurar tudo, clique em **"Create Static Site"**.
2.  O Render irá clonar seu repositório, executar o comando de build e publicar os arquivos gerados.
3.  Acompanhe os logs para garantir que o deploy foi bem-sucedido.
4.  Uma vez online, o Render fornecerá uma URL pública para o seu frontend (ex: `https://peerbr-frontend.onrender.com`).

## 🔗 Conectando Frontend e Backend

Certifique-se de que a variável de ambiente `REACT_APP_API_URL` no seu frontend aponte para a URL pública correta do seu backend no Render. Se você implantar o backend primeiro, poderá obter a URL e configurá-la no frontend.

Com esses passos, sua aplicação completa estará online no Render!

