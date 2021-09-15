import { useCallback, useState } from "react";

export type Item = {
  id: string;
  name: string;
  children: Item[];
};

export const useOrgTree = (initialState: Item[] = []) => {
  const [tree, setTree] = useState<Item[]>(initialState);

  // targetIdが子孫にいるか確認する
  const hasDescendants = (children: Item[], targetId: string) => {
    if (children.some((child) => child.id === targetId)) return true;
    for (const child of children) {
      if (child.id === targetId) return true;
      if (child.children) {
        const result = hasDescendants(child.children, targetId);
        if (result) return true;
      }
    }
    return false;
  };

  const deleteTargetItem = useCallback((items: Item[], dragItem: Item) => {
    for (const item of items) {
      if (item.children.some((child) => child.id === dragItem.id)) {
        const index = item.children.findIndex((child) => child.id === dragItem.id);
        item.children.splice(index, 1);
        return items;
      }
      deleteTargetItem(item.children, dragItem);
    }
    return items;
  }, []);

  const addTargetItem = useCallback((items: Item[], dragItem: Item, dropId: string) => {
    for (const item of items) {
      if (item.id === dropId) {
        item.children.push(dragItem);
        return items;
      }
      if (item.children.length > 0) {
        addTargetItem(item.children, dragItem, dropId);
      }
    }
    return items;
  }, []);

  const handleChange = useCallback(
    (dragItem: Item, dropId: string) => {
      const copied = [...tree];
      const deletedTree = deleteTargetItem(copied, dragItem);
      const addedTree = addTargetItem(deletedTree, dragItem, dropId);
      setTree(addedTree);
    },
    [addTargetItem, tree, deleteTargetItem]
  );

  return { tree, handleChange, hasDescendants };
};
