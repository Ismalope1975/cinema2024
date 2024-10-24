document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../pelislocales.json');
        if (!response.ok) throw new Error('No se pudieron cargar las películas. Intenta de nuevo más tarde');
        const peliculas = await response.json();
        const movieCardsContainer = document.getElementById('movieCards');

        // Limpiar el contenedor antes de insertar nuevas tarjetas
        movieCardsContainer.innerHTML = peliculas.map(pelicula => crearTarjeta(pelicula)).join('');

        // Agregar el evento de click 
        movieCardsContainer.addEventListener('click', manejarClickVerMas);
    } catch (error) {
        console.error('Error cargando las películas:', error);
        mostrarError('No se pudieron cargar las películas. Intenta de nuevo más tarde.');
    }
});

function crearTarjeta(pelicula) {
  const dias = [pelicula.dia1, pelicula.dia2, pelicula.dia3].filter(Boolean).join(', ');
  return `
      <div class="col">
          <div class="card h-100" data-id="${pelicula.id}">
              <img src="../${pelicula.img}" class="card-img-top img-fluid" alt="${pelicula.nombre}">
              <div class="card-body">
                  <h5 class="card-title">${pelicula.nombre}</h5>
                  <p class="card-text">Año: ${pelicula.año}</p>
                  <p class="card-text text-truncate">Actores: ${pelicula.actor1}, ${pelicula.actor2}, ${pelicula.actor3}</p>
                  <p class="card-text">Cine: ${pelicula.cine}</p>
                  <p class="card-text">Días: ${dias || 'No disponibles'}</p>
                  <p class="card-text">Precio: $${pelicula.precio}</p>
                  <button class="btn btn-primary ver-mas">Más Info</button>
              </div>
          </div>
      </div>
  `;
}

function manejarClickVerMas(event) {
  if (event.target.classList.contains('ver-mas')) {
      const card = event.target.closest('.card');
      if (card) { // Verificar que se ha encontrado la tarjeta
          const movieData = extraerDatosPelicula(card);
          guardarPelicula(movieData);
      }
  }
}

function extraerDatosPelicula(card) {
  return {
      title: card.querySelector('.card-title').textContent,
  };
}

function guardarPelicula(movie) {
  // Borra cualquier valor existente en peliculaselecc
  localStorage.removeItem('peliculaselecc');
  
  // Guarda el nuevo valor
  let peliculasSeleccionadas = [movie.title];
  localStorage.setItem('peliculaselecc', JSON.stringify(peliculasSeleccionadas));
  
  // Muestra el mensaje de confirmación
  Swal.fire({
      title: 'Película guardada',
      text: `${movie.title} ha sido guardada en tu selección.`,
      icon: 'success'
  }).then(() => {
      window.location.href = 'reservas.html';
  });
}

function mostrarError(message) {
  const movieCardsContainer = document.getElementById('movieCards');
  movieCardsContainer.innerHTML = `<p class="error">${message}</p>`;
}

// Cargar las películas al cargar la página
document.addEventListener('DOMContentLoaded', cargarPeliculas);
document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('currentUser');
  if (user) {
      const userObj = JSON.parse(user);
      document.getElementById('userName').textContent = userObj.nombre_usuario;
  }
});