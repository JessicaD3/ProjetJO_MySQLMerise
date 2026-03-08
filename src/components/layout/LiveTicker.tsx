export default function LiveTicker() {
  return (
    <div className="live-bar">
      <div className="live-ticker">
        <div className="live-item"><span className="live-dot" /> ⚡ LIVE: Ski Alpin - Descente hommes - 1:45.32</div>
        <div className="live-item"><span className="live-dot" /> 🏅 MÉDAILLE D&apos;OR: France - Ski Alpin</div>
        <div className="live-item"><span className="live-dot" /> ⏱️ RECORD: Nouveau record olympique en patinage</div>
        <div className="live-item"><span className="live-dot" /> 🇫🇷 Alexis Pinturault en tête de la descente</div>
        <div className="live-item"><span className="live-dot" /> 🏒 Canada vs Suède: 4-2 en quart de finale</div>
      </div>
    </div>
  );
}