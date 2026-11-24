CG.reg('password', 'Password Lab', el => {
            const COMMON = ['password', '123456', 'qwerty', 'letmein', 'admin', 'welcome', 'iloveyou', 'abc123'],
                W = 'river stone cloud maple tiger ember frost orbit quartz lemon cedar pixel harbor violet comet meadow falcon amber copper delta echo fable garnet hazel ivory jungle kernel lunar mango noble ocean pepper quiet raven sunset thunder unity velvet willow xenon yellow zephyr anchor bridge candle dragon engine forest glacier island jacket knight ladder marble nectar olive planet rocket silver tunnel useful window wonder'.split(' '),
                POL = { Basic: [8, 0, '8+ characters'], 'NIST-style': [12, 0, '12+ characters, not common (no composition rules)'], Strict: [14, 1, '14+ characters with all character classes'] };
            el.innerHTML = `<div class="grid"><div class="card"><h3>Strength & entropy</h3><input type="password" id="pw" placeholder="Type a test password (never stored or sent)" autocomplete="off"><label><input type="checkbox" id="sh"> Show</label><div class="bar" style="margin:10px 0"><i id="mt" style="width:0"></i></div><p id="res" class="mono muted">Enter a password to analyse.</p><label>Policy <select id="pp">${Object.keys(POL).map(k=>`<option>${k}</option>`).join('')}</select></label> <small id="pd" class="muted"></small><ul id="pol" style="list-style:none;padding:0"></ul></div>
 <div class="card"><h3>Secure generator</h3><label><input type="radio" name="m" value="p" checked> Password</label> <label><input type="radio" name="m" value="w"> Passphrase</label><br><label>Length / words <b id="lv">16</b></label><br><input type="range" id="ln" min="8" max="64" value="16"><div id="op"><label><input type="checkbox" id="u" checked> A-Z</label> <label><input type="checkbox" id="l" checked> a-z</label> <label><input type="checkbox" id="d" checked> 0-9</label> <label><input type="checkbox" id="s" checked> Symbols</label></div><p><input type="text" id="out" readonly class="mono"></p><p id="gb" class="mono muted"></p><button class="btn pri" id="gn">Generate</button><button class="btn" id="cp">Copy</button></div></div>
 <div class="card"><h3>Password education</h3><ul><li>Length beats complexity: use 14+ characters or a 5–6 word random passphrase.</li><li>Use a unique password per account and a password manager.</li><li>Enable multi-factor authentication wherever possible.</li><li>Never reuse passwords: one breach exposes every account that shares it.</li><li>Entropy ≈ length × log2(character pool). It is an estimate that assumes random choice.</li><li>Real passphrase tools use ~7,776-word lists; this lab's 64-word list is for demonstration only.</li></ul></div>`;
 const $=s=>el.querySelector(s),pw=$('#pw');
 const check=()=>{const v=pw.value,p=POL[$('#pp').value];$('#pd').textContent=p[2];if(!v){$('#res').textContent='Enter a password to analyse.';$('#pol').innerHTML='';$('#mt').style.width=0;return}
  const cl=[/[a-z]/,/[A-Z]/,/\d/,/[^A-Za-z0-9]/],pool=[26,26,10,33].reduce((a,n,k)=>a+(cl[k].test(v)?n:0),0),com=COMMON.some(c=>v.toLowerCase().includes(c)),rep=/(.)\1\1/.test(v);
  let bits=v.length*Math.log2(pool||1);if(com)bits=Math.min(bits,20);if(rep)bits*=.8;bits=Math.round(bits);
  const lv=bits<28?['Very weak','bad',10]:bits<36?['Weak','critical',30]:bits<60?['Fair','medium',55]:bits<80?['Strong','low',80]:['Very strong','ok',100];
  const sec=Math.pow(2,bits)/2/1e10,t=sec<1?'instantly':sec<3600?Math.round(sec/60)+' min':sec<86400*365?Math.round(sec/86400)+' days':sec<86400*365*1e6?Math.round(sec/31536000).toLocaleString()+' years':'millions+ of years';
  const m=$('#mt');m.style.width=lv[2]+'%';m.className=lv[1];
  $('#res').innerHTML=`<b>${lv[0]}</b> · ~${bits} bits · offline brute-force at 10¹⁰ guesses/s: ${t}`;
  const P=[[`At least ${p[0]} characters`,v.length>=p[0]],['Not a common password',!com],['No 3+ repeated characters',!rep]];
  if(p[1])P.push(['Uppercase',cl[1].test(v)],['Lowercase',cl[0].test(v)],['Digit',cl[2].test(v)],['Symbol',cl[3].test(v)]);
  $('#pol').innerHTML=P.map(x=>`<li class="${x[1]?'ok':'bad'}">${x[1]?'✔':'✘'} ${x[0]}</li>`).join('')+`<li><b>${P.every(x=>x[1])?'Meets':'Does not meet'} the ${$('#pp').value} policy</b></li>`;
  if(!pw._c){pw._c=1;CG.st.pw++;CG.save()}};
 pw.oninput=check;$('#pp').onchange=check;$('#sh').onchange=e=>pw.type=e.target.checked?'text':'password';
 const mode=()=>el.querySelector('input[name=m]:checked').value;
 const gen=()=>{const n=+$('#ln').value,r=new Uint32Array(n);crypto.getRandomValues(r);
  if(mode()=='w'){const k=Math.min(n,12);$('#out').value=[...r.slice(0,k)].map(x=>W[x%W.length]).join('-');$('#gb').textContent=`≈ ${Math.round(k*Math.log2(W.length))} bits (demo wordlist)`;return}
  let c='';if($('#u').checked)c+='ABCDEFGHJKLMNPQRSTUVWXYZ';if($('#l').checked)c+='abcdefghijkmnopqrstuvwxyz';if($('#d').checked)c+='23456789';if($('#s').checked)c+='!@#$%^&*-_=+?';
  if(!c){CG.toast('Select at least one set');return}$('#out').value=[...r].map(x=>c[x%c.length]).join('');$('#gb').textContent=`≈ ${Math.round(n*Math.log2(c.length))} bits`};
 $('#ln').oninput=e=>{$('#lv').textContent=e.target.value;gen()};
 el.querySelectorAll('input[name=m]').forEach(r=>r.onchange=()=>{const w=mode()=='w';$('#ln').min=w?3:8;$('#ln').max=w?12:64;$('#ln').value=w?5:16;$('#lv').textContent=$('#ln').value;$('#op').style.display=w?'none':'';gen()});
 $('#gn').onclick=()=>{gen();CG.log('Generated a password locally')};
 $('#cp').onclick=()=>{const o=$('#out');if(!o.value){CG.toast('Generate first');return}o.select();(navigator.clipboard?navigator.clipboard.writeText(o.value):Promise.reject()).then(()=>CG.toast('Copied'),()=>{document.execCommand('copy');CG.toast('Copied')})};
 gen();$('#pd').textContent=POL.Basic[2];
});