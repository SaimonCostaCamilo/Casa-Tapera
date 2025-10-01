// Funcionalidade do Chatbot
const chatbotFloatIcon = document.getElementById('chatbot-float-icon');
const chatbotContainer = document.getElementById('chatbot-container');
const closeChatbotBtn = document.getElementById('close-chatbot');
const chatbotHeader = document.querySelector('.chatbot-header');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotOptionsContainer = document.getElementById('chatbot-options');

// Variáveis para controlar o arrasto do container do chatbot
let isDraggingContainer = false;
let containerStartX;
let containerStartY;
let containerInitialX;
let containerInitialY;

// Evento de clique para abrir o chatbot
chatbotFloatIcon.addEventListener('click', () => {
    // Esconde o ícone flutuante e mostra o chatbot
    chatbotContainer.classList.remove('hidden');
    chatbotFloatIcon.classList.add('hidden');
    // Adiciona a primeira mensagem do bot
    addMessage("Olá! Bem-vindo ao chat da Casa Tapera. Como posso te ajudar hoje?", "bot");
});

// Evento para fechar o chatbot
closeChatbotBtn.addEventListener('click', () => {
    // Esconde o chatbot e mostra o ícone flutuante
    chatbotContainer.classList.add('hidden');
    chatbotFloatIcon.classList.remove('hidden');
    // Limpa as mensagens para a próxima conversa
    chatbotMessages.innerHTML = '';
});

// Eventos de mouse para arrastar o container do chatbot pela barra de título
if (chatbotHeader) {
    chatbotHeader.addEventListener('mousedown', (e) => {
        // Impede que o clique no botão de fechar acione o arrasto
        if (e.target.id === 'close-chatbot' || e.target.classList.contains('option-btn')) {
            return;
        }

        e.preventDefault();
        isDraggingContainer = true;
        containerStartX = e.clientX;
        containerStartY = e.clientY;
        containerInitialX = chatbotContainer.offsetLeft;
        containerInitialY = chatbotContainer.offsetTop;

        document.addEventListener('mousemove', onContainerMouseMove);
        document.addEventListener('mouseup', onContainerMouseUp);
    });
}

function onContainerMouseMove(e) {
    if (!isDraggingContainer) return;

    const dx = e.clientX - containerStartX;
    const dy = e.clientY - containerStartY;

    chatbotContainer.style.left = `${containerInitialX + dx}px`;
    chatbotContainer.style.top = `${containerInitialY + dy}px`;
}

function onContainerMouseUp() {
    isDraggingContainer = false;
    document.removeEventListener('mousemove', onContainerMouseMove);
    document.removeEventListener('mouseup', onContainerMouseUp);
}

// Funcionalidade de cliques nos botões de opção
if (chatbotOptionsContainer) {
    chatbotOptionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-btn')) {
            const option = e.target.dataset.option;
            handleOptionClick(option);
        }
    });
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function handleOptionClick(option) {
    let userMessageText = '';
    let botResponseText = '';

    switch (option) {
        case 'hamburgueres':
            userMessageText = 'Hambúrgueres';
            botResponseText = 'Nossos hambúrgueres artesanais são feitos com carnes de alta qualidade e ingredientes frescos. Para pedir o seu, chame a gente no WhatsApp: (51) 99627-0518.';
            break;
        case 'pasteis':
            userMessageText = 'Pastéis';
            botResponseText = 'Deliciosos pastéis com a massa crocante e recheios super generosos! Qual deles vai ser o seu? Fale conosco no WhatsApp para fazer seu pedido: (51) 99627-0518.';
            break;
        case 'bebidas':
            userMessageText = 'Bebidas';
            botResponseText = 'Temos uma variedade de sucos naturais, refrigerantes e águas para acompanhar seu lanche. Faça seu pedido de bebida agora pelo WhatsApp: (51) 99627-0518.';
            break;
        default:
            return;
    }

    // Adiciona a mensagem do usuário
    addMessage(userMessageText, "user");

    // Adiciona a resposta do bot após um pequeno atraso
    setTimeout(() => {
        addMessage(botResponseText, "bot");
    }, 500);
}

// Funcionalidade de Gerenciamento de Pedidos (Simulado para o Cliente)
const pedidos = [];

function adicionarPedido() {
    const itemInput = document.getElementById('item-pedido');
    const tempoInput = document.getElementById('tempo-preparo');
    const listaPedidos = document.getElementById('lista-pedidos');

    const item = itemInput.value.trim();
    const tempo = parseInt(tempoInput.value);

    if (item === '') {
        alert('Por favor, insira o nome do item.');
        return;
    }

    const pedido = {
        item: item,
        tempo: tempo,
        tempoRestante: tempo * 60
    };

    pedidos.push(pedido);
    pedidos.sort((a, b) => a.tempo - b.tempo);

    itemInput.value = '';
    tempoInput.value = '15';

    renderizarPedidos();
}

function renderizarPedidos() {
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';

    pedidos.forEach((pedido, index) => {
        const li = document.createElement('li');
        const minutos = Math.floor(pedido.tempoRestante / 60);
        const segundos = pedido.tempoRestante % 60;
        const tempoFormatado = `Tempo restante: ${minutos} min ${segundos} seg`;

        li.innerHTML = `
            <span class="pedido-item">${pedido.item}</span>
            <span class="pedido-tempo">${tempoFormatado}</span>
        `;
        
        if (pedido.tempoRestante <= 0) {
            li.style.backgroundColor = 'green';
        }
        
        listaPedidos.appendChild(li);
    });
}

setInterval(() => {
    pedidos.forEach(pedido => {
        if (pedido.tempoRestante > 0) {
            pedido.tempoRestante--;
        }
    });
    renderizarPedidos();
}, 1000);

