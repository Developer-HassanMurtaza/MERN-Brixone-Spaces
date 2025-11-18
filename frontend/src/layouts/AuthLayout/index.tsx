import React from "react";
import styles from "./auth.module.css";
import logo from "../../assets/images/logo.png";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className={styles["auth-container"]}>
      <div className={styles["grid-container"]}>
        <div className={styles["left"]}>
          <img src={logo} alt="Brixone Spaces" className={styles["logo"]} />
        </div>
        <div className={styles["right"]}>{children}</div>
      </div>
    </div>
  );
}
