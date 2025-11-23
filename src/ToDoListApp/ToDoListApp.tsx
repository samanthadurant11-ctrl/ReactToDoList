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

  // Save to localStorage whenever toDo or done changes
  useEffect(() => {
    localStorage.setItem(
      "todoData",
      JSON.stringify({ toDo, done })
    );
  }, [toDo, done]);

  const addTodo = () => {
    if (newTodo.trim() === "") return;

    const newToDoItem: ToDoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
    };

    setToDo((prevToDos) => [...prevToDos, newToDoItem]);
    setNewTodo("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const activeId = active.id as string;
    const overId = over?.id as string;

   
    const findColumn = (id: string): "toDo" | "done" | null => {
      if (toDo.find((t) => t.id === id)) return "toDo";
      if (done.find((t) => t.id === id)) return "done";
      return null;
    };

    const fromColumn = findColumn(activeId);
    const toColumn = findColumn(overId!);

    if (!fromColumn || !toColumn) return;

    // Reorder within the column
    if (fromColumn === toColumn) {
      const list = fromColumn === "toDo" ? toDo : done;

      const oldIndex = list.findIndex((item) => item.id === activeId);
      const newIndex = list.findIndex((item) => item.id === overId);

      const reorderedList = arrayMove(list, oldIndex, newIndex);

      if (fromColumn === "toDo") {
        setToDo(reorderedList);
      } else {
        setDone(reorderedList);
      }
      return;
    }

    // Move between columns
    if (fromColumn !== toColumn) {
      let fromList = [... (fromColumn === "toDo" ? toDo : done)];
      let toList = [... (toColumn === "toDo" ? toDo : done)];

      const itemIndex = fromList.findIndex((i) => i.id === activeId);
      if (itemIndex === -1) return;

      const [moved] = fromList.splice(itemIndex, 1);
      toList.unshift(moved);

      if (fromColumn === "toDo") {
        setToDo(fromList);
        setDone(toList);
      } else {
        setDone(fromList);
        setToDo(toList);
      }
    }
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

  return (
   <Styled.Container>
    <Styled.Title>To-Do List</Styled.Title>

    <Styled.AddRow>
      <Styled.Input 
        placeholder="Add new task"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
      />
      <Styled.Button onClick={addTodo}>Add</Styled.Button>
    </Styled.AddRow>

    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Styled.Columns>
        <Styled.Column>
          <Styled.ColumnTitle>To Do ({toDo.length})</Styled.ColumnTitle>
          <SortableContext items={toDo.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            {toDo.map((item) => (
              <ToDoListItem key={item.id} id={item.id} text={item.text} done={false} notes={item.notes} onUpdateNotes={updateNotes} />
            ))}
          </SortableContext>
        </Styled.Column>

        <Styled.Column>
          <Styled.ColumnTitle>Done ({done.length})</Styled.ColumnTitle>
          <SortableContext items={done.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            {done.map((item) => (
              <ToDoListItem key={item.id} id={item.id} text={item.text} done={true} notes={item.notes} onUpdateNotes={updateNotes} />
            ))}
          </SortableContext>
        </Styled.Column>
      </Styled.Columns>
    </DndContext>
   </Styled.Container>
  )
}


