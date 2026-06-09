import joblib
import numpy as np

model_path = r"C:\Users\aswin\Downloads\heart_attack_model.pkl"
try:
    model = joblib.load(model_path)
    print("Model loaded successfully!")
    print("Model Type:", type(model))
    if hasattr(model, "n_features_in_"):
        print("Number of features expected:", model.n_features_in_)
    if hasattr(model, "feature_names_in_"):
        print("Feature names in model:", model.feature_names_in_)
    else:
        print("Model does not have feature_names_in_")
    
    # Try to see if it's a random forest or similar
    if hasattr(model, "estimators_"):
        print("Number of estimators:", len(model.estimators_))
except Exception as e:
    print("Error:", e)
