// ------------------ GALLERY ------------------
const galleryGrid = document.getElementById('galleryGrid');

fetch('/api/gallery')
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

    prevBtn.addEventListener('click', () =>
      changeImage((currentIndex - 1 + galleryImages.length) % galleryImages.length)
    );
    nextBtn.addEventListener('click', () =>
      changeImage((currentIndex + 1) % galleryImages.length)
    );
  })
  .catch(err => console.error('Failed to load gallery images:', err));

// ------------------ TRIBUTES ------------------
const tributeForm = document.getElementById('tributeForm');
const tributeList = document.getElementById('tributeList');

let isAdmin = false;

function addTributeToList(trib, prepend = false) {
  const div = document.createElement('div');
  div.classList.add('tribute-item');

  let deleteBtnHTML = '';
  if (isAdmin) {
    deleteBtnHTML = `<button class="delete-btn" data-timestamp="${trib.date}">Delete</button>`;
  }

  div.innerHTML = `
    <h4>Tribute from: ${trib.name} <span class="date">${new Date(
    trib.date
  ).toLocaleDateString()}</span>${deleteBtnHTML}</h4>
    <p>${trib.message}</p>
  `;

  if (prepend) {
    tributeList.prepend(div);
  } else {
    tributeList.appendChild(div);
  }

  if (isAdmin) {
    div.querySelector('.delete-btn').addEventListener('click', e => {
      const ts = e.target.dataset.timestamp;
      if (confirm('Are you sure you want to delete this tribute?')) {
        fetch(`/api/tributes/${ts}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              div.remove();
            } else {
              alert('Failed to delete tribute.');
            }
          });
      }
    });
  }
}

function loadTributes() {
  fetch('/api/tributes')
    .then(res => res.json())
    .then(data => {
      tributeList.innerHTML = '';
      data.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
      data.forEach(trib => addTributeToList(trib));
    });
}

// Submit new tribute
tributeForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  fetch('/api/tributes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        tributeForm.reset();
        const newTribute = { name, message, date: new Date().toISOString() };
        addTributeToList(newTribute, true);
      } else {
        alert('Failed to submit tribute.');
      }
    });
});

// ------------------ ADMIN LOGIN ------------------
const adminBtn = document.getElementById('adminLoginBtn');
adminBtn.addEventListener('click', () => {
  const password = prompt('Enter admin password:');
  if (password === '2002') {
    isAdmin = true;
    alert('Admin mode enabled. You can now delete tributes.');
    loadTributes();
  } else {
    alert('Wrong password!');
  }
});

// Initial load
loadTributes();
