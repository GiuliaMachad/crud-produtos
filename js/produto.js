const URL = 'http://localhost:3400/produtos'
let idEdicao = 0;

let listaProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProduto = document.querySelector('table>tbody');
let modalProduto= new bootstrap.Modal(document.getElementById('modal-produto'));
let tituloModal = document.getElementById('titulo-modal');

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    valor: document.querySelector("#valor"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    observacao: document.querySelector("#observacao"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar:document.querySelector("#btn-salvar"),
    btnCancelar:document.querySelector("#btn-cancelar")
}

btnAdicionar.addEventListener('click', () =>{
    tituloModal.innerHTML = "Adicionar produto";
    limparModalProduto();
    modalProduto.show();
});

function obterProdutos() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization' : obterToken()
        }
    })
    .then(response => response.json())
    .then(produtos => {
        listaProdutos= produtos;
        popularTabela(produtos);
    })
    .catch((erro) => {});
}

obterProdutos();

function popularTabela(produtos){
    tabelaProduto.textContent = '';

    produtos.forEach(produto => { 
        criarLinhaNaTabela(produto);
    });
}

function criarLinhaNaTabela(produto){
    let tr  = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdQuantidadeEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = produto.id
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdQuantidadeEstoque.textContent = produto.quantidadeEstoque;
    tdObservacao.textContent = produto.observacao;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-warning btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-danger btn-sm mr-3">
                                Excluir
                        </button>`

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQuantidadeEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaProduto.appendChild(tr);
}

formModal.btnSalvar.addEventListener('click', AdicionarOuEditarProduto);

function obterProdutoDoModal(){
    return new Produto({
        id: formModal.id.value,
        valor: formModal.valor.value,
        nome: formModal.nome.value,
        observacao: formModal.observacao.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarProdutoNoBackend(produto){

    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {
        let novoProduto= new Produto(response);
        listaProdutos.push(novoProduto);

        popularTabela(listaProdutos);

        modalProduto.hide();

        alert(`Produto ${produto.nome}, foi cadastrado com sucesso!`)
    })
}

function limparModalProduto(){
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value = '';
    formModal.observacao.value = '';
    formModal.quantidadeEstoque.value = '';
    formModal.dataCadastro.value = '';

} 
function excluirProduto(id){
    let produto = listaProdutos.find(produto => produto.id == id);

    if(confirm("Deseja realmente excluir o produto " + produto.nome)){
        excluirProdutoNoBackEnd(id);
    }
}

function excluirProdutoNoBackEnd(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
    .then(() => {
        removerProdutoDaLista(id);
        popularTabela(listaProdutos);
    })
}

function removerProdutoDaLista(id){
    let indice = listaProdutos.findIndex(produto => produto.id == id);

    listaProdutos.splice(indice, 1);
}


function editarProduto(id){
    tituloModal.innerHTML = "Editar produto";

    let produto = listaProdutos.find(produto => produto.id == id);

    formModal.id.value = produto.id;
    formModal.nome.value = produto.nome;
    formModal.valor.value = produto.valor;
    formModal.observacao.value = produto.observacao;
    formModal.quantidadeEstoque.value = produto.quantidadeEstoque;
    formModal.dataCadastro.value = produto.dataCadastro;

    idEdicao = produto.id;

    modalProduto.show();
    
}

function AdicionarOuEditarProduto() {
    if (tituloModal.innerHTML.includes("Adicionar")) {
        AdicionarProdutoDoModal();
    } else {
        EditarProdutoNoBackEnd(idEdicao);
    }
}


function AdicionarProdutoDoModal(){
    let produto = obterProdutoDoModal();

    if(!produto.validar()){
        alert("Nome e valor são obrigatórios.");
        return;
    }
    
    adicionarProdutoNoBackend(produto);
}

function EditarProdutoNoBackEnd(id){
    fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: obterToken()
        },
        body: JSON.stringify(obterProdutoDoModal())
    })
        .then(() => {
            AtualizarProdutoNaLista(id);

            modalProduto.hide();

            alert(`Produto ${obterProdutoDoModal().nome}, foi atualizado com sucesso!`)
        })
}   

function AtualizarProdutoNaLista(id){
    let indice = listaProdutos.findIndex(produto => produto.id == id);
    
    listaProdutos[indice] = obterProdutoDoModal();

    popularTabela(listaProdutos);
}