import React, { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import * as Styled from "./ToDoListItemStyles";

interface ToDoListItemProps {
  id: string;
  text: string;
  done?: Boolean;
  notes?: string;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const ToDoListItem = ({ id, text, done = false, onUpdateNotes, notes }: ToDoListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(notes || "");

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
      {...attributes}
      {...listeners}
    >
      <Styled.NotesTextAndButtonContainer>
        <div>{text}</div>

        <Styled.NotesButton
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleNotesClick}
          title="Add/View Notes"
        >
          ≡
        </Styled.NotesButton>
      </Styled.NotesTextAndButtonContainer>

      {open && (
        <Styled.NotesSection
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          $done={done}
        >
          <Styled.NotesLabel>Notes:</Styled.NotesLabel>

          <Styled.NotesTextarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />

          <Styled.SaveButton onClick={handleNotesSave}>
            Save
          </Styled.SaveButton>
        </Styled.NotesSection>
      )}
    </Styled.ItemContainer>
  );
};