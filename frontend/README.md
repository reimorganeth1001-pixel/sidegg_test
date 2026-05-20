This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment

Copy `.env.example` to `.env`, then set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project (**Settings → API**, not the database URL).

**Enable X login in Supabase** (required for “Login with X”):

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Authentication** → **Providers**
2. Enable **X / Twitter (OAuth 2.0)** and paste **Client ID** + **Client Secret** from the [X Developer Portal](https://developer.x.com/en/portal/dashboard)
3. In the X app: set callback URL to `https://<project-ref>.supabase.co/auth/v1/callback` (shown in Supabase on the provider page)
4. In X app **User authentication settings**, turn on **Request email from users**
5. In Supabase **Authentication → URL Configuration**, add **Redirect URL**: `http://localhost:3113/auth/callback` (match `NEXT_PUBLIC_BASE_URL`)

If you still see “provider is not enabled”, the provider toggle or X app keys are missing—not a frontend bug. Try `NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDER=twitter` only if your project still uses the legacy Twitter provider.

Adjust `NEXT_PUBLIC_SIDEGG_SERVER` and `NEXT_PUBLIC_WEBSOCKET_URI` if your backend ports differ.

For the **RainbowKit** wallet modal (Ethereum + WalletConnect), create a free project at [WalletConnect Cloud](https://cloud.walletconnect.com) and set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env`. Injected wallets (MetaMask, Trust Wallet, etc.) still work without it; WalletConnect / QR flows work best with a real project id.

After changing dependencies, run `npm install` in this folder (if `node_modules` looks corrupted on Windows, delete `node_modules` and `package-lock.json`, then install again).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
