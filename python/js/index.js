var state = {};

const verificar=()=>{
    state["btn_verificar"] = document.getElementById("btn_verificar").innerHTML;
    document.getElementById("btn_verificar").innerHTML = "<img alt='' src='img/cargando.gif' style='width:30px;'/>";

    document.getElementById("dominio").readOnly = true;
    document.getElementById("ip").readOnly = true;
    document.getElementById("puerto").readOnly = true;

    let ip = document.getElementById("ip").value;
    let puerto = document.getElementById("puerto").value;
    fetch('172.0.0.1:8000/', {
        method: 'POST',
        body: JSON.stringify({component:"zkteco", type:"init", ip, puerto:parseInt(puerto)})
    })
    .then((response) => response.json())
    .then((obj) => {
        state["data"] = obj;
        Manejador();
    });
};

const Manejador =()=>{
    switch(state["data"].component){
        case "zkteco":
            zkteco();
            break;
    }
};

const zkteco = ()=>{
    
    let obj = state["data"];
    if(obj.estado ==="exito"){
        document.getElementById("info").style.color = "#000";
        document.getElementById("btn_verificar").innerHTML="";

        let cuerpo = "<div class='negrilla'>Dispositivo encontrado con exito.</div>";
        cuerpo += "<div class='contenido'>";
        cuerpo += "<div><img alt='' src='img/uFace800Plus.png' style='width: 250px;'/></div>";
        cuerpo += "<div class='contenido'><span style='font-weight:bold;'>Nombre:</span> "+obj.data.name+"</div>";
        cuerpo += "<div><span class='negrilla'>Mac:</span> "+obj.data.mac+"</div>";
        cuerpo += "<div><span class='negrilla'>Número de serie:</span> "+obj.data.serialnumber+"</div>";
        cuerpo += "<div><span class='negrilla'>Versión de firmware:</span> "+obj.data.firmware_version+"</div>";
        cuerpo += "</div>";
        
        cuerpo += "<div class='contenido negrilla'>Sonidos</div>";
        cuerpo += "<div  class='contenido' style='display:flex; flex-wrap: wrap; justify-content:center;'>";
        cuerpo += "<div class='boton' onclick='sonar(0, this);'>Agradecer</div>";
        cuerpo += "<div class='boton' onclick='sonar(10, this);'>Cuco</div>";
        cuerpo += "<div class='boton' onclick='sonar(11, this);'>Sirena</div>";
        cuerpo += "<div class='boton' onclick='sonar(13, this);'>Timbre</div>";        
        cuerpo += "</div>";

        cuerpo += "<div class='contenido negrilla'>Eventos</div>";
        cuerpo += "<div  class='contenido' style='display:flex; flex-wrap: wrap; justify-content:center;'>";

        cuerpo += "<div class='card_sin_borde' onclick='disconect(this);'>";
        cuerpo += "<div><img alt='' src='img/disconect.png' style='width:50px;'/></div>";
        cuerpo += "<div>Desconectar</div>";
        cuerpo += "</div>";

        cuerpo += "<div class='card_sin_borde' onclick='apagar(this);'>";
        cuerpo += "<div><img alt='' src='img/apagar.png' style='width:50px;'/></div>";
        cuerpo += "<div>Apagar</div>";
        cuerpo += "</div>";

        cuerpo += "<div class='card_sin_borde' onclick='reiniciar(this);'>";
        cuerpo += "<div><img alt='' src='img/reset.png' style='width:50px;'/></div>";
        cuerpo += "<div>Reiniciar</div>";
        cuerpo += "</div>";

        cuerpo += "<div class='card_sin_borde' onclick='clean_buffer(this);'>";
        cuerpo += "<div><img alt='' src='img/clean.png' style='width:50px;'/></div>";
        cuerpo += "<div>Limpiar Buffer</div>";
        cuerpo += "</div>";
        
        cuerpo += "<div class='card_sin_borde' onclick='verUsuarios(this);'>";
        cuerpo += "<div><img alt='' src='img/users.png' style='width:50px;'/></div>";
        cuerpo += "<div>Ver usuarios</div>";
        cuerpo += "</div>";

        cuerpo += "<div class='card_sin_borde' onclick='delete_data(this);'>";
        cuerpo += "<div><img alt='' src='img/borrar_db.webp' style='width:50px;'/></div>";
        cuerpo += "<div style='color:#ff5500; font-weight:bold;'>Borrar todo</div>";
        cuerpo += "</div>";

        

        cuerpo += "</div>";
        cuerpo += "<div id='info_eventos' style='display:flex; flex-wrap: wrap; justify-content:center;'></div>";

        document.getElementById("info").innerHTML = cuerpo;
    }else{

        document.getElementById("btn_verificar").innerHTML=state["btn_verificar"];
        document.getElementById("dominio").readOnly = false;
        document.getElementById("ip").readOnly = false;
        document.getElementById("puerto").readOnly = false;

        document.getElementById("info").style.color = "#780000";
        if(obj.error.indexOf("can't reach device")>-1){
            document.getElementById("info").innerText = "No se encontró el dispositivo.";
            return;   
        }
        document.getElementById("info").innerText = obj.error;
    }  
};

