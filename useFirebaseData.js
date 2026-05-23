import React, { useState } from 'react';
import Block from './Block';

export default function MezziView({ data, onChange }) {
  const veicoli = data.veicoli || [];
  const note = data.note || '';
  const [newVehicle, setNewVehicle] = useState('');

  const upd = patch => onChange({ ...data, ...patch });

  const updVehicle = (vId, patch) => upd({ veicoli: veicoli.map(v => v.id===vId ? {...v,...patch} : v) });
  const delVehicle = vId => { if(window.confirm('Eliminare il veicolo?')) upd({ veicoli: veicoli.filter(v => v.id!==vId) }); };

  const toggleItem = (vId, iId) => updVehicle(vId, { items: veicoli.find(v=>v.id===vId)?.items.map(i => i.id===iId?{...i,done:!i.done}:i)||[] });
  const delItem = (vId, iId) => updVehicle(vId, { items: veicoli.find(v=>v.id===vId)?.items.filter(i=>i.id!==iId)||[] });
  const addItem = (vId, text) => { if(!text.trim()) return; updVehicle(vId, { items: [...(veicoli.find(v=>v.id===vId)?.items||[]), {id:'mi_'+Date.now(),text:text.trim(),done:false}] }); };

  const addVehicle = () => {
    if (!newVehicle.trim()) return;
    upd({ veicoli: [...veicoli, { id:'v_'+Date.now(), nome:newVehicle.trim(), targa:'', items:[{id:'i1_'+Date.now(),text:'Revisione',done:false},{id:'i2_'+Date.now(),text:'Tagliando',done:false},{id:'i3_'+Date.now(),text:'Assicurazione',done:false}] }] });
    setNewVehicle('');
  };

  return (
    <>
      <Block title="🚗 Veicoli – manutenzione">
        {veicoli.map(v => <VehicleCard key={v.id} v={v} onToggle={iId=>toggleItem(v.id,iId)} onDelItem={iId=>delItem(v.id,iId)} onAddItem={t=>addItem(v.id,t)} onUpdateName={n=>updVehicle(v.id,{nome:n})} onDelete={()=>delVehicle(v.id)} />)}
        <div className="add-row" style={{marginTop:10}}>
          <input className="add-input" placeholder="aggiungi veicolo..." value={newVehicle} onChange={e=>setNewVehicle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addVehicle()} />
          <button className="add-btn" onClick={addVehicle}>+</button>
        </div>
      </Block>
      <Block title="📝 Note">
        <textarea className="note-area" placeholder="Note su guasti, officine..." value={note} onChange={e=>upd({note:e.target.value})} />
      </Block>
    </>
  );
}

function VehicleCard({ v, onToggle, onDelItem, onAddItem, onUpdateName, onDelete }) {
  const [newItem, setNewItem] = useState('');
  const done = v.items.filter(i=>i.done).length;
  return (
    <div className="vehicle-block">
      <div className="vehicle-head">
        <span>🚗</span>
        <input className="vehicle-name-input" value={v.nome} onChange={e=>onUpdateName(e.target.value)} placeholder="Nome veicolo" />
        <span style={{fontSize:10,color:'var(--ink3)'}}>{done}/{v.items.length}</span>
        <button className="icon-btn danger" title="Elimina veicolo" onClick={onDelete}>🗑</button>
      </div>
      {v.items.map(item => (
        <div key={item.id} className="check-item">
          <input type="checkbox" id={item.id} checked={item.done} onChange={()=>onToggle(item.id)} />
          <label className="check-label" htmlFor={item.id}>{item.text}</label>
          <button className="icon-btn danger" onClick={()=>onDelItem(item.id)}>🗑</button>
        </div>
      ))}
      <div className="add-row">
        <input className="add-input" placeholder="aggiungi voce..." value={newItem} onChange={e=>setNewItem(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'){onAddItem(newItem);setNewItem('');}}} />
        <button className="add-btn" onClick={()=>{onAddItem(newItem);setNewItem('');}}>+</button>
      </div>
    </div>
  );
}
