let ulamaData = {};
fetch('data/ulama.json')
  .then(r => r.json())
  .then(data => { ulamaData = data; });

function loadMap() {
  fetch('assets/indonesia-map.svg')
    .then(r => r.text())
    .then(svg => {
      const c = document.getElementById('map-container');
      c.innerHTML = svg;
      c.querySelectorAll('path').forEach(path => {
        path.style.cursor = 'pointer';
        path.onclick = () => handleProvinceClick(path.id);
      });
    });
}
function handleProvinceClick(p) {
  document.getElementById('region-title').textContent = p;
  const eL = document.getElementById('expertise-list');
  const uL = document.getElementById('ulama-list');
  eL.innerHTML = ''; uL.innerHTML = '';
  const exps = Object.keys(ulamaData[p] || {});
  exps.forEach(exp => {
    const btn = document.createElement('button');
    btn.textContent = exp;
    btn.onclick = () => showUlamaList(p, exp);
    eL.appendChild(btn);
  });
}
function showUlamaList(prov, exp) {
  const uL = document.getElementById('ulama-list');
  uL.innerHTML = '';
  (ulamaData[prov][exp] || []).forEach(u => {
    const d = document.createElement('div');
    d.innerHTML = `<h4>${u.nama}</h4><p><strong>${u.institusi}</strong></p><p>${u.bio}</p>`;
    uL.appendChild(d);
  });
}
document.addEventListener('DOMContentLoaded', loadMap);