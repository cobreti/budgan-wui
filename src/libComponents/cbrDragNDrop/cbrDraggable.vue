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

  import { onMounted, type Ref, ref, type ShallowRef, useTemplateRef } from 'vue'
  import {
    type CbrDraggableState,
    CbrDraggableStateEnum,
    type CbrHoverEnterEvent,
    type CbrHoverExitEvent,
    DragnDropEvents
  } from '@libComponents/cbrDragNDrop/cbrDragNDropTypes'

  const draggedElm: Ref<HTMLElement | null> = ref(null)
  const slotRef: ShallowRef<HTMLElement | null | undefined> = useTemplateRef('draggableContent');
  const orgPosition: Ref<string> = ref('');
  const originalParent : Ref<HTMLElement | null | undefined> = ref(undefined);
  const state: Ref<CbrDraggableState> = ref({
    state: CbrDraggableStateEnum.FREE
  });

  const props = defineProps<
    {
      dropAreaClass: string
      hoverEnter?: (event: CbrHoverEnterEvent) => void,
      hoverExit?: (event: CbrHoverExitEvent) => void,
      stateChanged?: (state: CbrDraggableState) => void
    }>()

  const dropAreaClassSelector = `.${props.dropAreaClass}`


  onMounted(() => {
    originalParent.value = slotRef.value?.parentElement;
    if (props.stateChanged) {
      props.stateChanged(state.value);
    }
  });

  function setState(newState: CbrDraggableState) {
    state.value = newState;
    if (props.stateChanged) {
      props.stateChanged(state.value);
    }
  }

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

      if (dropArea !== state.value.hoverElement) {
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

          if (props.hoverEnter) {
            props.hoverEnter({
              element: draggedElm.value,
              preventDrop: () => {
                console.log('drop prevented');
                dropArea = undefined;
              }
            });
          }

          dropArea?.dispatchEvent(hoverEnterEvent);
        }
        else {
          const hoverExitEvent = new CustomEvent(DragnDropEvents.HOVER_EXIT, {
            detail: {
              element: draggedElm.value
            }
          });

          if (props.hoverExit) {
            props.hoverExit({
              element: draggedElm.value
            });
          }

          state.value.hoverElement?.dispatchEvent(hoverExitEvent);
        }

        // currentDropArea.value = dropArea;
        setState({
          state: CbrDraggableStateEnum.DRAGGING,
          hoverElement: dropArea
        });
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

    if (state.value.hoverElement && draggedElm.value) {

      const dropEvent = new CustomEvent(DragnDropEvents.DROP, {
        detail: {
          element: draggedElm.value
        }
      });
      state.value.hoverElement?.dispatchEvent(dropEvent)
      setState({
        state: CbrDraggableStateEnum.PINNED,
        pinnedElement: state.value.hoverElement
      });
    }
    else {
      if (originalParent.value && draggedElm.value) {
        originalParent.value.appendChild(draggedElm.value)
      }
      setState({
        state: CbrDraggableStateEnum.FREE
      });
    }

    draggedElm.value.style.position = orgPosition.value;
    draggedElm.value = null;
    // currentDropArea.value = undefined;
  }

  function onMouseDown(event: MouseEvent) {
    event.preventDefault()
    console.log('mouse down')

    if (slotRef.value) {
      draggedElm.value = slotRef.value as HTMLElement
      orgPosition.value = draggedElm.value.style.position
      draggedElm.value.style.position = 'fixed'
      setState({
        state: CbrDraggableStateEnum.DRAGGING
      });
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
</script>
