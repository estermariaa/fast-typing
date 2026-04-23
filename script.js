// Temporário
const bancoDeTextos = {
    facil: [
        "O gato subiu no telhado.",
        "A lua brilha no ceu escuro.",
        "Eu gosto de programar em JS."
    ],
    medio: [
        "O aprendizado de maquina exige muita prática e dedicação.",
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
let tempoRestante = 0;
let tempoSelecionado = 30;
let cronometro;

// Pegando os elementos do HTML 
const buttonComeçar = document.getElementById('start-game-button');
const telaSetup = document.getElementById('screen-setup');
const telaJogo = document.getElementById('screen-game');
const telaRanking = document.getElementById('screen-ranking');
const inputNome = document.getElementById('player-name');
const campoDigitação = document.getElementById('typing-input');
const displayPalavras = document.getElementById('words-display');
const botoesDificuldade = document.querySelectorAll('.level-button');
const botoesTempo = document.querySelectorAll('.time-button');
const displayTimer = document.getElementById('timer-display');
const displayError = document.getElementById('error-display');
const btnReiniciar = document.getElementById('restart-button');
const btnRanking = document.getElementById('button-ranking');
const btnInicio = document.getElementById('button-home');

// Funções de ação ---------------------------------------------------

function carregarTexto() {
    totalErrosPartida = 0; // Resetar os erros sempre que um novo texto carregar
    displayError.innerText = `Erros: 0`;
    // Escolhe um texto aleatório do nível selecionado
    const lista = bancoDeTextos[nivelSelecionado];
    const textoAleatorio = lista[Math.floor(Math.random() * lista.length)];
    
    // Transforma o texto em spans individuais para poder pintar cada letra
    displayPalavras.innerHTML = textoAleatorio.split('').map(letra => {
        return `<span>${letra}</span>`;
    }).join('');

    campoDigitação.value = ""; // Limpa o input para começar novo

    atualizarCursor();
}

function iniciarJogo() {
    const nome = inputNome.value.trim(); // Pega o nome e tira espaços vazios

    // Não deixa começar sem nome
    if (nome === "") {
        alert("Por favor, digite seu nome antes de começar!");
        return;
    }

    carregarTexto();
    iniciarCronometro();

    // Trocamos as classes para mudar o que aparece na tela
    telaSetup.classList.add('hidden'); // Esconde a tela de nome
    telaJogo.classList.remove('hidden'); // Mostra a área do jogo

    // Foco no input invisível para o usuário já sair digitando
    campoDigitação.focus();

    console.log("Jogo iniciado por: " + nome);
}

function finalizarPartida(tempoEsgotado = false) {
    clearInterval(cronometro);

    // Se o tempo acabou e ele não terminou a frase, avisamos
    if (tempoEsgotado) {
        alert("O tempo acabou! Tente ser mais rápido na próxima.");
    } else {
        alert(`Parabéns! Você terminou a frase com ${totalErrosPartida} erros.`);
        salvarResultado();
        exibirRanking();
    }
}

function resetarPartida() {
    clearInterval(cronometro); 
    carregarTexto();           // Sorteia novo texto, zera erros visualmente e variáveis
    iniciarCronometro();       // Zera o tempo e começa a contar
    campoDigitação.focus();    // Garante que o teclado continue ativo
}

function formatarNome(nome) {
    return nome
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, letra => letra.toUpperCase());
}

function salvarResultado() {
    const tempoUsado = tempoSelecionado - tempoRestante;

    const score = Math.max(0, 1000 - (tempoUsado * 5) - (totalErrosPartida * 20));

    const nomeFormatado = formatarNome(inputNome.value.trim());
    
    const resultado = {
        nome: nomeFormatado,
        tempo: tempoSelecionado,
        erros: totalErrosPartida,
        nivel: nivelSelecionado,
        score: score,
    };

    // Lê o que já existe (ou começa com array vazio)
    const rankingAtual = JSON.parse(localStorage.getItem('ranking') || '[]');

    // Procura se já existe alguém com MESMO nome + nível + tempo
    const index = rankingAtual.findIndex(item =>
        item.nome === nomeFormatado &&
        item.nivel === nivelSelecionado &&
        item.tempo === tempoSelecionado
    );

    if (index !== -1) {
        // Já existe -> atualiza apenas se o score for melhor
        if (score > rankingAtual[index].score) {
            rankingAtual[index] = resultado;
        }
    } else {
        // Não existe -> adiciona normalmente
        rankingAtual.push(resultado);
    }

    // Salva de volta
    localStorage.setItem('ranking', JSON.stringify(rankingAtual));
}

function exibirRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
    
    // Ordena do maior score para o menor
    ranking.sort((a, b) => b.score - a.score);
    
    const lista = document.getElementById('ranking-list');
    
    if (ranking.length === 0) {
        lista.innerHTML = '<li>Nenhuma partida registrada ainda.</li>';
    } else {
        lista.innerHTML =  `
            <li class="ranking-header">
                <span>Posição</span>
                <span>Jogador</span>
                <span>Score</span>
                <span>Detalhes</span>
            </li>
        ` + ranking.map((entrada, index) => `
            <li class="ranking-item">
                <span class="ranking-posicao">#${index + 1}</span>
                <span class="ranking-nome">${entrada.nome}</span>
                <span class="ranking-score">${entrada.score} pts</span>
                <span class="ranking-detalhe">${entrada.tempo}s · ${entrada.erros} erros · ${entrada.nivel}</span>
            </li>
        `).join(''); // Junta todas as strings em uma só, sem nenhum separador entre elas.
    }

    // Troca a tela visível
    telaSetup.classList.add('hidden');
    telaJogo.classList.add('hidden');
    telaRanking.classList.remove('hidden');
}

