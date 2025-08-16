# 🎯 Codeforces Problem Recommender

An intelligent web application that analyzes Codeforces user performance and provides personalized problem recommendations to improve weak areas and enhance competitive programming skills.

## ✨ Key Features

- 🔍 **Smart User Analysis**: Fetches and analyzes user data from Codeforces API
- 📊 **Performance Insights**: Analyzes past submissions and identifies weak topics
- 🧠 **ML-Powered Recommendations**: Uses machine learning to recommend optimal problems
- ⚡ **Fast & Lightweight**: Browser-based with local storage, no database required
- 🌐 **Modern Web Stack**: React frontend + FastAPI backend
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Demo**: [Live Application](https://cf-problem-recommender.vercel.app/)

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- **CSS3** for styling

### Backend
- **FastAPI** for REST API
- **Scikit-learn** for ML models
- **Pandas** for data processing

## 📁 Project Structure

```
ml-project/
├── backend/
│   ├── api.py              # FastAPI endpoints
│   ├── main.py             # Core logic for data processing
│   ├── model.py            # ML model implementation
│   ├── requirements.txt    # Python dependencies
│   └── runtime.txt         # Python version
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── Services/      # API service layer
│   │   ├── context/       # React context providers
│   │   └── assets/        # Static assets
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
└── README.md
```

## 🚦 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Codeforces account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python -m uvicorn api:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔌 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/recommend` | Get personalized problem recommendations |
| GET | `/api/rating-accuracy` | Get accuracy statistics by rating |
| GET | `/syncproblems` | Get user's solved problems |

### Example Request

```bash
curl -X POST "http://localhost:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{"handle": "tourist"}'
```

## 🎯 How It Works

1. **Data Collection**: Fetches user submissions from Codeforces API
2. **Feature Extraction**: Processes submission data to extract features
3. **Model Training**: Trains ML model on user performance patterns
4. **Problem Filtering**: Identifies unsolved problems within skill range
5. **Recommendation**: Ranks problems based on improvement potential

## 📊 Features Breakdown

### User Analysis
- Submission history analysis
- Rating progression tracking
- Weak topic identification
- Performance metrics calculation

### Problem Recommendations
- Personalized difficulty levels
- Topic-based recommendations
- Skill gap targeting
- Progress tracking

### Visualizations
- Rating accuracy charts
- Topic performance graphs
- Progress over time
- Problem difficulty distribution

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Backend linting
cd backend
flake8 .

# Frontend linting
cd frontend
npm run lint
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render)
```bash
# Push to GitHub and connect to Render
# Set environment variables in Render dashboard
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

