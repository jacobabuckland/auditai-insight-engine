  # Use official Python image
  FROM python:3.11-slim

  # Set working directory
  WORKDIR /app

  # Install system dependencies required by Playwright
  RUN apt-get update && apt-get install -y \
      wget \
      gnupg \
      curl \
      ca-certificates \
      fonts-liberation \
      libappindicator3-1 \
      libasound2 \
      libatk-bridge2.0-0 \
      libatk1.0-0 \
      libcups2 \
      libdbus-1-3 \
      libgdk-pixbuf2.0-0 \
      libnspr4 \
      libnss3 \
      libx11-xcb1 \
      libxcomposite1 \
      libxdamage1 \
      libxrandr2 \
      xdg-utils \
      && apt-get clean && rm -rf /var/lib/apt/lists/*

  # Install Node.js (required for Playwright)
  RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
      apt-get install -y nodejs && \
      apt-get clean && rm -rf /var/lib/apt/lists/*

  # Install Playwright
  RUN npm install -g playwright && \
      playwright install --with-deps

  # Copy project files
  COPY . .

  # Install Python dependencies from backend
  RUN pip install --upgrade pip
  RUN pip install -r backend/requirements.txt

  # Expose the port your app runs on
  EXPOSE 10000

  # Run the app
  CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "10000"]
