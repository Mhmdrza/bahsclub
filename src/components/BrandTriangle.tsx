// The brand spine: فروتنی · آزادی · دعوت, drawn as a triangle.
export function BrandTriangle() {
  return (
    <svg
      viewBox="0 0 520 440"
      role="img"
      aria-label="مثلث بحث‌کلاب: فروتنی، آزادی، دعوت"
      className="mx-auto w-full max-w-md"
    >
      {/* triangle face */}
      <polygon
        points="260,70 465,395 55,395"
        className="fill-accent-light stroke-border"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* medians toward the centre */}
      <g className="stroke-gold" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.45">
        <line x1="260" y1="70" x2="260" y2="287" />
        <line x1="465" y1="395" x2="260" y2="287" />
        <line x1="55" y1="395" x2="260" y2="287" />
      </g>
      <circle cx="260" cy="287" r="5" className="fill-gold" opacity="0.8" />

      {/* فروتنی — primary, top */}
      <circle cx="260" cy="70" r="50" className="stroke-gold" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="260" cy="70" r="40" className="fill-accent" />
      <text
        x="260"
        y="70"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-accent-fg text-[15px] font-bold"
      >
        فروتنی
      </text>

      {/* آزادی — bottom right */}
      <circle cx="465" cy="395" r="40" className="fill-surface stroke-border" strokeWidth="2" />
      <text
        x="465"
        y="395"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-[15px] font-bold"
      >
        آزادی
      </text>

      {/* دعوت — bottom left */}
      <circle cx="55" cy="395" r="40" className="fill-surface stroke-border" strokeWidth="2" />
      <text
        x="55"
        y="395"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-[15px] font-bold"
      >
        دعوت
      </text>
    </svg>
  );
}
