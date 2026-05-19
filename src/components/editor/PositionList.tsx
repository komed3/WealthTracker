import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import i18n from '@/src/lib/i18n';
import { PositionListProps } from '@/src/types/props';
import { BrushCleaning } from 'lucide-react';

export const PositionList = ( { entries, onEdit, onDelete }: PositionListProps ) => {
  return entries.length === 0 ? (
    <div className= 'flex flex-col justify-center items-center gap-6 w-full p-10 border-2 border-dashed border-slate-200 rounded-2xl'>
      <BrushCleaning size= { 42 } className= 'text-slate-300' />
      <p className= 'text-slate-500'>{ i18n.t( $ => $.editor.emptyList ) }</p>
    </div>
  ) : (
    <div className= 'flex flex-col w-full bg-white border border-slate-200 rounded-2xl overflow-hidden animate-fade-in'>
      <div className= 'overflow-x-auto'>
        <table className= 'w-full min-w-225 text-left text-sm text-slate-800 border-collapse'>
          <thead>
            <tr className= 'uppercase font-semibold text-xs text-slate-550 tracking-wider bg-slate-50 border-b border-slate-200'>
              <th className= 'px-6 py-4 whitespace-nowrap'>{ i18n.t( $ => $.editor.positions ) }</th>
              <th className= 'px-6 py-4 whitespace-nowrap'>{ i18n.t( $ => $.editor.category ) }</th>
              <th className= 'px-6 py-4 whitespace-nowrap'>{ i18n.t( $ => $.editor.class ) }</th>
              <th className= 'px-6 py-4 whitespace-nowrap'>{ i18n.t( $ => $.editor.liquidity ) }</th>
              <th className= 'px-6 py-4 whitespace-nowrap'>{ i18n.t( $ => $.editor.status ) }</th>
              <th className= 'px-6 py-4 whitespace-nowrap text-right'>{ i18n.t( $ => $.editor.actions ) }</th>
            </tr>
          </thead>
          <tbody className= 'divide-y divide-slate-200'>
            { entries.map( ( { entry } ) => (
              <tr key= { entry.id } className= 'align-middle'>
                { /** Title with Icon */ }
                <td className= 'px-6 py-4 whitespace-nowrap'>
                  <div className= 'flex items-center gap-4'>
                    <div
                      className= 'flex justify-center items-center shrink-0 w-10 h-10 text-white rounded-xl'
                      style= { { backgroundColor: entry.color } }
                    >
                      <Icon name= { entry.icon } size= { 20 } />
                    </div>
                    <span className= 'truncate font-semibold text-sm text-slate-800'>
                      { entry.title }
                    </span>
                  </div>
                </td>

                { /** Category */ }
                <td className= 'px-6 py-4 whitespace-nowrap text-slate-800'>
                  { i18n.t( $ => $.category[ entry.category as keyof typeof $.category ] ) }
                </td>

                { /** Class */ }
                <td className= 'px-6 py-4 whitespace-nowrap text-slate-800'>
                  { i18n.t( $ => ( $ as any )[ entry.category === 'asset' ? 'assetClass' : 'liabilityClass' ][ entry.class ] ) }
                </td>

                { /** Liquidity */ }
                <td className= 'px-6 py-4 whitespace-nowrap text-slate-800'>
                  { i18n.t( $ => $.liquidity[ entry.liquidity as 1 | 2 | 3 | 4 | 5 ] ) }
                </td>

                { /** Archived Status */ }
                <td className= 'px-6 py-4 whitespace-nowrap text-slate-800'>
                  { entry.archived ? i18n.t( $ => $.status.archived ) : i18n.t( $ => $.status.active ) }
                </td>

                { /** Actions */ }
                <td className= 'px-6 py-4 whitespace-nowrap text-right'>
                  <div className= 'flex justify-end items-center gap-3'>
                    <Button
                      variant= 'secondary'
                      onClick= { () => onEdit( entry ) }
                      className= 'h-10 px-4 text-sm'
                    >
                      { i18n.t( $ => $.editor.editButton ) }
                    </Button>
                    <Button
                      variant= 'secondary'
                      onClick= { () => onDelete( entry.id ) }
                      className= 'h-10 px-4 text-sm'
                    >
                      { i18n.t( $ => $.editor.deleteButton ) }
                    </Button>
                  </div>
                </td>
              </tr>
            ) ) }
          </tbody>
        </table>
      </div>
    </div>
  );
};
