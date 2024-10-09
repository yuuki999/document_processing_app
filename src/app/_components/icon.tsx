import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface LucideIconProps {
  name: string;
  size?: number;
  color?: string;
}

const LucideIcon: React.FC<LucideIconProps> = ({ name, size = 24, color = 'currentColor' }) => {
  const IconComponent = (LucideIcons as any)[name] as React.ElementType | undefined;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide React`);
    return null;
  }

  return <IconComponent size={size} color={color} />;
};

export default LucideIcon;
