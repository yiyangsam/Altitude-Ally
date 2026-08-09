# Altitude Ally Project Continuation Guide

| Field | Value |
| --- | --- |
| Project | Altitude Ally Web Platform |
| Purpose | Continue development safely from any device or new conversation |
| Active Git branch | `V2` |
| Production website | <https://altitude-ally-web.vercel.app/> |
| GitHub repository | <https://github.com/yiyangsam/Altitude-Ally> |
| Supabase project reference | `aaibablpawhcoibstuhn` |
| Detailed architecture | [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md) |
| Last reviewed | 9 August 2026 |

## 1. Read This First

This is the durable handoff for Altitude Ally. It gathers the decisions and
operating steps that previously lived mostly in one long local Codex
conversation.

The original website is retained on GitHub's `main` branch. The current website
is developed on `V2`. All ordinary changes must stay on `V2` so the original
version is not overwritten.

The local folder and the conversation are not the source of truth. The durable
sources are:

1. GitHub `V2` for application code and documentation.
2. Supabase for shared application data and customer identity.
3. Vercel for the deployed application and production environment variables.
4. This guide and the architecture document for project context.

## 2. Cloud Services

### GitHub

- Owner: `yiyangsam`
- Repository: `Altitude-Ally`
- Repository URL: <https://github.com/yiyangsam/Altitude-Ally>
- Active branch: `V2`
- Protected historical branch: `main`

Rules:

- Pull from `V2` before starting work on another device.
- Commit only the files that belong to the requested change.
- Push completed, checked work to `V2`.
- Do not force-push, replace, or delete `main`.
- Do not upload ZIP copies or nested copies of the repository into the
  repository.

### Supabase

- Project reference: `aaibablpawhcoibstuhn`
- Dashboard: <https://supabase.com/dashboard/project/aaibablpawhcoibstuhn>
- Services used: PostgreSQL, Auth, email confirmation, and password recovery.
- Transactional sender currently intended for authentication email:
  `altitudeally@gmail.com`.

Supabase holds products, categories, customer profiles, orders, operator
configuration, impact projects, donation projects, payment instructions, and
page configuration. Customer authentication records live in Supabase Auth.

Never place the following in GitHub, documentation, screenshots, or chat:

- Gmail app passwords or SMTP passwords.
- Supabase service-role or secret keys.
- Access tokens, session tokens, or database passwords.
- Operator passwords.
- Customer names, email addresses, telephone numbers, or addresses.

### Vercel

- Production website: <https://altitude-ally-web.vercel.app/>
- Framework/build command: Vite using `npm run build`.
- Output folder: `dist`.
- API entry point: `api/index.ts`.
- SPA and API rewrites: `vercel.json`.
- Expected production branch: `V2`.

Vercel must be connected to the GitHub repository with `V2` selected as the
production branch. A push to `V2` should create a new production deployment and
update the primary domain.

## 3. Environment Variables

The project uses four Supabase environment variables:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

There are only two underlying Supabase values:

- `SUPABASE_URL` and `VITE_SUPABASE_URL` use the same project URL.
- `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY` use the same public
  anon/publishable key.

For local work, store them in `.env.local`. For deployment, add all four in
Vercel Project Settings under Environment Variables and enable them for the
appropriate Production, Preview, and Development environments.

The `VITE_` values are included in the browser bundle and therefore must only
use the public anon/publishable key. Never use the Supabase service-role key in
a `VITE_` variable.

Authentication email settings are managed in the Supabase dashboard, not in
this repository. The Gmail app password must remain only in Supabase's SMTP
settings. If email verification or password recovery stops working, inspect the
Supabase Auth logs, sender details, redirect URLs, Gmail app password, and spam
folder.

## 4. Continue From Another Device

### Cloud conversation

Use the ChatGPT project named `Altitude web v1.3`. Add this guide and the
architecture document as project sources, or connect the GitHub repository when
that option is available. Start the new cloud conversation with the prompt in
Section 11.

The cloud project preserves the working explanation across devices. GitHub
preserves the code. Supabase and Vercel preserve the database and deployment.

### Local coding on the other device

1. Clone <https://github.com/yiyangsam/Altitude-Ally>.
2. Switch to the `V2` branch.
3. Open the cloned folder as the Codex local project.
4. Create `.env.local` from `.env.example` using the public Supabase URL and
   anon/publishable key.
