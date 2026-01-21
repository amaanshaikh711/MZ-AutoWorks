// MZ Autoworks - Interactive JavaScript
// Mobile Menu, Scroll Animations, and User Interactions

document.addEventListener('DOMContentLoaded', function () {

    // ===== Mobile Menu Toggle =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== Scroll Animations with Stagger Effect =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay for multiple elements (faster: 50ms instead of 100ms)
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 50);

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((element, index) => {
        element.style.transitionDelay = `${index * 0.02}s`;
        observer.observe(element);
    });

    // ===== Car Transition Scroll Animation (Scroll-Progress Based) =====
    const animatedCar = document.getElementById('animatedCar');
    const carTransitionSection = document.getElementById('car-transition');

    if (animatedCar && carTransitionSection) {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            let ticking = false;
            let animationComplete = false;
            let hasReturned = false;

            function updateCarPosition() {
                if (hasReturned) return;

                const sectionRect = carTransitionSection.getBoundingClientRect();
                const sectionTop = sectionRect.top;
                const sectionHeight = sectionRect.height;
                const windowHeight = window.innerHeight;

                // Calculate how far the section has scrolled into view
                const scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);

                // Car starts moving only after 50% of the section is scrolled
                const scrollThreshold = 0.5;
                // Extended animation range for slower movement (was 1 - 0.5 = 0.5, now 1.5 - 0.5 = 1.0)
                const animationEndThreshold = 1.5;

                if (scrollProgress > scrollThreshold && scrollProgress <= animationEndThreshold && !animationComplete) {
                    // Calculate animation progress with extended range for slower movement
                    const animationProgress = (scrollProgress - scrollThreshold) / (animationEndThreshold - scrollThreshold);

                    // Clamp between 0 and 1
                    const clampedProgress = Math.min(Math.max(animationProgress, 0), 1);

                    // Ease out quartic for very smooth, slow deceleration
                    const easedProgress = 1 - Math.pow(1 - clampedProgress, 4);

                    // Calculate the translateX value - car travels across the full screen
                    const maxTranslate = window.innerWidth + 600;
                    const translateX = -easedProgress * maxTranslate;

                    animatedCar.style.transform = `translateX(${translateX}px)`;

                    // Mark animation complete when car is fully off screen
                    if (clampedProgress >= 1) {
                        animationComplete = true;

                        // After a short delay, smoothly return car to original position
                        setTimeout(() => {
                            animatedCar.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease';
                            animatedCar.style.opacity = '0';

                            setTimeout(() => {
                                animatedCar.style.transform = 'translateX(0)';

                                setTimeout(() => {
                                    animatedCar.style.opacity = '1';
                                    hasReturned = true;
                                    // Remove transition after return for performance
                                    setTimeout(() => {
                                        animatedCar.style.transition = 'none';
                                    }, 1200);
                                }, 400);
                            }, 800);
                        }, 300);
                    }
                } else if (scrollProgress <= scrollThreshold && !animationComplete) {
                    // Keep car at initial position before threshold
                    animatedCar.style.transform = 'translateX(0)';
                }

                ticking = false;
            }

            window.addEventListener('scroll', function () {
                if (!ticking && !hasReturned) {
                    requestAnimationFrame(updateCarPosition);
                    ticking = true;
                }
            }, { passive: true });

            // Initial call
            updateCarPosition();
        }
    }

    // ===== Navbar Scroll Effect =====
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
        } else {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        }

        lastScroll = currentScroll;
    });

    // ===== Counter Animation for Stats =====
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
            }
        };

        updateCounter();
    };

    // Observe stat numbers for animation
    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        if (stat.hasAttribute('data-target')) {
            statsObserver.observe(stat);
        }
    });

    // ===== Image Lazy Loading Enhancement =====
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===== Form Validation (if forms are added later) =====
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#DC2626';
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // ===== Active Navigation Highlighting =====
    const sections = document.querySelectorAll('section[id]');

    const highlightNavOnScroll = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavOnScroll);

    // ===== Back to Top Button (Optional Enhancement) =====
    const createBackToTop = () => {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #DC2626;
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 998;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        `;

        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.background = '#B91C1C';
            backToTop.style.transform = 'translateY(-3px)';
        });

        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.background = '#DC2626';
            backToTop.style.transform = 'translateY(0)';
        });
    };

    createBackToTop();

    // ===== Service Card Tilt Effect (Subtle) =====
    const serviceCards = document.querySelectorAll('.service-card, .feature-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.3s ease';
        });
    });

    // ===== Smooth Hero Transition =====
    const hero = document.querySelector('.hero');

    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;

            // Fade out hero content slightly as you scroll
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 0.5;
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.opacity = opacity;
                }
            }
        });
    }

    // ===== Loading Animation =====
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');

        // Trigger initial animations
        const firstScreenElements = document.querySelectorAll('.hero .animate-on-scroll');
        firstScreenElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated');
            }, index * 100);
        });
    });

    // ===== WhatsApp Button Click Tracking =====
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');

    whatsappButtons.forEach(button => {
        button.addEventListener('click', function () {
            // You can add analytics tracking here
            console.log('WhatsApp button clicked');
        });
    });

    // ===== Phone Number Click Tracking =====
    const phoneButtons = document.querySelectorAll('a[href^="tel:"]');

    phoneButtons.forEach(button => {
        button.addEventListener('click', function () {
            // You can add analytics tracking here
            console.log('Phone number clicked');
        });
    });

    // ===== Enhanced Image Loading with Fade In =====
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.4s ease';

            img.addEventListener('load', function () {
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 50);
            });

            img.addEventListener('error', function () {
                console.warn('Image failed to load:', this.src);
                // Set a light grey background for failed images
                this.style.backgroundColor = '#f0f0f0';
                this.style.opacity = '1';
            });
        }
    });

    // Force reload images with loading="lazy" attribute
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (!img.complete) {
            img.loading = 'eager';
        }
    });

    // ===== Prevent Right Click on Images (Optional Security) =====
    // Uncomment if you want to prevent image downloads
    /*
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    });
    */

    // ===== Print Optimization =====
    window.addEventListener('beforeprint', function () {
        // Expand all collapsed content before printing
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function () {
        document.body.classList.remove('printing');
    });

    // ===== Performance Monitoring =====
    if ('performance' in window) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page load time:', pageLoadTime + 'ms');
            }, 0);
        });
    }

    // ===== Accessibility Enhancements =====
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #DC2626;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', function () {
        this.style.top = '0';
    });

    skipLink.addEventListener('blur', function () {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // ===== Console Welcome Message =====
    console.log('%c🚗 MZ Autoworks', 'color: #DC2626; font-size: 24px; font-weight: bold;');
    console.log('%cProfessional Car Denting & Painting Services', 'color: #B0B0B0; font-size: 14px;');
    console.log('%cCall: 7718071864', 'color: #25D366; font-size: 14px; font-weight: bold;');

});

// ===== Service Worker Registration (PWA Support - Optional) =====
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
*/

// ===== Utility Functions =====

// Debounce function for performance optimization
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    document.head.appendChild(script);
}
