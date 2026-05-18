import type React, { ReactNode } from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}
