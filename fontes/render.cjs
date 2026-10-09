// Renderiza cada <section class="slide"> de um HTML de arte em PNG no tamanho exato.
// Uso: node render.cjs <arquivo.html> <pasta-de-saída> <prefixo>
// Fontes e logo vêm do repositório do produto e entram em base64 (página via setContent
// não carrega file:// de outra pasta).
const fs = require('fs')
const path = require('path')
const { chromium } = require('/Users/usuario/imobiliaria/frontend/node_modules/playwright')

const FRONT = '/Users/usuario/imobiliaria/frontend'
const b64 = (p) => fs.readFileSync(path.join(FRONT, p)).toString('base64')

const fontFaces = `
@font-face { font-family: 'Cormorant Garamond'; font-weight: 300 700; src: url(data:font/woff2;base64,${b64('app/fonts/cormorant-garamond-variable.woff2')}) format('woff2'); }
@font-face { font-family: 'DM Sans'; font-weight: 100 1000; src: url(data:font/woff2;base64,${b64('app/fonts/dm-sans-variable.woff2')}) format('woff2'); }
@font-face { font-family: 'DM Mono'; font-weight: 400; src: url(data:font/woff2;base64,${b64('app/fonts/dm-mono-400.woff2')}) format('woff2'); }
@font-face { font-family: 'DM Mono'; font-weight: 500; src: url(data:font/woff2;base64,${b64('app/fonts/dm-mono-500.woff2')}) format('woff2'); }
`
const logo = `data:image/png;base64,${b64('public/brand/claus-mark.png')}`

async function main() {
  const [htmlPath, outDir, prefix] = process.argv.slice(2)
  const html = fs
    .readFileSync(htmlPath, 'utf8')
    .replaceAll('{{LOGO}}', logo)
    .replace('<style>', `<style>${fontFaces}`)
    // {{IMG:nome}} -> data URI de <pasta do html>/site/nome.png (capturas do site)
    .replace(/\{\{IMG:([\w-]+)\}\}/g, (_, nome) =>
      `data:image/png;base64,${fs.readFileSync(path.join(path.dirname(htmlPath), 'site', `${nome}.png`)).toString('base64')}`)
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const ok = await page.evaluate(() =>
    ['600 50px "Cormorant Garamond"', '400 20px "DM Sans"', '500 20px "DM Mono"'].map((f) => document.fonts.check(f)),
  )
  if (ok.includes(false)) throw new Error(`fonte não carregou: ${ok}`)

  const slides = await page.$$('section.slide')
  for (const [i, el] of slides.entries()) {
    const out = path.join(outDir, `${prefix}-${i + 1}.png`)
    await el.screenshot({ path: out })
    console.log(out)
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
