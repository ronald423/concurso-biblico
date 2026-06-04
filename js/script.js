
/* VARIABLES DE CONTROL */
let historialPreguntas = [];
let historialRespuestas = [];



/* LIBROS */
const AT = ["Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio", "Josué", "Jueces", "Rut", "1 Samuel", "2 Samuel", "1 Reyes", "2 Reyes", "1 Crónicas", "2 Crónicas", "Esdras", "Nehemías", "Ester", "Job", "Salmos", "Proverbios", "Eclesiastés", "Cantares", "Isaías", "Jeremías", "Lamentaciones", "Ezequiel", "Daniel", "Oseas", "Joel", "Amós", "Abdías", "Jonás", "Miqueas", "Nahúm", "Habacuc", "Sofonías", "Hageo", "Zacarías", "Malaquías"];
const NT = ["Mateo", "Marcos", "Lucas", "Juan", "Hechos", "Romanos", "1 Corintios", "2 Corintios", "Gálatas", "Efesios", "Filipenses", "Colosenses", "1 Tesalonicenses", "2 Tesalonicenses", "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos", "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan", "Judas", "Apocalipsis"];

let usados = new Set();
let actual = "";
let visible = false;
let tipoActual = "";

/* ===== GENERAR SIN REPETIR ===== */
function generar(tipo) {
    tipoActual = tipo;
    let lista = tipo === 'AT' ? AT : NT;

    let libro, cap, ver, clave;

    do {
        libro = lista[Math.floor(Math.random() * lista.length)];
        cap = Math.floor(Math.random() * 50) + 1;
        ver = Math.floor(Math.random() * 40) + 1;
        clave = tipo + libro + cap + ver;
    } while (usados.has(clave));

    usados.add(clave);

    actual = `${libro} - ${cap}:${ver}`;

    // Guardar pregunta en historial
    historialPreguntas.push({
        id: historialPreguntas.length + 1,
        libro: libro,
        capitulo: cap,
        versiculo: ver,
        codigo: `${lista.indexOf(libro) + 1}, ${cap}, ${ver}`,

        participantes: []
    });




    let codigoGenerado =
        `${lista.indexOf(libro) + 1}, ${cap}, ${ver}`;

    /*document.getElementById("codigo").innerText =
        `Código: ${codigoGenerado}`;*/
    let tipoTexto =
        tipo === "AT"
            ? "📖 CÓDIGO EXTERNO"
            : "📖 CÓDIGO LOCAL";

    document.getElementById("codigo").innerHTML = `
    <b>${tipoTexto}</b><br>
    ${codigoGenerado}`;

    // Mostrar modal grande
    mostrarCodigo(codigoGenerado, tipo);

    ocultar();
    iniciarTimer();
}

/* ===== OJO ===== */
/*function toggle() {
    let r = document.getElementById("resultado");

    if (visible) {
        r.classList.add("oculto");
        visible = false;
        return;
    }

    let tipoTexto =
        tipoActual === "AT"
            ? "📖 CÓDIGO EXTERNO (Antiguo Testamento)"
            : "📖 CÓDIGO LOCAL (Nuevo Testamento)";

    r.innerHTML = `
        <b>${tipoTexto}</b><br>
        <hr>
        <b>Libro:</b> ${actual}
    `;

    r.classList.remove("oculto");
    visible = true;
}*/
function toggle() {

    let modal = document.getElementById("modalResultado");

    let titulo =
        tipoActual === "AT"
            ? "📖 CÓDIGO EXTERNO (Antiguo Testamento)"
            : "📖 CÓDIGO LOCAL (Nuevo Testamento)";

    document.getElementById("tituloResultado").innerText = titulo;
    document.getElementById("textoResultado").innerText = actual;

    modal.style.display = "flex";
}

function cerrarResultado() {
    document.getElementById("modalResultado").style.display = "none";
}

/* ===== TIMER ===== */
let tiempo = 10;
let intervalo;

function iniciarTimer() {
    clearInterval(intervalo);

    tiempo = parseInt(document.getElementById("tiempoInput").value);
    document.getElementById("timer").innerText = "⏱ " + tiempo;

    intervalo = setInterval(() => {
        tiempo--;
        document.getElementById("timer").innerText = "⏱ " + tiempo;

        if (tiempo <= 0) {
            clearInterval(intervalo);
        }
    }, 1000);
}

function aplicarTiempo() {
    alert("Tiempo ajustado para la siguiente pregunta");
}

/* ===== EQUIPOS ===== */
let idEquipo = 0;

