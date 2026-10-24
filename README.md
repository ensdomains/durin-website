# Durin Website

The official website for [Durin](https://durin.dev), an ENS protocol for issuing subdomains on Layer 2 blockchains.

## Overview

This repository contains the frontend application for Durin, allowing users to deploy their own L2 subname service by:

- Deploying L2 Registry contracts
- Configuring the ENS resolvers
- Connecting L1 resolvers to L2 registries
- Minting and managing ENS subdomains on Layer 2 networks

## Related Resources

- **Website source**: [ensdomains/durin-website](https://github.com/ensdomains/durin-website)
- **Smart Contracts**: The Durin protocol contracts are available at [github.com/ensdomains/durin](https://github.com/ensdomains/durin)
- **Live website**: [durin.dev](https://durin.dev), hosted on Cloudflare Workers as static assets

## Development

Use **Node 24.22.1** from `.node-version` and **Bun 1.4.4** from `package.json`. Bun installs dependencies and runs package scripts; the Vite, TypeScript and Wrangler CLIs use Node. The existing `bun.lock` and two-day minimum dependency age in `bunfig.toml` remain the install policy.

Copy `example.env` to `.env.local` and fill in the frontend values. `VITE_*` values are public browser code: use frontend-safe keys with domain restrictions, never backend secrets.

```bash
bun install --frozen-lockfile
bun run dev
```

Open [http://localhost:5173](http://localhost:5173). Check types, build, or preview the built site locally:

```bash
bun run typecheck
bun run build
bun run preview
```

## Cloudflare publishing

`wrangler.jsonc` serves `dist` as static assets with SPA fallback. Workers Builds should use the pinned Node/Bun versions, `bun install --frozen-lockfile` and `bun run build`. Verify its production branch and tool versions before publishing; package metadata alone does not verify account settings.

Maintainers can publish with `bun run deploy`; it builds and runs `wrangler deploy`. Local preview uses Wrangler with remote bindings disabled. There is no GitHub Actions workflow in this branch.

## Technology Stack

- Vite and React
- RainbowKit for wallet connection
- Wagmi/Viem for blockchain interactions
- Tailwind CSS for styling
- TypeScript
- Cloudflare Workers Static Assets for hosting

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
