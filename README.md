This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Zugang zur Montageverwaltung

Die Verwaltung, Anzeigenvorschauen und zugehörigen Downloads verlangen eine HTTPS-Anmeldung mit dem Benutzernamen `admin`. Auf gemeinsam genutzten Geräten ein privates Browserfenster verwenden und es nach der Arbeit schließen.

Der Projektinhaber kann ein langes, zufälliges Passwort im Passwortmanager erzeugen, in Vercel als serverseitige Variable `ADMIN_ACCESS_PASSWORD` für die gewünschte Umgebung setzen und neu deployen. Auf diesem Weg lässt sich der Zugang auch erneuern. Die Anwendung akzeptiert Passwörter ab 24 Zeichen. Ohne konfigurierten Zugang bleiben die internen Seiten geschlossen.
