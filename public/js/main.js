// Client-side JavaScript

// Ảnh sản phẩm 404 (file không có trên server sau deploy) → placeholder
document.addEventListener(
  'error',
  function (e) {
    const t = e.target;
    if (
      t &&
      t.tagName === 'IMG' &&
      (t.classList.contains('product-image') ||
        t.classList.contains('flashsale-product-image') ||
        t.classList.contains('main-product-img'))
    ) {
      t.onerror = null;
      t.src = '/images/no-image.svg';
    }
  },
  true
);

document.addEventListener('DOMContentLoaded', function() {
  // Auto-hide alerts after 3 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 150);
    }, 3000);
  });

  // Create toast container if it doesn't exist
  if (!document.getElementById('toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  // Add to cart with AJAX
  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');
  addToCartForms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      try {
        const response = await fetch('/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          showToast(`Đã thêm "${result.productTitle}" vào giỏ hàng!`, 'success');
          updateCartCounter();
        } else {
          showToast(result.message, 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
      }
    });
  });

  // Buy now button functionality
  const buyNowButtons = document.querySelectorAll('.buy-now-btn');
  buyNowButtons.forEach(button => {
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const productId = this.getAttribute('data-product-id');
      const quantity = document.querySelector('input[name="quantity"]')?.value || 1;
      
      try {
        const response = await fetch('/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId, quantity: parseInt(quantity) })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showToast(`Đã thêm "${result.productTitle}" vào giỏ hàng!`, 'success');
          updateCartCounter();
          // Redirect to cart after a short delay
          setTimeout(() => {
            window.location.href = '/cart';
          }, 1000);
        } else {
          showToast(result.message, 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
      }
    });
  });

  // Flash sale slider arrows
  const flashSaleTrack = document.querySelector('.flash-sale-track');
  if (flashSaleTrack) {
    const prevBtn = document.querySelector('.flash-sale-prev');
    const nextBtn = document.querySelector('.flash-sale-next');
    const scrollAmount = 260;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        flashSaleTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        flashSaleTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    // Auto scroll flashsale
    let autoScrollInterval;
    let isUserInteracting = false;

    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        if (!isUserInteracting) {
          const maxScroll = flashSaleTrack.scrollWidth - flashSaleTrack.clientWidth;
          
          // If reached the end, scroll back to start
          if (flashSaleTrack.scrollLeft >= maxScroll - 10) {
            flashSaleTrack.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            flashSaleTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 3000); // Auto scroll every 3 seconds
    };

    const stopAutoScroll = () => {
      clearInterval(autoScrollInterval);
    };

    // Pause auto scroll when user interacts
    flashSaleTrack.addEventListener('mouseenter', () => {
      isUserInteracting = true;
    });

    flashSaleTrack.addEventListener('mouseleave', () => {
      isUserInteracting = false;
    });

    flashSaleTrack.addEventListener('touchstart', () => {
      isUserInteracting = true;
      stopAutoScroll();
    });

    flashSaleTrack.addEventListener('touchend', () => {
      setTimeout(() => {
        isUserInteracting = false;
        startAutoScroll();
      }, 2000);
    });

    // Start auto scroll
    startAutoScroll();
  }

  // Dropdown hover functionality for navbar
  const dropdownElements = document.querySelectorAll('.navbar .dropdown');
  
  dropdownElements.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
      let hideTimeout;
      
      // Show dropdown on hover
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        dropdownMenu.classList.add('show');
        dropdownToggle.setAttribute('aria-expanded', 'true');
      });
      
      // Hide dropdown when mouse leaves
      dropdown.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
          dropdownMenu.classList.remove('show');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }, 200); // Small delay to prevent flickering
      });
      
      // Keep click functionality for mobile
      dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          const isShown = dropdownMenu.classList.contains('show');
          
          // Close all other dropdowns
          document.querySelectorAll('.navbar .dropdown-menu.show').forEach(menu => {
            if (menu !== dropdownMenu) {
              menu.classList.remove('show');
            }
          });
          
          // Toggle current dropdown
          if (isShown) {
            dropdownMenu.classList.remove('show');
            dropdownToggle.setAttribute('aria-expanded', 'false');
          } else {
            dropdownMenu.classList.add('show');
            dropdownToggle.setAttribute('aria-expanded', 'true');
          }
        }
      });
    }
  });
});

