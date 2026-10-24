# Durin Website

The official website for [Durin](https://durin.dev) - an ENS protocol for issuing subdomains on Layer 2 blockchains.

## Overview

This repository contains the frontend application for Durin, allowing users to deploy their own L2 subname service by:

- Deploying L2 Registry contracts
- Configuring the ENS resolvers
- Connecting L1 resolvers to L2 registries
- Minting and managing ENS subdomains on Layer 2 networks

## Related Resources

- **Website source**: [ensdomains/durin-website](https://github.com/ensdomains/durin-website)
- **Smart Contracts**: The Durin protocol contracts are available at [github.com/ensdomains/durin](https://github.com/ensdomains/durin)
- **Live Website**: The application is deployed at [durin.dev](https://durin.dev) on Cloudflare

## Development

The default branch currently contains the [Next.js](https://nextjs.org) application. Use the Node version in `.node-version` and copy `example.env` to `.env.local`, then fill in the required values.

```bash
# Install dependencies
npm ci

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare hosting

The live site is hosted on Cloudflare. Its Vite/React migration is tracked in [PR #9](https://github.com/ensdomains/durin-website/pull/9) on the [`vite-cloudflare-migration` branch](https://github.com/ensdomains/durin-website/tree/vite-cloudflare-migration); that configuration is not yet on the default branch.

On the migration branch, `wrangler.jsonc` names the Worker `durin-website` and serves `./dist` as static assets with single-page application fallback. Its package scripts use Bun:

```bash
bun install --frozen-lockfile
bun run build
bun run preview
```

`build` runs TypeScript checks and Vite; `preview` builds and starts Wrangler locally. The `deploy` script builds and runs `wrangler deploy`. Production publishing is a separate maintainer action.

Set the `VITE_*` build variables described in that branch's `example.env` in Cloudflare Workers Builds. Those values are included in the client bundle; use frontend keys with appropriate domain restrictions. The default branch has no Wrangler configuration or Cloudflare deployment script, so its `npm run build` output is not the migration's `dist` bundle.

## Technology Stack

- Next.js 15
- RainbowKit for wallet connection
- Wagmi/Viem for blockchain interactions
- TailwindCSS for styling
- TypeScript

## Supported Networks

Durin supports multiple Layer 2 networks, including:

- Base
- Optimism
- Arbitrum
- Scroll
- Linea
- Celo
- Polygon
- World Chain
