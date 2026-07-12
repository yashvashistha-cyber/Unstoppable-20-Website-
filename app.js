/**
 * Unstoppable 2.0 NGO Website JavaScript Controller
 * Core interactivity: Header scrolls, responsive navbar drawer, scroll animation observers,
 * statistics increment counters, testimonial carousel, modal interactions, donation tiers, and form submissions.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Header Scroll Behavior
       ========================================================================== */
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Mobile Navigation Drawer
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMobileMenu = () => {
        navbar.classList.toggle('open');
        mobileToggle.classList.toggle('mobile-toggle-active');
    };

    const closeMobileMenu = () => {
        navbar.classList.remove('open');
        mobileToggle.classList.remove('mobile-toggle-active');
    };

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside of navbar/header
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && navbar.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    /* ==========================================================================
       Active Link Tracking on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const trackActiveNavLink = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset header height
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', trackActiveNavLink);

    /* ==========================================================================
       Scroll Reveal Animation (IntersectionObserver)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       Dynamic Statistics Counter Animation
       ========================================================================== */
    const statsContainer = document.getElementById('stats-counter-container');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // ms
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    stat.innerText = target + "+";
                    clearInterval(timer);
                } else {
                    stat.innerText = current;
                }
            }, stepTime);
        });
    };

    const statsObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(statsObserverCallback, {
        root: null,
        threshold: 0.3
    });

    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    /* ==========================================================================
       Testimonials Carousel Slider
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('slider-dots');
    if (dotsContainer && slides.length > 0) {
        dotsContainer.innerHTML = Array.from({ length: slides.length }, (_, i) => 
            `<span class="dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`
        ).join('');
    }
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let index = currentSlide + 1;
        if (index >= slides.length) index = 0;
        showSlide(index);
    };

    const prevSlide = () => {
        let index = currentSlide - 1;
        if (index < 0) index = slides.length - 1;
        showSlide(index);
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideTimer();
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetSlideTimer();
        });
    });

    const startSlideTimer = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const resetSlideTimer = () => {
        clearInterval(slideInterval);
        startSlideTimer();
    };

    // Initialize testimonial slide loop
    if (slides.length > 0) {
        startSlideTimer();
    }

    /* ==========================================================================
       Modals Management (Volunteer and Donate)
       ========================================================================== */
    const volunteerModal = document.getElementById('volunteer-modal');
    const donateModal = document.getElementById('donate-modal');
    
    // Trigger buttons
    const triggerVolunteerBtns = [
        document.getElementById('hero-volunteer-btn')
    ];
    
    const triggerDonateBtns = [
        document.getElementById('hero-donate-btn')
    ];

    // Close buttons
    const closeVolunteerBtn = document.getElementById('close-volunteer-modal');
    const closeDonateBtn = document.getElementById('close-donate-modal');

    // Helper functions
    const openModal = (modal) => {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Disable body background scrolling
    };

    const closeModal = (modal) => {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Re-enable scroll
        
        // Reset forms in modal on close (except success messages, we let JS handle those)
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            const successMsg = form.querySelector('.form-status');
            if (successMsg) successMsg.classList.add('hide');
        }
    };

    // Hook up triggers
    triggerVolunteerBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', () => openModal(volunteerModal));
    });

    triggerDonateBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', () => openModal(donateModal));
    });

    // Close triggers
    if (closeVolunteerBtn) closeVolunteerBtn.addEventListener('click', () => closeModal(volunteerModal));
    if (closeDonateBtn) closeDonateBtn.addEventListener('click', () => closeModal(donateModal));

    // Close modals on clicking backdrop overlay
    window.addEventListener('click', (e) => {
        if (e.target === volunteerModal) closeModal(volunteerModal);
        if (e.target === donateModal) closeModal(donateModal);
    });

    // Close modals on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (volunteerModal.classList.contains('open')) closeModal(volunteerModal);
            if (donateModal.classList.contains('open')) closeModal(donateModal);
        }
    });

    /* ==========================================================================
       Donate Form Calculations & Tiers
       ========================================================================== */
    const tierCards = document.querySelectorAll('.tier-card');
    const amountInput = document.getElementById('donation-amount');

    tierCards.forEach(card => {
        card.addEventListener('click', () => {
            tierCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const amount = card.getAttribute('data-amount');
            amountInput.value = amount;
        });
    });

    // Clear tier active classes if custom amount is typed and doesn't match
    amountInput.addEventListener('input', () => {
        const val = amountInput.value;
        tierCards.forEach(c => c.classList.remove('active'));
        
        // Re-highlight if matching
        const matchingCard = document.querySelector(`.tier-card[data-amount="${val}"]`);
        if (matchingCard) {
            matchingCard.classList.add('active');
        }
    });

    /* ==========================================================================
       Interactive Form Submissions (Mockups)
       ========================================================================== */
    
    // Contact & Volunteer forms handled below DOMContentLoaded

    // Donation Form Submission
    const donateForm = document.getElementById('donate-form');
    const donateSuccess = document.getElementById('donate-success');

    if (donateForm) {
        donateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = donateForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Mock payment gateway loading state
            submitBtn.innerHTML = '<span>Processing Payment...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                if (donateSuccess) {
                    donateSuccess.classList.remove('hide');
                }
                
                setTimeout(() => {
                    closeModal(donateModal);
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.disabled = false;
                }, 2000);
                
            }, 1500);
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (newsletterSuccess) {
                newsletterSuccess.classList.remove('hide');
            }
            
            newsletterForm.reset();
            
            setTimeout(() => {
                if (newsletterSuccess) newsletterSuccess.classList.add('hide');
            }, 4000);
        });
    }

});

