import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_TABS, DEFAULT_SECTION_DATA } from '../data/sections';

const DEVICE_ID = localStorage.getItem('asp_device') || (() => {
  const id = 'dev_' + Math.random().toString(36).substr(2,8);
  localStorage.setItem('asp_device', id);
  return id;
})();

const USER = 'paola';

export function useFirebaseData() {
  const [tabs, setTabsState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('asp_tabs')) || DEFAULT_TABS; } catch { return DEFAULT_TABS; }
  });
  const [sectionData, setSectionDataState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('asp_data')) || DEFAULT_SECTION_DATA; } catch { return DEFAULT_SECTION_DATA; }
  });
  const [syncing, setSyncing] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'schedari', USER), snap => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.lastDevice !== DEVICE_ID) {
          if (d.tabs) { setTabsState(d.tabs); localStorage.setItem('asp_tabs', JSON.stringify(d.tabs)); }
          if (d.sectionData) { setSectionDataState(d.sectionData); localStorage.setItem('asp_data', JSON.stringify(d.sectionData)); }
        }
      }
    }, () => {});
    return () => unsub();
  }, []);

  const save = useCallback(async (newTabs, newData) => {
    localStorage.setItem('asp_tabs', JSON.stringify(newTabs));
    localStorage.setItem('asp_data', JSON.stringify(newData));
    if (!navigator.onLine) return;
    setSyncing(true);
    try {
      await setDoc(doc(db, 'schedari', USER), {
        tabs: newTabs, sectionData: newData,
        updatedAt: new Date().toISOString(), lastDevice: DEVICE_ID,
      });
    } catch(e) { console.warn('sync error', e); }
    finally { setSyncing(false); }
  }, []);

  const setTabs = useCallback((updater) => {
    setTabsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setSectionDataState(cur => { save(next, cur); return cur; });
      return next;
    });
  }, [save]);

  const setSectionData = useCallback((updater) => {
    setSectionDataState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setTabsState(cur => { save(cur, next); return cur; });
      return next;
    });
  }, [save]);

  return { tabs, setTabs, sectionData, setSectionData, syncing, online };
}
