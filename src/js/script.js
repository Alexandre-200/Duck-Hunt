const lar = window.innerWidth;
const alt = window.innerHeight;
let qtdPatos = 0;
let posPatoLeft;
let posPatoTop;
let patos;
let direcaoPato;
let direcaoAnterior;
let velocidade = 3;
let idMudarDirecao = 0;
let idMovimentosAleatorios = 0;
let idLoop = 0;
let idCriaPatos = 0;
let idApagaPatos = 0;
let tiros = 20;
let idTeste = 0;
let ma;
let qtdPatosMortos = 0;
let tempoMudanca = 900;
let tempoVoo = 4000;

let todosPatos = 0;
let todosPatosMortos = 0;


let eventModal = false;

const x = document.getElementById("close-modal");

x.addEventListener("click", () => {
    document.body.style.cursor = 'none';
    const alvo = document.getElementById("alvo");
    alvo.style.display = "block";
    const modal = document.getElementById("modal");
    modal.close()
    const arvore = document.getElementById("arvore");
    arvore.style.display = "block";
    const lugarArvore = alt - arvore.getBoundingClientRect().height;
    arvore.style.top = lugarArvore + "px";
    const mato = document.getElementById("mato");
    mato.style.display = "block";
    const lugarMato = alt - mato.getBoundingClientRect().height * 2;
    mato.style.top = lugarMato + "px";
    mato.style.height = alt + "px";
    mato.style.width = lar + "px";
    criarPatos();
    document.addEventListener("click", mouseClick);
    document.addEventListener("mousemove", mouseMove);
})

const xf = document.getElementById("close-modal-final");

xf.addEventListener("click", () => {
    const mf = document.getElementById("modal-final");
    mf.close()
    location.reload();
})


function mouseClick(event) {
    if (tiros > 0 && eventModal) {
        tiros--;
        const ts = document.getElementById("tiros");
        ts.innerHTML = tiros;
        efeitoSonoros("ss", 1);
        for (let i = 0; i < patos.length; i++) {
            let x = event.clientX;
            let y = event.clientY;

            const pato = document.getElementById(`pato${patos[i]}`);
            const p = pato.getBoundingClientRect();
            const w = p.width / 2;
            const h = p.height / 2;
            const patoY = p.top + h;
            const patoX = p.left + w;
            if ((patoY - h < y) && (patoY + h) > y && (patoX - w < x) && (patoX + w > x)) {
                mataPato(patos[i]);
                //mudarCor("red", 0.5, 3000);
                patos.splice(i, 1);
                posPatoLeft.splice(i, 1);
                posPatoTop.splice(i, 1);
                // qtdPatos--;
            }
        }
    }
    eventModal = true;
    const alvo = document.getElementById("alvo");
    const a = alvo.getBoundingClientRect();


    let x = event.clientX - (a.width / 2);
    let y = event.clientY - (a.height / 2);;

    alvo.style.top = y + "px";
    alvo.style.left = x + "px";
}

function mouseMove(event) {

    const alvo = document.getElementById("alvo");
    const a = alvo.getBoundingClientRect();


    let x = event.clientX - (a.width / 2);
    let y = event.clientY - (a.height / 2);;

    alvo.style.top = y + "px";
    alvo.style.left = x + "px";


}

function criarPatos() {
    //console.log("lar "+lar);
    qtdPatos = Math.floor(Math.random() * 1) + 3;
    todosPatos += qtdPatos;
    ma = new Array(qtdPatos);
    posPatoLeft = new Array(qtdPatos);
    posPatoTop = new Array(qtdPatos);
    direcaoAnterior = new Array(qtdPatos);
    patos = new Array(qtdPatos);

    const cenario = document.getElementById("cenario");

    while (cenario.firstChild) {
        cenario.removeChild(cenario.firstChild);
    }

    for (let i = 0; i < qtdPatos; i++) {
        const cenario = document.getElementById("cenario");


        direcaoAnterior[i] = 1;

        let l = lar * 0.8;
        let x = Math.floor(Math.random() * l) + l * 0.1;
        posPatoTop[i] = alt + 100;
        posPatoLeft[i] = x;
        patos[i] = i;
        let pato = document.createElement("div");
        pato.id = `pato${i}`;
        pato.style.width = "130px";
        pato.style.height = "92px";
        pato.style.backgroundImage = `url("src/img/pv.gif")`;
        pato.style.zIndex = 10;
        pato.style.position = "absolute";
        cenario.appendChild(pato);
    }
    subirPatos(20);
    idMovimentosAleatorios = movimentosAleatorios();
}


