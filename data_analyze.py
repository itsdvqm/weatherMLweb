import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os
import numpy as np

# Set the pandas option to display all columns
pd.set_option('display.max_columns', None)

# Load the preprocessed data
data = pd.read_csv('Data/rawdata/weatherHistory.csv')

# Define the attributes to analyze
attributes = ['Temperature', 'Humidity', 'WindSpeed', 'Pressure', 'Visibility']

# Define custom ranges for each attribute
attribute_ranges = {
    'Temperature': (-22, 40),
    'Humidity': (0, 1),
    'WindSpeed': (0, 30),
    'Pressure': (980, 1040),
    'Visibility': (0, 16.1)
}

# ------------------------------------------------------------------------------
# Function to plot histograms for continuous features
# ------------------------------------------------------------------------------
def plot_histogram(df, attributes, attribute_ranges, output_dir='Data_Analysis_Result', figsize=(12, 15)):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Set up the figure with subplots
    fig, axes = plt.subplots(nrows=len(attributes), ncols=1, figsize=figsize)

    # Plot histograms for each attribute
    for i, col in enumerate(attributes):
        sns.histplot(df[col], kde=True, ax=axes[i], color='blue')
        axes[i].set_title(f'Distribution of {col}', fontsize=14)
        axes[i].set_xlim(attribute_ranges[col])

    # Adjust layout and save the figure
    plt.tight_layout()
    output_path = os.path.join(output_dir, 'histograms.png')
    plt.savefig(output_path, dpi=100)
    plt.show()

# ------------------------------------------------------------------------------
# Function to plot a heatmap of correlations
# ------------------------------------------------------------------------------
def plot_heatmap(df, attributes, output_dir='Data_Analysis_Result'):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Use only the relevant columns
    df = df[attributes]

    corr_matrix = df.corr()

    plt.figure(figsize=(12, 8))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f', vmin=-1, vmax=1)
    plt.title('Correlation Heatmap', fontsize=16)

    output_path = os.path.join(output_dir, 'heatmap.png')
    plt.savefig(output_path, facecolor='white', dpi=100)
    plt.show()

# ------------------------------------------------------------------------------
# Function to plot a scatter plot between two features
# ------------------------------------------------------------------------------
def plot_scatter(df, x_col, y_col, attribute_ranges, output_dir='Data_Analysis_Result', hue=None):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Plot scatter plot
    plt.figure(figsize=(8,6))
    sns.scatterplot(data=df, x=x_col, y=y_col, hue=hue, palette='viridis')
    plt.title(f'Scatter Plot: {x_col} vs {y_col}', fontsize=14)
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.xlim(attribute_ranges[x_col])
    plt.ylim(attribute_ranges[y_col])
    plt.tight_layout()

    # Save the plot
    output_path = os.path.join(output_dir, f'scatter_{x_col}_vs_{y_col}.png')
    plt.savefig(output_path, dpi=100)
    plt.show()

# ------------------------------------------------------------------------------
# Function to plot box plots for multiple features
# ------------------------------------------------------------------------------
def plot_boxplot(df, attributes, attribute_ranges, output_dir='Data_Analysis_Result', figsize=(15, 6)):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Create a figure with subplots arranged
    fig, axes = plt.subplots(nrows=1, ncols=len(attributes), figsize=figsize)

    # Plot each feature's box plot in its own column
    for i, feature in enumerate(attributes):
        sns.boxplot(data=df, y=feature, ax=axes[i], color='lightgreen')
        axes[i].set_title(f'{feature}', fontsize=12)
        axes[i].set_ylabel('') 
        axes[i].set_xlabel('')  
        axes[i].set_ylim(attribute_ranges[feature])

    # Adjust layout and save the figure
    plt.tight_layout()
    output_path = os.path.join(output_dir, 'boxplots.png')
    plt.savefig(output_path, dpi=100)
    plt.show()

# ------------------------------------------------------------------------------
# Running the Data Analysis Functions
# ------------------------------------------------------------------------------

# Call the histogram plotting function
plot_histogram(data, attributes, attribute_ranges)

# Plotting heatmap for correlations
plot_heatmap(data, attributes)

# Example scatter plot (for any two of the five attributes)
plot_scatter(data, x_col='Temperature', y_col='Humidity', attribute_ranges=attribute_ranges)

# Boxplot for all five attributes
plot_boxplot(data, attributes, attribute_ranges)