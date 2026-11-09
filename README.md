# ☕ Neko Café

Sistema web de gerenciamento de cafeteria, desenvolvido como projeto acadêmico para explorar a utilização de bancos de dados NoSQL na prática.

O Neko Café busca oferecer uma experiência simples e acolhedora para a apresentação do cardápio e o gerenciamento dos produtos de uma cafeteria.

## ✨ Funcionalidades

### Site
- Página inicial com identidade visual própria.
- Apresentação do cardápio.
- Exibição dos produtos cadastrados no banco de dados.
- Seção institucional sobre a cafeteria.

### Área administrativa
- Login administrativo com autenticação.
- Cadastro de produtos.
- Consulta de produtos.
- Edição de produtos.
- Exclusão de produtos.
- Organização por categorias.
- Controle de disponibilidade.

## 🛠️ Tecnologias utilizadas

### Frontend
- React
- JavaScript
- Vite
- CSS

### Backend
- Node.js
- Express
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS

### Banco de dados
- MongoDB Community Server
- MongoDB Compass

## 🏗️ Arquitetura

A aplicação utiliza uma arquitetura dividida em três partes:

1. **Frontend:** interface desenvolvida em React.
2. **Backend:** API REST desenvolvida com Node.js e Express.
3. **Banco de dados:** MongoDB, responsável pelo armazenamento persistente dos dados.

O frontend realiza requisições à API, e o backend é responsável pela comunicação com o MongoDB.

## 📁 Estrutura do projeto

```text
neko-cafe/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## ⚙️ Pré-requisitos

Antes de executar o projeto, instale:

- Node.js e npm.
- MongoDB Community Server.
- MongoDB Compass (opcional, para visualizar e administrar os dados).
- Git.

## 🚀 Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/neko-cafe.git
```

Entre na pasta:

```bash
cd neko-cafe
```

### 2. Configurar o banco de dados

Inicie o serviço do MongoDB e utilize a seguinte conexão local:

```text
mongodb://127.0.0.1:27017/cafe_central
```

O banco de dados utilizado pela aplicação é `cafe_central`.

### 3. Configurar o backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com base no `.env.example` e configure as variáveis:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/cafe_central

ADMIN_EMAIL=seu-email@exemplo.com
ADMIN_PASSWORD_HASH=SEU_HASH_BCRYPT
JWT_SECRET=SEU_SEGREDO_FORTE
```

O campo `ADMIN_PASSWORD_HASH` deve conter o hash da senha administrativa gerado com bcryptjs. O `JWT_SECRET` deve ser um segredo forte e privado.

Inicie o servidor:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3001
```

### 4. Configurar o frontend

Abra outro terminal e entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## 🔗 Rotas da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/produtos` | Consulta todos os produtos |
| GET | `/api/produtos/:id` | Consulta um produto específico |
| GET | `/api/produtos?categoria=Cafés` | Filtra produtos por categoria |
| POST | `/api/auth/login` | Realiza o login administrativo |
| POST | `/api/produtos` | Cadastra um produto |
| PUT | `/api/produtos/:id` | Atualiza um produto |
| DELETE | `/api/produtos/:id` | Exclui um produto |

As operações de gerenciamento de produtos exigem autenticação administrativa.

## 🗄️ Banco de dados

O projeto utiliza o MongoDB, um banco de dados NoSQL orientado a documentos.

Banco de dados:

```text
cafe_central
```

Coleção:

```text
produtos
```

Os documentos de produtos armazenam informações como:

- Nome.
- Descrição.
- Preço.
- Categoria.
- Imagem.
- Disponibilidade.
- Data de criação e atualização.

## 👥 Integrantes

- Rafaella Rocha Deganutti
- Gustavo Grancieri

## 🎓 Objetivo acadêmico

O projeto foi desenvolvido com o objetivo de aplicar na prática os conceitos de bancos de dados NoSQL, explorando a instalação, configuração, organização dos dados e operações CRUD utilizando MongoDB em uma aplicação web.

---

**Neko Café** — Um carinho em cada xícara. ☕