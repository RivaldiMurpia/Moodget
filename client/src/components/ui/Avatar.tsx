'use client';

import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  initials,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          inline-flex items-center justify-center
          ${sizeClasses[size]}
          ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`
              object-cover
              ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
              ${sizeClasses[size]}
            `}
          />
        ) : (
          <div
            className={`
              flex items-center justify-center
              bg-indigo-100 text-indigo-600 font-medium
              ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
              ${sizeClasses[size]}
            `}
          >
            {initials || getInitials(alt)}
          </div>
        )}
        {status && (
          <span
            className={`
              absolute bottom-0 right-0
              ${statusSizes[size]}
              ${statusColors[status]}
              rounded-full ring-2 ring-white
            `}
          />
        )}
      </div>
    </div>
  );
};

// Avatar group component
interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt: string;
    initials?: string;
  }>;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'md',
  className = '',
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          initials={avatar.initials}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            flex items-center justify-center
            bg-gray-100 text-gray-600 font-medium
            ring-2 ring-white rounded-full
            ${size === 'xs' ? 'w-6 h-6 text-xs' : ''}
            ${size === 'sm' ? 'w-8 h-8 text-sm' : ''}
            ${size === 'md' ? 'w-10 h-10 text-base' : ''}
            ${size === 'lg' ? 'w-12 h-12 text-lg' : ''}
            ${size === 'xl' ? 'w-16 h-16 text-xl' : ''}
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// Avatar with presence indicator
interface PresenceAvatarProps extends AvatarProps {
  presence: 'online' | 'offline' | 'away' | 'busy';
  presencePosition?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

export const PresenceAvatar: React.FC<PresenceAvatarProps> = ({
  presence,
  presencePosition = 'bottom-right',
  ...props
}) => {
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-left': 'top-0 left-0',
  };

  return <Avatar {...props} status={presence} />;
};

export default Avatar;
