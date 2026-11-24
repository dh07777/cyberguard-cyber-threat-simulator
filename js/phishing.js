const E = [
    ['security@paypa1-support.com', 'URGENT: Account suspended', 'Dear customer, we detected unusual activity. Verify within 24 hours or your account will be closed.', ['Verify My Account', 'http://paypa1-support.com.verify-id.example/login'], 1, 'Lookalike domain (paypa1 with a digit), urgency and threats, generic greeting, and the link goes to a different domain than expected.'],
    ['no-reply@github.com', 'New sign-in from Chrome on Windows', 'We noticed a sign-in to your account. If this was you, no action is needed.', ['Review security settings', 'https://github.com/settings/security'], 0, 'Matches the real domain, no pressure, no request for credentials. When unsure, open the site yourself instead of clicking.'],
    ['hr@company-payrolI.net', 'Payroll update – open attachment', 'Your salary details changed. Open the attached file and log in to confirm your bank details.', ['Payroll_Update.html.exe', 'attachment: Payroll_Update.html.exe'], 1, 'Capital "I" imitating "l" in the domain, a double file extension (.html.exe), and a request for bank details.'],
    ['library@city-library.org', 'Book due tomorrow', 'Hi, a reminder that "Network Basics" is due tomorrow. Renew from your account page.', ['Renew online', 'https://city-library.org/account'], 0, 'Expected service, consistent domain, link matches the sender, no sensitive data requested.'],
    ['ceo.office@gmail-mail.co', 'Quick favour – confidential', 'I am in a meeting. Buy 5 gift cards today and send me the codes. Do not call me.', ['(no link)', 'n/a'], 1, 'Executive impersonation (BEC) using a free-style lookalike domain, secrecy, gift card request, and instructions to avoid verification.'],
    ['it-helpdesk@c0mpany-it.com', 'Mailbox almost full', 'Your mailbox is 99% full. Click to increase quota or lose incoming mail.', ['Increase quota', 'http://mail-quota.example.top/?u=you'], 1, 'Digit-for-letter domain (c0mpany), vague generic threat, and a link to an unrelated .top domain over HTTP.'],
    ['billing@streamflix.com', 'Your receipt for November', 'Thanks for your payment of $9.99. View your receipt in your account.', ['View receipt', 'https://streamflix.com/account/billing'], 0, 'Link domain matches the sender, no urgency or credential request. If you did not subscribe, contact the service directly.'],
    ['prize@lucky-winner.example', 'You won a free laptop!', 'Congratulations! Pay a $4.99 shipping fee with your card to claim your prize.', ['Claim prize', 'https://lucky-winner.example/claim?card=1'], 1, 'Too-good-to-be-true unsolicited prize with a payment demand to claim it.']
];
let i = 0;
CG.reg('phishing', 'Phishing Simulator', el => {
            const h = CG.h,
                draw = () => {
                    const e = E[i],
                        a = CG.st.phish[i];
                    el.innerHTML = `<div class="card"><h3>Challenge ${i+1}/${E.length} — fictional email · score ${Object.values(CG.st.phish).filter(Boolean).length}/${Object.keys(CG.st.phish).length}</h3><div class="mail mono"><div><b>From:</b> ${h(e[0].split('@')[0])}@<mark>${h(e[0].split('@')[1])}</mark></div><div><b>Subject:</b> ${h(e[1])}</div><p>${h(e[2])}</p><p><u>${h(e[3][0])}</u><br><small>Link target: ${h(e[3][1])}</small></p></div>
 <p class="muted">Check sender address, link target and language.</p>
 ${a===undefined?'<button class="btn pri" data-a="1">Phishing</button><button class="btn pri" data-a="0">Legitimate</button><button class="btn" id="hn">💡 Hint</button>':`<p class="${a?'ok':'bad'}">${a?'✔ Correct':'✘ Incorrect'} — this is ${e[4]?'PHISHING':'LEGITIMATE'}.</p><p>${e[5]}</p>`}
 <div><button class="btn" id="pv" ${i?'':'disabled'}>◀ Prev</button><button class="btn" id="nx" ${i<E.length-1?'':'disabled'}>Next ▶</button><button class="btn" id="rs">Reset</button></div></div>`;
 el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.a===e[4];CG.st.phish[i]=ok;CG.log(`Phishing challenge ${i+1}: ${ok?'correct':'incorrect'}`);CG.save();CG.toast(ok?'Correct!':'Not quite');draw()});
 const hn=el.querySelector('#hn');if(hn)hn.onclick=()=>CG.toast('Check the domain after @, the link target and any urgency.');el.querySelector('#pv').onclick=()=>{i--;draw()};el.querySelector('#nx').onclick=()=>{i++;draw()};
 el.querySelector('#rs').onclick=()=>{CG.st.phish={};i=0;CG.save();draw()}};draw()});