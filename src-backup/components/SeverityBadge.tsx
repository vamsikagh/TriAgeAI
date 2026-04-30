import type { SeverityLevel } from '../types';

interface SeverityBadgeProps {
  level: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SEVERITY_CONFIG = {
  RED: { label: 'Immediate', color: 'severity-red' },
  YELLOW: { label: 'Urgent', color: 'severity-yellow' },
  GREEN: { label: 'Delayed', color: 'severity-green' },
  BLACK: { label: 'Expectant', color: 'severity-black' },
};

export default function SeverityBadge({ level, size = 'md', showLabel = true }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[level];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span className={`${config.color} ${sizeClasses[size]} rounded-full font-bold inline-flex items-center gap-1`}>
      {showLabel && config.label}
    </span>
  );
}
