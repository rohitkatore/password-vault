# 🔐 Password Vault - Secure Password Manager

A **production-ready** full-stack secure password manager with zero-knowledge client-side encryption, built with Next.js 15, TypeScript, MongoDB, and modern web security practices.

![Project Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🔒 Security First
- **Zero-Knowledge Architecture** - Master password never sent to server
- **AES-256 Encryption** - Military-grade client-side encryption via crypto-js
- **PBKDF2 Key Derivation** - 100,000 iterations for enhanced security
- **Bcrypt Password Hashing** - Secure authentication with 10 salt rounds

### 🎯 Core Functionality
- **Secure Password Generator** - Cryptographically random passwords with customizable rules
- **Personal Vault** - Store unlimited passwords, usernames, URLs, and notes
- **Master Password Protection** - Single password to access all vault items
- **Real-time Password Strength** - Visual feedback on password security
- **Copy to Clipboard** - One-click copy for all fields

### 🌟 User Experience
- **Dark Mode** - Beautiful light/dark theme toggle with persistence
- **Export/Import** - Backup and restore vault data (JSON/CSV formats)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Intuitive UI** - Clean, modern interface with emoji icons
- **Search & Filter** - Quickly find vault items (coming soon)

### 🔐 Authentication
- **NextAuth.js v5** - Industry-standard authentication
- **JWT Sessions** - Secure, stateless session management
- **Protected Routes** - Automatic redirect for unauthorized access

## 🎯 Status: **PRODUCTION READY ✅**

All features implemented, tested, and deployed:

- ✅ **Step A**: Project Setup & Database Models
- ✅ **Step B**: Authentication System (NextAuth.js v5)
- ✅ **Step C**: Client-Side Encryption (AES-256 + PBKDF2)
- ✅ **Step D**: Password Generator with Strength Checker
- ✅ **Step E**: Vault Dashboard with Full CRUD Operations
- ✅ **Step F**: Polish, Dark Mode, Export/Import, Emoji Icons

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/rohitkatore/password-vault.git
cd password-vault

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local with:
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_secret_key
NODE_ENV=development

# 4. Run development server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

## 🌐 Live Demo

**Deployed on Vercel**: [https://password-vault-jade.vercel.app](https://password-vault-jade.vercel.app)

Try it out with sample data provided in `sample-vault-data.json`!

## 🎬 Features Showcase

### 🔑 Password Generator
- **Customizable Length** - 8 to 128 characters
- **Character Options** - Uppercase, lowercase, numbers, symbols
- **Cryptographically Secure** - Uses Web Crypto API
- **Real-time Strength** - Visual indicator (Weak/Medium/Strong/Very Strong)
- **One-Click Copy** - Copy generated password instantly

### 🗄️ Secure Vault
- **Encrypted Storage** - All data encrypted before storage
- **Quick Actions** - Copy username/password/URL with one click
- **Show/Hide Passwords** - Toggle password visibility
- **Edit & Delete** - Full CRUD operations on vault items
- **Decryption on Demand** - Items only decrypted when accessed

### 🔐 Master Password System
- **First-Time Setup** - Set master password on first vault access
- **Verification** - Prompt before any vault operations
- **Change Master Password** - Update with old password verification
- **Session Persistence** - Stay unlocked during session

### 🌓 Dark Mode
- **System Preference Detection** - Auto-detect user's theme
- **Manual Toggle** - Switch themes with sun/moon icon
- **Persistent** - Theme saved in localStorage
- **Smooth Transitions** - Beautiful color transitions

### 📤 Export & Import
- **JSON Export** - Full vault backup with metadata
- **CSV Export** - Compatible with other password managers
- **Import Validation** - Checks file format before import
- **Version Control** - Export includes version and timestamp

## 🔧 Tech Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript 5.0+** - Type-safe development
- **Tailwind CSS v4** - Modern utility-first styling
- **React 19** - Latest React features

### Backend
- **Node.js** - JavaScript runtime
- **NextAuth.js v5** - Authentication framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 8.x** - MongoDB object modeling

### Security & Cryptography
- **crypto-js 4.2.0** - AES-256 encryption for vault data
- **bcryptjs 3.0.2** - Password hashing for authentication
- **PBKDF2** - Key derivation (100,000 iterations)
- **Zero-Knowledge Architecture** - Server never sees plaintext

### Development Tools
- **Turbopack** - Fast bundler (Next.js 15)
- **ESLint 9.x** - Code linting
- **TypeScript Strict Mode** - Enhanced type checking

## 📖 Documentation

### Project Documentation
- [`PROJECT_COMPLETE.md`](./PROJECT_COMPLETE.md) - Complete project overview & architecture
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - Common issues and solutions

### Implementation Steps
- [`STEP_A_COMPLETE.md`](./STEP_A_COMPLETE.md) - Project setup & database models
- [`STEP_B_COMPLETE.md`](./STEP_B_COMPLETE.md) - Authentication system (NextAuth.js)
- [`STEP_C_COMPLETE.md`](./STEP_C_COMPLETE.md) - Client-side encryption (AES-256)
- [`STEP_D_COMPLETE.md`](./STEP_D_COMPLETE.md) - Password generator & strength checker
- [`STEP_E_COMPLETE.md`](./STEP_E_COMPLETE.md) - Vault dashboard & CRUD operations
- [`STEP_F_COMPLETE.md`](./STEP_F_COMPLETE.md) - Polish, dark mode, export/import

---

## � Project Structure

```
password-vault/
├── app/                           # Next.js 15 App Router
│   ├── api/                       # API routes
│   │   ├── auth/                  # Authentication endpoints
│   │   │   ├── [...nextauth]/    # NextAuth.js handler
│   │   │   └── register/          # User registration
│   │   ├── master-password/       # Master password verification
│   │   └── vault/                 # Vault CRUD operations
│   ├── layout.tsx                 # Root layout with providers
│   └── page.tsx                   # Main dashboard page
├── components/                    # React components
│   ├── ExportImportModal.tsx      # Export/Import functionality
│   ├── MasterPasswordPrompt.tsx   # Master password entry
│   ├── PasswordGenerator.tsx      # Password generator UI
│   ├── SessionProvider.tsx        # NextAuth session provider
│   ├── ThemeToggle.tsx            # Dark mode toggle
│   ├── VaultItemCard.tsx          # Individual vault item
│   └── VaultItemForm.tsx          # Add/Edit vault item form
├── contexts/                      # React contexts
│   └── EncryptionContext.tsx      # Encryption key management
├── lib/                           # Utility functions
│   ├── auth.ts                    # NextAuth configuration
│   ├── auth-helpers.ts            # Auth helper functions
│   ├── crypto.ts                  # Encryption/decryption
│   ├── db.ts                      # MongoDB connection
│   ├── password-generator.ts      # Password generation logic
│   ├── password-strength.ts       # Strength analysis
│   └── vault-export.ts            # Export/Import utilities
├── models/                        # MongoDB models
│   ├── User.ts                    # User schema
│   └── VaultItem.ts               # VaultItem schema
├── types/                         # TypeScript definitions
│   ├── index.ts                   # Shared types
│   └── global.d.ts                # Global type declarations
├── public/                        # Static assets
├── .env.local                     # Environment variables (not committed)
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies & scripts
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
# For local: mongodb://localhost:27017/password-vault
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/password-vault
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_here

# Node Environment
NODE_ENV=development
```

### Generating NEXTAUTH_SECRET

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Add database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database user password

## 🗄️ Database Schema

### Users Collection

```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  password: string (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### VaultItems Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  title: string (encrypted, required),
  username: string (encrypted),
  password: string (encrypted),
  url: string (encrypted),
  notes: string (encrypted),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Architecture

### Cryptography Implementation

**crypto-js (AES-256):** Client-side encryption of all vault data (passwords, usernames, notes) using AES-256 symmetric encryption. Encryption keys are derived from the user's master password using PBKDF2 (100,000 iterations) with their email as salt, ensuring zero-knowledge architecture—the server never sees plaintext data or encryption keys.

**bcryptjs:** Server-side hashing of user login passwords and master password verification hashes using bcrypt with 10 salt rounds, protecting authentication credentials with industry-standard one-way hashing that's resistant to brute-force attacks.

### Security Features

✅ **Zero-Knowledge Architecture** - Server never accesses your passwords  
✅ **Client-Side Encryption** - All data encrypted before leaving your browser  
✅ **PBKDF2 Key Derivation** - 100,000 iterations prevent brute-force attacks  
✅ **No Plaintext Storage** - Database only contains encrypted ciphertext  
✅ **Master Password** - Single password to unlock your vault (never stored)  
✅ **Bcrypt Hashing** - Login passwords hashed with 10 salt rounds  
✅ **JWT Sessions** - Secure, stateless authentication tokens

## 📦 Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.5.4 | React framework with App Router |
| `react` | 19.x | UI library |
| `react-dom` | 19.x | React DOM renderer |
| `mongoose` | ^8.x | MongoDB object modeling |
| `next-auth` | ^5.x | Authentication library |
| `bcryptjs` | ^3.0.2 | Password hashing |
| `crypto-js` | ^4.2.0 | Client-side encryption (AES-256) |
| `tailwindcss` | ^4.x | Utility-first CSS framework |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.x | Type-safe JavaScript |
| `@types/node` | ^20.x | Node.js type definitions |
| `@types/react` | ^19.x | React type definitions |
| `@types/bcryptjs` | ^2.4.6 | Bcrypt type definitions |
| `@types/crypto-js` | ^4.2.2 | Crypto-js type definitions |
| `eslint` | ^9.x | Code linting |
| `eslint-config-next` | 15.x | Next.js ESLint config |

## 💻 Development Commands

```bash
# Install all dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📚 How to Use

### First Time Setup

1. **Register Account**
   - Navigate to the registration page
   - Enter your email and create a login password
   - This password is for authentication only, not encryption

2. **Set Master Password**
   - After logging in, you'll be prompted to set a master password
   - This password encrypts all your vault data
   - **IMPORTANT**: Master password cannot be recovered if forgotten!

3. **Add Vault Items**
   - Click "Add New Password" button
   - Fill in title, username, password, URL, and notes
   - Or use the password generator for secure passwords
   - Data is automatically encrypted before saving

### Daily Usage

1. **Login** with your account credentials
2. **Unlock Vault** by entering your master password
3. **Browse & Search** your stored passwords
4. **Quick Actions**:
   - 👁️ Show/Hide password
   - 📋 Copy username/password/URL
   - ✏️ Edit vault item
   - 🗑️ Delete vault item

### Backup & Restore

1. **Export Vault**
   - Click "📦 Export / Import Vault" button
   - Choose JSON (with metadata) or CSV format
   - Download encrypted backup file

2. **Import Vault**
   - Click "📦 Export / Import Vault" button
   - Select "Import" tab
   - Upload previously exported JSON file
   - Items will be re-encrypted with current master password

## 🧪 Testing with Sample Data

Sample vault data is provided in `sample-vault-data.json`:

```json
{
  "version": "1.0.0",
  "exportedAt": "2025-10-08T10:30:00.000Z",
  "itemCount": 5,
  "items": [
    // 5 sample entries: Gmail, GitHub, Netflix, AWS, LinkedIn
  ]
}
```

**To test import:**
1. Login and set up master password
2. Click "📦 Export / Import Vault"
3. Select "📥 Import" tab
4. Choose `sample-vault-data.json`
5. Confirm import - 5 items will be added to your vault

## �️ API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication handler

### Master Password
- `POST /api/master-password` - Set or verify master password
- `PUT /api/master-password` - Change master password

### Vault Operations
- `GET /api/vault` - Get all user's vault items
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/[id]` - Update existing vault item
- `DELETE /api/vault/[id]` - Delete vault item

All API routes are protected and require valid NextAuth session.

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Fails**
```bash
Error: MongoServerError: bad auth
```
- Check MONGODB_URI in `.env.local`
- Verify database user credentials
- Check IP whitelist in MongoDB Atlas

**2. NextAuth Session Issues**
```bash
Error: [next-auth][error][JWT_SESSION_ERROR]
```
- Ensure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

**3. Decryption Fails**
```bash
Error: Failed to decrypt data - wrong master password?
```
- Verify master password is correct
- If master password was changed, old items won't decrypt
- Use "Change Master Password" feature to re-encrypt

**4. Import Fails**
```bash
Error: Invalid vault export format
```
- Ensure JSON file has correct format (version, items, itemCount)
- Use sample-vault-data.json as reference
- Check file is valid JSON (use jsonlint.com)

**5. Dark Mode Not Persisting**
- Check if LocalStorage is enabled in browser
- Clear site data and try again
- Some browsers block LocalStorage in incognito mode

### Debug Mode

Enable detailed logging by setting in `.env.local`:
```env
NODE_ENV=development
```

Check browser console for detailed error messages.

## �📝 Important Notes

### Security Considerations
- **Never commit `.env.local`** - Contains sensitive credentials
- **Use strong NEXTAUTH_SECRET** - Generate with `openssl rand -base64 32`
- **Master password** - Never stored anywhere, only used for key derivation
- **Database backups** - Even encrypted data should be backed up regularly
- **HTTPS only in production** - Never transmit data over HTTP
- **Regular updates** - Keep dependencies updated for security patches

### Production Deployment
- Set environment variables in your hosting platform (Vercel, Netlify, etc.)
- Use MongoDB Atlas or similar cloud database
- NEXTAUTH_URL must match your production domain exactly
- Enable HTTPS for all production traffic
- Consider rate limiting for API routes
- Set up error monitoring (Sentry, LogRocket, etc.)

### Browser Compatibility
- Modern browsers with Web Crypto API support
- Chrome 37+, Firefox 34+, Safari 11+, Edge 79+
- LocalStorage required for theme and session persistence
- JavaScript must be enabled

## 🗺️ Roadmap

### Planned Features

- [ ] **Search & Filter** - Search vault items by title, username, or URL
- [ ] **Categories/Tags** - Organize passwords into categories
- [ ] **Password History** - Track password changes over time
- [ ] **Breach Detection** - Check if passwords were compromised
- [ ] **Two-Factor Authentication** - Add 2FA support for accounts
- [ ] **Shared Vaults** - Share passwords securely with team members
- [ ] **Browser Extension** - Auto-fill passwords in browsers
- [ ] **Mobile App** - Native iOS/Android applications
- [ ] **Biometric Auth** - Fingerprint/Face ID support
- [ ] **Password Expiry** - Remind users to update old passwords

### Future Enhancements

- [ ] Bulk import from other password managers
- [ ] Password strength audit report
- [ ] Security dashboard with analytics
- [ ] Multi-device sync with E2E encryption
- [ ] Offline mode with service worker
- [ ] Advanced search with regex support

## ❓ FAQ

### Q: What happens if I forget my master password?
**A:** Your vault data cannot be recovered. The master password is never stored and is only used for key derivation. This is a core security feature of zero-knowledge architecture. **Always backup your master password securely!**

### Q: Can the server admin see my passwords?
**A:** No. All encryption happens on your device (client-side). The server only stores encrypted ciphertext that cannot be decrypted without your master password.

### Q: How secure is this password manager?
**A:** It uses industry-standard AES-256 encryption, PBKDF2 with 100,000 iterations, and bcrypt hashing. However, like any software, it should be used with caution. For maximum security, use strong, unique master passwords.

### Q: Can I use this for my business/team?
**A:** Currently, it's designed for personal use. Team features (shared vaults, permissions) are planned for future releases.

### Q: Is my data backed up automatically?
**A:** No automatic backups. Use the Export feature regularly to create manual backups of your encrypted vault data.

### Q: What's the difference between login password and master password?
**A:** 
- **Login Password**: Authenticates you to the application (stored as bcrypt hash)
- **Master Password**: Encrypts your vault data (never stored, used only for key derivation)

### Q: Can I change my master password?
**A:** Yes! Use the "Change Master Password" feature. All vault items will be re-encrypted with the new password.

### Q: What browsers are supported?
**A:** All modern browsers with Web Crypto API support: Chrome 37+, Firefox 34+, Safari 11+, Edge 79+

### Q: Is there a mobile app?
**A:** Not yet, but it's planned! The web app is responsive and works on mobile browsers.

### Q: How do I migrate from another password manager?
**A:** Export your data from the other manager as CSV, then format it to match our JSON structure and import it using the Import feature.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs** - Open an issue with detailed reproduction steps
- 💡 **Suggest Features** - Share your ideas for improvements
- 📖 **Improve Docs** - Fix typos, add examples, clarify instructions
- 🔧 **Submit PRs** - Fix bugs or implement new features

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/password-vault.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes and test thoroughly
5. Commit: `git commit -m "Add: your feature description"`
6. Push: `git push origin feature/your-feature-name`
7. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Add comments for complex logic
- Run `npm run lint` before committing
- Test all changes locally

## ⚡ Performance

### Optimization Features

- **Turbopack** - Lightning-fast development builds
- **Server Components** - Reduced JavaScript bundle size
- **Code Splitting** - Automatic route-based splitting
- **MongoDB Indexing** - Optimized database queries
- **Lazy Decryption** - Only decrypt items when accessed
- **Session Caching** - Reduced authentication overhead

### Lighthouse Scores (Target)

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Rohit Katore**
- GitHub: [@rohitkatore](https://github.com/rohitkatore)
- LinkedIn: [Rohit Katore](https://linkedin.com/in/rohitkatore)
- Project: [Password Vault](https://github.com/rohitkatore/password-vault)
- Live Demo: [https://password-vault-rohitkatore.vercel.app](https://password-vault-rohitkatore.vercel.app)

## 🙏 Acknowledgments

Special thanks to:

- **Next.js Team** - For the incredible React framework
- **Vercel** - For seamless deployment and hosting
- **MongoDB** - For reliable cloud database services
- **crypto-js Community** - For robust encryption library
- **bcryptjs Community** - For secure password hashing
- **NextAuth.js Team** - For authentication made easy
- **Tailwind CSS** - For beautiful, utility-first styling
- **Open Source Community** - For inspiration and support

## 🌟 Star This Project

If you find this project helpful, please consider giving it a ⭐ on GitHub!

## 📞 Support

- 📧 Email: rohitkatore645@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/rohitkatore/password-vault/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/rohitkatore/password-vault/discussions)

---

<div align="center">

**Status**: Production Ready ✅  
**Version**: 1.0.0  
**Last Updated**: October 2025

Made with ❤️ by [Rohit Katore](https://github.com/rohitkatore)

[⬆ Back to Top](#-password-vault---secure-password-manager)

</div>
