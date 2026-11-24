const LES = [{
        t: 'Spotting phishing',
        b: 'Phishing tricks you into revealing data or running malware. Check the sender domain, hover links, watch for urgency, and verify requests through a separate channel.',
        q: [
            ['Best first step with an urgent email asking for login?', ['Click the link', 'Verify via the official site or contact', "Reply with your password"], 1],
            ['A strong warning sign is…', ['Matching domain', 'Pressure and threats', 'Personal greeting'], 1]
        ]
    },
    {
        t: 'Passwords & MFA',
        b: 'Use long, unique passwords stored in a password manager, and enable multi-factor authentication. Length adds entropy faster than clever substitutions.',
        q: [
            ['Which is generally stronger?', ['P@ssw0rd!', 'correct horse battery staple', 'Summer2026'], 1],
            ['MFA helps because…', ['It replaces passwords', 'A stolen password alone is not enough', 'It encrypts email'], 1]
        ]
    },
    {
        t: 'Safe browsing',
        b: 'Prefer HTTPS, but remember the padlock only means encryption. Inspect domains, avoid unknown downloads, and keep software updated.',
        q: [
            ['HTTPS guarantees…', ['The site is safe', 'The connection is encrypted', 'No malware'], 1],
            ['Which domain is the real one for example.com?', ['example.com.login.xyz', 'login.example.com', 'example-com.net'], 1]
        ]
    },
    {
        t: 'Incident response basics',
        b: 'Typical phases: Preparation, Detection, Containment, Eradication, Recovery, Lessons learned. Contain first, preserve evidence and communicate through the proper channels.',
        q: [
            ['After detecting ransomware, you should first…', ['Pay', 'Contain / isolate', 'Delete logs'], 1],
            ['Why a post-incident review?', ['Assign blame', 'Improve defenses', 'Skip documentation'], 1]
        ]
    },
    {
        t: 'Malware & ransomware',
        b: 'Malware includes viruses, trojans and ransomware. Defend with updates, offline backups, least privilege and cautious attachment handling.',
        q: [
            ['Best protection against ransomware data loss?', ['Paying quickly', 'Tested offline backups', 'Disabling updates'], 1],
            ['A .pdf.exe attachment is…', ['A safe PDF', 'A disguised executable', 'A compressed image'], 1]
        ]
    },
    {
        t: 'Social engineering & privacy',
        b: 'Attackers exploit trust, authority and urgency by phone, SMS or in person. Verify identities independently, share minimal data and report suspicious contacts.',
        q: [
            ['A caller claims to be IT and wants your MFA code. You…', ['Give it', 'Refuse and report', 'Give half of it'], 1],
            ['Why verify through a second channel?', ['It is faster', 'Attackers may control the first channel', 'It is legally required'], 1]
        ]
    }
];
CG.reg('learning', 'Learning Center', el => {
            const x = CG.stats();
            el.innerHTML = `<div class="card"><h3>Progress ${x.ls}/${LES.length}</h3><div class="bar"><i style="width:${x.ls/LES.length*100}%"></i></div></div>
 <div class="grid">${LES.map((l,i)=>`<div class="card"><h3>${l.t}</h3><p class="muted">${CG.st.lessons[i]?'✔ Completed — quiz '+CG.st.quiz[i]+'/'+l.q.length:'Not completed'}</p><button class="btn pri" data-i="${i}">Open lesson</button></div>`).join('')}</div>
 <div class="card"><h3>Achievement badges</h3>${CG.badges().map(b=>`<span class="badge ${b[1]?'on':''}">${b[1]?'🏅':'🔒'} ${b[0]}</span>`).join('')}</div>`;
 el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,l=LES[i];
  CG.modal(`<h3>${l.t}</h3><p>${l.b}</p>${l.q.map((q,k)=>`<p><b>${q[0]}</b></p>${q[1].map((o,j)=>`<label style="display:block"><input type="radio" name="q${k}" value="${j}"> ${o}</label>`).join('')}`).join('')}<p><button class="btn pri" id="sq">Submit quiz</button></p><p id="qr"></p>`);
  document.getElementById('sq').onclick=()=>{let c=0;for(let k=0;k<l.q.length;k++){const r=document.querySelector(`input[name=q${k}]:checked`);if(!r){CG.toast('Answer all questions');return}if(+r.value===l.q[k][2])c++}
   CG.st.quiz[i]=Math.max(c,CG.st.quiz[i]||0);CG.st.lessons[i]=true;CG.log(`Lesson "${l.t}" quiz ${c}/${l.q.length}`);CG.save();
   document.getElementById('qr').innerHTML=`<b class="${c==l.q.length?'ok':'warn'}">Score ${c}/${l.q.length}.</b> Correct answers are the safest practices described in the lesson.`;CG.toast('Progress saved');CG.go()}})});