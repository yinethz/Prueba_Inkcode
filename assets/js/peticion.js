peticion={
   enviarFormularioContacto:function(e){
   	e.preventDefault();

   	//Si no se ha cargado la hoja de vida le agrega la clase error al label de la hoja de vida
   	let txtHV=document.querySelector('#txtHojaVida');
   	if(!document.querySelector('#fleHojaVida').value){
   		txtHV.classList.add('error-input');
   		return false; //Cancela el envio del formulario
   	}else{
   		txtHV.classList.remove('error-input');
   	}
   	//Obtiene el formulario
   	let elFormulario=e.target;

   	//Obtiene los valores de los inputs
   	let datos={
   		nombres: 	document.querySelector(`#txtNombres`).value,
			apellidos: 	document.querySelector(`#txtApellidos`).value,
			celular: 	document.querySelector(`#txtCelular`).value,
			correo: 		document.querySelector(`#eilCorreo`).value,
			hoja_vida:  null
   	};

   	/*Se crea un objeto FileRader para convertir el PDF cargado a Base64.
   	*En Base64 es practico guardar los PDF en la base de datos.
   	*/
   	let reader = new FileReader();
	   reader.readAsDataURL(document.querySelector(`#fleHojaVida`).files[0]);

	   reader.onload = () =>{ //Cuando la conversion es exitosa
	     datos.hoja_vida = reader.result; //Se carga el Base64 en el campo del JSON de la hoja de vida
	     this.enviar(elFormulario, datos); //Se envia el formulario
	   };

	   reader.onerror = error=> { //En caso de que falle la conversion a Base64
	     console.error(error);
	   };
   },
   enviar:function(elFormulario, datos){
   	console.log(datos.hoja_vida);
   	//Se utiliza fetch que es nativo de javaScript para enviar los datos
   	fetch(`https://urlEnvioDatos`, //dummy
         {
	         method: 'POST',
	         body: JSON.stringify(datos), //Se convierten los datos a una cadena de carateres en formato JSON
	         headers: {
	            "Accept": "application/json",
	            "Content-Type": "application/json"
	         },
	         cache: 'no-cache'
	      }
      )
      .then(respuesta => {
         return respuesta.json();
      })
      .then(respuesta => {
         elFormulario.reset(); //Se reseta el formulario cuando se han aneviado los datos
      })
      .catch(error => {
      	elFormulario.reset(); //Se reseta el formulario por prueba, se deberia manejar el error
         console.error(error);
      });
   }
}

//Agrega el evento de envio del formulario
document.querySelector('#formContacto')
	.addEventListener('submit', e=>{
		peticion.enviarFormularioContacto(e);
	});

//Agrega al boton de adjuntar, el vento para que abra el input File
document.querySelector('#btnAdjuntar')
	.addEventListener('click', e=>{
		document.querySelector('#fleHojaVida').click();
	});

//Para que muestte el nombre del archivo cargado en el input de la hoja de vida
document.querySelector('#fleHojaVida')
	.addEventListener('change', ev=>{
		let txtHV= document.querySelector('#txtHojaVida');
		txtHV.classList.remove('error-input');
		txtHV.value=ev.target.value.split( "\\" ).pop();
	});

	