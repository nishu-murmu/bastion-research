# Bastion Research Monorepo

This monorepo contains the fullstack application for Bastion Research. It includes a React frontend, a Node/Express backend, and a shared types package.

## Project Structure

This monorepo is managed with `pnpm` workspaces and `Turborepo`. The project is structured as follows:

-   `apps/web`: The React frontend application.
-   `apps/server`: The Node.js/Express backend server.
-   `packages/types`: A shared package for TypeScript types used by both the frontend and backend.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v20 or higher)
-   [pnpm](https://pnpm.io/installation)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**

    Install all dependencies from the root of the monorepo using `pnpm`:

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Each application requires its own `.env` file. You can find example environment files in each application's directory (`apps/web/.env.example` and `apps/server/.env.example`).

    -   **For the server (`apps/server`):**
        Create a `.env` file in `apps/server` and add the necessary environment variables for Supabase, JWT, and other services.

    -   **For the web client (`apps/web`):**
        Create a `.env` file in `apps/web` and add the `VITE_API_BASE_URL` variable, pointing to the backend server's URL.

        ```
        VITE_API_BASE_URL=http://localhost:3000
        ```

## Development

To start the development servers for both the frontend and backend, run the following command from the root of the monorepo:

```bash
pnpm dev
```

This will start the React frontend on `http://localhost:5173` and the Node.js backend on the port specified in your server's environment variables (e.g., `3000`).

You can also run each application individually:

-   **Start the web client only:**

    ```bash
    pnpm dev:web
    ```

-   **Start the server only:**

    ```bash
    pnpm dev:server
    ```

## Available Scripts

The following scripts are available at the root of the monorepo:

-   `pnpm build`: Build all applications.
-   `pnpm build:web`: Build only the web application.
-   `pnpm build:server`: Build only the server application.
-   `pnpm dev`: Run all applications in development mode.
-   `pnpm dev:web`: Run the web application in development mode.
-   `pnpm dev:server`: Run the server application in development mode.
-   `pnpm lint`: Lint all applications.
-   `pnpm format`: Format all files with Prettier.
-   `pnpm check-types`: Check for TypeScript errors in all packages.

## Best Practices

-   **Shared Types**: Use the `@repo/types` package to share TypeScript types between the frontend and backend. This ensures consistency and type safety across the entire application.
-   **Environment Variables**: Never commit `.env` files to version control. Use `.env.example` files to document the required environment variables.
-   **Code Formatting**: Run `pnpm format` before committing your changes to ensure consistent code style.
-   **Linting**: Run `pnpm lint` to catch any linting errors before committing your changes.
