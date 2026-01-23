
# 🇳🇬 Naija Expense Tracker
Naija Tracker is a high-performance, responsive dashboard built to help users manage their Naira with intelligence. It features automated expense categorization using Nigerian slang, real-time FX conversion (USD/GBP), and professional PDF reporting.

## ✨ Key Features

* **📊 Financial Visualizations:** Interactive Area Charts (Spending Trends) and Donut Charts (Category Breakdown) powered by **Recharts**.

* **🌍 Multi-Currency Support:** Real-time conversion between **NGN, USD, and GBP** using live exchange rate APIs.

* **🧠 Smart Categorization:** Built-in keyword engine that recognizes Nigerian terms like *Bole, Suya, Keke, Bolt, EKEDC, and Mama Put* to automatically tag expenses.

* **✏️ Search & Inline Edit:** Instant filtering of transaction history and the ability to update amounts or descriptions without leaving the page.
* **📄 PDF Statements:** Generate and download professional, branded PDF reports of your financial history.
* **💾 Persistent Storage:** Data stays safe on your device using **Zustand Persistence**—no database required for the base version.

## 📳 UI view
![desktopview]()
![mobileview]()

## 🛠️ Tech Stack

* **Frontend:** React 18 + Vite
* **State Management:** Zustand (with LocalStorage middleware)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React (`react-icons/lu`)
* **Charts:** Recharts
* **PDF Generation:** jsPDF & jsPDF-AutoTable

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── dashboard/       # Charts, CurrencyConverter, SummaryGrid, Modals
│   ├── expenses/        # ExpenseForm, TransactionList (Search/Edit logic)
│   └── ExpenseTracker.jsx # Main Layout Container
├── store/
│   └── expenseStore.js  # Centralized State & FX Logic
└── App.jsx              # Root Entry Point

```

---

## 🚀 Getting Started

1. **Clone the Repo**
```bash
git clone https://github.com/yourusername/naija-tracker.git
cd naija-tracker

```


2. **Install Dependencies**
```bash
npm install

```


3. **Run Development Server**
```bash
npm run dev

```



---

## 🗺️ Roadmap

* [ ] **User Auth:** Signup/Login via Supabase.
* [ ] **AI Assistant (RAG):** Chat with your spending data to get saving tips.
* [ ] **Receipt OCR:** Upload photos of receipts to auto-fill the form.

---
