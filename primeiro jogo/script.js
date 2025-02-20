const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
let gravidade = 0.5;
let jogoRodando = true;

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidade = -15;
        personagem.pulando = true;
    }
});

const personagem = {
    posx: 50,
    posy: canvas.height - 50,
    tamx: 50,
    tamy: 50,
    velocidade: 0,
    pulando: false
};

function desenhaPersonagem() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(personagem.posx, personagem.posy, personagem.tamx, personagem.tamy);
}

function atualizePersonagem() {
    personagem.velocidade += gravidade;
    personagem.posy += personagem.velocidade;

    // Verifica se o personagem tocou o chão
    if (personagem.posy >= canvas.height - personagem.tamy) {
        personagem.posy = canvas.height - personagem.tamy; // Garante que fique no chão
        personagem.velocidade = 0;
        personagem.pulando = false;
    }
}

const obstaculo = {
    posx: canvas.width - 100,
    posy: canvas.height - 100,
    tamx: 50,
    tamy: 100,
    velocidade: 4
};

function desenhaObstaculo() {
    ctx.fillStyle = 'red';
    ctx.fillRect(obstaculo.posx, obstaculo.posy, obstaculo.tamx, obstaculo.tamy);
}

function atualizeObstaculo() {
    obstaculo.posx -= obstaculo.velocidade;

    // Verifica se o obstáculo saiu da tela e reposiciona
    if (obstaculo.posx + obstaculo.tamx <= 0) {
        obstaculo.posx = canvas.width;
        obstaculo.tamy = Math.random() * 50 + 90;
        obstaculo.posy = canvas.height - obstaculo.tamy;
        obstaculo.velocidade += 0.5;
    }
}

function verificaColisao() { 
    if (
        personagem.posx < obstaculo.posx + obstaculo.tamx &&
        personagem.posx + personagem.tamx > obstaculo.posx &&
        personagem.posy < obstaculo.posy + obstaculo.tamy &&
        personagem.posy + personagem.tamy > obstaculo.posy
    ) {
        gameOver();
    }
}

function gameOver() {
    jogoRodando = false;
    ctx.fillStyle = 'white';
    ctx.fillRect((canvas.width / 2) - 200, (canvas.height / 2) - 50, 400, 100);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    
    obstaculo.velocidade - 0;

    canvas.addEventListener("click", resetarJogo, {once: true});
}

function resetarJogo() {
    jogoRodando = true;
    obstaculo.posx = canvas.width - 100;
    obstaculo.colidiu = false;
    obstaculo.velocidade = 4;
    loop();
}

function loop() {
    if (!jogoRodando) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenhaObstaculo();
    desenhaPersonagem();
    atualizeObstaculo();
    atualizePersonagem();
    verificaColisao();

    requestAnimationFrame(loop);
}

loop();
