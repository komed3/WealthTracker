import { motion } from 'motion/react';

import { cn } from '@/src/lib/utils';
import type { LoadingProps } from '@/src/types/props';

export const Loading = ( { className }: LoadingProps ) => {
  return (
    <motion.div
      initial= { { opacity: 0 } }
      animate= { { opacity: 1 } }
      exit= { { opacity: 0 } }
      transition= { { duration: 0.15, ease: 'easeOut' } }
      className= { cn(
        'fixed inset-0 z-50 flex justify-center items-center bg-white/40 backdrop-blur-xs',
        className
      ) }
    >
      <div className= 'relative w-10 h-10'>
        <div className= 'absolute inset-0 rounded-full border-3 border-primary border-t-transparent animate-spin' />
      </div>
    </motion.div>
  );
};
