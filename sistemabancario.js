/* ==========================
   CLASSES (POO)
========================== */

class BancoCentral {
  constructor(limite = 1000) {
    this.limite = limite;
    this.transacoesGrandes = [];
  }

  auditar(transacao) {
    if (transacao.valor > this.limite) {
      this.transacoesGrandes.push(transacao);
      return true;
    }
    return true;
  }

  listarTransacoesGrandes() {
    return this.transacoesGrandes;
  }
}

class Conta {
  constructor(titular, cpf, senha, saldoInicial = 0) {
    this.titular = titular;
    this.cpf = cpf;
    this.senha = senha;
    this.saldo = saldoInicial;
    this.historico = [];
  }

  registrar(tipo, valor, detalhes = "") {
    this.historico.push({
      tipo,
      valor,
      detalhes,
      data: new Date().toLocaleString()
    });
  }

  depositar(valor) {
    if (valor <= 0) throw new Error("Depósito inválido.");
    this.saldo += valor;
    this.registrar("Depósito", valor);
  }

  sacar(valor) {
    if (valor <= 0) throw new Error("Saque inválido.");
    if (valor > this.saldo) throw new Error("Saldo insuficiente.");
    this.saldo -= valor;
    this.registrar("Saque", valor);
  }
}

class Banco {
  constructor(nome, bancoCentral) {
    this.nome = nome;
    this.bancoCentral = bancoCentral;
    this.contas = [];
  }

  criarConta(titular, cpf, senha, saldoInicial = 0) {
    const conta = new Conta(titular, cpf, senha, saldoInicial);
    this.contas.push(conta);
    return conta;
  }

  buscarContaPorCPF(cpf) {
    return this.contas.find(c => c.cpf === cpf);
  }

  autenticar(cpf, senha) {
    const conta = this.buscarContaPorCPF(cpf);
    if (!conta) return null;
    if (conta.senha !== senha) return null;
    return conta;
  }

  transferir(contaOrigem, contaDestino, valor) {
    if (!contaDestino) throw new Error("Conta destino não encontrada.");
    if (valor <= 0) throw new Error("Valor inválido.");

    const transacao = {
      de: contaOrigem.cpf,
      para: contaDestino.cpf,
      valor,
      data: new Date().toISOString(),
      banco: this.nome
    };

    const ok = this.bancoCentral.auditar(transacao);
    if (!ok) throw new Error("Transação bloqueada pelo Banco Central.");

    contaOrigem.sacar(valor);
    contaDestino.depositar(valor);

    contaOrigem.registrar("Transferência enviada", valor, `Para CPF ${contaDestino.cpf}`);
    contaDestino.registrar("Transferência recebida", valor, `De CPF ${contaOrigem.cpf}`);

    return transacao;
  }
}

/* ==========================
   BRADESCO (instância)
========================== */

const bc = new BancoCentral(1000);
const bradesco = new Banco("Bradesco", bc);

// Contas fake
bradesco.criarConta("Sara Mendes", "07810178156", "123", 2000);
bradesco.criarConta("Luiz Dias", "08090499104", "123", 1500);

let contaLogada = null;

/* ==========================
   DOM
========================== */

const telaLogin = document.querySelector("#tela-login");
const telaSistema = document.querySelector("#tela-sistema");

const inputCpf = document.querySelector("#login-cpf");
const inputSenha = document.querySelector("#login-senha");
const btnLogin = document.querySelector("#btn-login");
const loginErro = document.querySelector("#login-erro");

const nomeUsuario = document.querySelector("#nome-usuario");
const saldoAtual = document.querySelector("#saldo-atual");

const valorDeposito = document.querySelector("#valor-deposito");
const valorSaque = document.querySelector("#valor-saque");
const cpfDestino = document.querySelector("#cpf-destino");
const valorTransferencia = document.querySelector("#valor-transferencia");

const btnDepositar = document.querySelector("#btn-depositar");
const btnSacar = document.querySelector("#btn-sacar");
const btnTransferir = document.querySelector("#btn-transferir");
const btnLogout = document.querySelector("#btn-logout");

const listaTransacoes = document.querySelector("#lista-transacoes");
const listaAuditoria = document.querySelector("#lista-auditoria");

function mostrarErro(msg) {
  loginErro.textContent = msg;
  loginErro.classList.remove("d-none");
}
function esconderErro() {
  loginErro.classList.add("d-none");
}

function atualizarTela() {
  if (!contaLogada) return;

  nomeUsuario.textContent = contaLogada.titular;
  saldoAtual.textContent = contaLogada.saldo.toFixed(2);

  // Histórico
  listaTransacoes.innerHTML = "";
  contaLogada.historico.slice().reverse().forEach(t => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <strong>${t.tipo}</strong> - R$ ${t.valor.toFixed(2)}
      <br><small>${t.detalhes || ""} | ${t.data}</small>
    `;
    listaTransacoes.appendChild(li);
  });

  // Auditoria BC
  listaAuditoria.innerHTML = "";
  bc.listarTransacoesGrandes().slice().reverse().forEach(a => {
    const li = document.createElement("li");
    li.className = "list-group-item text-danger";
    li.innerHTML = `
      De <strong>${a.de}</strong> para <strong>${a.para}</strong>
      - R$ ${a.valor.toFixed(2)}
      <br><small>${new Date(a.data).toLocaleString()}</small>
    `;
    listaAuditoria.appendChild(li);
  });
}

/* ==========================
   EVENTOS
========================== */

// Login
btnLogin.addEventListener("click", () => {
  const cpf = inputCpf.value.trim();
  const senha = inputSenha.value.trim();

  const conta = bradesco.autenticar(cpf, senha);
  if (!conta) {
    mostrarErro("CPF ou senha inválidos.");
    return;
  }

  esconderErro();
  contaLogada = conta;

  telaLogin.classList.add("d-none");
  telaSistema.classList.remove("d-none");

  atualizarTela();
});

// Logout
btnLogout.addEventListener("click", () => {
  contaLogada = null;
  telaSistema.classList.add("d-none");
  telaLogin.classList.remove("d-none");
  inputCpf.value = "";
  inputSenha.value = "";
});

// Depósito
btnDepositar.addEventListener("click", () => {
  try {
    const valor = Number(valorDeposito.value);
    contaLogada.depositar(valor);
    valorDeposito.value = "";
    atualizarTela();
  } catch (e) {
    alert(e.message);
  }
});

// Saque
btnSacar.addEventListener("click", () => {
  try {
    const valor = Number(valorSaque.value);
    contaLogada.sacar(valor);
    valorSaque.value = "";
    atualizarTela();
  } catch (e) {
    alert(e.message);
  }
});

// Transferência
btnTransferir.addEventListener("click", () => {
  try {
    const destinoCpf = cpfDestino.value.trim();
    const valor = Number(valorTransferencia.value);

    const contaDestino = bradesco.buscarContaPorCPF(destinoCpf);
    bradesco.transferir(contaLogada, contaDestino, valor);

    cpfDestino.value = "";
    valorTransferencia.value = "";
    atualizarTela();
  } catch (e) {
    alert(e.message);
  }
});
