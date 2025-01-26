import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../contexts/ThemesContext";
import { Button, Overlay, Title } from "../utils/commonStyles";
import {
  LOGIN_MODAL_ID,
  REGISTER_MODAL_ID,
  useModal,
} from "../../contexts/ModalContext";
import { loginApi } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../store/store";
import { useSnackbarContext } from "../../contexts/SnackBarContext";

const ModalBox = styled.div<{ theme: string }>`
  background: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const LoginModal: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const { closeModal } = useModal();
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbarContext();
  const { openModal } = useModal();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string; form?: string } = {};

    if (!formData.email) {
      newErrors.email = t("Email is required");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("Invalid email address");
    }

    if (!formData.password) {
      newErrors.password = t("Password is required");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Отправка формы
      await dispatch(loginApi(formData)).unwrap();
      showMessage(t("Login success"), "success");
      closeModal(LOGIN_MODAL_ID);
    } catch (error) {
      setErrors({ form: t(`${error}`) });
      showMessage(t(`${error}`), "error");
    }
  };

  return (
    <Overlay id="overlay">
      <ModalBox theme={theme}>
        <Title>{t("Login")}</Title>
        <Form onSubmit={handleSubmit}>
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
            <Button theme={theme} $variant="primary" type="submit">
              {t("Login")}
            </Button>
            <Button
              $variant="primary"
              onClick={() => {
                openModal(REGISTER_MODAL_ID, {});
              }}
            >
              {" "}
              {t("Register")}{" "}
            </Button>
            <Button
              theme={theme}
              $variant="secondary"
              onClick={() => closeModal(LOGIN_MODAL_ID)}
            >
              {t("Cancel")}
            </Button>
          </ButtonContainer>
        </Form>
      </ModalBox>
    </Overlay>
  );
};

export default LoginModal;
