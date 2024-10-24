document.addEventListener('DOMContentLoaded', () => {
    fetch('./pelislocales.json')
        .then(response => response.json())
        .then(data => {
            // Guardar los datos en localStorage
            localStorage.setItem('peliculas', JSON.stringify(data));
            console.log('Datos cargados en localStorage:', data);
            // Mostrar las películas en la página
            mostrarPeliculas(data);
            mostrarCarrusel(data);
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});

function mostrarPeliculas(peliculas) {
    const movieCards = document.getElementById('movieCards');
    movieCards.innerHTML = ''; // Limpiar cualquier contenido previo

    peliculas.forEach(pelicula => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${pelicula.img}" class="card-img-top" alt="${pelicula.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${pelicula.nombre}</h5>
                    <p class="card-text">Año: ${pelicula.año}</p>
                    <p class="card-text">Tipo: ${pelicula.tipo}</p>
                    <p class="card-text">Actores: ${pelicula.actor1}, ${pelicula.actor2}, ${pelicula.actor3}</p>
                    <p class="card-text">Cine: ${pelicula.cine}</p>
                    <p class="card-text">Días: ${pelicula.dia1}, ${pelicula.dia2}, ${pelicula.dia3}</p>
                    <p class="card-text">Precio: $${pelicula.precio}</p>
                </div>
            </div>
        `;
        movieCards.appendChild(card);
    });
}

function mostrarCarrusel(peliculas) {
    const carouselItems = document.getElementById('carouselItems');
    const carouselIndicators = document.getElementById('carouselIndicators');
    carouselItems.innerHTML = ''; // Limpiar cualquier contenido previo
    carouselIndicators.innerHTML = ''; // Limpiar cualquier contenido previo

    peliculas.forEach((pelicula, index) => {
        const activeClass = index === 0 ? 'active' : '';

        // Crear el indicador del carrusel
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
        indicator.setAttribute('data-bs-slide-to', index);
        indicator.className = activeClass;
        indicator.setAttribute('aria-current', activeClass ? 'true' : 'false');
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        carouselIndicators.appendChild(indicator);

        // Crear el elemento del carrusel
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${activeClass}`;
        carouselItem.innerHTML = `
            <img src="${pelicula.img}" class="d-block w-100" alt="${pelicula.nombre}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${pelicula.nombre}</h5>
                <p>Espectacular estreno</p>
            </div>
        `;
        carouselItems.appendChild(carouselItem);
    });
}

const searchInput = document.getElementById("SearchInput");
const yearInput = document.getElementById("YearInput");
const typeSelect = document.getElementById("TypeSelect");
const filterButton = document.getElementById("FilterButton");
const apiKey = "1002166f";
let debounceTimeout;
let currentPage = 1;
let totalResults = 0;
let searchTerm = '';

// Cargar 5 películas al iniciar la página
window.onload = async () => {
    await loadInitialMovies();
};

// Función para cargar las primeras 5 películas
async function loadInitialMovies() {
    searchTerm = 'horror';
    await fetchMovies(searchTerm, 1);
}

// Función para buscar películas con paginación y filtros
async function fetchMovies(query, page) {
    const year = yearInput.value;
    const type = typeSelect.value;
    let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&page=${page}`;

    if (year) {
        url += `&y=${year}`;
    }
    if (type) {
        url += `&type=${type}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Search) {
            totalResults = data.totalResults;
            displayMovieCards(data.Search); // Mostrar las películas como tarjetas
            updatePagination(page);
        } else {
            clearResults(); // Limpiar si no hay resultados
        }
    } catch (error) {
        console.log('Error al cargar las películas:', error);
    }
}

// Función para mostrar las tarjetas de las películas
function displayMovieCards(movies) {
    const movieCards = document.getElementById("movieCards");
    movieCards.innerHTML = ''; // Limpiar tarjetas previas

    const fragment = document.createDocumentFragment();

    movies.forEach(movie => {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-md-3'); // Columna de 4 en tamaño medio

        cardCol.innerHTML = `
            <div class="card mb-3">
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title} Poster" loading="lazy">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">Año: ${movie.Year}</p>
                    <p class="card-text">Tipo: ${movie.Type}</p>
                </div>
            </div>
        `;
        fragment.appendChild(cardCol);
    });

    movieCards.appendChild(fragment);
}

// Función para actualizar los botones de paginación
function updatePagination(page) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ''; // Limpiar paginación previa

    const totalPages = Math.ceil(totalResults / 10); // OMDB API devuelve 10 resultados por página
    const maxPagesToShow = 10; // Número máximo de páginas a mostrar
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Botón de página anterior
    if (page > 1) {
        const prevItem = document.createElement('li');
        prevItem.classList.add('page-item');
        prevItem.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
        prevItem.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = page - 1;
            fetchMovies(searchTerm, currentPage);
        });
        pagination.appendChild(prevItem);
    }

    // Páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        if (i === page) {
            pageItem.classList.add('active');
        }
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            fetchMovies(searchTerm, currentPage);
        });
        pagination.appendChild(pageItem);
    }

    // Botón de página siguiente
    if (page < totalPages) {
        const nextItem = document.createElement('li');
        nextItem.classList.add('page-item');
        nextItem.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
        nextItem.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = page + 1;
            fetchMovies(searchTerm, currentPage);
        });
        pagination.appendChild(nextItem);
    }
}

// Manejo de búsqueda de películas con debounce
searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        searchTerm = searchInput.value;
        if (searchTerm.length > 2) {
            fetchMovies(searchTerm, 1);
        } else {
            clearResults(); // Limpiar resultados si la búsqueda es corta
        }
    }, 300);
});

// Manejo de filtros
filterButton.addEventListener("click", () => {
    fetchMovies(searchTerm, 1);
});

// Función para limpiar los resultados
function clearResults() {
    const movieCards = document.getElementById("movieCards");
    movieCards.innerHTML = ""; // Limpiar el contenedor de tarjetas
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Limpiar la paginación
}
