from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import joblib
import numpy as np
import os
import json
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, template_folder='../templates', static_folder='../static')
CORS(app)
app.config['SECRET_KEY'] = 'super-secret-m-plus-key-187'

model = joblib.load('diversity_model.pkl')
scaler = joblib.load('diversity_scaler.pkl')

USERS_FILE = 'users.json'

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}

def save_users(users):
    try:
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=4)
    except Exception as e:
        print("Error saving users file:", e)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    mode = 'login'
    if request.method == 'POST':
        action = request.form.get('action')
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        mode = action

        if not username or not password:
            error = "Please fill in all fields."
        else:
            users = load_users()
            if action == 'signup':
                if username in users:
                    error = "User already exists."
                else:
                    users[username] = generate_password_hash(password)
                    save_users(users)
                    session['user'] = username
                    return redirect(url_for('home'))
            else: # login
                if username not in users or not check_password_hash(users[username], password):
                    error = "Invalid username or password."
                else:
                    session['user'] = username
                    return redirect(url_for('home'))

    return render_template('login.html', error=error, mode=mode)

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

@app.route('/')
@login_required
def home():
    return render_template('index.html')

@app.route('/portal')
@login_required
def portal():
    return render_template('portal.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/my-heart')
@login_required
def my_heart():
    return render_template(
        'my_heart.html',
        risk=0,
        prediction_text="",
        tips=""
    )
@app.route('/predict', methods=['POST'])
@login_required
def predict():
    try:
        import pandas as pd

        dataset = request.form.get('dataset', 'Cleveland')
        cp = float(request.form.get('cp', 0.0))
        restecg = float(request.form.get('restecg', 0.0))
        
        # Collect and parse full dataset features
        patient_id = float(request.form.get('id', 1001.0))
        age = float(request.form.get('age', 45.0))
        sex = float(request.form.get('sex', 1.0))
        trestbps = float(request.form.get('trestbps', 120.0))
        chol = float(request.form.get('chol', 210.0))
        fbs = float(request.form.get('fbs', 0.0))
        thalch = float(request.form.get('thalch', 150.0))
        exang = float(request.form.get('exang', 0.0))
        oldpeak = float(request.form.get('oldpeak', 1.5))
        
        # Additional features in dataset
        slope = request.form.get('slope', 'upsloping')
        ca = float(request.form.get('ca', 0.0))
        thal = request.form.get('thal', 'normal')

        print(f"DEBUG: Input parameters -> ID: {patient_id}, Age: {age}, Sex: {sex}, BP: {trestbps}, Chol: {chol}, FBS: {fbs}, MaxHR: {thalch}, Exang: {exang}, Oldpeak: {oldpeak}, Dataset: {dataset}, CP: {cp}, RestECG: {restecg}, Slope: {slope}, CA: {ca}, Thal: {thal}")

        columns = [
            'id', 'age', 'sex', 'trestbps', 'chol', 'fbs', 'thalch', 'exang', 'oldpeak',
            'dataset_Hungary', 'dataset_Switzerland', 'dataset_VA Long Beach',
            'cp_atypical angina', 'cp_non-anginal', 'cp_typical angina',
            'restecg_normal', 'restecg_st-t abnormality'
        ]

        row = [
            patient_id,
            age,
            sex,
            trestbps,
            chol,
            fbs,
            thalch,
            exang,
            oldpeak,
            1.0 if dataset == 'Hungary' else 0.0,
            1.0 if dataset == 'Switzerland' else 0.0,
            1.0 if dataset == 'VA Long Beach' else 0.0,
            1.0 if cp == 1.0 else 0.0, # cp_atypical angina
            1.0 if cp == 2.0 else 0.0, # cp_non-anginal
            1.0 if cp == 0.0 else 0.0, # cp_typical angina
            1.0 if restecg == 0.0 else 0.0, # restecg_normal
            1.0 if restecg == 1.0 else 0.0  # restecg_st-t abnormality
        ]

        df = pd.DataFrame([row], columns=columns)
        scaled_data = scaler.transform(df)

        prediction = int(model.predict(scaled_data)[0])
        probability = float(model.predict_proba(scaled_data)[0][1])
        risk = round(probability * 100, 2)

        category = 'High' if prediction == 1 else 'Low'
        result_text = f"⚠️ High Risk ({risk:.2f}%)" if prediction == 1 else f"✅ Low Risk ({risk:.2f}%)"
        
        if prediction == 1:
            tips = "High cardiac risk detected. Please consult a qualified cardiologist immediately. Reduce sodium and cholesterol intake, avoid strenuous physical activities, and monitor your vitals closely."
        else:
            tips = "Low cardiac risk detected. Vitals are within normal ranges. Continue maintaining a healthy diet, regular exercise, and adequate sleep patterns."

        # Return JSON for AJAX requests
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes.accept_json:
            return jsonify({
                'prediction_text': result_text,
                'probability': risk,
                'category': category,
                'tips': tips
            })

        return render_template(
            'my_heart.html',
            prediction_text=result_text,
            tips=tips,
            prediction=prediction,
            risk=risk
        )
    except Exception as e:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.accept_mimetypes.accept_json:
            return jsonify({'error': str(e)}), 400
        return f"Error: {str(e)}", 400

