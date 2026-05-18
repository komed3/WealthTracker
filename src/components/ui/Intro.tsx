import { cn } from '@/src/lib/utils';
import { Heading } from '@/src/components/ui/Heading';
import type { IntroProps } from '@/src/types/props';

export const Intro = ( { title, description, className }: IntroProps ) => {
  return (
    <div className= { cn( 'relative flex flex-col gap-1.5', className ) }>
      <Heading level= { 1 }>
        { title }
      </Heading>
      { description && (
        <p className= 'text-base leading-relaxed text-slate-500'>
          { description }
        </p>
      ) }
    </div>
  );
};
