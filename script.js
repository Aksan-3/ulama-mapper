let ulamaData = {};
fetch('https://opensheet.vercel.app/1S-d2DSuKmbmly8x6QEEqGzElaE-LDzO638lXdm-4aPY/Sheet1')
  .then(r => r.json())
  .then(rows => {
    ulamaData = {};
    rows.forEach(row => {
      const { provinsi, kepakaran, nama, institusi, bio } = row;
      if (!ulamaData[provinsi]) ulamaData[provinsi] = {};
      if (!ulamaData[provinsi][kepakaran]) ulamaData[provinsi][kepakaran] = [];
      ulamaData[provinsi][kepakaran].push({ nama, institusi, bio });
    });
  });

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
