document.addEventListener('DOMContentLoaded', () => {
  let usuarios = JSON.parse(localStorage.getItem('usuarios'));
  if (!usuarios || usuarios.length === 0) {
    usuarios = [
      {
        nombre_usuario: "ismael lopez",
        cedula: "37983340",
        telefono: "099680194",
        email: "ismael_lopez83@hotmail.com",
        password: "helicoptero2"
      },
      {
        nombre_usuario: "usuario2",
        cedula: "23456789",
        telefono: "099234567",
        email: "usuario2@example.com",
        password: "password2"
      },
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  document.getElementById('loginForm').addEventListener('submit', manejarLogin);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    actualizarInterfazUsuario(currentUser);
  } else {
    // Deshabilitar el botón de Cartelera si no hay usuario logueado
    document.getElementById('botonreserva').classList.add('disabled');
  }

  function manejarLogin(event) {
    event.preventDefault();
    const cedula = document.getElementById('cedula').value;
    const password = document.getElementById('password').value;

    if (!cedula) {
      Swal.fire({
        icon: 'warning',
        title: 'Por favor, ingrese su número de cédula',
      });
      return;
    }
    if (!password) {
      Swal.fire({
        icon: 'warning',
        title: 'Por favor, ingrese su contraseña',
      });
      return;
    }
    

    const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    const usuario = usuarios.find(user => user.cedula === cedula && user.password === password);

    if (usuario) {
      localStorage.setItem('currentUser', JSON.stringify(usuario));
      actualizarInterfazUsuario(usuario);
    } else {
      Swal.fire({
        title: 'Usuario no encontrado',
        text: '¿Desea registrarse?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = './pages/formulario_registro.html?edit=true';
        }
      });
      
    }
  }

  function actualizarInterfazUsuario(usuario) {
    document.getElementById('loginForm').classList.add('d-none');
    const userInfo = document.getElementById('userInfo');
    userInfo.classList.remove('d-none');
    document.getElementById('userName').textContent = usuario.nombre_usuario;
    document.getElementById('editButton').addEventListener('click', function() {
      window.location.href = './pages/formulario_registro.html?edit=true';
    });
    document.getElementById('logoutButton').addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      location.reload();
    });
    // Habilitar el botón de Cartelera
    document.getElementById('botonreserva').classList.remove('disabled');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const carteleraButton = document.getElementById('botonreserva');
  const userInfo = document.getElementById('userInfo');
  const loginForm = document.getElementById('loginForm');

  // Función para verificar si el usuario está logueado
  function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = currentUser !== null;
    carteleraButton.classList.toggle('disabled', !isLoggedIn);
  }

  // Verificar el estado de inicio de sesión al cargar la página
  checkLoginStatus();

  // Escuchar el evento de inicio de sesión
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cedula = document.getElementById('cedula').value;
    const password = document.getElementById('password').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    const usuario = usuarios.find(user => user.cedula === cedula && user.password === password);

    if (usuario) {
      localStorage.setItem('currentUser', JSON.stringify(usuario));
      userInfo.classList.remove('d-none');
      userInfo.classList.add('d-flex');
      loginForm.classList.add('d-none');
      checkLoginStatus();
    }
  });

  // Escuchar el evento de cierre de sesión
  document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    userInfo.classList.add('d-none');
    userInfo.classList.remove('d-flex');
    loginForm.classList.remove('d-none');
    checkLoginStatus();
  });
});
