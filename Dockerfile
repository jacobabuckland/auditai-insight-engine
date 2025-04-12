# Use official Python image
FROM python:3.11-slim

# Set environment variable to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    curl \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libxss1 \
    libasound2 \
    libgbm-dev \
    libxshmfence-dev \
    libxcomposite1 \
    libxrandr2 \
    libdrm2 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libpci3 \
    libxcb1 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libglu1-mesa \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Upgrade pip and install backend Python dependencies
RUN pip install --upgrade pip
RUN pip install -r backend/requirements.txt

# Install Playwright for Python and its dependencies
RUN python -m playwright install --with-deps

# Expose the port
EXPOSE 10000

# Run the app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "10000"]
