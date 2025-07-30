import React, { useEffect, useState } from 'react'
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,Cell} from 'recharts';
import { fetchAccuracy } from '../../Services/api';
import './TagsAccuracy.css'

function TagsAccuracy() {

  const [data,setData] =useState([])

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchAccuracy()
      if(result.success) {
        setData(Array.isArray(result.tags_accuracy) ? result.tags_accuracy : []);
        console.log("Accuracy:",result.tags_accuracy)
      }
    }
    loadData()
  },[])
  
  return (
    <div>
        <BarChart className='tags-chart'
        width={900}
        height={400}
        data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="tag" 
            interval={0}
            tickFormatter={(value) => value.slice(0, 7) + '...'} 
          />
          <YAxis domain={[0,100]} />
          <Legend />
          <Bar dataKey="accuracy" fill="#8884d8" label animationDuration={500} />
        </BarChart>
    </div>
  )
}

export default TagsAccuracy