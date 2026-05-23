import React, { useState } from 'react';
import { TAB_COLORS } from '../data/sections';

export default function TabModal({ tab, onSave, onDelete, onClose }) {
  const [label, setLabel] = useState(tab.label);
  const [color, setColor] = useState(tab.color);

  return (
    <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3>Modifica sezione</h3>
        <label>Nome</label>
        <input type="text" value={label} onChange={e=>setLabel(e.target.value)} autoFocus
          onKeyDown={e=>e.key==='Enter'&&onSave({label,color})} />
        <label>Colore</label>
        <div className="color-grid">
          {TAB_COLORS.map(c => (
            <div key={c} className={`color-swatch${color===c?' selected':''}`}
              style={{background:c}} onClick={()=>setColor(c)} />
          ))}
        </div>
        <div className="modal-actions">
          {tab.id !== 'home' && (
            <button className="btn btn-danger" onClick={() => { if(window.confirm('Eliminare questa sezione e tutti i suoi dati?')) onDelete(); }}>
              Elimina
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>Annulla</button>
          <button className="btn btn-primary" onClick={() => onSave({label,color})}>Salva</button>
        </div>
      </div>
    </div>
  );
}
