import pandas as pd
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import os

def run_linear_regression(file_path, features, target):
    # Load data from the uploaded file
    data = pd.read_csv(file_path)
    
    X = data[features]
    y = data[target]
    
    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    # Train the Linear Regression model
    linreg = LinearRegression()
    linreg.fit(X_train, y_train)
    
    # Make predictions on the test set
    y_pred = linreg.predict(X_test)
    
    # Evaluate the model
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    # Create output directory if it doesn't exist
    output_dir = 'output_plots'
    os.makedirs(output_dir, exist_ok=True)

    # 1. Predicted vs Actual plot
    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, y_pred)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'k--', lw=2)
    plt.title('Predicted vs Actual')
    plt.xlabel('Actual Humidity')
    plt.ylabel('Predicted Humidity')
    plt.savefig(f'{output_dir}/predicted_vs_actual.png')
    plt.close()

    # 2. Residuals plot
    plt.figure(figsize=(10, 6))
    residuals = y_test - y_pred
    plt.scatter(y_pred, residuals)
    plt.axhline(y=0, color='r', linestyle='--')
    plt.title('Residuals vs Predicted')
    plt.xlabel('Predicted Humidity')
    plt.ylabel('Residuals')
    plt.savefig(f'{output_dir}/residuals.png')
    plt.close()

    # 3. Model fitness plot
    plt.figure(figsize=(10, 6))
    scores = [linreg.score(X_train, y_train), linreg.score(X_test, y_test)]
    plt.bar(['Train Score (R²)', 'Test Score (R²)'], scores)
    plt.title('Model Fitness (R²)')
    plt.ylim([0, 1])
    for i, v in enumerate(scores):
        plt.text(i, v, f'{v:.4f}', ha='center', va='bottom')
    plt.savefig(f'{output_dir}/model_fitness.png')
    plt.close()

    # 4. Error metrics plot
    plt.figure(figsize=(10, 6))
    plt.text(0.5, 0.5, f'MSE: {mse:.4f}\nR²: {r2:.4f}', fontsize=14, ha='center', va='center')
    plt.title('Error Metrics')
    plt.axis('off')
    plt.savefig(f'{output_dir}/error_metrics.png')
    plt.close()

    return {
        "predictedVsActual": "predicted_vs_actual.png",
        "residuals": "residuals.png",
        "modelFitness": "model_fitness.png",
        "errorMetrics": "error_metrics.png"
    }