const H = CG.h;
(() => {
    const l = [],
        d = [3, 5, 2, 6, 4, 7, 3, 2, 5, 8, 4, 3, 6, 4];
    for (let i = 13; i >= 0; i--) {
        const t = new Date(Date.now() - i * 864e5);
        l.push((t.getMonth() + 1) + '/' + t.getDate())
    }
    CG.sim = { l, d }
})();
const pc = () => {
    const x = CG.stats(),
        s = CG.st,
        N = CG.N;
    return [
        ['Phishing', Math.round(x.ph / N.ph * 100)],
        ['Lessons', Math.round(x.ls / N.les * 100)],
        ['Incidents', Math.round(x.ir / N.ir * 100)],
        ['Password', Math.round(Math.min(s.pw, 3) / 3 * 100)],
        ['URL', Math.round(Math.min(s.urls, 3) / 3 * 100)]
    ]
};
CG.reg('dashboard', 'Security Dashboard', el => {
            const sc = CG.score(),
                T = CG.threats,
                C = 2 * Math.PI * 52,
                S = ['Critical', 'High', 'Medium', 'Low'],
                cnt = S.map(s => T.filter(t => t[3] == s).length),
                open = T.filter(t => t[6] == 'Open').length;
            const tl = T.slice().sort((a, b) => b[1].localeCompare(a[1])).slice(0, 5).map(t => `<li><time>${t[1]} · simulated</time>${t[0]} ${H(t[4])} <span class="pill ${t[3].toLowerCase()}">${t[3]}</span></li>`).join('');
            const ul = CG.st.log.slice(0, 5).map(l => `<li><time>${new Date(l.d).toLocaleString()} · you</time>${H(l.t)}</li>`).join('') || '<li>No personal activity yet.</li>';
            el.innerHTML = `<p class="mono muted">Welcome, ${H(CG.st.name)}. All data shown is simulated.</p>
 <div class="grid"><div class="card center"><h3>Security score</h3><svg viewBox="0 0 120 120" width="140"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--b)" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" stroke="var(--a)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C*sc/100} ${C}" transform="rotate(-90 60 60)"/><text x="60" y="68" text-anchor="middle" font-size="28" fill="var(--t)">${sc}</text></svg><p class="muted">Based on your training progress</p></div>
 <div class="card"><h3>Threat overview</h3>${CG.bars([['Feed items',T.length,T.length],['Open',open,T.length,'high'],['Critical',cnt[0],T.length,'critical']])}<p><a class="btn" href="#threats">Open threat center</a></p></div>
 <div class="card"><h3>Risk distribution</h3><canvas id="c2"></canvas></div></div>
 <div class="grid"><div class="card"><h3>Simulated incidents · last 14 days</h3><canvas id="c1"></canvas></div><div class="card"><h3>Your security activity (%)</h3><canvas id="c3"></canvas></div></div>
 <div class="grid"><div class="card"><h3>Simulated incident timeline</h3><ul class="tl">${tl}</ul></div><div class="card"><h3>Your activity</h3><ul class="tl">${ul}</ul></div></div>
 <div class="card"><h3>Quick actions</h3>${[['phishing','Phishing'],['password','Password Lab'],['url','URL Analyzer'],['incidents','Incident drill'],['learning','Lessons']].map(a=>`<a class="btn" href="#${a[0]}">${a[1]}</a>`).join('')}</div>`;
 CG.cc('c1','line',CG.sim.l,CG.sim.d);CG.cc('c2','donut',S,cnt);CG.cc('c3','bar',pc().map(p=>p[0].slice(0,5)),pc().map(p=>p[1]));
});
CG.reg('reports','Security Reports',el=>{
 const x=CG.stats(),sc=CG.score(),T=CG.threats,cats=[...new Set(T.map(t=>t[2]))],S=['Critical','High','Medium','Low'],w=pc().slice().sort((a,b)=>a[1]-b[1])[0];
 const txt=()=>`CYBERGUARD SECURITY REPORT (educational simulation)\nUser: ${CG.st.name} (${CG.st.role})\nGenerated: ${new Date().toLocaleString()}\nSecurity score: ${sc}/100\n`+pc().map(p=>`${p[0]}: ${p[1]}%`).join('\n')+`\nPhishing correct: ${x.ph}/${x.pt} attempted\nPassword checks: ${CG.st.pw} | URL analyses: ${CG.st.urls}\nBadges: ${CG.badges().filter(b=>b[1]).map(b=>b[0]).join(', ')||'none'}\nRecommended focus: ${w[0]}\nSimulated feed: ${T.length} items (fictional)\n`;
 el.innerHTML=`<div class="grid"><div class="card"><h3>Risk score</h3><p style="font-size:34px;margin:0" class="${sc>=70?'ok':sc>=40?'warn':'bad'}">${sc}/100</p><p class="muted">${sc>=70?'Low risk posture':sc>=40?'Moderate — keep training':'High — start with the lessons'}</p><p>Recommended focus: <b>${w[0]}</b></p></div>
 <div class="card"><h3>Simulated severity mix</h3><canvas id="r1"></canvas></div><div class="card"><h3>Simulated threats by category</h3><canvas id="r2"></canvas></div></div>
 <div class="grid"><div class="card"><h3>Your progress by module (%)</h3><canvas id="r3"></canvas></div><div class="card"><h3>Simulated incidents · 14 days</h3><canvas id="r4"></canvas></div></div>
 <div class="card"><h3>Export</h3><button class="btn pri" id="dt">Report (.txt)</button><button class="btn" id="dc">Threat feed (.csv)</button><button class="btn" id="dj">Data (.json)</button><button class="btn" id="pr">Print / PDF</button></div>`;
 CG.cc('r1','donut',S,S.map(s=>T.filter(t=>t[3]==s).length));CG.cc('r2','bar',cats.map(c=>c.slice(0,5)),cats.map(c=>T.filter(t=>t[2]==c).length));
 CG.cc('r3','bar',pc().map(p=>p[0].slice(0,5)),pc().map(p=>p[1]));CG.cc('r4','line',CG.sim.l,CG.sim.d);
 el.querySelector('#dt').onclick=()=>CG.dl('cyberguard-report.txt',txt());
 el.querySelector('#dc').onclick=()=>CG.dl('threat-feed.csv','ID,Date,Category,Severity,Title,Status\n'+T.map(t=>[t[0],t[1],t[2],t[3],'"'+t[4]+'"',t[6]].join(',')).join('\n'));
 el.querySelector('#dj').onclick=()=>CG.dl('cyberguard-data.json',JSON.stringify(CG.st,null,2));
 el.querySelector('#pr').onclick=()=>window.print();
});