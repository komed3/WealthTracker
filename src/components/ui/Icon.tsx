import * as LucideIcons from 'lucide-react';

import { IconProps } from '@/src/types/props';

export const Icon = ( { name, size = 20, className }: IconProps ) => {
  const LucideIcon = ( LucideIcons as any )[ name ] || LucideIcons.HelpCircle;

  if ( ! LucideIcon ) return <div style= { { width: size, height: size } } className= { className } />;
  return <LucideIcon size= { size } className= { className } />;
};
