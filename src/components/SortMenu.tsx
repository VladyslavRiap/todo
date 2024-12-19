import React, { useState, MouseEvent } from "react";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

type SortMenuProps = {
  onSort: (order: "lowToHigh" | "highToLow" | "reset") => void;
};

const SortMenu: React.FC<SortMenuProps> = ({ onSort }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (order: "lowToHigh" | "highToLow" | "reset") => {
    onSort(order);
    handleMenuClose();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        padding="8px"
        sx={{
          cursor: "pointer",
          backgroundColor: "#f9f9f9",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={handleMenuOpen}
      >
        <Typography variant="body2" color="textSecondary">
          {t("sort")}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{ onMouseLeave: handleMenuClose }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem onClick={() => handleSort("lowToHigh")}>
          {t("sortLowToHigh")}
        </MenuItem>
        <MenuItem onClick={() => handleSort("highToLow")}>
          {t("sortHighToLow")}
        </MenuItem>
        <MenuItem onClick={() => handleSort("reset")}>{t("reset")}</MenuItem>
      </Menu>
    </>
  );
};

export default SortMenu;
