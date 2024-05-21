# POS Monorepo

## Overview
This repository contains a monorepo for a Point of Sales (POS) system built using React and Laravel. The frontend is developed with React, while the backend is powered by Laravel.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Frontend Setup (React)](#frontend-setup-react)
3. [Backend Setup (Laravel)](#backend-setup-laravel)
4. [Database Migration and Seeding](#database-migration-and-seeding)
5. [Scripts](#scripts)
6. [License](#license)

## Getting Started
To get started with this project, ensure you have Node.js, npm (or yarn), PHP, Composer, and a suitable database system (e.g., MySQL) installed on your machine.

## Frontend Setup (React)
1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Start the development server:
    ```bash
    npm start
    # or
    yarn start
    ```

4. Build the production-ready code:
    ```bash
    npm run build
    # or
    yarn build
    ```

## Backend Setup (Laravel)
1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Install the dependencies:
    ```bash
    composer install
    ```

3. Create a copy of the `.env` file:
    ```bash
    cp .env.example .env
    ```

4. Generate the application key:
    ```bash
    php artisan key:generate
    ```

5. Set up the database configuration in the `.env` file:
    ```plaintext
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    ```

6. Run the database migrations:
    ```bash
    php artisan migrate
    ```

7. Seed the database:
    ```bash
    php artisan db:seed
    ```

8. Serve the application:
    ```bash
    php artisan serve
    ```

## Database Migration and Seeding
### Running Migrations
To run the database migrations, use the following command:
```bash
php artisan migrate
