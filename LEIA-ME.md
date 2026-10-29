# Clínica Jönk

Site estático em HTML, CSS e JavaScript. A única fonte oficial fica na raiz do repositório. Não requer banco de dados, chaves de API ou dependências npm. Fotografias, vídeo, fontes, GSAP e ScrollTrigger são locais; os avisos de licença das bibliotecas permanecem preservados.

## Arquivos do site

- `index.html`: textos, contatos, estrutura e ícones.
- `styles.css`: estilos gerais e responsividade.
- `app.js`: navegação, galeria e animações gerais.
- `smile-scene.css` e `smile-scene.js`: cena de vídeo sincronizada com a rolagem.
- `care-showcase.css` e `care-showcase.js`: radiologia, galeria de pacientes e ampliação.
- `assets/`: fotografias, vídeo, fontes e bibliotecas locais.
- `foto da clinina jok atualiza para ser aplicada.webp`: foto atualizada da seção de contato; a galeria conserva sua própria imagem.

## Desenvolvimento e verificação

Com Node.js 24, execute na raiz:

```sh
node verify.mjs
node serve.mjs
```

O servidor local usa a porta 4173. Use-o em vez de abrir o HTML por duplo clique, pois os recursos usam caminhos a partir da raiz do domínio. Encerre com Ctrl+C. Edite diretamente os arquivos da raiz em uma branch separada e execute as verificações antes de salvar. Não é necessário gerar ou sincronizar uma segunda pasta.

## Hostinger

Consulte `HOSTINGER.md`. Na integração nativa GitHub → Hostinger, use a branch `main` e copie a raiz para `public_html`, onde `index.html` deve ficar diretamente. Não há build, instalação de dependências ou ZIP nesse fluxo. A ativação da conexão e da implantação automática é feita no painel da hospedagem, separadamente. O ZIP opcional pode ser gerado com `node prepare-hostinger.mjs` para outros fluxos; a geração não publica nada. Publicação e merge dependem de autorização explícita.

## Alternativa Vercel

A configuração preservada em `vercel.json` usa framework Other, `node prepare-vercel.mjs` como comando de preparação e `.` como saída. O site já está pronto; esse comando somente adapta metadados ao endereço informado por `SITE_URL`, `VERCEL_PROJECT_PRODUCTION_URL` ou `VERCEL_URL`, nessa ordem.

Se uma dessas variáveis estiver definida, executar o comando altera `index.html` da raiz. Não é necessário executá-lo para a Hostinger nem para visualizar localmente. Teste-o em uma cópia temporária quando estiver apenas validando ferramentas. A configuração da Vercel foi adaptada localmente; uma publicação real nessa plataforma não foi validada nesta limpeza.

Configuração de domínio, DNS e publicação são etapas separadas. Nenhum script de preparação realiza login ou publicação.

## Histórico e reversão

`MATERIAIS-E-TESTES.md` conserva o registro histórico original. `HOSTINGER-ROOT.md` explica a migração para fonte única e a reversão pelos commits Git. Os originais continuam recuperáveis pelo histórico; não foi feita alteração de conteúdo ou aparência nos arquivos públicos.
