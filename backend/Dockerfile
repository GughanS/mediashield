FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing bytecode and enabling unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies natively
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the Hugging Face AI weights directly into the container image!
# This prevents the 1.5GB model from downloading at server startup, which causes 503 Timeouts.
ENV HF_HOME=/app/models_cache
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('clip-ViT-B-32')"

# Copy source code
COPY . .

# Environment patch for Protobuf mismatch is present in main.py, but we can secure it here too
ENV PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python
ENV USE_TF=0

# Expose $PORT variable (Google Cloud Run maps this dynamically)
EXPOSE 8080

# Command to run the application using Gunicorn mapped to Uvicorn workers with extended timeout
CMD exec gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8080 --timeout 120
