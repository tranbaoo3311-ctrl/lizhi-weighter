# Backend Deployment Guide

This guide provides instructions on how to deploy the backend service for the Weighing and Labeling System using Docker and Docker Compose.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your deployment server:

*   **Docker**: [Installation Guide](https://docs.docker.com/engine/install/)
*   **Docker Compose**: [Installation Guide](https://docs.docker.com/compose/install/)

## 2. Configuration

Follow these steps to configure the application before the first launch.

### Step 2.1: Create the Environment File

The application uses an environment file to manage sensitive data like the secret key.

1.  Copy the example environment file to a new `.env` file:
    ```bash
    cp .env.example .env
    ```

2.  Generate a secure secret key. You can use the following command to generate a strong, random 32-byte key:
    ```bash
    openssl rand -hex 32
    ```

3.  Open the `.env` file with a text editor and replace the placeholder `YOUR_SUPER_SECRET_KEY_REPLACE_ME` with the key you just generated. The file should look like this:
    ```
    SECRET_KEY=your_newly_generated_secret_key_here
    ```

## 3. Launching the Application

With the configuration in place, you can now build and launch the application using Docker Compose.

1.  Navigate to the root directory of the project.

2.  Run the following command to build the Docker image and start the backend service in detached mode (running in the background):
    ```bash
    docker-compose up -d --build
    ```

This command will:
*   Pull the base Python image.
*   Build your application's Docker image based on the `backend/Dockerfile`.
*   Create and start the `backend` container.

**Important Note on Data Persistence:**

In this deployment configuration, the SQLite database file (`sql_app.db`) is stored *inside* the Docker container's filesystem. This means:

*   Data **will persist** if you stop and restart the container (e.g., with `docker-compose down` and `docker-compose up -d`).
*   Data **will be permanently lost** if you remove the container or rebuild the image (e.g., with `docker-compose up -d --build`).

This setup is suitable for environments where the application code is stable and data can be repopulated if necessary. For environments requiring true data persistence across image updates, a managed database service or a properly configured host volume is recommended.

## 4. Verifying the Deployment

After a few moments, the service should be up and running.

You can verify that the service is running by:

*   Checking the container logs:
    ```bash
    docker-compose logs -f
    ```
*   Accessing the root endpoint of the API. From your server, you can use `curl`, or you can use a web browser from any machine that can access your server's IP address:
    ```bash
    curl http://localhost:8000
    ```
    If the deployment is successful, you should see the following JSON response:
    ```json
    {"message":"Welcome to the Weighing and Labeling System API"}
    ```

## 5. Managing the Service

*   **To stop the service**, run the following command in the project's root directory:
    ```bash
    docker-compose down
    ```
*   **To restart the service**, simply run `docker-compose up -d` again.
