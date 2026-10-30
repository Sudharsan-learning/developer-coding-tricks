/** The Developer Coding Tricks mark: a "D" drawn as a circuit trace with two nodes. */
export default function Logo({ size = 28, draw = false }: { size?: number; draw?: boolean }) {
  return (
    <svg className={`mark${draw ? " mark-draw" : ""}`} width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="7">
        <path pathLength={1} d="M40 4H50A46 46 0 0 1 50 96H4V50H22" />
        <path pathLength={1} d="M22 20V78H50A28 28 0 0 0 50 22H40" />
        <path pathLength={1} d="M22 50H42" />
        <circle pathLength={1} cx="22" cy="12" r="8" />
        <circle pathLength={1} cx="50" cy="50" r="8" />
      </g>
    </svg>
  );
}
