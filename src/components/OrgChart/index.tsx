import React, { useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { OrgChartItem } from "../OrgChartItem";
import styles from "./index.module.css";

export type Item = {
  id: string;
  name: string;
  children: Item[];
};

type Props = {
  source: Item[];
};
export const OrgChart: React.VFC<Props> = ({ source }) => {
  const [data, setData] = useState(source);

  return (
    <DndProvider backend={HTML5Backend}>
      <ul className={styles.root}>
        {data.map((item) => (
          <OrgChartItem key={item.id} {...item} />
        ))}
      </ul>
    </DndProvider>
  );
};
