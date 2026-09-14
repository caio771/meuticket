const botoes = document.querySelectorAll('.service-btn');
const content = document.getElementById('content');
const nomeUsuario = sessionStorage.getItem('nomeUsuario') || '';
const usuario = sessionStorage.getItem('idUsuario') || nomeUsuario;
let pagina = 'inicio';
let ocupado = false;
const escapar = valor => String(valor).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const botao = (acao, texto, desabilitado = false) => `<button type="button" class="ticket-btn" data-action="${acao}" ${desabilitado ? 'disabled' : ''}>${texto}</button>`;
const avisoCompra = '<p class="demo-note">Compra fictícia para demonstração. Nenhum pagamento será realizado.</p>';
function avisar(texto) { document.getElementById('mensagem').textContent = texto; }
function evento(ingresso) {
  return `<article class="service-box"><h2>Justin Bieber</h2><p>Live Experience</p><p>Ingresso VIP · 1 pessoa · <strong>R$ 150,00</strong></p>${ingresso ? botao('ingressos', 'VER MEU INGRESSO') : botao('escolher', 'ESCOLHER INGRESSO')}</article>`;
}
function ingressoVirtual(ingresso) {
  return `<article class="service-box"><h2>Justin Bieber</h2><p>Live Experience</p><div class="admission-layout"><dl class="ticket-details"><div><dt>Nome</dt><dd>${escapar(ingresso.nome)}</dd></div><div><dt>Tipo</dt><dd>VIP</dd></div><div><dt>Código</dt><dd>${escapar(ingresso.codigo)}</dd></div><div><dt>Status</dt><dd>Válido</dd></div></dl></div>${botao(ingresso.naFila ? 'fila' : 'entrar', ingresso.naFila ? 'VER FILA' : 'ENTRAR NA FILA')}</article>`;
}
function filaEntrada(ingresso) {
  if (!ingresso) return `<p>Você precisa de um ingresso para entrar na fila.</p>${botao('ingressos', 'VER INGRESSOS')}`;
  if (!ingresso.naFila) return `<p>Ingresso: <strong>${escapar(ingresso.codigo)}</strong></p>${botao('entrar', 'ENTRAR NA FILA')}`;
  return `<article class="service-box"><p>Ingresso: <strong>${escapar(ingresso.codigo)}</strong></p><dl class="ticket-details"><div><dt>Pessoas à frente</dt><dd class="ticket-number">${ingresso.pessoas}</dd></div><div><dt>Tempo estimado</dt><dd>${Math.ceil(ingresso.pessoas * 15 / 24)} minutos</dd></div></dl><p class="ticket-status" role="status">${Ingressos.statusFila(ingresso)}</p>${ingresso.pessoas === 0 ? '<p>Apresente seu ingresso na entrada.</p>' : ''}<div class="ticket-actions">${botao('atualizar', 'ATUALIZAR FILA', ingresso.pessoas === 0)}${botao('ingressos', 'VER MEU INGRESSO')}</div></article>`;
}
function renderizar() {
  if (!usuario) return;
  try {
    const ingresso = Ingressos.ler(usuario);
    let html;
    if (pagina === 'inicio') {
      html = `<section class="welcome"><div class="welcome-text"><h1>Olá, <span>${escapar(nomeUsuario || usuario)}</span>!</h1></div></section>${evento(ingresso)}`;
    } else {
      const titulos = { ingressos: 'Ingressos', escolher: 'Escolher ingresso', resumo: 'Resumo do pedido', fila: 'Fila de entrada' };
      let corpo = '';
      if (pagina === 'ingressos') corpo = ingresso ? ingressoVirtual(ingresso) : evento(ingresso);
      if (pagina === 'escolher') corpo = ingresso ? ingressoVirtual(ingresso) : `<article class="service-box"><h2>Justin Bieber - Live Experience</h2><p>Ingresso: <strong>VIP</strong></p><p>Quantidade: <strong>1</strong></p><p>Valor: <strong>R$ 150,00</strong></p>${botao('resumo', 'SELECIONAR VIP')}</article>`;
      if (pagina === 'resumo') corpo = ingresso ? ingressoVirtual(ingresso) : `<article class="service-box"><dl class="ticket-details"><div><dt>Evento</dt><dd>Justin Bieber - Live Experience</dd></div><div><dt>Ingresso</dt><dd>VIP</dd></div><div><dt>Quantidade</dt><dd>1</dd></div><div><dt>Total</dt><dd>R$ 150,00</dd></div></dl>${avisoCompra}<div class="ticket-actions">${botao('comprar', 'SIMULAR COMPRA')}${botao('escolher', 'VOLTAR')}</div></article>`;
      if (pagina === 'fila') corpo = filaEntrada(ingresso);
      html = `<section class="service-page"><h1>${titulos[pagina]}</h1>${corpo}</section>`;
    }
    content.innerHTML = html;
    const menuAtual = ['escolher', 'resumo'].includes(pagina) ? 'ingressos' : pagina;
    botoes.forEach(b => {
      b.classList.toggle('active', b.dataset.page === menuAtual);
      if (b.dataset.page === menuAtual) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  } catch (erro) { avisar('Não foi possível carregar o ingresso. Tente recarregar a página.'); }
}
botoes.forEach(b => b.addEventListener('click', () => { pagina = b.dataset.page; avisar(''); renderizar(); }));
content.addEventListener('click', async event => {
  const alvo = event.target.closest('[data-action]');
  if (!alvo || ocupado || alvo.disabled || !usuario) return;
  ocupado = true;
  alvo.disabled = true;
  try {
    avisar('');
    const acao = alvo.dataset.action;
    if (['ingressos', 'escolher', 'resumo', 'fila'].includes(acao)) pagina = acao;
    if (acao === 'comprar') { await Ingressos.comprar(usuario, nomeUsuario || usuario); pagina = 'ingressos'; avisar('Ingresso gerado.'); }
    if (acao === 'entrar') { await Ingressos.entrar(usuario); pagina = 'fila'; }
    if (acao === 'atualizar') { await Ingressos.avancar(usuario); avisar('Fila atualizada.'); }
    renderizar();
  } catch (erro) { avisar('Não foi possível concluir a simulação. ' + erro.message); }
  finally { ocupado = false; if (alvo.isConnected) alvo.disabled = false; }
});
window.addEventListener('storage', event => { if (event.key === null || event.key.startsWith(Ingressos.prefixo)) renderizar(); });
window.addEventListener('focus', renderizar);
document.getElementById('btnLogout').addEventListener('click', () => {
  sessionStorage.removeItem('nomeUsuario');
  sessionStorage.removeItem('idUsuario');
  window.location.href = '../Login e cadastro/login.html';
});
if (!usuario) window.location.replace('../Login e cadastro/login.html');
else {
  document.getElementById('nomeUsuario').textContent = nomeUsuario || usuario;
  document.querySelector('.avatar').textContent = (nomeUsuario || usuario).charAt(0).toUpperCase();
  renderizar();
}


