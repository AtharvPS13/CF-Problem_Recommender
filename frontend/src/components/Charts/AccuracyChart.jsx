import React from 'react'
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,Cell} from 'recharts';
import { useState,useEffect } from 'react'
import axios from 'axios'
import './AccuracyChart.css'
import RatingTiers from '../RatingTiers/RatingTiers';

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

const getColor = (rating) => {
  const tier=RatingTiers.find(item => rating>=item.min && rating<=item.max)
  return tier ? tier.color : '#00000017'
}

function AccuracyChart() {

  const [data,setData] = useState([])

  useEffect(()=>{
    axios.get("https://cf-problem-recommender.onrender.com/api/rating-accuracy")
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
      <Bar dataKey="accuracy">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getColor(entry.rating)} />
        ))}
      </Bar>
    </BarChart>
    </div>
    
  )
}

export default AccuracyChart