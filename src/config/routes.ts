import { BookMarked, Braces, ChartColumn, ChartPie, Layers, LayoutDashboard, Sparkles } from 'lucide-react';

export default [
  { to: '/', icon: LayoutDashboard, label: 'dashboard' },
  { to: '/momentum', icon: ChartColumn, label: 'momentum' },
  { to: '/assets', icon: Layers, label: 'assets' },
  { to: '/breakdown', icon: ChartPie, label: 'breakdown' },
  { to: '/report', icon: BookMarked, label: 'report' },
  { to: '/stats', icon: Sparkles, label: 'stats' },
  { to: '/editor', icon: Braces, label: 'editor' }
] as const;
