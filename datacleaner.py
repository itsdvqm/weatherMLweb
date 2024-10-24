import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Load the datasets
data1 = pd.read_csv('Data/rawdata/GlobalWeatherRepository.csv') #change path accordingly when repo
data2 = pd.read_csv('Data/rawdata/weatherHistory.csv')


# Specify columns relevant to weather analysis
columns_to_keep = ['Temperature', 'Humidity', 'WindSpeed', 'Pressure','Visibility']

data1 = data1[columns_to_keep]
data2 = data2[columns_to_keep]

# Combine datasets
alldata = pd.concat([data1, data2], ignore_index=True)

# Remove duplicate rows
alldata.drop_duplicates(inplace=True)

#Remove outliers using IQR 
def remove_outliers(df, columns):
    for column in columns:
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        # Remove rows where the column value is below lower_bound or above upper_bound
        df = df[(df[column] >= lower_bound) & (df[column] <= upper_bound)]
    return df

# Remove outliers from numeric columns
numeric_columns = ['Temperature', 'Humidity', 'WindSpeed', 'Pressure','Visibility']
alldata = remove_outliers(alldata, numeric_columns)

# Handle missing values for numeric columns (fill with median)
for column in numeric_columns:
    alldata[column].fillna(alldata[column].median(), inplace=True)

# Save the combined raw data without outliers
alldata.to_csv('DataSets/cleaneddata.csv', index=False)

#(Z-score standardization)
scaler = StandardScaler()
alldata_scaled = alldata.copy()
alldata_scaled[numeric_columns] = scaler.fit_transform(alldata[numeric_columns])

# Save the Z-score standardized dataset
alldata_scaled.to_csv('DataSets/cleaneddatazscore.csv', index=False)

print("Done")
