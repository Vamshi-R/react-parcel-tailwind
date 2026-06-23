# React + Parcel + Tailwind CSS Starter

A lightweight React application bundled with [Parcel](https://parceljs.org/) and styled with [Tailwind CSS](https://tailwindcss.com/). It ships with a clean, scalable folder structure for utilities, constants, custom hooks and state management.

## Tech Stack

- **React 18** – UI library
- **Parcel 2** – zero-config bundler & dev server
- **Tailwind CSS 3** – utility-first styling (configured via PostCSS)

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server (with hot reloading):

```bash
npm start
```

Parcel serves the app at http://localhost:1234 by default.

Build for production:

```bash
npm run build
```

The optimized output is generated in the `dist/` folder.

Clean build artifacts and cache:

```bash
npm run clean
```

## Project Structure

```
react-parcel-app/
├── src/
│   ├── components/        # Reusable UI components
│   │   └── Counter.jsx
│   ├── constants/         # App-wide constant values
│   │   └── app.js
│   ├── hooks/             # Custom React hooks
│   │   └── useLocalStorage.js
│   ├── store/             # State management (Context + useReducer)
│   │   └── AppContext.jsx
│   ├── utils/             # Pure helper/utility functions
│   │   └── number.js
│   ├── App.jsx            # Root component
│   ├── index.css          # Tailwind directives
│   ├── index.html         # HTML entry point (Parcel source)
│   └── index.js           # React entry / app bootstrap
├── .gitignore
├── .postcssrc             # PostCSS config (loads Tailwind)
├── package.json
├── README.md
└── tailwind.config.js     # Tailwind configuration
```

## Folder Conventions

| Folder         | Purpose                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `components/`  | Presentational and container React components.                          |
| `constants/`   | Static values shared across the app (config, enums, storage keys).      |
| `hooks/`       | Reusable stateful logic extracted into custom hooks.                    |
| `store/`       | Global state management using React Context and `useReducer`.           |
| `utils/`       | Framework-agnostic pure functions and helpers.                          |

## Tailwind CSS

Tailwind is wired up through PostCSS (`.postcssrc`). The directives in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Content scanning is configured in `tailwind.config.js` to include all files under `src/`.

## Parcel Bundler — Study Notes

> A focused, practical reference for understanding how Parcel powers this project.

### 1. What is Parcel?

Parcel is a **zero-configuration web application bundler**. A *bundler* takes your
source files (JS/JSX, CSS, HTML, images, etc.), resolves how they depend on each
other, transforms them, and outputs optimized files a browser can run.

Key characteristics:

- **Zero config** – sensible defaults; no `webpack.config.js` equivalent needed.
- **Multi-core compilation** – parallelizes work across CPU cores for speed.
- **Filesystem cache** – the `.parcel-cache/` folder makes rebuilds near-instant.
- **Auto-installs transformers** – detects file types and configures tooling for you.
- **HMR (Hot Module Replacement)** – updates modules in the browser without a full reload.

### 2. The Entry Point Model

Unlike many bundlers that start from a JavaScript file, Parcel can start from an
**HTML file** as the entry point. In this project:

```jsonc
// package.json
"source": "src/index.html"
```

Parcel reads `src/index.html`, follows the `<script type="module" src="./index.js">`
tag, then walks the entire dependency graph from there (JS → CSS → assets).

```
index.html  ──▶  index.js  ──▶  App.jsx  ──▶  components / store / pages …
      │
      └──▶  (linked styles, favicons, images are also discovered)
```

### 3. How the Dependency Graph is Built

1. Parcel parses the entry file and finds dependencies (`import`, `require`,
   `<script>`, `<link>`, `url()` in CSS, etc.).
2. Each discovered file becomes an **asset**.
3. Assets are run through the matching **transformer** (e.g. Babel/SWC for JSX,
   PostCSS for CSS).
4. Transformed assets are grouped into **bundles**.
5. Bundles are written to the output directory (`dist/`) with content hashes for
   cache-busting in production.

### 4. Transformers, Resolvers & Plugins

Parcel's pipeline is made of plugin types. The ones relevant here:

| Plugin type     | Role                                                        | In this project                          |
| --------------- | ----------------------------------------------------------- | ---------------------------------------- |
| **Transformer** | Converts a single asset (compile, transpile, minify).       | `@parcel/transformer-postcss` for CSS.   |
| **Resolver**    | Turns an `import` specifier into a file path.               | Default Node-style resolution.           |
| **Bundler**     | Decides how assets are grouped into output bundles.         | Default.                                 |
| **Packager**    | Serializes a bundle into its final file format.             | Default.                                 |
| **Optimizer**   | Post-processes a bundle (minify, tree-shake).               | Default (in `build`).                    |

PostCSS (and therefore Tailwind) is enabled simply because a `.postcssrc` file
exists — Parcel detects it and wires up `@parcel/transformer-postcss` automatically.

### 5. Dev Server vs Production Build

| Aspect            | `npm start` (parcel)                  | `npm run build` (parcel build)        |
| ----------------- | ------------------------------------- | ------------------------------------- |
| Goal              | Fast feedback loop                    | Smallest, fastest output              |
| Server            | Dev server on http://localhost:1234   | None — writes files only              |
| HMR               | Enabled                               | Disabled                              |
| Source maps       | Enabled                               | Enabled (separate `.map` files)       |
| Minification      | Off                                   | On                                    |
| Tree shaking      | Limited                               | Full                                  |
| Output            | Served from memory/cache              | `dist/` folder                        |

### 6. Scripts in This Project

```jsonc
"scripts": {
  "start": "parcel",                       // dev server + HMR
  "build": "parcel build",                 // optimized production bundle
  "clean": "rimraf dist .parcel-cache"     // wipe output + cache
}
```

- `parcel` with no args uses the `source` field as the entry.
- `parcel build` enables optimizations and disables the dev server.
- `clean` is useful when a stale cache causes unexpected behavior.

### 7. Caching: `.parcel-cache/`

Parcel stores intermediate compilation results here so subsequent builds only
re-process **changed** files. This dramatically speeds up restarts.

- Safe to delete at any time (it will be regenerated).
- Should be **git-ignored** (along with `dist/`).
- If you ever see "phantom" build issues, clearing it (`npm run clean`) is the
  first thing to try.

### 8. Asset Handling

Parcel understands many asset types out of the box:

- **JS / JSX / TS / TSX** – transpiled automatically (no Babel config required).
- **CSS / PostCSS** – processed; `@import` and `url()` are followed.
- **Images / fonts** – copied to `dist/` and rewritten with hashed URLs.
- **JSON / WASM / and more** – importable directly.

Importing a non-code asset returns a URL string you can use in `src`/`href`.

### 9. Environment Variables

Parcel reads `.env` files automatically and exposes variables on
`process.env.*`. Only variables you reference in code are inlined at build time.

```js
const apiUrl = process.env.API_URL;
```

> Note: this project already includes the `process` polyfill in devDependencies,
> which Parcel uses when browser code references `process`.

### 10. Common Gotchas

- **Stale cache** → run `npm run clean`.
- **Client-side routing 404 on refresh** → a production static host must fall
  back to `index.html` (Parcel's dev server handles this automatically).
- **Asset not updating** → ensure it's actually imported/linked so Parcel tracks it.
- **Multiple HTML entries** → list them in `source` as an array if needed.

### 11. Parcel vs Other Bundlers (Quick Mental Model)

| Tool       | Config burden | Entry point | Dev server | Notable for                    |
| ---------- | ------------- | ----------- | ---------- | ------------------------------ |
| **Parcel** | None default  | HTML or JS  | Built-in   | Zero-config, auto transformers |
| Webpack    | High          | JS          | Plugin     | Maximum flexibility            |
| Vite       | Low           | HTML        | Built-in   | Native ESM + esbuild dev speed |

### 12. Further Reading

- Official docs: https://parceljs.org/
- Plugin system: https://parceljs.org/plugin-system/overview/
- Production builds: https://parceljs.org/features/production/

## Webpack Bundler — Study Notes

> A focused, practical reference for understanding Webpack. This project does **not**
> use Webpack (it uses Parcel), but these notes are useful for comparison and for
> projects where Webpack is the bundler of choice.

### 1. What is Webpack?

Webpack is a **highly configurable static module bundler** for JavaScript
applications. It builds a dependency graph from one or more entry points and
emits one or more output **bundles**.

Key characteristics:

- **Config-driven** – behavior is defined in `webpack.config.js`.
- **Everything is a module** – JS, CSS, images, fonts are all modules via loaders.
- **Powerful plugin system** – hooks into nearly every step of the build.
- **Code splitting** – first-class support for splitting bundles on demand.
- **Mature ecosystem** – huge selection of loaders and plugins.

### 2. The Five Core Concepts

| Concept       | What it does                                                        |
| ------------- | ------------------------------------------------------------------ |
| **Entry**     | The starting module(s) for the dependency graph.                   |
| **Output**    | Where/how to emit bundles (path, filename, hashing).               |
| **Loaders**   | Transform non-JS files into modules (transpile, inline, etc.).     |
| **Plugins**   | Tap into the build lifecycle for broader tasks (HTML, define env). |
| **Mode**      | `development` or `production` presets that toggle optimizations.   |

### 3. A Minimal Config

```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',                 // or 'production'
  entry: './src/index.js',            // dependency graph root
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,                      // wipe dist/ before each build
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,              // JS/JSX
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,               // CSS pipeline
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|woff2?)$/,
        type: 'asset/resource',       // built-in asset modules
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],      // import without file extension
  },
};
```

### 4. Loaders vs Plugins (the key distinction)

- **Loaders** operate on **a single file/module** as it is imported. They run
  bottom-up, right-to-left in the `use` array.

  ```js
  use: ['style-loader', 'css-loader', 'postcss-loader']
  // execution order: postcss-loader → css-loader → style-loader
  ```

- **Plugins** operate on the **whole bundle/compilation**. They can emit files,
  inject env vars, generate HTML, extract CSS, etc.

Common loaders: `babel-loader`, `css-loader`, `style-loader`, `postcss-loader`,
`ts-loader`, `sass-loader`.

Common plugins: `HtmlWebpackPlugin`, `MiniCssExtractPlugin`, `DefinePlugin`,
`CleanWebpackPlugin` (or `output.clean`), `CopyWebpackPlugin`.

### 5. Dev Server & HMR

`webpack-dev-server` provides a development server with live reload and
Hot Module Replacement:

```js
// webpack.config.js
devServer: {
  static: './dist',
  hot: true,
  port: 3000,
  historyApiFallback: true,  // SPA: serve index.html on unknown routes
},
```

```jsonc
// package.json
"scripts": {
  "start": "webpack serve --mode development",
  "build": "webpack --mode production"
}
```

`historyApiFallback: true` is the Webpack equivalent of the SPA-refresh fix that
Parcel's dev server handles automatically.

### 6. Code Splitting

Three main ways to split bundles:

1. **Multiple entry points** – list several entries in `entry`.
2. **Dynamic `import()`** – splits a chunk that loads on demand:

   ```js
   const About = React.lazy(() => import('./pages/About'));
   ```

3. **SplitChunksPlugin** – extract shared/vendor code automatically:

   ```js
   optimization: {
     splitChunks: { chunks: 'all' },
   },
   ```

### 7. Mode: development vs production

| Aspect          | `development`                  | `production`                       |
| --------------- | ------------------------------ | ---------------------------------- |
| Minification    | Off                            | On (TerserPlugin)                  |
| Tree shaking    | Limited                        | Full (with ES modules)             |
| Source maps     | Fast, detailed                 | Smaller / optional                 |
| `process.env.NODE_ENV` | `development`           | `production`                       |
| Build speed     | Faster                         | Slower (more optimization)         |

### 8. Source Maps

Controlled by the `devtool` option. Trade-off between build speed and quality:

```js
devtool: 'eval-source-map',     // fast rebuilds, good for dev
// devtool: 'source-map',       // full, separate file, good for prod
```

### 9. Caching & Performance

- **Content hashing** (`[contenthash]`) lets browsers cache unchanged bundles.
- **Persistent cache** speeds up rebuilds:

  ```js
  cache: { type: 'filesystem' },
  ```

- **`babel-loader` cache**: `options: { cacheDirectory: true }`.
- Keep bundles small with code splitting + tree shaking.

### 10. Common Gotchas

- **Forgetting `resolve.extensions`** → must type `.jsx` on every import.
- **Loader order** → remember it runs right-to-left.
- **CSS not extracted in prod** → use `MiniCssExtractPlugin` instead of `style-loader`.
- **SPA 404 on refresh** → set `devServer.historyApiFallback: true`.
- **Slow builds** → enable `cache: { type: 'filesystem' }` and narrow `include`/`exclude`.

### 11. Parcel vs Webpack (Side by Side)

| Aspect            | Parcel                          | Webpack                                |
| ----------------- | ------------------------------- | -------------------------------------- |
| Configuration     | Zero-config by default          | Explicit `webpack.config.js`           |
| Entry point       | HTML or JS                      | Usually JS                             |
| Transformations   | Auto-detected transformers      | Manually configured loaders            |
| Lifecycle hooks   | Plugin system                   | Rich plugin system                     |
| Learning curve    | Gentle                          | Steeper                                |
| Flexibility       | Good for most apps              | Maximum control / customization        |
| Dev server        | Built-in                        | `webpack-dev-server` (separate dep)    |

> Rule of thumb: **Parcel** when you want speed and simplicity; **Webpack** when
> you need fine-grained control or rely on a specific plugin/loader ecosystem.

### 12. Further Reading

- Official docs: https://webpack.js.org/
- Concepts: https://webpack.js.org/concepts/
- Loaders: https://webpack.js.org/loaders/
- Plugins: https://webpack.js.org/plugins/

## Vite Bundler — Study Notes

> A focused, practical reference for understanding Vite. This project uses Parcel,
> but these notes are useful for comparison and for projects where Vite is the
> tool of choice.

### 1. What is Vite?

Vite (French for "fast", pronounced *veet*) is a **next-generation frontend build
tool**. Its defining idea is to split the workflow into two very different modes:

- **Dev** – serves source files over **native ES modules (ESM)**, transforming
  them on demand. No upfront bundling, so the dev server starts almost instantly.
- **Build** – bundles for production using **Rollup**, producing highly optimized
  static assets.

Key characteristics:

- **Instant dev server start** – no bundling step before serving.
- **Lightning-fast HMR** – updates stay fast even as the app grows.
- **esbuild-powered** – pre-bundles dependencies with esbuild (Go, very fast).
- **Rollup-based production builds** – mature, tree-shaking bundler.
- **Sensible defaults + simple config** – `vite.config.js`, far lighter than Webpack.

### 2. The Two-Mode Mental Model

| Mode    | Engine    | Strategy                              | Why                                  |
| ------- | --------- | ------------------------------------- | ------------------------------------ |
| **Dev** | esbuild   | Serve native ESM, transform on demand | Instant startup, fast HMR            |
| **Build** | Rollup  | Bundle + optimize                     | Best production output / tree shaking |

This is why Vite feels instant in development: the browser requests modules and
Vite transforms only what's actually needed, when it's needed.

### 3. Why Native ESM Changes Everything

Traditional bundlers build the **entire** graph before serving a single page.
Vite instead leans on the browser's built-in module system:

```
Browser requests index.html
   └─▶ <script type="module" src="/src/main.jsx">
          └─▶ browser requests /src/main.jsx
                 └─▶ Vite transforms & returns it (JSX → JS) on the fly
                        └─▶ further imports requested the same way…
```

Only modules on the current route are processed, so startup time is roughly
**constant** regardless of total project size.

### 4. Dependency Pre-Bundling (esbuild)

Some dependencies ship many internal files or use CommonJS. Vite pre-bundles
them once with **esbuild** to:

- Convert CommonJS/UMD to ESM so the browser can import them.
- Collapse a package's many files into a few requests (fewer round-trips).

Cached under `node_modules/.vite/`. Re-runs when dependencies change.

### 5. A Minimal Config

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

```jsonc
// package.json
"scripts": {
  "dev": "vite",                 // start dev server
  "build": "vite build",         // production build (Rollup)
  "preview": "vite preview"      // locally preview the production build
}
```

### 6. The `index.html` Entry Point

Like Parcel, Vite treats `index.html` as the entry and source of truth, but it
lives in the **project root** (not `src/`):

```html
<!-- index.html -->
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

URLs are resolved relative to the project root, and assets referenced here are
processed and hashed during build.

### 7. Built-in Features (no config needed)

- **TypeScript / JSX** – transpiled via esbuild out of the box.
- **CSS** – `@import`, CSS Modules (`*.module.css`), and PostCSS supported.
- **Static assets** – `import imgUrl from './logo.png'` returns a resolved URL.
- **Glob imports** – `import.meta.glob('./pages/*.jsx')` for dynamic collections.
- **Env variables** – `.env` files exposed on `import.meta.env.*`.

```js
// Vite uses import.meta.env, NOT process.env
const apiUrl = import.meta.env.VITE_API_URL; // must be prefixed with VITE_
```

### 8. Hot Module Replacement (HMR)

Vite's HMR API updates modules in place while preserving app state. Framework
plugins (like `@vitejs/plugin-react`) wire this up automatically, so editing a
component updates the UI without a full reload and without losing local state.

### 9. Plugins

Vite's plugin API is an **extension of Rollup's**, so most Rollup plugins work,
plus Vite-specific hooks. Common ones:

| Plugin                  | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `@vitejs/plugin-react`  | React Fast Refresh + JSX.                 |
| `@vitejs/plugin-vue`    | Vue single-file component support.        |
| `vite-plugin-svgr`      | Import SVGs as React components.          |
| `vite-plugin-pwa`       | Progressive Web App / service worker.     |

### 10. Production Build (Rollup)

`vite build` switches to Rollup and applies:

- **Tree shaking** of unused exports.
- **Minification** (esbuild or Terser).
- **Code splitting** via dynamic `import()` and automatic vendor chunks.
- **Asset hashing** for long-term caching.
- Output written to `dist/`, previewable with `vite preview`.

### 11. Common Gotchas

- **Env var not visible** → it must be prefixed `VITE_` and read via `import.meta.env`.
- **Using `process.env`** → use `import.meta.env` instead (no Node globals in browser).
- **`index.html` location** → lives in project root, not `src/`.
- **SPA 404 on refresh** → the dev server handles it; static hosts need a rewrite to `index.html`.
- **Dep not pre-bundled** → add it to `optimizeDeps.include` in `vite.config.js`.

### 12. Parcel vs Webpack vs Vite (Side by Side)

| Aspect            | Parcel                  | Webpack                  | Vite                          |
| ----------------- | ----------------------- | ------------------------ | ----------------------------- |
| Config burden     | None default            | High                     | Low                           |
| Dev strategy      | Bundle (cached)         | Bundle                   | Native ESM (no bundle)        |
| Dev server start  | Fast                    | Slower on big apps       | Near-instant                  |
| Dev engine        | SWC/Babel               | Loaders (Babel etc.)     | esbuild                       |
| Prod bundler      | Built-in                | Webpack                  | Rollup                        |
| Entry point       | HTML (in `src/`)        | Usually JS               | HTML (project root)           |
| Env access        | `process.env`           | `process.env`            | `import.meta.env` (VITE_*)    |

> Rule of thumb: **Vite** for fast, modern DX with minimal config; **Parcel** for
> zero-config simplicity; **Webpack** for maximum control and ecosystem depth.

### 13. Further Reading

- Official docs: https://vitejs.dev/
- Why Vite: https://vitejs.dev/guide/why.html
- Config reference: https://vitejs.dev/config/
- Plugins: https://vitejs.dev/plugins/

## HMR (Hot Module Replacement) — Study Notes

> A development feature that updates code **in the browser while the app keeps
> running** — no full reload, and the app's current state is preserved.

### 1. What is HMR?

HMR swaps the **changed module** into a **running** application without refreshing
the whole page. Your component tree, route, scroll position, and local state stay
exactly as they were — only the edited code is replaced.

### 2. The Problem It Solves

Imagine working on a form deep in the app:

1. You navigate to the page, open a modal, fill in 10 fields.
2. You tweak some CSS or fix a typo in a component.

- **Without HMR** → the browser does a full reload: the modal closes, all 10
  fields are wiped, and you redo every step just to see the change.
- **With HMR** → only the changed module is swapped in. The modal stays open, the
  fields keep their values, and your edit appears instantly.

### 3. How It Works (the flow)

```
You save a file
   │
   ▼
Dev server detects the change (file watcher)
   │
   ▼
Only the CHANGED module is recompiled
   │
   ▼
Server pushes the update to the browser  (via a WebSocket connection)
   │
   ▼
HMR runtime in the browser swaps the old module for the new one
   │
   ▼
UI updates in place — state preserved, no full reload
```

The key piece is the **WebSocket** the dev server keeps open to the browser. When
a module changes, the server sends just that patch, and a small **HMR runtime**
(injected during development) replaces the old module's code with the new version.

### 4. HMR vs Live Reload

| Aspect                       | Live Reload                | HMR                          |
| ---------------------------- | -------------------------- | ---------------------------- |
| What it does                 | Refreshes the **whole page** | Swaps only the **changed module** |
| App state                    | ❌ Lost (full reload)      | ✅ Preserved                 |
| Speed                        | Slower (re-runs everything)| Near-instant (targeted)      |
| Scroll position / form data  | Reset                      | Kept                         |

Live reload is the older, blunter approach — "something changed, reload
everything." HMR is surgical.

### 5. State Preservation — the Headline Feature

This is what makes HMR feel magical, especially with React:

- **CSS changes** apply instantly with zero flicker — styles are just re-injected.
- **Component changes** (with **React Fast Refresh**, built on HMR) update the
  component while keeping its `useState`/`useReducer` values intact.

Example: editing the `Counter` component's button styling while the count is at
`42` updates the look and the count **stays at 42** instead of resetting to `0`.

### 6. HMR Across the Bundlers

- **Parcel** – on by default with `npm start` (zero config).
- **Vite** – famously fast: it serves native ESM, so only the one changed module
  is invalidated (no re-bundling). `@vitejs/plugin-react` wires up Fast Refresh.
- **Webpack** – via `webpack-dev-server` with `hot: true` in the config.

### 7. Important Caveat

HMR is a **development-only** tool. The WebSocket, file watcher, and HMR runtime
never ship to production — they exist purely to speed up the local feedback loop.
In production, users get the final static bundle with none of this machinery.

### 8. Further Reading

- Vite HMR API: https://vitejs.dev/guide/api-hmr.html
- Webpack HMR concepts: https://webpack.js.org/concepts/hot-module-replacement/
- React Fast Refresh: https://reactnative.dev/docs/fast-refresh

## Classic Scripts — Study Notes

> The original way browsers load JavaScript — everything that is **not**
> `type="module"`. Understanding this makes the module notes that follow clearer.

### 1. What is a Classic Script?

A classic script is a "normal" `<script>` tag — the way JS has been loaded since
the early web, **before** ES modules existed. Any `<script>` without
`type="module"` is a classic script (including the default `type="text/javascript"`).

```html
<!-- Classic scripts -->
<script src="./app.js"></script>
<script>
  var greeting = 'hello';
</script>
```

### 2. Defining Characteristics

**a. No native `import` / `export`.**
Classic scripts cannot use ES module syntax at the top level:

```js
import App from './App';   // ❌ SyntaxError in a classic script
```

Historically, code was split across multiple `<script>` tags loaded in order, and
shared via **global variables**.

**b. Runs in the global scope.**
Top-level `var` and function declarations attach to `window`:

```js
var user = 'VR7';
function greet() {}
// → window.user and window.greet now exist (namespace pollution)
```

**c. Blocks HTML parsing by default.**
The browser builds the page top-to-bottom, reading the HTML line by line and
constructing the DOM as it goes. When it reaches a **classic** `<script>` tag, it
has to **stop reading the HTML completely** and do three things before continuing:

1. **Download** the script file (if it has a `src`) — a network trip.
2. **Execute** the JavaScript fully.
3. **Only then** resume parsing the rest of the HTML.

This pause is called **"blocking"** — the script freezes the page-building process.

```html
<body>
  <h1>Hello</h1>

  <script src="big-slow-file.js"></script>   <!-- 🛑 parser STOPS here -->

  <p>This paragraph won't appear until the script
     above finishes downloading AND running.</p>
</body>
```

This causes two real problems:

- **Slow scripts freeze the page.** A large or slow-loading script makes the whole
  page feel stuck, because rendering can't continue past it.
- **The script can't see HTML below it.** Since parsing is paused, elements *after*
  the script tag don't exist in the DOM yet:

  ```html
  <script>
    document.getElementById('root');  // 🛑 → null! (#root not parsed yet)
  </script>
  <div id="root"></div>               <!-- parsed AFTER the script -->
  ```

This is exactly why classic scripts were traditionally placed at the **bottom of
`<body>`** — so the entire DOM above them already exists by the time they run:

```html
<body>
  <div id="root"></div>
  <!-- everything is parsed by now -->
  <script src="./app.js"></script>   <!-- safe: #root exists -->
</body>
```

You can opt out of blocking with `defer` (run after parsing) or `async` (run as
soon as downloaded). A `type="module"` script behaves like `defer` automatically —
it downloads in the background and runs only after the HTML is fully parsed.

| Script type            | Downloads  | Pauses HTML parsing?   | When it runs            |
| ---------------------- | ---------- | ---------------------- | ----------------------- |
| Classic `<script>`     | blocking   | ✅ Yes — page freezes  | Immediately, mid-parse  |
| `defer`                | background | ❌ No                  | After HTML is parsed    |
| `type="module"`        | background | ❌ No                  | After HTML is parsed    |

**d. Not strict mode by default.**
You must opt in manually with `'use strict';`. Modules are always strict.

**e. Re-runs every time included.**
Adding the same classic tag twice executes it twice (modules evaluate once).

### 3. Sharing Code the Classic Way

Before ES modules existed, a `.js` file had **no built-in way** to say "I need code
from another file" — there was no `import`. The only way to share code between
files was to lean on two things the browser already provides:

1. **The global `window` object** — shared by every script on the page.
2. **Load order** — the browser runs `<script>` tags top-to-bottom.

**How sharing actually worked: through `window`.**
Every classic script runs in the global scope, so anything declared at the top
level becomes a property of `window`. Developers exploited this on purpose:

```js
// utils.js — everything here is global, so it attaches to window
function formatName(name) {
  return name.toUpperCase();
}

// A common pattern: bundle helpers into one global "namespace" object
var utils = { formatName: formatName };
// → window.utils is now available to any later script
```

```js
// app.js — no import! It just trusts window.utils already exists
console.log(utils.formatName('vr7')); // "VR7"
```

There is no explicit link between the two files — `app.js` simply reaches into the
shared global namespace and hopes `utils` is present.

**Why load order is everything.**
The browser executes scripts in the order they appear, each fully before the next.
So the *only* thing guaranteeing `utils` exists when `app.js` runs is tag order:

```html
<!-- ✅ Correct order — works -->
<script src="./utils.js"></script>   <!-- runs 1st: creates window.utils -->
<script src="./app.js"></script>     <!-- runs 2nd: window.utils exists ✔ -->
```

```html
<!-- ❌ Wrong order — crashes -->
<script src="./app.js"></script>     <!-- runs 1st: window.utils is undefined! -->
<script src="./utils.js"></script>   <!-- too late -->
```

In the broken version `app.js` runs first and throws
`Uncaught ReferenceError: utils is not defined`. The code is identical — only the
**tag order** changed — yet one works and one fails. That is the fragility.

**Why this approach was so painful** (problems compound as a project grows):

| Problem                     | What goes wrong                                                            |
| --------------------------- | ------------------------------------------------------------------------- |
| **Manual ordering**         | With many scripts you must hand-sort them so each loads after its deps.    |
| **Invisible dependencies**  | `app.js` never *says* it needs `utils`; the link lives only in the HTML.   |
| **Namespace pollution**     | Everything is on `window`; two libs defining `utils` (or `$`) collide.     |
| **No encapsulation**        | Nothing is private — any script can read or clobber any global.            |
| **Hard to refactor**        | Rename/move a file and you must hunt down and reorder every script tag.    |

Workarounds like IIFEs, namespace objects, and module formats such as CommonJS
(`require`) and AMD were invented precisely to tame this chaos.

**How ES modules fixed it.**
Modules make dependencies explicit and self-resolving:

```js
// utils.js
export function formatName(name) {
  return name.toUpperCase();
}
```

```js
// app.js
import { formatName } from './utils.js'; // ← the dependency is DECLARED
console.log(formatName('vr7'));
```

- **Order is automatic.** The `import` tells the loader to load `utils.js` first —
  no hand-ordered script tags; the dependency graph resolves itself.
- **No globals.** `formatName` is not on `window`; it exists only where imported,
  so nothing collides or leaks.
- **Dependencies are visible.** The top of `app.js` shows exactly what it needs.
- **Encapsulation.** Anything you don't `export` stays private to the module.

This is also the foundation bundlers build on: Parcel, Webpack, and Vite read these
`import`/`export` statements to construct the dependency graph — impossible when
"sharing code" meant scattering variables onto `window`.

### 4. Classic vs Module (Quick Reference)

| Feature             | Classic script                  | `type="module"`              |
| ------------------- | ------------------------------- | ---------------------------- |
| Syntax              | `<script src="...">`            | `<script type="module" ...>` |
| `import` / `export` | ❌ No                           | ✅ Yes                       |
| Scope               | Global (`window`)               | Module-scoped                |
| Strict mode         | Opt-in                          | Always on                    |
| Parsing             | Blocks (unless `defer`/`async`) | Deferred automatically       |
| Sharing code        | Global vars / multiple tags     | `import` / `export`          |
| Re-execution        | Every tag                       | Once per module              |

### 5. How It Connects to This Project & Bundlers

This app uses `type="module"`, so it relies on `import` statements — if that tag
were a classic script, every `import` in `index.js` would throw a syntax error.

The interesting twist: **Webpack's output is actually a classic script**, yet it
works fine because Webpack bundles all the `import`s away at build time. The
browser only ever sees plain, global-style JavaScript with no `import` left to
choke on. (Parcel and Vite instead emit `type="module"` — see the next section.)

### 6. Further Reading

- MDN — `<script>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
- MDN — `defer` & `async`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attributes

## `<script type="module">` — Study Notes

> Why the entry script in `index.html` uses `type="module"`, and how this differs
> across Parcel, Vite, and Webpack.

### 1. What `type="module"` Does

In `src/index.html` the app is bootstrapped with:

```html
<script type="module" src="./index.js"></script>
```

`type="module"` tells the browser to treat the script as an **ES module** instead
of a classic script. That single attribute changes several behaviors at once.

### 2. The Four Key Behaviors

| Behavior              | Classic `<script>`           | `<script type="module">`        |
| --------------------- | ---------------------------- | ------------------------------- |
| `import` / `export`   | ❌ Syntax error              | ✅ Supported natively           |
| Execution timing      | Blocks parsing (unless `defer`) | Deferred automatically       |
| Variable scope        | Global (`var` → `window`)    | Module-scoped (no leaks)        |
| Strict mode           | Opt-in (`'use strict'`)      | Always on                       |
| Re-execution          | Once per tag                 | Once per module (shared)        |

**a. Enables `import` / `export`.** Top-level module syntax like
`import App from './App'` only works in module scripts. A classic script throws a
syntax error.

**b. Deferred by default.** Module scripts download without blocking HTML parsing
and execute **after** the DOM is parsed. That's why `document.getElementById('root')`
in `index.js` finds `<div id="root">` even though the script is loaded early.

**c. Module scope.** Top-level variables stay local to the module — they don't
pollute the global `window` object.

**d. Strict mode + single evaluation.** Module code always runs in strict mode,
and each module is evaluated **once** no matter how many files import it (this is
why React is a single shared instance across the app).

### 3. How Bundlers Relate to It

The core question is: **who resolves the `import` statements — the browser, or the
bundler at build time?**

| Tool        | Needs `type="module"`?          | Why                                                  |
| ----------- | ------------------------------- | ---------------------------------------------------- |
| **Parcel**  | Yes (you write it)              | Browser loads the ESM entry; Parcel follows it.      |
| **Vite**    | Yes (you write it)              | Dev server serves native ESM; build emits modules.   |
| **Webpack** | No (auto-injected, classic)     | Webpack bundles `import`s away before the browser sees them. |

### 4. Parcel & Vite — Required

Both lean on the browser's native module system:

- **Parcel** reads the `type="module"` tag in `index.html` and uses the referenced
  file as the JS entry for its dependency graph.
- **Vite** goes further: in **dev** the browser loads your modules directly via the
  `type="module"` tag and Vite transforms each one on demand (no bundling). In
  **build**, Rollup still emits `type="module"` scripts for modern browsers.

Remove the attribute and `import` breaks — the no-bundle / native-ESM model can't work.

### 5. Webpack — Usually Not Required

Webpack **bundles everything at build time** and injects the script tag itself via
`HtmlWebpackPlugin`:

```js
plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
```

The generated tag is typically a **classic** script:

```html
<script defer src="main.[contenthash].js"></script>
```

Your `import`/`export` still work because Webpack already compiled them into a
single bundle — the browser never sees raw `import`, so it doesn't need module
mode. Webpack *can* emit true modules if you opt in:

```js
// webpack.config.js
experiments: { outputModule: true },
output: { module: true },
```

### 6. Key Takeaway

`type="module"` only matters when the **browser** needs to understand
`import`/`export` natively:

- **Parcel & Vite** → browser (or dev server) resolves modules → **tag required**.
- **Webpack** → bundler resolves modules ahead of time → **tag not needed by default**.

So it's not about the tool's name, but about **who does the module resolution**.

### 7. Further Reading

- MDN — JavaScript modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- MDN — `<script type>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#type

## Nx Workspace — Study Notes

> A focused, practical reference for understanding Nx. This project is a single
> Parcel app, but these notes explain how Nx scales a codebase into a managed
> **monorepo** of many apps and libraries.

### 1. What is Nx?

Nx is a **smart, extensible build system and monorepo tool**. It lets many
applications and libraries live in one repository while staying fast and
organized. Its superpower is understanding the **project graph** — how everything
depends on everything else — and using that to only do the work that's necessary.

Key characteristics:

- **Monorepo-first** – many apps + libs share one repo, one set of dependencies.
- **Project graph** – Nx maps dependencies between projects automatically.
- **Affected commands** – only build/test/lint what your change actually impacts.
- **Computation caching** – never rebuild/retest the same inputs twice (local + remote).
- **Code generators** – scaffold apps, libs, and components consistently.
- **Plugin ecosystem** – first-class support for React, Next, Node, Angular, etc.

### 2. Monorepo vs Polyrepo

| Aspect            | Polyrepo (many repos)        | Monorepo (Nx)                          |
| ----------------- | ---------------------------- | -------------------------------------- |
| Code sharing      | Via published packages       | Direct imports between projects        |
| Dependency mgmt   | Per repo (drift-prone)       | Single, consistent set                 |
| Atomic changes    | Hard (multiple PRs)          | One PR spans app + libs                |
| Tooling           | Duplicated per repo          | Centralized & consistent               |
| CI cost           | Builds everything per repo   | Builds only **affected** projects      |

### 3. Workspace Anatomy

A typical **integrated** Nx workspace:

```
my-org/
├── apps/                     # Deployable applications
│   ├── web/                  # e.g. a React app
│   └── api/                  # e.g. a Node service
├── libs/                     # Shared libraries (the heart of Nx)
│   ├── ui/                   # Reusable UI components
│   ├── data-access/          # API/data layer
│   └── utils/                # Pure helpers
├── tools/                    # Workspace scripts & custom generators
├── nx.json                   # Nx configuration (caching, plugins, defaults)
├── package.json              # Single set of dependencies
└── tsconfig.base.json        # Path aliases for libs (@my-org/ui, …)
```

Guiding principle: **apps are thin, libs are where the code lives.** An app
mostly wires libraries together.

### 4. Projects, Targets & Executors

- **Project** – any app or lib (has its own `project.json`).
- **Target** – a runnable task on a project: `build`, `test`, `lint`, `serve`.
- **Executor** – the implementation behind a target (e.g. `@nx/vite:build`).

```jsonc
// apps/web/project.json
{
  "name": "web",
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "options": { "outputPath": "dist/apps/web" }
    },
    "serve": { "executor": "@nx/vite:dev-server" },
    "test":  { "executor": "@nx/vite:test" }
  }
}
```

Run a target:

```bash
nx build web
nx test ui
nx serve web
```

### 5. The Project Graph

Nx statically analyzes imports to build a dependency graph of all projects.
Visualize it:

```bash
nx graph
```

This graph powers nearly every Nx feature — affected detection, task ordering,
caching, and enforcing module boundaries.

```
web ──▶ ui ──▶ utils
  └────▶ data-access ──▶ utils
