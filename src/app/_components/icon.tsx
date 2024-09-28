import React from 'react';

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({ name, size = 24, color = 'currentColor' }) => (
  <span 
    className="material-symbols-outlined" 
    style={{ 
      fontSize: `${size}px`, 
      color, 
      fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48'
    }}
  >
    {name}
  </span>
);

export default MaterialIcon;
