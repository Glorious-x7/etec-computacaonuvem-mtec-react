# Pokéguia

Aplicação React criada com Vite para explorar Pokémon.

## Executar

```bash
npm install
cp .env.example .env
npm run dev
```

O catálogo inclui Pokémon e variantes. É possível buscar por nome ou número, filtrar por tipo e por região (de Kanto a Paldea), ordenar e ir diretamente a qualquer página. O layout se adapta automaticamente a celulares. A rota `/pokemon/:nome` apresenta descrição em português, habilidades, atributos, movimentos e linha de evolução.

## Render

- Tipo: Static Site
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment: `VITE_API_URL=https://pokeapi.co/api/v2`
- Rewrite: `/*` → `/index.html`

O prefixo `VITE_` torna a variável disponível no código do navegador durante o build. Não coloque senhas nessa variável.
