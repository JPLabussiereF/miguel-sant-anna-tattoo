// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let currentSlide = 0;
let isScrolling = false;
let touchStartX = 0;
let touchEndX = 0;

// ========================================
// CARROSSEL DE IMAGENS
// ========================================
class Carousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // Criar dots
        this.createDots();
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events para mobile
        const carousel = document.querySelector('.gallery-carousel');
        carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Iniciar autoplay
        this.startAutoPlay();
        
        // Pausar no hover
        carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }
    
    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Atualizar dots
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    nextSlide() {
        currentSlide = (currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }
    
    prevSlide() {
        currentSlide = (currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }
    
    goToSlide(index) {
        currentSlide = index;
        this.updateSlides();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            this.nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            this.prevSlide();
        }
    }
}

// ========================================
// MENU MOBILE
// ========================================
class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Fechar menu ao clicar em um link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) this.closeMenu();
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.header')) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }
    
    openMenu() {
        this.isOpen = true;
        this.nav.style.display = 'flex';
        this.nav.style.position = 'absolute';
        this.nav.style.top = '100%';
        this.nav.style.left = '0';
        this.nav.style.right = '0';
        this.nav.style.flexDirection = 'column';
        this.nav.style.background = 'rgba(0, 0, 0, 0.95)';
        this.nav.style.padding = '2rem';
        this.nav.style.gap = '1rem';
        this.nav.style.borderTop = '1px solid rgba(139, 69, 19, 0.3)';
        
        // Animar menu toggle
        const spans = this.menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    }
    
    closeMenu() {
        this.isOpen = false;
        
        // Resetar estilos do menu
        if (window.innerWidth <= 768) {
            this.nav.style.display = 'none';
        }
        
        // Resetar menu toggle
        const spans = this.menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ========================================
// FORMULÁRIO E WHATSAPP
// ========================================
class BookingForm {
    constructor() {
        this.form = document.getElementById('bookingForm');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Máscara para telefone
        const whatsappInput = document.getElementById('whatsapp');
        whatsappInput.addEventListener('input', (e) => this.formatPhone(e));
    }
    
    formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        }
        
        e.target.value = value;
    }
    
    validateForm() {
        const nome = document.getElementById('nome').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
        const estilo = document.getElementById('estilo').value;
        const mensagem = document.getElementById('mensagem').value.trim();
        
        if (!nome || nome.length < 3) {
            this.showError('Por favor, insira seu nome completo.');
            return false;
        }
        
        if (!whatsapp || whatsapp.length < 10) {
            this.showError('Por favor, insira um número de WhatsApp válido.');
            return false;
        }
        
        if (!estilo) {
            this.showError('Por favor, escolha um estilo de tatuagem.');
            return false;
        }
        
        if (!mensagem || mensagem.length < 10) {
            this.showError('Por favor, descreva melhor sua ideia.');
            return false;
        }
        
        return true;
    }
    
    showError(message) {
        // Criar notificação de erro
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-family: 'Open Sans', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;
        
        // Coletar dados do formulário
        const nome = document.getElementById('nome').value;
        const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
        const estilo = document.getElementById('estilo').value;
        const mensagem = document.getElementById('mensagem').value;
        
        // Criar mensagem para WhatsApp
        const whatsappMessage = encodeURIComponent(
            `*NOVO AGENDAMENTO - MIGUEL SANT'ANNA*\n\n` +
            `*Nome:* ${nome}\n` +
            `*Estilo:* ${estilo}\n` +
            `*Mensagem:* ${mensagem}\n\n` +
            `Olá! Gostaria de agendar uma sessão de tatuagem.`
        );
        
        // Número do tatuador (adicione o número aqui)
        const tattooArtistNumber = '5571996924570';
        
        // Criar link do WhatsApp
        const whatsappLink = `https://wa.me/${tattooArtistNumber}?text=${whatsappMessage}`;
        
        // Mostrar mensagem de sucesso
        this.showSuccess();
        
        // Adicionar classe de loading ao botão
        const submitButton = this.form.querySelector('.submit-button');
        submitButton.classList.add('loading');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.open(whatsappLink, '_blank');
            this.form.reset();
            submitButton.classList.remove('loading');
        }, 2000);
    }
    
    showSuccess() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2rem;">✅</span>
                <div>
                    <strong>Formulário enviado com sucesso!</strong>
                    <p style="margin: 0; font-size: 0.9rem;">Você será redirecionado para o WhatsApp...</p>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ========================================
// ANIMAÇÕES E EFEITOS
// ========================================
class ScrollEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.sections = document.querySelectorAll('section');
        this.init();
    }
    
    init() {
        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Intersection Observer para animações
        this.setupIntersectionObserver();
        
        // Smooth scroll para links internos
        this.setupSmoothScroll();
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Header background on scroll
        if (scrollY > 50) {
            this.header.style.background = 'rgba(0, 0, 0, 0.98)';
            this.header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
        } else {
            this.header.style.background = 'rgba(0, 0, 0, 0.95)';
            this.header.style.boxShadow = 'none';
        }
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animar elementos filhos
                    const animatedElements = entry.target.querySelectorAll('[data-aos]');
                    animatedElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        this.sections.forEach(section => observer.observe(section));
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ========================================
// INSTAGRAM FEED MOCK
// ========================================
class InstagramFeed {
    constructor() {
        this.posts = document.querySelectorAll('.instagram-post');
        this.init();
    }
    
    init() {
        this.posts.forEach((post, index) => {
            // Adicionar animação de hover com delay
            post.addEventListener('mouseenter', () => {
                post.style.transition = 'all 0.3s ease';
                post.style.zIndex = '10';
            });
            
            post.addEventListener('mouseleave', () => {
                post.style.zIndex = '1';
            });
            
            // Simular clique para abrir Instagram
            post.addEventListener('click', () => {
                // Substitua pelo link do Instagram
                window.open('https://www.instagram.com/miguel_tattoo/', '_blank');
            });
        });
    }
}

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos os módulos
    new Carousel();
    new MobileMenu();
    new BookingForm();
    new ScrollEffects();
    new InstagramFeed();
    
    // Loader animation
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease;
    `;
    loader.innerHTML = `
        <div style="text-align: center;">
            <div class="loader-spinner" style="
                width: 60px;
                height: 60px;
                border: 3px solid rgba(184, 134, 11, 0.3);
                border-top-color: #B8860B;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <p style="color: #B8860B; margin-top: 1rem; font-family: 'Montserrat', sans-serif; letter-spacing: 2px;">
                <i class="fas fa-fire" style="animation: flicker 0.5s ease-in-out infinite;"></i> CARREGANDO...
            </p>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    // Remover loader quando a página carregar
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });
});

// CSS para animações via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    section.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);