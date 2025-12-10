// CLASSE BASE PESSOA
class Pessoa {
    constructor(nome, idade, cpf) {
        this.nome = nome;
        this.idade = idade;
        this.cpf = cpf;
    }
}

// HERANÇAS
class Vendedor extends Pessoa {
    constructor(nome, idade, cpf, matricula) {
        super(nome, idade, cpf);
        this.matricula = matricula;
    }
}

class Cliente extends Pessoa {
    constructor(nome, idade, cpf, limiteCredito) {
        super(nome, idade, cpf);
        this.limiteCredito = limiteCredito;
    }
}

// PRODUTO
class Produto {
    constructor(id, nome, preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }
}

// =============================
// ITEM DA VENDA (produto + quantidade)
// =============================
class ItemVenda {
    constructor(produto, quantidade) {
        this.produto = produto;
        this.quantidade = quantidade;
    }

    getValorTotal() {
        return this.produto.preco * this.quantidade;
    }
}

// =============================
// VENDA (lista de produtos)
// =============================
class Venda {
    constructor(vendedor, cliente) {
        this.vendedor = vendedor;
        this.cliente = cliente;
        this.itens = [];   
        this.data = new Date();
    }

    adicionarItem(produto, quantidade) {
        const item = new ItemVenda(produto, quantidade);
        this.itens.push(item);
    }

    getValorTotal() {
        return this.itens.reduce((total, item) => total + item.getValorTotal(), 0);
    }

    detalhes() {
        let textoItens = this.itens.map(item =>
               - ${item.produto.nome} (Qtd: ${item.quantidade}) = R$ ${item.getValorTotal().toFixed(2)}
        ).join("\n");

        return `
Venda realizada:
 Vendedor: ${this.vendedor.nome}
 Cliente: ${this.cliente.nome}
 Data: ${this.data.toLocaleString()}
 Produtos:
${textoItens}
----------------------------------------
 Total da Venda: R$ ${this.getValorTotal().toFixed(2)}
`;
    }
}


/// SISTEMA DE VENDAS
class SistemaVendas {
    constructor() {
        this.vendas = [];
    }

    registrarVenda(venda) {
        this.vendas.push(venda);
    }

    listarVendas() {
        if (this.vendas.length === 0) {
            console.log("Nenhuma venda registrada ainda.");
            return;
        }

        console.log("📄 LISTAGEM DE VENDAS:\n");

        this.vendas.forEach((v, i) => {
            console.log(Venda #${i + 1});
            console.log(v.detalhes());
        });
    }
}


// EXEMPLO DE USO
const vendedor1 = new Vendedor("Carlos", 30, "111.111.111-11", "V001");
const cliente1 = new Cliente("Ana", 25, "222.222.222-22", 5000);

const prod1 = new Produto(1, "Notebook", 3500);
const prod2 = new Produto(2, "Mouse", 80);
const prod3 = new Produto(3, "Teclado", 120);

// Criando uma venda COM LISTA DE PRODUTOS
const venda1 = new Venda(vendedor1, cliente1);

venda1.adicionarItem(prod1, 1);
venda1.adicionarItem(prod2, 2);
venda1.adicionarItem(prod3, 1);

const sistema = new SistemaVendas();
sistema.registrarVenda(venda1);

// Listar vendas
sistema.listarVendas();



/* 

✅ 1. Principais Funções / Métodos do JavaScript (Gerais)
🔹 Manipulação de Arrays

push() → adiciona item ao final
pop() → remove último item
shift() → remove primeiro item
unshift() → adiciona no início
map() → percorre array e retorna um novo
filter() → filtra valores com base em uma condição
reduce() → reduz o array a um valor único (somar, contar, etc.)
find() → encontra o primeiro elemento que satisfaça uma condição
sort() → ordena os elementos
includes() → verifica se um valor existe
forEach() → percorre cada item do array

🔹 Manipulação de Strings

toLowerCase() / toUpperCase()
trim() → remove espaços laterais
split() → divide texto em partes
replace() / replaceAll()
substring() / slice() → recorta partes da string

🔹 Manipulação de Objetos

Object.keys() → retorna chaves
Object.values() → retorna valores
Object.entries() → chave + valor
Object.assign() → clona ou mescla objetos
JSON.stringify() → converte objeto em texto
JSON.parse() → converte texto em objeto

🔹 Funções gerais importantes
setTimeout() → executa depois de um tempo
setInterval() → executa repetidamente
Math.random() → número aleatório
Math.floor() / Math.ceil() / Math.round()

*/

/*

✅ 2. Funções Importantes do JavaScript para Programação Orientada a Objetos (POO)
🔹 Classes
Criam modelos de objetos.

>> class Pessoa {}

🔹 Construtor
Executa quando o objeto é criado.

>> constructor(nome) { this.nome = nome }

🔹 Instanciar objetos
>> const p = new Pessoa("João");

🔹 Métodos
Funções dentro das classes:

>> falar() { console.log("Olá!"); }

🔹 Herança (extends)
Permite uma classe herdar atributos e métodos:

>> class Aluno extends Pessoa {}

🔹 super()
Chama o construtor da classe pai:

>> constructor(nome, matricula) {
  super(nome);
  this.matricula = matricula;
}

🔹 Getters e Setters (encapsulamento)
Controlam acesso a atributos:

>> get nome() { return this._nome }
>> set nome(valor) { this._nome = valor }

🔹 Métodos estáticos
Funções que pertencem à classe, não ao objeto:

>> static criarAnonimo() { return new Pessoa("Desconhecido") }

🔹 Prototype
Toda classe/objeto tem um protótipo que define comportamentos:

>> Pessoa.prototype.falar = function() { ... }

🔹 Polimorfismo
Substituir um método herdado:

>> class Animal {
  som() { console.log("Som genérico"); }
}

>> class Cachorro extends Animal {
  som() { console.log("Au au!"); }
}

🔹 Classes abreviadas com factory functions
Criar objetos sem classes:

>> function criarPessoa(nome) {
  return { nome, falar() { console.log(nome) } };
}


*/


// Estruturas que vamos derivar as intâncias
// Classes --> objetos
// Todo objeto tera suas caractrísticas próprias
// Classe - (Nome, cpf, dataNascimento) | Instância1 - (Raiany, 07769496160, 28/07/2006) | Instância1 - (Sara, 56698425360, 22/04/2007)

// Cada instância ocupa um espaço de memória

//----------------------------------------------------------------------------------------

// criando uma classe
class Pessoa {
    dataNascimento;
    constructor(nome, cpf) {
        this.nome = nome
        this.cpf = cpf
    }
    
