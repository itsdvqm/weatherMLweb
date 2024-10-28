import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [filePath, setFilePath] = useState('');
  const [results, setResults] = useState(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Assignment 3 Web</h1>
      
      <div className="mb-8">
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button onClick={handleFileUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload CSV
        </button>
      </div>

      {columns.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select Model</h2>
          <div className="flex space-x-4">
            <button onClick={() => handleModelSelection('kmeans')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              KMeans Clustering
            </button>
            <button onClick={() => handleModelSelection('linear')} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
              Linear Regression
            </button>
            <button onClick={() => handleModelSelection('logistic')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logistic Regression
            </button>
          </div>
        </div>
      )}

      {selectedModel && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select Columns for {selectedModel === 'kmeans' ? 'Clustering' : 'Regression'}</h2>
          {selectedModel !== 'kmeans' && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Select Target Variable</h3>
              <div className="grid grid-cols-4 gap-4">
                {columns.map((col, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name="target"
                      value={col}
                      checked={selectedTarget === col}
                      onChange={() => handleTargetSelection(col)}
                      className="mr-2"
                    />
                    {col}
                  </label>
                ))}
              </div>
            </div>
          )}
          <h3 className="text-xl font-semibold mb-2">Select {selectedModel === 'kmeans' ? 'Columns' : 'Features'}</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {columns.map((col, idx) => (
              <label key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleColumnSelection(col)}
                  disabled={selectedModel !== 'kmeans' && selectedTarget === col}
                  className="mr-2"
                />
                {col}
              </label>
            ))}
          </div>
          <button 
            onClick={handleRunModel} 
            disabled={selectedModel === 'kmeans' ? selectedColumns.length < 2 : selectedColumns.length < 1 || !selectedTarget}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Run {selectedModel === 'kmeans' ? 'KMeans' : selectedModel === 'linear' ? 'Linear Regression' : 'Logistic Regression'}
          </button>
        </div>
      )}

      {results && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <div className="grid grid-cols-2 gap-4">
            {selectedModel === 'kmeans' && (
              <>
                <img src={`http://localhost:8000/output_plots/${results.originalPlot}`} alt="Original Data" className="w-full" />
                <img src={`http://localhost:8000/output_plots/${results.clusteredPlot}`} alt="Clustered Data" className="w-full" />
              </>
            )}
            {selectedModel === 'linear' && (
              <>
                <img src={`http://localhost:8000/output_plots/${results.predictedVsActual}`} alt="Predicted vs Actual" className="w-full" />
                <img src={`http://localhost:8000/output_plots/${results.residuals}`} alt="Residuals" className="w-full" />
                <img src={`http://localhost:8000/output_plots/${results.modelFitness}`} alt="Model Fitness" className="w-full" />
                <img src={`http://localhost:8000/output_plots/${results.errorMetrics}`} alt="Error Metrics" className="w-full" />
              </>
            )}
            {selectedModel === 'logistic' && (
              <>
                <img src={`http://localhost:8000/output_plots/${results.confusionMatrix}`} alt="Confusion Matrix" className="w-full" />
                <img src={`http://localhost:8000/output_plots/${results.rocCurve}`} alt="ROC Curve" className="w-full" />
                <img src={`http://localhost:8000/output_plots/${results.modelFitness}`} alt="Model Fitness" className="w-full" />
                <img src={`http://localhost:8000/output_plots/${results.classificationReport}`} alt="Classification Report" className="w-full" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;