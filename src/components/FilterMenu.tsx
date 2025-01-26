import React, {
  useState,
  MouseEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../contexts/ThemesContext";
import { Button } from "./utils/commonStyles";
import useClickOutside from "./utils/otsideClick";
import { useSearchParams } from "react-router-dom";

export const tags = ["Work", "Private", "Studying", "Shopping"];
export const deadlines = ["1 day", "7 days", "monthly"];
export const priorities = ["low", "medium", "high"];

interface FilterMenuProps {
  setFilters: (filters: {
    tags?: string[];
    deadline?: string;
    priority?: "high" | "medium" | "low";
  }) => void;
}

const Container = styled.div`
  position: relative;
`;

const Menu = styled.div<{ $isOpen: boolean; theme: string }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  background-color: ${(props) => (props.theme === "light" ? "#fff" : "#222")};
  border: 1px solid ${(props) => (props.theme === "light" ? "#ccc" : "#444")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
  min-width: 300px;
  padding: 10px;
  right: 0;
  @media (max-width: 768px) {
    min-width: 100%;
    padding: 5px;
  }
`;

const Section = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const SectionTitle = styled.h4<{ theme: string }>`
  margin-bottom: 8px;
  font-size: 14px;
  color: ${(props) => (props.theme === "light" ? "#333" : "#fff")};
  @media (max-width: 768px) {
    margin-bottom: 3px;
    font-size: 10px;
  }
`;

const CheckboxLabel = styled.label<{ theme: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${(props) => (props.theme === "light" ? "#333" : "#ddd")};

  input {
    margin-right: 8px;
  }
  @media (max-width: 768px) {
    margin-bottom: 3px;
    font-size: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ResetButton = styled.button<{ theme: string }>`
  margin-bottom: 10px;
  padding: 8px 16px;
  border: none;
  background-color: ${(props) => (props.theme === "light" ? "#ccc" : "#555")};
  color: ${(props) => (props.theme === "light" ? "#333" : "#ddd")};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.theme === "light" ? "#bbb" : "#444")};
  }
`;

const ApplyButton = styled(ResetButton)`
  background-color: ${(props) =>
    props.theme === "light" ? "#28a745" : "#3aaf3a"};
  color: #fff;

  &:hover {
    background-color: ${(props) =>
      props.theme === "light" ? "#218838" : "#2e8a2e"};
  }
`;

const FilterMenu: React.FC<FilterMenuProps> = ({ setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const menuRef = useRef<HTMLDivElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const syncFiltersFromQuery = () => {
    const tagsParam = searchParams.get("tags");
    const deadlineParam = searchParams.get("deadline");
    const priorityParam = searchParams.get("priority");

    const newFilters = {
      tags: tagsParam ? tagsParam.split(",") : [],
      deadline: deadlineParam || "",
      priority: (priorityParam as "low" | "medium" | "high") || "",
    };

    setSelectedTags(newFilters.tags);
    setSelectedDeadline(newFilters.deadline);
    setSelectedPriority(newFilters.priority);
    setFilters(newFilters);
  };

  useEffect(() => {
    syncFiltersFromQuery();
  }, [searchParams]);

  const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setIsOpen((prev) => !prev);
  };

  const applyFilters = () => {
    const filters: Record<string, string> = {};
    if (selectedTags.length) filters.tags = selectedTags.join(",");
    if (selectedDeadline) filters.deadline = selectedDeadline;
    if (selectedPriority) filters.priority = selectedPriority;

    setSearchParams(filters);
    setFilters({
      tags: selectedTags.length ? selectedTags : undefined,
      deadline: selectedDeadline || undefined,
      priority: (selectedPriority as "high" | "medium" | "low") || undefined,
    });
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSelectedTags([]);
    setSelectedDeadline("");
    setSelectedPriority("");
    setSearchParams({});
    setFilters({});
  };

  const handleTagChange = (event: ChangeEvent<HTMLInputElement>) => {
    const tag = event.target.value;
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDeadlineClick = (value: string) => {
    setSelectedDeadline((prev) => (prev === value ? "" : value));
  };

  const handlePriorityClick = (value: string) => {
    setSelectedPriority((prev) => (prev === value ? "" : value));
  };

  useClickOutside(menuRef, () => setIsOpen(false));

  return (
    <Container ref={menuRef}>
      <Button
        $variant={theme === "light" ? "primary" : "secondary"}
        onClick={toggleMenu}
        theme={theme}
      >
        {t("filters")}
      </Button>
      <Menu $isOpen={isOpen} theme={theme}>
        <Section>
          <SectionTitle theme={theme}>{t("filterByTags")}</SectionTitle>
          {tags.map((tag) => (
            <CheckboxLabel key={tag} theme={theme}>
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={handleTagChange}
              />
              {t(`tags.${tag}`)}
            </CheckboxLabel>
          ))}
        </Section>
        <Section>
          <SectionTitle theme={theme}>{t("filterByDeadline")}</SectionTitle>
          {deadlines.map((deadline) => (
            <CheckboxLabel key={deadline} theme={theme}>
              <input
                type="radio"
                name="deadline"
                value={deadline}
                checked={selectedDeadline === deadline}
                onClick={() => handleDeadlineClick(deadline)}
              />
              {t(`deadlines.${deadline.replace(" ", "_").toLowerCase()}`)}
            </CheckboxLabel>
          ))}
        </Section>
        <Section>
          <SectionTitle theme={theme}>{t("filterByPriority")}</SectionTitle>
          {priorities.map((priority) => (
            <CheckboxLabel key={priority} theme={theme}>
              <input
                type="radio"
                name="priority"
                value={priority}
                checked={selectedPriority === priority}
                onClick={() => handlePriorityClick(priority)}
              />
              {t(`priorityOptions.${priority}`)}
            </CheckboxLabel>
          ))}
        </Section>
        <ButtonContainer>
          <ResetButton onClick={resetFilters} theme={theme}>
            {t("reset")}
          </ResetButton>
          <ApplyButton onClick={applyFilters} theme={theme}>
            {t("apply")}
          </ApplyButton>
        </ButtonContainer>
      </Menu>
    </Container>
  );
};

export default FilterMenu;
