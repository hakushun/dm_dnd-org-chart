import React, { useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { Item } from "../OrgChart";
import styles from "./index.module.css";

type Props = {
  id: string;
  name: string;
  children: Item[];
};
export const OrgChartItem: React.VFC<Props> = ({ id, name, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // targetIdが子孫にいるか確認する
  const hasDescendants = (children: Item[], targetId: string) => {
    if (children.some((child) => child.id === id)) return true;
    for (const child of children) {
      if (child.id === targetId) return true;
      if (child.children) {
        const result = hasDescendants(child.children, targetId);
        if (result) return true;
      }
    }
    return false;
  };


  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => ({ id, name, children }),
  }));

  const [_, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: Item, monitor: DropTargetMonitor) => {
      // 同じ要素へdnd
      if (item.id === id) {
        console.log("same");
        return;
      }
      // 子から親へのdnd
      if (children.some((child) => child.id === item.id)) {
        console.log("already child");
        return;
      }
      // 親から子孫へのdnd
      if (hasDescendants(item.children, id)) {
        console.log("descendants");
        return;
      }
      console.log("drag", item.id);
      console.log("drop", id);
    },
  }));
  drag(drop(ref));

  return (
    <li className={styles.root}>
      <div
        ref={ref}
        id={id}
        className={styles.card}
        style={{ opacity: isDragging ? 0.5 : 1, border: canDrop ? "3px solid red" : "none" }}
      >
        {name}
      </div>
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
