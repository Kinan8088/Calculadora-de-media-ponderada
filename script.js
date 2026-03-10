// Textos para el cambio de idioma
const texts = {
  es: {
    title: "Calculadora de Nota Media Ponderada",
    thNumber: "Número",
    thWeight: "Peso (%)",
    placeholderNumber: "Número",
    placeholderWeight: "Peso %",
    labelTotalWeights: "Total pesos:",
    buttonCalc: "Calcular media",
    buttonReset: "Resetear",
    errorNumber: "Número no válido.",
    errorWeight: "Peso debe ser mayor que 0.",
    errorNone: "Ningún dato",
    arithmeticMedia: "Media aritmética",
    weightedMedia: "Media ponderada",
    weightsNot100: (total) => `Pesos suman ${total.toFixed(1)}% (deben sumar 100%).`
  },
  en: {
    title: "Weighted Average Grade Calculator",
    thNumber: "Number",
    thWeight: "Weight (%)",
    placeholderNumber: "Number",
    placeholderWeight: "Weight %",
    labelTotalWeights: "Total weights:",
    buttonCalc: "Calculate average",
    buttonReset: "Reset",
    errorNumber: "Invalid number.",
    errorWeight: "Weight must be greater than 0.",
    errorNone: "No data",
    arithmeticMedia: "Arithmetic mean",
    weightedMedia: "Weighted mean",
    weightsNot100: (total) => `Weights sum ${total.toFixed(1)}% (they must sum 100%).`
  }
};

let lang = "es";

function t(key, ...args) {
  const value = texts[lang][key];
  return typeof value === "function" ? value(...args) : value;
}

let datos = [];

const tablaBody = document.getElementById("table-body");
const totalWeightSpan = document.getElementById("total-weight");
const progressFill = document.getElementById("progress-fill");
const errorDiv = document.getElementById("error");
const errorNumber = document.getElementById("error-number");
const errorWeight = document.getElementById("error-weight");

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang");
  langSelect.addEventListener("change", () => {
    lang = langSelect.value;
    updateTexts();
    // Recalcular resultados para que cambie el texto de los labels
    calcularMedia();
  });

  updateTexts();
  actualizarBarra();
});

// Actualiza todos los textos visibles según idioma
function updateTexts() {
  document.title = t("title");
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.textContent = t("title");

  document.getElementById("th-number").textContent = t("thNumber");
  document.getElementById("th-weight").textContent = t("thWeight");

  const inputNumber = document.getElementById("new-number");
  const inputWeight = document.getElementById("new-weight");
  inputNumber.placeholder = t("placeholderNumber");
  inputWeight.placeholder = t("placeholderWeight");

  document.getElementById("label-total-weights").firstChild.textContent =
    t("labelTotalWeights") + " ";

  document.getElementById("btn-calc").textContent = t("buttonCalc");
  document.getElementById("btn-reset").textContent = t("buttonReset");

  // Actualizar texto de errores de campo si están visibles
  if (errorNumber.style.display === "block") {
    errorNumber.textContent = t("errorNumber");
  }
  if (errorWeight.style.display === "block") {
    errorWeight.textContent = t("errorWeight");
  }

  // Actualizar textos de resultados ya calculados (si existen)
  const arith = document.getElementById("arithmetic-media");
  const weighted = document.getElementById("weighted-media");
  if (arith.textContent) {
    // Recalcular para rehacer el texto con el idioma nuevo
    arith.textContent = calcularMediaAritmetica();
  }
  if (weighted.textContent) {
    weighted.textContent = calcularMediaPonderada();
  }
}

function calcularTotalPesos() {
  const total = datos.reduce((acc, row) => acc + row.peso, 0);
  return total;
}

// Actualizar barra de progreso y su estado
function actualizarBarra() {
  const container = document.querySelector(".progress-container");
  const total = calcularTotalPesos();
  const percent = Math.min(100, total);

  totalWeightSpan.textContent = `${total.toFixed(1)}%`;

  if (total < 100) {
    container.className = "progress-container warning";
  } else if (total > 100) {
    container.className = "progress-container danger";
  } else {
    container.className = "progress-container";
  }

  progressFill.style.width = `${percent}%`;
}

