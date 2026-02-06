import { useState, useEffect } from 'react';

/**
 * RangeSlider (two-thumb)
 * - No Tailwind arbitrary selectors (e.g. [&::-webkit-slider-thumb]) to avoid JSX/build parsing issues.
 * - Uses a small <style> block for cross-browser thumb styling and pointer-events behavior.
 */
function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  initialMin = 20,
  initialMax = 80,
  onChange,
}) {
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  const [minValue, setMinValue] = useState(() => clamp(initialMin, min, max));
  const [maxValue, setMaxValue] = useState(() => clamp(initialMax, min, max));
  const [activeThumb, setActiveThumb] = useState(null); // 'min' | 'max' | null

  // Sync with props when they change
  useEffect(() => {
    const clampedMin = clamp(initialMin, min, max);
    const clampedMax = clamp(initialMax, min, max);
    setMinValue(clampedMin);
    setMaxValue(clampedMax);
  }, [initialMin, initialMax, min, max]);

  // Keep invariant: minValue <= maxValue - step
  const safeMinValue = max > 0 ? Math.min(minValue, maxValue - step) : 0;
  const safeMaxValue = max > 0 ? Math.max(maxValue, safeMinValue + step) : 0;

  // If initial values were invalid, normalize once (won't loop because derived values stabilize)
  if (max > 0 && safeMinValue !== minValue) setMinValue(safeMinValue);
  if (max > 0 && safeMaxValue !== maxValue) setMaxValue(safeMaxValue);

  const handleMinChange = (e) => {
    if (max === 0) return;
    const raw = Number(e.target.value);
    const value = Math.min(raw, maxValue - step);
    setMinValue(value);
    onChange?.({ min: value, max: maxValue });
  };

  const handleMaxChange = (e) => {
    if (max === 0) return;
    const raw = Number(e.target.value);
    const value = Math.max(raw, minValue + step);
    setMaxValue(value);
    onChange?.({ min: minValue, max: value });
  };

  const minPercent = max > 0 ? ((safeMinValue - min) / (max - min)) * 100 : 0;
  const maxPercent = max > 0 ? ((safeMaxValue - min) / (max - min)) * 100 : 0;

  // z-index: keep the currently dragged thumb above the other.
  const zMin = activeThumb === 'min' ? 30 : 20;
  const zMax = activeThumb === 'max' ? 30 : 10;

  return (
    <>
      <style>{`
        /* Base: make track click-through, thumb draggable */
        .rs-input {
          -webkit-appearance: none;
          appearance: none;
          height: 0.5rem; /* aligns with h-2 */
          background: transparent;
          width: 100%;
          pointer-events: none; /* so overlapping inputs don't block */
          position: absolute;
          left: 0;
          margin: 0;
          padding: 0;
        }

        /* WebKit thumb */
        .rs-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 1rem;
          width: 1rem;
          border-radius: 9999px;
          background: rgb(59, 130, 246); /* Tailwind blue-500 */
          cursor: pointer;
          pointer-events: auto; /* re-enable on thumb */
          border: 0;
        }

        /* Firefox thumb */
        .rs-input::-moz-range-thumb {
          height: 1rem;
          width: 1rem;
          border-radius: 9999px;
          background: rgb(59, 130, 246);
          cursor: pointer;
          pointer-events: auto;
          border: 0;
        }

        /* Remove Firefox track background so our custom track shows */
        .rs-input::-moz-range-track {
          background: transparent;
          border: 0;
        }
      `}</style>

      <div className="relative h-full">
        {/* Active range */}
        <div
          className="absolute bg-primary-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
            top: '50%',
            transform: 'translateY(-50%)',
            height: '0.5rem',
          }}
        />

        {/* MIN input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMinValue}
          onChange={handleMinChange}
          onPointerDown={() => setActiveThumb('min')}
          onPointerUp={() => setActiveThumb(null)}
          onPointerCancel={() => setActiveThumb(null)}
          disabled={max === 0}
          className="rs-input"
          style={{ zIndex: zMin, top: '50%', transform: 'translateY(-50%)' }}
          aria-label="Minimum value"
        />

        {/* MAX input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMaxValue}
          onChange={handleMaxChange}
          onPointerDown={() => setActiveThumb('max')}
          onPointerUp={() => setActiveThumb(null)}
          onPointerCancel={() => setActiveThumb(null)}
          disabled={max === 0}
          className="rs-input"
          style={{ zIndex: zMax, top: '50%', transform: 'translateY(-50%)' }}
          aria-label="Maximum value"
        />
      </div>
    </>
  );
}

export default RangeSlider;

