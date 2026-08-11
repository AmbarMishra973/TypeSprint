import "../styles/keyboardHeatmap.css";

function KeyboardHeatmap({ missedKeys = {} }) {
    // Standard QWERTY layout
    const layout = [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l'],
        ['z','x','c','v','b','n','m']
    ];

    // 🚀 FIXED: Safe fallback in case missedKeys is undefined or empty
    const safeMissedKeys = missedKeys || {};
    const missValues = Object.values(safeMissedKeys);
    const maxMisses = missValues.length > 0 ? Math.max(...missValues, 1) : 1;

    return (
        <div className="heatmap-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            
            <h3 className="sub-label" style={{ marginBottom: '20px', textAlign: 'center' }}>
                Weak Keys Heatmap
            </h3>

            <div className="keyboard">
                {layout.map((row, rowIndex) => (
                    <div className="keyboard-row" key={rowIndex}>
                        {row.map(key => {
                            const misses = safeMissedKeys[key] || 0;
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