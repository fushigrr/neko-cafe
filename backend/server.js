
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 3001

if (
  !process.env.MONGODB_URI ||
  !process.env.ADMIN_EMAIL ||
  !process.env.ADMIN_PASSWORD_HASH ||
  !process.env.JWT_SECRET
) {
  console.error('Configure as variáveis necessárias no arquivo .env.')
  process.exit(1)
}

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json({ limit: '20kb' }))

const produtoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    descricao: {
      type: String,
      default: '',
      maxlength: 500,
    },
    preco: {
      type: Number,
      required: true,
      min: 0,
    },
    categoria: {
      type: String,
      default: 'Outros',
    },
    imagem: {
      type: String,
      default: '',
    },
    disponivel: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const Produto = mongoose.model('Produto', produtoSchema)

// Verifica o token JWT enviado pelo frontend.
function autenticarAdmin(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      erro: 'Faça login para realizar esta operação.',
    })
  }

  const token = authorization.slice(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    if (payload.role !== 'admin') {
      return res.status(403).json({
        erro: 'Você não tem permissão para esta operação.',
      })
    }

    req.admin = payload
    next()
  } catch {
    return res.status(401).json({
      erro: 'Sessão inválida ou expirada. Entre novamente.',
    })
  }
}

// Verifica se a API está funcionando.
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Café Central funcionando!',
  })
})

// Login administrativo.
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    if (
      typeof email !== 'string' ||
      typeof senha !== 'string' ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        erro: 'Informe o e-mail e a senha.',
      })
    }

    const emailValido =
      email.trim().toLowerCase() ===
      process.env.ADMIN_EMAIL.trim().toLowerCase()

    const senhaValida = await bcrypt.compare(
      senha,
      process.env.ADMIN_PASSWORD_HASH
    )

    if (!emailValido || !senhaValida) {
      return res.status(401).json({
        erro: 'E-mail ou senha incorretos.',
      })
    }

    const token = jwt.sign(
      {
        role: 'admin',
        email: process.env.ADMIN_EMAIL,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        email: process.env.ADMIN_EMAIL,
      },
    })
  } catch (error) {
    console.error('Erro no login:', error)

    res.status(500).json({
      erro: 'Não foi possível realizar o login.',
    })
  }
})

// Consulta pública de produtos, com possibilidade de filtro.
app.get('/api/produtos', async (req, res) => {
  try {
    const filtro = {}

    if (req.query.categoria) {
      filtro.categoria = req.query.categoria
    }

    if (req.query.disponivel !== undefined) {
      filtro.disponivel = req.query.disponivel === 'true'
    }

    if (req.query.nome) {
      filtro.nome = {
        $regex: req.query.nome,
        $options: 'i',
      }
    }

    const produtos = await Produto.find(filtro).sort({ nome: 1 })

    res.json(produtos)
  } catch (error) {
    console.error('Erro ao consultar produtos:', error)

    res.status(500).json({
      erro: 'Erro ao consultar produtos.',
    })
  }
})

// Consulta de um produto específico pelo ID.
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        erro: 'ID do produto inválido.',
      })
    }

    const produto = await Produto.findById(id)

    if (!produto) {
      return res.status(404).json({
        erro: 'Produto não encontrado.',
      })
    }

    res.json(produto)
  } catch (error) {
    console.error('Erro ao consultar produto:', error)

    res.status(500).json({
      erro: 'Erro ao consultar produto.',
    })
  }
})

// Cadastro: somente administrador autenticado.
app.post('/api/produtos', autenticarAdmin, async (req, res) => {
  try {
    const { nome, descricao, preco, categoria, imagem } = req.body

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome do produto é obrigatório.',
      })
    }

    if (
      typeof preco !== 'number' ||
      !Number.isFinite(preco) ||
      preco < 0 ||
      preco > 999999
    ) {
      return res.status(400).json({
        erro: 'Informe um preço válido.',
      })
    }

    const produto = await Produto.create({
      nome: nome.trim(),
      descricao,
      preco,
      categoria,
      imagem,
    })

    res.status(201).json(produto)
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error)

    res.status(500).json({
      erro: 'Não foi possível cadastrar o produto.',
    })
  }
})

// Edição: somente administrador autenticado.
app.put('/api/produtos/:id', autenticarAdmin, async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        erro: 'ID do produto inválido.',
      })
    }

    const { nome, descricao, preco, categoria, imagem, disponivel } =
      req.body

    if (typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome do produto é obrigatório.',
      })
    }

    if (
      typeof preco !== 'number' ||
      !Number.isFinite(preco) ||
      preco < 0 ||
      preco > 999999
    ) {
      return res.status(400).json({
        erro: 'Informe um preço válido.',
      })
    }

    const produtoAtualizado = await Produto.findByIdAndUpdate(
      id,
      {
        nome: nome.trim(),
        descricao,
        preco,
        categoria,
        imagem,
        ...(typeof disponivel === 'boolean' ? { disponivel } : {}),
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!produtoAtualizado) {
      return res.status(404).json({
        erro: 'Produto não encontrado.',
      })
    }

    res.json({
      mensagem: 'Produto atualizado com sucesso!',
      produto: produtoAtualizado,
    })
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)

    res.status(500).json({
      erro: 'Não foi possível atualizar o produto.',
    })
  }
})

// Exclusão: somente administrador autenticado.
app.delete('/api/produtos/:id', autenticarAdmin, async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        erro: 'ID do produto inválido.',
      })
    }

    const produtoExcluido = await Produto.findByIdAndDelete(id)

    if (!produtoExcluido) {
      return res.status(404).json({
        erro: 'Produto não encontrado.',
      })
    }

    res.json({
      mensagem: 'Produto excluído com sucesso!',
    })
  } catch (error) {
    console.error('Erro ao excluir produto:', error)

    res.status(500).json({
      erro: 'Não foi possível excluir o produto.',
    })
  }
})

async function iniciarServidor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB conectado com sucesso!')

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error.message)
    process.exit(1)
  }
}

iniciarServidor()
