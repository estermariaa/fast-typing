// Temporário
const bancoDeTextos = {
    facil: [
        "O gato subiu no telhado.",
        "A lua brilha no ceu escuro.",
        "Eu gosto de programar em JS."
    ],
    medio: [
        "O aprendizado de maquina exige muita prática e dedidação.",
        "Desenvolver sistemas na UFSJ é um desafio constante."
    ],
    dificil: [
        "A implementação de algoritmos complexos, como o Simplex, exige atenção aos detalhes.",
        "Node.js permite executar JavaScript no lado do servidor com alta performance.",
        "O desenvolvimento de interfaces responsivas utiliza conceitos avançados de CSS Flexbox."
    ]
};

let nivelSelecionado = "medio";
let totalErrosPartida = 0;

// Pegando os elementos do HTML 
const buttonComeçar = document.getElementById('start-game-button');
const telaSetup = document.getElementById('screen-setup');
const telaJogo = document.getElementById('screen-game');
const inputNome = document.getElementById('player-name');
const campoDigitação = document.getElementById('typing-input');
const displayPalavras = document.getElementById('words-display');
const botoesDificuldade = document.querySelectorAll('.level-button');

// Funções de ação ---------------------------------------------------

function carregarTexto() {
    totalErrosPartida = 0; // Resetar os erros sempre que um novo texto carregar
    // Escolhe um texto aleatório do nível selecionado
    const lista = bancoDeTextos[nivelSelecionado];
    const textoAleatorio = lista[Math.floor(Math.random() * lista.length)];
    
    // Transforma o texto em spans individuais para poder pintar cada letra
    displayPalavras.innerHTML = textoAleatorio.split('').map(letra => {
        return `<span>${letra}</span>`;
    }).join('');

    campoDigitação.value = ""; // Limpa o input para começar novo
}

function iniciarJogo() {
    const nome = inputNome.value.trim(); // Pega o nome e tira espaços vazios

    // Não deixa começar sem nome
    if (nome === "") {
        alert("Por favor, digite seu nome antes de começar!");
        return;
    }

    carregarTexto();

    // Trocamos as classes para mudar o que aparece na tela
    telaSetup.classList.add('hidden'); // Esconde a tela de nome
    telaJogo.classList.remove('hidden'); // Mostra a área do jogo

    // Foco no input invisível para o usuário já sair digitando
    campoDigitação.focus();

    console.log("Jogo iniciado por: " + nome);
}

function finalizarPartida() {
    alert(`Parabéns! Você terminou a frase. Você teve o total de erros: ${totalErrosPartida}`);
    
    telaJogo.classList.add('hidden');
    document.getElementById('screen-ranking').classList.remove('hidden');
}

// Gatilhos ----------------------------------------------

buttonComeçar.addEventListener('click', iniciarJogo);

botoesDificuldade.forEach(botao => {
    botao.addEventListener('click', () => {
        
        // Remove a classe 'active' de todos os botões (limpa o destaque)
        botoesDificuldade.forEach(btn => btn.classList.remove('active'));
        
        // Adiciona a classe 'active' apenas no botão que foi clicado
        botao.classList.add('active');
        
        // Atualiza a nossa variável global com o valor do 'data-level'
        nivelSelecionado = botao.getAttribute('data-level');
        
        console.log("Dificuldade alterada para: " + nivelSelecionado);
    });
});

campoDigitação.addEventListener('input', () => {
    const arrayLetras = displayPalavras.querySelectorAll('span');
    const valorDigitado = campoDigitação.value;
    const arrayValor = valorDigitado.split('');

    // Impede que o usuário digite mais do que o tamanho da frase
    if (valorDigitado.length > arrayLetras.length) {
        campoDigitação.value = valorDigitado.substring(0, arrayLetras.length);
        return;
    }


    arrayLetras.forEach((span, index) => {
        const caractereOriginal = span.innerText;
        const caractereDigitado = arrayValor[index];

        if (caractereDigitado == null) {
            // Se ainda não digitou essa letra, remove as cores
            span.classList.remove('correto', 'incorreto');
        } else if (caractereDigitado === caractereOriginal) {
            // Se acertou
            span.classList.add('correto');
            span.classList.remove('incorreto');
        } else {
            // Se errou
            span.classList.add('incorreto');
            span.classList.remove('correto');
            totalErrosPartida+=1;
        }
    });

    // VERIFICAÇÃO DE VITÓRIA:
    // Se o tamanho do que foi digitado for igual ao da frase e tudo estiver correto
    if (valorDigitado === displayPalavras.innerText) {
        finalizarPartida();
    }
});