import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Problems from './pages/Problems/Problems'
import Stats from './pages/Stats/Stats'
import Header from './components/Header/Header'
import { ProblemProvider } from './context/ProblemContext'


function App() {
  
  return (
    <ProblemProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Problems />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Router>
    </ProblemProvider>
  )
}

export default App
