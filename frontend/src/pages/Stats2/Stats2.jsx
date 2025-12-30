import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchTagStatistics } from '../../Services/api';
import './Stats2.css';

export default function Stats2() {
  const [tagData, setTagData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTagStatistics();
  }, []);

  const loadTagStatistics = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchTagStatistics(15);
    
    if (result.success) {
      setTagData(result.data);
    } else {
      setError(result.error || 'Failed to fetch tag statistics');
    }
    setLoading(false);
  };

  // Convert data to format suitable for Recharts
  const prepareChartData = (bucketLabel, tags, frequencies) => {
    return tags.map((tag, index) => ({
      tag: tag.length > 15 ? tag.substring(0, 15) + '...' : tag,
      frequency: frequencies[index],
      fullTag: tag
    }));
  };

  const bucketLabels = ['0-1000', '1000-1300', '1300-1600', '1600-1900', '1900-2100'];

  return (
    <div className="stats2-container">
      <div className="stats2-header">
        <h1 className="stats2-title">Tag Frequency Statistics by Rating</h1>
        <p className="stats2-subtitle">Top 15 tags for each rating bucket from Codeforces problems</p>
      </div>

      {loading && (
        <div className="stats2-loading">
          <p>Loading tag statistics...</p>
        </div>
      )}

      {error && (
        <div className="stats2-error">
          <p>Error: {error}</p>
          <button onClick={loadTagStatistics} className="stats2-retry-btn">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && Object.keys(tagData).length === 0 && (
        <div className="stats2-empty">
          <p>No data available. Click retry to fetch statistics.</p>
          <button onClick={loadTagStatistics} className="stats2-retry-btn">
            Fetch Data
          </button>
        </div>
      )}

      {!loading && !error && Object.keys(tagData).length > 0 && (
        <div className="stats2-charts">
          {bucketLabels.map((bucketLabel) => {
            const bucketData = tagData[bucketLabel];
            if (!bucketData || !bucketData.tags || bucketData.tags.length === 0) {
              return null;
            }

            const chartData = prepareChartData(bucketLabel, bucketData.tags, bucketData.frequencies);

            return (
              <div key={bucketLabel} className="stats2-chart-card">
                <h2 className="stats2-chart-title">Rating: {bucketLabel}</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="tag"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#020617',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#e5e7eb'
                      }}
                      formatter={(value, name, props) => [
                        `${value} problems`,
                        props.payload.fullTag
                      ]}
                    />
                    <Legend
                      wrapperStyle={{ color: '#e5e7eb' }}
                    />
                    <Bar
                      dataKey="frequency"
                      fill="#3b82f6"
                      name="Problem Count"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

