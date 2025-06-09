const sheetURL = "https://docs.google.com/spreadsheets/d/1S-d2DSuKmbmly8x6QEEqGzElaE-LDzO638lXdm-4aPY/gviz/tq?sheet=Sheet1";

let rows = [];

fetch(sheetURL)
  .then(res => res.text())
  .then(txt => {
    const json = JSON.parse(txt.substring(47, txt.length - 2));
    rows = json.table.rows.map(r => ({
      provinsi: r.c[0]?.v,
      kepakaran: r.c[1]?.v,
      nama: r.c[2]?.v,
      institusi: r.c[3]?.v,
      bio: r.c[4]?.v
    }));
    initMapListeners(); // Pasang event klik setelah data siap
  })
  .catch(e => console.error("Error fetch sheet:", e));

function initMapListeners() {
  const svgObj = document.getElementById("svgMap");
  svgObj.addEventListener("load", () => {
    const svgDoc = svgObj.contentDocument;
    svgDoc.querySelectorAll("a[id]").forEach(el => {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        showUlama(el.id);
      });
    });
  });
}

function showUlama(prov) {
  const list = rows.filter(r => r.provinsi === prov);
  const out = document.getElementById("output");
  if (list.length === 0) {
    out.innerHTML = `<h3>${prov}</h3><p><em>Tidak ada data ulama.</em></p>`;
    return;
  }
  let html = `<h3>${prov}</h3><ul>`;
  list.forEach(u => {
    html += `<li><strong>${u.nama}</strong> (${u.kepakaran}) — <em>${u.institusi}</em><br>${u.bio}</li>`;
  });
  html += "</ul>";
  out.innerHTML = html;
}
