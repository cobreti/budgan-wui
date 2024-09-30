/**
  * Draggable component
  *
  * @requires vuejs v3.5.5
  * @slot default
  * @prop {string} dropAreaClass - class name of drop area
  */

<template>
  <div class="draggable-content" @mousedown="onMouseDown" @touchstart="onTouchStart" ref="draggableContent">
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
  const freeArea : Ref<Element | null> = ref(null);
  const slotRef: ShallowRef<HTMLElement | null | undefined> = useTemplateRef('draggableContent');
  const orgPosition: Ref<string> = ref('');
  const state: Ref<CbrDraggableState> = ref({
    state: CbrDraggableStateEnum.FREE
  });

  const props = defineProps<
    {
      freeAreaSelector: string,
      dropAreaSelector: string,
      hoverEnter?: (event: CbrHoverEnterEvent) => void,
      hoverExit?: (event: CbrHoverExitEvent) => void,
      stateChanged?: (state: CbrDraggableState) => void
    }>()


  onMounted(() => {
    init();

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
    if (props.dropAreaSelector === '') {
      return undefined
    }

    let elements: Element[] | null = null
    let dropArea : Element | undefined = undefined;

    if (draggedElm.value) {
      elements = document.elementsFromPoint(x, y);

      dropArea = elements.find((element) => {
        return element.matches(props.dropAreaSelector)
      })
    }

    return dropArea;
  }

  function onDragStart() {
    if (!slotRef.value)
      return;

    if (!draggedElm.value)
      return;

    orgPosition.value = draggedElm.value.style.position
    draggedElm.value.style.position = 'fixed'
    setState({
      state: CbrDraggableStateEnum.DRAGGING,
      hoverElement: state.value.pinnedElement
    });
  }

  function onDragMove(clientX: number, clientY: number) {
    if (draggedElm.value) {
      draggedElm.value.style.left = `${clientX - draggedElm.value.clientWidth / 2}px`
      draggedElm.value.style.top = `${clientY - draggedElm.value.clientHeight / 2}px`

      let dropArea = getDropElementFromPoint(clientX, clientY)

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

        setState({
          state: CbrDraggableStateEnum.DRAGGING,
          hoverElement: dropArea
        });
      }
    }
  }

  function onDragEnd() {
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
      addToFreeArea();
      setState({
        state: CbrDraggableStateEnum.FREE
      });
    }

    draggedElm.value.style.position = orgPosition.value;
  }

  function onDragCanceled() {
    if (!draggedElm.value) {
      return
    }

    addToFreeArea();

    setState({
      state: CbrDraggableStateEnum.FREE
    });

    draggedElm.value = null;
  }

  function onTouchMove(event: TouchEvent) {
    event.preventDefault();

    onDragMove(event.touches[0].clientX, event.touches[0].clientY);
  }

  function onMouseMove(event: MouseEvent) {
    event.preventDefault();

    onDragMove(event.clientX, event.clientY);
  }

  function onMouseUp(event: MouseEvent) {
    event.preventDefault()

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    onDragEnd();
  }

  function onTouchEnd(event: TouchEvent) {
    event.preventDefault();

    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchCancel);

    onDragEnd();
  }

  function onTouchCancel(event: TouchEvent) {
    event.preventDefault();

    onDragCanceled();

    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchCancel);
  }

  function onMouseDown(event: MouseEvent) {
    event.preventDefault()
    console.log('mouse down')

    onDragStart();

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function onTouchStart(event: TouchEvent) {
    event.preventDefault();

    onDragStart();

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchCancel);
  }

  function addToFreeArea() {

    if (!freeArea.value)
      return;

    if (!draggedElm.value)
      return;

    let freeAreaParent = draggedElm.value.closest(props.freeAreaSelector);

    if (!freeAreaParent) {
      console.log('moving elmeent to free area', draggedElm.value)
      freeArea.value.appendChild(draggedElm.value);
      draggedElm.value.style.position = orgPosition.value;
    }
  }

  function init() {
    let elm = document.querySelector(props.freeAreaSelector);
    if (!elm) {
      console.error('Free area not found');
      return;
    }
    
    freeArea.value = elm;
    draggedElm.value = slotRef.value as HTMLElement;
    orgPosition.value = draggedElm.value.style.position;

    addToFreeArea();
  }


</script>
