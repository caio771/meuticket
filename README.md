# Meu Ticket — evento fictício

Abra `Login e cadastro/login.html` pelo servidor local do editor e use seu login existente.

1. No início, abra **ESCOLHER INGRESSO** no evento Justin Bieber - Live Experience.
2. Selecione VIP (1 ingresso, R$ 150,00) e confira o resumo.
3. Clique em **SIMULAR COMPRA** para receber o ingresso com seu nome, código MT-XXXXXX.
4. Clique em **ENTRAR NA FILA**.
5. Use **ATUALIZAR FILA** para avançar: 24 → 20 → 17 → 12 → 8 → 3 → 0.
6. Com 3 pessoas, aparece o aviso de proximidade. Com 0, aparece **ENTRADA LIBERADA!**.

A compra é fictícia e não realiza pagamentos. Há um ingresso por conta nesta demonstração; repetir a compra mantém o ingresso existente. O ingresso e a posição ficam no localStorage do mesmo navegador, separados pelo usuário do login. Recarregar ou sair da conta não reinicia a fila. Limpar os dados do site remove a simulação.

O login e o cadastro continuam usando o Google Apps Script existente, sem alterações nesta adaptação. Não há chamadas de rede no fluxo de compra.

`Usuario/ingressos.js` contém a simulação e a persistência; `Usuario/script.js` renderiza as telas. O menu, cabeçalho e estilos existentes são reaproveitados. `Usuario/fila.js` da versão anterior foi preservado, mas não é carregado pelo novo fluxo.

Validação: lógica executada com armazenamento simulado e telas executadas com DOM simulado, incluindo compra repetida, separação por conta, progressão até zero e ingresso persistido. Verificação visual em navegador e login com conta real não realizados.

