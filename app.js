const galleryGrid = document.getElementById('galleryGrid');

fetch('galleryImages.json')
  .then(res => res.json())
  .then(galleryImages => {

    galleryImages.forEach((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Tribute image ${index + 1}`;
      img.dataset.index = index;
      galleryGrid.appendChild(img);
    });

    // LIGHTBOX
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.lightbox .close');
    const prevBtn = document.querySelector('.lightbox .prev');
    const nextBtn = document.querySelector('.lightbox .next');
    let currentIndex = 0;

    galleryGrid.addEventListener('click', e => {
      if (e.target.tagName === 'IMG') {
        currentIndex = parseInt(e.target.dataset.index);
        lightboxImg.src = galleryImages[currentIndex];
        lightbox.classList.add('show');
        setTimeout(() => lightboxImg.classList.add('show'), 10);
      }
    });

    closeBtn.addEventListener('click', () => {
      lightboxImg.classList.remove('show');
      lightbox.classList.remove('show');
    });

    function changeImage(newIndex) {
      lightboxImg.classList.remove('show');
      setTimeout(() => {
        currentIndex = newIndex;
        lightboxImg.src = galleryImages[currentIndex];
        lightboxImg.classList.add('show');
      }, 300);
    }

    prevBtn.addEventListener('click', () => changeImage((currentIndex - 1 + galleryImages.length) % galleryImages.length));
    nextBtn.addEventListener('click', () => changeImage((currentIndex + 1) % galleryImages.length));

  })
  .catch(err => console.error("Failed to load gallery images:", err));