    apresentar() {
        console.log(Meu nome é ${this.nome}, nasci no dia ${this.dataNascimento}. Meu cpf é ${this.cpf})
        
    }

}

let cidadao = new Pessoa("Raiany", '07769496160');
cidadao.dataNascimento = "28/07/2006"
//cidadao.apresentar()

let cidadao2 = new Pessoa("Sara", '07810178156');
cidadao2.dataNascimento = "22/04/2007"
//cidadao2.apresentar()

let cidadao3 = cidadao
//cidadao3.apresentar()

//let pessoas = {{cidadao.nome} = [cidadao.cpf, cidadao.dataNascimento]}

let pessoas = [cidadao, cidadao2, cidadao3]
console.log(pessoas)
//pessoas[1].apresentar()


class Pessoa{
    constructor(nome, dataNascimento){
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        console.log("Nova pessoa adicionada!");
        console.log(NOME: ${this.nome}\nDATA DE NASCIMENTO: ${this.dataNascimento}\n);
    }

    // Sobrecarga: Mais de um método com o mesmo nome que os diferenciam pelos argumntos
    // declarar variável
    // new cria um novo objeto | Pessoa - nome da classe | () - executa o método contructor
    


    registrar(cpf){
        this.cpf = cpf;
        console.log(${this.nome} foi registrado: \nCPF: ${this.cpf}\n)

    }

    registrar(cpf, rg){
        this.cpf = cpf;
        this.rg = rg;
        console.log(${this.nome} foi registrado: \nCPF: ${this.cpf}\nRG: ${this.rg}\n)

    }

    apresentar(){
        console.log(NOME: ${this.nome}\nDATA DE NASCIMENTO: ${this.dataNascimento}\nCPF: ${this.cpf}\nRG: ${this.rg}\n)
    }

}


// let jose = new Pessoa("José", "15/02/2004");

// jose.registrar('355.698.962-90') //, '268.458.04-6'
// jose.apresentar()

class Funcionario extends Pessoa{
    constructor(nome, dataNascimento, matricula){
        super(nome, dataNascimento);
        this.matricula = matricula;
    }
    funcao;
    matricula;

    apresentar(){
        // super.apresentar()
        console.log(Minha matricula é ${this.matricula}) // Sobrescrita e sobrecarga são conceitos de POO
    }
    
}

let ana = new Funcionario("Ana", "15/05/2004", 123456)

// ana.apresentar()
// ana.getfuncao()

class gerente extends Funcionario{
    apresentar(){
        super.apresentar() 
    }

    get Nome(){
    return this.nome }

    set Nome(novoNome){
        if(length(novoNome) > 5 ){
            this.nome = novoNome
        } }

}


let gerenteVendas = new gerente()
gerenteVendas.Nome = "João"
console.log(gerenteVendas.Nome)


// JS -> Prototype

class cachorro {
  nome;
  raca;
  idade;
  dono;
  din = 0;

