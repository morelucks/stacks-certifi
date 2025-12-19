# Certifi Web Frontend

React-based frontend for Certifi - Blockchain-Powered Credential Verification

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Features

- **Dashboard** - Real-time statistics and event tracking
- **Issue Credential** - Create new credentials on blockchain
- **Verify Credential** - Verify credentials by hash
- **Statistics** - Event timeline and activity tracking
- **Wallet Integration** - Connect Stacks wallet

## 🔗 Integration

The frontend connects to:
- Stacks blockchain via `@stacks/connect`
- Webhook server at `http://localhost:3000`
- Smart contracts deployed on Stacks

## 📁 Structure

```
src/
├── App.tsx              Main app component
├── App.css              App styles
├── main.tsx             Entry point
├── index.css            Global styles
└── components/
    ├── Dashboard.tsx    Statistics dashboard
    ├── IssueCredential.tsx  Credential issuance
    ├── VerifyCredential.tsx  Credential verification
    └── Statistics.tsx    Event timeline
```

## 🛠 Development

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build
npm run build
```

## 📦 Dependencies

- React 18
- Vite
- @stacks/connect
- @stacks/transactions
- axios

## 🔐 Environment

Make sure webhook server is running:
```bash
npm run webhook
```

## 📝 License

ISC
