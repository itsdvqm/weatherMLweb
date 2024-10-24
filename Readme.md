# Weather Prediction Machine Learning Project

This project aims to predict weather conditions using various machine learning models. The project is divided into several scripts, each responsible for a specific task.

## Files

1. **cleandata.py**
   - Cleans and preprocesses the raw weather data.

2. **data_analyze.py**
   - Analyzes the raw data to extract statistics.

3. **kmeansclustering.py**
   - Runs the K-Means clustering model 

4. **linear_regression.py**
   - Runs the linear regression model

5. **logistic_regression.py**
   - Runs the logistic regression model

## How to Run

1. **Data Cleaning**
   ```bash
   python cleandata.py
   ```

2. **Data Analysis**
   ```bash
   python data_analyze.py
   ```

3. **K-Means Clustering**
   ```bash
   python kmeansclustering.py
   ```

4. **Linear Regression**
   ```bash
   python linear_regression.py
   ```

5. **Logistic Regression**
   ```bash
   python logistic_regression.py
   ```

### Data Analysis Results
The results of the data analysis are stored in the `data_analysis_results` folder. 

### Model Outputs
The outputs from the machine learning models, including plots and performance metrics, are saved in the `output_plots` folder.

## Requirements

- Python 3.x
- Required libraries: pandas, numpy, scikit-learn, matplotlib

## Installation

Install the required libraries using pip:
```bash
pip install pandas numpy scikit-learn matplotlib
```