function guardarEquipo() {

    let nombre =
        document.getElementById("nuevoNombre").value;

    let logo =
        document.getElementById("nuevoClub").value;

    if (nombre.trim() === "") {

        alert("Ingrese un nombre");

        return;
    }
    idEquipo++;

    let div = document.createElement("div");
    div.className = "team";

    div.innerHTML = `<input id="name${idEquipo}" value="${nombre}">
<div class="logo-container">
    <img id="logo${idEquipo}"
     src="${logo || 'img/default.png'}"
     onerror="this.src='img/default.png'">
</div>


<select onchange="cambiarLogo(${idEquipo}, this)">


    <option value="">Seleccionar</option>
    <option value="img/HeroesDeFe.png"${logo === "img/HeroesDeFe.png" ? "selected" : ""}>Heroes de Fe</option>
    <option value="img/Salem.png"${logo === "img/Salem.png" ? "selected" : ""}>Salem</option>
    <option value="img/Oriel.png"${logo === "img/Oriel.png" ? "selected" : ""}>Oriel</option>
    <option value="img/Fortaleza.png" ${logo === "img/Fortaleza.png" ? "selected" : ""}>Fortaleza</option>
    <option value="img/Jahdiel.png" ${logo === "img/Jahdiel.png" ? "selected" : ""}>Jahdiel</option>
    <option value="img/Origen.png" ${logo === "img/Origen.png" ? "selected" : ""}>Origen</option>
    <option value="img/Atipak.png" ${logo === "img/Atipak.png" ? "selected" : ""}>Atipak</option>
</select>

<div class="score" id="score${idEquipo}">0</div>

<button onclick="sumar(${idEquipo})">➕</button>
<button onclick="restar(${idEquipo})">➖</button>
<button onclick="eliminarEquipo(this)" style="background:red;">🗑</button>
`;

    document.getElementById("teams").appendChild(div);

    let img = document.getElementById("logo" + idEquipo);

    img.onerror = function () {
        this.src = "img/default.png";
    };

    ajustarTamaño();
    cerrarModal();
}

/* PUNTAJE */
function sumar(id) {

    let s = document.getElementById("score" + id);
    s.innerText = parseInt(s.innerText) + 1;

    let nombreEquipo =
        document.getElementById("name" + id).value;

    // Obtener el select del equipo
    let selector = document.querySelector("#score" + id)
        .closest(".team")
        .querySelector("select");

    // Obtener texto visible
    let club =
        selector.options[
            selector.selectedIndex
        ].text;

    // Guardar en historial
    if (historialPreguntas.length > 0) {

        let ultimaPregunta =
            historialPreguntas[
            historialPreguntas.length - 1
            ];

        ultimaPregunta.participantes.push({
            nombre: nombreEquipo,
            club: club
        });
    }

}
function restar(id) {
    let s = document.getElementById("score" + id);
    let val = parseInt(s.innerText);
    if (val > 0) s.innerText = val - 1;
}

/* FULLSCREEN */
function pantallaCompleta() {

    if (!document.fullscreenElement) {

        document.documentElement.requestFullscreen();

    } else {

        document.exitFullscreen();

    }
}

/* OCULTAR */
function ocultar() {
    document.getElementById("resultado").classList.add("oculto");
    visible = false;
}
/* LOGO */
function cambiarLogo(id, select) {

    let img = document.getElementById("logo" + id);

    img.onerror = function () {
        this.src = "img/default.png";
    };

    img.src = select.value;
}

function ajustarTamaño() {
    let total = document.querySelectorAll(".team").length;
    let grid = document.getElementById("teams");

    if (total > 12) {
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px, 1fr))";
    }
    if (total > 20) {
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(100px, 1fr))";
    }
}

/*FUNCIÓN PARA ELIMINAR*/
function eliminarEquipo(btn) {
    btn.closest(".team").remove();
    ajustarTamaño(); // opcional para recalcular layout
}


function reiniciarTodo() {

    // 1. borrar equipos
    document.getElementById("teams").innerHTML = "";

    // 2. reset variables
    idEquipo = 0;
    usados = new Set();

    // 3. limpiar código
    document.getElementById("codigo").innerText = "";

    // 4. limpiar resultado
    document.getElementById("resultado").classList.add("oculto");
    document.getElementById("resultado").innerText = "";

    // 5. reset timer (si existe)
    if (typeof intervalo !== "undefined") {
        clearInterval(intervalo);
    }

    if (document.getElementById("timer")) {
        document.getElementById("timer").innerText = "⏱ 0";
    }

    // 6. reset variables de juego
    actual = "";
    visible = false;

    alert("🔄 Reiniciando Todo");
}


function abrirModalExportar() {

    document.getElementById(
        "modalExportar"
    ).style.display = "flex";

}

function cerrarModalExportar() {

    document.getElementById(
        "modalExportar"
    ).style.display = "none";

}

function confirmarExportacion() {

    let concurso =
        document.getElementById(
            "nombreConcurso"
        ).value;

    let iglesia =
        document.getElementById(
            "nombreIglesia"
        ).value;

    let fecha =
        document.getElementById(
            "fechaConcurso"
        ).value;

    cerrarModalExportar();

    exportarActaFinal(
        concurso,
        iglesia,
        fecha
    );
}



