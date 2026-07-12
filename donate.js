/**
 * Donate Page JS — Unstoppable 20
 */

// Mobile nav toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navbar = document.getElementById('navbar');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => navbar.classList.toggle('open'));
}

// Header scroll effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll reveal
const revealEls = document.querySelectorAll('.scroll-reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// Copy UPI ID
function copyUPI() {
    const upi = document.getElementById('upi-id-text').textContent;
    navigator.clipboard.writeText(upi).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.style.background = 'var(--color-green)';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-copy"></i>';
            btn.style.background = '';
        }, 2000);
    });
}

// Donation Confirmation Form — Web3Forms
const WEB3FORMS_KEY = 'bff2ff5a-8d51-4803-abeb-df3ce28d2088';
const form = document.getElementById('donation-confirm-form');
const successEl = document.getElementById('donate-confirm-success');
const errorEl = document.getElementById('donate-confirm-error');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const original = btnText.innerHTML;
        btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
        btn.disabled = true;
        successEl.classList.add('hide');
        errorEl.classList.add('hide');

        const payload = {
            access_key: WEB3FORMS_KEY,
            subject: 'New Donation Confirmation — Unstoppable 20',
            name: document.getElementById('dc-name').value,
            email: document.getElementById('dc-email').value,
            phone: document.getElementById('dc-phone').value,
            donation_amount: '₹' + document.getElementById('dc-amount').value,
            transaction_id: document.getElementById('dc-txn').value,
            message: document.getElementById('dc-message').value || 'No message',
            botcheck: ''
        };

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                successEl.classList.remove('hide');
                form.reset();
                window.scrollTo({ top: successEl.offsetTop - 100, behavior: 'smooth' });
            } else {
                errorEl.classList.remove('hide');
            }
        } catch (err) {
            errorEl.classList.remove('hide');
        } finally {
            btnText.innerHTML = original;
            btn.disabled = false;
        }
    });
}
