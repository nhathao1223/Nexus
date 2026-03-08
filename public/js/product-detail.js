// Product Detail Page JavaScript

// Change main image when clicking thumbnails
function changeImage(src) {
  const mainImage = document.getElementById('mainImage');
  if (mainImage) {
    mainImage.src = src;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail-item').forEach(function(item) {
      item.classList.remove('active');
    });
    event.target.closest('.thumbnail-item').classList.add('active');
  }
}

// Handle storage option selection
document.querySelectorAll('.storage-option').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.storage-option').forEach(function(b) {
      b.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// Handle color selection
document.querySelectorAll('.color-option').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.color-option').forEach(function(b) {
      b.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// Handle Buy Now button
const buyNowBtn = document.getElementById('buyNowBtn');
if (buyNowBtn) {
  buyNowBtn.addEventListener('click', async function() {
    const productId = this.getAttribute('data-product-id');
    const quantity = 1;
    
    // Get selected warranty
    const selectedWarranty = document.querySelector('input[name="warranty"]:checked');
    const warrantyValue = selectedWarranty ? parseFloat(selectedWarranty.value) : 0;
    const warrantyId = selectedWarranty ? selectedWarranty.id : null;
    let warrantyName = null;
    
    if (warrantyValue > 0 && warrantyId) {
      const warrantyLabel = document.querySelector(`label[for="${warrantyId}"] .warranty-title`);
      warrantyName = warrantyLabel ? warrantyLabel.textContent : null;
    }
    
    try {
      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
          warranty: warrantyValue > 0 ? {
            name: warrantyName,
            price: warrantyValue
          } : null
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        window.location.href = '/cart';
      } else {
        showToast(result.message || 'Có lỗi xảy ra', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  });
}

// Handle Add to Cart button
const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', async function() {
    const productId = this.getAttribute('data-product-id');
    const quantity = 1;
    
    // Get selected warranty
    const selectedWarranty = document.querySelector('input[name="warranty"]:checked');
    const warrantyValue = selectedWarranty ? parseFloat(selectedWarranty.value) : 0;
    const warrantyId = selectedWarranty ? selectedWarranty.id : null;
    let warrantyName = null;
    
    if (warrantyValue > 0 && warrantyId) {
      const warrantyLabel = document.querySelector(`label[for="${warrantyId}"] .warranty-title`);
      warrantyName = warrantyLabel ? warrantyLabel.textContent : null;
    }
    
    try {
      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
          warranty: warrantyValue > 0 ? {
            name: warrantyName,
            price: warrantyValue
          } : null
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast(`Đã thêm "${result.productTitle}" vào giỏ hàng!`, 'success');
        updateCartCounter();
        
        // Change button appearance temporarily
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="bi bi-check-circle"></i>';
        this.style.background = '#28a745';
        this.style.color = '#fff';
        this.style.borderColor = '#28a745';
        
        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.style.background = '';
          this.style.color = '';
          this.style.borderColor = '';
        }, 2000);
      } else {
        showToast(result.message || 'Có lỗi xảy ra', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  });
}

// Toast notification function
function showToast(message, type = 'success') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast-notification alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
  toast.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;';
  toast.innerHTML = `
    <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

// Handle spec section accordion chevron rotation
document.addEventListener('DOMContentLoaded', function() {
  const specHeaders = document.querySelectorAll('.spec-section-header');
  specHeaders.forEach(function(header) {
    header.addEventListener('click', function() {
      // Bootstrap will handle the collapse, we just need to ensure chevron rotates
      const chevron = this.querySelector('.bi-chevron-down');
      if (chevron) {
        // Toggle will happen automatically via CSS based on aria-expanded
        setTimeout(() => {
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          console.log('Section expanded:', isExpanded);
        }, 350);
      }
    });
  });

  // Handle warranty selection and update final price
  const warrantyRadios = document.querySelectorAll('input[name="warranty"]');
  const finalPriceElement = document.getElementById('finalPrice');
  const vipPointsElement = document.getElementById('vipPoints');
  
  if (warrantyRadios.length > 0 && finalPriceElement) {
    const basePrice = parseFloat(finalPriceElement.getAttribute('data-base-price'));
    
    warrantyRadios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        const warrantyPrice = parseFloat(this.value);
        const totalPrice = basePrice + warrantyPrice;
        
        // Update final price display
        finalPriceElement.textContent = totalPrice.toLocaleString('vi-VN') + '₫';
        
        // Update VIP points
        if (vipPointsElement) {
          vipPointsElement.textContent = Math.floor(totalPrice / 1000).toLocaleString('vi-VN');
        }
      });
    });
  }
});
