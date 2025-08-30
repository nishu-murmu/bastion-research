# Bastion Research Backend Server

This is the backend server for the Bastion Research application. It is a Node.js Express server built with TypeScript, featuring JWT authentication, Supabase integration, and various third-party services.

## Features

-   **Authentication**: JWT-based authentication with Google OAuth.
-   **Database**: Supabase for database management.
-   **Payments**: Integration with Cashfree for payment processing.
-   **File Uploads**: Handles file uploads using `multer`.
-   **SMS Notifications**: Sends SMS notifications using Twilio.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v20 or higher)
-   [pnpm](https://pnpm.io/installation)

## Getting Started

These instructions assume you are running the server from the root of the monorepo.

1.  **Install dependencies:**

    If you haven't already, install all dependencies from the root of the monorepo:

    ```bash
    pnpm install
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the `apps/server` directory. You can copy the example file as a starting point:

    ```bash
    cp apps/server/.env.example apps/server/.env
    ```

    Update the `.env` file with your credentials for the following services:

    -   `PORT`: The port on which the server will run (e.g., `3003`).
    -   `API_BASE_URL`: The base URL of the API (e.g., `http://localhost:3003`).
    -   `DIGIO_BASE_URL`, `DIGIO_CLIENT_ID`, `DIGIO_CLIENT_SECRET`: Credentials for Digio.
    -   `JWT_SECRET`: A secret key for signing JWTs.
    -   `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`: Credentials for Google OAuth.
    -   `CASHFREE_ENV`, `CASHFREE_APP_ID`, `CASHFREE_SECRET`: Credentials for Cashfree.
    -   `SUPABASE_URL`, `SUPABASE_ANON_KEY`: Credentials for Supabase.

## Development

To start the development server, run the following command from the root of the monorepo:

```bash
pnpm dev:server
```

This will start the server in development mode using `nodemon`, which will automatically restart the server when you make changes to the code.

## Available Scripts

The following scripts are available for the server application:

-   `pnpm --filter server build`: Build the server for production.
-   `pnpm --filter server start`: Start the production server.
-   `pnpm --filter server dev`: Run the server in development mode.

These scripts should be run from the root of the monorepo.

## API Endpoints

A brief overview of the available API endpoints will be added here in the future.
