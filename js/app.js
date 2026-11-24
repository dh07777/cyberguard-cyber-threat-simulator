CG.load();
const ORDER = ['dashboard', 'phishing', 'password', 'url', 'threats', 'incidents', 'learning', 'reports', 'settings'],
    ICON = { dashboard: '◧', phishing: '✉', password: '🔑', url: '🔗', threats: '⚠', incidents: '🚨', learning: '🎓', reports: '📊', settings: '⚙' };
CG.reg('settings', 'User Settings', el => {
            const s = CG.st;
            el.innerHTML = `<div class="grid"><div class="card"><h3>Profile</h3><p><label>Display name<br><input type="text" id="nm" maxlength="30" value="${CG.h(s.name)}"></label></p><p><label>Role<br><select id="rl">${['Student','Security enthusiast','IT staff','Educator'].map(r=>`<option ${r==s.role?'selected':''}>${r}</option>`).join('')}</select></label></p><p class="mono muted">Member since ${new Date(s.since).toLocaleDateString()}</p></div>
 <div class="card"><h3>Preferences</h3><p><label>Theme<br><select id="th"><option value="dark">Dark</option><option value="light">Light</option></select></label></p><p><label><input type="checkbox" id="ts" ${s.toasts!==false?'checked':''}> Show toast notifications</label></p><p><label><input type="checkbox" id="dn" ${s.dense?'checked':''}> Compact density</label></p></div></div>
 <div class="card"><button class="btn pri" id="sv">Save preferences</button></div>
 <div class="card"><h3>Data</h3><p class="muted">All progress stays in this browser (LocalStorage).</p><button class="btn" id="ex">Export backup</button><button class="btn" id="im">Import backup</button><input type="file" id="fi" accept=".json" hidden><button class="btn" id="rs" style="border-color:var(--r)">Reset all data</button></div>`;
 const $=q=>el.querySelector(q);$('#th').value=s.theme;
 $('#sv').onclick=()=>{s.name=$('#nm').value.trim()||'Analyst';s.role=$('#rl').value;s.theme=$('#th').value;s.toasts=$('#ts').checked;s.dense=$('#dn').checked;CG.save();theme();toastNow('Preferences saved')};
 $('#th').onchange=()=>{s.theme=$('#th').value;CG.save();theme()};
 $('#ex').onclick=()=>CG.dl('cyberguard-backup.json',JSON.stringify(s));
 $('#im').onclick=()=>$('#fi').click();
 $('#fi').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o||typeof o!=='object')throw 0;CG.st=Object.assign({},DEF,o);CG.save();theme();CG.toast('Backup imported');CG.go()}catch(x){CG.toast('Invalid backup file')}};r.readAsText(f)};
 $('#rs').onclick=()=>{if(confirm('Erase all CyberGuard progress?')){CG.reset();CG.st.since=Date.now();CG.save();theme();CG.toast('Data reset');CG.go()}};
});
CG.mods.sort((a,b)=>ORDER.indexOf(a.id)-ORDER.indexOf(b.id));
const theme=()=>{document.documentElement.dataset.theme=CG.st.theme;document.body.classList.toggle('dense',!!CG.st.dense)};
CG.go=()=>{CG.rd=[];CG.bell&&CG.bell();const id=location.hash.slice(1),m=CG.mods.find(x=>x.id===id)||CG.mods[0],v=document.getElementById('view');
 document.getElementById('ttl').textContent=m.title;document.title=m.title+' · CyberGuard';
 document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.id===m.id));
 v.innerHTML='';m.render(v);document.getElementById('side').classList.remove('open')};
document.getElementById('nav').innerHTML=CG.mods.map(m=>`<a href="#${m.id}" data-id="${m.id}"><span>${ICON[m.id]}</span><span class="lbl">${m.title}</span></a>`).join('');
document.getElementById('menu').onclick=()=>innerWidth<=860?document.getElementById('side').classList.toggle('open'):document.body.classList.toggle('min');
document.getElementById('mc').onclick=()=>document.getElementById('modal').hidden=true;
document.getElementById('modal').onclick=e=>{if(e.target.id==='modal')e.target.hidden=true};
addEventListener('hashchange',CG.go);theme();CG.go();

const toastNow=m=>{const e=document.createElement('div');e.className='toast';e.textContent=m;document.getElementById('toasts').append(e);setTimeout(()=>e.remove(),2800)};
CG.bell=()=>{const n=CG.st.log.filter(l=>l.d>CG.st.seen).length;document.getElementById('bc').textContent=n||''};
const _l=CG.log;CG.log=t=>{_l(t);CG.bell()};
document.getElementById('bell').onclick=()=>{const op=CG.threats.filter(t=>t[6]=='Open').slice(0,4);
 CG.modal(`<h3>Notifications</h3><p class="muted">Simulated alerts</p><ul class="tl">${op.map(t=>`<li><time>${t[1]}</time>${t[0]} ${CG.h(t[4])} <span class="pill ${t[3].toLowerCase()}">${t[3]}</span></li>`).join('')}</ul><p class="muted">Your activity</p><ul class="tl">${CG.st.log.slice(0,8).map(l=>`<li><time>${new Date(l.d).toLocaleString()}</time>${CG.h(l.t)}</li>`).join('')||'<li>Nothing yet</li>'}</ul>`);
 CG.st.seen=Date.now();CG.save();CG.bell()};
addEventListener('resize',()=>(CG.rd||[]).forEach(f=>f()));CG.bell();