// ===================== Awards Gallery Lightbox =====================
window.addEventListener('load', function() {

    var contactForm = document.getElementById('contact-form');
    var contactSuccess = document.getElementById('contact-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var btnText = submitBtn.querySelector('.btn-text') || submitBtn;
            var orig = btnText.textContent;
            btnText.textContent = 'Sending...';
            submitBtn.disabled = true;
            contactSuccess.classList.add('hide');

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: 'bff2ff5a-8d51-4803-abeb-df3ce28d2088',
                    subject: 'New Contact Form Submission',
                    name: document.getElementById('contact-name').value,
                    email: document.getElementById('contact-email').value,
                    message_subject: document.getElementById('contact-subject').value,
                    message: document.getElementById('contact-message').value
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    contactSuccess.style.cssText = '';
                    contactSuccess.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your submission has been received. Our team will contact you soon.';
                    contactSuccess.classList.remove('hide');
                    contactForm.reset();
                    setTimeout(function() { contactSuccess.classList.add('hide'); }, 6000);
                } else {
                    contactSuccess.style.cssText = 'background:#fef2f2;color:#dc2626;';
                    contactSuccess.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Failed to send. Please email u20educationmatters@gmail.com';
                    contactSuccess.classList.remove('hide');
                }
            })
            .catch(function() {
                contactSuccess.style.cssText = 'background:#fef2f2;color:#dc2626;';
                contactSuccess.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Network error. Please email u20educationmatters@gmail.com';
                contactSuccess.classList.remove('hide');
            })
            .finally(function() {
                btnText.textContent = orig;
                submitBtn.disabled = false;
            });
        });
    }

    // ===================== Volunteer Form — Web3Forms =====================
    var volunteerForm = document.getElementById('volunteer-form');
    var volunteerSuccess = document.getElementById('volunteer-success');

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var submitBtn = volunteerForm.querySelector('button[type="submit"]');
            var orig = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            volunteerSuccess.classList.add('hide');

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: 'bff2ff5a-8d51-4803-abeb-df3ce28d2088',
                    subject: 'New Volunteer Registration',
                    name: document.getElementById('vol-name').value,
                    email: document.getElementById('vol-email').value,
                    phone: document.getElementById('vol-phone').value,
                    interest: document.getElementById('vol-interest').value,
                    message: document.getElementById('vol-message').value
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    volunteerSuccess.style.cssText = '';
                    volunteerSuccess.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your submission has been received. Our team will contact you soon.';
                    volunteerSuccess.classList.remove('hide');
                    volunteerForm.reset();
                    var volModal = document.getElementById('volunteer-modal');
                    setTimeout(function() {
                        if (volModal) { volModal.classList.remove('open'); document.body.style.overflow = ''; }
                        volunteerSuccess.classList.add('hide');
                    }, 3000);
                } else {
                    volunteerSuccess.style.cssText = 'background:#fef2f2;color:#dc2626;';
                    volunteerSuccess.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Failed to send. Please email u20educationmatters@gmail.com';
                    volunteerSuccess.classList.remove('hide');
                }
            })
            .catch(function() {
                volunteerSuccess.style.cssText = 'background:#fef2f2;color:#dc2626;';
                volunteerSuccess.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Network error. Please email u20educationmatters@gmail.com';
                volunteerSuccess.classList.remove('hide');
            })
            .finally(function() {
                submitBtn.textContent = orig;
                submitBtn.disabled = false;
            });
        });
    }

});

// ===================== Awards Gallery Lightbox =====================
const galleryImages = [
    'assets/award_1.jpeg','assets/award_2.jpeg','assets/award_3.jpeg',
    'assets/award_4.jpeg','assets/award_5.jpeg','assets/award_6.jpeg',
    'assets/award_7.jpeg','assets/award_8.jpeg','assets/award_9.jpeg',
    'assets/award_10.jpeg'
];
let currentSlide = 0;

function openGallery(index) {
    currentSlide = index;
    const lb = document.getElementById('gallery-lightbox');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateGallerySlide();
}

