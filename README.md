# Redes sociais do Claus

Artes já aprovadas para o Instagram ([@claus.imob](https://www.instagram.com/claus.imob/)) e a
[página do Claus no LinkedIn](https://www.linkedin.com/company/145274869).

O Buffer só aceita imagem por link público, então cada arte fica aqui e o post aponta para o
link direto dela:

```text
https://raw.githubusercontent.com/Claus-core/redes-sociais/main/artes/AAAA-MM/<arquivo>.png
```

## Regras

- **Este repositório é público, e o histórico do git também.** Uma arte que entrou não sai mais,
  mesmo que o arquivo seja apagado depois.
- **Só entra arte já aprovada.** Rascunho e versão descartada ficam fora.
- **Nunca** foto de cliente, dado de imobiliária, print de tela com dado real, chave ou senha.
- Arquivo publicado não é sobrescrito: correção vira arquivo novo (`-v2`). Um post agendado pode
  estar apontando para o link antigo.

## Organização

```text
artes/
  2026-10/
    2026-10-14-assinatura-pelo-celular-ig.png
    2026-10-14-assinatura-pelo-celular-li.png
```

- Uma pasta por mês (`AAAA-MM`).
- Nome do arquivo: `AAAA-MM-DD-assunto-canal.png`. A data é a da publicação prevista, e o canal
  é `ig` (Instagram) ou `li` (LinkedIn). Carrossel ganha o número da tela no fim: `-ig-1.png`, `-ig-2.png`…
- PNG, nos tamanhos de cada rede: 1080×1350 (retrato) ou 1080×1080 no Instagram; 1200×1200 ou
  1200×627 no LinkedIn.
- Carrossel no LinkedIn é um **PDF** (post de documento), com as mesmas telas: `-li.pdf`.

## Como as artes são feitas

Cada arte é uma página HTML na direção "Tinta e papel" do Manual da Marca, renderizada em PNG
com Playwright. O código fica em `fontes/`:

- `fontes/<post>/arte.html`: a arte. Cada `<section class="slide">` vira uma tela.
- `fontes/render.cjs`: gera os PNGs. As fontes e a logo vêm do repositório do produto
  (`imobiliaria/frontend`); `{{IMG:nome}}` puxa `fontes/<post>/site/nome.png`.
- `fontes/capturar-site.cjs`: captura as telas do produto que o site já mostra (useclaus.com),
  em alta resolução e fundo transparente, para a pasta `site/` do post. Não versionamos as
  capturas: o script as refaz.
- `fontes/pdf.cjs`: junta os PNGs num PDF para o LinkedIn.

```bash
node fontes/capturar-site.cjs fontes/<post>/site
node fontes/render.cjs fontes/<post>/arte.html /tmp/saida tela
node fontes/pdf.cjs artes/AAAA-MM/<post>-li.pdf /tmp/saida/tela-{1,2,3,4,5}.png
```
