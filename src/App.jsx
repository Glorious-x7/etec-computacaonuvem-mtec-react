import { useEffect, useMemo, useState } from 'react'
import {
  API, PAGE_SIZE, artwork, descriptionFor, evolutionStages, filteredEntries,
  formatName, habitatNames, numberFromUrl, sprite, statNames, typeNames, types,
} from './pokemon.js'
import './App.css'

async function getJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(response.status === 404 ? 'Pokémon não encontrado.' : 'A PokéAPI não respondeu. Tente novamente.')
  return response.json()
}

function PokemonArt({ id, name, className = '' }) {
  const [source, setSource] = useState(artwork(id))
  if (!source) return <span className={`art-fallback ${className}`} aria-label={`Sem imagem de ${name}`}>#{id}</span>
  return <img className={className} src={source} alt={`Ilustração de ${formatName(name)}`}
    loading="lazy" onError={() => setSource(source === artwork(id) ? sprite(id) : '')} />
}

function App() {
  const [path, setPath] = useState(location.pathname)
  const [entries, setEntries] = useState([])
  const [catalogError, setCatalogError] = useState('')
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogTry, setCatalogTry] = useState(0)
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [typeSet, setTypeSet] = useState(null)
  const [typeLoading, setTypeLoading] = useState(false)
  const [typeError, setTypeError] = useState('')
  const [order, setOrder] = useState('number')
  const [page, setPage] = useState(1)
  const [jumpPage, setJumpPage] = useState('')
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [detailTry, setDetailTry] = useState(0)
  const name = path.match(/^\/pokemon\/([a-z0-9-]+)\/?$/)?.[1]

  useEffect(() => {
    const update = () => setPath(location.pathname)
    addEventListener('popstate', update)
    return () => removeEventListener('popstate', update)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    getJson(`${API}/pokemon?limit=2000`, controller.signal)
      .then(data => setEntries(data.results))
      .catch(error => { if (error.name !== 'AbortError') setCatalogError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setCatalogLoading(false) })
    return () => controller.abort()
  }, [catalogTry])

  useEffect(() => {
    if (selectedType === 'all') return
    const controller = new AbortController()
    getJson(`${API}/type/${selectedType}`, controller.signal)
      .then(data => setTypeSet(new Set(data.pokemon.map(item => item.pokemon.name))))
      .catch(error => { if (error.name !== 'AbortError') setTypeError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setTypeLoading(false) })
    return () => controller.abort()
  }, [selectedType])

  useEffect(() => {
    if (!name) return
    const controller = new AbortController()
    async function load() {
      setDetailLoading(true)
      setDetailError('')
      setDetail(null)
      try {
        let pokemon
        try {
          pokemon = await getJson(`${API}/pokemon/${name}`, controller.signal)
        } catch (error) {
          if (error.message !== 'Pokémon não encontrado.') throw error
          const species = await getJson(`${API}/pokemon-species/${name}`, controller.signal)
          const variety = species.varieties.find(item => item.is_default)?.pokemon.name
          if (!variety) throw error
          pokemon = await getJson(`${API}/pokemon/${variety}`, controller.signal)
        }
        let species = null
        let evolution = []
        try {
          species = await getJson(pokemon.species.url, controller.signal)
          if (species.evolution_chain?.url) {
            const chain = await getJson(species.evolution_chain.url, controller.signal)
            evolution = evolutionStages(chain.chain)
          }
        } catch (error) {
          if (error.name === 'AbortError') throw error
          // Basic Pokémon data remains usable if optional species data fails.
        }
        if (!controller.signal.aborted) setDetail({ pokemon, species, evolution })
      } catch (error) {
        if (error.name !== 'AbortError') setDetailError(error.message)
      } finally {
        if (!controller.signal.aborted) setDetailLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [name, detailTry])

  function go(to) {
    history.pushState({}, '', to)
    setPath(to)
    scrollTo({ top: 0, behavior: 'auto' })
  }

  function moveToPage(nextPage) {
    setPage(nextPage)
    document.getElementById('catalog-title')?.scrollIntoView({ behavior: 'smooth' })
  }

  function jumpToPage(event) {
    event.preventDefault()
    const nextPage = Number(jumpPage)
    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > pageCount) return
    moveToPage(nextPage)
    setJumpPage('')
  }

  const shown = useMemo(() => filteredEntries(entries, query, selectedType === 'all' ? null : typeSet, order), [entries, query, typeSet, selectedType, order])
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageEntries = shown.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const resultStart = shown.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0
  const resultEnd = Math.min(currentPage * PAGE_SIZE, shown.length)
  const displayCount = entries.length.toLocaleString('pt-BR')

  return <div className="app-shell">
    <header className="topbar"><div className="topbar-inner"><button className="logo" onClick={() => go('/')} aria-label="Pokéguia, ir ao catálogo"><span className="logo-mark" aria-hidden="true" />Poké<span>guia</span></button><nav aria-label="Navegação principal"><button onClick={() => go('/')} className={!name ? 'active' : ''}>Catálogo</button><a href="https://pokeapi.co/" target="_blank" rel="noreferrer">Sobre a API ↗</a></nav></div></header>
    <main>{name ? <>
      <div className="detail-heading"><div className="wrap"><button className="back" onClick={() => go('/')}>← Voltar ao catálogo</button><p>Pokédex / Ficha</p></div></div>
      <div className="wrap detail-page">
        {detailLoading && <div className="loading-block" role="status">Carregando ficha do Pokémon…</div>}
        {detailError && <div className="error-block" role="alert"><p>{detailError}</p><button onClick={() => setDetailTry(value => value + 1)}>Tentar novamente</button></div>}
        {detail && !detailLoading && <Detail data={detail} go={go} />}
      </div>
    </> : <>
      <section className="hero"><div className="wrap hero-inner"><div><p className="hero-label">Pokédex para explorar</p><h1>Um mundo inteiro<br />de <em>Pokémon.</em></h1><p>Encontre espécies e variantes, explore suas habilidades e acompanhe cada linha de evolução.</p></div><div className="hero-count"><strong>{catalogLoading ? '…' : displayCount}</strong><span>entradas para descobrir</span></div></div></section>
      <section className="catalog wrap" aria-labelledby="catalog-title">
        <div className="catalog-title"><div><h2 id="catalog-title">Catálogo</h2><p>Pesquise por nome ou número. Os dados são carregados da PokéAPI.</p></div><span>{catalogLoading ? 'Carregando…' : `${displayCount} Pokémon e variantes`}</span></div>
        <div className="filters"><div className="search-control"><label htmlFor="search">Buscar Pokémon</label><input id="search" type="search" placeholder="Nome ou número, ex.: pikachu ou 25" value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} /></div><div><label htmlFor="type">Tipo</label><select id="type" value={selectedType} onChange={event => { const next = event.target.value; setSelectedType(next); setTypeSet(null); setTypeLoading(next !== 'all'); setTypeError(''); setPage(1) }}><option value="all">Todos os tipos</option>{types.map(type => <option key={type} value={type}>{typeNames[type]}</option>)}</select></div><div><label htmlFor="order">Ordenar</label><select id="order" value={order} onChange={event => { setOrder(event.target.value); setPage(1) }}><option value="number">Número</option><option value="name">Nome A–Z</option></select></div></div>
        {catalogLoading && <div className="loading-block" role="status">Carregando catálogo…</div>}
        {catalogError && <div className="error-block" role="alert"><p>{catalogError}</p><button onClick={() => { setCatalogLoading(true); setCatalogError(''); setCatalogTry(value => value + 1) }}>Tentar novamente</button></div>}
        {typeLoading && <div className="loading-block" role="status">Filtrando por tipo…</div>}
        {typeError && <div className="error-block" role="alert"><p>{typeError}</p><button onClick={() => { setSelectedType('all'); setTypeSet(null) }}>Mostrar todos</button></div>}
        {!catalogLoading && !catalogError && !typeLoading && !typeError && <>
          <div className="result-line" role="status"><span>{shown.length.toLocaleString('pt-BR')} resultados</span><span>{resultStart}–{resultEnd} de {shown.length.toLocaleString('pt-BR')}</span></div>
          {pageEntries.length ? <div className="cards">{pageEntries.map(item => { const id = numberFromUrl(item.url); return <button className="card" key={item.name} onClick={() => go(`/pokemon/${item.name}`)}><span className="card-number">#{String(id).padStart(3, '0')}</span><PokemonArt key={id} id={id} name={item.name} /><strong>{formatName(item.name)}</strong><span className="card-arrow" aria-hidden="true">↗</span></button> })}</div> : <div className="empty-block"><h3>Nenhum resultado</h3><p>Tente outro nome, número ou tipo.</p><button onClick={() => { setQuery(''); setSelectedType('all'); setTypeSet(null); setPage(1) }}>Limpar filtros</button></div>}
          {pageCount > 1 && <nav className="pagination" aria-label="Páginas do catálogo"><div className="page-controls"><button disabled={currentPage === 1} onClick={() => moveToPage(currentPage - 1)}>← Anterior</button><span>Página {currentPage} de {pageCount}</span><button disabled={currentPage === pageCount} onClick={() => moveToPage(currentPage + 1)}>Próxima →</button></div><form className="page-jump" onSubmit={jumpToPage}><label htmlFor="jump-page">Ir para página</label><input id="jump-page" type="number" inputMode="numeric" min="1" max={pageCount} value={jumpPage} onChange={event => setJumpPage(event.target.value)} required /><button type="submit">Ir</button></form></nav>}
        </>}
      </section>
    </>}</main>
    <footer><div className="wrap footer-inner"><span>Pokéguia · Projeto de estudo</span><span>Dados e imagens: <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI ↗</a></span></div></footer>
  </div>
}

function Detail({ data, go }) {
  const { pokemon, species, evolution } = data
  const description = descriptionFor(species)
  const generation = species?.generation?.name.replace('generation-', '').toUpperCase()
  const genus = species?.genera?.find(item => item.language.name === 'en')?.genus
  const categories = [species?.is_legendary && 'Lendário', species?.is_mythical && 'Mítico', species?.is_baby && 'Bebê'].filter(Boolean)
  return <>
    <section className="profile"><div className="profile-art"><span className="profile-number">#{String(pokemon.id).padStart(3, '0')}</span><PokemonArt key={pokemon.id} id={pokemon.id} name={pokemon.name} /></div><div className="profile-main"><p className="profile-kicker">{genus || 'Ficha Pokémon'}</p><h1>{formatName(pokemon.name)}</h1><div className="types">{pokemon.types.map(({ type }) => <span className={`type type-${type.name}`} key={type.name}>{typeNames[type.name] || formatName(type.name)}</span>)}{categories.map(category => <span className="category" key={category}>{category}</span>)}</div><p className="description">{description?.text || 'Não há descrição disponível para este Pokémon.'}</p>{description?.language === 'en' && <p className="description-note">Descrição original em inglês · {description.version}</p>}</div></section>
    <div className="detail-columns"><div className="detail-left"><section className="detail-section"><h2>Informações</h2><dl className="facts"><div><dt>Altura</dt><dd>{(pokemon.height / 10).toLocaleString('pt-BR')} m</dd></div><div><dt>Peso</dt><dd>{(pokemon.weight / 10).toLocaleString('pt-BR')} kg</dd></div><div><dt>Experiência base</dt><dd>{pokemon.base_experience ?? '—'}</dd></div><div><dt>Geração</dt><dd>{generation || '—'}</dd></div><div><dt>Habitat</dt><dd>{species?.habitat ? habitatNames[species.habitat.name] || formatName(species.habitat.name) : 'Não informado'}</dd></div><div><dt>Taxa de captura</dt><dd>{species?.capture_rate ?? '—'} / 255</dd></div></dl></section><section className="detail-section"><h2>Habilidades</h2><ul className="simple-list">{pokemon.abilities.map(({ ability, is_hidden }) => <li key={ability.name}><span>{formatName(ability.name)}</span>{is_hidden && <small>Oculta</small>}</li>)}</ul></section><section className="detail-section"><h2>Movimentos</h2><p className="section-note">Alguns dos {pokemon.moves.length} movimentos registrados · nomes originais da API</p><div className="moves">{pokemon.moves.slice(0, 12).map(({ move }) => <span key={move.name}>{formatName(move.name)}</span>)}</div></section></div>
      <div className="detail-right"><section className="detail-section"><h2>Atributos base</h2><ul className="stats">{pokemon.stats.map(({ stat, base_stat }) => <li key={stat.name}><span>{statNames[stat.name] || formatName(stat.name)}</span><meter min="0" max="255" value={base_stat} aria-label={`${statNames[stat.name] || stat.name}: ${base_stat}`} /><strong>{base_stat}</strong></li>)}</ul><p className="stat-total">Total <strong>{pokemon.stats.reduce((sum, item) => sum + item.base_stat, 0)}</strong></p></section><section className="detail-section evolution-section"><h2>Linha de evolução</h2>{evolution.length ? <div className="evolution-list">{evolution.map(stage => <button key={stage.name} className={stage.name === pokemon.species.name ? 'current' : ''} onClick={() => go(`/pokemon/${stage.name}`)}><span className="evolution-art"><PokemonArt key={stage.id} id={stage.id} name={stage.name} /></span><span className="evolution-info"><strong>{formatName(stage.name)}</strong><small>{stage.condition || (stage.depth === 0 ? 'Forma inicial' : 'Evolução')}</small></span><span aria-hidden="true">↗</span></button>)}</div> : <p className="section-note">Linha de evolução não disponível.</p>}</section>{species?.varieties?.length > 1 && <section className="detail-section"><h2>Outras formas</h2><div className="varieties">{species.varieties.map(item => <button key={item.pokemon.name} onClick={() => go(`/pokemon/${item.pokemon.name}`)}>{formatName(item.pokemon.name)} ↗</button>)}</div></section>}</div></div>
  </>
}

export default App
