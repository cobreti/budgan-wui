# GitHub Copilot Guide for Budgan-WUI

This guide provides recommendations on how to use GitHub Copilot effectively with the Budgan-WUI project.

## Project Overview

Budgan-WUI is a web-based budget management application that helps users track their finances, import bank statements, and visualize financial data. The application is built with:

- **Vue 3** with Composition API and script setup
- **TypeScript** for type safety
- **Vuetify** for UI components
- **Pinia** for state management
- **Inversify** for dependency injection
- **Vue Router** for navigation

## Key Architectural Patterns

### 1. Component Naming Convention

All Vue components are prefixed with `Bdg` (e.g., `BdgAccountData.vue`, `BdgSaveAccountData.vue`).

### 2. Dependency Injection with Inversify

Services are defined with interfaces and implementations, registered with Inversify container:

```typescript
// Getting a service instance in a component
const serializer = container.get<IAccountDataSerializer>(ServicesTypes.AccountDataSerializer)
```

### 3. Pinia Stores

Stores are created using the Composition API style:

```typescript
export const useBankAccountsStore = defineStore<string, BankAccountsStore>(
    'bankAccounts',
    () => {
        // State
        const accounts = ref<BankAccountsDictionary>({})

        // Methods
        function addWithBankAccount(account: BankAccount, accountId?: string) {
            // Implementation
        }

        return {
            accounts,
            addWithBankAccount
            // Other exposed state and methods
        }
    },
    {
        persist: {
            storage: localStorage
        }
    }
)
```

### 4. Data Serialization

The `AccountDataSerializer` service handles saving and loading data from Pinia stores:

```typescript
// Saving data
const savedData = serializer.saveAllData() // Returns JSON string

// Loading data
serializer.loadAllData(jsonString) // Loads into stores
```

## Effective Prompting for Budgan-WUI

Here are examples of effective GitHub Copilot prompts for common tasks:

### Creating New Components

```
Create a Vue component called BdgTransactionFilter that allows filtering transactions by date range,
transaction type, and amount range. Use Vuetify components and integrate with the bankAccounts-store.
```

### Extending Store Functionality

```
Add a new method to the bankAccounts-store that categorizes transactions based on keywords in the
description. It should support custom categories and persistent mapping of descriptions to categories.
```

### Working with CSV Data

```
Create a function that takes a CSV string from a bank statement, processes it according to
the provided CSVSettings, and returns an array of BankAccountTransaction objects. Handle
common date formats and amount formats.
```

### Testing Services

```
Write a unit test for the AccountDataSerializer's loadAllData method that verifies it
properly handles edge cases like empty data, missing fields, and legacy format data.
```

### Vue Router Integration

```
Add a new route and view for displaying transaction statistics, showing monthly totals,
categories breakdown, and trends over time.
```

## Code Templates

### New Vue Component

```vue
<template>
    <div>
        <!-- component content -->
    </div>
</template>

<style scoped>
    /* component styles */
</style>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'

    // Store access
    const bankAccountStore = useBankAccountsStore()

    // Local state
    const someState = ref<string>('')

    // Computed properties
    const derivedValue = computed(() => {
        // calculate value based on state
    })

    // Methods
    function handleAction() {
        // implementation
    }
</script>
```

### New Service

```typescript
import { injectable } from 'inversify'

export interface IMyService {
    // Service interface methods
    performAction(): void
}

@injectable()
export class MyService implements IMyService {
    performAction(): void {
        // Implementation
    }
}
```

## Best Practices

1. **Type Everything** - Always provide explicit TypeScript types for variables, parameters, and return values
2. **Use Vue 3 Composition API** - Prefer `script setup` style for components
3. **Service Pattern** - Create interfaces for services and register implementations with Inversify
4. **Store Integration** - Use Pinia stores for state management with proper typing
5. **Reusable Components** - Extract common UI patterns into shared components
6. **Test Coverage** - Write unit tests for services and complex business logic

By following these conventions and patterns, you'll get the most out of GitHub Copilot when working on the Budgan-WUI project.
