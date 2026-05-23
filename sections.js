import { useEffect, useCallback } from 'react';

export function useNotifications(sectionData) {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const check = useCallback(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const today = new Date();
    const fmt = d => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
    const todayStr = fmt(today);
    const tom = new Date(today); tom.setDate(tom.getDate()+1);
    const tomStr = fmt(tom);
    const oggi = [], domani = [];
    Object.values(sectionData).forEach(data => {
      (data.scadenze||[]).forEach(s => {
        if (!s.date) return;
        const [d,m] = s.date.split('/');
        const ds = `${d?.padStart(2,'0')}/${m?.padStart(2,'0')}`;
        if (ds === todayStr) oggi.push(s.text);
        if (ds === tomStr) domani.push(s.text);
      });
    });
    if (oggi.length) new Notification('📅 Scadenze oggi – Schedario ASP', { body: oggi.join('\n'), icon: '/icons/icon-192.png', tag: 'oggi' });
    if (domani.length) new Notification('⏰ Scadenze domani – Schedario ASP', { body: domani.join('\n'), icon: '/icons/icon-192.png', tag: 'domani' });
  }, [sectionData]);

  useEffect(() => {
    check();
    const t = setInterval(check, 3600000);
    return () => clearInterval(t);
  }, [check]);

  return { check };
}
