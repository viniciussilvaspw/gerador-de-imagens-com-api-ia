const apiKey = "SUA_API_KEY";

const maxImages = 4; // Número de imagens a serem geradas para cada prompt
let selectedImageNumber = null;

// Função para gerar um número aleatório entre min e max (inclusive)
function obterNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para desabilitar o botão de geração durante o processamento
function desabilitarBotaoGerar() {
    document.getElementById("generate").disabled = true;
}

// Função para habilitar o botão de geração após o processamento
function habilitarBotaoGerar() {
    document.getElementById("generate").disabled = false;
}

// Função para limpar o grid de imagens
function limparGridDeImagens() {
    const gridDeImagens = document.getElementById("image-grid");
    gridDeImagens.innerHTML = "";
}

// Função para gerar imagens
async function gerarImagens(entrada) {
    desabilitarBotaoGerar();
    limparGridDeImagens();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const urlsDasImagens = [];

    for (let i = 0; i < maxImages; i++) {
        // Gera um número aleatório entre 1 e 10000 e o anexa ao prompt
        const numeroAleatorio = obterNumeroAleatorio(1, 10000);
        const prompt = `${entrada} ${numeroAleatorio}`;
        // Adicionamos um número aleatório ao prompt para criar resultados diferentes
        const resposta = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!resposta.ok) {
            alert("Falha ao gerar a imagem!");
        }

        const blob = await resposta.blob();
        const urlDaImagem = URL.createObjectURL(blob);
        urlsDasImagens.push(urlDaImagem);

        const img = document.createElement("img");
        img.src = urlDaImagem;
        img.alt = `arte-${i + 1}`;
        img.onclick = () => baixarImagem(urlDaImagem, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    habilitarBotaoGerar();

    selectedImageNumber = null; // Redefine o número da imagem selecionada
}

document.getElementById("generate").addEventListener('click', () => {
    const entrada = document.getElementById("user-prompt").value;
    gerarImagens(entrada);
});

function baixarImagem(urlDaImagem, numeroDaImagem) {
    const link = document.createElement("a");
    link.href = urlDaImagem;
    // Define o nome do arquivo com base na imagem selecionada
    link.download = `imagem-${numeroDaImagem + 1}.jpg`;
    link.click();
}
