import React, { useEffect, useRef, useState } from "react"
import InputField from "../InputField/InputField"
import Button from "../Button/Button"
import { mockFetch } from "../../mocks/mockFetch"
import {FormData, ServerResponse, User } from '../../mocks/types/types'
import styles from "./LoginForm.module.css"


const LoginForm: React.FC = () => {
  const formDataRef = useRef<FormData>({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(
    null
  )
  const [isRegistering, setIsRegistering] = useState<boolean>(false)
  const [users, setUsers] = useState<User[]>([
    { email: "user@example.com", password: "password123" }
  ])

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }


  useEffect(() => {
    formDataRef.current = {
      email: "",
      password: "",
    };
    setFormErrors({})
    setServerResponse(null)
  }, [isRegistering])

  const validate = (): Partial<FormData> => {
    const errors: Partial<FormData> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

    if (!formDataRef.current.email) {
      errors.email = "Email обязателен"
    } else if (!emailRegex.test(formDataRef.current.email)) {
      errors.email = "Некорректный формат email"
    }

    if (!formDataRef.current.password) {
      errors.password = "Пароль обязателен"
    } else if (formDataRef.current.password.length < 6) {
      errors.password = "Пароль должен содержать минимум 6 символов"
    }

    return errors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formDataRef.current={
      ...formDataRef.current,
      [e.target.name]: e.target.value,
    }
    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    })
    setServerResponse(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors = validate()

    if (Object.keys(errors).length) {
      setFormErrors(errors)
      return
    }

    setLoading(true)
    setFormErrors({})
    setServerResponse(null)

    try {
      const url = isRegistering ? "/register" : "/login"
      
      const response = await mockFetch(url, formDataRef.current.email, formDataRef.current.password, users, setUsers)
      const data = await response.json()
      setServerResponse({ success: true, message: data.message })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const data = await error.json()
      setServerResponse({ success: false, message: data.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginFormContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>
        {isRegistering ? "Регистрация" : "Вход в систему"}
        </h2>
        {serverResponse && (
          <div
            className={`${styles.serverResponse} ${
              serverResponse.success ? "success" : "error"
            }`}
          >
            {serverResponse.message}
          </div>
        )}
        <div className={styles.cardContent}>
        <div>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formDataRef.current.email}
            onChange={handleChange}
            placeholder="Введите ваш email"
            error={formErrors.email}
          />
        </div>
        <div className={styles.passwordField}>
          <InputField
            label="Пароль"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formDataRef.current.password}
            onChange={handleChange}
            placeholder="Введите ваш пароль"
            error={formErrors.password}
          />
          <span
            className={styles.passwordToggle}
            onClick={handleTogglePasswordVisibility}
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>
        </div>
        <div className={styles.inputAction}>
          <Button type="submit" disabled={loading}>
             {loading ? "Загрузка..." : isRegistering ? "Регистрация" : "Войти"}
          </Button>
          </div>
        <div className={styles.toggleAction}>
          {isRegistering ? (
            <p>
              Уже есть аккаунт?{" "}
              <span onClick={() => setIsRegistering(false)}>
                Войти
              </span>
            </p>
          ) : (
            <p>
              Нет аккаунта?{" "}
              <span  onClick={() => setIsRegistering(true)}>
                Зарегистрироваться
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginForm
