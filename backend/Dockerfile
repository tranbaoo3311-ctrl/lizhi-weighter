# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY ./requirements.txt /app/requirements.txt

# Install build dependencies, install python packages, then remove build dependencies
RUN apt-get update && \
    apt-get install -y gcc python3-dev && \
    pip install --no-cache-dir --upgrade -r /app/requirements.txt && \
    apt-get purge -y gcc python3-dev && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the application's code into the container at /app
COPY . /app

# Create a non-root user and change ownership of the app directory
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
