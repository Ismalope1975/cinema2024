document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const urlParams = new URLSearchParams(window.location.search);
  const isEditMode = urlParams.get('edit') === 'true';
  console.log(currentUser);
  if (isEditMode && currentUser) {
    document.getElementById('nombre_usuario').value = currentUser.nombre_usuario;
    document.getElementById('cedula').value = currentUser.cedula;
    document.getElementById('telefono').value = currentUser.telefono;
    document.getElementById('email').value = currentUser.email;
    document.getElementById('password').value = currentUser.password;
  }
  
  document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombreUsuario = document.getElementById('nombre_usuario').value;
    const cedula = document.getElementById('cedula').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const usuario = {
      nombre_usuario: nombreUsuario,
      cedula: cedula,
      telefono: telefono,
      email: email,
      password: password
    };
    
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuarios.find(user => user.cedula === cedula);
    
    if (!usuarioExistente) {
      usuarios.push(usuario);
    } else {
      const index = usuarios.findIndex(user => user.cedula === cedula);
      usuarios[index] = usuario;
    }
    
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    Swal.fire({
      title: 'Datos actualizados',
      text: 'Los datos del usuario han sido actualizados correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '../index.html';
      }
    });
    
    document.getElementById('registroForm').reset();
  });
});
