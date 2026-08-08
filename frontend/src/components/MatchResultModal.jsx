import React from 'react';

export default function MatchResultModal({ challenge, currentUser, onClose, onRematch }) {
  if (!challenge || challenge.status !== "COMPLETED") return null;

  const isSender = challenge.senderName === currentUser.name;
  const myWpm = isSender ? challenge.senderWpm : challenge.receiverWpm;
  const opponentWpm = isSender ? challenge.receiverWpm : challenge.senderWpm;
  const opponentName = isSender ? challenge.receiverName : challenge.senderName;

  let resultText = "It's a Tie!";
  let resultColor = "#94a3b8"; 

  if (challenge.winnerName === currentUser.name) {
    resultText = "🏆 Victory!";
    resultColor = "#fbbf24"; 
  } else if (challenge.winnerName !== "TIE") {
    resultText = "💀 Defeat!";
    resultColor = "#ef4444"; 
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ color: resultColor, fontSize: '2.5rem', margin: '0 0 10px 0' }}>{resultText}</h2>
        
        <div style={styles.scoreboard}>
          <div style={styles.playerCard}>
            <h3 style={{ margin: '0 0 10px 0' }}>You</h3>
            <div style={styles.score}>{myWpm} <span style={styles.wpmLabel}>WPM</span></div>
          </div>
          
          <div style={styles.vs}>VS</div>
          
          <div style={styles.playerCard}>
            <h3 style={{ margin: '0 0 10px 0' }}>{opponentName}</h3>
            <div style={styles.score}>{opponentWpm} <span style={styles.wpmLabel}>WPM</span></div>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.closeBtn}>Back to Lobby</button>
          <button onClick={() => onRematch(opponentName, challenge.duration)} style={styles.rematchBtn}>⚔️ Rematch</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(5px)' },
  modal: { background: '#1e293b', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '2px solid #38bdf8', minWidth: '450px', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' },
  scoreboard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0' },
  playerCard: { background: '#0f172a', padding: '20px', borderRadius: '12px', flex: 1, border: '1px solid #475569' },
  vs: { fontSize: '1.5rem', fontWeight: 'bold', color: '#94a3b8', margin: '0 20px' },
  score: { fontSize: '3rem', fontWeight: 'bold', color: '#38bdf8' },
  wpmLabel: { fontSize: '1.2rem', color: '#94a3b8' },
  actions: { display: 'flex', justifyContent: 'center', gap: '15px' },
  closeBtn: { padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#475569', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' },
  rematchBtn: { padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#fbbf24', color: '#000', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }
};