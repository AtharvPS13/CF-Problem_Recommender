import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Problems from './pages/Problems/Problems'
import Stats from './pages/Stats/Stats'
import Header from './components/Header/Header'


function App() {
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Problems />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  )
}

export default App
