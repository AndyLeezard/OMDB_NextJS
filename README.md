# About

A simple front-end demo project using the movies search service powered by OMDb API.

# Objectives

## UX
- Seamless responsiveness and an easy UI so clear that the user doesn't need any explanation.
- Visually attractive transitions and animations

## Tech

- Scalability
- Maintainability
- Light-weight
- Performance Optimization
- Visibility using SSR

# Refactored & Migrated to Next.js

I believe that it is important to maintain and update old front-end projects because it allows the developer to stay up-to-date in the fast-moving front-end ecosystem.

This project is currently being redesigned with [`Next.js`](https://nextjs.org/) and [`react-aria-components`](https://react-spectrum.adobe.com/react-aria/react-aria-components.html).

Previously, this project depended on [`Nx`](https://nx.dev/), [`Sass`](https://sass-lang.com/), [`Redux`](https://redux.js.org/) and [`Material-UI v4`](https://www.npmjs.com/package/@material-ui/core).

Here are the reasons behind the migration:
- `Material-UI v4` being deprecated and the migration to [`v5`](https://mui.com/material-ui/migration/migration-v4/) requiring more peer dependencies than before, it is now interesting to look for a better alternative. As of the Q2 of 2023, the `"unstyled"` components are currently being widely adopted in the industry as it provides better customization (thus visually better-fitting each project). I chose [`react-aria-components`](https://react-spectrum.adobe.com/react-aria/react-aria-components.html).
- `useContext` hook being a nice light-weight substitution of `Redux`for this demo project's use case
- `Vanilla CSS` has come a long way, and `CSS Modules` has been incredibly useful and clean, providing enough scalability and performance for most use cases. While CSS preprocessors can be useful in other cases, I personally prefer using `CSS Modules` for a better backwards-compatibility.
- `Next.JS` provides massive SSR, SSG and ISR support and image optimization, and these features are extremely important in both user-experience and the website's visibility and profitability.

# IMPORTANT

When testing, please kindly use your own API key.

# ⚒ Install using PNPM

`pnpm install`, `pnpm dev` (localhost:4200)

# ⚒ Install using Yarn

`yarn`, `yarn run dev` (localhost:4200)

# ⚒ Install using NPM

`npm install`, `npm run dev` (localhost:4200)
