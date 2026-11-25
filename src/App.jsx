import { useEffect, useState } from 'react'
import './App.css'

const API = (import.meta.env.VITE_API_URL || 'https://pokeapi.co/api/v2').replace(/\/$/, '')
const image = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

function App() {
  const [path, setPath] = useState(location.pathname)
  const [list, setList] = useState([])
  const [detail, setDetail] = useState(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const name = path.match(/^\/pokemon\/([a-z0-9-]+)\/?$/)?.[1]

  useEffect(() => {
    const update = () => setPath(location.pathname)
    addEventListener('popstate', update)
    return () => removeEventListener('popstate', update)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(name ? `${API}/pokemon/${name}` : `${API}/pokemon?limit=151`, { signal: controller.signal })
        if (!response.ok) throw new Error(response.status === 404 ? 'Pokémon não encontrado.' : 'Não foi possível carregar os dados.')
        const data = await response.json()
        if (name) setDetail(data)
        else setList(data.results)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Falha de conexão.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [name])

  function go(to) {
    history.pushState({}, '', to)
    setPath(to)
    scrollTo(0, 0)
  }

  const shown = list.filter(item => item.name.includes(query.trim().toLowerCase()))
  return <>
    <header><button className="logo" onClick={() => go('/')}>Poké<span>guia</span></button><small>Uma enciclopédia conectada à PokéAPI</small></header>
    <main>{name ? <section className="detail wrap">
      <button className="back" onClick={() => go('/')}>← Voltar à lista</button>
      {loading && <p role="status">Carregando detalhes…</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {!loading && !error && detail && <div className="detail-grid">
        <div className="picture"><span>#{String(detail.id).padStart(3, '0')}</span><img src={detail.sprites.other['official-artwork'].front_default || image(detail.id)} alt={`Ilustração de ${detail.name}`} /></div>
        <div><p className="kicker">Ficha do Pokémon</p><h1>{detail.name}</h1><div className="types">{detail.types.map(({type}) => <span key={type.name}>{type.name}</span>)}</div>
          <dl><div><dt>Altura</dt><dd>{(detail.height/10).toLocaleString('pt-BR')} m</dd></div><div><dt>Peso</dt><dd>{(detail.weight/10).toLocaleString('pt-BR')} kg</dd></div><div><dt>Habilidades</dt><dd>{detail.abilities.map(({ability}) => ability.name).join(', ')}</dd></div></dl>
          <h2>Atributos</h2><ul className="stats">{detail.stats.map(({stat,base_stat}) => <li key={stat.name}><span>{stat.name}</span><strong>{base_stat}</strong><meter min="0" max="180" value={Math.min(base_stat,180)} /></li>)}</ul>
        </div>
      </div>}
    </section> : <>
      <section className="hero"><div className="wrap hero-grid"><div><p className="kicker">Explore os primeiros 151</p><h1>Conheça cada<br /><em>Pokémon.</em></h1><p>Pesquise pelo nome e abra uma ficha para ver tipos, habilidades e atributos. Os dados vêm de uma API pública.</p><label htmlFor="search">Buscar Pokémon</label><input id="search" type="search" placeholder="Ex.: pikachu" value={query} onChange={e => setQuery(e.target.value)} /></div><div className="mark" aria-hidden="true"><b>151</b><span>descobertas<br />para explorar</span></div></div></section>
      <section className="catalog wrap"><div className="catalog-head"><h2>Lista de Pokémon</h2><span>{shown.length} resultados</span></div>
        {loading && <p role="status">Carregando Pokémon…</p>}{error && <p role="alert" className="error">{error}</p>}
        {!loading && !error && (shown.length ? <div className="cards">{shown.map(item => { const id = Number(item.url.match(/\/pokemon\/(\d+)\//)?.[1]); return <button className="card" key={item.name} onClick={() => go(`/pokemon/${item.name}`)}><span>#{String(id).padStart(3,'0')}</span><img loading="lazy" src={image(id)} alt="" /><strong>{item.name}</strong><span className="arrow" aria-hidden="true">↗</span></button> })}</div> : <p>Nenhum Pokémon encontrado. Tente outro nome.</p>)}
      </section>
    </>}</main>
    <footer>Projeto de estudo · Dados: <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a></footer>
  </>
}
export default App
