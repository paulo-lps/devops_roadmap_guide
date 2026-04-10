import { useState, useEffect } from 'react';

export type ImportanceLevel = 'Very Important' | 'Important' | 'Normal';

export interface RoadmapItem {
  name: string;
  importance: ImportanceLevel;
  completed: boolean;
  notes?: string;
}

export interface RoadmapCategory {
  id: number;
  category: string;
  items?: RoadmapItem[];
  subcategories?: RoadmapSubcategory[];
}

export interface RoadmapSubcategory {
  name: string;
  items?: RoadmapItem[];
  subcategories?: RoadmapSubcategory[];
}

const STORAGE_KEY = 'devops-roadmap-progress-v2'; // Versão 2 para evitar conflitos com dados antigos

export function useRoadmapProgress(initialData: RoadmapCategory[]) {
  const [data, setData] = useState<RoadmapCategory[]>(initialData);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge initialData structure with saved progress to ensure new categories/items appear
          setData(parsed);
        } else {
          setData(initialData);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
        setData(initialData);
      }
    } else {
      setData(initialData);
    }
    setLoaded(true);
  }, [initialData]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, loaded]);

  const updateItemInData = (categoryId: number, itemPath: string[], updateFn: (item: RoadmapItem) => RoadmapItem) => {
    setData(prevData =>
      prevData.map(category => {
        if (category.id !== categoryId) return category;

        const updateNested = (obj: any, currentPath: string[]): any => {
          if (!obj) return obj;

          if (currentPath.length === 1) {
            return {
              ...obj,
              items: (obj.items || []).map((item: RoadmapItem) =>
                item.name === currentPath[0] ? updateFn(item) : item
              ),
            };
          }

          if (obj.subcategories && currentPath.length > 1) {
            return {
              ...obj,
              subcategories: obj.subcategories.map((sub: RoadmapSubcategory) =>
                sub.name === currentPath[0]
                  ? updateNested(sub, currentPath.slice(1))
                  : sub
              ),
            };
          }

          return obj;
        };

        return updateNested(category, itemPath);
      })
    );
  };

  const toggleItem = (categoryId: number, itemPath: string[]) => {
    updateItemInData(categoryId, itemPath, (item) => ({ ...item, completed: !item.completed }));
  };

  const updateNotes = (categoryId: number, itemPath: string[], notes: string) => {
    updateItemInData(categoryId, itemPath, (item) => ({ ...item, notes }));
  };

  const updateImportance = (categoryId: number, itemPath: string[], importance: ImportanceLevel) => {
    updateItemInData(categoryId, itemPath, (item) => ({ ...item, importance }));
  };

  const addItem = (categoryId: number, parentPath: string[], newItem: RoadmapItem) => {
    setData(prevData =>
      prevData.map(category => {
        if (category.id !== categoryId) return category;

        const addNested = (obj: any, currentPath: string[]): any => {
          if (!obj) return obj;

          if (currentPath.length === 0) {
            return {
              ...obj,
              items: [...(obj.items || []), newItem]
            };
          }

          if (currentPath.length === 1) {
            const subExists = (obj.subcategories || []).some((s: any) => s.name === currentPath[0]);
            if (subExists) {
              return {
                ...obj,
                subcategories: (obj.subcategories || []).map((sub: RoadmapSubcategory) =>
                  sub.name === currentPath[0]
                    ? { ...sub, items: [...(sub.items || []), newItem] }
                    : sub
                )
              };
            } else {
              // If subcategory doesn't exist at this level, add to items
              return {
                ...obj,
                items: [...(obj.items || []), newItem]
              };
            }
          }

          if (obj.subcategories) {
            return {
              ...obj,
              subcategories: obj.subcategories.map((sub: RoadmapSubcategory) =>
                sub.name === currentPath[0]
                  ? addNested(sub, currentPath.slice(1))
                  : sub
              )
            };
          }

          return obj;
        };

        return addNested(category, parentPath);
      })
    );
  };

  const removeItem = (categoryId: number, itemPath: string[]) => {
    setData(prevData =>
      prevData.map(category => {
        if (category.id !== categoryId) return category;

        const removeNested = (obj: any, currentPath: string[]): any => {
          if (!obj) return obj;

          if (currentPath.length === 1) {
            return {
              ...obj,
              items: (obj.items || []).filter((item: RoadmapItem) => item.name !== currentPath[0])
            };
          }

          if (obj.subcategories) {
            return {
              ...obj,
              subcategories: obj.subcategories.map((sub: RoadmapSubcategory) =>
                sub.name === currentPath[0]
                  ? removeNested(sub, currentPath.slice(1))
                  : sub
              )
            };
          }

          return obj;
        };

        return removeNested(category, itemPath);
      })
    );
  };

  const getProgress = (categoryId: number) => {
    const category = data.find(c => c.id === categoryId);
    if (!category) return { completed: 0, total: 0, percentage: 0 };

    let total = 0;
    let completed = 0;

    const countItems = (obj: any) => {
      if (!obj) return;

      if (obj.items) {
        obj.items.forEach((item: RoadmapItem) => {
          total++;
          if (item.completed) completed++;
        });
      }

      if (obj.subcategories) {
        obj.subcategories.forEach((sub: RoadmapSubcategory) => {
          countItems(sub);
        });
      }
    };

    countItems(category);

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const getOverallProgress = () => {
    let totalItems = 0;
    let completedItems = 0;

    data.forEach(category => {
      const progress = getProgress(category.id);
      totalItems += progress.total;
      completedItems += progress.completed;
    });

    return {
      completed: completedItems,
      total: totalItems,
      percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
    };
  };

  return {
    data,
    loaded,
    toggleItem,
    updateNotes,
    updateImportance,
    addItem,
    removeItem,
    getProgress,
    getOverallProgress,
  };
}