// Toast notification function
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toastId = 'toast-' + Date.now();
  const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
  const icon = type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle';

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi ${icon} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 3000
  });
  
  toast.show();
  
  // Remove toast element after it's hidden
  toastElement.addEventListener('hidden.bs.toast', function() {
    this.remove();
  });
}

// Update cart counter function
async function updateCartCounter() {
  try {
    const response = await fetch('/cart/count');
    const result = await response.json();
    
    const counter = document.getElementById('cart-counter');
    if (result.count > 0) {
      if (counter) {
        counter.textContent = result.count;
      } else {
        // Create counter if it doesn't exist
        const cartLink = document.querySelector('a[href="/cart"]');
        if (cartLink) {
          const newCounter = document.createElement('span');
          newCounter.id = 'cart-counter';
          newCounter.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
          newCounter.textContent = result.count;
          cartLink.appendChild(newCounter);
        }
      }
    } else {
      if (counter) {
        counter.remove();
      }
    }
  } catch (error) {
    console.error('Error updating cart counter:', error);
  }
}
// Mega Menu Submenu functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mapping các danh mục với panel tương ứng trong mega menu
  const megaCategoryMappings = [
    { itemId: 'homeCatPhone', panelId: 'megaPhonePanel' },
    { itemId: 'homeCatiPhone', panelId: 'megaiPhonePanel' },
    { itemId: 'homeCatTablet', panelId: 'megaTabletPanel' },
    { itemId: 'homeCatApple', panelId: 'megaApplePanel' },
    { itemId: 'homeCatUsed', panelId: 'megaUsedPanel' },
    { itemId: 'homeCatWatch', panelId: 'megaWatchPanel' }
  ];

  // Chỉ áp dụng cho mega menu (không phải trang home)
  const megaMenu = document.querySelector('.mega-menu-categories');
  if (megaMenu) {
    megaCategoryMappings.forEach(function(mapping) {
      var categoryItem = megaMenu.querySelector('#' + mapping.itemId);
      var panel = megaMenu.querySelector('#' + mapping.panelId);
      
      if (!categoryItem || !panel) return;

      var hideTimeout;

      function showPanel() {
        // Ẩn tất cả panel khác
        megaCategoryMappings.forEach(function(otherMapping) {
          var otherPanel = megaMenu.querySelector('#' + otherMapping.panelId);
          var otherItem = megaMenu.querySelector('#' + otherMapping.itemId);
          if (otherPanel && otherMapping.panelId !== mapping.panelId) {
            otherPanel.classList.remove('show');
          }
          if (otherItem && otherMapping.itemId !== mapping.itemId) {
            otherItem.classList.remove('active');
          }
        });

        if (hideTimeout) clearTimeout(hideTimeout);
        panel.classList.add('show');
        categoryItem.classList.add('active');
      }

      function scheduleHide() {
        hideTimeout = setTimeout(function () {
          panel.classList.remove('show');
          categoryItem.classList.remove('active');
        }, 120);
      }

      // Sử dụng logic giống trang home
      categoryItem.addEventListener('mouseenter', showPanel);
      categoryItem.addEventListener('mouseleave', scheduleHide);
      panel.addEventListener('mouseenter', function() {
        if (hideTimeout) clearTimeout(hideTimeout);
        panel.classList.add('show');
        categoryItem.classList.add('active');
      });
      panel.addEventListener('mouseleave', scheduleHide);
    });

    // Hiển thị panel đầu tiên mặc định khi hover vào mega menu
    megaMenu.addEventListener('mouseenter', function() {
      const firstPanel = megaMenu.querySelector('#megaPhonePanel');
      const firstItem = megaMenu.querySelector('#homeCatPhone');
      
      if (firstPanel && firstItem) {
        // Ẩn tất cả panels khác trước
        megaCategoryMappings.forEach(function(mapping) {
          var panel = megaMenu.querySelector('#' + mapping.panelId);
          var item = megaMenu.querySelector('#' + mapping.itemId);
          if (panel) panel.classList.remove('show');
          if (item) item.classList.remove('active');
        });
        
        // Hiển thị panel đầu tiên
        firstPanel.classList.add('show');
        firstItem.classList.add('active');
      }
    });

    megaMenu.addEventListener('mouseleave', function() {
      // Ẩn tất cả panels khi rời khỏi mega menu
      megaCategoryMappings.forEach(function(mapping) {
        var panel = megaMenu.querySelector('#' + mapping.panelId);
        var item = megaMenu.querySelector('#' + mapping.itemId);
        if (panel) panel.classList.remove('show');
        if (item) item.classList.remove('active');
      });
    });
  }
});