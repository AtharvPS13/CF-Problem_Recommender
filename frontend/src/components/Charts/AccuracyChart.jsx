import React from 'react'
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend} from 'recharts';
import { useState,useEffect } from 'react'
import axios from 'axios'
import './AccuracyChart.css'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className='Accepted'>Accepted: {data.accepted}</p>
        <p className='Wrong'>Wrong: {data.wrong}</p>
      </div>
    );
  }

  return null;
}

function AccuracyChart() {

  const [data,setData] = useState([])

  useEffect(()=>{
    axios.get("http://localhost:8000/api/rating-accuracy")
      .then(response=>{
        setData(response.data)
        console.log("Accuracy", response.data); 
      })
      .catch(error =>{
        console.error("Error Fetching rating accuracy",error)
      })
  },[])

  return (
    <div className='bar-chart'>
      <BarChart
      width={800}
      height={400}
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="rating"
      />
      <YAxis domain={[0, 100]} />
      <Tooltip 
        content={<CustomTooltip />} 
        cursor={{ fill: 'transparent' }}
      />
      <Legend />
      <Bar dataKey="accuracy" fill="#4ba1beff" />

    </BarChart>
    </div>
    
  )
}

export default AccuracyChart