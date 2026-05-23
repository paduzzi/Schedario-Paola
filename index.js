*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0d0d0d;
  --cover: #111111;
  --page: #f5f0e8;
  --ink: #2a2018;
  --ink2: #5a4e3a;
  --ink3: #8a7d68;
  --line: rgba(180,160,120,0.3);
  --ring: #555;
  --accent: #d4520c;
  --danger: #c0392b;
  --tab-w: 72px;
  --font: 'Segoe UI', Arial, Helvetica, sans-serif;
}

body {
  background: var(--bg);
  min-height: 100vh;
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

#root {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* NOTEBOOK */
.notebook {
  display: flex;
  width: 100%;
  max-width: 920px;
  height: calc(100vh - 32px);
  max-height: 760px;
  border-radius: 4px 14px 14px 4px;
  box-shadow: -8px 0 0 #080808, 6px 6px 50px rgba(0,0,0,0.9);
  overflow: hidden;
}

/* SPINE */
.spine {
  width: 26px;
  background: linear-gradient(to right, #080808, #1c1c1c);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 20px 0;
  flex-shrink: 0;
}
.ring {
  width: 15px; height: 15px;
  border: 2px solid var(--ring);
  border-radius: 50%;
  background: #060606;
  flex-shrink: 0;
}
.ring::after { content:''; position:absolute; inset:4px; border-radius:50%; background:#2a2a2a; }
.ring { position: relative; }

/* TABS */
.tabs {
  width: var(--tab-w);
  background: #111;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  gap: 1px;
  overflow-y: auto;
  flex-shrink: 0;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }

.tab { cursor: pointer; flex-shrink: 0; position: relative; }
.tab-inner {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font);
  letter-spacing: 0.02em;
  padding: 12px 0;
  width: var(--tab-w);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: rgba(255,255,255,0.4);
  border-left: 3px solid transparent;
  transition: all 0.15s;
}
.tab.active .tab-inner { color: #fff; background: rgba(255,255,255,0.07); }
.tab:hover:not(.active) .tab-inner { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.03); }
.tab-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; display: block; }
.tab-add .tab-inner { color: rgba(255,255,255,0.25); font-size: 16px; }
.tab-add:hover .tab-inner { color: rgba(255,255,255,0.6); }

/* PAGE */
.page {
  flex: 1;
  background: var(--page);
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: 0 14px 14px 0;
  overflow: hidden;
  position: relative;
}
.page-lines {
  position: absolute; inset: 0; top: 54px;
  background: repeating-linear-gradient(transparent, transparent 27px, var(--line) 27px, var(--line) 28px);
  pointer-events: none; opacity: 0.45;
}

.page-header {
  background: #111;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  z-index: 2;
  position: relative;
}
.color-bar { width: 4px; height: 28px; border-radius: 2px; flex-shrink: 0; }
.header-text { flex: 1; min-width: 0; }
.section-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.3); font-family: var(--font); }
.page-title { font-size: 17px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font); }
.header-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.sync-pill { font-size: 10px; padding: 2px 7px; border-radius: 10px; font-family: var(--font); white-space: nowrap; }
.sync-pill.on  { background: rgba(39,174,96,0.15); color: #27ae60; }
.sync-pill.off { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.3); }
.sync-pill.ing { background: rgba(212,82,12,0.2); color: #d4520c; }
.search-input {
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px; padding: 5px 9px; color: #fff; font-size: 12px;
  font-family: var(--font); outline: none; width: 120px; transition: all 0.2s;
}
.search-input::placeholder { color: rgba(255,255,255,0.3); }
.search-input:focus { width: 160px; background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }

.page-body { flex: 1; overflow-y: auto; padding: 14px; position: relative; z-index: 1; }
.page-body::-webkit-scrollbar { width: 4px; }
.page-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 2px; }

