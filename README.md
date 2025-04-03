# 🎯 FPS Challenge API

API desenvolvida em NestJS para análise de logs de partidas FPS. Permite upload de arquivos `.log`, persistência no MongoDB, e oferece endpoints para consultar rankings de jogadores e partidas.

---

## 📦 Tecnologias Utilizadas

- **NestJS**
- **MongoDB**
- **Mongoose**
- **Swagger (OpenAPI)**
- **Docker + Docker Compose**

---

## 🚀 Como Executar com Docker Compose

### 1. Clone o projeto

```bash
git clone https://github.com/epedrotti77/fps-challenge-api.git
cd fps-challenge-api
```

### 2. Suba os containers

```bash
docker compose up --build
```

Esse comando irá:
- Subir o banco MongoDB (porta `27017`)
- Compilar e iniciar a API (porta `3000`)

> 🔗 A API estará acessível em: `http://localhost:3000`

---

## 🔍 Acessar Documentação Swagger

Após iniciar o projeto, acesse:

```
http://localhost:3000/api/docs
```

Lá você pode explorar e testar todos os endpoints da API de forma interativa.

---

## 📤 Upload de Log via Swagger

1. Acesse o endpoint `POST /api/v1/logs/upload`
2. Clique em **"Try it out"**
3. Selecione o arquivo `.log` no campo `file`
4. Clique em **"Execute"**

Exemplo de log válido:

```
23/04/2019 15:34:22 - New match 11348965 has started
23/04/2019 15:36:04 - Roman killed Nick using M16
23/04/2019 15:36:33 - <WORLD> killed Nick by DROWN
23/04/2019 15:39:22 - Match 11348965 has ended

23/04/2021 16:14:22 - New match 11348966 has started
23/04/2021 16:26:04 - Roman killed Marcus using M16
23/04/2021 16:36:33 - <WORLD> killed Marcus by DROWN
23/04/2021 16:49:22 - Match 11348966 has ended

24/04/2020 16:14:22 - New match 11348961 has started
24/04/2020 16:26:12 - Roman killed Marcus using M16
24/04/2020 16:35:56 - Marcus killed Jhon using AK47
24/04/2020 17:12:34 - Roman killed Bryian using M16
24/04/2020 18:26:14 - Bryan killed Marcus using AK47
24/04/2020 19:36:33 - <WORLD> killed Marcus by DROWN
24/04/2020 20:19:22 - Match 11348961 has ended
```

---

## 📈 Endpoints Úteis

| Método | Rota                              | Descrição                                |
|--------|-----------------------------------|-------------------------------------------|
| POST   | `/api/v1/logs/upload`             | Faz upload de um arquivo `.log`          |
| GET    | `/api/v1/matches/ranking`         | Retorna ranking de todas as partidas     |
| GET    | `/api/v1/matches/:id/ranking`     | Retorna ranking de uma partida específica|
| GET    | `/api/v1/players/global-ranking`  | Ranking global dos jogadores             |

---

## 🧪 Executar os Testes

Se quiser rodar os testes unitários:

```bash
npm install
npm run test
```

---

## 🛠 Variáveis de Ambiente

No `docker-compose.yml`, a URL do banco está pré-configurada:

```yaml
environment:
  - MONGO_URL=mongodb://mongo:27017/fps
```

Caso queira rodar localmente fora do Docker, crie um arquivo `.env`:

```env
MONGO_URL=mongodb://localhost:27017/fps
```

---

## 🧾 Estrutura do Projeto

```
src/
├── logs/
│   ├── controllers/
│   ├── services/
│   ├── use-cases/
│   └── parser/
├── schemas/
├── dtos/
├── main.ts
├── app.module.ts
```

---

## 📚 Licença

Este projeto é livre para fins de estudo, testes técnicos e aprimoramento profissional.
