// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            if(!header.classList.contains('always-scrolled')) {
                header.classList.remove('scrolled');
            }
        }
    }

    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// Back to Top Click
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// For pages other than home
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    if (window.location.pathname.includes('products.html') || window.location.pathname.includes('contact.html')) {
        header?.classList.add('scrolled');
        header?.classList.add('always-scrolled');
    }

    // Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            navLinks?.classList.toggle('open');
            document.getElementById('header')?.classList.toggle('nav-open');
            document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : 'auto';
        });
    }

    // Close mobile nav on link click
    const mobileLinks = document.querySelectorAll('.nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle?.classList.remove('active');
            navLinks?.classList.remove('open');
            document.getElementById('header')?.classList.remove('nav-open');
            document.body.style.overflow = 'auto';
        });
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const triggers = document.querySelectorAll('.gallery-trigger');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    let currentIndex = 0;

    const galleryImages = Array.from(triggers).map(img => img.src);

    const openLightbox = (index) => {
        currentIndex = index;
        if (lightboxImg) {
            lightboxImg.style.opacity = '0';
            lightboxImg.src = galleryImages[currentIndex];
            lightboxImg.onload = () => {
                lightboxImg.style.opacity = '1';
            };
        }
        lightbox?.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    const updateLightboxImage = (newIndex) => {
        if (!lightboxImg) return;
        currentIndex = newIndex;
        lightboxImg.classList.add('fading');
        setTimeout(() => {
            lightboxImg.src = galleryImages[currentIndex];
            lightboxImg.onload = () => {
                lightboxImg.classList.remove('fading');
            };
        }, 200);
    };

    triggers.forEach((trigger, index) => {
        trigger.addEventListener('click', () => openLightbox(index));
    });

    closeBtn?.addEventListener('click', () => {
        lightbox?.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightboxImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
    });

    nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightboxImage((currentIndex + 1) % galleryImages.length);
    });

    lightbox?.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Smooth reveal animation for sections (Homepage Only)
    const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.includes('index.html');
    
    if (isHomePage) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(section);
        });
    }
    // Swiper Initialization
    if (typeof Swiper !== 'undefined' && document.querySelector('.testimonials-swiper')) {
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.testimonials-swiper .swiper-button-next-custom',
                prevEl: '.testimonials-swiper .swiper-button-prev-custom',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // Responsive Product & Gallery Swiper
    if (typeof Swiper !== 'undefined' && document.querySelectorAll('.responsive-swiper').length > 0) {
        document.querySelectorAll('.responsive-swiper').forEach(swiperEl => {
            new Swiper(swiperEl, {
                loop: true,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                },
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: swiperEl.querySelector('.swiper-button-next-custom'),
                    prevEl: swiperEl.querySelector('.swiper-button-prev-custom'),
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        centeredSlides: false,
                        spaceBetween: 30
                    },
                    1025: {
                        enabled: false, // Turn off swiper interaction and reset layout on desktop
                        spaceBetween: 0
                    }
                }
            });
        });
    }

    // --- Product Filtering & Search Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('productSearch');

    let currentFilter = 'all';
    let currentSearch = '';

    const applyFilters = () => {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            
            const matchesFilter = currentFilter === 'all' || currentFilter === cardCategory;
            const matchesSearch = cardTitle.includes(currentSearch.toLowerCase());

            if (matchesFilter && matchesSearch) {
                if (card.style.display === 'none' || !card.style.display) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease-out';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                }
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
            }
        });
    };

    if (productCards.length > 0) {
        // Handle Category Clicks
        if (filterButtons.length > 0) {
            // Handle URL Parameters (e.g., products.html?filter=bonsai)
            const urlParams = new URLSearchParams(window.location.search);
            const initialFilter = urlParams.get('filter') || 'all';

            if (initialFilter !== 'all') {
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-filter') === initialFilter) {
                        filterButtons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        currentFilter = initialFilter;
                    }
                });
            }

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    currentFilter = button.getAttribute('data-filter');
                    applyFilters();
                });
            });
        }

        // Handle Search Input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                applyFilters();
            });
        }

        // Run initial filter
        applyFilters();
    }
});
