// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
}

document.getElementById('yr').textContent = new Date().getFullYear();

// Preselect inquiry type from ?type=employer|candidate
const typeSel = document.getElementById('f-type');
const typeParam = new URLSearchParams(location.search).get('type');
if (typeSel && typeParam) typeSel.value = typeParam;

// Homepage quick form: relabel the role field for job seekers
const roleLabel = document.querySelector('label[for="q-role"]');
document.querySelectorAll('input[name="Inquiry"]').forEach(r => r.addEventListener('change', () => {
  const hiring = r.value === 'Hiring';
  roleLabel.textContent = hiring ? roleLabel.dataset.hire : roleLabel.dataset.seek;
  document.getElementById('q-role').placeholder = hiring ? 'e.g. VP of Engineering' : 'e.g. Engineering Manager, Solar';
}));

// Forms: compose an email to Adam until a Supabase backend is wired up
const TO = 'adam@lotusscout.com';
document.querySelectorAll('form[data-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const kind = form.dataset.form;
    const name = data.get('Name') || '';
    let subject;
    if (kind === 'candidate') subject = `Candidate network: ${name}`;
    else if (kind === 'quick') subject = `${data.get('Inquiry')}: ${name}`;
    else {
      const sel = form.querySelector('#f-type');
      subject = `${sel ? sel.options[sel.selectedIndex].text : 'Inquiry'}: ${name}`;
    }
    const body = [...data.entries()]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.querySelector('.form-ok').classList.add('show');
  });
});
