import { StatCardProps } from '../types.ts';

export default function StatCard ( { label, value, icon, color }: StatCardProps ) {
    return (
        <div className="bg-white p-5 rounded-xl border border-brand-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className={ `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}` }>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-base font-mono font-bold text-brand-900 truncate">{value}</p>
            </div>
        </div>
    );
}
