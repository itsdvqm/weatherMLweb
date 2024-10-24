import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc
from sklearn.preprocessing import StandardScaler
from data_cleaning import clean_data
from sklearn.preprocessing import LabelEncoder
import os

def run_logistic_regression(file_path, features, target):
    # Load and clean the data
    data = clean_data(pd.read_csv(file_path))
    
    # Define X and y for the model
    X = data[features]
    y = data[target]
    
    # Encode the target variable
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Perform train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_encoded, test_size=0.2, random_state=42)
    
    # Initialize and train the Logistic Regression model
    logreg = LogisticRegression(random_state=42, max_iter=1000, solver='liblinear', C=0.1)
    logreg.fit(X_train, y_train)
    
    # Make predictions
    y_pred = logreg.predict(X_test)
    y_pred_proba = logreg.predict_proba(X_test)[:, 1]
    
    # Create output directory if it doesn't exist
    output_dir = 'output_plots'
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Confusion Matrix Plot
    plt.figure(figsize=(8, 6))
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.savefig(f'{output_dir}/confusion_matrix.png')
    plt.close()
    
    # 2. ROC Curve Plot
    plt.figure(figsize=(8, 6))
    fpr, tpr, _ = roc_curve(y_test, y_pred_proba, pos_label=1)
    roc_auc = auc(fpr, tpr)
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve')
    plt.legend(loc="lower right")
    plt.savefig(f'{output_dir}/roc_curve.png')
    plt.close()
    
    # 3. Model Fitness Plot
    plt.figure(figsize=(8, 6))
    scores = [logreg.score(X_train, y_train), logreg.score(X_test, y_test)]
    plt.bar(['Train Score', 'Test Score'], scores)
    plt.ylim([0, 1])
    plt.title('Model Fitness')
    for i, v in enumerate(scores):
        plt.text(i, v + 0.02, f'{v:.4f}', ha='center', va='bottom')
    plt.savefig(f'{output_dir}/model_fitness.png')
    plt.close()
    
    # 4. Classification Report Plot
    report = classification_report(y_test, y_pred, output_dict=True)
    report_df = pd.DataFrame(report).transpose()
    sns.set(style="whitegrid")
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(report_df.iloc[:-1, :].T, annot=True, cmap='YlGnBu', ax=ax)
    ax.set_title('Classification Report')
    fig.tight_layout()
    fig.savefig(f'{output_dir}/classification_report.png')
    plt.close()

    return {
        "confusionMatrix": "confusion_matrix.png",
        "rocCurve": "roc_curve.png",
        "modelFitness": "model_fitness.png",
        "classificationReport": "classification_report.png"
    }