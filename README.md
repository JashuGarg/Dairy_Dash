# 🥛 DairyDash - Modern Dairy Management System

> A beautiful, minimalistic dashboard for managing dairy business operations with ease.

## ✨ Features

### 🎨 **Modern UI/UX Design (v2.0)**
- Clean, minimalistic interface with professional aesthetics
- Advanced data table for customer management
- Floating action buttons for quick access
- Comprehensive search and filtering system
- Real-time activity tracking
- Dark/Light theme support
- Fully responsive design

### 👥 **Customer Management**
- Add customers manually or via voice input
- View detailed customer profiles
- Track milk type (Cow/Buffalo) and daily quantities
- Monitor outstanding payments
- Edit/Delete customer records

### 📊 **Dashboard Analytics**
- Total customers with milk type breakdown
- Outstanding amount tracking
- Today's delivery count
- Recent activity feed

### 🔍 **Advanced Filtering**
- Search by name or phone number
- Filter by milk type (All/Cow/Buffalo)
- Filter by payment status (All/Outstanding/Paid)
- Combined filters for precise results

### 🎙️ **Voice Assistant**
- Quick customer entry via voice commands
- Hindi and English language support

### 📱 **Fully Responsive**
- Mobile-optimized layout
- Tablet-friendly interface
- Desktop-enhanced experience

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/JashuGarg/Dairy_Dash.git
cd Dairy_Dash

# Install dependencies
npm install

# Set up environment variables
# Create .env file with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev
```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── CustomerTable.tsx         # Data table with actions
│   ├── FloatingActionButtons.tsx # FAB for quick access
│   ├── SearchAndFilters.tsx      # Advanced search/filter panel
│   ├── CustomerForm.tsx          # Add/Edit customer form
│   ├── CustomerModal.tsx         # Customer details modal
│   └── VoiceAssistant.tsx        # Voice input component
├── pages/
│   ├── Dashboard.tsx             # Main dashboard (redesigned)
│   ├── BillingPage.tsx           # Bill generation
│   ├── AIPredictionPage.tsx      # AI forecasting
│   └── SubscriptionPage.tsx      # Subscription management
├── contexts/
│   ├── AuthContext.tsx           # Authentication state
│   ├── CustomerContext.tsx       # Customer data management
│   ├── ThemeContext.tsx          # Light/Dark theme
│   └── LanguageContext.tsx       # i18n (Hindi/English)
├── lib/
│   ├── supabase.ts               # Supabase client setup
│   ├── customerService.ts        # Customer CRUD operations
│   ├── billService.ts            # Billing operations
│   └── auth.ts                   # Authentication helpers
└── index.css                     # Global styles & theme variables
```

---

## 🎨 Design System

### Color Palette

**Light Theme:**
- Background: `#FAFAFA` (Soft grey)
- Card: `#FFFFFF` (Pure white)
- Primary: `#10B981` (Emerald)
- Secondary: `#3B82F6` (Sky blue)
- Warning: `#F59E0B` (Amber)

**Dark Theme:**
- Background: `#0F172A` (Deep slate)
- Card: `#1E293B` (Medium slate)
- Same accent colors with adjusted contrast

### Typography
- Font: Inter (fallback: Poppins)
- Scale: 12px - 24px
- Weights: 400, 500, 600, 700

For complete design specifications, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

---

## 📖 Documentation

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Complete design guidelines
- **[QUICK_START.md](./QUICK_START.md)** - User guide for new interface
- **[VISUAL_MOCKUP.md](./VISUAL_MOCKUP.md)** - Layout reference diagrams
- **[REDESIGN_SUMMARY.md](./REDESIGN_SUMMARY.md)** - Implementation summary
- **[SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)** - Backend setup guide

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + CSS Custom Properties
- **Icons:** Lucide React
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Build Tool:** Vite
- **Language Support:** English + Hindi (i18n)

---

## ✅ Key Features Implemented

- [x] Modern minimalistic dashboard design
- [x] Customer data table with sorting
- [x] Advanced search and multi-filter system
- [x] Floating action buttons (FAB)
- [x] Real-time activity sidebar
- [x] Light/Dark theme with smooth transitions
- [x] Bilingual support (English/Hindi)
- [x] Responsive layout (mobile/tablet/desktop)
- [x] Customer CRUD operations
- [x] Outstanding payment tracking
- [x] Voice input for quick entry
- [x] Authentication with Supabase
- [x] Row-level security (RLS)

---

## 🎯 Upcoming Features

- [ ] WhatsApp bill sharing
- [ ] PDF bill generation
- [ ] AI-powered demand prediction
- [ ] Delivery scheduling
- [ ] Payment reminders
- [ ] Analytics dashboard
- [ ] Export data (CSV/Excel)
- [ ] Multi-user support

---

## 📱 Screenshots

### Light Mode Dashboard
![Light Mode](docs/screenshots/light-mode.png)

### Dark Mode Dashboard
![Dark Mode](docs/screenshots/dark-mode.png)

### Customer Table
![Table View](docs/screenshots/table-view.png)

### Mobile View
![Mobile](docs/screenshots/mobile-view.png)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Jashu Garg**
- GitHub: [@JashuGarg](https://github.com/JashuGarg)

---

## 🙏 Acknowledgments

- Design inspired by modern SaaS dashboards
- Icons by Lucide React
- Backend powered by Supabase
- UI framework: Tailwind CSS

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check documentation in `/docs` folder
- Refer to DESIGN_SYSTEM.md for design guidelines

---

**Made with ❤️ for dairy farmers and distributors**

**Version**: 2.0 (Redesigned)  
**Last Updated**: November 9, 2025
