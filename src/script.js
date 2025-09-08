
const API_KEY = 'b3df8cfcacb9816918eef0c0080a06f5';
const BASE_URL = 'https://api.themoviedb.org/3';

//funções de carregamento de tela
function mostrarLoading() {
  document.getElementById('loading').style.display = 'block';
}

function esconderLoading() {
  document.getElementById('loading').style.display = 'none';
}

//recomendações
async function pegarFilmesPopulares() {
  try {
    const resposta = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
    const dados = await resposta.json();
    const filmes = dados.results.slice(0, 12);

    const container = document.getElementById('filmes');
    if (!container) {
      console.warn('Elemento com ID "filmes" não encontrado no DOM.');
      return;
    }

    container.innerHTML = '';

    let porSlide = 6;
    const largura = window.innerWidth;
    if (largura <= 576) porSlide = 2;
    else if (largura <= 744) porSlide = 3;

    for (let i = 0; i < filmes.length; i += porSlide) {
      const grupo = filmes.slice(i, i + porSlide);

      const item = document.createElement('div');
      item.classList.add('carousel-item');
      if (i === 0) item.classList.add('active');

      const grupoDiv = document.createElement('div');
      grupoDiv.classList.add('d-flex', 'justify-content-center', 'gap-4');

      grupo.forEach(filme => {
        const div = document.createElement('div');
        div.style.flex = '0 0 auto';
        div.style.width = '150px';
        div.classList.add('text-center');

        const imagem = filme.poster_path
          ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
          : 'https://via.placeholder.com/250x375?text=Sem+Imagem';

        const nota = filme.vote_average ? Math.round(filme.vote_average * 10) : '—';

        div.innerHTML = `
          <img src="${imagem}" alt="${filme.title}" class="rounded" style="width:100%;">
          <div class="p-2">
            <h4 class="mb-1 text-light"><strong>${filme.title}</strong></h4>
            <h5 class="text-light fw-light">${nota}%</h5>
          </div>
        `;

        grupoDiv.appendChild(div);
      });

      item.appendChild(grupoDiv);
      container.appendChild(item);
    }
  } catch (erro) {
    console.error('Erro ao buscar filmes populares:', erro);
  }
}

