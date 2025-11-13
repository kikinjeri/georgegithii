document.addEventListener('DOMContentLoaded', () => {

    const heroData = [
        { image: 'images/gallery/dad-sister.jpg', quote: '“For God so loved the world he gave his only begotten son...”' },
        { image: 'images/gallery/dadandsis2.jpg', quote: '“God Bless You!”' },
        { image: 'images/gallery/dadchigfam.jpg', quote: '“Power. Authority. Influence. Force.”' },
        { image: 'images/gallery/dadchigfam2.jpg', quote: '“Ipse Dixit.”' },
        { image: 'images/gallery/dadoutside.jpg', quote: '“The Lord is my shephard.”' },
        { image: 'images/gallery/dadsis.jpg', quote: '“Praise the Lord!”' },
        { image: 'images/gallery/dad1.jpg', quote: '“For God so loved the world he gave his only begotten son...”' },
        { image: 'images/gallery/dad2.jpg', quote: '“God Bless You!”' },
        { image: 'images/gallery/dad3.jpg', quote: '“Power. Authority. Influence. Force.”' },
        { image: 'images/gallery/dad4.jpg', quote: '“Ipse Dixit.”' },
        { image: 'images/gallery/dad5.jpg', quote: '“The Lord is my shephard.”' },
        { image: 'images/gallery/dad6.jpg', quote: '“Praise the Lord!”' }
    ];

    /* ================= Hero Slideshow ================= */
    (function initHero() {
        let index = 0;
        const profilePic = document.getElementById('profile-picture');
        const heroText = document.querySelector('.hero-text p');

        function update() {
            const { image, quote } = heroData[index];
            profilePic.style.opacity = 0;
            setTimeout(() => {
                profilePic.src = image;
                heroText.textContent = quote;
                profilePic.style.opacity = 1;
            }, 600);
            index = (index + 1) % heroData.length;
        }

        setInterval(update, 6000);
    })();

    /* ================= Gallery & Lightbox ================= */
    (function initGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.querySelector('.lightbox-img');
        const closeBtn = document.querySelector('.lightbox .close');
        const prevBtn = document.querySelector('.lightbox .prev');
        const nextBtn = document.querySelector('.lightbox .next');

        if (!galleryGrid) return;

        heroData.forEach((item, i) => {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = `Gallery image ${i + 1}`;
            img.dataset.index = i;
            img.loading = 'lazy';
            galleryGrid.appendChild(img);
        });

        let currentIndex = 0;

        function openLightbox(i) {
            currentIndex = i;
            lightboxImg.src = heroData[currentIndex].image;
            lightbox.classList.add('show');
            setTimeout(() => lightboxImg.classList.add('show'), 10);
        }

        function closeLightbox() {
            lightboxImg.classList.remove('show');
            lightbox.classList.remove('show');
        }

        function changeImage(offset) {
            currentIndex = (currentIndex + offset + heroData.length) % heroData.length;
            lightboxImg.classList.remove('show');
            setTimeout(() => {
                lightboxImg.src = heroData[currentIndex].image;
                lightboxImg.classList.add('show');
            }, 250);
        }

        galleryGrid.addEventListener('click', e => {
            if (e.target.tagName === 'IMG') openLightbox(parseInt(e.target.dataset.index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => changeImage(-1));
        nextBtn.addEventListener('click', () => changeImage(1));

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
            if (e.key === 'Escape') closeLightbox();
        });
    })();

    /* ================= Tributes ================= */
    (function initTributes() {
        const tributeForm = document.getElementById('tributeForm');
        const tributeList = document.getElementById('tributeList');
        const adminBtn = document.getElementById('adminLoginBtn');
        let isAdmin = false;

        function addTribute(trib, prepend = false) {
            const div = document.createElement('div');
            div.classList.add('tribute-item');
            let deleteHTML = '';
            if (isAdmin) deleteHTML = `<button class="delete-btn" data-timestamp="${trib.date}">Delete</button>`;
            div.innerHTML = `
                <h4>
                    Tribute from: ${trib.name} 
                    <span class="date">${new Date(trib.date).toLocaleDateString()}</span>
                    ${deleteHTML}
                </h4>
                <p>${trib.message}</p>
            `;
            prepend ? tributeList.prepend(div) : tributeList.appendChild(div);

            if (isAdmin && deleteHTML) {
                div.querySelector('.delete-btn').addEventListener('click', e => {
                    const ts = e.target.dataset.timestamp;
                    if (confirm('Delete this tribute?')) {
                        fetch(`/api/tributes/${ts}`, { method: 'DELETE' })
                            .then(res => res.json())
                            .then(data => data.success ? div.remove() : alert('Failed to delete.'));
                    }
                });
            }
        }

        function loadTributes() {
            fetch('/api/tributes')
                .then(res => res.json())
                .then(data => {
                    tributeList.innerHTML = '';
                    data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    data.forEach(trib => addTribute(trib));
                });
        }

        if (tributeForm) {
            tributeForm.addEventListener('submit', e => {
                e.preventDefault();
                const name = document.getElementById('name').value.trim();
                const message = document.getElementById('message').value.trim();
                if (!name || !message) return;
                fetch('/api/tributes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, message }),
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        tributeForm.reset();
                        addTribute({ name, message, date: new Date().toISOString() }, true);
                    } else alert('Failed to submit tribute.');
                });
            });
        }

        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                const password = prompt('Enter admin password:');
                if (password === '2002') {
                    isAdmin = true;
                    alert('Admin mode enabled.');
                    loadTributes();
                } else alert('Wrong password!');
            });
        }

        loadTributes();
    })();

    /* ================= Music ================= */
    (function initMusic() {
        const music = document.getElementById("bgMusic");
        const musicToggle = document.getElementById("musicToggle");
        const musicPrompt = document.getElementById("musicPrompt");
        if (!music || !musicToggle || !musicPrompt) return;

        music.volume = 0.25;
        musicToggle.textContent = "🔇 Music";

        musicPrompt.addEventListener("click", () => {
            music.play().then(() => {
                musicToggle.textContent = "🔊 Music";
                musicPrompt.style.display = "none";
            }).catch(() => console.log("User interaction required"));
        });

        musicToggle.addEventListener("click", () => {
            if (music.paused) {
                music.play().then(() => musicToggle.textContent = "🔊 Music");
            } else {
                music.pause();
                musicToggle.textContent = "🔇 Music";
            }
        });
    })();

    /* ================= Scroll Reveal ================= */
    (function initScrollReveal() {
        const sections = document.querySelectorAll(".page-section");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.15 });

        sections.forEach(sec => observer.observe(sec));
    })();

    /* ================= Mobile Navbar ================= */
    (function initNavbar() {
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    })();

});

