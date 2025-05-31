# Budgan-WUI Copilot Instructions

## Project Context

You are assisting with development of Budgan-WUI, a Vue 3-based personal finance management application that helps users:

- Track bank accounts and transactions
- Import bank statements from CSV files
- Visualize financial data with monthly breakdowns
- Save and load account data

## Technology Stack

- Frontend Framework: Vue 3 with Composition API and `<script setup>` syntax
- Type Safety: TypeScript
- UI Components: Vuetify 3
- State Management: Pinia
- Dependency Injection: Inversify
- Routing: Vue Router
- CSV Processing: csv-parse
- Testing: Vitest

## Code Style and Conventions

1. **Component Naming**:

    - All Vue components are prefixed with `Bdg` (e.g., `BdgAccountData.vue`)
    - Files are named using PascalCase

2. **TypeScript**:

    - Use explicit types for all variables, parameters, and return values
    - Create interfaces for data structures and service contracts
    - Use type annotations with Vue's Composition API

3. **Architecture**:

    - Services are defined with interfaces and implementations using Inversify
    - State is managed in Pinia stores
    - UI is separated into reusable components

4. **File Organization**:
    - Components in `src/components/`
    - Views in `src/views/`
    - Core services in `src/core/services/`
    - Models in `src/core/models/`
    - Stores in `src/stores/`

## Common Patterns

### Service Pattern

```typescript
// Define interface
export interface IMyService {
    performAction(param: string): Promise<Result>
}

// Implement service
@injectable()
export class MyService implements IMyService {
    performAction(param: string): Promise<Result> {
        // Implementation
    }
}

// Register in container (in setupInversify.ts)
container.bind<IMyService>(ServicesTypes.MyService).to(MyService)

// Use in components
const service = container.get<IMyService>(ServicesTypes.MyService)
```

### Store Pattern

```typescript
// Define store type
export type MyStore = {
    data: Ref<DataType>
    computedValue: ComputedRef<ResultType>
    updateData: (newData: DataType) => void
}

// Create store
export const useMyStore = defineStore<string, MyStore>(
    'storeName',
    () => {
        const data = ref<DataType>({})

        const computedValue = computed(() => {
            // Transform data
            return result
        })

        function updateData(newData: DataType) {
            data.value = newData
        }

        return {
            data,
            computedValue,
            updateData
        }
    },
    {
        persist: {
            storage: localStorage
        }
    }
)
```

### Vue Component Pattern

```vue
<template>
    <v-card class="d-flex flex-column ma-2 pa-2">
        <!-- Use Vuetify grid system and components -->
        <!-- Prefer v-if over v-show when applicable -->
    </v-card>
</template>

<script setup lang="ts">
    // Imports
    import { ref, computed } from 'vue'
    import { useMyStore } from '@/stores/my-store'

    // Props and emits
    const props = defineProps<{
        itemId: string
    }>()

    const emit = defineEmits<{
        (e: 'update', value: string): void
    }>()

    // Store access
    const myStore = useMyStore()

    // Reactive state
    const localState = ref<string>('')

    // Computed properties
    const computedValue = computed(() => {
        return myStore.data[props.itemId]
    })

    // Methods
    function handleAction() {
        emit('update', localState.value)
    }
</script>
```

## Domain-Specific Knowledge

1. **Bank Accounts**:

    - Represented by the `BankAccount` type
    - Contains transactions and transaction groups
    - Each transaction has a type (deposit, withdrawal, etc.)

2. **CSV Settings**:

    - Configurations for parsing different bank statement CSV formats
    - Maps column indexes to transaction data (date, amount, description, etc.)

3. **Account Data Serialization**:
    - The application can save and load account data as JSON
    - Uses custom serializers to handle Date objects and other complex types

## Generating New Code

When generating new code:

1. Follow the established patterns for services, stores, and components
2. Maintain consistent naming conventions
3. Ensure proper TypeScript typing
4. Add appropriate comments and documentation
5. Consider implementing unit tests for services and stores
6. Integrate with the dependency injection container when applicable

## Project Goals

The project aims to:

1. Provide a clean, intuitive UI for personal finance management
2. Support importing transactions from various bank statement formats
3. Allow users to categorize and analyze their spending habits
4. Securely save and load financial data
5. Provide insightful visualizations of financial trends
