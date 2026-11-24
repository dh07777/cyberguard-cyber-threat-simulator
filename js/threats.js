CG.threats = [
    ['T-1001', '2026-11-22', 'Phishing', 'High', 'Payroll portal credential lure', 'Fictional campaign using look-alike domains to harvest logins.', 'Open'],
    ['T-1002', '2026-11-21', 'Ransomware', 'Critical', 'File-encryption outbreak on shared drive', 'Simulated incident: mass file renaming detected on a file server.', 'Open'],
    ['T-1003', '2026-11-20', 'Vulnerability', 'High', 'Unpatched VPN appliance', 'Fictional advisory: outdated firmware exposes admin interface.', 'Open'],
    ['T-1004', '2026-11-18', 'DDoS', 'Medium', 'Traffic flood against web portal', 'Simulated spike of requests degraded response times.', 'Closed'],
    ['T-1005', '2026-11-17', 'Insider', 'Medium', 'Unusual after-hours data export', 'Fictional alert: large export by an account outside normal hours.', 'Open'],
    ['T-1006', '2026-11-15', 'Malware', 'High', 'Trojan disguised as invoice PDF', 'Simulated attachment dropping a loader on endpoints.', 'Closed'],
    ['T-1007', '2026-11-13', 'Phishing', 'Low', 'Fake survey gift-card email', 'Low-volume simulated spam with generic greeting.', 'Closed'],
    ['T-1008', '2026-11-11', 'Vulnerability', 'Critical', 'Remote code execution in web library', 'Fictional CVE-style advisory requiring urgent patching.', 'Open'],
    ['T-1009', '2026-11-09', 'Malware', 'Medium', 'Browser extension data skimmer', 'Simulated extension requesting excessive permissions.', 'Closed'],
    ['T-1010', '2026-11-06', 'Insider', 'Low', 'Shared password in chat', 'Fictional policy violation: credentials posted in a team channel.', 'Closed'],
    ['T-1011', '2026-11-03', 'DDoS', 'Low', 'Scanner noise on public IPs', 'Simulated low-impact connection attempts.', 'Closed'],
    ['T-1012', '2026-10-30', 'Ransomware', 'High', 'Phishing-delivered encryptor attempt', 'Simulated attempt blocked by endpoint protection.', 'Closed'],
    ['T-1013', '2026-10-27', 'Phishing', 'Medium', 'Fake MFA-reset prompt', 'Fictional lure asking users to approve an unexpected MFA push.', 'Closed'],
    ['T-1014', '2026-10-24', 'Malware', 'Low', 'Adware bundled with free software', 'Simulated nuisance installer found on a lab PC.', 'Closed']
];
CG.past = [
    ['INC-201', '2026-10-12', 'Phishing', '4h', 'Contained'],
    ['INC-202', '2026-10-05', 'Malware', '9h', 'Eradicated'],
    ['INC-203', '2026-09-28', 'DDoS', '2h', 'Mitigated'],
    ['INC-204', '2026-09-19', 'Insider', '30h', 'Policy updated'],
    ['INC-205', '2026-09-10', 'Ransomware', '48h', 'Restored from backup'],
    ['INC-206', '2026-09-02', 'Vulnerability', '12h', 'Patched'],
    ['INC-207', '2026-08-21', 'Phishing', '3h', 'Contained'],
    ['INC-208', '2026-08-09', 'Malware', '7h', 'Eradicated']
];
const CATD = { Phishing: 'Deceptive messages that steal credentials or deliver malware.', Malware: 'Malicious software such as trojans, spyware and adware.', Ransomware: 'Malware that encrypts data and demands payment.', DDoS: 'Traffic floods that make services unavailable.', Insider: 'Risky or malicious actions by people with legitimate access.', Vulnerability: 'Software weaknesses that need patching or mitigation.' };
CG.reg('threats', 'Threat Intelligence', el => {
            const T = CG.threats,
                R = { Critical: 4, High: 3, Medium: 2, Low: 1 },
                cats = Object.keys(CATD),
                K = [0, 1, 2, 3, 4, 6];
            let tab = 'feed',
                sk = 1,
                sd = -1,
                fc = '';
            const q$ = s => el.querySelector(s);

            function shell() { el.innerHTML = `<div class="card"><div class="tabs">${[['feed','Threat feed'],['cats','Categories'],['hist','Incident history']].map(t=>`<button class="btn ${tab==t[0]?'pri':''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><p class="muted mono">Simulated, fictional data for training. No live threat feed.</p><div id="pane"></div></div>`;
  el.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;shell()});({feed,cats:catv,hist})[tab]()}
 function feed(){q$('#pane').innerHTML=`<div class="filters"><input type="search" id="q" placeholder="Search id, title, description…"><select id="c"><option value="">All categories</option>${cats.map(c=>`<option ${c==fc?'selected':''}>${c}</option>`).join('')}</select><select id="s"><option value="">All severities</option>${Object.keys(R).map(c=>`<option>${c}</option>`).join('')}</select><select id="u"><option value="">Any status</option><option>Open</option><option>Closed</option></select><button class="btn" id="ec">Export CSV</button></div><div class="tw"><table><thead><tr>${['ID','Date','Category','Severity','Title','Status'].map((h,i)=>`<th data-k="${K[i]}" style="cursor:pointer">${h}${sk==K[i]?(sd>0?' ▲':' ▼'):''}</th>`).join('')}</tr></thead><tbody id="tb"></tbody></table></div><p id="n" class="muted"></p>`;
  let a=[];const draw=()=>{const q=q$('#q').value.toLowerCase();
   a=T.filter(t=>(!q$('#c').value||t[2]==q$('#c').value)&&(!q$('#s').value||t[3]==q$('#s').value)&&(!q$('#u').value||t[6]==q$('#u').value)&&(!q||t.join(' ').toLowerCase().includes(q)));
   a.sort((x,y)=>{let p=x[sk],r=y[sk];if(sk==3){p=R[p];r=R[r]}return(p>r?1:p<r?-1:0)*sd});
   q$('#tb').innerHTML=a.map(t=>`<tr data-id="${t[0]}"><td class="mono">${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td><span class="pill ${t[3].toLowerCase()}">${t[3]}</span></td><td>${t[4]}</td><td>${t[6]}</td></tr>`).join('')||'<tr><td colspan="6">No matches.</td></tr>';
   q$('#n').textContent=a.length+' of '+T.length+' items';
   el.querySelectorAll('tr[data-id]').forEach(r=>r.onclick=()=>{const t=T.find(x=>x[0]==r.dataset.id);CG.modal(`<h3>${t[0]} — ${t[4]}</h3><p><span class="pill ${t[3].toLowerCase()}">${t[3]}</span> ${t[2]} · ${t[1]} · ${t[6]}</p><p>${t[5]}</p><p class="muted">${CATD[t[2]]}</p>`)})};
  el.querySelectorAll('#pane input,#pane select').forEach(x=>x.oninput=()=>{fc=q$('#c').value;draw()});
  el.querySelectorAll('th[data-k]').forEach(h=>h.onclick=()=>{const k=+h.dataset.k;sk==k?sd=-sd:(sk=k,sd=1);feed()});
  q$('#ec').onclick=()=>CG.dl('threat-feed.csv','ID,Date,Category,Severity,Title,Status\n'+a.map(t=>[t[0],t[1],t[2],t[3],'"'+t[4]+'"',t[6]].join(',')).join('\n'));draw()}
 function catv(){q$('#pane').innerHTML=`<div class="grid">${cats.map(c=>{const l=T.filter(t=>t[2]==c);return`<div class="card"><h3>${c}</h3><p>${CATD[c]}</p><p class="mono">${l.length} items · ${l.filter(t=>t[6]=='Open').length} open · worst: ${l.map(t=>t[3]).sort((a,b)=>R[b]-R[a])[0]}</p><button class="btn" data-c="${c}">View in feed</button></div>`}).join('')}</div>`;
  el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{fc=b.dataset.c;tab='feed';shell()})}
 function hist(){const u=CG.st.hist;q$('#pane').innerHTML=`<h3>Past incidents (simulated)</h3><div class="tw"><table><thead><tr><th>ID</th><th>Date</th><th>Category</th><th>Time to resolve</th><th>Outcome</th></tr></thead><tbody>${CG.past.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div><h3 style="margin-top:16px">Your response drills</h3>${u.length?`<div class="tw"><table><thead><tr><th>Scenario</th><th>Score</th><th>When</th></tr></thead><tbody>${u.map(r=>`<tr><td>${CG.h(r.t)}</td><td>${r.pct}%</td><td>${new Date(r.d).toLocaleString()}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">No drills completed yet — try Incident Response.</p>'}`}
 shell()});