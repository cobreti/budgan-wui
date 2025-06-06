# Budgan

Budgan is a personal finance management application that helps you track your bank accounts, manage transactions, and gain insights into your financial status. Built with modern web technologies, it offers a sleek user interface for monitoring your finances.

## Project Overview

Budgan allows you to:

- Track multiple bank accounts and credit cards
- Import transactions from CSV files (bank statements)
- Categorize and organize your transactions
- View financial breakdowns and monthly summaries
- Save and load your financial data locally

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/cobreti/budgan-wui.git
    cd budgan-wui
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Build for production:
    ```bash
    npm run build
    ```

## User Guide

### Importing Bank Statements

1. Navigate to your account page
2. Click on "Import Statement"
3. Choose either:
    - Upload a CSV file from your computer
    - Use demo data available in the application
4. Configure the CSV column mappings (first time for each bank)
5. Validate and confirm the imported transactions

### Managing Transactions

- View transactions in two different modes:
    - List view: See all transactions in a chronological table
    - Monthly view: View transactions grouped by month with income and expense summaries
- Track key financial metrics:
    - Total income
    - Total expenses
    - Monthly balance
- See transaction details including:
    - Date
    - Transaction type
    - Description
    - Amount
- View monthly summaries with income vs. expense breakdowns

### CSV Settings

- Configure different CSV import formats for different banks
- Map CSV columns to transaction fields
- Save settings for re-use with future imports

## Technologies Used

Budgan is built with the following technologies:

### Frontend

- **Vue 3**: Core framework with Composition API and `<script setup>` syntax
- **TypeScript**: For type safety and improved developer experience
- **Vuetify 3**: UI component library providing Material Design components
- **Vue Router**: For navigation and routing
- **Pinia**: State management with persistence support

### Data Processing

- **CSV Parse**: Library for parsing CSV files
- **Inversify**: Dependency injection framework
- **Reflect Metadata**: For runtime reflection and decorators

### Development

- **Vite**: Build tool and development server
- **Vitest**: Unit testing framework
- **Cypress**: End-to-end testing
- **ESLint & Prettier**: Code quality and formatting

## Architecture

### Naming Convention

All components and views are prefixed with `bdg` (e.g., `BdgAccountData.vue`) to avoid naming conflicts.

### Directory Structure

- `src/components/`: Reusable Vue components
- `src/views/`: Page components
- `src/core/`: Core application logic and services
- `src/core/models/`: Data models
- `src/core/services/`: Business logic services
- `src/stores/`: Pinia stores for state management
