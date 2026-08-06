import "../styles/keyboardHeatmap.css";

function KeyboardHeatmap({ missedKeys }) {
    // Standard QWERTY layout
    const layout = [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l'],
        ['z','x','c','v','b','n','m']
    ];

    // Find the highest number of misses to scale the color intensity
    const maxMisses = Math.max(...Object.values(missedKeys), 1);

    return (
        <div className="heatmap-container">
            <h3>Weak Keys Heatmap ⌨️</h3>
            <p className="heatmap-sub">Keys highlighted in red were missed the most.</p>
            
            <div className="keyboard">
                {layout.map((row, rowIndex) => (
                    <div className="keyboard-row" key={rowIndex}>
                        {row.map(key => {
                            const misses = missedKeys[key] || 0;
                            
                            // Calculate opacity: 0 if no misses, up to 1 for the most missed key
                            const intensity = misses > 0 ? 0.3 + (misses / maxMisses) * 0.7 : 0;
                            
                            return (
                                <div 
                                    key={key} 
                                    className="key"
                                    style={{ 
                                        backgroundColor: misses > 0 ? `rgba(255, 77, 79, ${intensity})` : '#2d333b',
                                        borderColor: misses > 0 ? '#ff4d4f' : '#444c56'
                                    }}
                                    title={misses > 0 ? `Missed '${key}' ${misses} times` : `No misses`}
                                >
                                    {key}
                                    {misses > 0 && <span className="miss-count">{misses}</span>}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KeyboardHeatmap;