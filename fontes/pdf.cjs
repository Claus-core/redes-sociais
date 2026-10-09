// Junta PNGs de 1080×1350 num PDF (uma tela por página), para o carrossel-documento do LinkedIn.
// Uso: node pdf.cjs <saída.pdf> <img1.png> <img2.png> ...
const fs = require('fs')
const { chromium } = require('/Users/usuario/imobiliaria/frontend/node_modules/playwright')
async function main() {
  const [out, ...imgs] = process.argv.slice(2)
  const pages = imgs
    .map((p) => `<img src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}">`)
    .join('')
  const html = `<!doctype html><html><head><style>
    @page { size: 1080px 1350px; margin: 0; }
    * { margin: 0; padding: 0; }
    img { display: block; width: 1080px; height: 1350px; break-after: page; }
  </style></head><body>${pages}</body></html>`
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'load' })
  await page.pdf({ path: out, width: '1080px', height: '1350px', printBackground: true })
  await browser.close()
  console.log(out)
}
main().catch((e) => { console.error(e); process.exit(1) })
