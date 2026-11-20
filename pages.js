/**
 * ADRITHI MEDIA — Dedicated Subpages Interactive Controller
 * Handles mobile navigation, category filtering, FAQ accordions, budget selectors, and executive inquiry submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle System
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  function openMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.style.display = 'flex';
    requestAnimationFrame(() => {
      mobileNavDrawer.classList.add('is-active');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove('is-active');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!mobileNavDrawer.classList.contains('is-active')) {
        mobileNavDrawer.style.display = 'none';
      }
    }, 300);
  }

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer?.classList.contains('is-active')) {
      closeMobileNav();
    }
  });

  // 2. Services Filter Buttons (services.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card-deep');

  if (filterBtns.length > 0 && serviceCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        serviceCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // 3. FAQ Accordion (services.html)
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          // Close all other accordions
          faqItems.forEach(i => i.classList.remove('active'));
          // Toggle clicked
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // 4. Budget Selector Buttons (contact.html)
  const budgetBtns = document.querySelectorAll('.budget-btn');
  const selectedBudgetInput = document.getElementById('selectedBudget');

  if (budgetBtns.length > 0 && selectedBudgetInput) {
    budgetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        budgetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.getAttribute('data-budget');
        if (val) selectedBudgetInput.value = val;
      });
    });
  }

  // 5. Pre-select options from URL Parameters (e.g. ?service=Wedding or ?tier=Signature)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const tierParam = urlParams.get('tier');
  const serviceSelect = document.getElementById('clientService');

  if (serviceSelect && serviceParam) {
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].value.toLowerCase().includes(serviceParam.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (tierParam && selectedBudgetInput && budgetBtns.length > 0) {
    if (tierParam.toLowerCase() === 'intimate') {
      budgetBtns[0]?.click();
    } else if (tierParam.toLowerCase() === 'signature') {
      budgetBtns[1]?.click();
    } else if (tierParam.toLowerCase() === 'royal') {
      budgetBtns[3]?.click();
    }
  }

  // 6. Contact / Inquiry Form Handler (contact.html)
  const inquiryForm = document.getElementById('inquiryForm');
  const formFeedback = document.getElementById('formFeedback');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim();
      const phone = document.getElementById('clientPhone')?.value.trim();
      const date = document.getElementById('eventDate')?.value;
      const venue = document.getElementById('eventVenue')?.value.trim();
      const service = document.getElementById('clientService')?.value;
      const notes = document.getElementById('clientNotes')?.value.trim();

      if (!name || !phone || !venue) {
        alert('Please complete the required fields: Your Name, Phone/WhatsApp Number, and Location/Venue.');
        return;
      }

      // Display executive luxury confirmation
      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `<strong>Thank you, ${name}.</strong><br>Your commission inquiry for <em>${service || 'Wedding Cinematography & Photography'}</em> has been received.<br>Our studio team will review your celebration dates and connect with you shortly.`;
        inquiryForm.reset();
      }

      // Pre-filled WhatsApp Concierge Message
      const waMessage = encodeURIComponent(
        `Hello Adrithi Media,\n\nI would like to inquire about booking your photography and cinematography services.\n\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Event Date: ${date || 'To be finalized'}\n` +
        `• Location / Venue: ${venue}\n` +
        `• Service: ${service || 'Wedding Cinematography & Photography'}\n` +
        (notes ? `• Message: ${notes}\n` : '')
      );

      const waUrl = `https://wa.me/917676763936?text=${waMessage}`;
      
      setTimeout(() => {
        if (confirm('Would you like to open WhatsApp to connect directly with the principal cinematographer now?')) {
          window.open(waUrl, '_blank');
        }
      }, 400);
    });
  }
});
