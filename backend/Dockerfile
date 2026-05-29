FROM python:3.10-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run the training script during image build to generate model files if they don't exist
RUN python dataset/train_model.py

EXPOSE 5000

ENV PORT=5000
ENV FLASK_ENV=production

CMD ["python", "backend/app.py"]
