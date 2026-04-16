# Build Task: accessibility-code-converter

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: accessibility-code-converter
HEADLINE: Convert code for blind developers instantly
WHAT: None
WHY: None
WHO PAYS: None
NICHE: accessibility
PRICE: $$15/mo

ARCHITECTURE SPEC:
A Next.js web app that converts code between formats to make it accessible for blind developers (e.g., verbose comments, screen reader friendly syntax, audio descriptions). Features real-time conversion, multiple programming languages, and subscription-based access via Lemon Squeezy.

PLANNED FILES:
- app/page.tsx
- app/convert/page.tsx
- app/api/convert/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- components/CodeEditor.tsx
- components/ConversionOutput.tsx
- components/LanguageSelector.tsx
- components/PricingCard.tsx
- lib/converters/index.ts
- lib/converters/javascript.ts
- lib/converters/python.ts
- lib/lemonsqueezy.ts
- lib/auth.ts
- lib/database.ts

DEPENDENCIES: next, tailwindcss, @lemonsqueezy/lemonsqueezy.js, next-auth, prisma, @prisma/client, monaco-editor, @monaco-editor/react, prismjs, lucide-react

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/accessibility-code-converter
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d94e9-e8bf-74a1-9534-5470a9358056
--------
user
# Build Task: accessibility-code-converter

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: accessibility-code-converter
HEADL
Please fix the above errors and regenerate.