@app.route('/log_error', methods=['POST'])
def log_error():
    try:
        data = request.get_json()
        print("\n=== BROWSER ERROR LOGGED ===")
        print(f"Message: {data.get('message')}")
        print(f"Source: {data.get('source')} at line {data.get('lineno')}:{data.get('colno')}")
        print(f"Stack Trace:\n{data.get('stack')}")
        print("============================\n", flush=True)
    except Exception as e:
        print("Error logging browser error:", e)
    return jsonify({"status": "ok"})

@app.route('/send-report', methods=['POST'])
@login_required
def send_report():
    try:
        data = request.get_json() or {}
        
        email = session.get('user')
        if not email:
            return jsonify({"error": "User not authenticated"}), 401
            
        probability = data.get('probability', 0.0)
        category = data.get('category', 'Low')
        tips = data.get('tips', '')
        vitals = data.get('vitals', {})
        
        # Format a clean, professional clinical report email body
        email_body = f"""
======================================================
CARDIMARS® AI CLINICAL DIAGNOSTIC REPORT
======================================================
Recipient Email: {email}
Report Timestamp: {data.get('timestamp', 'N/A')}
------------------------------------------------------
PATIENT BIOMETRICS & DIAGNOSTIC VITALS:
- Patient ID: {vitals.get('id', 'N/A')}
- Age: {vitals.get('age', 'N/A')} years
- Gender: {'Male' if vitals.get('sex') == '1' else 'Female'}
- Resting BP: {vitals.get('trestbps', 'N/A')} mmHg
- Serum Cholesterol: {vitals.get('chol', 'N/A')} mg/dL
- Fasting Blood Sugar > 120 mg/dL: {'Yes (True)' if vitals.get('fbs') == '1' else 'No (False)'}
- Resting ECG: {vitals.get('restecg', 'N/A')}
- Max Heart Rate (thalch): {vitals.get('thalch', 'N/A')} bpm
- Exercise Induced Angina: {'Yes' if vitals.get('exang') == '1' else 'No'}
- ST Depression (oldpeak): {vitals.get('oldpeak', 'N/A')}
- ST Segment Slope: {vitals.get('slope', 'N/A')}
- Major Vessels (ca): {vitals.get('ca', 'N/A')}
- Thallium Result: {vitals.get('thal', 'N/A')}
------------------------------------------------------
AI PREDICTION RESULT:
- Cardiac Anomaly Risk: {category} Risk
- Predictive Probability: {probability}%
- Clinical Guidance:
  {tips}
======================================================
CONFIDENTIALITY NOTE: The contents of this document are 
confidential and HIPAA-protected.
======================================================
"""
        print("\n=== DRAFTING EMAIL REPORT ===")
        print(email_body)
        print("=============================\n", flush=True)

        email_sent = False
        try:
            import smtplib
            from email.mime.text import MIMEText
            
            # Draft MIME message
            msg = MIMEText(email_body)
            msg['Subject'] = f"Cardimars® Cardiac Risk Assessment Report - {category} Risk"
            msg['From'] = "diagnostics@cardimars.io"
            msg['To'] = email
            
            # SMTP localhost dispatch
            s = smtplib.SMTP('localhost', port=25, timeout=2)
            s.send_message(msg)
            s.quit()
            email_sent = True
        except:
            pass # Suppress local SMTP failures

        if email_sent:
            msg = f"Report successfully dispatched to {email}."
        else:
            msg = f"Report compiled and successfully logged to server terminal for {email}."

        return jsonify({"status": "ok", "message": msg})
    except Exception as e:
        print("Error sending report email:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)