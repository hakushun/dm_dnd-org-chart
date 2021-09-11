import React from "react";
import { OrgChartItem } from "../OrgChartItem";
import styles from "./index.module.css";

export type Item = {
  id: string;
  name: string;
  children: Item[];
};

type Props = {
  data: Item[];
};
export const OrgChart: React.VFC<Props> = ({ data }) => {
  return (
    <ul className={styles.root}>
      {data.map((item) => (
        <OrgChartItem key={item.id} {...item} />
      ))}
    </ul>
  );
};
