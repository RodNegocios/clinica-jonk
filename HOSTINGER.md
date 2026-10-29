# Clínica Jönk na Hostinger

A raiz do repositório é a única fonte oficial do site. `index.html`, `assets/`, estilos, scripts, favicon e a foto atualizada de contato ficam diretamente nela. Não existe etapa de compilação nem dependência de banco de dados ou Node.js na hospedagem.

A Hostinger deve copiar a raiz da branch aprovada para a pasta pública do domínio, normalmente `public_html`. Assim, `public_html/index.html` fica disponível diretamente. Os caminhos iniciados por `/` exigem a raiz do domínio, não uma subpasta. Permissões e configuração do domínio continuam sendo responsabilidade da hospedagem.

## Futuras atualizações pelo Codex

Peça para editar somente o conteúdo desejado na raiz, em uma branch separada, preservar os demais elementos e executar as verificações. Não é necessário sincronizar outra cópia do site. Não faça merge nem publique sem autorização.

```sh
node verify.mjs
node serve.mjs
```

O servidor local usa a porta 4173 e suporta requisições parciais do vídeo. Encerre-o com Ctrl+C. A workflow `Verify Hostinger root` verifica os recursos da raiz, a sintaxe dos scripts e o pacote em pushes e pull requests. Tornar essa verificação obrigatória para merges depende da proteção da branch no GitHub.

## ZIP opcional

Com Node.js 24, `zip` e `unzip` instalados:

```sh
node prepare-hostinger.mjs
```

O script gera um ZIP em uma pasta nova dentro de `../hostinger-packages/`, fora do repositório. Outra pasta externa pode ser informada como argumento. O ZIP contém `assets/` e os arquivos públicos diretamente na raiz, incluindo `index.html` e a foto de contato. São incluídos arquivos da raiz com extensões HTML, CSS, JS, SVG, WebP, PNG, JPG/JPEG, GIF, ICO, WOFF/WOFF2, TTF/OTF, MP4 e WebM; ao adicionar um novo formato ou uma nova pasta pública, ajuste a seleção do script explicitamente.

Documentação, scripts `.mjs`, configuração, workflows e histórico Git não entram no ZIP. O script confere integridade, lista de arquivos e SHA-256 após extração, e verifica que a fonte não mudou durante o processo. Cada execução preserva os pacotes anteriores. Não edite os arquivos públicos enquanto gera o pacote.

Quando uma publicação for autorizada, faça backup da versão publicada antes de enviar o conteúdo e preserve arquivos próprios da hospedagem. Confira o domínio após publicar. Gerar o ZIP não publica nada.
