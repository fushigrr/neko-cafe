import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/cafe_logo.png'
import '../App.css'

function Cardapio() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch('http://localhost:3001/api/produtos')

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar o cardápio.')
        }

        const dados = await resposta.json()
        setProdutos(dados)
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar o cardápio. Tente novamente.')
      } finally {
        setCarregando(false)
      }
    }

    carregarProdutos()
  }, [])

  const produtosDisponiveis = produtos.filter(
    (produto) => produto.disponivel !== false
  )

  function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <main className="site-shell">

      <header className="site-header">
        <a className="brand" href="#inicio">
          <img src={logo} alt="Neko Café" />

          <span className="brand-copy">
            <strong>Neko Café</strong>
            <small>um carinho em cada xícara</small>
          </span>
        </a>

        <nav className="main-nav">
          <a href="#inicio">Início</a>
          <a href="#cardapio">Cardápio</a>
          <a href="#sobre">Nossa história</a>
        </nav>

        <Link className="header-cta" to="/login">
          Gerenciamento <span>↗</span>
        </Link>
      </header>

      <section className="hero-section" id="inicio">

        <div className="hero-copy">
          <span className="eyebrow">
            <i /> FEITO COM CARINHO, SERVIDO COM CAFÉ
          </span>

          <h1>
            Seu cantinho
            <br />
            de <em>pausa</em> no dia.
          </h1>

          <p>
            Um café quentinho, um doce especial e aquele
            tempinho gostoso só seu. Entre, fique à vontade.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#cardapio">
              Explorar cardápio <span>↓</span>
            </a>

            <a className="text-link" href="#sobre">
              Conheça o Neko ↗
            </a>
          </div>

          <div className="hero-note">
            <span className="note-icon">♡</span>
            Pequenos momentos também merecem ser especiais.
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="hero-logo-card">
            <img src={logo} alt="Logo Neko Café" />
          </div>

          <div className="floating-note note-top">
            ☕ feito na hora
          </div>

          <div className="floating-note note-bottom">
            ♡ pausa com carinho
          </div>

          <span className="sparkle sparkle-one">✳</span>
          <span className="sparkle sparkle-two">✦</span>
        </div>

        <a className="scroll-cue" href="#cardapio">
          <span />
          role para descobrir
        </a>
      </section>

      <section className="menu-section" id="cardapio">

        <div className="section-topline">
          <div>
            <span className="eyebrow">
              <i /> FEITO PARA SEU MOMENTO
            </span>

            <h2>
              Um menu cheio de
              <br />
              <em>bons encontros.</em>
            </h2>
          </div>

          <p>
            Do primeiro gole ao último pedacinho,
            escolha seu favorito e aproveite sem pressa.
          </p>
        </div>

        {carregando && (
          <p className="status-message">
            Preparando nosso cardápio...
          </p>
        )}

        {erro && (
          <p className="status-message error-message">
            {erro}
          </p>
        )}

        {!carregando && !erro && produtosDisponiveis.length === 0 && (
          <p className="status-message">
            Nosso cardápio está sendo preparado. Volte em breve!
          </p>
        )}

        <div className="product-grid">
          {produtosDisponiveis.map((produto, index) => (
            <article className="menu-card" key={produto._id}>

              <div className={`menu-card-art art-tone-${index % 4}`}>
                {produto.imagem ? (
                  <img src={produto.imagem} alt={produto.nome} />
                ) : (
                  <div className="cup-illustration">
                    <span className="cup-steam">〰</span>
                    <span className="cup">☕</span>
                  </div>
                )}

                <span className="category-pill">
                  {produto.categoria || 'Especial da casa'}
                </span>
              </div>

              <div className="menu-card-info">
                <div>
                  <h3>{produto.nome}</h3>
                  <p>
                    {produto.descricao ||
                      'Preparado com carinho para você.'}
                  </p>
                </div>

                <strong>{formatarPreco(produto.preco)}</strong>
              </div>

            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="sobre">

        <div className="about-mark">
          N<span>✳</span>
        </div>

        <div className="about-copy">
          <span className="eyebrow">
            <i /> UM POUQUINHO SOBRE NÓS
          </span>

          <h2>
            Mais que café.
            <br />
            <em>Um lugar para ficar.</em>
          </h2>

          <p>
            O Neko Café nasceu da vontade de transformar
            a pausa do dia em um momento acolhedor.
            Aqui, cada detalhe é pensado para receber
            você com sabor, cuidado e simplicidade.
          </p>

          <a className="text-link" href="#inicio">
            Voltar ao começo ↑
          </a>
        </div>

        <div className="about-stamp">
          <span>feito com</span>
          <strong>♡</strong>
          <span>carinho</span>
        </div>

      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio">
          <img src={logo} alt="Neko Café" />

          <span className="brand-copy">
            <strong>Neko Café</strong>
            <small>um carinho em cada xícara</small>
          </span>
        </a>

        <p>Feito com carinho, uma xícara de cada vez.</p>

        <span className="footer-copy">
          © {new Date().getFullYear()} Neko Café
        </span>
      </footer>

    </main>
  )
}

export default Cardapio