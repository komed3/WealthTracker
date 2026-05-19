import type React, { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

import type { ICON } from '@/src/config/constants';

export interface LayoutProps {
  children: React.ReactNode;
}

export interface LoadingProps {
  className?: string;
}

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ComponentType< any >;
}

export interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: ( id: string ) => void;
  className?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

export interface IntroProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export interface IconProps {
  name: ICON | string;
  size?: number;
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes< HTMLButtonElement > {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export interface InputProps extends InputHTMLAttributes< HTMLInputElement > {
  label?: string;
  error?: string;
  isCurrency?: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  value?: string | number;
  options: SelectOption[];
  onChange?: ( e: { target: { value: string } } ) => void;
  className?: string;
}

export interface PositionListProps {
  entries: EntryRecord[];
  onEdit: ( record: EntryRecord ) => void;
  onDelete: ( id: string ) => void;
}