async function subirPatos(t) {
    for (let j = 0; j < t; j++) {
        for (let i = 0; i < patos.length; i++) {
            const pato = document.getElementById(`pato${patos[i]}`);
            posPatoTop[i] -= velocidade;
            pato.style.top = posPatoTop[i] + "px";
            pato.style.left = posPatoLeft[i] + "px";
        }
        await sleep(5);
    }
}

async function movimentosAleatorios() {
    idMudarDirecao = setInterval(mudarDirecao, tempoMudanca);
    for (let j = 0; j < tempoVoo && patos.length > 0; j++) {
        for (let i = 0; i < patos.length; i++) {
            const pato = document.getElementById(`pato${patos[i]}`);
            const p = pato.getBoundingClientRect();
            if (ma[i] === 1) {
                if (p.left <= lar - 200) {
                    mudarDirecaoImagem(i, pato);
                    posPatoLeft[i] += velocidade;
                    pato.style.left = posPatoLeft[i] + "px";
                }

            } else if (ma[i] === 2) {
                if (p.left >= 100) {
                    mudarDirecaoImagem(i, pato);
                    posPatoLeft[i] -= velocidade;
                    pato.style.left = posPatoLeft[i] + "px";
                }
            }
            else if (ma[i] === 3) {
                if (p.top >= 100) {
                    mudarDirecaoImagem(i, pato);
                    posPatoTop[i] -= velocidade;
                    pato.style.top = posPatoTop[i] + "px";
                }

            }
            else if (ma[i] === 4) {
                if (p.top <= alt - 200) {
                    mudarDirecaoImagem(i, pato);
                    posPatoTop[i] += velocidade;
                    pato.style.top = posPatoTop[i] + "px";
                }
            }//
            else if (ma[i] === 5) {
                if (p.left >= 100 && p.top >= 100) {
                    mudarDirecaoImagem(i, pato);
                    posPatoTop[i] -= velocidade;
                    posPatoLeft[i] -= velocidade;
                    pato.style.left = posPatoLeft[i] + "px";
                    pato.style.top = posPatoTop[i] + "px";
                }
            }
            else if (ma[i] === 6) {
                if (p.left <= lar - 200 && p.top >= 100) {
                    mudarDirecaoImagem(i, pato);
                    posPatoTop[i] -= velocidade;
                    posPatoLeft[i] += velocidade;
                    pato.style.left = posPatoLeft[i] + "px";
                    pato.style.top = posPatoTop[i] + "px";
                }

            }
            else if (ma[i] === 7) {
                if (p.left >= 100 && p.top <= alt - 200) {
                    mudarDirecaoImagem(i, pato);
                    posPatoTop[i] += velocidade;
                    posPatoLeft[i] -= velocidade;
                    pato.style.left = posPatoLeft[i] + "px";
                    pato.style.top = posPatoTop[i] + "px";
                }
            } else {
                if (p.left <= lar - 200 && p.top <= alt - 200) {
                    mudarDirecaoImagem(i, pato);
                    posPatoTop[i] += velocidade;
                    posPatoLeft[i] += velocidade;
                    pato.style.left = posPatoLeft[i] + "px";
                    pato.style.top = posPatoTop[i] + "px";
                }
            }
        }

        await sleep(5);
    }

    for (let j = 0; j < alt; j++) {
        await sleep(5)
        for (let i = 0; i < patos.length; i++) {
            const pato = document.getElementById(`pato${patos[i]}`);
            posPatoTop[i] -= velocidade;
            pato.style.top = posPatoTop[i] + "px";
        }
    }

    clearInterval(idMudarDirecao);
    const qtd = qtdPatos - patos.length;
    todosPatosMortos += qtd;

    final(qtd, 270);
}

