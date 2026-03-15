import { PageHeaderProps } from '../types';

export default function PageHeader ( { title, subtitle }: PageHeaderProps ) {
    return ( <div className="mb-6">
        <h2 className="text-2xl font-light tracking-tight text-brand-900 mb-2">{title}</h2>
        <div className="h-1 w-12 bg-brand-900 rounded-full" />
        { subtitle && <p className="text-brand-400 text-sm max-w-2xl mt-4">{subtitle}</p> }
    </div> );
}
