import { useState } from 'react'
import './App.css'
import axios from 'axios';
import AccuracyChart from './components/Charts/AccuracyChart';

function App() {
  
  const [problems,setProblems]= useState([])
  const [handle,setHandle]= useState('')
  const [loading , setLoading]=useState(false)
  const [activeCircles, setActiveCircles] =useState([])
  

  const fetchRecommendations = async () => {
    if(!handle.trim()) return
    setLoading(true)

    try {
      const response = await axios.post('http://127.0.0.1:8000/recommend', {
        handle: handle.trim()
      });

      console.log("API Response:", response.data); 

      setProblems(response.data.recommendations);
      setActiveCircles(Array(response.data.recommendations.length).fill(false));
    }
    catch (error) {
      alert("Failed to fetch recommendations");
      console.error("Error:", error);
    }

    setLoading(false)
  }

  const toggleCircles = (index) => {
    const updated = [...activeCircles];
    updated[index] = !updated[index];
    setActiveCircles(updated);
  }

  return (
    <div className='container'>
      <h1 className='heading'>Codeforces Problem Recommender</h1>

      <div className='input-grp'>
        <input
        type='text'
        value={handle}
        onChange={(e)=>setHandle(e.target.value)}
        placeholder='Enter Codeforces Handle'
        className='input-box'
        />
        <button onClick={fetchRecommendations} className='fetch-btn'>
          Get Problems
        </button>
      </div>
      
      {loading && <p className='loading'>Loading....</p>}

      <ul className='problems-list'>
        {problems.map((p, idx) => (
          <li key={idx} className='problem-card'>
            <a
              href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
              target="_blank"
              rel="noreferrer"
            >
              {p.contestId}-{p.index} {p.problem} {p.rating}
            </a>
            <span 
            className={`circle ${activeCircles[idx] ? 'green':'grey'}`}
            onClick={()=>toggleCircles(idx)}
            ></span>
          </li>
        ))}
      </ul>
      {problems.length > 0 && <AccuracyChart />}

    </div>
  )
}

export default App
