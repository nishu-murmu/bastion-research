# Bastion Research Frontend

This is the frontend for the Bastion Research application, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

-   User authentication (Login and Registration)
-   Dashboard with Cashfree payment integration
-   Payment history display
-   Digio integration for e-signing.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v20 or higher)
-   [pnpm](https://pnpm.io/installation)

## Getting Started

These instructions assume you are running the web client from the root of the monorepo.

1.  **Install dependencies:**

    If you haven't already, install all dependencies from the root of the monorepo:

    ```bash
    pnpm install
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the `apps/web` directory. You can copy the example file as a starting point:

    ```bash
    cp apps/web/.env.example apps/web/.env
    ```

    Update the `.env` file with your credentials for the following services:

    -   `VITE_API_BASE_URL`: The base URL of the backend API (e.g., `http://localhost:3003`).
    -   `VITE_DIGIO_SADBOX_CLIENT_ID`, `VITE_DIGIO_SANDBOX_CLIENT_SECRET`: Digio sandbox credentials.
    -   `VITE_DIGIO_PRODUCTION_CLIENT_ID`, `VITE_DIGIO_PRODUCTION_CLIENT_SECRET`: Digio production credentials.
    -   `VITE_DIGIO_ENVIRONMENT`: The Digio environment (`sandbox` or `production`).

## Development

To start the development server, run the following command from the root of the monorepo:

```bash
pnpm dev:web
```

This will start the Vite development server, and the application will be available at `http://localhost:5173`.

## Available Scripts

The following scripts are available for the web application:

-   `pnpm --filter web build`: Build the web application for production.
-   `pnpm --filter web dev`: Run the web application in development mode.
-   `pnpm --filter web lint`: Lint the code.
-   `pnpm --filter web preview`: Preview the production build.

These scripts should be run from the root of the monorepo.
