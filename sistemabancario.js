/*1. CLASSES DO SISTEMA BANCÁRIO
   São estruturas que definem como o sistema funciona */

// BancoCentral controla transações grandes (auditoria)
class BancoCentral {
  constructor(limite = 1000) {
    this.limite = limite;
    this.transacoesGrandes = [];
  }

  // Guarda transações acima do limite (é chamado ao transferir)
  auditar(t) {
    if (t.valor > this.limite) this.transacoesGrandes.push(t);
    return true;
  }

  // Retorna todas as transações auditadas
  listarTransacoesGrandes() {
    return this.transacoesGrandes;
  }
}


// Conta representa cada cliente do banco
class Conta {
  constructor(titular, cpf, senha, saldoInicial = 0) {
    this.titular = titular;
    this.cpf = cpf;
    this.senha = senha;
    this.saldo = saldoInicial;
    this.historico = [];
  }

  // Armazena operações realizadas (dep, saque, transf)
  registrar(tipo, valor, detalhes = "") {
    this.historico.push({
      tipo, valor, detalhes,
      data: new Date().toLocaleString()
    });
  }

  // Depósito (chamado ao clicar no botão "Depositar")
  depositar(v){
    if(v<=0) throw new Error("Valor inválido");
    this.saldo += v;
    this.registrar("Depósito", v);
  }

  // Saque (chamado ao clicar no botão "Sacar")
  sacar(v){
    if(v<=0) throw new Error("Valor inválido");
    if(v>this.saldo) throw new Error("Saldo insuficiente");
    this.saldo -= v;
    this.registrar("Saque", v);
  }
}


// Banco gerencia contas, login e transferências
class Banco {
  constructor(nome, bc){
    this.nome = nome;
    this.bc = bc; // ligação com Banco Central
    this.contas = [];
  }

  // Cria conta (usado no início do sistema)
  criarConta(t,c,s,si=0){
    const conta = new Conta(t,c,s,si);
    this.contas.push(conta);
    return conta;
  }

  // Busca conta pelo CPF
  buscar(cpf){
    return this.contas.find(x=>x.cpf===cpf);
  }

  // Autenticação (usado ao clicar em "Entrar")
  autenticar(cpf,senha){
    const c = this.buscar(cpf);
    if(!c || c.senha!==senha) return null;
    return c;
  }

  // Transferência entre duas contas
  transferir(origem,destino,valor){
    if(!destino) throw new Error("Conta destino inexistente.");

    // Auditoria do Banco Central
    const trans = { de: origem.cpf, para: destino.cpf, valor, data: new Date().toISOString() };
    this.bc.auditar(trans);

    // Ações nas contas
    origem.sacar(valor);
    destino.depositar(valor);

    // Registrar histórico
    origem.registrar("Transferência enviada", valor, `Para ${destino.cpf}`);
    destino.registrar("Transferência recebida", valor, `De ${origem.cpf}`);
  }
}



/*2. INSTÂNCIAS — criação do banco e contas iniciais*/

const bc = new BancoCentral(1000);
const banco = new Banco("Bradesco", bc);

// Contas cadastradas de exemplo (existem no sistema ao iniciar)
banco.criarConta("Sara Mendes", "07810178156", "123", 4000);
banco.criarConta("Luiz Dias", "08090499104", "123", 1500);

let conta = null; // guarda a conta logada



/* 3. CONEXÃO COM O DOM — elementos da interface*/

const saldo = document.querySelector("#saldo-atual");
const nome = document.querySelector("#nome-usuario");
const listaTransacoes = document.querySelector("#lista-transacoes");
const listaAuditoria = document.querySelector("#lista-auditoria");
const btnLogout = document.querySelector("#btn-logout");



/* 4. FUNÇÃO PARA ATUALIZAR A INTERFACE
   Chamado após login, depósito, saque e transferência*/

function atualizar(){
  if(!conta) return;

  nome.textContent = conta.titular;
  saldo.textContent = conta.saldo.toFixed(2);

  // Atualiza lista de transações da conta
  listaTransacoes.innerHTML = "";
  conta.historico.slice().reverse().forEach(t=>{
    listaTransacoes.innerHTML += `
    <li class="list-group-item">
      <strong>${t.tipo}</strong> - R$ ${t.valor.toFixed(2)}<br>
      <small>${t.detalhes} | ${t.data}</small>
    </li>`;
  });

  // Atualiza lista de operações auditadas pelo Banco Central
  listaAuditoria.innerHTML = "";
  bc.listarTransacoesGrandes().slice().reverse().forEach(t=>{
    listaAuditoria.innerHTML += `
    <li class="list-group-item audit-item">
      De ${t.de} para ${t.para} — R$ ${t.valor}<br>
      <small>${new Date(t.data).toLocaleString()}</small>
    </li>`;
  });
}



/* 5. EVENTOS — ações ativadas pelos botões*/


// LOGIN — dispara quando usuário clica em "Entrar"

document.querySelector("#btn-login").addEventListener("click", ()=>{
  const cpf = document.querySelector("#login-cpf").value.trim();
  const senha = document.querySelector("#login-senha").value.trim();

  const c = banco.autenticar(cpf, senha);

  if(!c){
    document.querySelector("#login-erro").textContent = "CPF ou senha incorretos.";
    document.querySelector("#login-erro").classList.remove("d-none");
    return;
  }

  conta = c; // define conta logada
  document.querySelector("#loginModal").style.display = "none"; // esconde modal
  atualizar(); // atualiza dashboard
});




//  DEPÓSITO — botão "Depositar"

document.querySelector("#btn-depositar").addEventListener("click", ()=>{
  try{
    conta.depositar(Number(document.querySelector("#valor-deposito").value));
    document.querySelector("#valor-deposito").value = "";
    atualizar();
  }catch(e){ alert(e.message); }
});




// SAQUE — botão "Sacar"

document.querySelector("#btn-sacar").addEventListener("click", ()=>{
  try{
    conta.sacar(Number(document.querySelector("#valor-saque").value));
    document.querySelector("#valor-saque").value = "";
    atualizar();
  }catch(e){ alert(e.message); }
});




//  LOGOUT — botão "Sair"


btnLogout.addEventListener("click", () => {
  conta = null; // remove conta logada

  // mostra modal de login novamente
  const modal = document.querySelector("#loginModal");
  modal.style.display = "block";

  // limpa campos do modal
  document.querySelector("#login-cpf").value = "";
  document.querySelector("#login-senha").value = "";
});




// TRANSFERÊNCIA — botão "Transferir"

document.querySelector("#btn-transferir").addEventListener("click", ()=>{
  try{
    const dest = banco.buscar(document.querySelector("#cpf-destino").value.trim());
    banco.transferir(conta, dest, Number(document.querySelector("#valor-transferencia").value));

    // limpa campos
    document.querySelector("#cpf-destino").value = "";
    document.querySelector("#valor-transferencia").value = "";

    atualizar();
  }catch(e){ alert(e.message); }
});
