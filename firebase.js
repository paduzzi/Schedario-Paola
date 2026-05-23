import React, { useState, useCallback } from 'react';
import './App.css';
import { DEFAULT_SECTION_DATA } from './data/sections';
import { useFirebaseData } from './hooks/useFirebaseData';
import { useNotifications } from './hooks/useNotifications';
import HomeView from './components/HomeView';
import SectionView from './components/SectionView';
import MezziView from './components/MezziView';
import ConvenzioniView from './components/ConvenzioniView';
import TabModal from './components/TabModal';

const RINGS = Array.from({length:8});

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [search, setSearch] = useState('');
  const [editingTab, setEditingTab] = useState(null);
  const { tabs, setTabs, sectionData, setSectionData, syncing, online } = useFirebaseData();
  useNotifications(sectionData);

  const currentTab = tabs.find(t=>t.id===activeTab) || tabs[0];

  const updateSection = useCallback((id, updater) => {
    setSectionData(prev => ({ ...prev, [id]: typeof updater==='function' ? updater(prev[id]||{}) : updater }));
  }, [setSectionData]);

  const addSection = () => {
    const name = window.prompt('Nome della nuova sezione:');
    if (!name?.trim()) return;
    const colors = ['#e74c3c','#9b59b6','#3498db','#27ae60','#f39c12','#e67e22','#16a085'];
    const id = 'custom_'+Date.now();
    setTabs(prev => [...prev, { id, emoji:'📌', label:name.trim(), color:colors[Math.floor(Math.random()*colors.length)] }]);
    setSectionData(prev => ({ ...prev, [id]: { checklist:[], scadenze:[], note:'', contatti:[], blocchi:['checklist','scadenze','note','contatti','allegati'] } }));
    setActiveTab(id);
  };

  const saveTabEdit = ({ label, color }) => {
    setTabs(prev => prev.map(t => t.id===editingTab.id ? {...t,label,color} : t));
    setEditingTab(null);
  };

  const deleteTab = () => {
    setTabs(prev => prev.filter(t => t.id!==editingTab.id));
    setSectionData(prev => { const n={...prev}; delete n[editingTab.id]; return n; });
    setActiveTab('home');
    setEditingTab(null);
  };

  const needsNotif = 'Notification' in window && Notification.permission==='default';

  // Search
  const searchResults = search.trim().length > 1
    ? Object.entries(sectionData).flatMap(([sId,data]) => {
        const tab = tabs.find(t=>t.id===sId);
        if (!tab) return [];
        const q = search.toLowerCase();
        const res = [];
        (data.checklist||[]).forEach(i => { if(i.text?.toLowerCase().includes(q)) res.push({sId,tab,text:i.text,type:'todo'}); });
        (data.scadenze||[]).forEach(i => { if(i.text?.toLowerCase().includes(q)) res.push({sId,tab,text:i.text+(i.date?' – '+i.date:''),type:'scad'}); });
        (data.contatti||[]).forEach(i => { if(i.name?.toLowerCase().includes(q)) res.push({sId,tab,text:i.name+' – '+i.role,type:'contact'}); });
        return res;
      })
    : [];

  const syncClass = syncing ? 'ing' : online ? 'on' : 'off';
  const syncLabel = syncing ? '⟳ sync' : online ? '● online' : '○ offline';

  const renderContent = () => {
    if (search.trim().length > 1) return (
      <div>
        {searchResults.length===0
          ? <p style={{color:'var(--ink3)',fontSize:13,padding:'8px 0'}}>Nessun risultato per "{search}"</p>
          : searchResults.map((r,i) => (
            <div key={i} className="search-result-item" onClick={()=>{setActiveTab(r.sId);setSearch('');}}>
              <span className="search-badge" style={{background:r.tab.color+'22',color:r.tab.color}}>{r.tab.label}</span>
              <span className="search-text">{r.text}</span>
            </div>
          ))
        }
      </div>
    );

    switch(activeTab) {
      case 'home': return (
        <>
          {needsNotif && (
            <div className="notif-banner">
              <span>🔔 Abilita le notifiche per ricevere avvisi sulle scadenze</span>
              <button onClick={()=>Notification.requestPermission()}>Abilita</button>
            </div>
          )}
          <HomeView tabs={tabs} sectionData={sectionData} onNavigate={setActiveTab} />
        </>
      );
      case 'mezzi': return <MezziView data={sectionData.mezzi||{}} onChange={d=>updateSection('mezzi',d)} />;
      case 'conv':  return <ConvenzioniView data={sectionData.conv||{}} onChange={d=>updateSection('conv',d)} />;
      default: return (
        <SectionView key={activeTab} id={activeTab}
          data={sectionData[activeTab]||{checklist:[],scadenze:[],note:'',contatti:[],blocchi:['checklist','scadenze','note','contatti','allegati']}}
          onChange={d=>updateSection(activeTab,d)}
          sectionName={currentTab?.label||''}
        />
      );
    }
  };

  return (
    <div className="notebook">
      {/* SPINE */}
      <div className="spine">{RINGS.map((_,i)=><div key={i} className="ring"/>)}</div>

      {/* TABS */}
      <div className="tabs">
        {tabs.map(tab => (
          <div key={tab.id}
            className={`tab${activeTab===tab.id?' active':''}`}
            onClick={()=>{setActiveTab(tab.id);setSearch('');}}
            onDoubleClick={()=>setEditingTab(tab)}
            title="Doppio click per modificare"
          >
            <div className="tab-inner" style={{
              borderLeftColor: activeTab===tab.id ? tab.color : 'transparent',
              color: activeTab===tab.id ? tab.color : undefined,
            }}>
              <span className="tab-dot" style={{background:tab.color}} />
              {tab.label}
            </div>
          </div>
        ))}
        <div className="tab tab-add" onClick={addSection} title="Nuova sezione">
          <div className="tab-inner">＋</div>
        </div>
      </div>

      {/* PAGE */}
      <div className="page">
        <div className="page-lines" />
        <div className="page-header">
          <div className="color-bar" style={{background:currentTab?.color||'#888'}} />
          <div className="header-text">
            <div className="section-label">ASP Distretto di Parma · doppio click su linguetta per modificare</div>
            <div className="page-title">{search.trim().length>1 ? `🔍 ${search}` : `${currentTab?.emoji||''} ${currentTab?.label||''}`}</div>
          </div>
          <div className="header-right">
            <span className={`sync-pill ${syncClass}`}>{syncLabel}</span>
            <input className="search-input" placeholder="🔍 cerca..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        </div>
        <div key={activeTab+search} className="page-body">
          {renderContent()}
        </div>
      </div>

      {/* MODAL MODIFICA SEZIONE */}
      {editingTab && (
        <TabModal
          tab={editingTab}
          onSave={saveTabEdit}
          onDelete={deleteTab}
          onClose={()=>setEditingTab(null)}
        />
      )}
    </div>
  );
}
