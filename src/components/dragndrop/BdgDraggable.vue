/**
  * Draggable component
  *
  * @requires vuejs v3.5.5
  * @slot default
  * @prop {string} dropAreaClass - class name of drop area
  */

<template>
  <div @mousedown="onMouseDown" ref="draggableContent">
    <slot ></slot>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">

  import { useTemplateRef } from 'vue'
  import { DragnDropEvents } from '@components/dragndrop/BdgDragndropTypes'

  let elm: HTMLElement | null = null
  let currentDropArea: Element | null = null
  let orgPosition = ''

  const slotRef = useTemplateRef('draggableContent')
  const props = defineProps<
    {
      dropAreaClass: string
    }>()

  const dropAreaClassSelector = `.${props.dropAreaClass}`

  function getDropElementFromPoint(x: number, y: number): Element | null {
    if (dropAreaClassSelector == '') {
      return null
    }

    let ret: Element | null = null

    if (elm) {
      elm.hidden = true
      ret = document.elementFromPoint(x, y)
      elm.hidden = false

      if (ret) {
        ret = ret.closest(dropAreaClassSelector)
      }
    }

    return ret
  }

  function onMouseMove(event: MouseEvent) {
    event.preventDefault()
    if (elm) {
      elm.style.left = `${event.clientX - elm.clientWidth / 2}px`
      elm.style.top = `${event.clientY - elm.clientHeight / 2}px`

      let dropArea = getDropElementFromPoint(event.clientX, event.clientY)

      if (dropArea !== currentDropArea) {
        if (dropArea) {
          const hoverEnterEvent = new CustomEvent(DragnDropEvents.HOVER_ENTER, {
            detail: {
              element: elm,
              preventDrop: () => {
                console.log('drop prevented');
                dropArea = null;
              }
            }
          })
          dropArea?.dispatchEvent(hoverEnterEvent)
        }
        else {
          const hoverExitEvent = new CustomEvent(DragnDropEvents.HOVER_EXIT, {
            detail: {
              element: elm
            }
          });
          currentDropArea?.dispatchEvent(hoverExitEvent)
        }

        currentDropArea = dropArea;
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

    // const dropArea = getDropElementFromPoint(event.clientX, event.clientY)
    if (currentDropArea && elm) {

      const dropEvent = new CustomEvent(DragnDropEvents.DROP, {
        detail: {
          element: elm
        }
      });
      currentDropArea.dispatchEvent(dropEvent)
      // currentDropArea.appendChild(elm)
    }

    elm.style.position = orgPosition
    elm = null
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