function closeGallery() {
    document.getElementById('gallery-lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

function updateGallerySlide() {
    const img = document.getElementById('gallery-img');
    const counter = document.getElementById('gallery-counter');
    const thumbs = document.querySelectorAll('.gallery-strip-thumb');

    img.style.opacity = '0';
    setTimeout(() => {
        img.src = galleryImages[currentSlide];
        img.style.opacity = '1';
    }, 150);

    counter.textContent = (currentSlide + 1) + ' / ' + galleryImages.length;

    thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === currentSlide);
    });

    // Scroll active thumb into view
    if (thumbs[currentSlide]) {
        thumbs[currentSlide].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

function goToSlide(index) {
    currentSlide = index;
    updateGallerySlide();
}

document.getElementById('gallery-prev').addEventListener('click', function(e) {
    e.stopPropagation();
    currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
    updateGallerySlide();
});

document.getElementById('gallery-next').addEventListener('click', function(e) {
    e.stopPropagation();
    currentSlide = (currentSlide + 1) % galleryImages.length;
    updateGallerySlide();
});

document.getElementById('gallery-close').addEventListener('click', function(e) {
    e.stopPropagation();
    closeGallery();
});

document.getElementById('gallery-lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeGallery();
});

document.addEventListener('keydown', function(e) {
    const lb = document.getElementById('gallery-lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowRight') { currentSlide = (currentSlide + 1) % galleryImages.length; updateGallerySlide(); }
    if (e.key === 'ArrowLeft')  { currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length; updateGallerySlide(); }
    if (e.key === 'Escape') closeGallery();
});

// ===================== Program Galleries =====================
const programGalleries = {
    roadside: {
        title: 'Roadside Study Circles — Photos',
        images: Array.from({length: 40}, (_, i) => `assets/roadside_${i+1}.jpeg`)
    },
    digital: {
        title: 'Digital Literacy — Photos',
        images: Array.from({length: 10}, (_, i) => `assets/digital_${i+1}.jpeg`)
    },
    outside: {
        title: 'Outside Activities — Photos',
        images: Array.from({length: 7}, (_, i) => `assets/outside_${i+1}.jpeg`)
    },
    national: {
        title: 'National Day Celebration — Photos',
        images: Array.from({length: 5}, (_, i) => `assets/national_${i+1}.jpeg`)
    },
    festival: {
        title: 'Festivals Celebration — Photos',
        images: Array.from({length: 7}, (_, i) => `assets/festival_${i+1}.jpeg`)
    }
};

let pgCurrent = 0;
let pgImages = [];

function openProgramGallery(type) {
    const gallery = programGalleries[type];
    if (!gallery) return;
    pgImages = gallery.images;
    pgCurrent = 0;

    document.getElementById('program-gallery-title').textContent = gallery.title;

    // Build thumb strip
    const strip = document.getElementById('program-gallery-thumbs');
    strip.innerHTML = pgImages.map((src, i) =>
        `<img src="${src}" class="gallery-strip-thumb${i===0?' active':''}" data-index="${i}" onclick="pgGoTo(${i})">`
    ).join('');

    updateProgramSlide();
    document.getElementById('program-lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function updateProgramSlide() {
    const img = document.getElementById('program-gallery-img');
    const counter = document.getElementById('program-gallery-counter');
    const thumbs = document.querySelectorAll('#program-gallery-thumbs .gallery-strip-thumb');

    img.style.opacity = '0';
    setTimeout(() => { img.src = pgImages[pgCurrent]; img.style.opacity = '1'; }, 150);
    counter.textContent = (pgCurrent + 1) + ' / ' + pgImages.length;
    thumbs.forEach((t, i) => t.classList.toggle('active', i === pgCurrent));
    if (thumbs[pgCurrent]) thumbs[pgCurrent].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function pgGoTo(index) { pgCurrent = index; updateProgramSlide(); }

function closeProgramGallery() {
    document.getElementById('program-lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('program-gallery-close').addEventListener('click', function(e) { e.stopPropagation(); closeProgramGallery(); });
document.getElementById('program-gallery-prev').addEventListener('click', function(e) { e.stopPropagation(); pgCurrent = (pgCurrent - 1 + pgImages.length) % pgImages.length; updateProgramSlide(); });
document.getElementById('program-gallery-next').addEventListener('click', function(e) { e.stopPropagation(); pgCurrent = (pgCurrent + 1) % pgImages.length; updateProgramSlide(); });
document.getElementById('program-lightbox').addEventListener('click', function(e) { if (e.target === this) closeProgramGallery(); });

document.addEventListener('keydown', function(e) {
    const lb = document.getElementById('program-lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowRight') { pgCurrent = (pgCurrent + 1) % pgImages.length; updateProgramSlide(); }
    if (e.key === 'ArrowLeft')  { pgCurrent = (pgCurrent - 1 + pgImages.length) % pgImages.length; updateProgramSlide(); }
    if (e.key === 'Escape') closeProgramGallery();
});

// ===================== Event & Visitor Gallery Lightbox =====================
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('open')) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});
