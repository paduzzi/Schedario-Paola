import React, { useState } from 'react';
import Block from './Block';

export default function ConvenzioniView({ data, onChange }) {
  const convenzioni = data.convenzioni || [];
  const note = data.note || '';
  const [newConv, setNewConv] = useState({ nome:'', scad:'', ref:'' });
  const [editing, setEditing] = useState(null);

  const upd = patch => onChange({ ...data, ...patch });

  const addConv = () => {
    if (!newConv.nome.trim()) return;
    upd({ convenzioni: [...convenzioni, { id:'cv_'+Date.now(), ...newConv, urgente:false }] });
    setNewConv({ nome:'', scad:'', ref:'' });
  };
  const delConv = id => { if(window.confirm('Eliminare questa convenzione?')) upd({ convenzioni: convenzioni.filter(c=>c.id!==id) }); };
  const saveEdit = (id, patch) => { upd({ convenzioni: convenzioni.map(c=>c.id===id?{...c,...patch}:c) }); setEditing(null); };
  const toggleUrgente = id => upd({ convenzioni: convenzioni.map(c=>c.id===id?{...c,urgente:!c.urgente}:c) });

  return (
    <>
      <Block title="📄 Elenco convenzioni">
        {convenzioni.map(c => (
          <div key={c.id} className="conv-row">
            {editing === c.id ? (
              <ConvEdit c={c} onSave={p=>saveEdit(c.id,p)} onCancel={()=>setEditing(null)} />
            ) : (
              <>
                <div className="conv-main">
                  <span className="conv-name">{c.nome}</span>
                  {c.urgente && <span className="urgent-pill">rinnovo</span>}
                  <span className="scad-date">{c.scad}</span>
                  <button className="icon-btn" title="Urgente" onClick={()=>toggleUrgente(c.id)} style={{opacity:c.urgente?1:0.3}}>🔴</button>
                  <button className="icon-btn" title="Modifica" onClick={()=>setEditing(c.id)}>✏️</button>
                  <button className="icon-btn danger" title="Elimina" onClick={()=>delConv(c.id)}>🗑</button>
                </div>
                {c.ref && <div className="conv-meta">Referente: {c.ref}</div>}
              </>
            )}
          </div>
        ))}
        <div className="add-row" style={{gap:4,flexWrap:'wrap'}}>
          <input className="add-input" placeholder="nome convenzione..." value={newConv.nome} onChange={e=>setNewConv(p=>({...p,nome:e.target.value}))} style={{flex:'2 1 120px'}} />
          <input className="add-input" placeholder="scadenza..." value={newConv.scad} onChange={e=>setNewConv(p=>({...p,scad:e.target.value}))} style={{flex:'1 1 70px'}} />
          <input className="add-input" placeholder="referente..." value={newConv.ref} onChange={e=>setNewConv(p=>({...p,ref:e.target.value}))} style={{flex:'1 1 90px'}} />
          <button className="add-btn" onClick={addConv}>+</button>
        </div>
      </Block>
      <Block title="📝 Note">
        <textarea className="note-area" placeholder="Note su rinnovi, iter..." value={note} onChange={e=>upd({note:e.target.value})} />
      </Block>
    </>
  );
}

function ConvEdit({ c, onSave, onCancel }) {
  const [nome, setNome] = useState(c.nome);
  const [scad, setScad] = useState(c.scad||'');
  const [ref2, setRef] = useState(c.ref||'');
  return (
    <div className="conv-edit">
      <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="nome" autoFocus />
      <input value={scad} onChange={e=>setScad(e.target.value)} placeholder="scadenza" />
      <input value={ref2} onChange={e=>setRef(e.target.value)} placeholder="referente" />
      <div style={{display:'flex',gap:4,marginTop:4}}>
        <button className="icon-btn" onClick={()=>onSave({nome,scad,ref:ref2})}>✓ Salva</button>
        <button className="icon-btn" onClick={onCancel}>✕ Annulla</button>
      </div>
    </div>
  );
}
