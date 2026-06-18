export default function TierBadge({ fix, isMissing }) {
  if (isMissing) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red/15 text-red border border-red/30">
        MISSING
      </span>
    );
  }

  const styles = {
    LOW: "bg-cyan/15 text-cyan border-cyan/30",
    MED: "bg-gold/15 text-gold border-gold/30",
    HIGH: "bg-orange/15 text-orange border-orange/30",
    CRITICAL: "bg-red/15 text-red border-red/30",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${styles[fix] || styles.LOW}`}>
      {fix}
    </span>
  );
}