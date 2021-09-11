import React from "react";
import { Item } from "../OrgChart";
import styles from "./index.module.css";

type Props = {
  id: string;
  name: string;
  children: Item[];
};
export const OrgChartItem: React.VFC<Props> = ({ id, name, children }) => {
  return (
    <li id={id} className={styles.root}>
      <div className={styles.card}>{name}</div>
      {children.length > 0 && (
        <ul className={styles.children}>
          {children.map((child) => (
            <OrgChartItem key={child.id} {...child} />
          ))}
        </ul>
      )}
    </li>
  );
};
