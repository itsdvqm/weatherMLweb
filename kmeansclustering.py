import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from data_cleaning import clean_data
import os

def run_kmeans_clustering(file_path, selected_columns):
    # Load data from the uploaded file
    data = clean_data(pd.read_csv(file_path))
    
    # Extract selected features
    X = data[selected_columns]
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Create and train KMeans model
    n_clusters = 3
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(X_scaled)
    
    # Predict all data points
    labels = kmeans.predict(X_scaled)
    
    # Create output directory if it doesn't exist
    output_dir = 'output_plots'
    os.makedirs(output_dir, exist_ok=True)
    
    # Plot original data
    plt.figure(figsize=(10, 6))
    plt.scatter(X_scaled[:, 0], X_scaled[:, 1])
    plt.title('Original Data')
    plt.xlabel(selected_columns[0])
    plt.ylabel(selected_columns[1])
    plt.savefig(os.path.join(output_dir, 'original_data.png'))
    plt.close()
    
    # Plot clustering results
    plt.figure(figsize=(10, 6))
    scatter = plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=labels, cmap='viridis')
    centers = kmeans.cluster_centers_
    plt.scatter(centers[:, 0], centers[:, 1], c='red', marker='x', s=200, linewidths=3)
    plt.title('Clustering Results')
    plt.xlabel(selected_columns[0])
    plt.ylabel(selected_columns[1])
    plt.colorbar(scatter)
    plt.savefig(os.path.join(output_dir, 'clustering_results.png'))
    plt.close()
    
    return {
        "originalPlot": "original_data.png",
        "clusteredPlot": "clustering_results.png",
        "clusterLabels": labels.tolist()
    }