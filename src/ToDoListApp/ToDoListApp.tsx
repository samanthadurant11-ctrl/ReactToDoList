import React, { useEffect, useState } from "react";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, useDroppable } from "@dnd-kit/core";

import { verticalListSortingStrategy, arrayMove, SortableContext } from "@dnd-kit/sortable";

import * as Styled from "./ToDoListAppStyles";
import { ToDoListItem } from "./ToDoListItem/ToDoListItem";


export interface ToDoItem {
  id: string;
  text: string;
  notes?: string
}

interface DroppableColumnProps {
  id: string;
  title: string;
  items: ToDoItem[];
  isDone: boolean;
  onUpdateNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, items, isDone, onUpdateNotes, onDelete, onUpdateText }) => {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <Styled.Column ref={setNodeRef}>
      <Styled.ColumnTitle>{title}</Styled.ColumnTitle>
      {items.map((item) => (
        <ToDoListItem 
          key={item.id} 
          id={item.id} 
          text={item.text} 
          done={isDone} 
          notes={item.notes} 
          onUpdateNotes={onUpdateNotes} 
          onDelete={onDelete} 
          onUpdateText={onUpdateText} 
        />
      ))}
    </Styled.Column>
  );
};

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
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromColumn = toDo.some((t) => t.id === activeId) ? "toDo" : "done";
    let toColumn: "toDo" | "done";
    
    // Determine target column based on what we're dropping over
    if (overId === "done-column") {
      toColumn = "done";
    } else if (overId === "toDo-column") {
      toColumn = "toDo";
    } else {
      toColumn = toDo.some((t) => t.id === overId) ? "toDo" : "done";
    }

    // move within same column
    if (fromColumn === toColumn) {
      const list = fromColumn === "toDo" ? toDo : done;
      const oldIndex = list.findIndex((item) => item.id === activeId);
      const newIndex = list.findIndex((item) => item.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedList = arrayMove(list, oldIndex, newIndex);
      fromColumn === "toDo" ? setToDo(reorderedList) : setDone(reorderedList);
      return;
    }

    // Move to different column
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
          <DroppableColumn
            id="toDo-column"
            title={`To Do (${toDo.length})`}
            items={toDo}
            isDone={false}
            onUpdateNotes={updateNotes}
            onDelete={handleDelete}
            onUpdateText={updateText}
          />
          <DroppableColumn
            id="done-column"
            title={`Done (${done.length})`}
            items={done}
            isDone={true}
            onUpdateNotes={updateNotes}
            onDelete={handleDelete}
            onUpdateText={updateText}
          />
        </SortableContext>
      </Styled.Columns>
    </DndContext>
   </Styled.Container>
  )
}


