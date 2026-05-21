import { Heading } from '@/src/components/ui/Heading';
import i18n from '@/src/lib/i18n';
import { BrushCleaning } from 'lucide-react';

export const NoData = () => {
  return (
    <div className= 'flex-1 flex flex-col justify-center items-center gap-6 w-full p-18 border-2 border-dashed border-slate-200 rounded-2xl'>
      <BrushCleaning
        className= 'text-slate-300'
        size= { 64 }
        strokeWidth= { 1 }
      />
      <Heading
        level= { 3 }
        className= 'text-center font-medium text-slate-300'
      >
        { i18n.t( $ => $.global.noData ) }
      </Heading>
    </div>
  );
};
