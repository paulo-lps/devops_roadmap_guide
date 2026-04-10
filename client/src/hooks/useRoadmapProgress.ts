import { useState, useEffect } from 'react';

export interface RoadmapItem {
  name: string;
  importance: 'Very Important' | 'Important' | 'Normal';
  completed: boolean;
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

const STORAGE_KEY = 'devops-roadmap-progress';

export function useRoadmapProgress(initialData: RoadmapCategory[]) {
  const [data, setData] = useState<RoadmapCategory[]>(initialData);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
    setLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, loaded]);

  const toggleItem = (categoryId: number, itemPath: string[]) => {
    setData(prevData =>
      prevData.map(category => {
        if (category.id !== categoryId) return category;

        const updateNested = (obj: any): any => {
          if (!obj) return obj;

          if (Array.isArray(obj)) {
            return obj.map(item => updateNested(item));
          }

          if (obj.items && itemPath.length === 1) {
            return {
              ...obj,
              items: obj.items.map((item: RoadmapItem) =>
                item.name === itemPath[0]
                  ? { ...item, completed: !item.completed }
                  : item
              ),
            };
          }

          if (obj.subcategories && itemPath.length > 1) {
            return {
              ...obj,
              subcategories: obj.subcategories.map((sub: RoadmapSubcategory) =>
                sub.name === itemPath[0]
                  ? updateNested({ ...sub, items: sub.items })
                  : sub
              ),
            };
          }

          return obj;
        };

        return updateNested(category);
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

    if (category.items) {
      category.items.forEach((item: RoadmapItem) => {
        total++;
        if (item.completed) completed++;
      });
    }

    if (category.subcategories) {
      category.subcategories.forEach((sub: RoadmapSubcategory) => {
        countItems(sub);
      });
    }

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
    getProgress,
    getOverallProgress,
  };
}
