import os
import shutil
import joblib
import pandas as pd
import numpy as np

src = r"C:\Users\aswin\Downloads\heart_attack_model.pkl"
dst = r"c:\Users\aswin\OneDrive\Desktop\heartattackprediction\heart_attack_model.pkl"

print("Copying model...")
try:
    shutil.copy(src, dst)
    print("Model copied successfully!")
except Exception as e:
    print("Error copying model:", e)

if os.path.exists(dst):
    try:
        model = joblib.load(dst)
        print("Model loaded from destination.")
        # Create a sample input matching the expected features
        sample_features = {
            'Age': 45,
            'Cholesterol': 220,
            'Heart Rate': 75,
            'Diabetes': 0,
            'Family History': 1,
            'Smoking': 0,
            'Obesity': 0,
            'Alcohol Consumption': 0,
            'Exercise Hours Per Week': 4.5,
            'Previous Heart Problems': 0,
            'Medication Use': 0,
            'Stress Level': 5,
            'Sedentary Hours Per Day': 6.0,
            'Income': 50000,
            'BMI': 24.5,
            'Triglycerides': 150,
            'Physical Activity Days Per Week': 3,
            'Sleep Hours Per Day': 7.0,
            'Diet_Healthy': 1,
            'Diet_Unhealthy': 0,
            'Sex_Male': 1,
            'Systolic': 120,
            'Diastolic': 80
        }
        df = pd.DataFrame([sample_features])
        print("Columns in df:", list(df.columns))
        pred = model.predict(df)
        prob = model.predict_proba(df)
        print("DataFrame Prediction:", pred, "Proba:", prob)
        
        # Test numpy input
        arr = df.values
        pred_arr = model.predict(arr)
        print("Numpy Prediction:", pred_arr)
    except Exception as e:
        print("Error during prediction test:", e)
