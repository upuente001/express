// getElementById
function $id(id) {
    return document.getElementById(id);
}


// output information
function output(msg) {
	const m = $id("messages");
	m.innerHTML = msg + m.innerHTML;
}


// file drag hover
function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
}


// file selection
function fileSelectHandler(e) {

    // cancel event and hover styling
    fileDragHover(e);

    // fetch FileList object
	const files = e.target.files || e.dataTransfer.files;

	if (e.constructor.name !== "DragEvent") {
        // process all File objects
        for (var i = 0, f; f = files[i]; i++) {
            parseFile(f);
        }
    }

    // files can be added by drag&drop or clicking on form's button
    // if the later, append files to form files field
	const formFiles = $id("upload").fileselect;
	if (formFiles.files.length === 0) {
        formFiles.files = files;
    }


}


// output file information
function parseFile(file) {

    output(
        "<p>Datos del fichero: <strong>" + file.name +
        "</strong> Tipo: <strong>" + file.type +
        "</strong> Tamaño: <strong>" + file.size +
        "</strong> bytes</p>"
    );

}


function enviar() {
    // debes devolver una función que recoja los datos de submitform usando FormData y haga una
    // petición post (usando el Fetch API) con dichos datos a /pedido/add 
    //  El resultado debes tratarlo como un objeto JSON y mostrarlo por pantalla. En concreto la respuesta
    // JSON debe contener las rutas a los ficheros subidos al servidor (al hacer click sobre ellas deben
    // abrirse los ficheros) y los valores del resto de campos
    // HINT: https://stackoverflow.com/questions/36067767/how-do-i-upload-a-file-with-the-js-fetch-api




    var nombre = document.getElementById("name").value;
    var telef = document.getElementById("tlf").value;
    var email = document.getElementById("email").value;
    var lista = document.getElementById("lista").value;
    var cantidad = document.getElementById("cantidad").value;

    const inputFiles = document.querySelectorAll('input[type="file"]');
    const formData = new FormData();



    if(nombre=="" || telef=="" || email=="" || lista==""){
        alert("Tienes que rellenar todos los campos");
    }else{
        if(lista=="Harry Potter"||lista=="Los juegos del hambre"||lista=="Tierra"||
            lista=="La vida que no elegi"||lista=="El valle sin nombre"){

            if(email.includes("@")){
                if(telef.match("[0-9]{3}-[0-9]{3}-[0-9]{3}")!=null){

                    const fileInput = inputFiles[0].name;
                    for (const file of inputFiles[0].files){
                        formData.append(fileInput,file);
                    }

                    formData.append('name',nombre);
                    formData.append('tlf',telef);
                    formData.append('email',email);
                    formData.append('libro',lista);
                    formData.append('cantidad',cantidad);

                    const url = '/users/add';
                    fetch(url,{
                        method: 'POST',
                        body: formData
                    }).then(resp => resp.json()).then(resp => {
                        [1.2].forEach( id => {
                            const irudia = `<img src='${resp[id].file}' width="100" heigth="100">`;
                            output(irudia)
                        })
                        output("Nombre:"+resp[0].name);
                        output("Telefono:"+resp[0].tlf);
                        output("Email:"+resp[0].email);
                        output("Libro:"+resp[0].libro);
                        output("Cantidad:"+resp[0].cantidad);

                        console.log(resp)
                    })

                }else{
                    alert("El telefono no es valido");
                }
            }else{
                alert("La direccion de correo no es valida");
            }

        }else{
            alert("El nombre del libro no es valido");
        }
    }


}

// initialize
function init() {

	const fileselect = $id("fileselect"),
		filedrag = $id("filedrag"),
		submitbutton = $id("enviar");


	submitbutton.onclick = enviar;


    // file select
    fileselect.addEventListener("change", fileSelectHandler, false);


    // file drop
    filedrag.addEventListener("dragover", fileDragHover, false);
    filedrag.addEventListener("dragleave", fileDragHover, false);
    filedrag.addEventListener("drop", fileSelectHandler, false);
    filedrag.style.display = "block";

}

// call initialization file
if (window.File && window.FileList) {
    init();
}

