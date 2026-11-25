# Pokéguia

Aplicação React criada com Vite para consultar a [PokéAPI](https://pokeapi.co/docs/v2).

## Executar

```bash
npm install
cp .env.example .env
npm run dev
```

O app consulta o catálogo completo disponibilizado pela PokéAPI (incluindo variantes). Há busca por nome ou número, filtro por tipo, ordenação, páginas de 24 resultados e um campo para ir diretamente a qualquer página. O layout se adapta automaticamente a celulares. A rota `/pokemon/:nome` apresenta descrição, habilidades, atributos, movimentos e linha de evolução. Algumas descrições originais são fornecidas apenas em inglês pela API.

## Render

- Tipo: Static Site
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment: `VITE_API_URL=https://pokeapi.co/api/v2`
- Rewrite: `/*` → `/index.html`

O prefixo `VITE_` torna a variável disponível no código do navegador durante o build. Não coloque senhas nessa variável.
