import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalBox = styled.div<{ theme: string }>`
  background: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;

  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`;
export const CloseButton = styled.button<{ theme: string }>`
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: inherit;
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  z-index: 100001;
`;

export const Title = styled.h2<{ theme: string }>`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => (theme === "dark" ? "#ffcb42" : "#333")};
  text-align: center;
  margin-bottom: 20px;
  margin: 0 auto;
`;

export const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  max-height: 600px;

  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

export const TaskItem = styled.li<{ theme: string }>`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-bottom: 16px;
  background: ${({ theme }) => (theme === "dark" ? "#3e3e3e" : "#ffffff")};
  border-radius: 12px;
  box-shadow: ${({ theme }) =>
    theme === "dark"
      ? "0 4px 8px rgba(0, 0, 0, 0.5)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) =>
      theme === "dark"
        ? "0 6px 12px rgba(0, 0, 0, 0.6)"
        : "0 4px 8px rgba(0, 0, 0, 0.2)"};
  }
`;

export const TaskTitle = styled.h3<{ theme: string }>`
  font-size: 16px;
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#333")};
  margin-bottom: 8px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const TaskDescription = styled.p<{ theme: string }>`
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => (theme === "dark" ? "#ddd" : "#555")};
  margin-bottom: 12px;
`;

export const TaskInfo = styled.div<{ theme: string }>`
  font-size: 12px;
  color: ${({ theme }) => (theme === "dark" ? "#bbb" : "#666")};
  margin-bottom: 8px;
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
  justify-content: center;
  padding-bottom: 12px;
`;

export const Tag = styled.span<{ theme: string }>`
  background: ${({ theme }) =>
    theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0"};
  color: ${({ theme }) => (theme === "dark" ? "#ffcb42" : "#333")};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: ${({ theme }) =>
    theme === "dark"
      ? "0 4px 8px rgba(0, 0, 0, 0.5)"
      : "0 2px 4px rgba(0, 0, 0, 0.2)"};
`;

export const RestoreButton = styled.button<{ theme: string }>`
  background: ${({ theme }) => (theme === "dark" ? "#ffcb42" : "#007bff")};
  color: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  border: none;
  padding: 12px 20px;
  width: 120px;

  font-size: 12px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background: ${({ theme }) => (theme === "dark" ? "#d19e3b" : "#0056b3")};
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(2px);
  }
`;
export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;
export const Button = styled.button<{
  $variant: "primary" | "secondary";
  theme: string;
}>`
  width: 100px;
  padding: 10px 20px;
  font-size: 12px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  background-color: ${({ $variant, theme }) =>
    $variant === "primary"
      ? theme === "dark"
        ? "#0056b3"
        : "#007bff"
      : theme === "dark"
      ? "#555"
      : "#6c757d"};
  color: #fff;

  &:hover {
    background-color: ${({ $variant, theme }) =>
      $variant === "primary"
        ? theme === "dark"
          ? "#004080"
          : "#0056b3"
        : theme === "dark"
        ? "#444"
        : "#5a6268"};
  }

  @media (max-width: 768px) {
    width: 90px;
    padding: 12px;
    font-size: 10px;
  }
`;
export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;

  @media (max-width: 768px) {
    padding-top: 5px;
  }
`;
