"use client";

import styles from "./page.module.css";
import { Button } from "tamagui";

export default function Home() {
  return (
    <div className={styles.page}>
      <Button theme="red">Hello world</Button>
    </div>
  );
}
