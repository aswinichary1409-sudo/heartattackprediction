import joblib
import pandas as pd
import numpy as np

model_path = r"c:\Users\aswin\OneDrive\Desktop\heartattackprediction\diversity_model.pkl"
scaler_path = r"c:\Users\aswin\OneDrive\Desktop\heartattackprediction\diversity_scaler.pkl"

try:
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    print("Diversity model and scaler loaded successfully!")
    print("Model Type:", type(model))
    if hasattr(model, "n_features_in_"):
        print("Number of features expected by model:", model.n_features_in_)
    if hasattr(model, "feature_names_in_"):
        print("Feature names in model:", list(model.feature_names_in_))
    if hasattr(scaler, "feature_names_in_"):
        print("Feature names in scaler:", list(scaler.feature_names_in_))
        
    # Test a prediction with dummy data
    columns = [
        'id', 'age', 'sex', 'trestbps', 'chol', 'fbs', 'thalch', 'exang', 'oldpeak',
        'dataset_Hungary', 'dataset_Switzerland', 'dataset_VA Long Beach',
        'cp_atypical angina', 'cp_non-anginal', 'cp_typical angina',
        'restecg_normal', 'restecg_st-t abnormality'
    ]
    sample_data = pd.DataFrame([[
        0.0, 55.0, 1.0, 130.0, 250.0, 0.0, 140.0, 1.0, 1.5,
        0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0
    ]], columns=columns)
    
    scaled = scaler.transform(sample_data)
    pred = model.predict(scaled)
    prob = model.predict_proba(scaled)
    print("Prediction:", pred, "Proba:", prob)
except Exception as e:
    print("Error:", e)
