# FrotaPM — Webapp (scaffold)

Este commit inicial cria um scaffold básico do sistema FrotaPM (backend + frontend) com mapa de rastreamento funcional em tempo real via WebSocket, e infraestrutura Docker para desenvolvimento.

Principais itens incluídos:
- Backend em Node.js (Express) com API CRUD básica para viaturas e Socket.IO para posições em tempo real.
- Frontend em React + Vite com mapa Leaflet mostrando posições em tempo real.
- Docker Compose para levantar Postgres, backend e frontend.
- Script de simulação de GPS para gerar posições de teste.

Como rodar (local):
1. Copie o arquivo .env.example para .env e ajuste variáveis (opcional).
2. docker compose up --build
3. Backend: http://localhost:4000
4. Frontend: http://localhost:5173

Usuário admin seed: admin@exemplo.local / Admin123!

Remova ou altere a senha seed em produção.
