import React, { useState } from 'react';
import Block from './Block';
import Allegati from './Allegati';
import { addToGoogleCalendar } from '../utils/calendar';

const ALL_BLOCKS = ['checklist','scadenze','note','contatti','allegati'];

export default function SectionView({ id, data, onChange, sectionName }) {
  const [newCheck, setNewCheck] = useState('');
  const [editingCheck, setEditingCheck] = useState(null);
  const [newScad, setNewScad] = useState({ text:'', date:'' });
  const [editingScad, setEditingScad] = useState(null);
  const [newContact, setNewContact] = useState({ name:'', role:'' });
  const [editingContact, setEditingContact] = useState(null);

  const checklist = data.checklist || [];
  const scadenze  = data.scadenze  || [];
  const contatti  = data.contatti  || [];
  const note      = data.note      || '';
  const blocchi   = data.blocchi   || ALL_BLOCKS;

  const upd = patch => onChange({ ...data, ...patch });

  // --- BLOCCHI ---
  const removeBlock = (b) => upd({ blocchi: blocchi.filter(x => x !== b) });
  const addBlock = (b) => { if (!blocchi.includes(b)) upd({ blocchi: [...blocchi, b] }); };
  const missingBlocks = ALL_BLOCKS.filter(b => !blocchi.includes(b));

  // --- CHECKLIST ---
  const toggleCheck = id2 => upd({ checklist: checklist.map(c => c.id===id2 ? {...c,done:!c.done} : c) });
  const addCheck = () => {
    if (!newCheck.trim()) return;
    upd({ checklist: [...checklist, { id:'c_'+Date.now(), text:newCheck.trim(), done:false }] });
    setNewCheck('');
  };
  const delCheck = id2 => upd({ checklist: checklist.filter(c => c.id!==id2) });
  const saveEditCheck = (id2, text) => {
    upd({ checklist: checklist.map(c => c.id===id2 ? {...c,text} : c) });
    setEditingCheck(null);
  };

  // --- SCADENZE ---
  const addScad = () => {
    if (!newScad.text.trim()) return;
    upd({ scadenze: [...scadenze, { id:'s_'+Date.now(), text:newScad.text.trim(), date:newScad.date, urgente:false }] });
    setNewScad({ text:'', date:'' });
  };
  const delScad = id2 => upd({ scadenze: scadenze.filter(s => s.id!==id2) });
  const saveEditScad = (id2, patch) => {
    upd({ scadenze: scadenze.map(s => s.id===id2 ? {...s,...patch} : s) });
    setEditingScad(null);
  };

  // --- CONTATTI ---
  const addContact = () => {
    if (!newContact.name.trim()) return;
    const initials = newContact.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const colors = ['#3498db','#9b59b6','#27ae60','#e74c3c','#f39c12','#16a085'];
    upd({ contatti: [...contatti, { id:'ct_'+Date.now(), initials, name:newContact.name.trim(), role:newContact.role.trim(), color:colors[Math.floor(Math.random()*colors.length)] }] });
    setNewContact({ name:'', role:'' });
  };
  const delContact = id2 => upd({ contatti: contatti.filter(c => c.id!==id2) });
  const saveEditContact = (id2, patch) => {
    upd({ contatti: contatti.map(c => {
      if (c.id!==id2) return c;
      const initials = (patch.name||c.name).split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      return {...c,...patch,initials};
    }) });
    setEditingContact(null);
  };

  return (
    <>
      {/* DA FARE */}
      {blocchi.includes('checklist') && (
        <Block title="☐ Da fare" onDelete={() => removeBlock('checklist')}>
          {checklist.map(item => (
            <div key={item.id} className="check-item">
              <input type="checkbox" id={item.id} checked={item.done} onChange={() => toggleCheck(item.id)} />
              {editingCheck === item.id ? (
                <EditInput value={item.text} onSave={v => saveEditCheck(item.id,v)} onCancel={() => setEditingCheck(null)} />
              ) : (
                <label className="check-label" htmlFor={item.id}>{item.text}</label>
              )}
              {editingCheck !== item.id && <>
                <button className="icon-btn" title="Modifica" onClick={() => setEditingCheck(item.id)}>✏️</button>
                <button className="icon-btn danger" title="Elimina" onClick={() => delCheck(item.id)}>🗑</button>
              </>}
            </div>
          ))}
          <div className="add-row">
            <input className="add-input" placeholder="aggiungi voce..." value={newCheck}
              onChange={e => setNewCheck(e.target.value)} onKeyDown={e => e.key==='Enter' && addCheck()} />
            <button className="add-btn" onClick={addCheck}>+</button>
          </div>
        </Block>
      )}

      {/* SCADENZE */}
      {blocchi.includes('scadenze') && (
        <Block title="📅 Scadenze" onDelete={() => removeBlock('scadenze')}>
          {scadenze.map(s => (
            <div key={s.id}>
              {editingScad === s.id ? (
                <ScadenzaEdit s={s} onSave={p => saveEditScad(s.id,p)} onCancel={() => setEditingScad(null)} />
              ) : (
                <div className="scad-row">
                  <span className="scad-text">{s.text}</span>
                  {s.urgente && <span className="urgent-pill">!</span>}
                  <span className="scad-date">{s.date}</span>
                  {s.date && <button className="cal-btn" onClick={() => addToGoogleCalendar({title:s.text,date:s.date,section:sectionName})}>📅 Cal</button>}
                  <button className="icon-btn" title="Modifica" onClick={() => setEditingScad(s.id)}>✏️</button>
                  <button className="icon-btn danger" title="Elimina" onClick={() => delScad(s.id)}>🗑</button>
                </div>
              )}
            </div>
          ))}
          <div className="add-row" style={{gap:4}}>
            <input className="add-input" placeholder="nuova scadenza..." value={newScad.text}
              onChange={e => setNewScad(p=>({...p,text:e.target.value}))} onKeyDown={e => e.key==='Enter'&&addScad()} style={{flex:2}} />
            <input className="add-input" placeholder="gg/mm" value={newScad.date}
              onChange={e => setNewScad(p=>({...p,date:e.target.value}))} onKeyDown={e => e.key==='Enter'&&addScad()} style={{flex:1,maxWidth:55}} />
            <button className="add-btn" onClick={addScad}>+</button>
          </div>
        </Block>
      )}

      {/* NOTE */}
      {blocchi.includes('note') && (
        <Block title="📝 Note rapide" onDelete={() => removeBlock('note')}>
          <textarea className="note-area" placeholder="Scrivi qui le tue note..." value={note}
            onChange={e => upd({note:e.target.value})} />
        </Block>
      )}

      {/* CONTATTI */}
      {blocchi.includes('contatti') && (
        <Block title="👥 Contatti" defaultOpen={contatti.length>0} onDelete={() => removeBlock('contatti')}>
          {contatti.map(c => (
            <div key={c.id} className="contact-row">
              <div className="avatar" style={{background:c.color}}>{c.initials}</div>
              {editingContact === c.id ? (
                <ContactEdit c={c} onSave={p => saveEditContact(c.id,p)} onCancel={() => setEditingContact(null)} />
              ) : (
                <>
                  <div className="contact-info">
                    <div className="contact-name">{c.name}</div>
                    <div className="contact-role">{c.role}</div>
                  </div>
                  <button className="icon-btn" title="Modifica" onClick={() => setEditingContact(c.id)}>✏️</button>
                  <button className="icon-btn danger" title="Elimina" onClick={() => delContact(c.id)}>🗑</button>
                </>
              )}
            </div>
          ))}
          <div className="add-row" style={{gap:4}}>
            <input className="add-input" placeholder="nome..." value={newContact.name}
              onChange={e => setNewContact(p=>({...p,name:e.target.value}))} style={{flex:2}} />
            <input className="add-input" placeholder="ruolo..." value={newContact.role}
              onChange={e => setNewContact(p=>({...p,role:e.target.value}))} style={{flex:2}} />
            <button className="add-btn" onClick={addContact}>+</button>
          </div>
        </Block>
      )}

      {/* ALLEGATI */}
      {blocchi.includes('allegati') && (
        <Block title="📎 Allegati" defaultOpen={false} onDelete={() => removeBlock('allegati')}>
          <Allegati sectionId={id} />
        </Block>
      )}

      {/* AGGIUNGI BLOCCO */}
      {missingBlocks.length > 0 && (
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>
          {missingBlocks.map(b => (
            <button key={b} className="add-block-btn" style={{width:'auto',padding:'5px 12px'}} onClick={() => addBlock(b)}>
              + {b}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// Inline edit components
function EditInput({ value, onSave, onCancel }) {
  const [v, setV] = useState(value);
  return (
    <>
      <input className="check-edit-input" value={v} onChange={e=>setV(e.target.value)}
        onKeyDown={e=>{if(e.key==='Enter')onSave(v);if(e.key==='Escape')onCancel();}} autoFocus />
      <button className="icon-btn" onClick={() => onSave(v)}>✓</button>
      <button className="icon-btn" onClick={onCancel}>✕</button>
    </>
  );
}

function ScadenzaEdit({ s, onSave, onCancel }) {
  const [text, setText] = useState(s.text);
  const [date, setDate] = useState(s.date||'');
  const [urgente, setUrgente] = useState(s.urgente||false);
  return (
    <div className="scad-edit-row">
      <input className="scad-edit-input" value={text} onChange={e=>setText(e.target.value)} placeholder="testo" style={{flex:2}} autoFocus />
      <input className="scad-edit-input" value={date} onChange={e=>setDate(e.target.value)} placeholder="gg/mm" style={{width:50}} />
      <label style={{fontSize:11,display:'flex',alignItems:'center',gap:3,color:'var(--ink3)'}}>
        <input type="checkbox" checked={urgente} onChange={e=>setUrgente(e.target.checked)} /> urg.
      </label>
      <button className="icon-btn" onClick={() => onSave({text,date,urgente})}>✓</button>
      <button className="icon-btn" onClick={onCancel}>✕</button>
    </div>
  );
}

function ContactEdit({ c, onSave, onCancel }) {
  const [name, setName] = useState(c.name);
  const [role, setRole] = useState(c.role||'');
  return (
    <div className="contact-edit" style={{flex:1}}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="nome" autoFocus />
      <input value={role} onChange={e=>setRole(e.target.value)} placeholder="ruolo" />
      <div style={{display:'flex',gap:4,marginTop:4}}>
        <button className="icon-btn" onClick={() => onSave({name,role})}>✓ Salva</button>
        <button className="icon-btn" onClick={onCancel}>✕</button>
      </div>
    </div>
  );
}
