google.charts.load('current', {
  packages: ['corechart', 'table'],
  callback: drawRegions
});

function drawRegions() {
  const url = 'https://docs.google.com/spreadsheets/d/1S-d2DSuKmbmly8x6QEEqGzElaE-LDzO638lXdm-4aPY/gviz/tq?sheet=Sheet1';

  fetch(url)
    .then(res => res.text())
    .then(rep => {
      const json = JSON.parse(rep.substr(47).slice(0, -2));
      const rows = json.table.rows.map(r => ({
        provinsi: r.c[0]?.v,
        kepakaran: r.c[1]?.v,
        ulama: r.c[2]?.v
      }));

      const svgObject = document.getElementById("svgMap");

      svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument;
        const regions = svgDoc.querySelectorAll("a");

        regions.forEach(region => {
          region.style.cursor = 'pointer';
          region.addEventListener("click", function () {
            const id = region.id;
            const filtered = rows.filter(r => r.provinsi === id);
            let html = `<h3>${id}</h3>`;
            if (filtered.length === 0) {
              html += `<p><em>Belum ada data ulama.</em></p>`;
            } else {
              html += '<ul>';
              filtered.forEach(r => {
                html += `<li><strong>${r.ulama}</strong> – ${r.kepakaran}</li>`;
              });
              html += '</ul>';
            }
            document.getElementById("output").innerHTML = html;
          });
        });
      });
    });
}