const sonar=(index_saludo, ele)=>{
    let texto = ele.innerText;
    ele.innerHTML = "<img alt='' src='img/cargando.gif' style='width:30px;'/>";

    let ip = document.getElementById("ip").value;
    let puerto = document.getElementById("puerto").value;

    fetch('172.0.0.1:8000/', {
        method: 'POST',
        body: JSON.stringify({component:"zkteco", type:"sonar",index_saludo,  ip, puerto:parseInt(puerto)})
    })
    .then((response) => response.json())
    .then((obj) => {
        if(obj.estado==="exito"){
            ele.innerText = texto;
        }
        
    });  
};

const verUsuarios=(ele)=>{
    let texto = ele.innerHTML;
    ele.innerHTML = "<img alt='' src='img/cargando.gif' style='width:30px;'/>";
    document.getElementById("info_eventos").innerHTML = "";

    let ip = document.getElementById("ip").value;
    let puerto = document.getElementById("puerto").value;

    fetch('172.0.0.1:8000/', {
        method: 'POST',
        body: JSON.stringify({component:"zkteco", type:"verUsuarios", ip, puerto:parseInt(puerto)})
    })
    .then((response) => response.json())
    .then((obj) => {
        if(obj.estado==="exito"){
            let cuerpo = "";
            let dominio = document.getElementById("dominio").value;
            obj.data.map((usuario)=>{
                cuerpo += "<div class='card'>";
                cuerpo += "<div style='width:100px;'><img alt='' src='"+dominio+"/imagesUser/"+usuario.name+"' style='width:100%;' /></div>";
                cuerpo += "<div><span class='negrilla'>"+usuario.uid+":</span> "+usuario.name+"</div>";
                cuerpo += "</div>";
            });
            document.getElementById("info_eventos").innerHTML = cuerpo;
            ele.innerHTML = texto;
        }
        
    });  
};

const apagar=(ele)=>{
    let texto = ele.innerHTML;
    ele.innerHTML = "<img alt='' src='img/cargando.gif' style='width:30px;'/>";
    document.getElementById("info_eventos").innerHTML = "";

    let ip = document.getElementById("ip").value;
    let puerto = document.getElementById("puerto").value;

    fetch('172.0.0.1:8000/', {
        method: 'POST',
        body: JSON.stringify({component:"zkteco", type:"apagar", ip, puerto:parseInt(puerto)})
    })
    .then((response) => response.json())
    .then((obj) => {
        if(obj.estado==="exito"){
            document.getElementById("btn_verificar").innerHTML=state["btn_verificar"];
            document.getElementById("dominio").readOnly = false;
            document.getElementById("ip").readOnly = false;
            document.getElementById("puerto").readOnly = false;

            document.getElementById("info").style.color = "#000000";
            document.getElementById("info").innerText = "";

        }else{
            document.getElementById("info_eventos").innerHTML = "<div style='color:#FF5500;'>"+obj.error+"</div>";
            ele.innerHTML = texto;
        }
        
    });  
};

