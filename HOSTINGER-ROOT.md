# Estrutura oficial do site

A raiz é a única fonte oficial: `index.html`, `assets/`, CSS, JavaScript, favicon e a foto atualizada de contato. A antiga pasta `dist/` foi removida após comparação byte a byte com os 73 arquivos públicos da raiz. Esses arquivos da raiz permaneceram intactos.

Use `HOSTINGER.md` para o fluxo de atualização, validação e preparação do ZIP. Não recrie uma segunda cópia do site. `verify.mjs` valida a estrutura da raiz e rejeita a presença da antiga pasta duplicada; a comparação entre duas cópias deixou de ser necessária.

A publicação na Hostinger continua usando a raiz do repositório em `public_html`, sem mudar caminhos ou visual. Esta mudança não publica nada nem modifica a branch `main`.

As alterações foram separadas em commits: adaptação das ferramentas e documentação, seguida da remoção das cópias antigas. O histórico Git preserva todos os originais; reverta os dois commits, do mais recente para o mais antigo, para recuperar a estrutura anterior. Antes de reverter, preserve alterações posteriores e resolva eventuais conflitos em uma branch separada. Não é necessário reescrever o histórico nem fazer push forçado.

`MATERIAIS-E-TESTES.md` é um registro histórico da preparação original e pode mencionar a organização antiga; não é uma instrução atual de publicação.
