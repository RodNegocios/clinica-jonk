# Revisão de radiologia e pacientes — 28/10/2026

Radiologia odontológica passou a ser o primeiro item de Cuidados. O painel apresenta o logotipo original da DigitalX e destaca Tomografia Computadorizada, com o contato da clínica para informações sobre exames. Não foram adicionadas afirmações sobre fornecedores de equipamentos.

O carrossel de radiologia usa a capa e os sete registros de exames enviados: tomografia (dois arquivos PNG), reconstrução 3D, cortes tomográficos, radiografia, panorâmica infantil e panorâmica com qualidade de imagem. As fotografias de exames são exibidas inteiras e podem ser ampliadas. A capa recebe apenas enquadramento CSS. O logo original foi preservado em PNG.

A nova seção Sorrisos vem imediatamente após Cuidados. Usa as doze fotografias de pacientes, de número 2 a 13. A composição é uma galeria circular em arco, inspirada na referência fornecida, implementada em HTML/CSS/JavaScript para manter a arquitetura estática do site. Tem arraste com inércia, movimento contínuo suave, pausa, setas, teclado e ampliação. A rolagem vertical da página permanece livre.

Os retratos têm enquadramento central. As montagens 6, 11, 12 e 13 e os registros aproximados 2 e 4 permanecem inteiros. A fotografia 8, enviada de lado, é girada em 90 graus na exibição por CSS. Não houve alteração no conteúdo clínico dos arquivos nem criação de nomes, diagnósticos ou depoimentos. Todos os 21 anexos desta revisão foram usados. Os nomes de origem e as dimensões estão em new-assets.json.

As fotografias receberam versões WebP e miniaturas responsivas. O carregamento é adiado até a proximidade da seção. A animação para fora da tela e em abas ocultas; a preferência por movimento reduzido desativa a deriva e a curvatura. Não há dependência de React, WebGL, APIs externas ou banco de dados.

Validação realizada na prévia local: sintaxe JavaScript, referências de arquivos e âncoras; inspeção visual em 1280, 390 e 320 pixels; nenhum transbordamento horizontal de página observado; troca de serviços e retorno ao exame selecionado; avanços das 12 fotos e retorno ao início; teclado, arraste, pausa, abertura, navegação e fechamento do visualizador. A foto girada foi conferida em 320 pixels. Sem erros ou avisos JavaScript na sessão. Não houve teste em aparelho físico nem emulação da preferência de movimento reduzido.

Os scripts prepare-new-assets.mjs, update-care-showcase.mjs e finalize-showcase.mjs foram usados na preparação desta revisão; não são necessários para hospedar o site. O HTML/CSS/JS final fica em dist/.

## Ajustes das anotações de 28/10/2026

O cartão “Um olhar individual” (antiga foto 12, arquivo paciente-4) foi removido por completo. “Sorrisos em detalhe” (foto 11) recebeu a montagem Post Gonçalves.png, preservada inteira, com versões WebP de 1080×1350 e 640×800. Os dois registros separados anteriores foram retirados dos arquivos públicos. A galeria passou a ter 11 cartões; sua contagem e navegação usam a quantidade presente no HTML. Os destaques de Radiologia odontológica e Tomografia Computadorizada agora usam o mesmo fundo amarelo.