//elenco
async function carregarElenco(movieId) {
  try {
    const resposta = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=pt-BR`);
    const dados = await resposta.json();
    const elenco = dados.cast.slice(0, 12);

    const container = document.getElementById('elenco-container');
    if (!container) return;

    container.innerHTML = '';

    let porSlide = 6;
    const largura = window.innerWidth;
    if (largura <= 576) porSlide = 2;
    else if (largura <= 744) porSlide = 3;
    else if (largura <= 992) porSlide = 4;

    for (let i = 0; i < elenco.length; i += porSlide) {
      const grupo = elenco.slice(i, i + porSlide);

      const item = document.createElement('div');
      item.classList.add('carousel-item');
      if (i === 0) item.classList.add('active');

      const grupoDiv = document.createElement('div');
      grupoDiv.classList.add('d-flex', 'justify-content-center', 'gap-4');

      grupo.forEach(ator => {
        const card = document.createElement('div');
        card.style.flex = '0 0 auto';
        card.style.width = '160px';
        card.classList.add('text-center');

        const foto = ator.profile_path
          ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
          : 'https://via.placeholder.com/140x140?text=Sem+Foto';

        card.innerHTML = `
          <div class="text-center" style="background-color: var(--secondary-color); border-radius:18px;">
            <img src="${foto}" alt="${ator.name}" class="rounded-circle shadow mx-auto"
                 style="width:140px; height:140px; object-fit:cover;">
            <div class="card-body p-2">
              <span class="card-title mb-1">${ator.name}</span>
              <p class="card-text text-muted mb-0">como ${ator.character}</p>
            </div>
          </div>
        `;

        grupoDiv.appendChild(card);
      });

      item.appendChild(grupoDiv);
      container.appendChild(item);
    }
  } catch (erro) {
    console.error('Erro ao carregar elenco:', erro);
  }
}

//filme banner detalhes (infos) do inicio
async function carregarDetalhesDoFilme(movieId) {
  try {
    const [respostaDetalhes, respostaCreditos] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=b3df8cfcacb9816918eef0c0080a06f5&language=pt-BR`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=b3df8cfcacb9816918eef0c0080a06f5`)
    ]);

    const filme = await respostaDetalhes.json();
    const creditos = await respostaCreditos.json();

    const container = document.getElementById('detalhes-filme');
    const poster = document.getElementById('poster-filme');

    if (!container || !poster) {
      console.warn('Elemento de detalhes ou pôster não encontrado.');
      return;
    }

    const roteirista = creditos.crew.find(p => p.job === 'Writer' || p.job === 'Screenplay' || p.department === 'Writing');

    poster.src = filme.poster_path
      ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
      : './src/img/posterTumuloDosVagalumes-min.jpg';

    poster.alt = `Pôster de ${filme.title}`;

    const generos = filme.genres.map(g => g.name).join(', ');
    const receita = filme.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });
    const orcamento = filme.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' });
    const idioma = filme.original_language.toUpperCase();
    const ano = filme.release_date ? filme.release_date.slice(0, 4) : '—';

    container.innerHTML = `
      <h1 class="titleFilm mt-4">${filme.title} <span class="registerNum">(${ano})</span></h1>
      <div class="colunas-info">
      <h5>Gênero:</h5>
      <p>${generos}</p>

      <h5>Sinopse:</h5>
      <p>${filme.overview}</p>
      </div>

      <div class="detalhes-filme">
      <div class="col-md-6">
          <h5>Dirigido por:</h5>
          <p>${creditos.crew.find(p => p.job === 'Director')?.name || '—'}</p>
          <h5>Situação:</h5>
          <p>${filme.status}</p>

          <h5>Orçamento:</h5>
          <p>${orcamento}</p>
          </div>

          <div class="col-md-6">
          <h5>Escrito por:</h5>
          <p>${roteirista?.name || '—'}</p>
          <h5>Idioma original:</h5>
          <p>${idioma}</p>
          <h5>Receita:</h5>
          <p>${receita}</p>
          </div>
          </div>
    `;
  } catch (erro) {
    console.error('Erro ao carregar detalhes do filme:', erro);
  }
}

//videos da midia
async function carregarVideosDoFilme(movieId) {
  try {
    const resposta = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=b3df8cfcacb9816918eef0c0080a06f5&language=pt-BR`);
    const dados = await resposta.json();
    const videos = dados.results.filter(v => v.site === 'YouTube').slice(0, 8);

    const container = document.getElementById('videos-filme');
    if (!container) {
      console.warn('Elemento com ID "videos-filme" não encontrado.');
      return;
    }

    container.innerHTML = '';

    let porSlide = 3;
    const largura = window.innerWidth;
    if (largura <= 576) porSlide = 1;
    else if (largura <= 744) porSlide = 2;

    for (let i = 0; i < videos.length; i += porSlide) {
      const grupo = videos.slice(i, i + porSlide);

      const item = document.createElement('div');
      item.classList.add('carousel-item');
      if (i === 0) item.classList.add('active');

      const grupoDiv = document.createElement('div');
      grupoDiv.classList.add('d-flex', 'justify-content-center', 'gap-3');

      grupo.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.style.flex = '0 0 auto';
        videoCard.style.width = '360px';
        videoCard.classList.add('text-center');

        videoCard.innerHTML = `
          <iframe width="360" height="225" src="https://www.youtube.com/embed/${video.key}" frameborder="0" allowfullscreen style="border-radius:12px;"></iframe>
          <p class="text-light"></p>
        `;

        grupoDiv.appendChild(videoCard);
      });

      item.appendChild(grupoDiv);
      container.appendChild(item);
    }
  } catch (erro) {
    console.error('Erro ao carregar vídeos do filme:', erro);
  }
}

//imagens de fundo mídia
async function carregarImagensDeFundo(movieId) {
  try {
    const resposta = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=b3df8cfcacb9816918eef0c0080a06f5`);
    const dados = await resposta.json();
    const imagens = dados.backdrops.slice(0, 6);

    const container = document.getElementById('imagens-fundo');
    if (!container) {
      console.warn('Elemento com ID "imagens-fundo" não encontrado.');
      return;
    }

    container.innerHTML = '';

    let imagensPorSlide = 2;
    const largura = window.innerWidth;
    if (largura <= 576) imagensPorSlide = 1;
    else if (largura <= 744) imagensPorSlide = 2;

    for (let i = 0; i < imagens.length; i += imagensPorSlide) {
      const grupo = imagens.slice(i, i + imagensPorSlide);

      const item = document.createElement('div');
      item.classList.add('carousel-item');
      if (i === 0) item.classList.add('active');

      const grupoDiv = document.createElement('div');
      grupoDiv.classList.add('d-flex', 'justify-content-center', 'gap-4');

      grupo.forEach(imagem => {
        const imgCard = document.createElement('div');
        imgCard.style.flex = '0 0 auto';
        imgCard.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w780${imagem.file_path}" alt="Imagem de fundo" style="width:500px; border-radius:12px;">
        `;
        grupoDiv.appendChild(imgCard);
      });

      item.appendChild(grupoDiv);
      container.appendChild(item);
    }
  } catch (erro) {
    console.error('Erro ao carregar imagens de fundo:', erro);
  }
}

