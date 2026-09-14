/* Repositório do protótipo: substitua ler/alterar ao integrar com o banco. */
(() => {
  const chave = 'meu-ticket:filas:v1';
  const servicos = [
    { id: 'geral', nome: 'Atendimento Geral', prefixo: 'A', minutos: 5 },
    { id: 'prioritario', nome: 'Atendimento Prioritário', prefixo: 'P', minutos: 5 }
  ];
  const ativo = t => ['aguardando', 'atendendo'].includes(t.status);
  function ler() {
    const salvo = localStorage.getItem(chave);
    if (!salvo) return { versao: 1, contadores: { geral: 0, prioritario: 0 }, tickets: [] };
    const estado = JSON.parse(salvo);
    if (estado.versao !== 1 || !Array.isArray(estado.tickets) || !estado.contadores) throw new Error('Dados da fila inválidos.');
    return estado;
  }
  async function alterar(operacao) {
    const executar = () => {
      const estado = ler();
      operacao(estado);
      localStorage.setItem(chave, JSON.stringify(estado));
    };
    return navigator.locks ? navigator.locks.request(chave, executar) : executar();
  }
  function emitir(usuario, servicoId) {
    return alterar(e => {
      if (e.tickets.some(t => t.usuario === usuario && ativo(t))) throw new Error('Você já possui um ticket ativo. Acompanhe ou cancele seu ticket.');
      const s = servicos.find(s => s.id === servicoId);
      if (!s) throw new Error('Serviço indisponível.');
      const numero = ++e.contadores[servicoId];
      e.tickets.push({ id: `${servicoId}-${numero}`, usuario, servico: servicoId, senha: s.prefixo + String(numero).padStart(3, '0'), status: 'aguardando', criadoEm: new Date().toISOString() });
    });
  }
  function cancelar(usuario) {
    return alterar(e => {
      const t = e.tickets.find(t => t.usuario === usuario && ativo(t));
      if (!t) throw new Error('Não há ticket ativo para cancelar.');
      t.status = 'cancelado';
      t.encerradoEm = new Date().toISOString();
    });
  }
  function chamar(servico) {
    return alterar(e => {
      const atual = e.tickets.find(t => t.servico === servico && t.status === 'atendendo');
      const proximo = e.tickets.find(t => t.servico === servico && t.status === 'aguardando');
      if (atual) { atual.status = 'finalizado'; atual.encerradoEm = new Date().toISOString(); }
      if (proximo) proximo.status = 'atendendo';
    });
  }
  function resumo(e, servico) {
    return { atual: e.tickets.find(t => t.servico === servico && t.status === 'atendendo'), fila: e.tickets.filter(t => t.servico === servico && t.status === 'aguardando') };
  }
  window.Filas = { chave, servicos, ativo, ler, emitir, cancelar, chamar, resumo };
})();
