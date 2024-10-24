import pandas as pd
import os
def clean_data(df):
    # Remove rows with any NaN values
    df_cleaned = df.dropna()
    
    # Remove duplicates
    df_cleaned = df_cleaned.drop_duplicates()
    
    # Convert data types if necessary
    numeric_columns = ['Temperature', 'Humidity', 'WindSpeed', 'Pressure', 'Visibility']
    for col in numeric_columns:
        df_cleaned[col] = pd.to_numeric(df_cleaned[col], errors='coerce')
    
    # Remove rows with any remaining NaN values after type conversion
    df_cleaned = df_cleaned.dropna()
    
    # Reset index
    df_cleaned = df_cleaned.reset_index(drop=True)
    
    return df_cleaned