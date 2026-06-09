import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-12 px-6 bg-bgdefault">
      <div className="max-w-md w-full text-center">
        
        {/* Terminal Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red mx-auto mb-8 shadow-md animate-pulse">
          <ShieldAlert size={28} />
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-textColor-primary tracking-tight mb-3">
          404: Lost in Code
        </h1>
        
        <p className="text-textColor-secondary text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          The requested page could not be located in our playbook routes. Perhaps the compiler deleted it, or it was never checked into main.
        </p>

        {/* Mock Terminal Card */}
        <div className="bg-slate-950 text-left rounded-xl border border-white/[0.08] shadow-2xl p-5 mb-8 font-mono text-[11px] leading-relaxed relative overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2.5 mb-3 select-none">
            <div className="w-2 h-2 rounded-full bg-brand-red/70" />
            <div className="w-2 h-2 rounded-full bg-brand-gold/70" />
            <div className="w-2 h-2 rounded-full bg-brand-green/70" />
            <span className="text-[9px] text-slate-600 ml-auto">playbook-router.sh</span>
          </div>

          <div className="space-y-1.5 text-slate-400">
            <p className="text-slate-500">&gt; bash route-check.sh --path {window.location.pathname}</p>
            <p className="text-brand-red">Error: HTTP_STATUS_404 (NOT_FOUND)</p>
            <p className="text-slate-500">Trace: route resolved to empty array [0 items]</p>
            <p className="text-brand-gold">Suggestion: navigate back to index catalog</p>
            <p className="text-slate-300 mt-2 flex items-center gap-1">
              <span>$ cd /tutorials</span>
              <span className="w-1.5 h-3.5 bg-primary animate-pulse inline-block" />
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-textColor-primary hover:bg-slate-800 text-white text-xs md:text-sm font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md active:scale-95 group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Go to Catalog
        </button>
      </div>
    </div>
  );
};

export default NotFound;
