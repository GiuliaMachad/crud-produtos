function salvarToken(token){
    localStorage.setItem('token', token)
}

function obterToken(){
   return localStorage.getItem("token");
}

function salvarUsuario(usuario){
   return localStorage.setItem('usuario', JSON.stringify(usuario));
}

function obterUsuario(){
    let usuarioStore = localStorage.getItem("usuario");
    return JSON.parse(usuarioStore);
}

function sairDoSistema(){
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario');
    window.open('login.html', '_self');
}