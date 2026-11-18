# Amba Lifestyle Frontend Storefront 🛍️✨

Premium Customer-facing E-commerce storefront built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 📁 Folder Structure

```
amba-lifestyle-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Storefront Homepage
│   │   └── globals.css        # Tailwind styling
│   ├── components/
│   │   ├── ecommerce/
│   │   │   └── ProductCard.tsx    # Interactive product display card
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Responsive header with search & cart badge
│   │   │   └── Footer.tsx         # Store links & vendor callout
│   │   └── ui/
│   │       ├── Badge.tsx          # Sale / New badge tags
│   │       ├── Button.tsx         # Rounded lifestyle button
│   │       ├── Card.tsx           # Generic container
│   │       ├── Input.tsx          # Form fields
│   │       └── Modal.tsx          # Dialogs & popups
│   ├── lib/
│   │   └── api.ts             # REST client with auth support
│   └── types/
│       └── index.ts           # Frontend TypeScript models (Products, Cart, User)
├── .env.example
├── .env.local
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

```ini
NEXT_PUBLIC_APP_NAME="Amba Lifestyle"
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
PORT=3000
```

---

## 🛠️ Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
