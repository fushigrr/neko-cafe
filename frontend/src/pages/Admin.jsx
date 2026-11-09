import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/cafe_logo.png'
import './Admin.css'

const API = 'http://localhost:3001/api/produtos'

const formularioInicial = {
  nome: '',
  descricao: '',
  preco: '',
  categoria: 'Cafés',
  imagem: '',
}

function Admin() {
  const navigate = useNavigate()

  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState({ ...formularioInicial })
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [excluindoId, setExcluindoId] = useState(null)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [editingId, setEditingId] = useState(null)

  const token = sessionStorage.getItem('token')

  const dinheiro = (valor) =>
    Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  async function buscarProdutos() {
    try {
      const resposta = await fetch(API)

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar os produtos.')
      }

      const dados = await resposta.json()
      setProdutos(dados)
      setErro('')
    } catch (error) {
      console.error(error)
      setErro('Não foi possível conectar ao servidor.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    buscarProdutos()
  }, [])

  function atualizarCampo(event) {
    const { name, value } = event.target

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  function iniciarEdicao(produto) {
    setEditingId(produto._id)

    setForm({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: String(produto.preco),
      categoria: produto.categoria || 'Outros',
      imagem: produto.imagem || '',
    })

    setErro('')
    setMensagem('')

    document.getElementById('cadastro')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  function cancelarEdicao() {
    setEditingId(null)
    setForm({ ...formularioInicial })
    setErro('')
    setMensagem('')
  }

  async function cadastrarProduto(event) {
    event.preventDefault()

    setErro('')
    setMensagem('')

    if (!form.nome.trim() || form.preco === '') {
      setErro('Preencha o nome e o preço do produto.')
      return
    }

    const preco = Number(form.preco)

    if (!Number.isFinite(preco) || preco < 0 || preco > 999999) {
      setErro('Informe um preço válido.')
      return
    }

    setSalvando(true)

    try {
      const url = editingId ? `${API}/${editingId}` : API

      const resposta = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: form.nome.trim(),
          descricao: form.descricao.trim(),
          preco,
          categoria: form.categoria,
          imagem: form.imagem.trim(),
        }),
      })

      const dados = await resposta.json()

      if (resposta.status === 401) {
        sessionStorage.clear()
        navigate('/login')
        return
      }

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao salvar produto.')
      }

      if (editingId) {
        setProdutos((lista) =>
          lista.map((produto) =>
            produto._id === editingId ? dados.produto : produto
          )
        )

        setMensagem('Produto atualizado com sucesso!')
      } else {
        setProdutos((lista) => [...lista, dados])
        setMensagem('Produto cadastrado com sucesso!')
      }

      setEditingId(null)
      setForm({ ...formularioInicial })
    } catch (error) {
      console.error(error)
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  async function excluirProduto(produto) {
    const confirmou = window.confirm(
      `Deseja realmente excluir "${produto.nome}"?`
    )

    if (!confirmou) return

    setErro('')
    setMensagem('')
    setExcluindoId(produto._id)

    try {
      const resposta = await fetch(`${API}/${produto._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const dados = await resposta.json()

      if (resposta.status === 401) {
        sessionStorage.clear()
        navigate('/login')
        return
      }

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao excluir produto.')
      }

      setProdutos((lista) =>
        lista.filter((item) => item._id !== produto._id)
      )

      if (editingId === produto._id) {
        cancelarEdicao()
      }

      setMensagem('Produto excluído com sucesso!')
    } catch (error) {
      console.error(error)
      setErro(error.message)
    } finally {
      setExcluindoId(null)
    }
  }

  function sair() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('usuarioAdmin')
    navigate('/login')
  }

  const disponiveis = produtos.filter(
    (produto) => produto.disponivel !== false
  )

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link to="/" className="admin-brand">
          <img src={logo} alt="Neko Café" />
          <span>
            <strong>Neko Café</strong>
            <small>PAINEL ADMINISTRATIVO</small>
          </span>
        </Link>

        <div className="admin-header-actions">
          <Link to="/" className="admin-site-link">
            Ver meu site ↗
          </Link>

          <button
            type="button"
            className="admin-logout"
            onClick={sair}
          >
            Sair
          </button>
        </div>
      </header>

      <div className="admin-content">
        <section className="admin-welcome">
          <div>
            <span className="admin-eyebrow">
              <i /> ESPAÇO DE GERENCIAMENTO
            </span>

            <h1>
              Olá! Vamos cuidar
              <br />
              do nosso <em>café?</em>
            </h1>

            <p>
              Gerencie os produtos e mantenha o cardápio
              do Neko Café sempre atualizado.
            </p>
          </div>

          <div className="admin-welcome-decoration">
            <span>☕</span>
            <small>feito com carinho</small>
          </div>
        </section>

        <section className="admin-stats">
          <article className="admin-stat">
            <span>Produtos cadastrados</span>
            <strong>{produtos.length}</strong>
            <small>Itens no cardápio</small>
          </article>

          <article className="admin-stat">
            <span>Produtos disponíveis</span>
            <strong>{disponiveis.length}</strong>
            <small>Visíveis no cardápio</small>
          </article>

          <article className="admin-stat">
            <span>Categorias utilizadas</span>
            <strong>
              {
                new Set(
                  produtos.map((produto) => produto.categoria || 'Outros')
                ).size
              }
            </strong>
            <small>Tipos de produtos</small>
          </article>
        </section>

        <section className="admin-products" id="produtos">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">
                <i /> NOSSO CARDÁPIO
              </span>

              <h2>
                Gerenciar <em>produtos.</em>
              </h2>
            </div>

            <button
              type="button"
              className="admin-add-button"
              onClick={() => {
                cancelarEdicao()
                document.getElementById('cadastro')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
            >
              + Novo produto
            </button>
          </div>

          {carregando && (
            <p className="admin-feedback">Carregando produtos...</p>
          )}

          {erro && (
            <p className="admin-feedback admin-error" role="alert">
              {erro}
            </p>
          )}

          {mensagem && (
            <p className="admin-feedback admin-success" role="status">
              {mensagem}
            </p>
          )}

          {!carregando && produtos.length === 0 && !erro && (
            <p className="admin-feedback">
              Nenhum produto cadastrado ainda.
            </p>
          )}

          <div className="admin-product-list">
            {produtos.map((produto) => (
              <article className="admin-product-row" key={produto._id}>
                <div className="admin-product-image">
                  {produto.imagem ? (
                    <img src={produto.imagem} alt={produto.nome} />
                  ) : (
                    <span>☕</span>
                  )}
                </div>

                <div className="admin-product-description">
                  <strong>{produto.nome}</strong>
                  <span>{produto.categoria || 'Outros'}</span>
                </div>

                <strong className="admin-product-price">
                  {dinheiro(produto.preco)}
                </strong>

                <span
                  className={
                    produto.disponivel === false
                      ? 'admin-status unavailable'
                      : 'admin-status available'
                  }
                >
                  {produto.disponivel === false
                    ? 'Indisponível'
                    : 'Disponível'}
                </span>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    onClick={() => iniciarEdicao(produto)}
                    disabled={salvando || excluindoId !== null}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="admin-delete"
                    onClick={() => excluirProduto(produto)}
                    disabled={salvando || excluindoId !== null}
                  >
                    {excluindoId === produto._id
                      ? 'Excluindo...'
                      : 'Excluir'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-form-section" id="cadastro">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">
                <i /> CADASTRO DE PRODUTOS
              </span>

              <h2>
                {editingId ? 'Editar' : 'Adicionar'} <em>produto.</em>
              </h2>

              <p>
                Preencha os dados para atualizar nosso cardápio.
              </p>
            </div>
          </div>

          <form className="admin-form" onSubmit={cadastrarProduto}>
            <div className="admin-input-group">
              <label htmlFor="nome">Nome do produto *</label>
              <input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={atualizarCampo}
                placeholder="Ex.: Cappuccino"
                maxLength={100}
                required
              />
            </div>

            <div className="admin-input-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={atualizarCampo}
                placeholder="Conte um pouquinho sobre o produto..."
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-input-group">
                <label htmlFor="preco">Preço (R$) *</label>
                <input
                  id="preco"
                  name="preco"
                  type="number"
                  value={form.preco}
                  onChange={atualizarCampo}
                  placeholder="12.50"
                  min="0"
                  max="999999"
                  step="0.01"
                  required
                />
              </div>

              <div className="admin-input-group">
                <label htmlFor="categoria">Categoria</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={form.categoria}
                  onChange={atualizarCampo}
                >
                  <option value="Cafés">Cafés</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Doces">Doces</option>
                  <option value="Salgados">Salgados</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div className="admin-input-group">
              <label htmlFor="imagem">URL da imagem (opcional)</label>
              <input
                id="imagem"
                name="imagem"
                type="url"
                value={form.imagem}
                onChange={atualizarCampo}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            {erro && (
              <p className="admin-feedback admin-error" role="alert">
                {erro}
              </p>
            )}

            {mensagem && (
              <p className="admin-feedback admin-success" role="status">
                {mensagem}
              </p>
            )}

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-save-button"
                disabled={salvando || excluindoId !== null}
              >
                {salvando
                  ? 'Salvando...'
                  : editingId
                    ? 'Salvar alterações'
                    : 'Cadastrar produto'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={cancelarEdicao}
                  disabled={salvando}
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>
      </div>

      <footer className="admin-footer">
        <span>Neko Café ♡</span>
        <p>Um carinho em cada xícara.</p>
      </footer>
    </main>
  )
}

export default Admin