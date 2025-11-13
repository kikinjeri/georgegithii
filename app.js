// ================================
// DYNAMIC GALLERY LOAD + SMOOTH LIGHTBOX
// ================================
fetch('/api/gallery')
  .then(res => res.json())
  .then(images => {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = images
      .map(img => `<img src="${img}" alt="Gallery image" class="gallery-img" loading="lazy">`)
      .join('');

    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    const imgs = document.querySelectorAll('.gallery-img');
    let currentIndex = 0;

    // Open lightbox
    imgs.forEach((img, index) => {
      img.addEventListener('click', () => {
        currentIndex = index;
        openLightbox();
      });
    });

    function openLightbox() {
      lightbox.classList.add('show');
      updateImage();
    }

    function updateImage() {
      // Hide for fade-out
      lightboxImg.classList.remove('show');

      setTimeout(() => {
        lightboxImg.src = imgs[currentIndex].src;
        lightboxImg.classList.add('show'); // Fade in
      }, 200);
    }

    // Navigation
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % imgs.length;
      updateImage();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
      updateImage();
    });

    // Close lightbox
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('show');
    });

    // Close by clicking backdrop
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) lightbox.classList.remove('show');
    });

    // Keyboard controls
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('show')) return;

      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'Escape') lightbox.classList.remove('show');
    });
  })
  .catch(err => console.error('Error loading gallery:', err));
