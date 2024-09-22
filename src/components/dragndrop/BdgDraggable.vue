/**
  * Draggable component
  *
  * @requires vuejs v3.5.5
  * @slot default
  * @prop {string} dropAreaClass - class name of drop area
  */

<template>
  <div class="draggable-content" :class="{ 'hide-draggable-content': hideElm }" @mousedown="onMouseDown" ref="draggableContent">
    <slot ></slot>
    <span :hidden="!hoverDropArea">
    <slot name="hoverdroparea">
    </slot>
    </span>
  </div>
</template>

<style scoped>
  .draggable-content {
    cursor: move;
    display: inline-block;
  }

  .hide-draggable-content {
    display:none;
  }
</style>

<script setup lang="ts">

import { computed, onMounted, type Ref, ref, type ShallowRef, useTemplateRef } from 'vue'
  import {
    type BdgHoverEnterEvent,
    type BdgHoverExitEvent,
    DragnDropEvents
  } from '@components/dragndrop/BdgDragndropTypes'

  let elm: HTMLElement | null = null
  const currentDropArea: Ref<Element | undefined> = ref(undefined)
  let orgPosition = ''
  const hoverDropArea = computed(() => {
    return currentDropArea.value != null;
  })

  const hideElm = ref(false);
  let slotRef: ShallowRef<HTMLElement | null | undefined> = useTemplateRef('draggableContent');
  const originalParent : Ref<HTMLElement | null | undefined> = ref(undefined);
  const props = defineProps<
    {
      dropAreaClass: string
      onHoverenter?: (event: BdgHoverEnterEvent) => void,
      onHoverexit?: (event: BdgHoverExitEvent) => void,
    }>()

  const dropAreaClassSelector = `.${props.dropAreaClass}`

  onMounted(() => {
    originalParent.value = slotRef.value?.parentElement;
  })

  function getDropElementFromPoint(x: number, y: number): Element | undefined {
    if (dropAreaClassSelector == '') {
      return undefined
    }

    let elements: Element[] | null = null
    let dropArea : Element | undefined = undefined;

    if (elm) {
      // hideElm.value = true
      elements = document.elementsFromPoint(x, y);
      console.log(elements);
      // hideElm.value = false

      dropArea = elements.find((element) => {
        return element.matches(dropAreaClassSelector)
      })

      if (dropArea) {
        // ret = ret.closest(dropAreaClassSelector)
      }
    }

    return dropArea;
  }

  function onMouseMove(event: MouseEvent) {
    event.preventDefault()
    if (elm) {
      elm.style.left = `${event.clientX - elm.clientWidth / 2}px`
      elm.style.top = `${event.clientY - elm.clientHeight / 2}px`

      let dropArea = getDropElementFromPoint(event.clientX, event.clientY)

      if (dropArea !== currentDropArea.value) {
        if (dropArea) {
          const hoverEnterEvent = new CustomEvent(DragnDropEvents.HOVER_ENTER, {
            detail: {
              element: elm,
              preventDrop: () => {
                console.log('drop prevented');
                dropArea = undefined;
              }
            }
          });

          if (props.onHoverenter) {
            props.onHoverenter({
              element: elm,
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
              element: elm
            }
          });

          if (props.onHoverexit) {
            props.onHoverexit({
              element: elm
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

    if (!elm) {
      return
    }

    if (currentDropArea.value && elm) {

      const dropEvent = new CustomEvent(DragnDropEvents.DROP, {
        detail: {
          element: elm
        }
      });
      currentDropArea.value.dispatchEvent(dropEvent)
      // currentDropArea.appendChild(elm)
    }
    else {
      if (originalParent.value && elm) {
        originalParent.value.appendChild(elm)
      }
    }

    elm.style.position = orgPosition
    elm = null;
    currentDropArea.value = undefined;
  }

  function onMouseDown(event: MouseEvent) {
    event.preventDefault()
    console.log('mouse down')

    if (slotRef.value) {
      elm = slotRef.value as HTMLElement
      orgPosition = elm.style.position
      elm.style.position = 'fixed'
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
</script>
