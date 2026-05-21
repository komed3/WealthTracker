import { Heading } from '@/src/components/ui/Heading';
import { cn } from '@/src/lib/utils';
import type { IntroProps } from '@/src/types/props';

export const Intro = ( { title, description, children, className }: IntroProps ) => {
  return (
    <div className= { cn( 'relative flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-6 w-full', className ) }>
      <div className= 'flex flex-col gap-1.5 min-w-0'>
        <Heading level= { 1 }>
          { title }
        </Heading>
        { description && (
          <p className= 'text-base leading-relaxed text-slate-500'>
            { description }
          </p>
        ) }
      </div>
      { children && (
        <div className= 'flex shrink-0 items-center gap-4'>
          { children }
        </div>
      ) }
    </div>
  );
};
