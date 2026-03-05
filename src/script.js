// Texto de cada idioma
const texts = {
  es: {
    title: "Calculadora de Media Ponderada",
    placeholderNumber: "Introduce un número",
    placeholderWeight: "Introduce su peso (porcentaje)",
    buttonAdd: "Agregar",
    buttonCalc: "Calcular media ponderada",
    buttonReset: "Resetear",
    noNumbers: "Números: (ninguno)",
    result: "Media ponderada",
    errorEmpty: "Introduce un número y un peso válidos.",
    errorWeight: "El peso debe ser mayor que 0.",
    errorWeights: "Los pesos deben sumar aproximadamente 100%.",
    errorNotEnough: "No hay números suficientes para calcular.",
    weightLabel: "peso:"
  },
  en: {
    title: "Weighted Average Calculator",
    placeholderNumber: "Enter a number",
    placeholderWeight: "Enter its weight (percentage)",
    buttonAdd: "Add",
    buttonCalc: "Calculate weighted average",
    buttonReset: "Reset",
    noNumbers: "Numbers: (none)",
    result: "Weighted average",
    errorEmpty: "Please enter a valid number and weight.",
    errorWeight: "Weight must be greater than 0.",
    errorWeights: "Weights should sum to approximately 100%.",
    errorNotEnough: "No numbers to calculate.",
    weightLabel: "weight:"
  }
};

let numeros = [];
let pesos = [];
let lang = "es";
let ultimaMedia = null; // Guarda el último resultado numérico

function t(key) {
  return texts[lang][key] || key;
}

// Inicializar al cargar
function init() {
  const langSelect = document.getElementById("lang");
  langSelect.addEventListener("change", () => {
    lang = langSelect.value;
    updateTexts();
  });
  updateTexts();
}

// Actualiza textos según idioma
function updateTexts() {
  document.title = t("title");
  document.getElementById("title").innerText = t("title");

  const inputNumber = document.getElementById("numero");
  const inputWeight = document.getElementById("peso");
  const buttons = document.querySelectorAll("button");

  inputNumber.placeholder = t("placeholderNumber");
  inputWeight.placeholder = t("placeholderWeight");

  buttons.forEach((btn) => {
    const text = btn.textContent.trim();
    if (["Agregar", "Add"].includes(text)) {
      btn.textContent = t("buttonAdd");
    } else if (["Calcular media ponderada", "Calculate weighted average"].includes(text)) {
      btn.textContent = t("buttonCalc");
    } else if (["Resetear", "Reset"].includes(text)) {
      btn.textContent = t("buttonReset");
    }
  });

  if (numeros.length === 0) {
    const listaContainer = document.getElementById("lista-container");
    listaContainer.innerHTML = `<p id="lista">${t("noNumbers")}</p>`;
  } else {
    mostrarLista();
  }

  // Si hay una media calculada, reescribir con nuevo idioma
  const resultadoEl = document.getElementById("resultado");
  if (ultimaMedia !== null) {
    resultadoEl.innerText = `${t("result")}: ${ultimaMedia.toFixed(2)}`;
  }
}

// Agregar número y peso
function agregarNumero() {
  const inputNumero = document.getElementById("numero");
  const inputPeso = document.getElementById("peso");
  const errorDiv = document.getElementById("error");

  const valor = parseFloat(inputNumero.value);
  const peso = parseFloat(inputPeso.value);

  errorDiv.style.display = "none";

  if (isNaN(valor) || isNaN(peso)) {
    errorDiv.textContent = t("errorEmpty");
    errorDiv.style.display = "block";
    return;
  }

  if (peso <= 0) {
    errorDiv.textContent = t("errorWeight");
    errorDiv.style.display = "block";
    return;
  }

  numeros.push(valor);
  pesos.push(peso);

  inputNumero.value = "";
  inputPeso.value = "";

  mostrarLista();
}

// Mostrar lista con botón de eliminar
function mostrarLista() {
  const listaContainer = document.getElementById("lista-container");

  if (numeros.length === 0) {
    listaContainer.innerHTML = `<p id="lista">${t("noNumbers")}</p>`;
    return;
  }

  let html = '<ul style="list-style: none; padding: 0;">';
  numeros.forEach((n, i) => {
    html += `
      <li class="list-item">
        ${n.toFixed(2)} (${t("weightLabel")} ${pesos[i]}%)
        <button class="delete-btn" onclick="eliminarIndice(${i})">×</button>
      </li>`;
  });
  html += "</ul>";

  listaContainer.innerHTML = html;
}

// Eliminar un ítem por índice
function eliminarIndice(i) {
  numeros.splice(i, 1);
  pesos.splice(i, 1);
  mostrarLista();
  document.getElementById("resultado").innerText = "";
  ultimaMedia = null; // Limpiar resultado al eliminar
}

// Calcular media ponderada
function calcularMedia() {
  const resultadoEl = document.getElementById("resultado");

  if (numeros.length === 0) {
    resultadoEl.innerText = t("errorNotEnough");
    ultimaMedia = null;
    return;
  }

  const sumaPesos = pesos.reduce((acc, p) => acc + p, 0);
  const tolerance = 0.01;

  if (Math.abs(sumaPesos - 100) > tolerance) {
    resultadoEl.innerText = t("errorWeights");
    ultimaMedia = null;
    return;
  }

  const sumaPonderada = numeros.reduce((acc, n, i) => acc + n * pesos[i], 0);
  const media = sumaPonderada / sumaPesos;

  ultimaMedia = media; // Guardar valor numérico
  resultadoEl.innerText = `${t("result")}: ${media.toFixed(2)}`;
}

// Resetear todo
function resetear() {
  numeros = [];
  pesos = [];
  ultimaMedia = null; // Limpiar resultado guardado
  document.getElementById("resultado").innerText = "";
  document.getElementById("numero").value = "";
  document.getElementById("peso").value = "";
  document.getElementById("error").style.display = "none";

  const listaContainer = document.getElementById("lista-container");
  listaContainer.innerHTML = `<p id="lista">${t("noNumbers")}</p>`;
}

// Iniciar al cargar
window.onload = init;
