import React, { useState, MouseEvent, ChangeEvent } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  Box,
} from "@mui/material";
import { basicTags, priorityOptions } from "./modals/TaskModal";

const tags = basicTags;
const deadlines = ["1 day", "7 days", "monthly"];

interface FilterMenuProps {
  setFilters: (filters: {
    tags?: string[];
    deadline?: string;
    priority?: "high" | "medium" | "low";
  }) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ setFilters }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTagChange = (event: ChangeEvent<HTMLInputElement>) => {
    const tag = event.target.value;
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDeadlineChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDeadline(event.target.value);
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as "high" | "medium" | "low";
    setSelectedPriority(value);
  };

  const applyFilters = () => {
    setFilters({
      tags: selectedTags.length ? selectedTags : undefined,
      deadline: selectedDeadline || undefined,
      priority: (selectedPriority as "high" | "medium" | "low") || undefined,
    });
    handleClose();
  };

  const resetFilters = () => {
    setSelectedTags([]);
    setSelectedDeadline("");
    setSelectedPriority("");
    setFilters({});
  };

  return (
    <div>
      <Button
        aria-controls="filter-menu"
        aria-haspopup="true"
        onMouseEnter={handleOpen}
        onClick={handleOpen}
      >
        Filters
      </Button>
      <Menu
        style={{ display: "flex", flexDirection: "row" }}
        id="filter-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ onMouseLeave: handleClose }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box display="flex" flexDirection="row" padding={2}>
          <Box flex={1} paddingBottom={2}>
            <MenuItem disabled>
              <ListItemText primary="Filter by tags" />
            </MenuItem>
            <FormGroup>
              {tags.map((tag) => (
                <FormControlLabel
                  key={tag}
                  control={
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onChange={handleTagChange}
                      value={tag}
                    />
                  }
                  label={tag}
                />
              ))}
            </FormGroup>
          </Box>

          <Box flex={1} paddingBottom={2}>
            <MenuItem disabled>
              <ListItemText primary="Filter by deadline" />
            </MenuItem>
            <RadioGroup
              value={selectedDeadline}
              onChange={handleDeadlineChange}
            >
              {deadlines.map((deadline) => (
                <FormControlLabel
                  key={deadline}
                  value={deadline}
                  control={<Radio />}
                  label={deadline}
                />
              ))}
            </RadioGroup>
          </Box>

          <Box flex={1} paddingBottom={2}>
            <MenuItem disabled>
              <ListItemText primary="Filter by priority" />
            </MenuItem>
            <RadioGroup
              value={selectedPriority}
              onChange={handlePriorityChange}
            >
              {priorityOptions.map((priority) => (
                <FormControlLabel
                  key={priority}
                  value={priority}
                  control={<Radio />}
                  label={priority}
                />
              ))}
            </RadioGroup>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" padding={2}>
          <Button onClick={resetFilters} variant="outlined" color="secondary">
            Reset
          </Button>
          <Button onClick={applyFilters} variant="contained" color="primary">
            Apply
          </Button>
        </Box>
      </Menu>
    </div>
  );
};

export default FilterMenu;
