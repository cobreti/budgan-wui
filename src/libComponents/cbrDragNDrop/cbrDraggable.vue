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

  import { onMounted, onUnmounted, type Ref, ref, type ShallowRef, useTemplateRef } from 'vue'
  import {
    type CbrDraggableState,
    CbrDraggableStateEnum,
    type CbrHoverEnterEvent,
    type CbrHoverExitEvent,
    DragnDropEvents
  } from '@libComponents/cbrDragNDrop/cbrDragNDropTypes'
import type { CbrDraggableControllerInterface } from './cbrDraggableController';
import type { CbrDraggableInterface } from './cbrDraggableInterface';

  const draggedElm: Ref<HTMLElement | null> = ref(null)
  const freeArea : Ref<Element | undefined> = ref();
  const slotRef: ShallowRef<HTMLElement | null | undefined> = useTemplateRef('draggableContent');
  const orgPosition: Ref<string> = ref('');
  const state: Ref<CbrDraggableState> = ref({
    state: CbrDraggableStateEnum.FREE
  });

  const props = defineProps<
    {
      freeAreaSelector: string,
      pinAreaSelector: string,
      controller?: CbrDraggableControllerInterface,
      hoverEnter?: (event: CbrHoverEnterEvent) => void,
      hoverExit?: (event: CbrHoverExitEvent) => void,
      stateChanged?: (state: CbrDraggableState) => void
    }>()


  class DraggableObject implements CbrDraggableInterface {
    unpin() {
      if (!draggedElm.value) {
        return
      }

      if (state.value.pinnedElement) {
        const unpinEvent = new CustomEvent(DragnDropEvents.UNPINNED, {
          detail: {
            element: draggedElm.value
          }
        });
        state.value.pinnedElement.dispatchEvent(unpinEvent);
      }

      addToFreeArea();
      setState({
        state: CbrDraggableStateEnum.FREE
      });

      draggedElm.value.style.position = orgPosition.value;
    }
  };
  const refObject = new DraggableObject();


  /**
   * Mounted hook
   */
  onMounted(() => {   
    freeArea.value = props.controller?.freeAreaElement;
    draggedElm.value = slotRef.value as HTMLElement;
    orgPosition.value = draggedElm.value.style.position;

    props.controller?.registerDraggable(refObject);

    // draggedElm.value.addEventListener(DragnDropEvents.UNPIN, onUnpinHandler);

    if (props.stateChanged) {
      props.stateChanged(state.value);
    }
  });

  /**
   * Unmounted hook
   */
  onUnmounted(() => {
    // if (draggedElm.value) {
      // draggedElm.value.removeEventListener(DragnDropEvents.UNPIN, onUnpinHandler);
    // }
  });


  /**
   * set the state of the draggable element
   * @param newState : state to set
   */
  function setState(newState: CbrDraggableState) {
    state.value = newState;
    if (props.stateChanged) {
      props.stateChanged(state.value);
    }
  }

  /**
   * return the pin element where the draggable can be pinnedfrom a point
   * @param x 
   * @param y 
   */
  function getPinElementFromPoint(x: number, y: number): Element | undefined {
    return props.controller?.getPinElementFromPoint(x, y);
  }

  // /**
  //  * custom unpin event handler
  //  * @param event : CustomEvent<CbrUnpinEvent>
  //  */
  // function onUnpinHandler(event: CustomEvent<CbrUnpinEvent>) {
  //   if (!draggedElm.value) {
  //     return
  //   }

  //   if (state.value.pinnedElement) {
  //     const unpinEvent = new CustomEvent(DragnDropEvents.UNPINNED, {
  //       detail: {
  //         element: draggedElm.value
  //       }
  //     });
  //     state.value.pinnedElement.dispatchEvent(unpinEvent);
  //   }

  //   addToFreeArea();
  //   setState({
  //     state: CbrDraggableStateEnum.FREE
  //   });

  //   draggedElm.value.style.position = orgPosition.value;
  // }

  /**
   * on drag start event handler
   *  called by mouse down or touch start event
   */
  function onDragStart() {
    if (!slotRef.value)
      return;

    if (!draggedElm.value)
      return;

    orgPosition.value = draggedElm.value.style.position
    draggedElm.value.style.position = 'fixed'
    setState({
      state: CbrDraggableStateEnum.DRAGGING,
      hoverElement: state.value.pinnedElement,
      pinnedElement: state.value.pinnedElement
    });
  }

  /**
   * on drag move event handler
   *  called by mouse move or touch move event
   * 
   * @param clientX 
   * @param clientY 
   */
  function onDragMove(clientX: number, clientY: number) {
    if (draggedElm.value) {
      draggedElm.value.style.left = `${clientX - draggedElm.value.clientWidth / 2}px`
      draggedElm.value.style.top = `${clientY - draggedElm.value.clientHeight / 2}px`

      let dropArea = getPinElementFromPoint(clientX, clientY)

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
          hoverElement: dropArea,
          pinnedElement: state.value.pinnedElement
        });
      }
    }
  }

  /**
   * on drag end event handler
   *  called by mouse up or touch end event
   */
  function onDragEnd() {
    if (!draggedElm.value) {
      return
    }

    if (state.value.hoverElement && draggedElm.value) {

      if (state.value.hoverElement != state.value.pinnedElement) {
        const unPinEvent = new CustomEvent(DragnDropEvents.UNPINNED, {
          detail: {
            element: draggedElm.value
            }
        });
        state.value.pinnedElement?.dispatchEvent(unPinEvent);

        const pinEvent = new CustomEvent(DragnDropEvents.PINNED, {
          detail: {
            element: draggedElm.value
          }
        });
        state.value.hoverElement?.dispatchEvent(pinEvent)
      }

      draggedElm.value.style.left  = "";
      draggedElm.value.style.top  = "";
      draggedElm.value.style.position = orgPosition.value;

      setState({
        state: CbrDraggableStateEnum.PINNED,
        pinnedElement: state.value.hoverElement
      });
    }
    else {
      if (state.value.pinnedElement) {
        const unpinEvent = new CustomEvent(DragnDropEvents.UNPINNED, {
          detail: {
            element: draggedElm.value
          }
        });
        state.value.pinnedElement.dispatchEvent(unpinEvent);
      }

      addToFreeArea();
      setState({
        state: CbrDraggableStateEnum.FREE
      });
    }

    draggedElm.value.style.position = orgPosition.value;
  }

  /**
   * on drag canceled event handler
   *  called when the touch is canceled by the user
   */
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

  /**
   * touch move event handler
   * @param event 
   */
  function onTouchMove(event: TouchEvent) {
    event.preventDefault();

    onDragMove(event.touches[0].clientX, event.touches[0].clientY);
  }

  /**
   * mouse move event handler
   * @param event 
   */
  function onMouseMove(event: MouseEvent) {
    event.preventDefault();

    onDragMove(event.clientX, event.clientY);
  }

  /**
   * mouse up event handler
   * @param event 
   */
  function onMouseUp(event: MouseEvent) {
    event.preventDefault()

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    onDragEnd();
  }

  /**
   * touch end event handler
   * @param event 
   */
  function onTouchEnd(event: TouchEvent) {
    event.preventDefault();

    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchCancel);

    onDragEnd();
  }

  /**
   * touch cancel event handler
   * @param event 
   */
  function onTouchCancel(event: TouchEvent) {
    event.preventDefault();

    onDragCanceled();

    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchCancel);
  }

  /**
   * mouse down event handler
   * @param event 
   */
  function onMouseDown(event: MouseEvent) {
    event.preventDefault()
    console.log('mouse down')

    onDragStart();

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  /**
   * touch start event handler
   * @param event 
   */
  function onTouchStart(event: TouchEvent) {
    event.preventDefault();

    onDragStart();

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchCancel);
  }

  /**
   * add the draggable element to the free area element
   */
  function addToFreeArea() {

    if (!freeArea.value)
      return;

    if (!draggedElm.value)
      return;

    let freeAreaParent = draggedElm.value.closest(props.freeAreaSelector);

    if (!freeAreaParent) {
      console.log('moving elmeent to free area', draggedElm.value)
      freeArea.value.appendChild(draggedElm.value);
      draggedElm.value.style.left  = "";
      draggedElm.value.style.top  = "";
      draggedElm.value.style.position = orgPosition.value;
    }
  }

</script>
