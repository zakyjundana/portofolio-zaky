import './style.css';

// Navigation & Slide elements
const slider = document.getElementById('slider') as HTMLElement;
const slideNumIndicator = document.getElementById('slide-num') as HTMLElement;
const progressBar = document.getElementById('progress') as HTMLElement;
const prevBtn = document.getElementById('prev-slide-btn') as HTMLButtonElement;
const nextBtn = document.getElementById('next-slide-btn') as HTMLButtonElement;
const themeToggleBtn = document.getElementById('theme-toggle') as HTMLButtonElement;

const totalSlides = 15;
let currentSlide = 1;

// Initialize theme from LocalStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  updateThemeButtonText(true);
} else {
  document.body.classList.remove('dark-theme');
  updateThemeButtonText(false);
}

// Update Theme Button Text
function updateThemeButtonText(isDark: boolean) {
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = `<span class="mono-label">${isDark ? 'LIGHT MODE' : 'DARK MODE'}</span>`;
  }
}

// Toggle Theme Handler
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButtonText(isDark);
  });
}

// Function to scroll to a specific slide index (1-based)
function scrollToSlide(slideIndex: number) {
  if (slideIndex < 1 || slideIndex > totalSlides) return;
  
  const targetSlide = document.getElementById(`slide-${slideIndex}`);
  if (targetSlide && slider) {
    // Scroll snapping container
    slider.scrollTo({
      left: targetSlide.offsetLeft,
      behavior: 'smooth'
    });
  }
}

// Update UI indicators based on current slide
function updateIndicators(index: number) {
  currentSlide = index;
  
  // Update slide count string: e.g. "05 / 15"
  if (slideNumIndicator) {
    const formattedIndex = String(index).padStart(2, '0');
    const formattedTotal = String(totalSlides).padStart(2, '0');
    slideNumIndicator.innerText = `${formattedIndex} / ${formattedTotal}`;
  }

  // Update progress bar width
  if (progressBar) {
    const percentage = (index / totalSlides) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  // Update button states
  if (prevBtn) prevBtn.disabled = index === 1;
  if (nextBtn) nextBtn.disabled = index === totalSlides;
}

// Setup IntersectionObserver to detect active slide from scroll position
const observerOptions = {
  root: slider,
  rootMargin: '0px',
  threshold: 0.6 // Slide is active if 60% of it is visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const indexAttr = entry.target.getAttribute('data-index');
      if (indexAttr) {
        const index = parseInt(indexAttr, 10);
        updateIndicators(index);
      }
    }
  });
}, observerOptions);

// Observe all slide sections
const slides = document.querySelectorAll('.slide');
slides.forEach((slide) => observer.observe(slide));

// Prev / Next button actions
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    scrollToSlide(currentSlide - 1);
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    scrollToSlide(currentSlide + 1);
  });
}

// Table of Contents (Index) navigations
const indexItems = document.querySelectorAll('.index-item');
indexItems.forEach((item) => {
  item.addEventListener('click', () => {
    const targetIndexStr = item.getAttribute('data-target');
    if (targetIndexStr) {
      const targetIndex = parseInt(targetIndexStr, 10);
      scrollToSlide(targetIndex);
    }
  });
});

// Keyboard Navigation
document.addEventListener('keydown', (e: KeyboardEvent) => {
  // Ignore keyboard actions if user is typing in form inputs
  const activeElement = document.activeElement;
  if (
    activeElement && 
    (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')
  ) {
    return;
  }

  if (e.key === 'ArrowRight' || e.key === 'Space') {
    e.preventDefault();
    scrollToSlide(currentSlide + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    scrollToSlide(currentSlide - 1);
  }
});

// Contact Form Handler
const contactForm = document.getElementById('contact-form') as HTMLFormElement;
const formStatus = document.getElementById('form-status') as HTMLElement;

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('form-name') as HTMLInputElement;
    const emailInput = document.getElementById('form-email') as HTMLInputElement;
    const messageInput = document.getElementById('form-message') as HTMLTextAreaElement;
    
    // Simulate sending progress
    formStatus.innerText = 'SENDING MESSAGE...';
    formStatus.className = 'form-status';
    
    setTimeout(() => {
      // Mock Success validation
      formStatus.innerText = `THANK YOU, ${nameInput.value.toUpperCase()}! YOUR MESSAGE HAS BEEN SENT.`;
      formStatus.className = 'form-status success';
      
      // Clear inputs
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
    }, 1500);
  });
}
