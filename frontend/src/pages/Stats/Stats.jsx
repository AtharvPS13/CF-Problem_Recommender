import React from 'react'
import AccuracyChart from '../../components/Charts/AccuracyChart'
import TagsAccuracy from '../../components/Charts/TagsAccuracy'

function Stats() {
  return (
    <div>
        <AccuracyChart />
        <TagsAccuracy />
    </div>
  )
}

export default Stats