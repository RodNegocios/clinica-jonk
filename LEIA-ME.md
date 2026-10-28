# Clínica Jönk — arquivos para Vercel

Site completo em HTML, CSS e JavaScript. Atualizado em 28/10/2026 com o destaque DigitalX, carrossel de radiologia e galeria curva com 11 cartões de pacientes, incluindo a nova montagem enviada. Inclui as últimas correções do retrato no desktop e dos ícones no celular, as fotografias otimizadas, o vídeo sincronizado com a rolagem, fontes locais, GSAP e ScrollTrigger.

Não requer banco de dados, chaves de API ou dependências de aplicação. O conteúdo publicado fica em `dist/`. A pasta funciona independentemente do Sites.

## Publicar pela Vercel

1. Extraia o ZIP.
2. Coloque o conteúdo da pasta `clinica-jonk-vercel-2026-10-28-v2` em um repositório GitHub, GitLab ou Bitbucket.
3. Na Vercel, crie um projeto e importe esse repositório.
4. Use como Root Directory a pasta que contém `vercel.json`.
5. Publique. As configurações já estão no arquivo `vercel.json`:

| Configuração | Valor |
| --- | --- |
| Framework Preset | Other |
| Build Command | `node prepare-vercel.mjs` |
| Output Directory | `dist` |
| Install Command | Vazio |

Não é necessário enviar a pasta `.openai` nem conectar o plugin Sites. O ZIP não inclui credenciais ou histórico Git.

Alternativa pelo terminal, dentro da pasta extraída e com Node.js instalado:

```sh
npx vercel --prod
```

Esse comando solicita login na sua conta e publica o projeto. A publicação deve ser executada por você; este pacote não foi implantado na sua conta da Vercel.

## Endereço e domínio próprio

Durante o build, `prepare-vercel.mjs` atualiza os metadados de compartilhamento, a URL canônica e os dados estruturados usando o endereço fornecido pela Vercel. A prioridade é `SITE_URL`, depois `VERCEL_PROJECT_PRODUCTION_URL` e depois `VERCEL_URL`.

Para definir um domínio explicitamente, adicione a variável `SITE_URL` nas configurações do projeto com a URL completa do seu domínio e publique novamente. Conectar o domínio e configurar o DNS são etapas separadas feitas no painel da Vercel. Mantenha habilitado o acesso às System Environment Variables para a detecção automática.

## Editar e visualizar no computador

- `dist/index.html`: textos, contatos, estrutura e ícones SVG.
- `dist/styles.css`: estilos gerais e responsividade.
- `dist/app.js`: navegação, galeria e animações gerais.
- `dist/smile-scene.css`: enquadramento da doutora e estilos da cena de vídeo.
- `dist/smile-scene.js`: sincronização do vídeo com o scroll.
- `dist/care-showcase.css` e `dist/care-showcase.js`: radiologia, galeria de pacientes e visualização ampliada.
- `dist/assets/`: fotografias, vídeo, fontes e bibliotecas locais.

Para visualizar com Node.js, execute na pasta extraída:

```sh
node serve.mjs
```

Abra `http://127.0.0.1:4173`. Use esse servidor em vez de abrir o HTML por duplo clique, pois os recursos usam caminhos a partir da raiz do site. Para encerrar, pressione Ctrl+C.

Verificação dos arquivos:

```sh
node verify.mjs
```

As verificações locais conferem recursos, links internos, contatos e configuração. A publicação e o funcionamento dentro da sua conta Vercel ainda precisam ser confirmados após o deploy. Prévia local revisada nas larguras de 1280, 390 e 320 pixels; carrosséis, teclado, arraste e visualização ampliada conferidos.

## Conteúdo e bibliotecas

Os arquivos de mídia são as versões otimizadas utilizadas no site. Os anexos originais de referência não são necessários para a hospedagem. Os avisos de licença incluídos nas bibliotecas GSAP e ScrollTrigger foram preservados. Fontes utilizadas: DM Sans e DM Serif Display.

Exportado da versão de código `f67a4d6a0bd003d3c6b7d0bd3c18e84a655ea6b4`, com adaptação dos metadados para a nova hospedagem.

Documentação oficial consultada:

- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/environment-variables/system-environment-variables
- https://vercel.com/docs/cli/deploy

Revisão final: cartão “Um olhar individual” removido; “Sorrisos em detalhe” substituído pela montagem Post Gonçalves.png; Radiologia odontológica e Tomografia Computadorizada com o mesmo fundo amarelo. Navegação circular dos 11 cartões, ampliação da montagem e destaque dos serviços conferidos na prévia local.
