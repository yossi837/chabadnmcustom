// mikvah.js (Complete and Corrected)

// --- Global Variable (for Smooth Scrollbar) ---
let bodyScrollbar;  // Declare outside any function so it's accessible everywhere.

// --- Function Definitions ---

function initSmoothScrollbar() {
    bodyScrollbar = Scrollbar.init(document.body, {
        damping: 0.1,
        delegateTo: document,
        alwaysShowTracks: false
    });

    // Setup ScrollTrigger to work with Smooth Scrollbar.  This *must* be done *after*
    // Smooth Scrollbar is initialized.
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            if (arguments.length) {
                bodyScrollbar.scrollTop = value; // Set scroll position
            }
            return bodyScrollbar.scrollTop;    // Get scroll position
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.body.style.transform ? "transform" : "fixed"
    });

    // Keep ScrollTrigger and Smooth Scrollbar in sync.
    bodyScrollbar.addListener(ScrollTrigger.update);

    //smooth scrollbar listener. this is what makes the scroll indicator work with smooth scroll
    bodyScrollbar.addListener(({ offset }) => {
      const progress = document.querySelector('.progress-bar');
      if (progress) {
        const scrollProgress = (offset.y / bodyScrollbar.limit.y) * 100;
        gsap.set(progress, { width: scrollProgress + '%' });
      }
    });
}


function initNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Scroll behavior for navigation (add scrolled class)
    ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        toggleClass: {className: 'scrolled', targets: '.nav'}
    });

    // Mobile menu toggle
    if (mobileMenuBtn) { // Check if element exists
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Navigation links click handler (smooth scrolling)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Close mobile menu if open
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }


            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Use Smooth Scrollbar's scrollTo method.
                if (bodyScrollbar) {
                    const offset = targetSection.offsetTop;
                    bodyScrollbar.scrollTo(0, offset, 1000); // 1000ms duration
                } else {
                    // Fallback (shouldn't be needed with Smooth Scrollbar, but good to have)
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return; // Exit if element doesn't exist

    // Update progress bar based on scroll position
    ScrollTrigger.create({
        onUpdate: (self) => {
            const progress = self.progress.toFixed(3) * 100;
            gsap.to(progressBar, {
                width: `${progress}%`,
                duration: 0.1,
                ease: 'none'
            });
        }
    });
}



function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return; // Exit if element doesn't exist.

    // Show scroll indicator after a delay (optional, adjust as needed)
    gsap.to(scrollIndicator, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 2.5 // No delay since preloader is removed
    });

    // Hide/show scroll indicator on scroll
    ScrollTrigger.create({
        start: 'top -100',
        onEnter: () => {
            gsap.to(scrollIndicator, {
                opacity: 0,
                y: 20,
                duration: 0.3
            });
        },
        onLeaveBack: () => {
            gsap.to(scrollIndicator, {
                opacity: 1,
                y: 0,
                duration: 0.3
            });
        }
    });
}

function initAudioControl() {
    const audioControl = document.getElementById('audioControl');
    if (!audioControl) return;

    let isPlaying = false; // Keep track of audio state

    const sound = new Howl({
        src: ['https://cdn.uppbeat.io/audio-files/447d178a4aa6eb62d0b26988ccd5ed7d/5b49f6f1b6a92a57cc4a0d7413e093ee/04307c8e21095b01f71ebf0ff4a8cd33/STREAMING-in-stillness-tranquilium-main-version-28147-03-41.mp3'],
        loop: true,
        volume: 0.4,  // Start at a reasonable volume
        autoplay: false // Don't autoplay
    });

    audioControl.addEventListener('click', () => {
        if (isPlaying) {
            sound.pause();
            audioControl.innerHTML = `
                <svg class="audio-icon" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
            `;
        } else {
            sound.play();
            audioControl.innerHTML = `
                <svg class="audio-icon" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
            `;
        }
        isPlaying = !isPlaying; // Toggle the state
    });
}


function initHeroAnimations() {
    // Hero background image animation
    gsap.to('.hero-bg img', {
        opacity: 0.7,
        scale: 1,
        duration: 2,
        ease: 'power2.out'
    });

    // Hero content animations
    const heroTimeline = gsap.timeline({
        defaults: { duration: 1, ease: 'power3.out' }
    });

    heroTimeline
        .to('.hero-subtitle', { opacity: 1, y: 0, delay: 0.5 })
        .to('.hero-title', { opacity: 1, y: 0 }, '-=0.7')
        .to('.hero-description', { opacity: 1, y: 0 }, '-=0.7')
        .to('.hero-button', { opacity: 1, y: 0 }, '-=0.7')
        .to('.hero-scroll', { opacity: 1 }, '-=0.5');
}


