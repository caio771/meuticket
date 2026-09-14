/* Simulação escolar, sem chamadas de rede ou pagamentos. */
(() => {
  const prefixo = 'meu-ticket:evento:v1:';
  const etapas = [24, 20, 17, 12, 8, 3, 0];
  const evento = { nome: 'Justin Bieber - Live Experience', tipo: 'VIP', quantidade: 1, total: 150 };
  const chave = usuario => prefixo + encodeURIComponent(usuario);
  function ler(usuario) {
    const salvo = localStorage.getItem(chave(usuario));
    if (!salvo) return null;
    const ingresso = JSON.parse(salvo);
    if (!/^MT-[A-Z0-9]{6}$/.test(ingresso.codigo) || !etapas.includes(ingresso.pessoas) || typeof ingresso.nome !== 'string') {
      throw new Error('Não foi possível ler seu ingresso salvo.');
    }
    return ingresso;
  }
  async function alterar(usuario, operacao) {
    if (!usuario) throw new Error('Entre na sua conta para continuar.');
    const executar = () => {
      const ingresso = operacao(ler(usuario));
      localStorage.setItem(chave(usuario), JSON.stringify(ingresso));
      return ingresso;
    };
    return navigator.locks ? navigator.locks.request(chave(usuario), executar) : executar();
  }
  function comprar(usuario, nome) {
    return alterar(usuario, existente => {
      if (existente) return existente;
      const numeros = crypto.getRandomValues(new Uint8Array(6));
      const codigo = 'MT-' + Array.from(numeros, n => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[n % 36]).join('');
      return { ...evento, nome, codigo, status: 'Válido', pessoas: 24, naFila: false, criadoEm: new Date().toISOString() };
    });
  }
  function entrar(usuario) {
    return alterar(usuario, ingresso => {
      if (!ingresso) throw new Error('Simule a compra de um ingresso primeiro.');
      ingresso.naFila = true;
      return ingresso;
    });
  }
  function avancar(usuario) {
    return alterar(usuario, ingresso => {
      if (!ingresso || !ingresso.naFila) throw new Error('Entre na fila primeiro.');
      ingresso.pessoas = etapas[Math.min(etapas.indexOf(ingresso.pessoas) + 1, etapas.length - 1)];
      return ingresso;
    });
  }
  const statusFila = ingresso => ingresso.pessoas === 0 ? 'Entrada liberada' : ingresso.pessoas <= 3 ? 'Você está próximo' : 'Aguardando entrada';
  window.Ingressos = { prefixo, evento, ler, comprar, entrar, avancar, statusFila };
})();

