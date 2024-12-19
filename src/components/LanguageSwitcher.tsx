import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Menu, MenuItem } from "@mui/material";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang?: string) => {
    setAnchorEl(null);
    if (lang) {
      i18n.changeLanguage(lang);
    }
  };

  const currentLanguage =
    i18n.language === "ru"
      ? "Русский"
      : i18n.language === "ukr"
      ? "Українська"
      : "English";

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>
        {currentLanguage}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        keepMounted
      >
        <MenuItem onClick={() => handleClose("en")}>English</MenuItem>
        <MenuItem onClick={() => handleClose("ru")}>Русский</MenuItem>
        <MenuItem onClick={() => handleClose("ukr")}>Українська</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
