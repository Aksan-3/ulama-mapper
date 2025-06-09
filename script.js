let ulamaData = {};

fetch("https://spreadsheets.google.com/feeds/list/1S-d2DSuKmbmly8x6QEEqGzElaE-LDzO638lXdm-4aPY/od6/public/values?alt=json")
  .then(response => response.json())
  .then(data => {
    data.feed.entry.forEach(entry => {
      const prov = entry.gsx$provinsi.$t;
      const kepakaran = entry.gsx$kepakaran.$t;
      const nama = entry.gsx$nama.$t;
      const institusi = entry.gsx$institusi.$t;
      const bio = entry.gsx$bio.$t;

      if (!ulamaData[prov]) ulamaData[prov] = {};
      if (!ulamaData[prov][kepakaran]) ulamaData[prov][kepakaran] = [];

      ulamaData[prov][kepakaran].push({ nama, institusi, bio });
    });

    // panggil fungsi render setelah data dimuat
    populateProvinceDropdown(); // misalnya ini memuat dropdown provinsi
  })
  .catch(err => console.error("Gagal ambil data dari Google Sheets:", err));


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
