import React, { useState, useRef, useEffect } from 'react';


const DEFAULT_PRESETS = [
    '#002b36', '#073642', '#586e75', '#657b83', '#839496', '#93a1a1',
    '#b58900', '#cb4b16', '#dc322f', '#d33682', '#6c71c4', '#268bd2',
    '#2aa198', '#859900', '#ffffff', '#000000'
];

export const ColorPicker = ({
    value = '#cb4b16',
    onChange,
    presetColors = DEFAULT_PRESETS,
    label,
    disabled = false,
    cssProp
}) => {
    const [color, setColor] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [hexInput, setHexInput] = useState(value.toUpperCase());
    const popoverRef = useRef(null);

    // Synchronisation avec la prop `value` externe
    useEffect(() => {
        setColor(value);
        setHexInput(value.toUpperCase());
    }, [value]);

    // Fermeture du popover au clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, popoverRef]);

    const updateColor = (newColor) => {
        setColor(newColor);
        setHexInput(newColor.toUpperCase());
        if (onChange) {
            onChange(cssProp, newColor);
        }
    };

    const handleHexInputChange = (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) {
            val = '#' + val;
        }
        setHexInput(val.toUpperCase());

        // Validation du format Hex (#RGB ou #RRGGBB)
        if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
            setColor(val);
            if (onChange) {
                onChange(cssProp, val);
            }
        }
    };

    // Utilisation de l'API EyeDropper si supportée par le navigateur
    const handleEyeDropper = async () => {
        if ('EyeDropper' in window) {
            try {
                const eyeDropper = new window.EyeDropper();
                const result = await eyeDropper.open();
                updateColor(result.sRGBHex);
            } catch (e) {
                // L'utilisateur a annulé la sélection
                console.log(e)
            }
        }
    };

    const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', position: 'relative', fontFamily: 'sans-serif' }}>
            {label && (
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#839496' }}>
                    {label}
                </label>
            )}

            {/* Bouton d'activation / Aperçu */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    backgroundColor: '#002b36',
                    border: '1px solid #586e75',
                    borderRadius: '6px',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    color: '#eee8d5',
                    fontSize: '14px',
                    outline: 'none',
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <span
                    style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        backgroundColor: color,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                />
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{color.toUpperCase()}</span>
            </button>

            {/* Popover du sélecteur */}
            {isOpen && (
                <div
                    ref={popoverRef}
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '8px',
                        zIndex: 1000,
                        width: '240px',
                        padding: '14px',
                        backgroundColor: '#073642',
                        border: '1px solid #586e75',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}
                >
                    {/* Grille de couleurs prédéfinies */}
                    <div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#586e75', fontWeight: 700, marginBottom: '8px' }}>
                            Couleurs suggérées
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px' }}>
                            {presetColors.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => updateColor(preset)}
                                    title={preset}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '4px',
                                        backgroundColor: preset,
                                        border: color.toLowerCase() === preset.toLowerCase() ? '2px solid #b58900' : '1px solid rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        padding: 0,
                                        outline: 'none',
                                        transform: color.toLowerCase() === preset.toLowerCase() ? 'scale(1.15)' : 'scale(1)',
                                        transition: 'transform 0.1s ease',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Saisie Hexadécimale et Pipette */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input
                                type="text"
                                value={hexInput}
                                onChange={handleHexInputChange}
                                maxLength={7}
                                placeholder="#000000"
                                style={{
                                    width: '100%',
                                    padding: '6px 10px',
                                    backgroundColor: '#002b36',
                                    border: '1px solid #586e75',
                                    borderRadius: '4px',
                                    color: '#839496',
                                    fontFamily: 'monospace',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        {hasEyeDropper && (
                            <button
                                type="button"
                                onClick={handleEyeDropper}
                                title="Sélecteur de couleur (Pipette)"
                                style={{
                                    padding: '6px 10px',
                                    backgroundColor: '#002b36',
                                    border: '1px solid #586e75',
                                    borderRadius: '4px',
                                    color: '#839496',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                🔍
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};