5. Run `npm install`, `npm run lint`, and `npm run build`.
6. Pull `V2` before each new group of changes and push completed changes back to
   `V2`.

Do not download the repository into an existing repository folder. That was the
cause of the earlier nested `V2` folder problem.

## 5. Current Product Behavior

### Storefront

- Responsive phone and computer layouts.
- Configurable rotating market photo carousel with automatic timing and manual
  arrows.
- Compact product grid sized for more products per row.
- Product details dialog with image, short description, a separate long
  description popup, and an always-accessible selection control.
- Products can be visible, out of stock, or hidden.
- Variations and portions remain separate subjects.
- Each variation and portion has its own additional price and availability.
- The customer price is the product base price plus the selected variation
  charge plus the selected portion charge.
- Hidden choices are not shown; out-of-stock choices are visible but disabled.
- Adding an item briefly shows an `Added to cart` confirmation before changing
  to the quantity selector.
- Quantity edits are staged and applied only after `Confirm changes` is pressed.

### Customer accounts

- Signup uses full name, email, password, and matching confirm-password fields.
- Password visibility controls are available where passwords are entered.
- Supabase email confirmation is required for new accounts.
- Forgotten-password email and update-password routes use Supabase Auth.
- Missing accounts should produce `User not found` rather than an incorrect
  password message.
- Account details include creation date, address, and a split telephone country
  code/number input.
- Confirmed orders are loaded from Supabase and remain visible after refresh.

### Checkout and orders

- Logistics fee and the red community-protection label are removed.
- The confirmation step warns that a QR payment scan is required next.
- `Confirm order, await for payment` creates the order in the database.
- The next step uses `Confirm payment` and keeps the confirmation page visible
  until `Back to home` is selected.
- Confirmation wording uses `Order registered` and includes contact methods.
- The customer accuracy checkbox contains a bold warning that an order cannot
  be received when contact or address information is wrong.
- Order statuses are color-coded for customers and operators.

### Operator panel

- Products, categories, orders, members, impact, donations, payment details,
  page configuration, and operator details are managed from the dashboard.
- Product editing supports short and long descriptions.
- Product controls use green for show, red for out of stock, and grey for hide.
- Variation and portion options are added one at a time with an additional
  price and independent availability.
- Member email addresses are prominent and have a copy button.
- Joined dates display the date without time.
- Order tracking hides the complex order number and emphasizes status and total.
- Operators can select orders and export CSV records containing items, customer
  name, email, telephone, address, order date, and price.

### Content pages

- Footer mission, privacy, terms, and contact actions open editable dialogs.
- Contact configuration supports Instagram, email, LINE, and Facebook.
- Impact and Donation are separate management areas.
- Impact uses configurable introductory content, project dialogs, optional
  status, and a configurable full-width showcase image.
- Donation projects support title, date, image, description, and an optional
  amount.
- Donation page content includes a configurable external Tzu Chi link and
  direct-donation QR image.
- Public-facing text and photos added from this stage onward should be editable
  through Page Config or the appropriate Impact/Donation management section.
- Phone navigation uses readable text labels instead of unexplained icons.

## 6. Source Map

| Area | File or folder |
| --- | --- |
| Routes | `src/App.tsx` |
| Header and footer | `src/components/Layout.tsx` |
| Market and products | `src/pages/MarketPage.tsx` |
| Checkout | `src/pages/CheckoutPage.tsx` |
| Account | `src/pages/AccountPage.tsx` |
| Customer login | `src/pages/CustomerLoginPage.tsx` |
| Password recovery | `src/pages/ResetPasswordPage.tsx`, `src/pages/UpdatePasswordPage.tsx` |
| Impact | `src/pages/ImpactPage.tsx` |
| Donation | `src/pages/DonationPage.tsx` |
| Operator dashboard | `src/pages/OperatorDashboard.tsx` |
| Authentication state | `src/lib/AuthContext.tsx` |
| Shared API data | `src/lib/DataContext.tsx` |
| Cart state | `src/lib/CartContext.tsx` |
| API | `server/index.ts`, `api/index.ts` |
| Supabase client | `src/lib/supabase.ts` |
| Database | `supabase/` |
| Vercel routing | `vercel.json` |

## 7. Database Changes

For a completely new Supabase project, review and run
`supabase/schema.sql` in the SQL editor.

For this existing Supabase project, do not repeatedly run the complete bootstrap
schema. Existing V2 changes are stored in:

