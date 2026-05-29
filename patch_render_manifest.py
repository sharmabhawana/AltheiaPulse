from pathlib import Path

path = Path('render.yaml')
text = path.read_text()
old = '''  - type: web
    name: altheiapulse-backend
    env: python
    plan: free
    branch: main
    root: ./
    buildCommand: pip install -r requirements.txt
    startCommand: python backend/app.py
    envVars:
      - key: FLASK_ENV
        value: production
      - key: PORT
        value: "5000"
      - key: JWT_SECRET
        value: "replace-with-a-secure-secret"
    databases:
      - name: altheiapulse-postgres
'''
new = '''  - type: web
    name: altheiapulse-backend
    env: python
    plan: free
    branch: main
    root: ./
    pythonVersion: "3.11"
    buildCommand: python -m pip install --upgrade pip setuptools wheel && python -m pip install -r requirements.txt
    startCommand: python backend/app.py
    envVars:
      - key: FLASK_ENV
        value: production
      - key: PORT
        value: "5000"
      - key: JWT_SECRET
        value: "replace-with-a-secure-secret"
    databases:
      - name: altheiapulse-postgres
'''
if old not in text:
    raise SystemExit('Old block not found in render.yaml')
new_text = text.replace(old, new)
path.write_text(new_text)
print('render.yaml patched')
