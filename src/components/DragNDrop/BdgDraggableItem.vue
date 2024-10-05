<template>
    <div>
        <v-chip>
            <slot></slot>
            <v-icon
            cbr-dragndrop-no-pick
            class="remove-icon"
            icon="mdi-close"
            :hidden="!draggable?.showRemoveIcon"
            @click="onUnpin"
            >
            </v-icon>
        </v-chip>
        <v-icon 
            class="add-icon" 
            icon="mdi-plus-circle-outline"
            :hidden="!draggable?.showAddIcon"
        >
        </v-icon>
    </div>
</template>


<style scoped>
  .draggable-content {
    display: inline-block;
    cursor: default;
  }

  .add-icon {
    transform: translate(-50%, -50%);
    color: green;
  }

  .remove-icon {
    margin-left: 0.5em;
    cursor: pointer;
  }

  .remove-icon:hover {
    color: red;
  }
</style>


<script setup lang="ts">
    import type { CbrDraggableInterface } from '@/libComponents/cbrDragNDrop/cbrDraggableInterface';
    import { Subject, takeUntil, type Observable } from 'rxjs';
    import { onMounted, onUnmounted, ref } from 'vue';

    const props = defineProps<{
        draggableObserver: Observable<CbrDraggableInterface | undefined>,
    }>();
    
    const draggable = ref<CbrDraggableInterface | undefined>(undefined);
    const closeSubject = new Subject<boolean>();

    function onUnpin() {
        draggable.value?.unpin();
    }

    onMounted(() => {
        props.draggableObserver
            .pipe(takeUntil(closeSubject))
            .subscribe((instance) => {
                if (instance) {
                    draggable.value = instance;
                }
            });
    });

    onUnmounted(() => {
        closeSubject.next(true);
        closeSubject.complete();
    });

</script>
