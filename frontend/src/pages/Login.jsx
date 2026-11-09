import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/cafe_logo.png'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const resposta = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Não foi possível realizar o login.')
      }

      sessionStorage.setItem('token', dados.token)
      sessionStorage.setItem('usuarioAdmin', dados.usuario.email)

      navigate('/admin', { replace: true })
    } catch (error) {
      setErro(
        error.message === 'Failed to fetch'
          ? 'Não foi possível conectar ao servidor. Verifique se o backend está funcionando.'
          : error.message
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login-page">
      <Link to="/" className="login-back">
        ← Voltar para o site
      </Link>

      <section className="login-panel">
        <div className="login-brand">
          <img src={logo} alt="Neko Café" />
          <span>NEKO CAFÉ</span>
          <small>um carinho em cada xícara</small>
        </div>

        <div className="login-heading">
          <span className="login-eyebrow">
            <i /> ÁREA RESTRITA
          </span>

          <h1>
            Que bom ter
            <br />
            <em>você de volta.</em>
          </h1>

          <p>
            Entre com suas credenciais para gerenciar
            os produtos do Neko Café.
          </p>
        </div>

        <form className="login-form" onSubmit={entrar}>
          <div className="login-field">
            <label htmlFor="email">E-mail administrativo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seuemail@exemplo.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          {erro && (
            <div className="login-error" role="alert">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar no painel'}
            {!carregando && <span>↗</span>}
          </button>
        </form>

        <div className="login-footer">
          <span>♡</span>
          Acesso exclusivo para administradores
        </div>
      </section>

      <div className="login-decoration">
        <span>☕</span>
        <p>Seu café, seu espaço, seu jeito.</p>
      </div>
    </main>
  )
}

export default Login