import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'normal' | 'large';
  noBorder?: boolean;
  noShadow?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface CardStatProps {
  title: string;
  value: string | number;
  change?: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
  Stat: React.FC<CardStatProps>;
}

const Card: CardComponent = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  padding = 'normal',
  noBorder = false,
  noShadow = false,
}) => {
  const paddingStyles = {
    none: '',
    small: 'p-3',
    normal: 'p-6',
    large: 'p-8',
  };

  const borderStyle = noBorder ? '' : 'border border-gray-200';
  const shadowStyle = noShadow ? '' : 'shadow-md';

  return (
    <div
      className={`
        bg-white rounded-lg
        ${borderStyle}
        ${shadowStyle}
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <div className={`${paddingStyles[padding]} border-b border-gray-200`}>
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
    </div>
  );
};

Card.Header = function CardHeader({
  children,
  className = '',
}: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({
  children,
  className = '',
}: CardBodyProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({
  children,
  className = '',
}: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

Card.Stat = function CardStat({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  className = '',
}: CardStatProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className={className} padding="normal">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`mt-1 text-sm ${trendColors[trend]}`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}{' '}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gray-50 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
