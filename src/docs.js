document.addEventListener('DOMContentLoaded', () => {
    // 1. Copy to Clipboard Utility
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.parentElement.querySelector('code');
            const codeText = codeBlock.innerText;

            navigator.clipboard.writeText(codeText).then(() => {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Copied!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // 2. Active Sidebar Links via Intersection Observer
    const sections = document.querySelectorAll('.docs-section');
    const navLinks = document.querySelectorAll('.docs-sidebar a');

    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
    };

    const activeMenuObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => activeMenuObserver.observe(section));

    // Smooth scroll for TOC links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');
            if (hash.startsWith('#')) {
                e.preventDefault();
                const targetId = hash.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 90, // Account for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
