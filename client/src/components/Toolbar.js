"use client"

const Toolbar = ({ drawingSettings, onSettingsChange, onClearCanvas }) => {
  const colors = [
    { name: "Black", value: "#1e293b" },
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
  ]

  const handleColorChange = (color) => {
    onSettingsChange((prev) => ({ ...prev, color }))
  }

  const handleStrokeWidthChange = (e) => {
    onSettingsChange((prev) => ({ ...prev, strokeWidth: Number.parseInt(e.target.value) }))
  }

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Colors</h3>
        <div className="color-palette">
          {colors.map((color) => (
            <div
              key={color.value}
              className={`color-option ${drawingSettings.color === color.value ? "active" : ""}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <h3>Stroke Width</h3>
        <input
          type="range"
          min="1"
          max="20"
          value={drawingSettings.strokeWidth}
          onChange={handleStrokeWidthChange}
          className="stroke-width-slider"
        />
        <div
          className="stroke-preview"
          style={{
            height: `${Math.max(drawingSettings.strokeWidth, 4)}px`,
            backgroundColor: drawingSettings.color,
          }}
        />
        <small style={{ color: "#64748b", fontWeight: "500" }}>{drawingSettings.strokeWidth}px</small>
      </div>

      <div className="toolbar-section">
        <button className="clear-button" onClick={onClearCanvas}>
          🗑️ Clear Canvas
        </button>
      </div>
    </div>
  )
}

export default Toolbar
