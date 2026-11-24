const CG = { mods: [], st: {} };
const DEF = { name: 'Analyst', theme: 'dark', phish: {}, lessons: {}, quiz: {}, ir: {}, log: [], pw: 0, urls: 0, hist: [], uh: [], seen: 0, role: 'Student', toasts: true, dense: false, since: Date.now() };
CG.load = () => { setTimeout(() => CG.save()); try { CG.st = Object.assign({}, DEF, JSON.parse(localStorage.getItem('cyberguard') || '{}')) } catch (e) { CG.st = Object.assign({}, DEF) } };
CG.save = () => { try { localStorage.setItem('cyberguard', JSON.stringify(CG.st)) } catch (e) {} };
CG.reset = () => {
    try { localStorage.removeItem('cyberguard') } catch (e) {}
    CG.load()
};
CG.reg = (id, title, render) => CG.mods.push({ id, title, render });
CG.h = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
CG.log = t => {
    CG.st.log.unshift({ t, d: Date.now() });
    CG.st.log.length = Math.min(CG.st.log.length, 25);
    CG.save()
};
CG.toast = m => {
    const e = document.createElement('div');
    e.className = 'toast';
    e.textContent = m;
    document.getElementById('toasts').append(e);
    setTimeout(() => e.remove(), 2800)
};
CG.modal = html => {
    document.getElementById('mb').innerHTML = html;
    document.getElementById('modal').hidden = false
};
CG.dl = (name, text) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500)
};
CG.stats = () => {
    const s = CG.st,
        p = Object.values(s.phish);
    return { ph: p.filter(Boolean).length, pt: p.length, ls: Object.keys(s.lessons).length, ir: Object.keys(s.ir).length }
};
CG.score = () => {
    const s = CG.st,
        x = CG.stats(),
        q = Object.values(s.quiz).reduce((a, b) => a + b, 0),
        i = Object.values(s.ir).reduce((a, b) => a + b.pct, 0) / 10;
    return Math.min(100, Math.round(20 + x.ph * 5 + x.ls * 5 + q * 2 + i))
};
CG.badges = () => {
    const x = CG.stats();
    return [
        ['First Steps', x.ls >= 1],
        ['Phish Hunter', x.ph >= 5],
        ['Scholar', x.ls >= 4],
        ['Responder', x.ir >= 2],
        ['Password Pro', CG.st.pw >= 3]
    ]
};
CG.bars = a => a.map(([l, v, m, c]) => `<div class="row"><span>${l}</span><div class="bar"><i class="${c||''}" style="width:${m?Math.round(v/m*100):0}%"></i></div><b>${v}</b></div>`).join('');

CG.N = { ph: 8, les: 6, ir: 3, q: 12 };
CG.score = () => {
    const s = CG.st,
        x = CG.stats(),
        q = Object.values(s.quiz).reduce((a, b) => a + b, 0),
        i = Object.values(s.ir).reduce((a, b) => a + b.pct, 0) / CG.N.ir / 100;
    return Math.min(100, Math.round(10 + x.ph / CG.N.ph * 25 + x.ls / CG.N.les * 20 + q / CG.N.q * 15 + i * 20 + Math.min(s.pw, 3) / 3 * 5 + Math.min(s.urls, 3) / 3 * 5))
};
CG.badges = () => {
    const x = CG.stats(),
        s = CG.st;
    return [
        ['First Steps', x.ls >= 1],
        ['Phish Hunter', x.ph >= 6],
        ['Scholar', x.ls >= CG.N.les],
        ['Responder', x.ir >= CG.N.ir],
        ['Password Pro', s.pw >= 3],
        ['URL Detective', s.urls >= 3]
    ]
};
const _t = CG.toast;
CG.toast = m => { if (CG.st.toasts !== false) _t(m) };
CG.chart = (cv, type, lb, data, o = {}) => {
    const dpr = devicePixelRatio || 1,
        w = cv.clientWidth || 300,
        h = cv.clientHeight || 170;
    cv.width = w * dpr;
    cv.height = h * dpr;
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);
    const cs = getComputedStyle(document.documentElement),
        c = n => cs.getPropertyValue(n).trim(),
        A = c('--a'),
        T = c('--m'),
        B = c('--b');
    g.font = '11px system-ui';
    if (type == 'donut') {
        const tot = data.reduce((a, b) => a + b, 0) || 1,
            cols = [c('--r'), c('--o'), c('--y'), c('--c'), c('--a'), '#8b7bff'],
            r = Math.min(w / 2, h / 2) - 8,
            cx = r + 8,
            cy = h / 2;
        let a0 = -Math.PI / 2;
        data.forEach((v, i) => {
            const a1 = a0 + v / tot * 2 * Math.PI;
            g.beginPath();
            g.arc(cx, cy, r, a0, a1);
            g.arc(cx, cy, r * .6, a1, a0, true);
            g.closePath();
            g.fillStyle = cols[i % 6];
            g.fill();
            a0 = a1;
            g.fillRect(cx * 2 + 10, 12 + i * 18, 10, 10);
            g.fillStyle = T;
            g.fillText(lb[i] + ' ' + v, cx * 2 + 26, 21 + i * 18)
        });
        return
    }
    const p = 24,
        mx = Math.max(...data, 1),
        bw = (w - p * 2) / data.length;
    g.strokeStyle = B;
    g.beginPath();
    g.moveTo(p, h - p);
    g.lineTo(w - p, h - p);
    g.stroke();
    g.fillStyle = T;
    if (type == 'bar') data.forEach((v, i) => {
        const bh = (h - p * 2) * v / mx;
        g.fillStyle = A;
        g.fillRect(p + i * bw + bw * .2, h - p - bh, bw * .6, bh);
        g.fillStyle = T;
        g.fillText(lb[i], p + i * bw + bw * .2, h - 9);
        g.fillText(v, p + i * bw + bw * .2, h - p - bh - 4)
    });
    else {
        g.strokeStyle = A;
        g.lineWidth = 2;
        g.beginPath();
        data.forEach((v, i) => {
            const x = p + i * bw + bw / 2,
                y = h - p - (h - p * 2) * v / mx;
            i ? g.lineTo(x, y) : g.moveTo(x, y)
        });
        g.stroke();
        [0, data.length - 1].forEach(i => g.fillText(lb[i], p + i * bw, h - 9))
    }
};
CG.cc = (id, ...a) => {
    const f = () => {
        const e = document.getElementById(id);
        e && CG.chart(e, ...a)
    };
    f();
    (CG.rd = CG.rd || []).push(f)
};