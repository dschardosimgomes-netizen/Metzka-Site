// Metzka Super Troca - Script Principal
document.addEventListener('DOMContentLoaded', function() {
    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    
    // Esconder preloader após 1.5 segundos
    setTimeout(() => {
        preloader.classList.add('hidden');
        
        // Remover do DOM após animação
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
    
    // ===== CONFIGURAÇÕES INICIAIS =====
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
    
    // ===== TEMA CLARO/ESCURO =====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Verificar preferência salva ou usar padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Alternar tema
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeIcon(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animação no ícone
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // ===== MENU MOBILE =====
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.innerHTML = mainNav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Atualizar link ativo
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // ===== ANIMAÇÕES DE ENTRADA =====
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        
        animatedElements.forEach(element => {
            // Reset para animar novamente
            element.style.animation = 'none';
            element.style.opacity = '0';
            
            // Forçar reflow
            void element.offsetWidth;
            
            // Aplicar animação com delay
            const delay = element.getAttribute('data-delay') || 0;
            const animationClass = Array.from(element.classList)
                .find(cls => cls.startsWith('animate-'));
            
            setTimeout(() => {
                element.style.animation = '';
                element.style.opacity = '1';
                
                // Ativar animação específica
                if (animationClass) {
                    element.classList.add(animationClass);
                }
            }, parseInt(delay));
        });
    }
    
    // ===== CONTADOR ANIMADO =====
    function initCounters() {
        const counters = document.querySelectorAll('.animate-count');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-value'));
            const delay = parseInt(counter.getAttribute('data-delay')) || 0;
            const numberElement = counter.querySelector('.stat-number');
            
            setTimeout(() => {
                let current = 0;
                const increment = target / 50; // 50 steps
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        numberElement.textContent = target + (counter.getAttribute('data-value') === '100' ? '%' : (counter.getAttribute('data-value') === '24' ? 'h' : '+'));
                        clearInterval(timer);
                    } else {
                        numberElement.textContent = Math.floor(current);
                    }
                }, 30);
            }, delay);
        });
    }
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Adicionar sombra ao scroll
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Esconder/mostrar header no scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        // Ativar animações quando elementos entram na viewport
        checkAnimations();
    });
    
    // ===== FORMULÁRIO DE ORÇAMENTO =====
    const cotacaoForm = document.getElementById('cotacaoForm');
    const telefoneInput = document.getElementById('telefone');
    
    // Formatação de telefone
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d{0,2})$/, '($1');
        }
        
        e.target.value = value;
    });
    
    // Envio do formulário
    cotacaoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const telefone = telefoneInput.value.trim();
        const veiculo = document.getElementById('veiculo').value.trim();
        const servico = document.getElementById('servico').value;
        
        // Validação básica
        if (!nome || !telefone || !veiculo || !servico) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Formatar número para WhatsApp
        const telefoneNumerico = telefone.replace(/\D/g, '');
        if (telefoneNumerico.length < 10) {
            showNotification('Por favor, insira um número de telefone válido.', 'error');
            return;
        }
        
        // Criar mensagem para WhatsApp
        const mensagem = `*SOLICITAÇÃO DE ORÇAMENTO - METZKA SUPER TROCA*%0A%0A` +
                        `*Nome:* ${nome}%0A` +
                        `*Telefone:* ${telefone}%0A` +
                        `*Veículo:* ${veiculo}%0A` +
                        `*Serviço Desejado:* ${servico}%0A%0A` +
                        `*Mensagem:* Gostaria de receber um orçamento para este serviço.`;
        
        // Abrir WhatsApp
        const whatsappURL = `https://wa.me/5547989291045?text=${mensagem}`;
        window.open(whatsappURL, '_blank');
        
        // Resetar formulário
        cotacaoForm.reset();
        
        // Feedback ao usuário
        showNotification('Redirecionando para o WhatsApp...', 'success');
    });
    
    // ===== LIGHTBOX GALERIA =====
    window.openLightbox = function(imgElement) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');
        
        lightboxImg.src = imgElement.src.replace('w800', 'w1200');
        caption.textContent = imgElement.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Armazenar referência da imagem atual
        lightbox.dataset.currentIndex = Array.from(document.querySelectorAll('.gallery-item img'))
            .findIndex(img => img.src === imgElement.src);
    };
    
    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    window.changeImage = function(direction) {
        const lightbox = document.getElementById('lightbox');
        const images = document.querySelectorAll('.gallery-item img');
        let currentIndex = parseInt(lightbox.dataset.currentIndex) || 0;
        
        currentIndex += direction;
        
        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        } else if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        
        const imgElement = images[currentIndex];
        const lightboxImg = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');
        
        // Animação de transição
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = imgElement.src.replace('w800', 'w1200');
            caption.textContent = imgElement.alt;
            lightboxImg.style.opacity = '1';
            lightbox.dataset.currentIndex = currentIndex;
        }, 300);
    };
    
    // Fechar lightbox com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    // ===== ANIMAÇÕES ON SCROLL =====
    function checkAnimations() {
        const elements = document.querySelectorAll('.service-card, .contact-card, .gallery-item, .about-feature');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
                element.classList.add('animated');
            }
        });
    }
    
    // ===== NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Estilos para a notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        
        // Animação de entrada
        const slideIn = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = slideIn;
        document.head.appendChild(styleSheet);
        
        // Botão fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ===== CARREGAMENTO DE IMAGENS =====
    function preloadImages() {
        const imageUrls = [
            'https://drive.google.com/thumbnail?id=1B2AdJVubuhAVlwT7kzIzLBHHw6tT9AaH&sz=w1000',
            'https://drive.google.com/thumbnail?id=1toiN6Z24DS0weMqo5dUflz3aFKO3Y37Y&sz=w1000',
            'https://drive.google.com/thumbnail?id=1dB-T60bgw-RrBHlGZ-NJCe1cT9CreePe&sz=w800',
            'https://drive.google.com/thumbnail?id=1tTkm0GiWz6FRvpczHBm-DKw83sXrB0Kk&sz=w800',
            'https://drive.google.com/thumbnail?id=1pnaS2F0p7U6IWKpO_bOtsQcnFHevKuft&sz=w800',
            'https://drive.google.com/thumbnail?id=1h38pO67Kjm3Q4CLrMg6QRX1Tu_c6Tch2&sz=w800',
            'https://drive.google.com/thumbnail?id=1Ng2wezY4zQZGnUWcNFherh6moFcMHUko&sz=w800',
            'https://drive.google.com/thumbnail?id=1ysU0gqbRjNJPBWnY3gLgrLzdeN50zndV&sz=w800'
        ];
        
        // Pré-carregar apenas a primeira imagem para performance
        if (imageUrls[0]) {
            const img = new Image();
            img.src = imageUrls[0];
            img.onload = () => {
                console.log('Imagem principal carregada');
            };
        }
    }
    
    // ===== SMOOTH SCROLL PARA LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== DETECÇÃO DE CLIQUE FORA DO MENU =====
    document.addEventListener('click', (e) => {
        const isMenuButton = menuToggle.contains(e.target);
        const isMenu = mainNav.contains(e.target);
        
        if (!isMenuButton && !isMenu && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // ===== INICIALIZAÇÃO FINAL =====
    setTimeout(() => {
        initAnimations();
        initCounters();
        preloadImages();
        checkAnimations(); // Verificar animações na carga inicial
    }, 1600); // Após o preloader
    
    // Verificar animações periodicamente
    setInterval(checkAnimations, 500);
    
    console.log('Site Metzka Super Troca carregado com sucesso!');
    
    // Desativar comportamento padrão de formulário
    document.querySelectorAll('form').forEach(form => {
        if (form.id !== 'cotacaoForm') {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
            });
        }
    });
});
