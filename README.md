# BlogGridCMS

BlogGridCMS is a modern blogging dashboard built with React, TypeScript, and Tailwind CSS. It provides a polished writing experience with live Markdown previews, rich UI components, and hooks for real-time data fetching so you can manage and publish posts with ease.

## ✨ Features

- **Rich post editor** with Markdown preview, cover image upload, and category selection.
- **Data fetching powered by React Query** for cache management and optimistic updates.
- **Component-driven UI** using a curated set of Radix UI primitives and utility wrappers.
- **Responsive layout** optimized for desktop and mobile authors.
- **Type-safe forms** with React Hook Form, Zod validation, and toast-based feedback.

## 🧱 Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) & `tailwindcss-animate`
- [Radix UI Primitives](https://www.radix-ui.com/)
- [@tanstack/react-query](https://tanstack.com/query/latest)
- [React Hook Form](https://www.react-hook-form.com/) + [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js **18.0.0 or newer** (Vite 5 requirement)
- npm **9+** (bundled with Node 18)

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

This starts Vite on [http://localhost:3000](http://localhost:3000). Hot Module Replacement (HMR) is enabled by default.

### Production Build

```bash
npm run build
npm run preview
```

`npm run build` produces an optimized bundle in `dist/`. `npm run preview` serves the built assets locally for a final smoke test.

## 🧪 Testing & Quality

| Command | Description |
| ------- | ----------- |
| `npm run lint` | Run ESLint across all TypeScript/TSX files with zero-warnings policy. |
| `npm run test` | Execute the Vitest suite in Node environment with jsdom. |
| `npm run test:ui` | Launch Vitest in watch mode with the web-based UI. |
| `npm run test:coverage` | Generate coverage reports. |

## 📁 Project Structure

```
BlogGridCMS/
├─ src/
│  ├─ components/        # UI primitives, layouts, and editor widgets
│  ├─ hooks/             # Shared React hooks (e.g., toasts, mobile detection)
│  ├─ lib/               # Utilities such as Markdown rendering and query client
│  ├─ pages/             # Route-level components (home, post detail, writer)
│  └─ shared/            # Zod schemas and cross-module types
├─ public/               # Static assets served by Vite
├─ tailwind.config.ts    # Tailwind sources & design tokens
├─ vite.config.ts        # Vite + React plugin configuration
└─ vitest.config.ts      # Vitest configuration with alias support
```

> **Note:** A legacy `client/` directory existed in earlier iterations. Ensure only the `src/` tree is used going forward.

## 🔌 API Integration

Network requests are funneled through `apiRequest` in `src/lib/queryClient.ts`. Update the base URL or authentication logic there to point to your backend. File uploads use a placeholder `/api/upload` endpoint—swap this for your storage provider or server route.

## 🛠 Environment Variables

If your backend requires configuration (e.g., a base URL or auth token), create a `.env.local` file and leverage Vite's `import.meta.env` variables. For example:

```bash
VITE_API_BASE_URL=https://your-api.example.com
```

Access it in code via `import.meta.env.VITE_API_BASE_URL` and update `apiRequest` accordingly.

## 📦 Deployment

- Run `npm run build` to create the production bundle.
- Deploy the contents of the `dist/` directory to your static hosting provider (Netlify, Vercel, Cloudflare Pages, etc.).
- Ensure any API endpoints referenced in `apiRequest` are reachable from the deployed environment.

## 🤝 Contributing

1. Fork the repository and create a feature branch.
2. Install dependencies and run `npm run lint` + `npm run test` before committing.
3. Submit a pull request with a concise summary and screenshots/GIFs when applicable.

## 📄 License

This project is currently unlicensed. Add a `LICENSE` file before distributing or accepting external contributions.

---

Happy writing and publishing with BlogGridCMS! ✍️