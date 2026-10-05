# Resumo do Projeto — Site OKIAX

> Este documento reúne todo o histórico, decisões e configurações do site institucional da OKIAX, para que qualquer conversa futura já comece com o contexto completo. Mantenha este arquivo atualizado junto com os 3 arquivos do site (`index.html`, `style.css`, `script.js`) na base de conhecimento do Projeto.

---

## 1. Sobre a empresa

**OKIAX** — Tecnologia e Finanças. Empresa que atua com soluções de organização, estruturação e controle de informações e processos financeiros e empresariais.

**Conceitos que o site deve transmitir:** estrutura, direção, controle, inteligência, integração, segurança, tecnologia, profissionalismo, clareza para tomada de decisão.

---

## 2. Stack técnica

- **HTML5 + CSS3 + JavaScript puro** — sem frameworks (sem React, Next.js, etc.).
- 3 arquivos principais: `index.html`, `style.css`, `script.js`.
- Site 100% estático, funciona apenas abrindo o `index.html` localmente.
- **Logo embutida em base64 diretamente no HTML** (não depende de pasta de imagens externa — isso foi corrigido depois de um problema em que a logo quebrava por falta da pasta `assets/`).

### Seções da página (`index.html`)
1. Header (logo + tagline + menu + botão "Fale conosco")
2. Hero principal (título, subtítulo, CTAs, ilustração SVG animada)
3. Problemas que ajudamos a resolver
4. Nossas Soluções
5. Como funciona o atendimento (timeline)
6. Diferenciais
7. Institucional / Sobre a empresa
8. Chamada final para contato (com formulário funcional — ver seção 4)
9. Footer

---

## 3. Design system

### Paleta de cores (extraída da logo oficial da OKIAX)
- Navy: `#12335f` / navy light: `#24518f`
- Verde: `#146b47` / verde light: `#1f8a5e`
- Dourado: `#c9a227` / dourado light: `#e0bf52`
- Creme (texto claro): `#f4f1e9`
- Fundo escuro (ink): `#0b0d10`
- Fundo alternativo claro: `#f7f6f2`

### Tipografia
- Display: `Space Grotesk`
- Corpo: `Inter`
- Mono (labels/eyebrows): `IBM Plex Mono`
- Tagline "- Tecnologia e Finanças -": fonte serifada itálica (`Georgia`), cor dourada.

### Elementos de assinatura visual
- **Logo giratória**: gira lentamente no eixo vertical (efeito 3D com duas faces pré-espelhadas via CSS puro, `rotateY`), pausa ao passar o mouse, respeita `prefers-reduced-motion`. Aplicada apenas na logo do header (não no rodapé).
- **Ícone de 3 barras** (eco do ícone real da logo: navy/verde/dourado) usado como marcador antes dos textos "eyebrow" das seções.
- **Ilustração do Hero**: SVG com pontos dispersos que convergem em 3 barras niveladas (navy/verde/dourado), simbolizando "do disperso ao estruturado".
- **Header (layout atual)**: logo grande centralizada verticalmente à esquerda | coluna central com tagline dourada + menu em "pílula" | botão "Fale conosco" com efeito 3D (relevo, sombra, caixa alta).

### Responsividade
- Desktop, tablet (≤1024px) e mobile (≤720px) com ajustes específicos de tamanho de fonte/logo em cada breakpoint.
- No mobile, a tagline "- Tecnologia e Finanças -" fica oculta (falta de espaço) e o menu vira um dropdown via botão hambúrguer.

---

## 4. Dados de contato usados no site

- **E-mail:** contato@okiax.com.br (link `mailto:` clicável)
- **Telefone:** (11) 92113-4056 (link `tel:` clicável)

### Formulário de contato (seção "Contato")
- Acessado pelos botões **"Fale conosco"** (header), **"Solicitar diagnóstico"** (hero e card de soluções) e pelo item **"Contato"** do menu.
- **Todos os 5 campos são obrigatórios** (Nome completo, Empresa, E-mail, Telefone, Como podemos ajudar?), marcados com asterisco dourado `*` e com aviso explícito no topo do formulário.
- Ao clicar em **"Enviar mensagem"**, todos os campos vazios/inválidos são destacados em vermelho com mensagem específica. E-mail é validado por formato; telefone exige DDD (10 a 13 dígitos) e recebe máscara automática `(11) 92113-4056`.
- **Envio:** serviço gratuito **FormSubmit** (`https://formsubmit.co/ajax/contato@okiax.com.br`), sem back-end próprio. Campo anti-spam invisível (`_honey`) incluído.
- **Ativação (uma única vez):** a primeira mensagem enviada pelo site dispara um e-mail do FormSubmit para `contato@okiax.com.br` com o botão **"Activate Form"**. Só depois de clicar nele as mensagens passam a chegar.
- **Estrutura do e-mail recebido** (assunto: `FORMULÁRIO RECEBIDO PELO SITE - Data: dd/mm/aaaa`):
  - FORMULÁRIO RECEBIDO PELO SITE - Data: (data do envio, fuso de São Paulo)
  - Nome completo / Empresa / E-mail / Telefone / Solicitação (texto do campo "Como podemos ajudar?")
  - "Responder" no e-mail já responde direto ao solicitante (`_replyto`).
