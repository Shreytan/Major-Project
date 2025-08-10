# BlockMarketAI - Decentralized Data Marketplace

A blockchain-powered decentralized marketplace for secure data sharing and tokenization. Users can buy, sell, and trade datasets using smart contracts with complete ownership control and privacy.

## 🚀 Features

### Core Functionality
- **🔐 Secure Wallet Integration** - MetaMask integration with ethers.js
- **💰 Data Tokenization** - Trade data assets via smart contracts
- **🌐 Decentralized Network** - No central authority, distributed data storage
- **📊 Advanced Marketplace** - Search, filter, and sort datasets
- **📤 Upload System** - Easy dataset listing with metadata
- **📈 Analytics Dashboard** - Track purchases, sales, and earnings
- **🎨 Modern UI/UX** - Responsive design with Tailwind CSS

### Technical Features
- **Smart Contract Integration** - Ethereum-based marketplace contracts
- **Real-time Search** - Search by title, description, and tags
- **Advanced Filtering** - Filter by category, price, and rating
- **Sorting Options** - Sort by date, price, rating, or downloads
- **Transaction History** - Complete purchase and sale tracking
- **User Profiles** - Wallet-based user management

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Blockchain
- **Ethers.js 6** - Ethereum library
- **MetaMask** - Wallet integration
- **Solidity** - Smart contracts (mock implementation)

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
my-marketplace/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── marketplace/       # Marketplace page
│   │   ├── dashboard/         # User dashboard
│   │   ├── about/             # About page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── Navigation.tsx     # Navigation bar
│   │   ├── DataSetCard.tsx    # Dataset display card
│   │   ├── MarketplaceFilters.tsx # Search and filter
│   │   └── UploadDataSet.tsx  # Dataset upload modal
│   ├── lib/                   # Utility libraries
│   │   ├── wallet.ts          # Wallet management
│   │   └── contracts.ts       # Smart contract integration
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # Shared types
├── public/                    # Static assets
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/my-marketplace.git
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

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_NETWORK_ID=1
NEXT_PUBLIC_NETWORK_NAME=Ethereum Mainnet
```

## 📖 Usage Guide

### Connecting Wallet
1. Click "Connect Wallet" in the navigation
2. Approve MetaMask connection
3. Your wallet address will be displayed

### Browsing Datasets
1. Navigate to the Marketplace page
2. Use the search bar to find specific datasets
3. Apply filters by category, price, or rating
4. Sort results by different criteria

### Purchasing Datasets
1. Find a dataset you want to purchase
2. Click the "Purchase" button
3. Confirm the transaction in MetaMask
4. Wait for blockchain confirmation

### Uploading Datasets
1. Click "Upload Dataset" in the marketplace
2. Fill in the required information:
   - Title and description
   - Price in ETH
   - Category and tags
   - File size
3. Submit the form
4. Confirm the transaction in MetaMask

### Managing Your Account
1. Navigate to the Dashboard
2. View your transaction history
3. Track your earnings and purchases
4. Manage your listed datasets

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Structure

#### Components
- **Navigation.tsx** - Main navigation with wallet integration
- **DataSetCard.tsx** - Reusable dataset display component
- **MarketplaceFilters.tsx** - Advanced filtering and sorting
- **UploadDataSet.tsx** - Modal for dataset upload

#### Libraries
- **wallet.ts** - MetaMask wallet management
- **contracts.ts** - Smart contract interactions

#### Types
- **index.ts** - TypeScript interfaces for data structures

### Adding New Features

1. **Create new components** in `src/components/`
2. **Add types** to `src/types/index.ts`
3. **Update pages** in `src/app/`
4. **Test thoroughly** with MetaMask

## 🧪 Testing

### Manual Testing Checklist
- [ ] Wallet connection/disconnection
- [ ] Dataset search and filtering
- [ ] Dataset purchase flow
- [ ] Dataset upload process
- [ ] Dashboard functionality
- [ ] Responsive design on mobile

### Browser Compatibility
- Chrome (recommended with MetaMask)
- Firefox
- Safari
- Edge

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 🔒 Security Considerations

### Smart Contract Security
- All transactions require user confirmation
- Price validation on purchase
- Access control for dataset management

### Frontend Security
- Input validation on all forms
- XSS protection with React
- Secure wallet integration

### Data Privacy
- No personal data stored on blockchain
- Encrypted data transmission
- User-controlled data sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test all new features thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Shreyansh Shukla** - Team Leader & Full Stack Developer
- **Akash Singh** - Authentication & User Flow
- **Purushottam Pandey** - Dashboard & Data Management
- **Shivansh Mishra** - UI/UX & Responsive Design
- **Harshit Dwivedi** - Routing & Frontend Components

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Ethers.js](https://docs.ethers.io/) for Ethereum integration
- [MetaMask](https://metamask.io/) for wallet functionality
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

For support, email support@blockmarketai.com or create an issue in this repository.

---

**Built with ❤️ by Team Shreytan**

*The future of decentralized data trading starts here.* 