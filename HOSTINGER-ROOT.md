# Publicação pela raiz do repositório

A branch `chore/hostinger-root` inclui cópias integrais dos arquivos de `dist/` diretamente na raiz. `index.html`, `assets/`, CSS, JavaScript, favicon e a foto de contato ficam nos caminhos usados pelo site. Os arquivos originais continuam em `dist/`; a configuração existente da Vercel permanece inalterada.

## Próximas atualizações pelo Codex

Use esta versão aprovada como base de uma branch separada. Atualize somente o conteúdo solicitado em `dist/` e copie os arquivos correspondentes para a raiz, preservando nomes e conteúdo. Não edite apenas uma das cópias. Não apague arquivos nem sobrescreva arquivos sem antes conferir eventuais conflitos.

Antes de salvar ou publicar, execute:

```sh
node verify.mjs
node verify-hostinger-root.mjs
```

A segunda verificação retorna erro quando um arquivo de `dist/` estiver ausente ou diferente na raiz. A workflow `Verify Hostinger root` executa essas verificações em pushes e pull requests. Para bloquear merges automaticamente, um administrador precisa tornar essa verificação obrigatória na proteção da branch; essa configuração não é feita por estes arquivos. A verificação não bloqueia uma publicação externa que ignore seu resultado.

Arquivos próprios do repositório, como documentação e scripts, não são tratados como cópias do site. A verificação não exclui arquivos extras. Se futuramente houver uma remoção intencional em `dist/`, revise também a cópia antiga da raiz em uma tarefa explicitamente autorizada.

## Hostinger

Quando houver autorização para publicar, a Hostinger deverá usar a branch aprovada e copiar a raiz para a pasta pública do domínio, normalmente `public_html`. `index.html` deve ficar diretamente nessa pasta. Use a raiz do domínio, pois os recursos usam caminhos iniciados por `/`.

Esta organização não publica o site, não altera a branch `main` e não modifica permissões, DNS ou configurações da hospedagem. A ausência anterior de um índice na raiz é corrigida pela cópia; outros motivos de erro 403 dependem da configuração da Hostinger.

Para enviar apenas os arquivos públicos, o ZIP gerado por `prepare-hostinger.mjs` continua disponível como alternativa. Ele é gerado a partir de `dist/` e não inclui os scripts e a documentação do repositório.