function exportarPDF() {

    let nombreArchivo = prompt(
        "Ingrese el nombre del archivo PDF:",
        "Concurso_Biblico"
    );

    // Si cancela
    if (nombreArchivo === null) {
        return;
    }

    // Si deja vacío
    if (nombreArchivo.trim() === "") {
        nombreArchivo = "Concurso_Biblico";
    }

    let elemento = document.body;

    html2pdf()
        .set({
            margin: 10,
            filename: nombreArchivo + ".pdf",
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                format: 'a4',
                orientation: 'portrait'
            }
        })
        .from(elemento)
        .save();
}

function exportarActaFinal(
    concurso,
    iglesia,
    fecha
) {


    let html = `

                <h1 style="text-align:center;">
                📖 ACTA OFICIAL DE CONCURSO BÍBLICO
                </h1>

                <h3>
                Concurso: ${concurso}
                </h3>

                <h3>
                Iglesia: ${iglesia}
                </h3>

                <h3>
                Fecha: ${fecha}
                </h3>

                <hr>

                `;


    html += `
<h3>PREGUNTAS REALIZADAS</h3>

<table border="1"
       cellspacing="0"
       cellpadding="8"
       style="width:100%;border-collapse:collapse;text-align:center;">

<tr style="background:#eaeaea;">
    <th>N°</th>
    <th>Libro/Codigo</th>
    <th>Participante</th>
</tr>
`;



    historialPreguntas.forEach(p => {
        html += `
    <tr>
        <td>${p.id}</td>

        <td>
        <b>${p.libro} ${p.capitulo}:${p.versiculo}</b>
        <br>
        Código: ${p.codigo}
    </td>

        <td>
    ${p.participantes.length > 0
                ?
                p.participantes
                    .map(x =>
                        `${x.nombre} (${x.club})`
                    )
                    .join(", ")
                :
                "-"
            }
</td>
    </tr>
    `;
    });


    html += `
</table>

<br><br>
`;


    html += "</table><br>";

    html += `
        <h3>RESULTADO FINAL</h3>
        <table border="1" cellspacing="0" cellpadding="5"
        style="width:100%;border-collapse:collapse;">
            <tr>
                <th>Nombre</th>
                <th>Club</th>
                <th>Puntos</th>
                
            </tr>
    `;

    let totalGeneral = 0;

    document.querySelectorAll(".team").forEach(t => {

        let nombre =
            t.querySelector("input").value;

        let selector = t.querySelector("select");

        let grupo =
            selector.options[
                selector.selectedIndex
            ].text;

        let puntos =
            parseInt(
                t.querySelector(".score").innerText
            );

        totalGeneral += puntos;

        html += `
            <tr>
                <td>${nombre}</td>
                <td>${grupo}</td>
                <td>${puntos}</td>
            </tr>
        `;
    });

    html += `
        </table>

        <h2>
            TOTAL LIBROS: ${totalGeneral}
        </h2>
    `;

    document.getElementById("reporte").innerHTML = html;

    let elemento =
        document.getElementById("reporte");

    elemento.style.display = "block";

    html2pdf()
        .set({
            margin: 10,
            filename: concurso + ".pdf",
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                format: "a4",
                orientation: "portrait"
            }
        })
        .from(elemento)
        .save()
        .then(() => {
            elemento.style.display = "none";
        });
}




window.onload = function () {

    let hoy = new Date();

    let fecha =
        hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoy.getDate()).padStart(2, "0");

    document.getElementById("fechaConcurso").value = fecha;
};


function abrirModal() {

    document.getElementById("nuevoNombre").value = "";
    document.getElementById("nuevoClub").selectedIndex = 0;

    document.getElementById("modalEquipo").style.display = "flex";
}

function cerrarModal() {

    document.getElementById("modalEquipo").style.display = "none";
}


function mostrarCodigo(codigo, tipo) {

    if (tipo === "AT") {

        document.getElementById("tituloCodigo")
            .innerText = "📖 CÓDIGO EXTERNO";

    } else {

        document.getElementById("tituloCodigo")
            .innerText = "📖 CÓDIGO LOCAL";
    }

    document.getElementById("codigoGrande")
        .innerText = codigo;

    document.getElementById("modalCodigo")
        .style.display = "flex";
}

function cerrarCodigo() {

    document.getElementById("modalCodigo")
        .style.display = "none";
}



function cerrarCodigo() {

    document.getElementById("modalCodigo").style.display =
        "none";
}



function abrirModalPDF() {

    document.getElementById("modalPDF")
        .style.display = "flex";
}

function cerrarModalPDF() {

    document.getElementById("modalPDF")
        .style.display = "none";
}

function confirmarExportacionPDF() {

    let nombre = document
        .getElementById("nombrePDF")
        .value
        .trim();

    if (nombre === "") {
        nombre = "Concurso_Biblico";
    }

    let elemento = document.body;

    html2pdf()
        .set({
            margin: 10,
            filename: nombre + ".pdf",
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                format: 'a4',
                orientation: 'portrait'
            }
        })
        .from(elemento)
        .save();

    cerrarModalPDF();
}
