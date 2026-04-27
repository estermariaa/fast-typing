// Temporário
const bancoDeTextos = {
    facil: [
        "O conhecimento é a única ferramenta que ninguém pode tirar de você nesta longa jornada.",
        "A prática constante leva à perfeição e ajuda a manter o foco em nossos objetivos principais.",
        "Viver e aprender algo novo todos os dias é o segredo para uma mente sempre jovem e ativa.",
        "O sol nasce no horizonte trazendo esperança para todos os seres vivos que habitam o planeta.",
        "A música clássica tem o poder de alegrar a alma e acalmar os corações mais inquietos e ansiosos.",
        "Caminhar ao ar livre faz muito bem para a saúde do corpo e também para o equilíbrio da mente.",
        "O livro de receitas está sobre a mesa da sala aguardando o momento de prepararmos o jantar.",
        "Chocolate amargo é o meu doce favorito de todos os tempos, especialmente em dias de chuva.",
        "A pressa é reconhecida como a maior inimiga da perfeição em qualquer tarefa que realizamos.",
        "Flores coloridas e perfumadas crescem no jardim da nossa casa durante toda a primavera."
    ],
    medio: [
        "A tecnologia deve servir prioritariamente para aproximar as pessoas e não para isolá-las do convívio social.",
        "Não deixe para amanhã o que você pode realizar hoje com total dedicação, foco e determinação no resultado.",
        "A leitura constante é uma porta aberta para mundos imaginários e conhecimentos que transformam a percepção.",
        "O sucesso verdadeiro vem para quem trabalha com constância e não teme os diversos desafios do caminho.",
        "Gentileza gera gentileza em qualquer lugar do mundo, basta apenas começar o dia com um sorriso sincero.",
        "Viajar pelo mundo abre a nossa mente para novas culturas, idiomas e diferentes perspectivas sobre a vida.",
        "A paciência é uma virtude essencial para lidar com os estresses cotidianos e as pressões da vida moderna.",
        "Praticar esportes ajuda a manter a disciplina, a clareza mental e o vigor necessário para tomar decisões.",
        "O silêncio muitas vezes comunica muito mais do que mil palavras jogadas ao vento sem nenhuma reflexão prévia.",
        "Equilíbrio entre vida pessoal e profissional é a chave mestra para manter a saúde mental em dias difíceis."
    ],
    dificil: [
        "const response = await fetch('https://api.exemplo.com/v1/dados'); const data = await response.json(); console.log(data);",
        "function calcularWPM(caracteres, tempoSegundos) { const palavras = caracteres / 5; return Math.round(palavras / (tempoSegundos / 60)); }",
        "if (usuario.autenticado && usuario.permissao === 'administrador') { return <PainelAdmin dados={estatisticas} />; } else { return <AcessoNegado />; }",
        "document.querySelectorAll('.botao-acao').forEach(item => { item.addEventListener('click', (evento) => evento.preventDefault()); });",
        "A implementação de algoritmos complexos, como o Simplex, exige atenção absoluta aos detalhes matemáticos e lógica rigorosa.",
        "O universo é uma esfera infinita cujo centro está em toda parte e a circunferência em lugar nenhum, afirmou o filósofo.",
        "No meio do caminho tinha uma pedra, tinha uma pedra no meio do caminho, nunca me esquecerei desse acontecimento em minha vida.",
        "Navegar é preciso, viver não é preciso; a alma deseja a glória eterna, mas o corpo físico teme a fúria da tempestade em alto mar.",
        "export default class Jogador { constructor(nome, nivel) { this.nome = nome; this.nivel = nivel; this.pontuacao = 0; } }",
        "const dadosFiltrados = resultados.filter(linha => linha.ativo).map(linha => linha.valor).reduce((acc, val) => acc + val, 0);",
        "A persistência é o único caminho para o êxito de quem não teme os obstáculos inevitáveis que surgem ao longo da jornada.",
        "Quanto mais eu treino com afinco e dedicação, mais sorte eu pareço ter nos momentos decisivos da minha carreira de desenvolvedor.",
        "Array.from({ length: 10 }, (_, i) => i + 1).filter(n => n % 2 === 0).forEach(par => console.log('Número par encontrado:', par));",
        "O tempo é um rio que corre para o mar do esquecimento, levando nossas memórias, nossos sonhos e nossas maiores conquistas históricas.",
        "try { sistema.inicializar(); motor.ligar(); } catch (erro) { log.error('Falha crítica detectada no núcleo:', erro.stack); }"
    ]
};

let nivelSelecionado = "medio";
let totalErrosPartida = 0;
let tempoRestante = 0;
let tempoSelecionado = 30;
let cronometro;
let filtroNivel = "geral";
let filtroTempo = "geral";


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
const btnTema = document.getElementById("theme-toggle");

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
        resetarPartida();
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

    // Filtra conforme seleção
    const filtrado = ranking.filter(entrada => {
        const nivelOk = filtroNivel === "geral" || entrada.nivel === filtroNivel;
        const tempoOk = filtroTempo === "geral" || entrada.tempo === parseInt(filtroTempo);
        return nivelOk && tempoOk;
    });

filtrado.sort((a, b) => b.score - a.score);
     
    const lista = document.getElementById('ranking-list');
    
    if (filtrado.length === 0) {
        lista.innerHTML = '<li class="ranking-vazio">Nenhuma partida encontrada.</li>';
    } else {
        lista.innerHTML = `
            <li class="ranking-header">
                <span>Posição</span>
                <span>Jogador</span>
                <span>Score</span>
                <span>Detalhes</span>
            </li>
        ` + filtrado.map((entrada, index) => `
            <li class="ranking-item">
                <span class="ranking-posicao">#${index + 1}</span>
                <span class="ranking-nome">${entrada.nome}</span>
                <span class="ranking-score">${entrada.score} pts</span>
                <span class="ranking-detalhe">${entrada.tempo}s · ${entrada.erros} erros · ${entrada.nivel}</span>
            </li>
        `).join('');
    }

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

// Listeners dos filtros
document.querySelectorAll('[data-filter-level]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-level]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroNivel = btn.getAttribute('data-filter-level');
        exibirRanking();
    });
});

document.querySelectorAll('[data-filter-time]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-time]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroTempo = btn.getAttribute('data-filter-time');
        exibirRanking();
    });
});

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

document.addEventListener("keydown", (event) =>{
    if(event.key == "Enter"){
        if(!telaSetup.classList.contains('hidden')){
            iniciarJogo();
        }
    }
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
    clearInterval(cronometro);

    telaRanking.classList.add('hidden');
    telaJogo.classList.add('hidden');
    telaSetup.classList.remove('hidden');
});

btnTema.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        btnTema.textContent = "Light ☀";
    } else {
        btnTema.textContent = "Dark ☾";
    }
});