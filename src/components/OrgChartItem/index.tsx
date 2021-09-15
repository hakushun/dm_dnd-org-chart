import clsx from "clsx";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Item } from "../../hooks/useOrgTree";
import styles from "./index.module.css";

const ItemTypes = {
  CHART_ITEM: "CHART_ITEM",
} as const;

type Props = {
  id: string;
  name: string;
  children: Item[];
  hasDescendants: (children: Item[], targetId: string) => boolean;
  handleDrop: (dgarId: Item, dropId: string) => void;
};
export const OrgChartItem: React.VFC<Props> = ({
  id,
  name,
  children,
  hasDescendants,
  handleDrop,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CHART_ITEM,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => ({ id, name, children }),
  }));

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CHART_ITEM,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
    // item: drag対象. id: drop 対象のid.
    canDrop: (item: Item) =>
      // TODO: 想定通りの挙動だが動かないことがある(処理が重すぎる？)
      item.id !== id &&
      !children.some((child) => child.id === item.id) &&
      !hasDescendants(item.children, id),
    drop: (item: Item) => {
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
      handleDrop(item, id);
    },
  }));
  drag(drop(ref));

  return (
    <li className={styles.root}>
      <div
        ref={ref}
        id={id}
        className={clsx(styles.card, isDragging && styles.isDragging, canDrop && styles.canDrop)}
      >
        {name}
      </div>
      {children.length > 0 && (
        <ul className={styles.children}>
          {children.map((child) => (
            <OrgChartItem
              key={child.id}
              {...child}
              hasDescendants={hasDescendants}
              handleDrop={handleDrop}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