// Limpiar mensajes de error de los campos
function limpiarErroresCampos() {
  const inputs = document.querySelectorAll("#new-number, #new-weight");
  inputs.forEach((input) => {
    input.classList.remove("error");
  });
  errorNumber.style.display = "none";
  errorWeight.style.display = "none";
}

// Validar y añadir fila
function agregarFila() {
  const inputNumber = document.getElementById("new-number");
  const inputWeight = document.getElementById("new-weight");

  const valor = parseFloat(inputNumber.value);
  const peso = parseFloat(inputWeight.value);

  limpiarErroresCampos();
  errorDiv.style.display = "none";

  let hayError = false;

  if (isNaN(valor)) {
    inputNumber.classList.add("error");
    errorNumber.style.display = "block";
    errorNumber.textContent = t("errorNumber");
    hayError = true;
  }

  if (isNaN(peso) || peso <= 0) {
    inputWeight.classList.add("error");
    errorWeight.style.display = "block";
    errorWeight.textContent = t("errorWeight");
    hayError = true;
  }

  if (hayError) {
    return;
  }

  // Añadir fila a la tabla y al array
  const id = "row-" + Date.now();

  datos.push({ id, numero: valor, peso });

  const tr = document.createElement("tr");
  tr.id = id;
  tr.innerHTML = `
    <td>
      <input type="number" value="${valor}" step="any" onchange="actualizarNumero('${id}', this.value)" />
    </td>
    <td>
      <input type="number" value="${peso}" step="any" onchange="actualizarPeso('${id}', this.value)" />
    </td>
    <td>
      <button class="delete-btn" onclick="eliminarFila('${id}')">×</button>
    </td>
  `;

  // Insertar antes de la fila “nueva”
  const newRow = document.getElementById("new-row");
  tablaBody.insertBefore(tr, newRow);

  // Limpiar inputs
  inputNumber.value = "";
  inputWeight.value = "";

  // Actualizar barra
  actualizarBarra();
}

// Actualizar número en el array
function actualizarNumero(id, valor) {
  const row = datos.find((r) => r.id === id);
  if (!row) return;

  const n = parseFloat(valor);
  if (isNaN(n)) return;

  row.numero = n;
  actualizarBarra();
}

// Actualizar peso en el array
function actualizarPeso(id, valor) {
  const row = datos.find((r) => r.id === id);
  if (!row) return;

  const p = parseFloat(valor);
  if (isNaN(p) || p <= 0) return;

  row.peso = p;
  actualizarBarra();
}

// Eliminar fila completa
function eliminarFila(id) {
  datos = datos.filter((r) => r.id !== id);

  const row = document.getElementById(id);
  if (row) row.remove();

  actualizarBarra();
}

function calcularMediaAritmetica() {
  if (datos.length === 0) return t("errorNone");

  const suma = datos.reduce((acc, row) => acc + row.numero, 0);
  const media = suma / datos.length;
  return `${t("arithmeticMedia")}: ${media.toFixed(2)}`;
}

function calcularMediaPonderada() {
  if (datos.length === 0) return t("errorNone");

  const totalPeso = datos.reduce((acc, row) => acc + row.peso, 0);
  if (Math.abs(totalPeso - 100) > 0.01) {
    return t("weightsNot100", totalPeso);
  }

  const sumaPonderada = datos.reduce((acc, row) => acc + row.numero * row.peso, 0);
  const media = sumaPonderada / totalPeso;
  return `${t("weightedMedia")}: ${media.toFixed(2)}`;
}

function calcularMedia() {
  const arith = document.getElementById("arithmetic-media");
  const weighted = document.getElementById("weighted-media");

  arith.textContent = calcularMediaAritmetica();
  weighted.textContent = calcularMediaPonderada();
}

// Resetear todo
function resetear() {
  datos = [];

  const rows = tablaBody.querySelectorAll("tr:not(#new-row)");
  rows.forEach((row) => row.remove());

  document.getElementById("arithmetic-media").textContent = "";
  document.getElementById("weighted-media").textContent = "";
  document.getElementById("new-number").value = "";
  document.getElementById("new-weight").value = "";
  errorDiv.style.display = "none";

  actualizarBarra();
}
