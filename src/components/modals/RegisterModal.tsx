import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../contexts/ThemesContext";
import {
  ButtonContainer,
  Overlay,
  RestoreButton,
  Title,
} from "../utils/commonStyles";
import {
  LOGIN_MODAL_ID,
  REGISTER_MODAL_ID,
  useModal,
} from "../../contexts/ModalContext";
import { useAppDispatch } from "../../store/store";
import { loginApi, registerApi } from "../../features/auth/authSlice";
import { useSnackbarContext } from "../../contexts/SnackBarContext";

const ModalBox = styled.div<{ theme: string }>`
  background: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  height: auto;
  width: 90%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
  margin: 10% auto;

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

  @media (max-width: 480px) {
    padding: 15px;
    max-width: 90%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
  width: 95%;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 14px;
  margin: 5px 0 0 0;
`;

const RegisterModal = ({}) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const { closeModal } = useModal();
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const handleCancelConfirm = () => {
    closeModal(REGISTER_MODAL_ID);
    closeModal(LOGIN_MODAL_ID);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    form?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      email?: string;
      password?: string;
      name?: string;
      form?: string;
    } = {};

    if (!formData.name) {
      newErrors.name = t("Name is required");
    }

    if (!formData.email) {
      newErrors.email = t("Email is required");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("Invalid email address");
    }

    if (!formData.password) {
      newErrors.password = t("Password is required");
    } else if (!validatePassword(formData.password)) {
      newErrors.password = t(
        "Password must be at least 8 characters long, contain a number, a lowercase and an uppercase letter"
      );
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Отправка формы
      await dispatch(registerApi(formData)).unwrap();
      showMessage(t("Register success"), "success");

      handleCancelConfirm();
    } catch (error) {
      setErrors({ form: t(`${error}`) });
      showMessage(t("Registration failed"), "error");
    }
  };

  return (
    <Overlay>
      <ModalBox theme={theme}>
        <Title>{t("Register")}</Title>
        <Form onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              name="name"
              placeholder={t("Name")}
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder={t("Email")}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder={t("Password")}
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </div>
          {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
          <ButtonContainer>
            <RestoreButton theme={theme} type="submit">
              {t("Register")}
            </RestoreButton>
            <RestoreButton theme={theme} onClick={() => handleCancelConfirm()}>
              {t("Cancel")}
            </RestoreButton>
          </ButtonContainer>
        </Form>
      </ModalBox>
    </Overlay>
  );
};

export default RegisterModal;
