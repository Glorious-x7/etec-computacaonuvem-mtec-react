export const API = (import.meta.env.VITE_API_URL || 'https://pokeapi.co/api/v2').replace(/\/$/, '')
export const PAGE_SIZE = 24

export const regions = [
  { id: 'all', label: 'Todas', start: 1, end: Infinity },
  { id: 'kanto', label: 'Kanto', start: 1, end: 151 },
  { id: 'johto', label: 'Johto', start: 152, end: 251 },
  { id: 'hoenn', label: 'Hoenn', start: 252, end: 386 },
  { id: 'sinnoh', label: 'Sinnoh', start: 387, end: 493 },
  { id: 'unova', label: 'Unova', start: 494, end: 649 },
  { id: 'kalos', label: 'Kalos', start: 650, end: 721 },
  { id: 'alola', label: 'Alola', start: 722, end: 809 },
  { id: 'galar', label: 'Galar', start: 810, end: 905 },
  { id: 'paldea', label: 'Paldea', start: 906, end: 1025 },
]

export const types = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

export const typeNames = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico', grass: 'Planta',
  ice: 'Gelo', fighting: 'Lutador', poison: 'Venenoso', ground: 'Terra', flying: 'Voador',
  psychic: 'Psíquico', bug: 'Inseto', rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão',
  dark: 'Sombrio', steel: 'Aço', fairy: 'Fada',
}

export const statNames = {
  hp: 'Vida', attack: 'Ataque', defense: 'Defesa',
  'special-attack': 'Atq. especial', 'special-defense': 'Def. especial', speed: 'Velocidade',
}

export const habitatNames = {
  cave: 'Caverna', forest: 'Floresta', grassland: 'Campo', mountain: 'Montanha',
  rare: 'Raro', 'rough-terrain': 'Terreno rochoso', sea: 'Mar', urban: 'Cidade',
  'waters-edge': 'Margem da água',
}

export const fieldNotes = {
  bulbasaur: 'A semente em suas costas cresce junto com ele. É o primeiro registro da região de Kanto.',
  charmander: 'A chama na ponta da cauda acompanha sua energia. É a primeira forma da linha de Charizard.',
  squirtle: 'Seu casco serve de proteção e ajuda a se mover com agilidade na água.',
  pikachu: 'Armazena eletricidade nas bochechas e a libera em pequenas descargas.',
  charizard: 'Voa sobre montanhas e lança chamas intensas. É a evolução final de Charmander.',
  eevee: 'Seu potencial de evolução permite que assuma formas de vários tipos.',
  mewtwo: 'Um Pokémon lendário de Kanto conhecido por seus poderes psíquicos.',
  sprigatito: 'Este Pokémon de Paldea libera um aroma agradável ao esfregar as patas dianteiras.',
}

export const formatName = (name = '') => name.replaceAll('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase())
export const numberFromUrl = (url) => Number(url.match(/\/(\d+)\/?$/)?.[1] || 0)
export const artwork = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
export const sprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

export function descriptionFor(species) {
  const entries = species?.flavor_text_entries || []
  const chosen = [...entries].reverse().find(entry => entry.language.name === 'pt')
  return chosen ? {
    text: chosen.flavor_text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim(),
    language: chosen.language.name,
    version: formatName(chosen.version.name),
  } : null
}

export function evolutionStages(chain) {
  if (!chain) return []
  const stages = []
  function visit(node, depth = 0) {
    const condition = node.evolution_details?.[0]
    stages.push({
      id: numberFromUrl(node.species.url), name: node.species.name, depth,
      condition: condition?.min_level ? `Nível ${condition.min_level}`
        : condition?.item ? `Item: ${formatName(condition.item.name)}`
          : condition?.trigger?.name === 'trade' ? 'Troca'
            : condition?.trigger ? formatName(condition.trigger.name) : '',
    })
    node.evolves_to?.forEach(next => visit(next, depth + 1))
  }
  visit(chain)
  return stages
}

export function filteredEntries(list, query, typeSet, order, region = regions[0]) {
  const term = query.trim().toLowerCase()
  const result = list.filter(entry => {
    const id = numberFromUrl(entry.url)
    return id >= region.start && id <= region.end
      && (!term || entry.name.includes(term) || String(id) === term)
      && (!typeSet || typeSet.has(entry.name))
  })
  return order === 'name'
    ? result.sort((a, b) => a.name.localeCompare(b.name))
    : result.sort((a, b) => numberFromUrl(a.url) - numberFromUrl(b.url))
}
