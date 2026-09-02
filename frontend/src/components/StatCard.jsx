import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  glowColor = 'indigo',
  badge,
}) {
  const glowMap = {
    indigo: 'border-brand-500/30 group-hover:border-brand-500/50 shadow-brand-500/10',
    cyan: 'border-cyan-500/30 group-hover:border-cyan-500/50 shadow-cyan-500/10',
    emerald: 'border-emerald-500/30 group-hover:border-emerald-500/50 shadow-emerald-500/10',
    amber: 'border-amber-500/30 group-hover:border-amber-500/50 shadow-amber-500/10',
    rose: 'border-rose-500/30 group-hover:border-rose-500/50 shadow-rose-500/10',
  };

  const iconBgMap = {
    indigo: 'bg-brand-500/15 text-brand-400 border-brand-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <div
      className={`relative p-5 rounded-2xl glass-card glass-card-hover border ${
        glowMap[glowColor] || glowMap.indigo
      } group`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              {title}
            </span>
            {badge && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-dark-750 text-slate-300 border border-white/10">
                {badge}
              </span>
            )}
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              iconBgMap[glowColor] || iconBgMap.indigo
            } group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
          {trend && (
            <div
              className={`flex items-center gap-1 font-semibold ${
                trendPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trendPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