function mudarDirecao() {
    for (let i = 0; i < qtdPatos; i++) {
        ma[i] = Math.floor(Math.random() * 8) + 1;
    }
}

async function mataPato(p) {
    const pato = document.getElementById(`pato${p}`);
    pato.style.width = "124px";
    pato.style.height = "116px";
    pato.style.backgroundImage = `url("src/img/pt.png")`;
    await sleep(150);
    pato.style.width = "56px";
    pato.style.height = "98px";
    pato.style.backgroundImage = `url("src/img/pm.gif")`;
    let top = pato.getBoundingClientRect().top;
    while (top <= alt) {
        top += (velocidade * 1.5);
        pato.style.top = top + "px";
        await sleep(10);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const efeitoSonoros = (som, vezes) => {
    const s = document.createElement("audio");
    s.src = "src/mp3/" + som + ".mp3";
    for (let i = 0; i < vezes; i++) {
        s.addEventListener("canplaythrough", () => {
            s.play();
        }, false);
    }
}

async function final(patos, mov) {
    const cachorro = document.getElementById("cachorro");
    pos = alt;
    cachorro.style.top = pos + "px";
    cachorro.style.left = lar / 2 - 100 + "px";
    if (patos === 0) {
        cachorro.style.width = "203px";
        cachorro.style.height = "279px";
        cachorro.style.backgroundImage = `url("src/img/cr.gif")`;
        efeitoSonoros("rr", 1);
    } else {
        cachorro.style.width = "336px";
        cachorro.style.height = "235px";
        cachorro.style.backgroundImage = `url("src/img/cp${patos}.png")`;
    }
    for (let i = 0; i < mov; i++) {
        pos -= 1;
        cachorro.style.top = pos + "px";
        await sleep(4);
    }
    await sleep(1200);
    for (let i = 0; i < mov; i++) {
        pos += 1;
        cachorro.style.top = pos + "px";
        await sleep(4);
    }
    if (patos > 0 && tiros > 0) {
        velocidade += 10;
        tempoMudanca -= 100;
        tempoVoo -= 200;
        criarPatos();
    } else {
        const arvore = document.getElementById("arvore");
        arvore.style.display = "none";
        const mato = document.getElementById("mato");
        mato.style.display = "none";
        const alvo = document.getElementById("alvo");
        alvo.style.display = "none";
        document.body.style.cursor = 'auto';


        console.log("qtd patos criados " + todosPatos);
        console.log("qtd patos mortos " + todosPatosMortos);
        const percentagem = 100 * todosPatosMortos / 20;
        console.log("percentagem " + percentagem);

        let texto = document.getElementById("texto");

        texto.innerHTML = "Parabéns, com 20 tiros você conseguiu acertar "+ todosPatosMortos+" patos, tendo"+
        
        " uma porcentagem de acerto de "+percentagem+ " %";

        const mf = document.getElementById("modal-final");
        mf.showModal();


    }
}

function mudarDirecaoImagem(i, pato) {
    if (ma[i] === 1 || ma[i] === 6 || ma[i] === 8) {
        if (direcaoAnterior[i] === 2 || direcaoAnterior[i] === 5 || direcaoAnterior[i] === 7) {
            pato.style.transform = 'scaleX(1)';
            direcaoAnterior[i] = ma[i];
        }
    }
    if (ma[i] === 2 || ma[i] === 5 || ma[i] === 7) {
        if (direcaoAnterior[i] === 1 || direcaoAnterior[i] === 6 || direcaoAnterior[i] === 8) {
            pato.style.transform = 'scaleX(-1)';
            direcaoAnterior[i] = ma[i];
        }
    }
}

window.addEventListener('load', function () {
    const modal = document.getElementById("modal");
    modal.showModal();
});