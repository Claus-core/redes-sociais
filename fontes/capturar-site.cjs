// Captura as reproduções do produto que o site público já usa (www.useclaus.com),
// em alta resolução e com fundo transparente, para servir de imagem nas artes.
// Uso: node capturar-site.cjs <pasta-de-saída>
const fs = require('fs')
const path = require('path')
const { chromium } = require('/Users/usuario/imobiliaria/frontend/node_modules/playwright')

// [seletor, nome, o que esconder, margem extra em px (para o selo que vaza)]
const ALVOS = [
  ['.s-stage', 'palco', [], 40],
  ['.s-stage-phone', 'celular-formulario', ['.s-stage-browser', '.s-stage-doc'], 24],
  ['.s-stage-doc', 'proposta-assinada', ['.s-stage-browser', '.s-stage-phone'], 70],
]

const TRANSPARENTE = `
  html, body, .claus-site, .s-hero, .s-ink, .s-paper, .s-sheet { background: transparent !important; }
  .s-hero-ink, .s-header, .s-hero-copy { visibility: hidden !important; }
  .s-stage, .s-stage * { box-shadow: none !important; }
`

async function main() {
  const out = process.argv[2]
  fs.mkdirSync(out, { recursive: true })
  const browser = await chromium.launch()
  for (const [sel, nome, esconder, margem] of ALVOS) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1100 },
      deviceScaleFactor: 3,
      reducedMotion: 'reduce',
    })
    await page.goto('https://www.useclaus.com/', { waitUntil: 'networkidle' })
    const css = TRANSPARENTE + esconder.map((s) => `${s} { visibility: hidden !important; }`).join('\n')
    await page.addStyleTag({ content: css })
    const el = page.locator(sel).first()
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1500)
    const b = await el.boundingBox()
    const file = path.join(out, `${nome}.png`)
    await page.screenshot({
      path: file,
      omitBackground: true,
      clip: { x: b.x - margem, y: b.y - margem, width: b.width + 2 * margem, height: b.height + 2 * margem },
    })
    console.log(nome, Math.round(b.width + 2 * margem), 'x', Math.round(b.height + 2 * margem))
    await page.close()
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
