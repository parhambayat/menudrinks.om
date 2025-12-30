// Language Switcher
let currentLang = localStorage.getItem('language') || 'en';

function changeLanguage(lang) {
    // Check if translations object exists
    if (typeof translations === 'undefined' || !translations[lang]) {
        console.error('Translations not loaded yet or language not found:', lang);
        setTimeout(() => changeLanguage(lang), 100);
        return;
    }
    
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML lang and dir attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            const translation = translations[lang][key];
            
            // Handle HTML content (for links with text nodes)
            if (element.tagName === 'A' && element.innerHTML.includes('@')) {
                // Preserve links in text
                element.innerHTML = translation;
            } else if (element.tagName === 'A' && (element.innerHTML.includes('→') || element.innerHTML.includes('←'))) {
                // Handle arrows - reverse for RTL
                element.textContent = lang === 'ar' ? translation.replace('→', '←').replace('←', '→') : translation;
            } else if (element.tagName === 'BUTTON') {
                // Handle button elements
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Update page title and meta description
    if (lang === 'ar') {
        document.title = 'Menu Drinks - خدمات تصميم القوائم والهوية البصرية الاحترافية في عمان';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = 'Menu Drinks - خدمات تصميم قوائم المشروبات والهوية البصرية ومفاهيم التصميم الداخلي في عمان. قوائم مشروبات مخصصة للمقاهي والمطاعم.';
        }
    } else {
        document.title = 'Menu Drinks - Professional Menu Design & Branding Services in Oman';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = 'Menu Drinks - Professional drinks menu design, branding, and interior concept services in Oman. Custom beverage menus for cafes and restaurants.';
        }
    }
}

// Initialize language switcher when page is ready
function initLanguageSwitcher() {
    // Check if translations are loaded
    if (typeof translations === 'undefined') {
        console.log('Waiting for translations...');
        setTimeout(initLanguageSwitcher, 50);
        return;
    }
    
    console.log('Translations loaded, initializing language switcher');
    
    // Set initial language
    changeLanguage(currentLang);
    
    // Add event listeners to language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    console.log('Found language buttons:', langButtons.length);
    
    langButtons.forEach((btn, index) => {
        // Remove any existing listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add click event listener with touch support
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            console.log('Language button clicked:', lang);
            changeLanguage(lang);
        });
        
        // Also add touchstart for better mobile support
        newBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            console.log('Language button touched:', lang);
            changeLanguage(lang);
        });
    });
}

// Initialize when page loads - wait for both DOM and scripts
let languageSwitcherInitialized = false;

function tryInitLanguageSwitcher() {
    if (languageSwitcherInitialized) return;
    
    if (typeof translations !== 'undefined' && document.querySelectorAll('.lang-btn').length > 0) {
        console.log('Initializing language switcher...');
        initLanguageSwitcher();
        languageSwitcherInitialized = true;
    } else {
        setTimeout(tryInitLanguageSwitcher, 50);
    }
}

// Try multiple times to ensure translations are loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInitLanguageSwitcher);
} else {
    tryInitLanguageSwitcher();
}

// Also try on window load as fallback
window.addEventListener('load', function() {
    if (!languageSwitcherInitialized) {
        tryInitLanguageSwitcher();
    }
});

// Mobile Menu Toggle - Initialize when DOM is ready
let mobileMenuInitialized = false;

function initMobileMenu() {
    if (mobileMenuInitialized) return;
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuInitialized = true;
        
        const toggle = mobileMenuToggle;
        const menu = navMenu;

        // Toggle menu on click (with touch support)
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // Also support touch events for mobile
        toggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (menu.classList.contains('active')) {
                if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                    const langSwitcher = document.querySelector('.language-switcher');
                    if (!langSwitcher || !langSwitcher.contains(e.target)) {
                        menu.classList.remove('active');
                        toggle.classList.remove('active');
                    }
                }
            }
        });

        // Prevent menu from closing when clicking inside language switcher
        const langSwitcher = document.querySelector('.language-switcher');
        if (langSwitcher) {
            langSwitcher.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

// Also try on window load
window.addEventListener('load', function() {
    if (!mobileMenuInitialized) {
        initMobileMenu();
    }
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-btn');

if (filterButtons.length > 0) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    const categories = item.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission (replace with actual API call)
        showFormMessage('Sending message...', 'success');
        
        // In a real implementation, you would send the data to your server
        // Example:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(result => {
        //     showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        //     contactForm.reset();
        // })
        // .catch(error => {
        //     showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        // });

        // For demo purposes, show success message after 1 second
        setTimeout(() => {
            showFormMessage('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            contactForm.reset();
        }, 1000);
    });
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Instagram Feed Integration
// Note: To integrate with Instagram API, you'll need to:
// 1. Set up Instagram Basic Display API or Instagram Graph API
// 2. Get an access token
// 3. Fetch posts from @menudrinks.om
// 4. Display them in the instagram-grid element

function loadInstagramFeed() {
    const instagramGrid = document.getElementById('instagram-grid');
    
    if (!instagramGrid) return;

    // Placeholder for Instagram API integration
    // Example implementation:
    /*
    const accessToken = 'YOUR_ACCESS_TOKEN';
    const userId = 'YOUR_USER_ID';
    
    fetch(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                instagramGrid.innerHTML = '';
                data.data.slice(0, 6).forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'instagram-post';
                    postElement.innerHTML = `
                        <a href="${post.permalink}" target="_blank" rel="noopener">
                            <img src="${post.media_url}" alt="${post.caption || 'Instagram post'}">
                        </a>
                    `;
                    instagramGrid.appendChild(postElement);
                });
            }
        })
        .catch(error => {
            console.error('Error loading Instagram feed:', error);
            // Keep placeholder message
        });
    */

    // For now, show a message encouraging users to follow on Instagram
    setTimeout(() => {
        const placeholder = instagramGrid.querySelector('.instagram-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <p>Follow us on Instagram for the latest menu designs and inspiration!</p>
                <p class="instagram-note">
                    <a href="https://instagram.com/menudrinks.om" target="_blank" rel="noopener" style="color: #E1306C; font-weight: 600;">
                        Visit @menudrinks.om →
                    </a>
                </p>
            `;
        }
    }, 1000);
}

// Load Instagram feed when page loads
if (document.getElementById('instagram-grid')) {
    loadInstagramFeed();
}

// Scroll to Top Button (optional enhancement)
let scrollToTopBtn = null;

function createScrollToTopButton() {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--secondary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
}

// Initialize scroll to top button
createScrollToTopButton();

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .case-study-card, .value-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Portfolio Item Click Handler - Initialize when DOM is ready
function initPortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const viewBtn = item.querySelector('.view-project-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // In a real implementation, this would open a modal or navigate to a project detail page
                alert('Project detail view would open here. In a full implementation, this would show a modal or navigate to a detailed project page.');
            });
        }
    });
}

// Initialize portfolio items when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioItems);
} else {
    initPortfolioItems();
}

