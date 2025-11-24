import { styled } from 'styled-components'

export const Container = styled.div`
  width: 900px;
  margin: auto;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.bg};
  font-family: ${({ theme }) => theme.fonts.body};
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 24px;
  font-weight: 600px;
  font-size: 32px;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.text};
`;

export const AddRow = styled.div`
  display: flex;
  margin-bottom: 24px;
  gap: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 12px 14px;
  font-size: 16px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.text};

    &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
  }
  `;

export const Button = styled.button`
  padding: 12px 18px;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 500;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: 0.2s ease;

    &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: ${({ theme }) => theme.shadows.hover};
    transform: translateY(-1px);
  }
    `;

export const Columns = styled.div`
 display: flex;
 gap: 16px;
`;

export const Column = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.card};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  min-height: 350px;
`;

export const ColumnTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
`;

