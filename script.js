/* =========================================
   PipIt - Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ——— Custom Cursor ———
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });

    // Smooth follower lag
    const animateCursor = () => {
        if (follower) {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
        }
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Cursor grow on interactive elements
    const interactables = document.querySelectorAll('a, button, .product-card, .testimonial-card, .feature-item, .value-chip');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            if (follower) { follower.style.transform = 'translate(-50%, -50%) scale(1.5)'; follower.style.borderColor = 'var(--peach-dark)'; }
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            if (follower) { follower.style.transform = 'translate(-50%, -50%) scale(1)'; follower.style.borderColor = 'var(--peach)'; }
        });
    });

    // ——— Navbar ———
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ——— Mobile Menu ———
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');

    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        navLinks.classList.toggle('nav-open');
        document.body.style.overflow = navLinks.classList.contains('nav-open') ? 'hidden' : '';
    });

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            navLinks.classList.remove('nav-open');
            document.body.style.overflow = '';
        });
    });

    // ——— Scroll Reveal ———
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-right').forEach((el, i) => {
        // Stagger delays for cards
        const delay = el.closest('[data-delay]')
            ? parseInt(el.closest('[data-delay]').dataset.delay) * 120
            : 0;
        el.style.transitionDelay = delay + 'ms';
        revealObserver.observe(el);
    });

    // ——— Ripple on buttons ———
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `left:${x}px; top:${y}px; width:${Math.max(rect.width, rect.height) * 2}px; height:${Math.max(rect.width, rect.height) * 2}px; margin-left:-${Math.max(rect.width, rect.height)}px; margin-top:-${Math.max(rect.width, rect.height)}px;`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ——— Parallax hero blobs on mousemove ———
    const blobs = document.querySelectorAll('.bg-blob');
    document.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        blobs.forEach((blob, i) => {
            const intensity = (i + 1) * 15;
            blob.style.transform = `translate(${dx * intensity}px, ${dy * intensity}px)`;
        });
    });

    // ——— Contact Form ———
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const btnText = btn.querySelector('.btn-text');
            const btnIcon = btn.querySelector('.btn-icon');

            // Animate button
            btn.disabled = true;
            btnText.textContent = 'Sending…';
            btnIcon.textContent = '⏳';

            await new Promise(r => setTimeout(r, 1200));

            btnText.textContent = 'Sent! Thank you ';
            btnIcon.textContent = '🎉';
            btn.style.background = 'linear-gradient(135deg, var(--mint), #58cc8a)';
            btn.style.color = '#155a2e';
            form.reset();

            await new Promise(r => setTimeout(r, 3500));

            btnText.textContent = 'Send Message';
            btnIcon.textContent = '→';
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
        });
    }

    // ——— Active nav highlight on scroll ———
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinkEls.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.style.color = 'var(--peach-dark)';
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => sectionObserver.observe(s));
});
