import React, { useEffect, useState } from "react";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";

import { verticalListSortingStrategy, arrayMove, SortableContext } from "@dnd-kit/sortable";

import * as Styled from "./ToDoListAppStyles";
import { ToDoListItem } from "./ToDoListItem/ToDoListItem";


export interface ToDoItem {
  id: string;
  text: string;
  notes?: string
}

export const ToDoListApp = () => {
  const [toDo, setToDo] = useState<ToDoItem[]>(() => {
    const saved = localStorage.getItem("todoData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.toDo || [];
      } catch (e) {
        console.error("Failed to parse localStorage data:", e);
      }
    }
    return [
      { id: "1", text: "Build todo app" },
      { id: "2", text: "Buy groceries" },
    ];
  });

  const [done, setDone] = useState<ToDoItem[]>(() => {
    const saved = localStorage.getItem("todoData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.done || [];
      } catch (e) {
        console.error("Failed to parse localStorage data:", e);
      }
    }
    return [{ id: "3", text: "Feed the cats" }];
  });

  const [newTodo, setNewTodo] = useState<string>("");

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    localStorage.setItem(
      "todoData",
      JSON.stringify({ toDo, done })
    );
  }, [toDo, done]);

  const addTodo = () => {
    const trimmed = newTodo.trim();
    if (trimmed.length < 3 || trimmed.length > 100) return;

    const newToDoItem: ToDoItem = {
      id: Date.now().toString(),
      text: trimmed,
    };

    setToDo((prevToDos) => [...prevToDos, newToDoItem]);
    setNewTodo("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromColumn = toDo.some((t) => t.id === activeId) ? "toDo" : "done";
    let toColumn = toDo.some((t) => t.id === overId) ? "toDo" : "done";

    // Detect column based on drag distance
    if (Math.abs(delta.x) > 50) {
      toColumn = delta.x > 0 ? "done" : "toDo";
    }

    // Same column - reorder
    if (fromColumn === toColumn) {
      const list = fromColumn === "toDo" ? toDo : done;
      const oldIndex = list.findIndex((item) => item.id === activeId);
      const newIndex = list.findIndex((item) => item.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedList = arrayMove(list, oldIndex, newIndex);
      fromColumn === "toDo" ? setToDo(reorderedList) : setDone(reorderedList);
      return;
    }

    // Different columns - move item
    const movedItem = (fromColumn === "toDo" ? toDo : done).find((i) => i.id === activeId);
    if (!movedItem) return;

    const newTodoList = fromColumn === "toDo" ? toDo.filter((i) => i.id !== activeId) : [...toDo];
    const newDoneList = fromColumn === "done" ? done.filter((i) => i.id !== activeId) : [...done];

    if (toColumn === "toDo") {
      newTodoList.push(movedItem);
    } else {
      newDoneList.push(movedItem);
    }

    setToDo(newTodoList);
    setDone(newDoneList);
  }

  const updateNotes = (id: string, notes: string) => {
    setToDo((prevToDos) =>
      prevToDos.map((item) =>
        item.id === id ? { ...item, notes } : item
      )
    );
    setDone((prevDone) =>
      prevDone.map((item) =>
        item.id === id ? { ...item, notes } : item
      )
    );
  }

  const updateText = (id: string, newText: string) => {
    setToDo((prevToDos) =>
      prevToDos.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
    setDone((prevDone) =>
      prevDone.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  }

  const handleDelete = (id: string) => {
    setToDo((prevToDos) => prevToDos.filter((item) => item.id !== id));
    setDone((prevDone) => prevDone.filter((item) => item.id !== id));
  }

  return (
   <Styled.Container>
    <Styled.Title>To-Do List</Styled.Title>

    <Styled.AddRow>
      <Styled.Input 
        placeholder="Add new task (3-100 characters)"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        maxLength={100}
      />
      <Styled.Button onClick={addTodo} disabled={newTodo.trim().length < 3 || newTodo.trim().length > 100}>Add</Styled.Button>
    </Styled.AddRow>

    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Styled.Columns>
        <SortableContext items={[...toDo.map((item) => item.id), ...done.map((item) => item.id)]} strategy={verticalListSortingStrategy}>
          <Styled.Column>
            <Styled.ColumnTitle>To Do ({toDo.length})</Styled.ColumnTitle>
            {toDo.map((item) => (
              <ToDoListItem key={item.id} id={item.id} text={item.text} done={false} notes={item.notes} onUpdateNotes={updateNotes} onDelete={handleDelete} onUpdateText={updateText} />
            ))}
          </Styled.Column>

          <Styled.Column>
            <Styled.ColumnTitle>Done ({done.length})</Styled.ColumnTitle>
            {done.map((item) => (
              <ToDoListItem key={item.id} id={item.id} text={item.text} done={true} notes={item.notes} onUpdateNotes={updateNotes} onDelete={handleDelete} onUpdateText={updateText} />
            ))}
          </Styled.Column>
        </SortableContext>
      </Styled.Columns>
    </DndContext>
   </Styled.Container>
  )
}


