// MainFunctions.js
import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import Plot from 'react-plotly.js';
import axios from 'axios';
import './Functions.css';

const Functions = () => {
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [rainPrediction, setRainPrediction] = useState(null);

  const handlePredictRain = async () => {
    try {
      const response = await axios.post('http://localhost:8000/predict-rain', null, {
        params: { temp: parseFloat(temp), humidity: parseFloat(humidity) }
      });
      setRainPrediction(response.data.rain ? 'Rain' : 'No Rain');
    } catch (error) {
      console.error('Error predicting rain:', error);
    }
  };

  return (
    <Card title="Rain Prediction" className="main-functions">
      <div className="input-fields">
        <Input
          placeholder="Temperature"
          type="number"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          required
        />
        <Input
          placeholder="Humidity"
          type="number"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          required
        />
      </div>
      <Button onClick={handlePredictRain} type="primary" style={{ marginTop: '10px' }}>
        Predict Rain
      </Button>

      {rainPrediction !== null && (
        <>
          <h3>Prediction Result: {rainPrediction}</h3>
          <Plot
            data={[
              {
                x: [temp],
                y: [humidity],
                mode: 'markers',
                marker: { size: 12 },
                name: rainPrediction,
              },
            ]}
            layout={{
              title: 'Temperature vs Humidity',
              xaxis: { title: 'Temperature' },
              yaxis: { title: 'Humidity' },
            }}
          />
        </>
      )}
    </Card>
  );
};

export default Functions;