function atualizarCursor(){
    const arrayLetras = displayPalavras.querySelectorAll('span');
    const posicaoAtual = campoDigitação.value.length;

    // Remove o cursor de qualquer letra que já o tenha
    arrayLetras.forEach(span => span.classList.remove('cursor'));

    // Adiciona o cursor na letra da posição atual
    if (posicaoAtual < arrayLetras.length) {
        arrayLetras[posicaoAtual].classList.add('cursor');
    }
}

function iniciarCronometro() {
    tempoRestante = tempoSelecionado;
    displayTimer.innerText = `Tempo: ${tempoRestante}s`;

    clearInterval(cronometro);

    cronometro = setInterval(() => {
        tempoRestante--;
        displayTimer.innerText = `Tempo: ${tempoRestante}s`;

        // Se o tempo acabar, finaliza o jogo automaticamente
        if (tempoRestante <= 0) {
            finalizarPartida(true); // true indica que o tempo acabou
        }
    }, 1000);
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

botoesTempo.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesTempo.forEach(btn => btn.classList.remove('active'));
        botao.classList.add('active');
        
        // Atualiza a variável global com o valor do data-time
        tempoSelecionado = parseInt(botao.getAttribute('data-time'));
    });
});

campoDigitação.addEventListener('input', (event) => {
    const arrayLetras = displayPalavras.querySelectorAll('span');
    const valorDigitado = campoDigitação.value;
    const arrayValor = valorDigitado.split('');

    const apagando = event.inputType === 'deleteContentBackward';

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

            if (!apagando) {
                if (!span.classList.contains('incorreto')) {
                    totalErrosPartida += 1;
                    displayError.innerText = `Erros: ${totalErrosPartida}`;
                }
            }

            span.classList.add('incorreto');
            span.classList.remove('correto');
        }
    });

    // VERIFICAÇÃO DE VITÓRIA:
    // Se o tamanho do que foi digitado for igual ao da frase e tudo estiver correto
    if (valorDigitado === displayPalavras.innerText) {
        finalizarPartida();
    }

    atualizarCursor();
});

btnReiniciar.addEventListener('click', resetarPartida);
btnRanking.addEventListener('click', exibirRanking);
btnInicio.addEventListener('click', () => {
    telaRanking.classList.add('hidden');
    telaJogo.classList.add('hidden');
    telaSetup.classList.remove('hidden');
});