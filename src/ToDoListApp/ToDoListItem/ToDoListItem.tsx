import React, { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import * as Styled from "./ToDoListItemStyles";

interface ToDoListItemProps {
  id: string;
  text: string;
  done?: boolean;
  notes?: string;
  onUpdateNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
}

export const ToDoListItem = ({ id, text, done = false, onUpdateNotes, notes, onDelete, onUpdateText }: ToDoListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(notes || "");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  React.useEffect(() => {
    setDraft(notes || "");
  }, [id]);

  const stopProp = (e: React.MouseEvent | React.PointerEvent) => e.stopPropagation();

  const handleEditSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const trimmed = editText.trim();
    if (trimmed.length >= 3 && trimmed.length <= 100) {
      onUpdateText(id, trimmed);
      setEditing(false);
    } else {
      setEditText(text);
      setEditing(false);
    }
  };

  const handleEditCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditText(text);
    setEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleNotesSave = () => {
    onUpdateNotes(id, draft);
    setOpen(false);
  };

  const handleNotesClick = () => {
    setOpen(!open);
  };

  return (
    <Styled.ItemContainer
      ref={setNodeRef}
      style={style}
      $done={done}
      data-id={id}
      data-column-type={done ? "done" : "toDo"}
      {...attributes}
      {...listeners}
    >
      <Styled.NotesTextAndButtonContainer>
        {editing ? (
          <Styled.EditInput
            value={editText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
            onPointerDown={stopProp}
            onMouseDown={stopProp}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              e.stopPropagation();
              if (e.key === 'Enter') handleEditSave(e as any);
              if (e.key === 'Escape') handleEditCancel(e as any);
            }}
            maxLength={100}
            placeholder="3-100 characters"
            autoFocus
          />
        ) : (
          <Styled.Text $done={done}>{text}</Styled.Text>
        )}

        {editing ? (
          <>
            <Styled.IconButton
              onPointerDown={stopProp}
              onMouseDown={stopProp}
              onClick={handleEditSave}
              title="Save"
            >
              ✓
            </Styled.IconButton>
            <Styled.IconButton
              onPointerDown={stopProp}
              onMouseDown={stopProp}
              onClick={handleEditCancel}
              title="Cancel"
            >
              ✕
            </Styled.IconButton>
          </>
        ) : (
          <Styled.ButtonsContainer>
            <Styled.IconButton
              onPointerDown={stopProp}
              onMouseDown={stopProp}
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              title="Edit item"
            >
              ✎
            </Styled.IconButton>
            <Styled.IconButton
              onPointerDown={stopProp}
              onMouseDown={stopProp}
              onClick={handleDelete}
              title="Delete item"
            >
              ✖
            </Styled.IconButton>
            <Styled.IconButton
              onPointerDown={stopProp}
              onMouseDown={stopProp}
              onClick={handleNotesClick}
              title="Add/View Notes">
              ≡
            </Styled.IconButton>
          </Styled.ButtonsContainer>
        )}
      </Styled.NotesTextAndButtonContainer>

      {open && (
        <Styled.NotesSection
          onPointerDown={stopProp}
          onMouseDown={stopProp}
          onClick={stopProp}
          $done={done}
        >
          <Styled.NotesLabel>Notes:</Styled.NotesLabel>

          <Styled.NotesTextarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={done}
          />

        {!done && (
          <Styled.SaveButton onClick={handleNotesSave}>
            Save
          </Styled.SaveButton>  
        )}

        </Styled.NotesSection>
      )}
    </Styled.ItemContainer>
  );
};