/* HOME */
.home-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 480px) { .home-grid { grid-template-columns: 1fr; } }
.home-card { background: rgba(255,255,255,0.68); border: 1px solid rgba(0,0,0,0.07); border-radius: 8px; padding: 12px 14px; }
.home-card-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink3); margin-bottom: 8px; font-family: var(--font); font-weight: 600; }
.home-item { display:flex; align-items:center; gap:7px; padding:5px 0; border-bottom:1px solid rgba(0,0,0,0.05); cursor:pointer; }
.home-item:last-child { border-bottom:none; }
.home-item:hover { opacity: 0.75; }
.home-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.home-text { font-size:12px; color:var(--ink); flex:1; line-height:1.3; }
.home-badge { font-size:9px; padding:2px 5px; border-radius:3px; font-family:var(--font); flex-shrink:0; }
.home-date { font-size:10px; color:var(--ink3); flex-shrink:0; font-family:var(--font); }
.urgent-pill { font-size:9px; background:#fdecea; color:#c0392b; padding:2px 5px; border-radius:3px; font-weight:600; }

/* BLOCK */
.block { background: rgba(255,255,255,0.65); border: 1px solid rgba(0,0,0,0.07); border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
.block-head { display:flex; align-items:center; gap:8px; padding:9px 12px; cursor:pointer; user-select:none; border-bottom:1px solid rgba(0,0,0,0.05); }
.block-head:hover { background: rgba(0,0,0,0.02); }
.block-head-title { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink2); flex:1; font-family:var(--font); }
.block-chevron { color:var(--ink3); font-size:10px; }
.block-body { padding: 10px 12px; }
.block-del-btn { background:none; border:none; cursor:pointer; color:rgba(192,57,43,0.4); font-size:14px; padding:0 4px; transition:color 0.15s; }
.block-del-btn:hover { color:var(--danger); }

/* CHECKLIST */
.check-item { display:flex; align-items:center; gap:7px; padding:5px 0; border-bottom:1px solid rgba(0,0,0,0.04); }
.check-item:last-child { border-bottom:none; }
.check-item input[type=checkbox] { width:14px; height:14px; cursor:pointer; accent-color:var(--accent); flex-shrink:0; }
.check-label { font-size:13px; color:var(--ink); flex:1; font-family:var(--font); line-height:1.4; cursor:pointer; }
.check-item input:checked ~ .check-label { text-decoration:line-through; color:var(--ink3); }
.check-edit-input { font-size:13px; color:var(--ink); flex:1; border:none; border-bottom:1px solid var(--accent); background:transparent; outline:none; font-family:var(--font); padding:1px 0; }
.icon-btn { background:none; border:none; cursor:pointer; font-size:13px; padding:0 3px; opacity:0.45; transition:opacity 0.15s; flex-shrink:0; line-height:1; }
.icon-btn:hover { opacity:1; }
.icon-btn.danger:hover { color:var(--danger); opacity:1; }

.add-row { display:flex; align-items:center; gap:6px; margin-top:8px; padding-top:6px; border-top:1px dashed rgba(0,0,0,0.1); }
.add-input { flex:1; border:none; background:transparent; font-size:12px; font-family:var(--font); color:var(--ink); outline:none; padding:3px 0; }
.add-input::placeholder { color:var(--ink3); font-style:italic; }
.add-btn { background:none; border:1px solid rgba(0,0,0,0.15); border-radius:4px; cursor:pointer; font-size:14px; color:var(--ink3); padding:2px 7px; transition:all 0.15s; }
.add-btn:hover { color:var(--accent); border-color:var(--accent); }

/* NOTE */
.note-area { width:100%; min-height:80px; border:none; background:transparent; font-family:var(--font); font-size:14px; color:var(--ink); resize:vertical; outline:none; line-height:28px; }

/* SCADENZE */
.scad-row { display:flex; align-items:center; gap:6px; padding:5px 0; border-bottom:1px solid rgba(0,0,0,0.04); }
.scad-row:last-child { border-bottom:none; }
.scad-text { flex:1; font-size:12px; color:var(--ink); font-family:var(--font); }
.scad-date { font-size:11px; color:var(--ink3); flex-shrink:0; font-family:var(--font); }
.scad-edit-row { display:flex; align-items:center; gap:4px; padding:4px 0; border-bottom:1px solid rgba(0,0,0,0.04); flex-wrap:wrap; }
.scad-edit-input { border:none; border-bottom:1px solid var(--accent); background:transparent; font-size:12px; font-family:var(--font); color:var(--ink); outline:none; padding:2px 0; }
.cal-btn { background:none; border:1px solid rgba(0,0,0,0.12); border-radius:4px; cursor:pointer; font-size:10px; padding:2px 5px; color:var(--ink3); transition:all 0.15s; white-space:nowrap; font-family:var(--font); }
.cal-btn:hover { background:#4285f4; color:#fff; border-color:#4285f4; }

/* CONTACTS */
.contact-row { display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.04); }
.contact-row:last-child { border-bottom:none; }
.avatar { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:#fff; flex-shrink:0; font-family:var(--font); }
.contact-info { flex:1; min-width:0; }
.contact-name { font-size:12px; font-weight:600; color:var(--ink); font-family:var(--font); }
.contact-role { font-size:11px; color:var(--ink3); font-family:var(--font); }
.contact-edit input { display:block; width:100%; border:none; border-bottom:1px solid var(--accent); background:transparent; font-size:12px; font-family:var(--font); color:var(--ink); outline:none; margin-bottom:3px; padding:1px 0; }

/* VEHICLES */
.vehicle-block { background:rgba(0,0,0,0.04); border-radius:6px; padding:10px 12px; margin-bottom:8px; }
.vehicle-head { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.vehicle-name-input { background:none; border:none; font-size:12px; font-weight:600; color:var(--ink); font-family:var(--font); outline:none; flex:1; border-bottom:1px solid transparent; }
.vehicle-name-input:focus { border-bottom-color:var(--accent); }

/* CONVENZIONI */
.conv-row { padding:8px 0; border-bottom:1px solid rgba(0,0,0,0.05); }
.conv-row:last-child { border-bottom:none; }
.conv-main { display:flex; align-items:center; gap:6px; margin-bottom:2px; }
.conv-name { font-size:12px; font-weight:600; color:var(--ink); flex:1; font-family:var(--font); }
.conv-meta { font-size:11px; color:var(--ink3); font-family:var(--font); }
.conv-edit input { display:block; width:100%; border:none; border-bottom:1px solid var(--accent); background:transparent; font-size:12px; font-family:var(--font); color:var(--ink); outline:none; margin-bottom:3px; padding:1px 0; }

/* MODAL (edit sezione) */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:100; }
.modal { background:#fff; border-radius:12px; padding:20px; width:300px; box-shadow:0 8px 40px rgba(0,0,0,0.3); }
.modal h3 { font-size:15px; font-weight:700; color:var(--ink); margin-bottom:14px; font-family:var(--font); }
.modal label { font-size:12px; color:var(--ink3); font-family:var(--font); display:block; margin-bottom:4px; }
.modal input[type=text] { width:100%; border:1px solid rgba(0,0,0,0.15); border-radius:6px; padding:7px 10px; font-size:13px; font-family:var(--font); color:var(--ink); outline:none; margin-bottom:12px; }
.modal input[type=text]:focus { border-color:var(--accent); }
.color-grid { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
.color-swatch { width:26px; height:26px; border-radius:50%; cursor:pointer; border:3px solid transparent; transition:all 0.15s; }
.color-swatch.selected { border-color:#333; transform:scale(1.15); }
.modal-actions { display:flex; justify-content:flex-end; gap:8px; }
.btn { padding:7px 14px; border-radius:6px; font-size:12px; font-family:var(--font); cursor:pointer; border:none; font-weight:600; }
.btn-primary { background:var(--accent); color:#fff; }
.btn-secondary { background:rgba(0,0,0,0.07); color:var(--ink2); }
.btn-danger { background:var(--danger); color:#fff; }

/* ALLEGATI */
.allegati-row { display:flex; align-items:center; gap:8px; padding:5px 0; border-bottom:1px solid rgba(0,0,0,0.04); font-size:12px; }
.allegati-row:last-child { border-bottom:none; }
.allegati-row a { flex:1; color:var(--ink); text-decoration:none; font-family:var(--font); }
.allegati-row a:hover { text-decoration:underline; }
.upload-label { display:inline-flex; align-items:center; gap:5px; margin-top:8px; cursor:pointer; font-size:12px; color:var(--ink3); border:1px dashed rgba(0,0,0,0.2); border-radius:6px; padding:5px 12px; font-family:var(--font); transition:all 0.15s; }
.upload-label:hover { border-color:var(--accent); color:var(--accent); }
.progress-bar { background:rgba(0,0,0,0.08); border-radius:4px; height:5px; overflow:hidden; margin:6px 0; }
.progress-fill { background:var(--accent); height:100%; transition:width 0.2s; }

/* EXPORT BAR */
.export-bar { display:flex; align-items:center; gap:8px; padding:6px 0 10px; flex-wrap:wrap; }
.export-btn { font-size:11px; padding:4px 10px; border-radius:6px; border:1px solid rgba(0,0,0,0.15); background:rgba(255,255,255,0.7); color:var(--ink2); cursor:pointer; font-family:var(--font); transition:all 0.15s; }
.export-btn:hover { background:#27ae60; color:#fff; border-color:#27ae60; }

/* NOTIF BANNER */
.notif-banner { background:rgba(212,82,12,0.08); border:1px solid rgba(212,82,12,0.25); border-radius:8px; padding:9px 13px; margin-bottom:12px; display:flex; align-items:center; gap:10px; font-size:12px; color:var(--ink); font-family:var(--font); }
.notif-banner button { background:var(--accent); border:none; color:#fff; border-radius:5px; padding:4px 10px; font-size:11px; cursor:pointer; font-family:var(--font); }

/* ADD BLOCK BTN */
.add-block-btn { width:100%; background:none; border:1px dashed rgba(0,0,0,0.15); border-radius:8px; padding:8px; color:var(--ink3); font-size:12px; font-family:var(--font); cursor:pointer; transition:all 0.15s; margin-top:4px; }
.add-block-btn:hover { border-color:var(--accent); color:var(--accent); }

/* SEARCH */
.search-result-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:6px; cursor:pointer; }
.search-result-item:hover { background:rgba(0,0,0,0.04); }
.search-badge { font-size:10px; padding:2px 6px; border-radius:3px; font-family:var(--font); flex-shrink:0; }
.search-text { font-size:13px; color:var(--ink); font-family:var(--font); }

@keyframes fadeIn { from { opacity:0; transform:translateX(5px); } to { opacity:1; transform:translateX(0); } }
.page-body { animation: fadeIn 0.15s ease; }
