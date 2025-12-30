# Budgetly App

A comprehensive budget tracking application built with React Native (Expo) frontend and Python Flask backend with MongoDB database.

## Features

- 📊 **Expense Tracking**: Track daily expenses with categories
- 💰 **Income Management**: Record and monitor income sources
- 🎯 **Budget Goals**: Set and track budget goals
- 🔄 **Recurring Payments**: Manage recurring expenses and income
- 📈 **Reports & Analytics**: View spending patterns with charts
- 🔔 **Reminders & Notifications**: Get notified about bills and goals
- 📱 **Cross-platform**: Works on iOS, Android, and Web
- 💾 **Data Export/Import**: Backup and restore your financial data

## Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **React Native Chart Kit** for data visualization
- **Axios** for API communication

### Backend
- **Python Flask** REST API
- **MongoDB** for data storage
- **Flask-CORS** for cross-origin requests

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local installation or cloud instance)
- **Expo CLI** (install globally: `npm install -g @expo/cli`)
- **Expo Go** app on your mobile device (or use web version)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/MohammadaminAlbooyeh/budgetly_app.git
cd budgetly_app
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install flask pymongo flask-cors
```

#### Setup MongoDB
Make sure MongoDB is running locally on port 27017, or update the connection string in `backend/app.py` for your MongoDB instance.

#### Run Backend Server
```bash
cd backend
python app.py
```
The backend will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
# For web (recommended for testing)
npm run web

# For iOS simulator
npm run ios

# For Android emulator
npm run android

# Or use Expo CLI
npx expo start
```

## API Endpoints

### Budget Management
- `GET /api/budget` - Get current budget
- `POST /api/budget` - Set/update budget

### Future Endpoints (to be implemented)
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `GET /api/income` - Get all income records
- `POST /api/income` - Add new income
- `GET /api/categories` - Get expense categories
- `GET /api/reports` - Get financial reports

## Project Structure

```
budgetly_app/
├── backend/
│   ├── app.py              # Flask API server
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── app/                # Expo Router pages
│   │   ├── (tabs)/         # Tab navigation screens
│   │   │   ├── index.tsx
│   │   │   ├── ExpensesScreen.tsx
│   │   │   ├── IncomeScreen.tsx
│   │   │   ├── CategoriesScreen.tsx
│   │   │   ├── BudgetGoalsScreen.tsx
│   │   │   ├── RecurringPaymentsScreen.tsx
│   │   │   └── ReportsScreen.tsx
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context for state management
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── constants/          # App constants and themes
│   └── assets/             # Images and fonts
├── package.json            # Root package.json
└── README.md
```

## Development

### Running Tests
```bash
# Frontend linting
cd frontend
npm run lint

# Backend (add tests when implemented)
cd backend
python -m pytest
```

### Building for Production
```bash
# Build Expo app
cd frontend
npx expo build:android
npx expo build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/MohammadaminAlbooyeh/budgetly_app/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Happy budgeting! 💰📊**