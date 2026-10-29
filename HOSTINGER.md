# Preparar o site para a Hostinger

O site completo fica em `dist/`. Essa continua sendo a única pasta de origem do site. O pacote contém cópias dos arquivos, sem alterar HTML, imagens, estilos, scripts, nomes ou metadados. A preparação não publica nada e não usa credenciais da Hostinger.

## Gerar o pacote

Requisitos locais: Node.js 24 e os comandos `zip` e `unzip`. Não é necessário instalar pacotes npm. A hospedagem recebe apenas arquivos estáticos; não precisa executar Node.js.

Na raiz do repositório, execute:

```sh
node verify.mjs
node prepare-hostinger.mjs
```

O script mostra o caminho do ZIP gerado em uma nova pasta dentro de `../hostinger-packages/`, fora do repositório. Cada execução cria uma pasta diferente, preservando pacotes anteriores. Opcionalmente, informe outra pasta de saída:

```sh
node prepare-hostinger.mjs /tmp/hostinger-packages
```

Antes de concluir, o script verifica a integridade do ZIP, extrai uma cópia temporária e compara a lista e o SHA-256 de todos os arquivos com `dist/`. Também confirma que os arquivos de origem permaneceram intactos. Não execute alterações em `dist/` ao mesmo tempo que a preparação.

## Organização do pacote

```text
clinica-jonk-hostinger.zip
├── index.html
├── styles.css
├── app.js
├── assets/
└── demais arquivos de dist/
```

`index.html` fica diretamente na raiz do ZIP, sem uma pasta `dist/` envolvendo o conteúdo. A nova foto de contato também é incluída com o nome original. Documentação, histórico Git e scripts de preparação ficam fora do pacote.

## Publicar manualmente, quando autorizado

No Gerenciador de Arquivos da Hostinger, identifique a pasta pública do domínio (normalmente `public_html`). Antes de substituir arquivos, baixe um backup da versão publicada. Envie e extraia o conteúdo do ZIP nessa pasta, deixando `index.html` diretamente nela. Preserve arquivos próprios da hospedagem; não apague a pasta pública inteira.

Os caminhos atuais começam por `/`, portanto este pacote deve ficar na raiz pública do domínio, não em uma subpasta. Esta preparação não altera DNS, domínio, configurações da Hostinger nem metadados de compartilhamento. O script `prepare-vercel.mjs` não é necessário para gerar este ZIP.

Depois de uma publicação autorizada, confira a página, imagens, foto de contato, galeria, menus, vídeo e links no domínio. A validação local do pacote não substitui a verificação após publicação. Mantenha o backup para restaurar a versão anterior se necessário.

## Próximas atualizações pelo chat do Codex

Você pode pedir: “Atualize [conteúdo desejado] em uma branch separada, preserve os demais elementos, execute a verificação e gere o ZIP para Hostinger. Não publique.”

O fluxo é alterar somente o conteúdo solicitado em `dist/`, revisar as diferenças, executar `node verify.mjs` e `node prepare-hostinger.mjs` e entregar o caminho do novo ZIP. Não edite o ZIP nem mantenha outra cópia manual do site no repositório. Use a versão aprovada do site como base da branch e não integre alterações na `main` sem autorização. A branch inicial de preparação inclui a atualização da foto de contato de `fix/contact-clinic-photo`.
