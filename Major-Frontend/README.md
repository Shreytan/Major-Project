# BlockMarketAI - Decentralized Data Marketplace

A blockchain-powered decentralized marketplace for secure data sharing and tokenization. Users can buy, sell, and trade datasets using smart contracts, ensuring ownership and privacy without intermediaries.

## 🚀 Features

- **🔐 Secure Data Transactions** – End-to-end encryption and blockchain-based verification
- **💰 Tokenized Data Exchange** – Trade data assets via smart contracts
- **🌍 Decentralized Network** – No central authority; data is stored securely across nodes
- **📊 User-Friendly Dashboard** – Intuitive interface to browse, list, and purchase datasets
- **🏦 Crypto Payments** – Integrated with MetaMask for seamless transactions
- **📱 Responsive Design** – Works perfectly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library
- **Next.js** - Full-stack React framework with SSR
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Blockchain & Web3
- **Ethers.js** - Ethereum library for interacting with smart contracts
- **MetaMask** - Wallet integration for secure transactions
- **Solidity** - Smart contract development (planned)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
my-marketplace/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   ├── marketplace/    # Marketplace page
│   │   ├── dashboard/      # User dashboard
│   │   └── about/          # About page
│   ├── components/         # Reusable React components
│   │   └── Navigation.tsx  # Main navigation component
│   ├── lib/               # Utility functions and libraries
│   │   └── wallet.ts      # MetaMask wallet integration
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

1. **Install MetaMask**
   - Download and install the [MetaMask browser extension](https://metamask.io/)
   - Create a new wallet or import an existing one
   - Add some test ETH to your wallet (use a testnet like Sepolia)

2. **Connect to the Marketplace**
   - Click "Connect Wallet" in the navigation
   - Approve the connection in MetaMask
   - You're ready to start trading data!

## 📱 Usage

### For Data Buyers

1. **Browse the Marketplace**
   - Visit the marketplace page to see available datasets
   - Use search and filters to find specific data
   - View dataset details, ratings, and pricing

2. **Purchase Data**
   - Connect your MetaMask wallet
   - Click "Purchase" on any dataset
   - Confirm the transaction in MetaMask
   - Download your purchased data

### For Data Sellers

1. **List Your Data**
   - Connect your MetaMask wallet
   - Navigate to the dashboard
   - Upload and describe your dataset
   - Set pricing and access controls

2. **Manage Sales**
   - Track your sales and earnings
   - View buyer analytics
   - Manage your listings

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Code Structure

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route pages in `src/app/`
- **Utilities**: Helper functions in `src/lib/`
- **Types**: TypeScript definitions in `src/types/`

### Adding New Features

1. **Create new pages** in `src/app/`
2. **Add components** in `src/components/`
3. **Update navigation** in `Navigation.tsx`
4. **Add types** as needed in `src/types/`

## 🔒 Security Features

- **MetaMask Integration**: Secure wallet connection
- **Smart Contract Verification**: All transactions verified on blockchain
- **End-to-End Encryption**: Data remains private during transactions
- **Decentralized Storage**: No single point of failure

## 🎨 Design System

The project uses a consistent design system with:

- **Primary Colors**: Blue gradient (`primary-600`, `primary-700`)
- **Secondary Colors**: Gray scale for text and backgrounds
- **Components**: Pre-styled buttons, cards, and form elements
- **Icons**: Lucide React icon library
- **Typography**: Inter font family

## 📊 Performance

- **Server-Side Rendering**: Fast initial page loads
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Efficient caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Shreyansh Shukla** - Team Leader - Full Stack & Blockchain
- **Akash Singh** - Authentication & User Flow
- **Purushottam Pandey** - Dashboard & Data Management
- **Shivansh Mishra** - UI/UX & Responsive Design
- **Harshit Dwivedi** - Routing & Frontend Components

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

- [ ] Smart contract integration
- [ ] Advanced search and filtering
- [ ] Data preview functionality
- [ ] User reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] API documentation
- [ ] Multi-chain support

---

**Built with ❤️ by the BlockMarketAI Team** 