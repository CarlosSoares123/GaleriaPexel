const ApiKey = "9UyiUQALcUptYyIIuLylUNt8h548eB13zPIgLQEUNyZFKk7PtTM79kDN";
const perPage = 15;
let currentPage = 1;
let currentQuery = "";
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".bi-x");
const downloadImgBtn = document.querySelector(".bi-box-arrow-in-down");

const downloadImg = (imgURL) => {
  fetch(imgURL).then(res => res.blob()).then(file => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(file)
    a.download = new Date().getTime()
    a.click()
  }).catch(() => alert('Falha ao baixar a imagem'))
}

const showLightbox = (name, img) => {
  lightBox.querySelector("img").src = img
  lightBox.querySelector("span").innerText = name
  downloadImgBtn.setAttribute("data-img", img)
  lightBox.classList.add("show")
  document.body.style.overflow = "hidden"
}

const hideLightbox = () =>{
  lightBox.classList.remove("show")
  document.body.style.overflow = "auto"
}


const generateHTML = (images) => {
  imagesWrapper.innerHTML = images.map(img =>
    `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
      <img src="${img.src.large2x}" alt="img" />
      <div class="details">
        <div class="photographer">
          <i class="bi-camera"></i>
          <span>${img.photographer}</span>
        </div>
        <button onclick="downloadImg('${img.src.large2x}')">
        <i class="bi-box-arrow-in-down"></i>
        </button>
      </div>
    </li>`
  ).join('');
}

const getImages = (query) => {
  currentPage = 1;
  currentQuery = query;
  const apiUrl = `https://api.pexels.com/v1/search?query=${query}&page=${currentPage}&per_page=${perPage}`;
  loadMoreBtn.innerHTML = "Loading..."
  loadMoreBtn.classList.add("disabled")
  fetch(apiUrl, {
    headers: { Authorization: ApiKey }
  }).then(res => res.json()).then(data => {
    console.log(data);
    generateHTML(data.photos);
    loadMoreBtn.innerHTML = "Load More"
    loadMoreBtn.classList.remove("disabled")
  })
}

const loadMoreImages = () => {
  currentPage++
  let apiUrl = `https://api.pexels.com/v1/search?query=${currentQuery}&page=${currentPage}&per_page=${perPage}`;
  fetch(apiUrl, {
    headers: { Authorization: ApiKey }
  }).then(res => res.json()).then(data => {
    console.log(data);
    generateHTML(data.photos);
  })
}

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim();
  if (query.length > 0) {
    getImages(query);
  }
});

loadMoreBtn.addEventListener("click", loadMoreImages);
closeBtn.addEventListener('click', hideLightbox)
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img))