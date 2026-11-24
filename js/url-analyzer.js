CG.analyzeURL = raw => {
    let u;
    try { u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : 'https://' + raw) } catch (e) { return null }
    const f = [],
        add = (s, p, m) => f.push({ s, p, m }),
        host = u.hostname,
        parts = host.split('.'),
        reg = parts.slice(-2).join('.'),
        rest = host.slice(0, host.length - reg.length);
    u.protocol === 'https:' ? add('ok', 0, 'HTTPS in use (encrypted, but this does not prove the site is trustworthy).') : add('warn', 25, 'Not HTTPS — traffic is unencrypted.');
    if (/^\d+(\.\d+){3}$/.test(host)) add('bad', 30, 'Host is a raw IP address instead of a domain name.');
    if (raw.includes('@')) add('bad', 25, 'Contains "@" — text before it can hide the real destination.');
    if (parts.length > 4) add('warn', 15, 'Unusually many subdomains (' + parts.length + ' labels).');
    if (/xn--/.test(host)) add('bad', 25, 'Punycode (xn--) — may hide look-alike Unicode characters.');
    if ((host.match(/-/g) || []).length >= 2) add('warn', 10, 'Several hyphens in the domain.');
    if (/(paypa1|g00gle|micr0soft|amaz0n|faceb00k|rnicrosoft)/i.test(host)) add('bad', 30, 'Digit/letter substitution imitating a known brand.');
    const br = ['paypal', 'google', 'microsoft', 'amazon', 'apple', 'bank'].find(b => rest.includes(b) && !reg.includes(b));
    if (br) add('bad', 30, `Brand name "${br}" appears in a subdomain, not the main domain (${reg}).`);
    if (/(login|verify|secure|update|account|confirm)/i.test(host)) add('warn', 10, 'Sensitive keyword in hostname (login/verify/secure…).');
    if (/\.(zip|xyz|top|tk|click|gq)$/i.test(host)) add('warn', 10, 'TLD frequently abused in simulations of throwaway domains.');
    if (raw.length > 75) add('warn', 10, 'Very long URL.');
    if (u.port) add('warn', 10, 'Non-standard port ' + u.port + '.');
    if ((raw.match(/%[0-9a-f]{2}/gi) || []).length > 3) add('warn', 10, 'Heavy percent-encoding may obscure content.');
    if (/^(bit\.ly|tinyurl\.com|t\.co|goo\.gl)$/.test(host)) add('warn', 15, 'URL shortener hides the destination.');
    const sc = Math.min(100, f.reduce((a, x) => a + x.p, 0));
    return { host, reg, sc, lvl: sc < 20 ? 'Low' : sc < 45 ? 'Medium' : 'High', f }
};
CG.reg('url', 'URL Safety Analyzer', el => {
            el.innerHTML = `<div class="card"><p class="warn mono">⚠ Heuristic demonstration only — this is NOT a live reputation check. Nothing is fetched or sent; analysis runs locally on the text.</p><input type="text" id="u" placeholder="e.g. http://paypal.secure-login.example.xyz/verify"><p><button class="btn pri" id="go">Analyze</button> <span class="muted">Try:</span> <button class="btn" data-s="https://www.example.org/docs">safe-looking</button><button class="btn" data-s="http://192.168.4.7/login@paypa1.com">suspicious</button></p><div id="r"></div></div><div class="card"><h3>Recent analyses</h3><div id="uh"></div><button class="btn" id="cu">Clear history</button></div>`;
            const hl = () => { el.querySelector('#uh').innerHTML = CG.st.uh.length ? CG.st.uh.map(u => `<div class="mono" style="overflow-wrap:anywhere">${CG.h(u[0])} — <b>${u[1]}</b> (${u[2]})</div>`).join('') : '<span class="muted">None yet.</span>' };
            hl();
            el.querySelector('#cu').onclick = () => {
                CG.st.uh = [];
                CG.save();
                hl()
            };
            const run = () => {
                    const v = el.querySelector('#u').value.trim(),
                        r = el.querySelector('#r');
                    if (!v) { CG.toast('Enter a URL'); return }
                    const a = CG.analyzeURL(v);
                    if (!a) { r.innerHTML = '<p class="bad">Could not parse this as a URL.</p>'; return }
                    CG.st.urls++;
                    CG.st.uh.unshift([v, a.lvl, a.sc]);
                    CG.st.uh.length = Math.min(CG.st.uh.length, 8);
                    CG.log('Analyzed a URL (' + a.lvl + ' risk)');
                    CG.save();
                    r.innerHTML = `<h3>Risk: <span class="${a.lvl=='High'?'bad':a.lvl=='Medium'?'warn':'ok'}">${a.lvl} (${a.sc}/100)</span></h3><p class="mono">Host: ${CG.h(a.host)} · Main domain: ${CG.h(a.reg)}</p><ul>${a.f.map(x=>`<li class="${x.s}">${x.s=='ok'?'✔':'⚠'} ${CG.h(x.m)}</li>`).join('')}</ul>`;hl()};
 el.querySelector('#go').onclick=run;el.querySelector('#u').onkeydown=e=>e.key=='Enter'&&run();
 el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{el.querySelector('#u').value=b.dataset.s;run()});
});