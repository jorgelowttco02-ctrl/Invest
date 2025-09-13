## Tarefas

### Fase 1: Análise do projeto existente e referência
- [x] Analisar a interface e o fluxo do usuário da plataforma de referência (portal.peerbr.com).
- [x] Entender a estrutura de pastas e estilo de código do projeto existente (Flask e React).

### Fase 2: Evolução do backend (Flask)
- [x] Expandir o modelo `Investimento` para suportar novas categorias.
- [x] Adicionar campos previstos ao modelo `Investimento`.
- [x] Adicionar o campo `saldo` ao modelo `User`.
- [x] Criar rota `POST /api/depositar`.
- [x] Criar rota `GET /api/saldo`.
- [x] Criar rota `POST /api/investir/<id_investimento>`.
- [x] Criar endpoint `POST /api/gerar_pix`.

### Fase 3: Evolução do frontend (React + Vite)
- [x] Criar página/listagem de ativos por categoria.
- [x] Exibir informações de cada ativo (título, taxa de retorno, prazo, isenção de IR).
- [x] Criar página "Minha Conta" com saldo e histórico de investimentos.
- [x] Adicionar botão "Depositar" na página "Minha Conta".
- [x] Criar modal para depósitos via PIX.
- [x] Adicionar botão "Investir" na tela de ativos.
- [x] Implementar validação de saldo antes de investir.

### Fase 4: Testes e validação do sistema
- [x] Testar todas as novas rotas do backend.
- [x] Testar todas as novas funcionalidades do frontend.
- [x] Validar regras de negócio (saldo suficiente, status de investimento).

### Fase 5: Entrega dos resultados
- [x] Preparar documentação das alterações.
- [x] Criar README com instruções de instalação.
- [x] Organizar arquivos do projeto.
- [ ] Entregar o código-fonte atualizado.

