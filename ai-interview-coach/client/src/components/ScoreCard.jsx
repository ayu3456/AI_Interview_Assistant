import React from "react";

const ScoreCard = ({ label, value, accent, style }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center shadow">
      <p className="text-xs text-textSecondary">{label}</p>
      <p className={`mt-1.5 text-xl font-bold ${accent}`} style={style}>
        {value}
      </p>
    </div>
  );
};

export default ScoreCard;