//recomendações filmes
async function carregarRecomendacoes(movieId) {
  try {
    const resposta = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=b3df8cfcacb9816918eef0c0080a06f5&language=pt-BR`);
    const dados = await resposta.json();
    const recomendados = dados.results.slice(0, 8);

    const container = document.getElementById('midia-poster');
    if (!container) {
      console.warn('Elemento com ID "midia-poster" não encontrado.');
      return;
    }

    container.innerHTML = '';

    let cardsPorSlide = 4;
    const largura = window.innerWidth;
    if (largura <= 375) cardsPorSlide = 1;
    else if (largura <= 745) cardsPorSlide = 2;

    for (let i = 0; i < recomendados.length; i += cardsPorSlide) {
      const grupo = recomendados.slice(i, i + cardsPorSlide);

      const item = document.createElement('div');
      item.classList.add('carousel-item');
      if (i === 0) item.classList.add('active');

      const grupoDiv = document.createElement('div');
      grupoDiv.classList.add('d-flex', 'justify-content-center', 'gap-4');

      grupo.forEach(filme => {
        const card = document.createElement('div');
        card.style.flex = '0 0 auto';
        card.style.width = '240px';
        card.classList.add('text-center');

        const imagem = filme.poster_path
          ? `https://image.tmdb.org/t/p/w185${filme.poster_path}`
          : 'https://via.placeholder.com/185x278?text=Sem+Imagem';


        card.innerHTML = `
          <div style="border-radius:12px;">
            <img src="${imagem}" alt="${filme.title}" style="width:100%; border-radius:12px;">
          </div>
        `;

        grupoDiv.appendChild(card);
      });

      item.appendChild(grupoDiv);
      container.appendChild(item);
    }
  } catch (erro) {
    console.error('Erro ao carregar recomendações:', erro);
  }
}

//resenhas do filme
async function carregarResenhasDoFilme(movieId) {
  try {
    const resposta = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=b3df8cfcacb9816918eef0c0080a06f5&language=pt-BR`);
    const dados = await resposta.json();
    const resenhas = dados.results.slice(0, 2);

    const container = document.getElementById('resenhas-filme');
    if (!container) {
      console.warn('Elemento com ID "resenhas-filme" não encontrado.');
      return;
    }

    container.innerHTML = '';

    resenhas.forEach(resenha => {
      const card = document.createElement('div');

      const nota = resenha.author_details.rating
        ? `${resenha.author_details.rating}/10`
        : '—';

      const data = new Date(resenha.created_at).toLocaleDateString('pt-BR');

      card.innerHTML = `
        <div style="background-color: var(--secondary-color); border-radius:12px; padding:16px;">
          <p class="mb-2">${resenha.content.slice(0, 600)}...</p>
          <p class="mb-2 text-start fs-5">por <a href="#" class="fw-bold"> ${resenha.author_details.name || resenha.author}</a></p>
          <div class="d-flex justify-content-between">
            <span>${data}</span>
            <span style="color: var(--color-default);">Nota: ${nota}</span>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (erro) {
    console.error('Erro ao carregar resenhas do filme:', erro);
  }
}

//chamando
document.addEventListener('DOMContentLoaded', async () => {
  mostrarLoading();
  try{
    await Promise.all([
      pegarFilmesPopulares(),
      carregarElenco(872585),
      carregarDetalhesDoFilme(872585),
      carregarVideosDoFilme(872585),
      carregarImagensDeFundo(872585),
      carregarRecomendacoes(872585),
      carregarResenhasDoFilme(872585)
    ]);
  } catch (erro){
    console.error('Erro ao carregar dados iniciais', erro);
  } finally{
    esconderLoading();
  }
});