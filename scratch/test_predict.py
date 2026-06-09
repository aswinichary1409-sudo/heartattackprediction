import urllib.request
import urllib.parse
import http.cookiejar
import json

# Setup cookie handler for session maintenance
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# 1. Register a test user
login_url = "http://127.0.0.1:5000/login"
signup_data = urllib.parse.urlencode({
    "action": "signup",
    "username": "testuser_urllib@test.com",
    "password": "testpassword"
}).encode('utf-8')

print("Registering test user via signup...")
try:
    req = urllib.request.Request(login_url, data=signup_data)
    with opener.open(req) as res:
        print("Signup response code:", res.getcode())
except Exception as e:
    print("Signup failed (possibly user already exists, which is fine):", e)

# 1b. Log in to establish session
login_data = urllib.parse.urlencode({
    "action": "login",
    "username": "testuser_urllib@test.com",
    "password": "testpassword"
}).encode('utf-8')

print("Logging in to establish session...")
try:
    req = urllib.request.Request(login_url, data=login_data)
    with opener.open(req) as res:
        print("Login response code:", res.getcode())
except Exception as e:
    print("Login failed:", e)

# 2. Perform prediction request
predict_url = "http://127.0.0.1:5000/predict"
predict_data = urllib.parse.urlencode({
    "id": "0",
    "age": "45",
    "sex": "1",
    "cp": "1",          # Atypical Angina
    "trestbps": "130",   # BP
    "chol": "240",       # Cholesterol
    "fbs": "0",
    "restecg": "0",
    "thalch": "150",     # Max HR
    "exang": "0",
    "oldpeak": "1.0",
    "dataset": "Cleveland"
}).encode('utf-8')

print("Sending prediction request...")
try:
    req = urllib.request.Request(predict_url, data=predict_data)
    req.add_header("X-Requested-With", "XMLHttpRequest")
    req.add_header("Accept", "application/json")
    with opener.open(req) as res:
        print("Prediction response code:", res.getcode())
        body = res.read().decode('utf-8')
        print("Response Body:")
        parsed = json.loads(body)
        print(json.dumps(parsed, indent=2))
except Exception as e:
    print("Prediction failed:", e)
