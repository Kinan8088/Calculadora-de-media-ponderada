let numeros = [];
let pesos = [];

function agregarNumero() {
  const inputNumero = document.getElementById("numero");
  const inputPeso = document.getElementById("peso");

  const valor = parseFloat(inputNumero.value);
  const peso = parseFloat(inputPeso.value);

  if (!isNaN(valor) && !isNaN(peso) && peso > 0) {
    numeros.push(valor);
    pesos.push(peso);
    mostrarLista();
    inputNumero.value = "";
    inputPeso.value = "";
  } else {
    alert("Hay que introducir un número y un peso válidos (peso > 0).");
  }
}

function mostrarLista() {
  const lista = numeros.map((n, i) => `${n} (peso: ${pesos[i]})`);
  document.getElementById("lista").innerText = "Números: " + lista.join(", ");
}

function calcularMedia() {
  if (numeros.length === 0) {
    document.getElementById("resultado").innerText = "No hay números para calcular.";
    return;
  }

  const sumaPonderada = numeros.reduce((acc, n, i) => acc + n * pesos[i], 0);
  const sumaPesos = pesos.reduce((acc, p) => acc + p, 0);
  const media = sumaPonderada / sumaPesos;

  document.getElementById("resultado").innerText = `Media ponderada: ${media.toFixed(2)}`;
}

function resetear() {
  numeros = [];
  pesos = [];
  document.getElementById("lista").innerText = "Números: (ninguno)";
  document.getElementById("resultado").innerText = "";
  document.getElementById("numero").value = "";
  document.getElementById("peso").value = "";
}
