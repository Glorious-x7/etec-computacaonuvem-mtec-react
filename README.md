# Pokéguia

Aplicação React criada com Vite para consultar a [PokéAPI](https://pokeapi.co/docs/v2).

## Executar

```bash
npm install
cp .env.example .env
npm run dev
```

O app lista os primeiros 151 Pokémon e apresenta detalhes em `/pokemon/:nome`.

## Render

- Tipo: Static Site
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment: `VITE_API_URL=https://pokeapi.co/api/v2`
- Rewrite: `/*` → `/index.html`

O prefixo `VITE_` torna a variável disponível no código do navegador durante o build. Não coloque senhas nessa variável.
