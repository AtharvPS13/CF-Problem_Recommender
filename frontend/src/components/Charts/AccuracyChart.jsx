import { useState,useEffect } from 'react'
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,Cell} from 'recharts';
import './AccuracyChart.css'
import RatingTiers from '../RatingTiers/RatingTiers';
import { fetchAccuracy } from '../../Services/api';

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
    const loadData = async () => {
      const result = await fetchAccuracy()
      if(result.success) {
        setData(Array.isArray(result.rating_accuracy) ? result.rating_accuracy : []);
        console.log("Accuracy:",result.rating_accuracy)
      }
    }
    loadData();
  },[])

  return (
    <div className='bar-chart'>
      <BarChart
      width={800}
      height={400}
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="rating"/>
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