function initScrollReveal() {
    // Get all elements with reveal-element class
    const revealElements = document.querySelectorAll('.reveal-element');

    // Create animations for each element
    revealElements.forEach(element => {
        gsap.fromTo(element,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

function initExperienceScroll() {
    const experienceTrack = document.querySelector('.experience-track');
    const experienceItems = document.querySelectorAll('.experience-item');
    const progressBar = document.querySelector('.scroll-progress-bar');

    if (!experienceTrack || experienceItems.length === 0) return;

    // Calculate the total width of all items
    let totalWidth = 0;
    experienceItems.forEach(item => {
        totalWidth += item.offsetWidth + parseInt(window.getComputedStyle(item).marginRight);
    });

    // Set the track width
    experienceTrack.style.width = `${totalWidth}px`;

    // Create horizontal scroll animation
    gsap.to(experienceTrack, {
        x: -(totalWidth - window.innerWidth + 100),
        ease: 'none',
        scrollTrigger: {
            trigger: '.experience',
            start: 'top top',
            end: `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                // Update progress bar
                gsap.to(progressBar, {
                    width: `${self.progress * 100}%`,
                    duration: 0.1
                });
            }
        }
    });

    // Add hover effect for experience items
    experienceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('.experience-content'), {
                opacity: 1,
                y: 0,
                duration: 0.5
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('.experience-content'), {
                opacity: 0,
                y: 20,
                duration: 0.5
            });
        });
    });
}



function initGalleryScroll() {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryWrapper || galleryItems.length === 0) return;

    // Calculate the total width of all items
    let totalWidth = 0;
    galleryItems.forEach(item => {
        totalWidth += item.offsetWidth + parseInt(window.getComputedStyle(item).marginRight);
    });

    // Set the wrapper width
    galleryWrapper.style.width = `${totalWidth}px`;

    // Create horizontal scroll animation
    gsap.to(galleryWrapper, {
        x: -(totalWidth - window.innerWidth + 100),
        ease: 'none',
        scrollTrigger: {
            trigger: '.gallery',
            start: 'top top',
            end: `+=${totalWidth}`,
            pin: true,
            scrub: 1
        }
    });

    // Add hover effect for gallery items
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('.gallery-content'), {
                opacity: 1,
                y: 0,
                duration: 0.5
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('.gallery-content'), {
                opacity: 0,
                y: 20,
                duration: 0.5
            });
        });
    });
}

function initParallax() {
    const parallaxBg = document.querySelector('.parallax-bg img');

    if (!parallaxBg) return;

    gsap.to(parallaxBg, {
        y: '-20%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.parallax',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}


function initTestimonialsSlider() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');

    if (testimonialItems.length === 0) return;

    let currentIndex = 0;

    // Function to update active slide
    function updateSlide(index) {
        // Remove active class from all items
        testimonialItems.forEach(item => item.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current item
        testimonialItems[index].classList.add('active');
        dots[index].classList.add('active');

        // Update slider position
        gsap.to('.testimonial-items', {
            transform: `translateX(-${index * 100}%)`,
            duration: 0.6,
            ease: 'power3.out'
        });

        currentIndex = index;
    }

    // Previous button click
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            let index = currentIndex - 1;
            if (index < 0) index = testimonialItems.length - 1;
            updateSlide(index);
        });
    }

    // Next button click
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            let index = currentIndex + 1;
            if (index >= testimonialItems.length) index = 0;
            updateSlide(index);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlide(index);
        });
    });

    // Auto rotate slides (optional - you can remove this if you don't want auto-rotation)
    const autoRotate = setInterval(() => {
        let index = currentIndex + 1;
        if (index >= testimonialItems.length) index = 0;
        updateSlide(index);
    }, 5000);

    // Stop auto rotate on hover (optional)
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
    }
  //Initial slide set
updateSlide(0);
}


function initDonationSystem() {
    const donateAmounts = document.querySelectorAll('.donate-amount');
    const customInput = document.getElementById('customAmount');
    let selectedAmount = 0;

    if (donateAmounts.length === 0 || !customInput) return;

    // Add click event to donation amounts
    donateAmounts.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            donateAmounts.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Update selected amount
            selectedAmount = parseFloat(button.getAttribute('data-amount'));

            // Clear custom input
            customInput.value = '';
        });
    });

    // Custom amount input
    customInput.addEventListener('input', () => {
        // Remove active class from all buttons
        donateAmounts.forEach(btn => btn.classList.remove('active'));

        // Update selected amount
        selectedAmount = parseFloat(customInput.value) || 0;
    });

    // Initialize PayPal buttons
    if (window.paypal) {
        paypal.Buttons({
            createOrder: function(data, actions) {
                let amount = selectedAmount;
                if (amount <= 0) {
                    alert("Please select or enter a valid donation amount.");
                    return; // Stop here if amount is invalid
                }
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Thank you for your donation, ' + details.payer.name.given_name + '!');
                    // Reset form
                    donateAmounts.forEach(btn => btn.classList.remove('active'));
                    customInput.value = '';
                    selectedAmount = 0;
                });
            },
            onError: function(err) {
                console.error(err);
                alert('An error occurred during the transaction. Please try again.');
            }
        }).render('#paypal-button-container');
    }
}
