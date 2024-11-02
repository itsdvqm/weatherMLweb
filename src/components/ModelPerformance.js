import React, { useState } from 'react';
import axios from 'axios';
import './ModelPerformance.css';

const ModelPerformance = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [filePath, setFilePath] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => setCsvFile(e.target.files[0]);

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
    setSelectedColumns(prev =>
      selectedModel === 'kmeans'
        ? prev.includes(column)
          ? prev.filter(col => col !== column)
          : [...prev, column]
        : column !== selectedTarget
        ? prev.includes(column)
          ? prev.filter(col => col !== column)
          : [...prev, column]
        : prev
    );
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
    if ((selectedModel === 'linear' || selectedModel === 'logistic') && (!selectedTarget || selectedColumns.length < 1)) {
      alert("Please select at least one feature and one target for regression.");
      return;
    }

    try {
      let response;
      if (selectedModel === 'kmeans') {
        response = await axios.post('http://localhost:8000/run-kmeans', { columns: selectedColumns, file_path: filePath });
      } else if (selectedModel === 'linear') {
        response = await axios.post('http://localhost:8000/run-linear-regression', { features: selectedColumns, target: selectedTarget, file_path: filePath });
      } else if (selectedModel === 'logistic') {
        response = await axios.post('http://localhost:8000/run-logistic-regression', { features: selectedColumns, target: selectedTarget, file_path: filePath });
      }
      setResults(response.data);
    } catch (error) {
      console.error(`Error running ${selectedModel}:`, error);
    }
  };

  return (
    <div className="form-container">
      <h1>Model Performance Analysis</h1>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload CSV</button>
      </div>

      {columns.length > 0 && (
        <div className="model-selection">
          <h2>Select Model</h2>
          <div className="btn-group">
            <button onClick={() => handleModelSelection('kmeans')}>KMeans Clustering</button>
            <button onClick={() => handleModelSelection('linear')}>Linear Regression</button>
            <button onClick={() => handleModelSelection('logistic')}>Logistic Regression</button>
          </div>
        </div>
      )}

      {selectedModel && (
        <div className="column-selection">
          <h2>Select Columns for {selectedModel === 'kmeans' ? 'Clustering' : 'Regression'}</h2>
          {selectedModel !== 'kmeans' && (
            <div className="target-selection">
              <h3>Select Target Variable</h3>
              <div className="grid grid-cols-4 gap-4">
                {columns.map((col, idx) => (
                  <label key={idx}>
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
            </div>
          )}
          <h3>Select {selectedModel === 'kmeans' ? 'Columns' : 'Features'}</h3>
          <div className="grid grid-cols-4 gap-4">
            {columns.map((col, idx) => (
              <label key={idx}>
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
        </div>
      )}

      {selectedModel && (
        <div className="run-section">
          <h2>Run {selectedModel === 'kmeans' ? 'KMeans Clustering' : selectedModel}</h2>
          <button onClick={handleRunModel}>Run {selectedModel}</button>
        </div>
      )}

      {results && (
        <div className="results">
          <h2>Results</h2>
          <div className="graph-container">
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
              </>
            )}
            {selectedModel === 'logistic' && (
              <>
                <img src={`http://localhost:8000/output_plots/${results.confusionMatrix}`} alt="Confusion Matrix" />
                <img src={`http://localhost:8000/output_plots/${results.rocCurve}`} alt="ROC Curve" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelPerformance;
