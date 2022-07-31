import { Children, ReactElement } from 'react';

export interface FilterComponents<T = unknown> {
  (components: ReactElement | ReactElement[] | undefined, type: T): ReactElement[]
}

export const filterComponents: FilterComponents = (children, type) => {
  if (!children) return [];

  return Children.map(children, (child) => {
    if (child.type === type) {
      return child;
    }
    return null;
  }).filter(Boolean);
};