```

### 6. Affected Commands (the CI superpower)

Instead of rebuilding the world, Nx compares your changes against a base branch
and runs tasks **only for impacted projects**:

```bash
nx affected -t build           # build only what changed (+ dependents)
nx affected -t test
nx affected -t lint
nx affected --graph            # visualize what's affected
```

If you edit `libs/utils`, Nx knows `ui`, `data-access`, and `web` are affected
and limits work to those.

### 7. Computation Caching

Nx caches a task's outputs keyed by its **inputs** (source files, deps, config,
env). Identical inputs → instant **cache hit**, restoring outputs and terminal
logs without re-running.

- **Local cache** – stored on your machine.
- **Remote cache (Nx Replay)** – shared across the team & CI, so a teammate's or
  CI's previous build can satisfy yours.

```bash
nx build web      # first run: executes, caches
nx build web      # second run: "existing outputs match the cache" → instant
nx reset          # clear the local cache if needed
```

Make sure each target declares its `outputs` so Nx knows what to cache.

### 8. Code Generators

Generators scaffold code consistently so every project follows the same shape:

```bash
# Add a React app
nx g @nx/react:app web

# Create a shared UI library
nx g @nx/react:lib ui

# Generate a component inside the ui lib
nx g @nx/react:component button --project=ui
```

You can also write **custom generators** in `tools/` to encode your org's
conventions.

### 9. Enforcing Module Boundaries

Nx can enforce architectural rules via tags + the `@nx/enforce-module-boundaries`
ESLint rule, preventing forbidden imports (e.g. a UI lib importing a feature lib):

```jsonc
// project.json — tag projects
{ "tags": ["scope:web", "type:feature"] }
```

```jsonc
// .eslintrc — example constraint
"depConstraints": [
  { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:ui", "type:util"] },
  { "sourceTag": "type:util",    "onlyDependOnLibsWithTags": ["type:util"] }
]
```

This keeps a large codebase from turning into a tangle of cross-imports.

### 10. Types of Libraries (a common convention)

| Type            | Responsibility                                  |
| --------------- | ----------------------------------------------- |
| **feature**     | Smart, route-level UI + business logic.         |
| **ui**          | Presentational, reusable components.            |
| **data-access** | State management + API calls.                   |
| **util**        | Framework-agnostic pure helpers.                |

Mapping it to *this* project: `components/` ≈ a **ui** lib, `store/` ≈ a
**data-access** lib, and `utils/` ≈ a **util** lib — Nx simply formalizes those
boundaries across many apps.

### 11. `nx.json` (Workspace Configuration)

Central config for caching, plugins, and target defaults:

```jsonc
// nx.json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"]   // build dependencies first
    },
    "test": { "cache": true }
  },
  "plugins": ["@nx/vite/plugin", "@nx/eslint/plugin"]
}
```

`"dependsOn": ["^build"]` means "build this project's dependencies before
building it" — the `^` refers to dependency projects.

### 12. Common Commands Cheat Sheet

```bash
npx create-nx-workspace@latest   # scaffold a new workspace
nx graph                         # open the project graph
nx run web:build                 # run a specific target
nx build web                     # shorthand for the build target
nx affected -t test              # test only affected projects
nx run-many -t build             # run a target across all projects
nx g @nx/react:lib ui            # generate a library
nx reset                         # clear cache / daemon
nx migrate latest                # upgrade Nx and dependencies
```

### 13. Common Gotchas

- **Everything rebuilds** → ensure targets declare correct `inputs`/`outputs` so
  caching works; check `nx.json` `targetDefaults`.
- **Cache "not working"** → a changing input (timestamp, env var) busts it; inspect
  with `nx build web --verbose`.
- **Wrong task order** → use `dependsOn: ["^build"]` so deps build first.
- **Messy imports** → adopt tags + module-boundary rules early.
- **Apps too fat** → push logic into libs; keep apps as thin shells.

### 14. When to Use Nx

- Multiple apps that **share code** (web + admin + mobile + api).
- A growing team needing **consistent tooling** and guardrails.
- CI getting slow → **affected** + **caching** dramatically cut build times.
- You want enforced architecture across a large codebase.

For a single small app like this one, Nx is overkill — but the **library
boundaries** it encourages (ui / data-access / util) are great habits to adopt
even here.

### 15. Further Reading

- Official docs: https://nx.dev/
- Getting started: https://nx.dev/getting-started/intro
- Core features: https://nx.dev/features
- Caching: https://nx.dev/concepts/how-caching-works
- Project graph: https://nx.dev/features/explore-graph

## License

MIT
