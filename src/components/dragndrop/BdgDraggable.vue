/**
  * Draggable component
  *
  * @requires vuejs v3.5.5
  * @slot default
  * @prop {string} dropAreaClass - class name of drop area
  */

<template>
  <div class="draggable-content" @mousedown="onMouseDown" ref="draggableContent">
    <slot>
    </slot>
    <span :hidden="!hoverDropArea">
      <slot name="hoverdroparea">
        <div class="add-icon">+</div>
      </slot>
    </span>
    <span :hidden="!indroparea">
      <slot name="indroparea">
        <div class="remove-icon">X</div>
      </slot>
    </span>
  </div>
</template>

<style scoped>
  .draggable-content {
    display: inline-block;
  }

  .add-icon {
    display: inline-block;
    transform: translate3d(-50%, -50%, 0);
    font-size: larger;
    font-weight: bolder;
  }

  .remove-icon {
    display: inline-block;
    font-size: larger;
    font-weight: bolder;
  }
</style>

<script setup lang="ts">

  import { computed, onMounted, type Ref, ref, type ShallowRef, useTemplateRef } from 'vue'
  import {
    type BdgHoverEnterEvent,
    type BdgHoverExitEvent,
    DragnDropEvents
  } from '@components/dragndrop/BdgDragndropTypes'

  // let elm: HTMLElement | null = null
  const draggedElm: Ref<HTMLElement | null> = ref(null)
  const slotRef: ShallowRef<HTMLElement | null | undefined> = useTemplateRef('draggableContent');
  const orgPosition: Ref<string> = ref('');
  const currentDropArea: Ref<Element | undefined> = ref(undefined);
  const originalParent : Ref<HTMLElement | null | undefined> = ref(undefined);
  const indroparea: Ref<boolean> = ref(false)

  const props = defineProps<
    {
      dropAreaClass: string
      onHoverenter?: (event: BdgHoverEnterEvent) => void,
      onHoverexit?: (event: BdgHoverExitEvent) => void,
    }>()

  const dropAreaClassSelector = `.${props.dropAreaClass}`


  const hoverDropArea = computed(() => {
    return currentDropArea.value != null;
  })


  onMounted(() => {
    originalParent.value = slotRef.value?.parentElement;
  })

  function getDropElementFromPoint(x: number, y: number): Element | undefined {
    if (dropAreaClassSelector == '') {
      return undefined
    }

    let elements: Element[] | null = null
    let dropArea : Element | undefined = undefined;

    if (draggedElm.value) {
      elements = document.elementsFromPoint(x, y);

      dropArea = elements.find((element) => {
        return element.matches(dropAreaClassSelector)
      })
    }

    return dropArea;
  }

  function onMouseMove(event: MouseEvent) {
    event.preventDefault()
    if (draggedElm.value) {
      draggedElm.value.style.left = `${event.clientX - draggedElm.value.clientWidth / 2}px`
      draggedElm.value.style.top = `${event.clientY - draggedElm.value.clientHeight / 2}px`

      let dropArea = getDropElementFromPoint(event.clientX, event.clientY)

      if (dropArea !== currentDropArea.value) {
        if (dropArea) {
          const hoverEnterEvent = new CustomEvent(DragnDropEvents.HOVER_ENTER, {
            detail: {
              element: draggedElm.value,
              preventDrop: () => {
                console.log('drop prevented');
                dropArea = undefined;
              }
            }
          });

          if (props.onHoverenter) {
            props.onHoverenter({
              element: draggedElm.value,
              preventDrop: () => {
                console.log('drop prevented');
                dropArea = undefined;
              }
            });
          }

          dropArea?.dispatchEvent(hoverEnterEvent)
        }
        else {
          const hoverExitEvent = new CustomEvent(DragnDropEvents.HOVER_EXIT, {
            detail: {
              element: draggedElm.value
            }
          });

          if (props.onHoverexit) {
            props.onHoverexit({
              element: draggedElm.value
            });
          }

          currentDropArea.value?.dispatchEvent(hoverExitEvent)
        }

        currentDropArea.value = dropArea;
      }
    }
  }

  function onMouseUp(event: MouseEvent) {
    event.preventDefault()

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    if (!draggedElm.value) {
      return
    }

    if (currentDropArea.value && draggedElm.value) {

      const dropEvent = new CustomEvent(DragnDropEvents.DROP, {
        detail: {
          element: draggedElm.value
        }
      });
      currentDropArea.value.dispatchEvent(dropEvent)
      indroparea.value = true;
    }
    else {
      if (originalParent.value && draggedElm.value) {
        originalParent.value.appendChild(draggedElm.value)
      }
      indroparea.value = false;
    }

    draggedElm.value.style.position = orgPosition.value;
    draggedElm.value = null;
    currentDropArea.value = undefined;
  }

  function onMouseDown(event: MouseEvent) {
    event.preventDefault()
    console.log('mouse down')

    if (slotRef.value) {
      indroparea.value = false;
      draggedElm.value = slotRef.value as HTMLElement
      orgPosition.value = draggedElm.value.style.position
      draggedElm.value.style.position = 'fixed'
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
</script>
