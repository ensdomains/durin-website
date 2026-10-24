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

## Toolchain

Use **Node 24.22.1** (selected by `.node-version`) to execute Vite, TypeScript and Wrangler. Use **Bun 1.4.4** (pinned by `packageManager` in `package.json`) only to install dependencies from `bun.lock`. Bun is retained because `bunfig.toml` enforces a two-day minimum dependency age; using a different installer would skip that policy.

The package scripts invoke each tool explicitly through Node. Run them with Node's built-in script runner, `node --run`; Bun is not the application or tooling runtime. The deployed site consists of browser assets served by Cloudflare Workers Static Assets.

Select the pinned tools with your version manager and verify them before installing:

```bash
node --version # v24.22.1
bun --version  # 1.4.4
bun install --frozen-lockfile
```

Do not generate a second package-manager lockfile. Package metadata records the required versions; it does not install or switch your local or Cloudflare build runtime.

## Development

Copy `example.env` to `.env.local` and fill in the required frontend values. `VITE_*` values are bundled into public browser code: use frontend-safe keys with provider domain restrictions, never backend secrets.

```bash
node --run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

Type-check or build the production assets:

```bash
node --run typecheck
node --run build
```

Preview the production build locally through Wrangler, with remote bindings disabled:

```bash
node --run preview
```

## Cloudflare publishing

`wrangler.jsonc` serves `dist` as static assets with SPA fallback. Configure the Cloudflare build environment to use Node 24.22.1 and Bun 1.4.4, install with `bun install --frozen-lockfile`, then build with `node --run build`. Verify the configured production branch and tool versions in Workers Builds before publishing; this repository does not change account settings.

Maintainers can build and publish with:

```bash
node --run deploy
```

This command runs `wrangler deploy` and changes the deployed Worker. It is separate from local validation. There is no GitHub Actions workflow in this branch; the former build workflow and its intermediate validation replacement were removed.

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
