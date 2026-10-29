# Clínica Jönk na Hostinger

A raiz do repositório é a única fonte oficial do site. `index.html`, `assets/`, estilos, scripts, favicon e a foto atualizada de contato ficam diretamente nela. Não existe etapa de compilação nem dependência de banco de dados ou Node.js na hospedagem.

A Hostinger deve copiar a raiz da branch aprovada para a pasta pública do domínio, normalmente `public_html`. Assim, `public_html/index.html` fica disponível diretamente. Os caminhos iniciados por `/` exigem a raiz do domínio, não uma subpasta. Permissões e configuração do domínio continuam sendo responsabilidade da hospedagem.

## Integração nativa GitHub → Hostinger

Para a conexão feita pelo responsável pela hospedagem, use o repositório `RodNegocios/clinica-jonk`, a branch `main` e a raiz do repositório como origem. O destino deve ser a pasta pública do domínio `clinicajonk.com`, normalmente `public_html`, com `index.html` diretamente nela. Não selecione `dist/` nem uma subpasta como origem.

O conteúdo já está pronto para servir: não há comando de build, instalação de dependências ou geração de arquivos na Hostinger. Node.js é usado apenas nas ferramentas locais e no CI. O fluxo normal não usa ZIP, download ou upload manual. `vercel.json` pertence à alternativa Vercel e não é uma instrução para a Hostinger.

Antes de conectar ao site em produção, o responsável deve preservar um backup da pasta pública atual e conferir arquivos próprios da hospedagem, como `.htaccess`, `.well-known` e eventuais arquivos de validação. Eles não são gerenciados por este repositório e não devem ser apagados. Confira no painel o comportamento de implantação em diretório existente antes da primeira sincronização.

Quando a integração e a implantação automática estiverem habilitadas no painel, atualizações da `main` poderão ser publicadas por esse fluxo. A presença destes arquivos no GitHub, por si só, não configura a conexão nem garante que a implantação automática esteja ativada. Esta alteração do repositório não modifica o painel, DNS ou credenciais.

Após cada implantação, confira a página inicial, imagens, fontes, vídeo, navegação móvel, carrosséis, ampliação de imagens e links de contato no domínio. Recursos usam caminhos a partir de `/`, portanto a publicação deve ocorrer na raiz do domínio.

## Futuras atualizações pelo Codex

Peça para editar somente o conteúdo desejado na raiz, em uma branch separada, preservar os demais elementos e executar as verificações. Não é necessário sincronizar outra cópia do site. Não faça merge nem publique sem autorização.

```sh
node verify.mjs
node serve.mjs
```

O servidor local usa a porta 4173 e suporta requisições parciais do vídeo. Encerre-o com Ctrl+C. A workflow `Verify Hostinger root` verifica os recursos da raiz, a sintaxe dos scripts e o pacote em pushes e pull requests. Tornar essa verificação obrigatória para merges depende da proteção da branch no GitHub.

## Reversão segura

Antes de uma atualização, registre o commit atualmente publicado e mantenha o backup da hospedagem. A base desta documentação é `bdc96dfa7fcd2b72ae3caae4c05abf12c00c1a3c`, que já contém os 73 arquivos públicos diretamente na raiz; isso não comprova qual commit está servido no domínio.

Se uma alteração futura causar regressão, reverta o PR responsável em uma nova branch com `git revert`, execute as verificações e incorpore o PR de reversão à `main`. Para um merge commit, use `git revert -m 1 <commit-do-merge>` após conferir seus pais. A integração deve então implantar a reversão; confirme o resultado no domínio. Não use reset remoto nem push forçado. O backup da hospedagem é a alternativa para incidentes da primeira conexão, cujo comportamento depende do painel.

## ZIP opcional para uso fora da integração

Com Node.js 24, `zip` e `unzip` instalados:

```sh
node prepare-hostinger.mjs
```

O script gera um ZIP em uma pasta nova dentro de `../hostinger-packages/`, fora do repositório. Outra pasta externa pode ser informada como argumento. O ZIP contém `assets/` e os arquivos públicos diretamente na raiz, incluindo `index.html` e a foto de contato. São incluídos arquivos da raiz com extensões HTML, CSS, JS, SVG, WebP, PNG, JPG/JPEG, GIF, ICO, WOFF/WOFF2, TTF/OTF, MP4 e WebM; ao adicionar um novo formato ou uma nova pasta pública, ajuste a seleção do script explicitamente.

Documentação, scripts `.mjs`, configuração, workflows e histórico Git não entram no ZIP. O script confere integridade, lista de arquivos e SHA-256 após extração, e verifica que a fonte não mudou durante o processo. Cada execução preserva os pacotes anteriores. Não edite os arquivos públicos enquanto gera o pacote.

Quando uma publicação for autorizada, faça backup da versão publicada antes de enviar o conteúdo e preserve arquivos próprios da hospedagem. Confira o domínio após publicar. Gerar o ZIP não publica nada.
