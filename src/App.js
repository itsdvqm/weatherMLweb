import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const App = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [filePath, setFilePath] = useState('');
  const [results, setResults] = useState(null);
  const [temp, setTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [rainPrediction, setRainPrediction] = useState(null);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) return;
    const formData = new FormData();
    formData.append('file', csvFile);
    try {
      const response = await axios.post('http://localhost:8000/upload', formData);
      setColumns(response.data.columns);
      setFilePath(response.data.file_path);
      setSelectedColumns([]);
      setSelectedTarget('');
      setResults(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleModelSelection = (model) => {
    setSelectedModel(model);
    setSelectedColumns([]);
    setSelectedTarget('');
    setResults(null);
  };

  const handleColumnSelection = (column) => {
    if (selectedModel === 'kmeans') {
      setSelectedColumns(prev => 
        prev.includes(column) 
          ? prev.filter(col => col !== column) 
          : [...prev, column]
      );
    } else {
      if (column !== selectedTarget) {
        setSelectedColumns(prev => 
          prev.includes(column) 
            ? prev.filter(col => col !== column) 
            : [...prev, column]
        );
      }
    }
  };

  const handleTargetSelection = (column) => {
    setSelectedTarget(column);
    setSelectedColumns(prev => prev.filter(col => col !== column));
  };

  const handleRunModel = async () => {
    if (selectedModel === 'kmeans' && selectedColumns.length < 2) {
      alert("Please select at least two columns for KMeans clustering.");
      return;
    }
    if ((selectedModel === 'linear' || selectedModel === 'logistic') && (selectedColumns.length < 1 || !selectedTarget)) {
      alert("Please select at least one feature and one target for regression.");
      return;
    }

    try {
      let response;
      if (selectedModel === 'kmeans') {
        response = await axios.post('http://localhost:8000/run-kmeans', {
          columns: selectedColumns,
          file_path: filePath,
        });
      } else if (selectedModel === 'linear') {
        response = await axios.post('http://localhost:8000/run-linear-regression', {
          features: selectedColumns,
          target: selectedTarget,
          file_path: filePath,
        });
      } else if (selectedModel === 'logistic') {
        response = await axios.post('http://localhost:8000/run-logistic-regression', {
          features: selectedColumns,
          target: selectedTarget,
          file_path: filePath,
        });
      }
      setResults(response.data);
    } catch (error) {
      console.error(`Error running ${selectedModel}:`, error);
    }
  };

  const handlePredictRain = async () => {
    try {
      const response = await axios.post('http://localhost:8000/predict-rain', null, {
        params: {
          temp: parseFloat(temp),
          humidity: parseFloat(humidity)
        }
      });
      setRainPrediction(response.data.rain ? 'Rain' : 'No Rain');
    } catch (error) {
      console.error('Error predicting rain:', error);
    }
  };

  return (
    <div>
      <h1>Assignment 3 Web</h1>
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload CSV</button>

      {columns.length > 0 && (
        <div>
          <h2>Select Model</h2>
          <button onClick={() => handleModelSelection('kmeans')}>KMeans Clustering</button>
          <button onClick={() => handleModelSelection('linear')}>Linear Regression</button>
          <button onClick={() => handleModelSelection('logistic')}>Logistic Regression</button>
        </div>
      )}

      {selectedModel && (
        <div>
          <h2>Select Columns for {selectedModel === 'kmeans' ? 'Clustering' : 'Regression'}</h2>
          {selectedModel !== 'kmeans' && (
            <div>
              <h3>Select Target Variable</h3>
              {columns.map((col, idx) => (
                <label key={idx} style={{ display: 'block', marginBottom: '5px' }}>
                  <input
                    type="radio"
                    name="target"
                    value={col}
                    checked={selectedTarget === col}
                    onChange={() => handleTargetSelection(col)}
                  />
                  {col}
                </label>
              ))}
            </div>
          )}
          <h3>Select {selectedModel === 'kmeans' ? 'Columns' : 'Features'}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {columns.map((col, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleColumnSelection(col)}
                  disabled={selectedModel !== 'kmeans' && selectedTarget === col}
                />
                {col}
              </label>
            ))}
          </div>
          <button onClick={handleRunModel} disabled={selectedModel === 'kmeans' ? selectedColumns.length < 2 : selectedColumns.length < 1 || !selectedTarget}>
            Run {selectedModel === 'kmeans' ? 'KMeans' : selectedModel === 'linear' ? 'Linear Regression' : 'Logistic Regression'}
          </button>
        </div>
      )}

      {results && (
        <div>
          <h2>Results</h2>
          {selectedModel === 'kmeans' && (
            <>
              <img src={`http://localhost:8000/output_plots/${results.originalPlot}`} alt="Original Data" />
              <img src={`http://localhost:8000/output_plots/${results.clusteredPlot}`} alt="Clustered Data" />
            </>
          )}
          {selectedModel === 'linear' && (
            <>
              <img src={`http://localhost:8000/output_plots/${results.predictedVsActual}`} alt="Predicted vs Actual" />
              <img src={`http://localhost:8000/output_plots/${results.residuals}`} alt="Residuals" />
              <img src={`http://localhost:8000/output_plots/${results.modelFitness}`} alt="Model Fitness" />
              <img src={`http://localhost:8000/output_plots/${results.errorMetrics}`} alt="Error Metrics" />
            </>
          )}
          {selectedModel === 'logistic' && (
            <>
              <img src={`http://localhost:8000/output_plots/${results.confusionMatrix}`} alt="Confusion Matrix" />
              <img src={`http://localhost:8000/output_plots/${results.rocCurve}`} alt="ROC Curve" />
              <img src={`http://localhost:8000/output_plots/${results.modelFitness}`} alt="Model Fitness" />
              <img src={`http://localhost:8000/output_plots/${results.classificationReport}`} alt="Classification Report" />
            </>
          )}
        </div>
      )}

      {/* Rain Prediction Section */}
      <div style={{ marginTop: "20px" }}>
        <h2>Predict Rain Based on Temperature and Humidity</h2>
        <label>
          Temperature:
          <input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} required />
        </label>
        <label style={{ marginLeft: "10px" }}>
          Humidity:
          <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} required />
        </label>
        <button onClick={handlePredictRain}>Predict Rain</button>

        {rainPrediction !== null && (
          <>
            <h3>Prediction Result: {rainPrediction}</h3>
            {/* Visualization using Plotly */}
            <Plot
              data={[
                {
                  x: [temp],
                  y: [humidity],
                  mode: "markers",
                  marker: { size: 12 },
                  name: rainPrediction,
                },
              ]}
              layout={{
                title: "Temperature vs Humidity",
                xaxis: { title: "Temperature" },
                yaxis: { title: "Humidity" },
                annotations:[{
                    xref:'x',
                    yref:'y',
                    xanchor:'left',
                    yanchor:'bottom',
                    text:`Prediction Result:${rainPrediction}`,
                    showarrow:true
                }]
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;