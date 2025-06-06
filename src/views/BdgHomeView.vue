<script setup lang="ts"></script>

<template>
    <main>
        <v-container class="home-container">
            <v-row>
                <v-col cols="12" class="text-center">
                    <h1 class="text-h2 mb-6">Welcome to Budgan</h1>
                    <v-img
                        src="/Budgan256.png"
                        alt="Budgan Logo"
                        class="mx-auto mb-6"
                        max-width="180"
                    ></v-img>
                </v-col>
            </v-row>

            <!-- Description Section -->
            <v-row>
                <v-col cols="12">
                    <v-card class="mb-6">
                        <v-card-title class="text-h4">About Budgan</v-card-title>
                        <v-card-text class="text-body-1">
                            <p>
                                Budgan is a personal finance management application that helps you
                                track your bank accounts, manage transactions, and gain insights
                                into your financial status. Built with modern web technologies, it
                                offers a sleek user interface for monitoring your finances.
                            </p>
                            <p class="mt-4">
                                For security reasons, this application does not connect directly to
                                any financial institutions. Instead, you'll need to download your
                                account statements from your bank's website and import them manually
                                into Budgan. This approach ensures that your banking credentials are
                                never stored or transmitted by this application.
                            </p>
                            <p class="mt-4 text-info-emphasis font-weight-medium">
                                This application is designed to work entirely client-side without
                                requiring any server. All your financial data stays on your local
                                device, ensuring you maintain complete control over your sensitive
                                information at all times.
                            </p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Overview Section -->
            <v-row>
                <v-col cols="12">
                    <v-card class="mb-6">
                        <v-card-title class="text-h4">Key Features</v-card-title>
                        <v-card-text>
                            <v-list>
                                <v-list-item prepend-icon="mdi-bank">
                                    <v-list-item-title
                                        >Track multiple bank accounts and credit
                                        cards</v-list-item-title
                                    >
                                </v-list-item>
                                <v-list-item prepend-icon="mdi-file-import">
                                    <v-list-item-title
                                        >Import transactions from CSV files (bank
                                        statements)</v-list-item-title
                                    >
                                </v-list-item>
                                <v-list-item prepend-icon="mdi-tag-multiple">
                                    <v-list-item-title
                                        >Categorize and organize your
                                        transactions</v-list-item-title
                                    >
                                </v-list-item>
                                <v-list-item prepend-icon="mdi-chart-box">
                                    <v-list-item-title
                                        >View financial breakdowns and monthly
                                        summaries</v-list-item-title
                                    >
                                </v-list-item>
                                <v-list-item prepend-icon="mdi-content-save">
                                    <v-list-item-title
                                        >Save and load your financial data
                                        locally</v-list-item-title
                                    >
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- User Guide Section -->
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="text-h4">User Guide</v-card-title>

                        <!-- Importing Bank Statements Section -->
                        <v-card-text>
                            <h3 class="text-h5 mb-3">Importing Bank Statements</h3>
                            <ol class="mb-6">
                                <li class="mb-2">Navigate to your account page</li>
                                <li class="mb-2">Click on "Import Statement"</li>
                                <li class="mb-2">
                                    Choose either:
                                    <ul>
                                        <li>Upload a CSV file from your computer</li>
                                        <li>Use demo data available in the application</li>
                                    </ul>
                                </li>
                                <li class="mb-2">
                                    Configure the CSV column mappings (first time for each bank)
                                </li>
                                <li class="mb-2">Validate and confirm the imported transactions</li>
                            </ol>

                            <!-- Managing Transactions Section -->
                            <h3 class="text-h5 mb-3">Managing Transactions</h3>
                            <ul class="mb-6">
                                <li class="mb-2">
                                    View transactions in two different modes:
                                    <ul>
                                        <li>
                                            List view: See all transactions in a chronological table
                                        </li>
                                        <li>
                                            Monthly view: View transactions grouped by month with
                                            income and expense summaries
                                        </li>
                                    </ul>
                                </li>
                                <li class="mb-2">
                                    Track key financial metrics:
                                    <ul>
                                        <li>Total income</li>
                                        <li>Total expenses</li>
                                        <li>Monthly balance</li>
                                    </ul>
                                </li>
                                <li class="mb-2">
                                    See transaction details including:
                                    <ul>
                                        <li>Date</li>
                                        <li>Transaction type</li>
                                        <li>Description</li>
                                        <li>Amount</li>
                                    </ul>
                                </li>
                                <li class="mb-2">
                                    View monthly summaries with income vs. expense breakdowns
                                </li>
                            </ul>

                            <!-- CSV Settings Section -->
                            <h3 class="text-h5 mb-3">CSV Settings</h3>
                            <ul>
                                <li class="mb-2">
                                    Configure different CSV import formats for different banks
                                </li>
                                <li class="mb-2">Map CSV columns to transaction fields</li>
                                <li class="mb-2">Save settings for re-use with future imports</li>
                            </ul>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" to="/accounts">
                                Get Started
                                <v-icon end icon="mdi-arrow-right"></v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </main>
</template>

<style scoped>
    .home-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    h3 {
        color: #1976d2; /* Primary blue color */
        margin-top: 1.5rem;
    }

    li {
        line-height: 1.6;
    }

    .v-card {
        border-radius: 8px;
        transition:
            transform 0.3s,
            box-shadow 0.3s;
    }

    .v-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
</style>
