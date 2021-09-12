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

  // dataの中に指定したidの要素があればそれをreturn/なければundefined
  const getTargetItem = (items: Item[], targetId: string): Item | undefined => {
    for (const item of items) {
      if (item.id === targetId) return item;
      if (item.children) {
        const result = getTargetItem(item.children, targetId);
        if (result) return result;
      }
    }
    return undefined;
  };

  // itemに親となるitem(drop先)
  // targetIdに子どもであるか確かめたいitemのid(drag元)
  const isChild = (item: Item | undefined, targetId: string) => {
    if (!item) return false;
    return item.children.some((child) => child.id === targetId);
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => ({ id }),
  }));

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: "CARD",
    collect: (monitor) => ({
      // ここでisChild関数
      canDrop: monitor.canDrop(),
    }),
    drop: (item, monitor: DropTargetMonitor) => {
      if (item.id === id) return;
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
