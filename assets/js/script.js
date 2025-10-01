// Animation für Service Cards
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Animate on scroll with staggered delay
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate-fade-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150); // 150ms delay between each card
            }
        });
    }, { threshold: 0.1 });

    // Set initial state for cards
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(card);
    });

    // Mobile Menu
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Kontaktformular Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form-Daten sammeln
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value,
                privacy: document.getElementById('privacy').checked
            };
            
            // Validierung
            if (!formData.name || !formData.email || !formData.service || !formData.message || !formData.privacy) {
                showFormAlert('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
                return;
            }
            
            // Email-Validierung
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormAlert('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            
            // Hier würde normalerweise der AJAX-Call zum Senden des Formulars kommen
            // In dieser Demo zeigen wir nur eine Erfolgsmeldung an
            
            // Form-Felder zurücksetzen
            contactForm.reset();
            
            // Erfolgsmeldung anzeigen
            showFormAlert('Vielen Dank für Ihre Anfrage! Wir werden uns schnellstmöglich mit Ihnen in Verbindung setzen.', 'success');
        });
    }
    
    // Funktion zum Anzeigen von Formularmeldungen
    function showFormAlert(message, type) {
        // Alte Meldungen entfernen
        const oldAlert = document.querySelector('.form-alert');
        if (oldAlert) {
            oldAlert.remove();
        }
        
        // Alert-Container erstellen
        const alertContainer = document.createElement('div');
        alertContainer.className = `form-alert p-4 mb-6 rounded-lg ${type === 'success' ? 'bg-green-700/30 border border-green-700/50 text-green-100' : 'bg-red-700/30 border border-red-700/50 text-red-100'}`;
        
        // Icon je nach Typ
        let icon = '';
        if (type === 'success') {
            icon = `<svg class="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>`;
        } else {
            icon = `<svg class="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>`;
        }
        
        // Meldung hinzufügen
        alertContainer.innerHTML = icon + message;
        
        // Alert vor dem Formular einfügen
        contactForm.insertAdjacentElement('beforebegin', alertContainer);
        
        // Nach 5 Sekunden automatisch ausblenden
        if (type === 'success') {
            setTimeout(() => {
                alertContainer.remove();
            }, 5000);
        }
    }
});
