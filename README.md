# Altitude Ally

Altitude Ally is a responsive storefront and community platform for products,
impact projects, donations, customer accounts, order tracking, and operator
management.

## Live Services

- Website: <https://altitude-ally-web.vercel.app/>
- GitHub: <https://github.com/yiyangsam/Altitude-Ally>
- Active release branch: `V2`
- Supabase project: `aaibablpawhcoibstuhn`

The `main` branch is retained as the original version. Current development and
production publishing use `V2`; do not replace `main` unless that is requested
explicitly.

## Start Here

- [Project continuation guide](docs/PROJECT_CONTINUATION_GUIDE.md): the working
  context, GitHub workflow, Supabase setup, Vercel deployment, and new-device
  handoff prompt.
- [Architecture design](docs/ARCHITECTURE_DESIGN.md): detailed system,
  database, security, and deployment architecture.
- [Database bootstrap](supabase/schema.sql): schema for a new Supabase project.
- [Database migrations](supabase/v2-migration.sql): incremental V2 database
  changes for an existing project.

## Technology

- React 19, TypeScript, React Router, Vite, and Tailwind CSS
- Node.js and Express API
- Supabase Auth and PostgreSQL
- GitHub source control
- Vercel hosting and automatic deployment

## Local Setup

1. Install Node.js.
2. Run `npm install`.
3. Create `.env.local` using `.env.example` as the template.
4. Run `npm run dev`.
5. Open <http://localhost:3000/>.

The four Supabase variables use two values: the server and Vite URL variables
use the same Supabase project URL, and the two key variables use the same public
anon/publishable key. Never commit `.env.local` or private credentials.

## Checks

```text
npm run lint
npm run build
```

## Publishing

After a change has passed the checks, commit and push it to `V2`. Vercel should
automatically build that commit and publish it to the production website. The
full procedure and troubleshooting steps are in the
[project continuation guide](docs/PROJECT_CONTINUATION_GUIDE.md).
