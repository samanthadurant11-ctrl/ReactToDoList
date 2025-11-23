import { styled } from "styled-components";

export const ItemContainer = styled.div<{ $done: Boolean }>`
  padding: 14px;
  background: ${({ $done, theme }) => ($done ? "#F0F0F5" : theme.colors.card)};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 12px;
  cursor: grab;
  opacity: ${({ $done }) => ($done ? 0.6 : 1)};
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: 0.2s ease;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.hover};
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
  }
`;

export const Text = styled.div`
 font-size: 15px;
 color: ${({ theme }) => theme.colors.text};
`;

export const NotesButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 6px;
  color: ${({ theme }) => theme.colors.subtle};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const NotesSection = styled.div<{ $done: Boolean }>`
  background: ${({ $done, theme }) => ($done ? "#F0F0F5" : theme.colors.card)};
  padding-top: 12px;
  margin-top: 6px;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const NotesLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.subtle};
  margin-bottom: 6px;
`;

export const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 70px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 8px;
  font-family: inherit;
  box-sizing: border-box;
`;

export const SaveButton = styled.button`
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

export const NotesTextAndButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  `;