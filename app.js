// DOM Elements
const pricingToggle = document.getElementById("pricing-toggle");
const monthlyText = document.getElementById("monthly-text");
const yearlyText = document.getElementById("yearly-text");
const discountBadge = document.querySelector(".discount-badge");
const prices = document.querySelectorAll(".price");
const periods = document.querySelectorAll(".period");
const selectButtons = document.querySelectorAll(".select-btn");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");
const selectedPlan = document.getElementById("selectedPlan");
const pricingCards = document.querySelectorAll(".pricing-card");

// State
let isYearly = false;
let currentSelectedPlan = "";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  initializeScrollButton();
  animateCardsOnLoad();
});

// Event Listeners
function initializeEventListeners() {
  // Pricing toggle
  pricingToggle.addEventListener("change", handlePricingToggle);

  // Select buttons
  selectButtons.forEach((button) => {
    button.addEventListener("click", handleSelectPlan);
  });

  // Modal controls
  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);
  modalConfirm.addEventListener("click", confirmSelection);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Scroll to top button
  scrollTopBtn.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", handleScroll);

  // Keyboard navigation
  document.addEventListener("keydown", handleKeydown);
}

// Pricing Toggle Handler
function handlePricingToggle() {
  isYearly = pricingToggle.checked;
  updatePricingDisplay();
  updateToggleLabels();
  showDiscountBadge();
}

// Update Pricing Display
function updatePricingDisplay() {
  prices.forEach((priceElement) => {
    const monthlyPrice = priceElement.getAttribute("data-monthly");
    const yearlyPrice = priceElement.getAttribute("data-yearly");
    const newPrice = isYearly ? yearlyPrice : monthlyPrice;

    // Animate price change
    priceElement.style.transform = "translateY(-10px)";
    priceElement.style.opacity = "0";

    setTimeout(() => {
      priceElement.textContent = newPrice;
      priceElement.style.transform = "translateY(0)";
      priceElement.style.opacity = "1";
    }, 150);
  });

  // Update periods
  periods.forEach((periodElement) => {
    periodElement.style.transform = "translateY(-10px)";
    periodElement.style.opacity = "0";

    setTimeout(() => {
      periodElement.textContent = isYearly ? "/year" : "/month";
      periodElement.style.transform = "translateY(0)";
      periodElement.style.opacity = "1";
    }, 150);
  });
}

// Update Toggle Labels
function updateToggleLabels() {
  monthlyText.classList.toggle("active", !isYearly);
  yearlyText.classList.toggle("active", isYearly);
}

// Show/Hide Discount Badge
function showDiscountBadge() {
  if (isYearly) {
    discountBadge.classList.add("show");
  } else {
    discountBadge.classList.remove("show");
  }
}

// Handle Plan Selection
function handleSelectPlan(e) {
  currentSelectedPlan = e.target.getAttribute("data-plan");
  selectedPlan.textContent = currentSelectedPlan;
  showModal();
}

// Modal Functions
function showModal() {
  modalOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

function confirmSelection() {
  const period = isYearly ? "yearly" : "monthly";
  alert(
    `Thank you! You've selected the ${currentSelectedPlan} plan (${period} billing).`
  );
  closeModal();
}

// Scroll to Top Functionality
function initializeScrollButton() {
  handleScroll(); // Check initial scroll position
}

function handleScroll() {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Animate Cards on Load
function animateCardsOnLoad() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  pricingCards.forEach((card) => {
    observer.observe(card);
  });
}

// Keyboard Navigation
function handleKeydown(e) {
  // Close modal with Escape key
  if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
    closeModal();
  }

  // Toggle pricing with 'T' key
  if (e.key.toLowerCase() === "t" && !modalOverlay.classList.contains("show")) {
    pricingToggle.checked = !pricingToggle.checked;
    handlePricingToggle();
  }
}

// Add hover effects for cards
pricingCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    if (!this.classList.contains("popular")) {
      this.style.transform = "translateY(-10px) scale(1.02)";
    }
  });

  card.addEventListener("mouseleave", function () {
    if (!this.classList.contains("popular")) {
      this.style.transform = "translateY(0) scale(1)";
    }
  });
});

// Add click animation to buttons
selectButtons.forEach((button) => {
  button.addEventListener("mousedown", function () {
    this.style.transform = "translateY(2px)";
  });

  button.addEventListener("mouseup", function () {
    this.style.transform = "translateY(-2px)";
  });
});

// Smooth scroll for better UX
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll handler
window.addEventListener("scroll", debounce(handleScroll, 10));
