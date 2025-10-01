// Optimized JavaScript - Lazy loaded features
(function() {
    'use strict';
    
    // Performance optimized initialization
    const KCC = {
        init() {
            this.setupLazyLoading();
            this.setupServiceCards();
            this.setupMobileMenu();
            this.setupSmoothScroll();
            this.setupContactForm();
            this.initAOS();
        },
        
        // Lazy loading for images
        setupLazyLoading() {
            if (!('IntersectionObserver' in window)) return;

            const safeAOSRefresh = () => {
                if (typeof AOS !== 'undefined') {
                    try { AOS.refresh(); } catch (_) {}
                }
            };

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const onLoad = () => {
                            img.removeEventListener('load', onLoad);
                            // After image loads, layout shifts; refresh AOS for correct positions
                            safeAOSRefresh();
                        };
                        img.addEventListener('load', onLoad, { once: true });
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '200px 0px' });

            document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
        },
        
        // Optimized service card animations
        setupServiceCards() {
            const cards = document.querySelectorAll('.service-card');
            if (!cards.length) return;
            
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '50px' });
            
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                cardObserver.observe(card);
            });
        },
        
        // Mobile menu toggle
        setupMobileMenu() {
            const menuButton = document.getElementById('menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (!menuButton || !mobileMenu) return;

            // Helpers
            const svgPath = menuButton.querySelector('svg path');
            const setIcon = (open) => {
                if (!svgPath) return;
                // Hamburger vs X icon
                svgPath.setAttribute('d', open
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16');
            };

            const openMenu = () => {
                menuButton.setAttribute('aria-expanded', 'true');
                menuButton.setAttribute('aria-label', 'Mobile Menü schließen');
                mobileMenu.classList.remove('hidden');
                document.documentElement.classList.add('overflow-hidden');
                setIcon(true);
            };

            const closeMenu = () => {
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.setAttribute('aria-label', 'Mobile Menü öffnen');
                mobileMenu.classList.add('hidden');
                document.documentElement.classList.remove('overflow-hidden');
                setIcon(false);
            };

            const toggleMenu = () => {
                const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
                isExpanded ? closeMenu() : openMenu();
            };

            // Button click
            menuButton.addEventListener('click', toggleMenu);

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                const target = e.target;
                if (!target) return;
                const clickedInsideMenu = mobileMenu.contains(target);
                const clickedButton = menuButton.contains(target);
                const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
                if (isExpanded && !clickedInsideMenu && !clickedButton) {
                    closeMenu();
                }
            });

            // Close with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeMenu();
            });

            // Close after navigating via mobile links
            mobileMenu.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (link) {
                    // Let smooth scroll handle scrolling; just close the menu
                    closeMenu();
                }
            });

            // Ensure menu closes on viewport >= md (Tailwind md ~ 768px)
            const mdQuery = window.matchMedia('(min-width: 768px)');
            const handleBreakpoint = () => {
                if (mdQuery.matches) closeMenu();
            };
            mdQuery.addEventListener ? mdQuery.addEventListener('change', handleBreakpoint) : mdQuery.addListener(handleBreakpoint);
            handleBreakpoint();
        },
        
        // Throttled smooth scroll
        setupSmoothScroll() {
            let ticking = false;
            
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (!link) return;
                
                e.preventDefault();
                
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const target = document.querySelector(link.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: false });
        },
        
        // Contact form with validation
        setupContactForm() {
            const form = document.getElementById('contact-form');
            if (!form) return;
            
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        },
        
        handleFormSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const required = ['name', 'email', 'service', 'message'];
            const missing = required.filter(field => !data[field]?.trim());
            
            if (missing.length) {
                this.showAlert('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
                return;
            }
            
            // Email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                this.showAlert('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            
            // Privacy checkbox
            if (!data.privacy) {
                this.showAlert('Bitte akzeptieren Sie die Datenschutzerklärung.', 'error');
                return;
            }
            
            // Success (in production, send to server)
            e.target.reset();
            this.showAlert('Vielen Dank für Ihre Anfrage! Wir melden uns schnellstmöglich bei Ihnen.', 'success');
        },
        
        showAlert(message, type) {
            const existing = document.querySelector('.form-alert');
            if (existing) existing.remove();
            
            const alert = document.createElement('div');
            alert.className = `form-alert p-4 mb-6 rounded-lg ${type === 'success' ? 'bg-green-100 border border-green-300 text-green-800' : 'bg-red-100 border border-red-300 text-red-800'}`;
            alert.textContent = message;
            
            const form = document.getElementById('contact-form');
            form.insertAdjacentElement('beforebegin', alert);
            
            if (type === 'success') {
                setTimeout(() => alert.remove(), 5000);
            }
        },
        
        // Initialize AOS library if loaded
        initAOS() {
            if (typeof AOS === 'undefined') return;

            // Prevent double-initialization (also used by inline init)
            if (window.__AOS_INITIALIZED__) {
                try { AOS.refresh(); } catch (e) { /* noop */ }
                return;
            }
            window.__AOS_INITIALIZED__ = true;

            // Do NOT disable on mobile; only respect reduced-motion preference
            const disableAOS = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                disable: disableAOS
            });

            // Ensure AOS recalculates on key mobile events
            const safeRefresh = () => { try { AOS.refresh(); } catch (_) {} };
            window.addEventListener('load', safeRefresh, { once: true });
            window.addEventListener('orientationchange', () => setTimeout(safeRefresh, 150));
            window.addEventListener('resize', () => setTimeout(safeRefresh, 150));
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => KCC.init());
    } else {
        KCC.init();
    }
    
    // Expose for debugging
    window.KCC = KCC;
})();
