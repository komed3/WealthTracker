import type { ICON } from '@/src/config/constants';
import type { Breakdown, DisplaySettings, Entry, EntryRecord, YearValue } from '@/src/types/data';
import type React from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

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

export interface InfoCardProps {
  label: string;
  value: string;
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

export interface TextareaProps extends React.TextareaHTMLAttributes< HTMLTextAreaElement > {
  label?: string;
  error?: string;
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

export interface ToggleProps {
  label: string | ReactNode;
  checked: boolean;
  onChange: ( checked: boolean ) => void;
  disabled?: boolean;
  className?: string;
}

export interface CustomTooltipProps {
  label: string;
  value: string | number;
  children?: ReactNode;
  color?: string;
}

export interface yAxisFormatterProps {
  type: 'currency' | 'percent' | 'other';
  value: number;
  display: DisplaySettings;
}

export interface xAxisIntervalProps {
  value: number;
  isMobile?: boolean;
}

export interface PositionListProps {
  entries: EntryRecord[];
  onEdit: ( record: Entry ) => void;
  onDelete: ( id: string ) => void;
}

export interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: ( entryData: Omit< Entry, 'id' | 'createdAt' | 'updatedAt' > & { id?: string } ) => void;
  initialEntry: Entry | null;
}

export interface DataPointsEditorProps {
  entries: EntryRecord[];
  onUpdateHistory: ( entryId: string, history: Record< `${number}`, YearValue > ) => void;
  setActiveTab: ( id: string ) => void;
}

export interface ReportRowProps {
  key: string | number;
  label: string;
  value: number;
  percentage: number;
  display: DisplaySettings;
}

export interface ClassReportProps {
  type: 'asset' | 'liability';
  breakdown: Record< any, Breakdown | undefined >;
  display: DisplaySettings;
}
