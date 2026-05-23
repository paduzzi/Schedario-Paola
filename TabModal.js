import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../firebase';

export default function Allegati({ sectionId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, [sectionId]); // eslint-disable-line

  const load = async () => {
    try {
      const res = await listAll(ref(storage, `allegati/${sectionId}`));
      const data = await Promise.all(res.items.map(async r => ({ name: r.name, url: await getDownloadURL(r), ref: r })));
      setFiles(data);
    } catch { setFiles([]); }
  };

  const upload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10*1024*1024) { setError('File troppo grande (max 10MB)'); return; }
    setError(null); setUploading(true); setProgress(0);
    const task = uploadBytesResumable(ref(storage, `allegati/${sectionId}/${file.name}`), file);
    task.on('state_changed',
      s => setProgress(Math.round(s.bytesTransferred/s.totalBytes*100)),
      err => { setError(err.message); setUploading(false); },
      async () => { setUploading(false); setProgress(0); await load(); }
    );
  };

  const del = async (f) => {
    if (!window.confirm(`Eliminare "${f.name}"?`)) return;
    try { await deleteObject(f.ref); setFiles(p => p.filter(x => x.name !== f.name)); } catch { setError('Errore eliminazione'); }
  };

  const icon = name => { const e=name.split('.').pop().toLowerCase(); return e==='pdf'?'📄':['doc','docx'].includes(e)?'📝':['xls','xlsx'].includes(e)?'📊':['jpg','jpeg','png','gif'].includes(e)?'🖼️':'📎'; };

  return (
    <div>
      {files.length === 0 && !uploading && <p style={{color:'var(--ink3)',fontSize:12,fontStyle:'italic',marginBottom:8}}>Nessun allegato ancora</p>}
      {files.map(f => (
        <div key={f.name} className="allegati-row">
          <span>{icon(f.name)}</span>
          <a href={f.url} target="_blank" rel="noopener noreferrer">{f.name}</a>
          <button className="icon-btn danger" onClick={() => del(f)} title="Elimina">🗑</button>
        </div>
      ))}
      {uploading && <div className="progress-bar"><div className="progress-fill" style={{width:progress+'%'}} /></div>}
      {error && <p style={{fontSize:11,color:'var(--danger)',margin:'4px 0'}}>{error}</p>}
      <label className="upload-label">
        📎 Allega file
        <input type="file" style={{display:'none'}} onChange={upload} disabled={uploading}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.csv" />
      </label>
      <p style={{fontSize:10,color:'var(--ink3)',marginTop:4}}>PDF, Word, Excel, immagini – max 10MB</p>
    </div>
  );
}
