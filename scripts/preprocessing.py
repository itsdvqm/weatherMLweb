import pandas as pd

# Load your dataset (replace with your file path)
file_path = 'Data/rawdata/melbourne 2024-01-01 to 2024-10-22.csv'
weather_data = pd.read_csv(file_path)

# Select the relevant features (temperature, humidity, and conditions)
# Remove rows with missing values
cleaned_data = weather_data[['temp', 'humidity', 'conditions']].dropna()

# Create a binary target variable: 1 for 'Rain' and 0 for other conditions
cleaned_data['rain'] = cleaned_data['conditions'].apply(lambda x: 1 if 'Rain' in x else 0)

# Features (X) and target (y)
X = cleaned_data[['temp', 'humidity']]
y = cleaned_data['rain']

# Split the data into training and testing sets (80% training, 20% testing)
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Now X_train and y_train are ready for training your model
