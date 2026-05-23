import React, { useState } from 'react';

export default function Block({ title, children, defaultOpen = true, onDelete }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="block">
      <div className="block-head" onClick={() => setOpen(o => !o)}>
        <span className="block-head-title">{title}</span>
        {onDelete && (
          <button className="block-del-btn" title="Rimuovi blocco"
            onClick={e => { e.stopPropagation(); if(window.confirm('Rimuovere questo blocco?')) onDelete(); }}>
            🗑
          </button>
        )}
        <span className="block-chevron">{open ? '▾' : '▸'}</span>
      </div>
      {open && <div className="block-body">{children}</div>}
    </div>
  );
}
