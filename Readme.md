# Weather Prediction and Analysis Web Application

## Overview

This web application provides tools for weather data analysis and prediction. It allows users to upload CSV files, perform various machine learning operations, and visualize weather predictions.

## Features

1. **CSV File Upload**: Users can upload CSV files containing weather data.
2. **Machine Learning Models**:
   - K-Means Clustering
   - Linear Regression
   - Logistic Regression
3. **Weather Predictions**:
   - Rain prediction based on temperature and humidity
   - Other data forecast
4. **Data Visualization**:
   - Plotly.js charts for displaying results
   - Historical rainfall data visualization

## Technologies Used

- Frontend: React.js
- Backend: FastAPI
- Data Visualization: Plotly.js
- Machine Learning: scikit-learn

## Setup and Installation

1. Install dependecies:
pip install -r requirements.txt
2. Start Backend:
python -m uvicorn main:app --reload
3. Start the frontend development server:
npm start
4. Open a web browser and navigate to `http://localhost:3000`

## Available Endpoints

The following API endpoints are available:

1. `POST /upload`
- Uploads a CSV file for analysis
- Returns: List of columns and file path

2. `POST /run-kmeans`
- Runs K-Means clustering on selected columns
- Returns: Paths to original and clustered data plots

3. `POST /run-linear-regression`
- Runs Linear Regression on selected features and target
- Returns: Paths to various analysis plots

4. `POST /run-logistic-regression`
- Runs Logistic Regression on selected features and target
- Returns: Paths to various analysis plots

5. `POST /predict-rain`
- Predicts rain based on temperature and humidity
- Returns: Rain prediction (boolean)

6. `GET /data`
- Get the required values from predicted dataset

## Usage

1. Upload Data: Use the file upload feature to load your CSV weather data.
2. Select Model: Choose between K-Means Clustering, Linear Regression, or Logistic Regression.
3. Configure Model: Select appropriate columns/features for the chosen model.
4. Run Analysis: Execute the selected model and view the results.
5. Weather Predictions: Use the prediction tools to forecast rain or rainfall amounts.

## API Integration

The application uses the Visual Crossing Weather API to fetch historical weather data for Melbourne. The data range is from 2024-01-01 to 2024-12-31.