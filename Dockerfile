# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Run the Flask backend
FROM python:3.11-slim
WORKDIR /app

# Install build/system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy the built frontend static assets from Stage 1 into backend's expected directory
COPY --from=frontend-builder /frontend/dist ./frontend/dist

# Re-train the model during build to ensure compatibility with Python 3.11 and scikit-learn
RUN python dataset/train_model.py

EXPOSE 5000

ENV PORT=5000
ENV FLASK_ENV=production

# Start application using Gunicorn
CMD ["gunicorn", "backend.app:app", "--bind", "0.0.0.0:5000"]
