import React from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import styles from "./App.module.css";

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <LoginForm />
    </div>
  );
};

export default App;
