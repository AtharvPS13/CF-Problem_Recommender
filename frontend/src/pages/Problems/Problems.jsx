import { useState } from 'react'
import './Problems.css'
import { recommendProblems } from '../../Services/api';

function Problems() {
  
  const [Handle,setHandle] =useState('');
  const [problems,setProblems]= useState([])
  const [loading , setLoading]=useState(false)
  const [activeCircles, setActiveCircles] =useState([])
  
  const fetchRecommendations = async () => {
    setLoading(true)

    const result = await recommendProblems(Handle)

    if(result.success) {
      console.log("API Response:", result.data)
      setProblems(result.recommendations)
      setActiveCircles(Array(result.recommendations.length).fill(false));
    } else {
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
      <div className='headingContainer'>
        <img src='/Codeforces.svg' alt='codeforces-img'></img>
        <h1 className='heading'>Codeforces Problem Recommender</h1>
      </div>
      
      <div className='input-grp'>
        <input
        type='text'
        value={Handle}
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

    </div>
  )
}

export default Problems
