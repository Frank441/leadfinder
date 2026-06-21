interface ScoreBadgeProps {
  score: number;
}

const colorFor = (score: number) => {
  if (score >= 80) return { text: 'var(--color-green-light)', bg: 'var(--color-green-bg)', border: 'var(--color-green-border)' };
  if (score >= 60) return { text: '#74b4ff', bg: 'rgba(61,143,224,0.13)', border: 'rgba(61,143,224,0.3)' };
  return                  { text: '#ffba55', bg: 'rgba(224,154,48,0.13)', border: 'rgba(224,154,48,0.3)' };
};

export const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  const c = colorFor(score);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: '36px',
      padding: '3px 10px',
      borderRadius: '6px',
      border: `1px solid ${c.border}`,
      background: c.bg,
      color: c.text,
      fontSize: '12px',
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {score}
    </span>
  );
};
