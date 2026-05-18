import type React, { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export interface LayoutProps {
  children: React.ReactNode;
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
