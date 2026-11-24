const SC = [{
        id: 'ransom',
        t: 'Ransomware on a workstation',
        intro: 'An employee reports files renamed with a strange extension and a ransom note on screen.',
        steps: [
            ['First action?', [
                ['Isolate the machine from the network', 10, 'Containment first stops spread.'],
                ['Reboot and see if it goes away', 2, 'Rebooting may destroy evidence and does not stop spread.'],
                ['Pay the ransom quickly', 0, 'Payment is risky, funds crime and gives no guarantee.']
            ]],
            ['Who do you notify?', [
                ['Incident response lead and management', 10, 'Follow the escalation process.'],
                ['Nobody until you know more', 1, 'Delay increases impact.'],
                ['Post it in the public channel', 2, 'Uncontrolled disclosure causes panic and confusion.']
            ]],
            ['Recovery approach?', [
                ['Rebuild from clean backups after eradicating the cause', 10, 'Verified clean restore is the safest path.'],
                ['Delete the note and carry on', 0, 'Root cause remains.'],
                ['Restore backups without checking the infection source', 4, 'You may be re-infected.']
            ]]
        ]
    },
    {
        id: 'acct',
        t: 'Suspicious account takeover',
        intro: 'Monitoring shows an executive account logging in from an unusual country and forwarding mail externally.',
        steps: [
            ['First action?', [
                ['Reset credentials and revoke active sessions', 10, 'Cuts off the attacker quickly.'],
                ['Send the user an email asking if it was them', 3, 'Slow, and the attacker may read the reply.'],
                ['Ignore: could be a VPN', 0, 'Alert should be investigated.']
            ]],
            ['Next step?', [
                ['Remove the forwarding rule and review mailbox changes', 10, 'Eradicate persistence.'],
                ['Delete the user account', 2, 'Destroys evidence and disrupts business.'],
                ['Do nothing further', 0, 'Persistence may remain.']
            ]],
            ['Lessons learned?', [
                ['Enforce MFA and document the incident', 10, 'Prevents recurrence and records knowledge.'],
                ['Blame the user', 0, 'Blame discourages reporting.'],
                ['Close the ticket silently', 2, 'No improvement.']
            ]]
        ]
    },
    {
        id: 'ddos',
        t: 'DDoS against the public website',
        intro: 'Response times spike and monitoring shows a flood of requests from many sources.',
        steps: [
            ['First action?', [
                ['Enable rate limiting / upstream DDoS protection', 10, 'Absorb or filter traffic early.'],
                ['Shut down all servers', 2, 'Causes the outage the attacker wants.'],
                ['Wait and see', 1, 'Impact grows without action.']
            ]],
            ['Communication?', [
                ['Post a status update and inform stakeholders', 10, 'Transparent communication builds trust.'],
                ['Stay silent', 2, 'Users and teams are left guessing.'],
                ['Blame a competitor publicly', 0, 'Unverified accusations are harmful.']
            ]],
            ['After the attack?', [
                ['Review logs, tune defenses, update the runbook', 10, 'Learn and improve.'],
                ['Delete logs to save space', 0, 'You lose forensic data.'],
                ['Assume it will never happen again', 1, 'Attacks recur.']
            ]]
        ]
    }
];
CG.reg('incidents', 'Incident Response', el => {
            const draw = () => { el.innerHTML = `<div class="grid">${SC.map((s,i)=>`<div class="card"><h3>${s.t}</h3><p>${s.intro}</p><p class="muted">${CG.st.ir[s.id]?'Best score: '+CG.st.ir[s.id].pct+'%':'Not attempted'}</p><button class="btn pri" data-i="${i}">Start simulation</button></div>`).join('')}</div><div class="card"><h3>Your simulation history</h3>${CG.st.hist.length?CG.st.hist.map(r=>`<div>${CG.h(r.t)} — <b>${r.pct}%</b> <small>${new Date(r.d).toLocaleString()}</small></div>`).join(''):'<span class="muted">No drills yet.</span>'}</div>`;
  el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>play(SC[+b.dataset.i]))};
 const play=s=>{let n=0,pts=0,rep=[];
  const step=()=>{if(n>=s.steps.length){const pct=Math.round(pts/(s.steps.length*10)*100),old=CG.st.ir[s.id];
   if(!old||pct>old.pct)CG.st.ir[s.id]={pct};CG.st.hist.unshift({t:s.t,pct,d:Date.now()});CG.st.hist.length=Math.min(CG.st.hist.length,20);CG.log(`Completed "${s.t}" (${pct}%)`);CG.save();
   const txt=`INCIDENT REPORT — ${s.t}\nAnalyst: ${CG.st.name}\nDate: ${new Date().toLocaleString()}\nScore: ${pct}%\n\n`+rep.join('\n');
   el.innerHTML=`<div class="card"><h3>Final incident report — ${s.t}</h3><p style="font-size:28px" class="${pct>=70?'ok':'warn'}">${pct}%</p><pre class="mono tw" style="white-space:pre-wrap">${CG.h(txt)}</pre><button class="btn pri" id="d">Download report</button><button class="btn" id="b">Back</button></div>`;
   el.querySelector('#d').onclick=()=>CG.dl('incident-report.txt',txt);el.querySelector('#b').onclick=draw;return}
   const q=s.steps[n];el.innerHTML=`<div class="card"><h3>${s.t} — step ${n+1}/${s.steps.length}</h3><div class="bar"><i style="width:${n/s.steps.length*100}%"></i></div><p><b>${q[0]}</b></p>${q[1].map((o,k)=>`<button class="btn opt" data-k="${k}">${o[0]}</button>`).join('')}<p id="fb"></p></div>`;
   el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const o=q[1][+b.dataset.k];pts+=o[1];rep.push(`${n+1}. ${q[0]} -> ${o[0]} (${o[1]}/10): ${o[2]}`);
    el.querySelectorAll('.opt').forEach(x=>x.disabled=true);el.querySelector('#fb').innerHTML=`<span class="${o[1]>=8?'ok':'warn'}">${o[2]}</span><br><button class="btn pri" id="nx">Continue</button>`;el.querySelector('#nx').onclick=()=>{n++;step()}})};
  step()};draw()});