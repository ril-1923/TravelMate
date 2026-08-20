import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  variant: string;
  icon: ReactNode;
}

export default function DashboardCard({ title, value, subtitle, variant, icon }: DashboardCardProps) {
  return (
    <div className="card tm-stat-card h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`tm-stat-icon tm-variant-${variant}`}>{icon}</div>
        <div className="flex-grow-1">
          <div className="tm-stat-label">{title}</div>
          <div className="tm-stat-value">{value}</div>
          {subtitle && <div className="tm-stat-sub">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}
