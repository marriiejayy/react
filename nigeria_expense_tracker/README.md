
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
![desktopview1](https://github.com/user-attachments/assets/c3a4c4b6-93ab-4e88-aa6e-6ad366f5f2da)

![desktopview2](https://github.com/user-attachments/assets/11fed5ed-3062-429d-9504-f7656a30e089)

![mobileview](https://github.com/user-attachments/assets/624a7525-4d27-4445-9240-18be07d69480)

![mobileview2](https://github.com/user-attachments/assets/d9762b8a-33b3-400d-8657-274be8045bfb)

![mobileview3](https://github.com/user-attachments/assets/f16fb113-4442-49d5-9060-0abb8e833952)


## 🛠️ Tech Stack

* **Frontend:** React + Vite
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
cd nigeria-expense-tracker

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