- **Após o envio:** botão centralizado na tela com a mensagem "Recebemos sua solicitação! Nossa equipe entrará em contato em breve." Ao clicar (ou tecla Esc), o formulário é limpo e o site volta ao topo da página inicial.
- Se o envio falhar (sem internet, serviço fora do ar), aparece aviso em vermelho sugerindo escrever direto para o e-mail.
- Testar sempre no site publicado (`www.okiax.com.br`), não abrindo o `index.html` localmente.

---

## 5. Infraestrutura e hospedagem

### Repositório
- **GitHub:** conta `OKIAX`, repositório **`site-okiax`** (público).
- Arquivos ficam na raiz do repositório (`index.html`, `style.css`, `script.js`).
- Atualização de arquivo: GitHub → repositório → **"Add file" → "Upload files"** → arrastar o(s) arquivo(s) novo(s) → commit. Isso substitui o(s) arquivo(s) existente(s) automaticamente.

### Hospedagem #1 — Cloudflare Workers
- Domínio raiz **`okiax.com.br`** (sem www) publicado via **Cloudflare Workers**, conectado ao repositório GitHub (deploy automático a cada commit).
- Domínio registrado e com DNS gerenciado no **Cloudflare** (conta mesma do Workers).

### Hospedagem #2 — Vercel
- Projeto **`site-okiax`** na Vercel, conectado ao mesmo repositório GitHub (deploy automático a cada commit).
- Framework Preset: **"Other"** (sem build command, sem output directory — site estático puro).
- Domínio configurado: **`www.okiax.com.br`** (definido como domínio principal do projeto na Vercel).
- URL de fallback da Vercel: `site-okiax.vercel.app`.

### Configuração de DNS (Cloudflare)
- Registro **CNAME** para `www` apontando para o valor fornecido pela Vercel (formato `<hash>.vercel-dns-XXX.com`, específico do projeto — sempre confirmar o valor atual em Vercel → Settings → Domains → View DNS configuration).
- **Proxy status do registro CNAME do www: DESATIVADO** ("DNS only", nuvem cinza) — necessário para evitar conflito de certificado SSL entre Cloudflare e Vercel.
- **Atenção histórica:** já ocorreu um erro de digitação nesse CNAME (faltou a letra "m" no final do valor), causando "Invalid Configuration" na Vercel e falha total de resolução (visível como todos os pontos vermelhos no whatsmydns.net). Sempre conferir o valor letra por letra ao configurar.
- Cache negativo de DNS (quando um registro esteve errado) pode levar até ~1 hora para expirar globalmente, mesmo depois do registro corrigido — isso é normal e não indica novo erro.

### Resultado final (dois acessos simultâneos, redundantes)
| Endereço | Hospedado em |
|---|---|
| `okiax.com.br` (sem www) | Cloudflare Workers |
| `www.okiax.com.br` (domínio divulgado oficialmente) | Vercel |

---

## 6. Fluxo de trabalho para futuras alterações

1. Pedir a alteração numa conversa (dentro do Projeto "Site OKIAX", para já ter este contexto).
2. Claude edita os arquivos e devolve para download.
3. Baixar os arquivos atualizados.
4. Subir no GitHub (repositório `site-okiax` → "Add file" → "Upload files" → substituir).
5. Cloudflare Workers e Vercel detectam o commit e republicam **automaticamente** — não é necessário repetir nenhuma configuração de build, domínio ou DNS.
6. **Importante:** atualizar também os arquivos (e este resumo, se relevante) na base de conhecimento do Projeto, para manter o contexto sempre com a versão mais recente.

---

## 7. Contas envolvidas (sem credenciais — apenas referência)

- GitHub: conta `OKIAX`
- Cloudflare: mesma conta que registra/gerencia o domínio `okiax.com.br`
- Vercel: conta criada via login "Continue with GitHub" (vinculada à conta OKIAX do GitHub), com 2FA (autenticador) ativado.

---

## 8. Histórico resumido de decisões (linha do tempo)

1. Criação do site institucional completo (9 seções) em HTML/CSS/JS puro.
2. Ajustes de contato (telefone e e-mail reais, com links clicáveis).
3. Logo embutida em base64 (corrigindo problema de imagem quebrada por dependência de pasta externa).
4. Adição de efeito de giro 3D na logo do header.
5. Reestruturação do header (logo ampliada e centralizada, tagline dourada maior, menu centralizado em pílula, botão "Fale conosco" redesenhado com efeito 3D), seguindo mockup fornecido pelo usuário.
6. Publicação em produção: GitHub → Cloudflare Workers (`okiax.com.br`) e GitHub → Vercel (`www.okiax.com.br`), com DNS configurado no Cloudflare.
7. Formulário de contato funcional: todos os campos obrigatórios (asterisco + aviso), validação com destaque dos campos em branco, envio real para `contato@okiax.com.br` via FormSubmit em formato padronizado, e confirmação em botão centralizado que retorna ao início do site.

---

*Última atualização deste resumo: sincronizar sempre que os arquivos do site forem alterados.*
