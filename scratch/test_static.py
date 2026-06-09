import urllib.request
try:
    response = urllib.request.urlopen("http://127.0.0.1:5000/static/chart.js")
    print("STATUS:", response.getcode())
    print("CONTENT TYPE:", response.info().get_content_type())
    content = response.read(100)
    print("PREVIEW:", content)
except Exception as e:
    print("ERROR:", e)
