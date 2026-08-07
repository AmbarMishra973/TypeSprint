import React, { useState } from "react";

function ProfileModal({ user, stats, onClose }) {
  const [viewingImage, setViewingImage] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [imgSize, setImgSize] = useState({ w: 0, h: 0, natW: 0, natH: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 150 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!user) return null;

  const displayName = user.name || user.username || "User";
  const email = user.email || "No email provided";
  const initial = displayName.charAt(0).toUpperCase();
  const safeStats = stats || {};

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const rect = e.target.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    setImgSize({ w: width, h: height, natW: e.target.naturalWidth, natH: e.target.naturalHeight });
    
    // 🚀 Increased default starting size to 95% of the image
    const initialSize = Math.min(width, height) * 0.95;
    setCrop({
      size: initialSize,
      x: (width - initialSize) / 2,
      y: (height - initialSize) / 2
    });
  };

  const handlePointerDown = (e) => {
    setDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - crop.x, y: clientY - crop.y });
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    let newX = clientX - dragStart.x;
    let newY = clientY - dragStart.y;
    
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > imgSize.w - crop.size) newX = imgSize.w - crop.size;
    if (newY > imgSize.h - crop.size) newY = imgSize.h - crop.size;

    setCrop(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handlePointerUp = () => setDragging(false);

  const handleResizeSlider = (newSize) => {
    let newX = crop.x;
    let newY = crop.y;
    
    if (newX + newSize > imgSize.w) newX = imgSize.w - newSize;
    if (newY + newSize > imgSize.h) newY = imgSize.h - newSize;
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    
    setCrop({ size: newSize, x: newX, y: newY });
  };

  const handleSaveCrop = () => {
    setIsUploading(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const finalSize = 400; 
    canvas.width = finalSize;
    canvas.height = finalSize;

    const img = new Image();
    img.onload = async () => {
      const scaleX = imgSize.natW / imgSize.w;
      const scaleY = imgSize.natH / imgSize.h;
      
      ctx.drawImage(
        img,
        crop.x * scaleX, crop.y * scaleY, 
        crop.size * scaleX, crop.size * scaleY, 
        0, 0, finalSize, finalSize 
      );
      
      // 🚀 FIX: Compress the image slightly to ensure it passes Tomcat limits
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.8);

      try {
        const response = await fetch("https://ambarmishradb.onrender.com/api/auth/update-picture", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: user.name, 
            password: user.password, 
            profilePicture: croppedBase64 
          })
        });

        if (!response.ok) {
          throw new Error("Server rejected image. Ensure backend limits are updated.");
        }

        const updatedUser = await response.json();
        localStorage.setItem("typingUser", JSON.stringify(updatedUser));
        window.location.reload(); 
      } catch (err) {
        console.error("Upload error:", err);
        alert(`Upload failed: ${err.message}`);
        setIsUploading(false);
      }
    };
    img.src = preview;
  };

  if (viewingImage) {
    return (
      <div style={overlayStyle} onClick={() => setViewingImage(false)}>
        <div onClick={e => e.stopPropagation()} style={{ background: '#181a1b', padding: '20px', borderRadius: '12px', border: '1px solid var(--text-muted)', textAlign: 'center', maxWidth: '85vw', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
          <h3 style={{ margin: "0 0 15px 0" }}>Profile Photo</h3>
          <img src={user.profilePicture} alt="Full Profile" style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '8px', objectFit: 'contain' }} />
          <button onClick={() => setViewingImage(false)} style={{ width: "100%", padding: "10px", marginTop: "15px", background: 'var(--card-bg)', color: 'var(--text-main)', border: '1px solid var(--text-muted)', borderRadius: "6px", cursor: 'pointer', fontWeight: 'bold' }}>Close Image</button>
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div 
        style={{...overlayStyle, userSelect: 'none'}} 
        onMouseUp={handlePointerUp} 
        onMouseLeave={handlePointerUp} 
        onMouseMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchMove={handlePointerMove}
      >
        <div style={{...modalStyle, width: '450px'}}>
          <h2 style={{ marginBottom: "15px" }}>Crop Photo ✂️</h2>
          
          <div style={{ textAlign: 'center', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img 
                src={preview} 
                onLoad={onImageLoad} 
                style={{ maxWidth: '100%', maxHeight: '350px', display: 'block' }}
                draggable={false}
              />
              
              {imgSize.w > 0 && (
                <div 
                  onMouseDown={handlePointerDown}
                  onTouchStart={handlePointerDown}
                  style={{
                    position: 'absolute',
                    top: crop.y,
                    left: crop.x,
                    width: crop.size,
                    height: crop.size,
                    borderRadius: '50%',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
                    border: '2px solid #fff',
                    cursor: dragging ? 'grabbing' : 'grab',
                    touchAction: 'none'
                  }}
                />
              )}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "var(--text-muted)", textAlign: "left" }}>Resize Circular Box:</p>
            <input 
              type="range" 
              min="100" 
              max={Math.min(imgSize.w, imgSize.h)} 
              value={crop.size} 
              onChange={(e) => handleResizeSlider(Number(e.target.value))}
              style={{ width: "100%", cursor: "pointer" }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setPreview(null)} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid var(--text-muted)", color: "var(--text-main)", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSaveCrop} disabled={isUploading} style={{ flex: 1, padding: "10px", background: "var(--primary-accent)", color: "#000", fontWeight: "bold", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              {isUploading ? "Cropping..." : "Save Photo"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>User Profile 👤</h2>
        
        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <div 
            onClick={() => user.profilePicture && setViewingImage(true)}
            title={user.profilePicture ? "Click to view full size" : ""}
            style={{ 
              width: "80px", height: "80px", borderRadius: "50%", 
              background: "var(--primary-accent)", color: "#000", fontSize: "32px", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              margin: "0 auto 10px auto", fontWeight: "bold", overflow: "hidden",
              border: "2px solid var(--text-muted)",
              cursor: user.profilePicture ? "pointer" : "default"
            }}
          >
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initial
            )}
          </div>
          
          <label style={{ display: "inline-block", cursor: "pointer", color: "var(--primary-accent)", fontSize: "12px", fontWeight: "bold", padding: "6px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", marginBottom: "10px" }}>
             📷 Update Photo
            <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
          </label>
          
          <h3 style={{ margin: "10px 0 5px 0" }}>{displayName}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "15px" }}>{email}</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "8px", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Best WPM</p><b>{safeStats.bestWpm || 0}</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Avg WPM</p><b>{safeStats.averageWpm || 0}</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Accuracy</p><b>{safeStats.highestAccuracy || 0}%</b></div>
          <div><p style={{color: "var(--text-muted)", margin:0}}>Tests</p><b>{safeStats.totalTests || 0}</b></div>
        </div>

        <button onClick={onClose} className="restart-btn" style={{ width: "100%", padding: "10px", background: 'var(--primary-accent)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: "6px" }}>Close</button>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: '#181a1b', padding: '30px', borderRadius: '12px', width: '350px', position: 'relative', border: '1px solid var(--text-muted)', textAlign: 'center' };

export default ProfileModal;