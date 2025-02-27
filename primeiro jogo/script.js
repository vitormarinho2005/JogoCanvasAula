const canvas = document.getElementById('jogoCanvas')
const ctx = canvas.getContext('2d')
let gravidade = 0.5

let gameOver = false
let pontos = 0
document.addEventListener("click", (e) => {
    if (gameOver == true) {
        location.reload()
    }
})

document.addEventListener('keypress', (e) => {
    if (e.code == 'Space' && personagem.pulando == false && gameOver == false) {
        personagem.velocidadey = -15
        personagem.pulando = true
    }
})

const personagem = {
    posicaox: 50,
    posicaoy: canvas.height - 50,
    largura: 50,
    altura: 50,
    velocidadey: 0,
    pulando: false,
    cor: 'blue',
    desenha: function () {
        ctx.fillStyle = this.cor
        if (this.pulando) {
            ctx.beginPath()
            ctx.arc(this.posicaox + this.largura / 2, this.posicaoy + this.altura / 2, this.largura / 2, 0, Math.PI * 2)
            ctx.fill()
        } else {
            ctx.fillRect(this.posicaox, this.posicaoy, this.largura, this.altura)
        }
    }
}

function atualizaPersonagem() {
    if (personagem.pulando == true) {
        personagem.velocidadey += gravidade
        personagem.posicaoy += personagem.velocidadey
        if (personagem.posicaoy >= canvas.height - 50) {
            personagem.velocidadey = 0
            personagem.pulando = false
            personagem.posicaoy = canvas.height - 50 // Garante que o personagem não fique abaixo do chão
        }
    }
}

const obstáculos = []

function criaObstaculo() {
    const obstaculo = {
        posicaoXObstaculo: canvas.width - 100,
        posicaoYObstaculo: canvas.height - 100,
        altura: (Math.random() * 50) + 90,
        largura: 50,
        velocidade: 5
    }
    obstáculos.push(obstaculo)
}

function desenhaObstaculos() {
    ctx.fillStyle = 'red'
    obstáculos.forEach(obstaculo => {
        ctx.fillRect(
            obstaculo.posicaoXObstaculo,
            obstaculo.posicaoYObstaculo,
            obstaculo.largura,
            obstaculo.altura
        )
    })
}

function atualizaObstaculos() {
    obstáculos.forEach((obstaculo, index) => {
        obstaculo.posicaoXObstaculo -= obstaculo.velocidade
        if (obstaculo.posicaoXObstaculo <= 0 - obstaculo.largura) {
            obstáculos.splice(index, 1) // Remove o obstáculo quando sair da tela
            pontos++ // Aumenta a pontuação
            criaObstaculo() // Cria um novo obstáculo
        }
    })
}

function verificaColisao() {
    obstáculos.forEach(obstaculo => {
        if (
            personagem.posicaox < obstaculo.posicaoXObstaculo + obstaculo.largura &&
            personagem.posicaox + personagem.largura > obstaculo.posicaoXObstaculo &&
            personagem.posicaoy < obstaculo.posicaoYObstaculo + obstaculo.altura &&
            personagem.posicaoy + personagem.altura > obstaculo.posicaoYObstaculo
        ) {
            houveColisao()
        }
    })
}

function houveColisao() {
    // Após a colisão, o personagem não pode mais pular
    personagem.pulando = false
    gameOver = true
    obstáculos.forEach(obstaculo => {
        obstaculo.velocidade = 0
    })
    ctx.fillStyle = 'white'
    ctx.fillRect((canvas.width / 2) - 200, (canvas.height / 2) - 50, 400, 100)
    ctx.fillStyle = 'black'
    ctx.font = "50px Arial"
    ctx.fillText("GAME OVER", (canvas.width / 2) - 150, (canvas.height / 2))
}

function desenhaPontuacao() {
    ctx.fillStyle = 'black'
    ctx.font = "30px Arial"
    ctx.fillText("Pontos: " + pontos, 20, 30)
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    desenhaObstaculos()
    personagem.desenha() // Desenhando o personagem
    desenhaPontuacao()

    atualizaObstaculos()
    atualizaPersonagem()
    verificaColisao()

    requestAnimationFrame(loop)
}

criaObstaculo() // Cria o primeiro obstáculo
loop()
