type CarIconProps = {
  color: string;
  width?: number;
  height?: number;
};

function CarIcon({ color, width = 60, height = 30 }: CarIconProps) {
  return (
    <svg viewBox="0 0 60 30" width={width} height={height} aria-hidden="true" focusable="false">
      <rect x="14" y="4" width="32" height="10" rx="2" fill={color} opacity="0.85" />
      <rect x="5" y="10" width="50" height="14" rx="3" fill={color} />
      <circle cx="16" cy="26" r="4" fill="#1e293b" />
      <circle cx="44" cy="26" r="4" fill="#1e293b" />
    </svg>
  );
}

export default CarIcon;
