import { useCallback, useState } from "react";

export type Item = {
  id: string;
  name: string;
  children: Item[];
};
type Hooks = {
  tree: Item[];
  hasDescendants: (items: Item[], targetId: string) => boolean;
  handleDrop: (dragItem: Item, dropId: string) => void;
};
export const useOrgTree = (initialState: Item[] = []): Hooks => {
  const [tree, setTree] = useState<Item[]>(initialState);

  /**
   * targetId が items の子孫にいるか確認する
   * @param {Item[]} items
   * @param {string} targetId
   * @returns {boolean}
   */
  const hasDescendants = useCallback((items: Item[], targetId: string): boolean => {
    if (items.some((item) => item.id === targetId)) return true;
    for (const item of items) {
      if (item.id === targetId) return true;
      if (item.children) {
        const result = hasDescendants(item.children, targetId);
        if (result) return true;
      }
    }
    return false;
  }, []);

  /**
   * items から dragItem を削除する関数
   * @param {Item[]} items
   * @param {Item} dragItem
   * @returns {Item[]}
   */
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

  /**
   * items 内の dropId を持つ要素の children に dragItem を追加する関数
   * @param {Item[]} items
   * @param {Item} dragItem
   * @param {string} dropId
   * @returns {Item[]}
   */
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

  /**
   * drag and drop が完了されたときに発火される関数
   * @param {Item} dragItem
   * @param {string} dropId
   * @returns {void}
   */
  const handleDrop = useCallback(
    (dragItem: Item, dropId: string) => {
      const copied = [...tree];
      const deletedTree = deleteTargetItem(copied, dragItem);
      const addedTree = addTargetItem(deletedTree, dragItem, dropId);
      setTree(addedTree);
    },
    [addTargetItem, tree, deleteTargetItem]
  );

  return { tree, hasDescendants, handleDrop };
};