1. `supabase/v2-migration.sql`
2. `supabase/order-history-migration.sql`
3. `supabase/market-carousel-migration.sql`

Before applying SQL:

- Read the file and confirm it changes only the intended tables.
- Back up important data before destructive changes.
- Prefer `add column if not exists` and other repeatable migration operations.
- Create a new migration file for future schema changes.
- Never delete users, orders, products, or page data unless the user explicitly
  identifies the records and confirms the deletion scope.

## 8. Standard Change and Deployment Workflow

Use this sequence after every requested change:

1. Confirm the local branch is `V2` and inspect existing uncommitted changes.
2. Pull the latest `origin/V2` before editing when another device may have
   changed the repository.
3. Read the affected code and work with existing changes rather than replacing
   unrelated work.
4. Implement the requested change.
5. Run:

   ```text
   npm run lint
   npm run build
   ```

6. Test the relevant flow locally, including phone and computer layouts for
   interface changes.
7. Commit only the intended files with a clear description.
8. Push the commit to `origin/V2`.
9. Wait for the Vercel production deployment to finish.
10. Verify <https://altitude-ally-web.vercel.app/> and the relevant API or page.

For database-dependent changes, apply the matching Supabase migration before
testing the deployed feature. Keep the code backward-compatible when the
database change may not be applied immediately.

## 9. Deployment Troubleshooting

If the production link still shows an older version:

1. Confirm the new commit exists on GitHub branch `V2`.
2. In Vercel, confirm Settings -> Git -> Production Branch is `V2`.
3. Open the latest Vercel deployment and confirm its source commit matches the
   GitHub `V2` commit.
4. Confirm the primary domain is assigned to that production deployment.
5. Check that all four Supabase variables exist in Vercel's Production
   environment.
6. Inspect build and function logs for failures.
7. Hard-refresh the website or use a private browser window after deployment.

Different Vercel links can show different code because preview deployments are
per branch or commit. The primary production domain should point to the newest
successful production deployment from `V2`.

If the website loads but data does not:

1. Open `/api/products` on the production domain.
2. Check the Vercel function logs.
3. Confirm the server Supabase URL and public key variables.
4. Confirm the required migration has been applied in Supabase.
5. Check Supabase table and Auth logs without exposing keys or customer data.

## 10. Important Risks and Priorities

The application works as a controlled pilot, but the architecture review found
security work that should be completed before larger public use:

1. Replace the current database-stored operator password with Supabase-backed
   operator authentication.
2. Verify Supabase JWTs in the API and enforce operator/customer roles.
3. Enable and test Row Level Security policies.
4. Prevent customer pages from loading all users and all orders.
5. Validate API requests and calculate order totals on the server.
6. Move uploaded images from database data URLs to object storage.
7. Add automated tests and production monitoring.

See [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md) for the complete current
architecture, risks, and recommended roadmap.

## 11. Prompt for the New Cloud Conversation

Use the following as the first message in the `Altitude web v1.3` ChatGPT
project:

```text
Continue development of the Altitude Ally website.

The source of truth is:
- GitHub: https://github.com/yiyangsam/Altitude-Ally
- Active branch: V2
- Production: https://altitude-ally-web.vercel.app/
- Supabase project reference: aaibablpawhcoibstuhn

Read README.md, docs/PROJECT_CONTINUATION_GUIDE.md, and
docs/ARCHITECTURE_DESIGN.md before making changes.

Always keep main unchanged unless I explicitly request otherwise. For each
website change, inspect the existing V2 code, implement the change, run the
TypeScript and production-build checks, commit only the intended files, push to
V2, wait for the automatic Vercel deployment, and verify the production page.
Create and document a Supabase migration when a database change is required.

Never expose or commit Supabase secret keys, Gmail app passwords, operator
passwords, tokens, or customer information. Never delete production data unless
I explicitly confirm the exact deletion scope.

Keep variations and portions separate. Their prices are additional charges on
top of the product base price. Continue using Page Config or the matching
Impact/Donation editor for public text and photos.
```

## 12. Completion Checklist for Every Future Request

- Requested behavior is implemented on `V2`.
- Phone and computer layouts are checked when the UI changes.
- `npm run lint` passes.
- `npm run build` passes.
- Database migration is added and applied when required.
- No keys, passwords, tokens, or customer data are committed.
- Intended files are committed and pushed to GitHub `V2`.
- Vercel deployment is successful.
- The production page is verified.
- This guide or the architecture document is updated when the system structure
  or deployment process changes.
