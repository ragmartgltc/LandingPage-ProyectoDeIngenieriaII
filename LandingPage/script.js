document.addEventListener("DOMContentLoaded", () => {
  initNavActiva();
  initPestanasProfesional();
  initQuiz();
});

function initNavActiva() {
  const links = document.querySelectorAll(".nav-links a");
  const secciones = [...links]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + entrada.target.id
            )
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  secciones.forEach((s) => observer.observe(s));
}

const profesiones = {
  Salud: {
    titulo: "La IA en la salud",
    texto:
      "Puede apoyar el análisis de datos clínicos, detectar patrones y organizar información para que los profesionales tomen decisiones mejor informadas. Riesgo: un diagnóstico nunca debe depender solo de la IA ni de datos sin verificar.",
    imagen: "assets/imagenes/ambito-profesional.webp",
  },

  Educación: {
    titulo: "La IA en la educación",
    texto:
      "Permite personalizar el aprendizaje, generar ejemplos y practicar con cuestionarios. Riesgo: copiar respuestas sin comprender y perder el pensamiento crítico.",
    imagen: "assets/imagenes/Educación.webp",
  },

  Negocios: {
    titulo: "La IA en los negocios",
    texto:
      "Ayuda a automatizar tareas repetitivas, analizar datos de clientes y agilizar la atención. Riesgo: sesgos en las decisiones y manejo inadecuado de datos privados.",
    imagen: "assets/imagenes/negocios.webp",
  },

  Creatividad: {
    titulo: "La IA en la creatividad",
    texto:
      "Sirve para explorar ideas, borradores, imágenes y música como punto de partida. Riesgo: confundir lo generado con lo original y dudas sobre derechos de autor.",
    imagen: "assets/imagenes/Creatividad.webp",
  },
};

function initPestanasProfesional() {
  const botones = document.querySelectorAll(".tab-btn");
  const tarjeta = document.querySelector(".prof-content-card");
  if (!botones.length || !tarjeta) return;

  const img = tarjeta.querySelector(".prof-image img");
  const titulo = tarjeta.querySelector("h3");
  const texto = tarjeta.querySelector("p");

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const datos = profesiones[btn.textContent.trim()];
      if (!datos) return;

      botones.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tarjeta.style.transition = "opacity 0.25s";
      tarjeta.style.opacity = "0";
      setTimeout(() => {
        titulo.textContent = datos.titulo;
        texto.textContent = datos.texto;
        img.src = datos.imagen;
        img.alt = datos.titulo;
        tarjeta.style.opacity = "1";
      }, 150);
    });
  });
}

const preguntas = [
  {
    imagen: "assets/imagenes/pregunta1.webp",
    correcta: "real",
    explicacion: "Es una fotografía real: la luz, las texturas y los detalles son coherentes.",
  },
  {
    imagen: "assets/imagenes/Pregunta2.webp",
    correcta: "ia",
    explicacion: "Fue generada por IA: revisa manos, texturas y sombras, que suelen delatarla.",
  },
  {
    imagen: "assets/imagenes/Pregunta3.webp",
    correcta: "real",
    explicacion: "Es una fotografía real: los pequeños defectos naturales lo confirman.",
  },
  {
    imagen: "assets/imagenes/Pregunta4.webp",
    correcta: "ia",
    explicacion: "Fue generada por IA: los textos y objetos del fondo suelen salir deformados.",
  },
  {
    imagen: "assets/imagenes/Pregunta5.webp",
    correcta: "real",
    explicacion: "Es una fotografía real: la escena tiene detalles irregulares y naturales.",
  },
];

function initQuiz() {
  const progreso = document.querySelector(".quiz-progress");
  const caja = document.querySelector(".quiz-box");
  if (!progreso || !caja) return;

  const total = preguntas.length;
  let actual = 0;
  let respuestas = [];

  const etiquetas = { real: "Real", ia: "Generado por IA", duda: "No estoy seguro" };

  function mostrarPregunta() {
    const p = preguntas[actual];
    const porcentaje = Math.round(((actual + 1) / total) * 100);
    progreso.textContent = `Pregunta ${actual + 1} de ${total} (${porcentaje}%)`;

    caja.innerHTML = `
      <div class="quiz-question-image" style="text-align:center;margin-bottom:1rem">
        <img id="quiz-img" src="${p.imagen}" alt="Pregunta ${actual + 1} de la actividad"
             style="max-width:350px;border-radius:12px" />
      </div>
      <div class="quiz-options">
        <h3>¿Esta escena es una fotografía real o fue generada por IA?</h3>
        <label><input type="radio" name="p${actual + 1}" value="real" /> Real</label>
        <label><input type="radio" name="p${actual + 1}" value="ia" /> Generado por IA</label>
        <label><input type="radio" name="p${actual + 1}" value="duda" /> No estoy seguro</label>
        <p id="quiz-aviso" style="color:#c0392b;font-size:0.85rem;min-height:1.2em"></p>
        <button class="btn-primary" id="next-btn">
          ${actual === total - 1 ? "Ver resultado" : "Siguiente pregunta →"}
        </button>
      </div>
    `;

    document.getElementById("next-btn").addEventListener("click", siguiente);
  }

  function siguiente() {
    const elegida = caja.querySelector('input[type="radio"]:checked');
    if (!elegida) {
      document.getElementById("quiz-aviso").textContent =
        "Selecciona una opción para continuar.";
      return;
    }

    respuestas.push(elegida.value);

    if (actual < total - 1) {
      actual++;
      mostrarPregunta();
    } else {
      mostrarResultado();
    }
  }

  function mostrarResultado() {
    const aciertos = respuestas.filter((r, i) => r === preguntas[i].correcta).length;
    progreso.textContent = `Actividad completada (${total} de ${total})`;

    let mensaje;
    if (aciertos === total) mensaje = "¡Excelente criterio! Casi nada se te escapa.";
    else if (aciertos >= 3) mensaje = "¡Buen trabajo! Sigue afinando tu ojo crítico.";
    else mensaje = "Distinguir lo real de lo generado es difícil, ¡sigue practicando!";

    const detalle = preguntas
      .map((p, i) => {
        const ok = respuestas[i] === p.correcta;
        return `
          <li style="margin-bottom:10px">
            <strong>${ok ? "✔" : "✘"} Pregunta ${i + 1}:</strong>
            era <em>${etiquetas[p.correcta]}</em> (tu respuesta: ${etiquetas[respuestas[i]]}).
            <br /><small>${p.explicacion}</small>
          </li>`;
      })
      .join("");

    caja.style.flexDirection = "column";
    caja.style.alignItems = "stretch";
    caja.innerHTML = `
      <div style="text-align:center">
        <h3 style="font-size:1.6rem;margin-bottom:8px">Tu resultado: ${aciertos} de ${total}</h3>
        <p style="margin-bottom:20px">${mensaje}</p>
      </div>
      <ul style="list-style:none;font-size:0.9rem;margin-bottom:20px">${detalle}</ul>
      <div style="text-align:center">
        <button class="btn-primary" id="restart-btn">Intentar de nuevo ↺</button>
      </div>
    `;

    document.getElementById("restart-btn").addEventListener("click", () => {
      actual = 0;
      respuestas = [];
      caja.style.flexDirection = "";
      caja.style.alignItems = "";
      mostrarPregunta();
    });
  }

  mostrarPregunta();
}
