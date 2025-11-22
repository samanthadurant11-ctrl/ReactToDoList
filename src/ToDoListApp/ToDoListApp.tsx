import React, { useState } from "react";
import styled from "styled-components";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";

import { verticalListSortingStrategy, arrayMove, SortableContext } from "@dnd-kit/sortable";

export interface ToDoItem {
  id: string;
  text: string;
}


export const ToDoListApp = () => {
  return (
    <>
      <div>
        <h1>To Do List Updated</h1>
      </div>
    </>
  )
}