const reiniciar=(ele)=>{
    let texto = ele.innerHTML;
    ele.innerHTML = "<img alt='' src='img/cargando.gif' style='width:30px;'/>";
    document.getElementById("info_eventos").innerHTML = "";

    let ip = document.getElementById("ip").value;
    let puerto = document.getElementById("puerto").value;

    fetch('172.0.0.1:8000/', {
        method: 'POST',
        body: JSON.stringify({component:"zkteco", type:"reiniciar", ip, puerto:parseInt(puerto)})
    })
    .then((response) => response.json())
    .then((obj) => {
        if(obj.estado==="exito"){
            document.getElementById("btn_verificar").innerHTML=state["btn_verificar"];
            document.getElementById("dominio").readOnly = false;
            document.getElementById("ip").readOnly = false;
            document.getElementById("puerto").readOnly = false;

            document.getElementById("info").style.color = "#000000";
            document.getElementById("info").innerText = "";

        }else{
            document.getElementById("info_eventos").innerHTML = "<div style='color:#FF5500;'>"+obj.error+"</div>";
            ele.innerHTML = texto;
        }
        
    });  
};

const clean_buffer=(ele)=>{
    let texto = ele.innerHTML;
    ele.innerHTML = "<img alt='' src='img/cargando.gif' style='width:30px;'/>";
    document.getElementById("info_eventos").innerHTML = "";

    let ip = document.getElementById("ip").value;
    let puerto = document.getElementById("puerto").value;

    fetch('172.0.0.1:8000/', {
        method: 'POST',
        body: JSON.stringify({component:"zkteco", type:"clean_buffer", ip, puerto:parseInt(puerto)})
    })
    .then((response) => response.json())
    .then((obj) => {
        if(obj.estado==="exito"){
            document.getElementById("info_eventos").innerHTML = "<div style='color:#00FF0088;'>Limpiado de buffer exitoso</div>";
            ele.innerHTML = texto;

        }else{
            document.getElementById("info_eventos").innerHTML = "<div style='color:#FF5500;'>"+obj.error+"</div>";
            ele.innerHTML = texto;
        }
        
    });  
};
const delete_data=(ele)=>{
    let texto = ele.innerHTML;
    ele.innerHTML = "<img alt='' src='img/cargando.gif' style='width:30px;'/>";
    document.getElementById("info_eventos").innerHTML = "";

    let ip = document.getElementById("ip").value;
    let puerto = document.getElementById("puerto").value;

    fetch('172.0.0.1:8000/', {
        method: 'POST',
        body: JSON.stringify({component:"zkteco", type:"delete_data", ip, puerto:parseInt(puerto)})
    })
    .then((response) => response.json())
    .then((obj) => {
        if(obj.estado==="exito"){
            document.getElementById("info_eventos").innerHTML = "<div style='color:#00FF0088;'>Limpiado de buffer exitoso</div>";
            ele.innerHTML = texto;

        }else{
            document.getElementById("info_eventos").innerHTML = "<div style='color:#FF5500;'>"+obj.error+"</div>";
            ele.innerHTML = texto;
        }
        
    });  
};
const disconect=(ele)=>{
    document.getElementById("btn_verificar").innerHTML=state["btn_verificar"];
    document.getElementById("dominio").readOnly = false;
    document.getElementById("ip").readOnly = false;
    document.getElementById("puerto").readOnly = false;

    document.getElementById("info").style.color = "#000000";
    document.getElementById("info").innerText = "";
};