  get dinheiro() {
    return this.din;
  }

  set dinheiro(valor) {
    this.din = valor;
  }
}

class pessoa {
  nome;
  #din;
  historico = [];

  get dinheiro() {
    return this.#din;
  }

  set dinheiro(valor) {
    this.historico.push(valor - this.#din);
    this.#din = valor;
  }

  constructor(nome, dinheiro) {
    this.nome = nome;
    this.#din = dinheiro;
  }
}

class busao {
  passageiros = [];
  valorPassagem = 10;

  embarcarPassageiro(passageiro) {
    console.log(
      passageiro.nome +
        ' Passageiro tem dinheiro: ' +
        Object.hasOwn(Object.getPrototypeOf(passageiro), 'dinheiro')
    );

    if (Object.hasOwn(Object.getPrototypeOf(passageiro), 'dinheiro')) {
      if (passageiro.dinheiro > this.valorPassagem) {
        this.passageiros.push(passageiro);
        passageiro.dinheiro -= this.valorPassagem;
      }
    }
  }
}

// Corrigido: define a propriedade interna, não o getter/setter
cachorro.prototype.din = 100;

// Impede novas adições no prototype depois da configuração
Object.preventExtensions(cachorro.prototype);

let rex = new cachorro();
rex.nome = 'Rex';
rex.dinheiro = 15;
// rex.correnteOuro = '2 kilates'
// Object.freeze(rex)

console.log(rex.dinheiro);

let lessie = new cachorro();
lessie.nome = 'Lessie';
lessie.dinheiro = 13;

let joao = new pessoa('Joao', 50);
let maria = new pessoa('Maria', 9);
maria.dinheiro += 20;

console.log('Joao tem dinheiro? ' + Object.hasOwn(Object.getPrototypeOf(joao), 'dinheiro'));

// comprando um busao
const transLagoas = new busao();

// rex.dinheiro = 100;
transLagoas.embarcarPassageiro(rex);
transLagoas.embarcarPassageiro(lessie);
transLagoas.embarcarPassageiro(joao);
transLagoas.embarcarPassageiro(maria);

console.log('Passageiros transLagoas:');
console.log(transLagoas.passageiros);

let transSP = new busao();
transSP.valorPassagem = 15;
transSP.embarcarPassageiro(joao);
transSP.embarcarPassageiro(joao);

console.log('Passageiros transSP:');
console.log(transSP.passageiros);

console.log('Passageiros transLagoas novamente:');
console.log(transLagoas.passageiros);

joao.dinheiro -= 2;
console.log(joao.historico);

console.log(maria.historico);
console.log(maria.dinheiro);

maria.historico.push(1000); // após 1000 para a Maria
console.log(maria.historico);
console.log(maria.dinheiro);

// Autor: Thiago de Oliveira Correia
// Professor EBTT Informática/Desenvolvimento e Jogos Digitais
// Instituto Federal de Mato Grosso do Sul - IFMS Três Lagoas - MS

// Exemplo

class Usuario {
  #senha; // atributo privado

  constructor(nome, email, senha) {
    this.nome = nome;
    this.email = email;
    this.#senha = senha;

    // Impede que novas propriedades sejam adicionadas ao objeto
    Object.preventExtensions(this);
  }

  // Get Informações
  get info() {
    return ${this.nome} (${this.email});
  }

  // Set: define nova senha com validação
  set senha(novaSenha) {
    if (novaSenha.length >= 6) {
      this.#senha = novaSenha;
    } else {
      console.log("❌ A senha deve ter pelo menos 6 caracteres!");
    }
  }

  // Método: autenticação simples
  autenticar(senha) {
    return senha === this.#senha;
  }

  // Método: verifica se o objeto possui uma propriedade
  verificarPropriedade(prop) {
    if (Object.hasOwn(this, prop)) {
      console.log(✅ O objeto possui a propriedade "${prop}".);
    } else {
      console.log(⚠️ O objeto NÃO possui a propriedade "${prop}".);
    }
  }
}

// --- Testando o sistema ---
const user = new Usuario("Raiany", "rai@exemplo.com", "123456");

console.log(user.info); // → Raiany (rai@exemplo.com)
console.log(user.autenticar("123456")); // true

// Tentando adicionar nova propriedade (não deve funcionar)
user.idade = 22;
console.log(user.idade); // undefined (por causa do preventExtensions)

// Usando Object.hasOwn() para verificar as propriedades
user.verificarPropriedade("nome");   // ✅
user.verificarPropriedade("idade");  // ⚠️
user.verificarPropriedade("#senha"); // ⚠️ (privados não são acessíveis)

// Atualizando senha com o setter
user.senha = "abcdef"; // válida
console.log(user.autenticar("abcdef")); // true