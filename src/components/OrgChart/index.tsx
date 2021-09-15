import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { OrgChartItem } from "../OrgChartItem";
import { Item, useOrgTree } from "../../hooks/useOrgTree";
import styles from "./index.module.css";

type Props = {
  source: Item[];
};
export const OrgChart: React.VFC<Props> = ({ source }) => {
  const { tree, handleChange, hasDescendants } = useOrgTree(source);

  return (
    <DndProvider backend={HTML5Backend}>
      <ul className={styles.root}>
        {tree.map((item) => (
          <OrgChartItem
            key={item.id}
            {...item}
            handleChange={handleChange}
            hasDescendants={hasDescendants}
          />
        ))}
      </ul>
    </DndProvider>
  );
};
