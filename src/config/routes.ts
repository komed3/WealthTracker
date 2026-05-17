import { BookMarked, Braces, ChartColumn, ChartPie, Layers, LayoutDashboard, Sparkles } from 'lucide-react';

import i18n from '@/src/lib/i18n';

export default ( [
  { to: '/', icon: LayoutDashboard, label: i18n.t( $ => $.nav.dashboard ) },
  { to: '/momentum', icon: ChartColumn, label: i18n.t( $ => $.nav.momentum ) },
  { to: '/assets', icon: Layers, label: i18n.t( $ => $.nav.assets ) },
  { to: '/breakdown', icon: ChartPie, label: i18n.t( $ => $.nav.breakdown ) },
  { to: '/report', icon: BookMarked, label: i18n.t( $ => $.nav.report ) },
  { to: '/stats', icon: Sparkles, label: i18n.t( $ => $.nav.stats ) },
  { to: '/editor', icon: Braces, label: i18n.t( $ => $.nav.editor ) }
] ) as const;
