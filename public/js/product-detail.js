// Product Detail Page JavaScript

// Product Gallery Management
class ProductGallery {
  constructor() {
    this.currentIndex = 0;
    this.mediaItems = [];
    this.isLoading = false;
    this.youtubePlayer = null;
    
    this.initializeGallery();
    this.bindEvents();
  }

  initializeGallery() {
    // Collect all media items from thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    this.mediaItems = Array.from(thumbnails).map((thumb, index) => ({
      index,
      type: thumb.dataset.type,
      src: thumb.dataset.src,
      videoId: thumb.dataset.videoId || null,
      element: thumb
    }));

    this.updateCounter();
    this.updateNavigationButtons();
  }

  bindEvents() {
    // Thumbnail clicks
    document.addEventListener('click', (e) => {
      const thumbnailItem = e.target.closest('.thumbnail-item');
      if (thumbnailItem) {
        const index = parseInt(thumbnailItem.dataset.index) || 0;
        const type = thumbnailItem.dataset.mediaType || 'image';
        const src = thumbnailItem.dataset.src;
        const videoId = thumbnailItem.dataset.videoId || null;
        
        this.selectMedia(index, type, src, videoId);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.navigateGallery(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigateGallery(1);
      }
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    const mainContainer = document.querySelector('.main-image-container');
    
    mainContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    mainContainer.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          this.navigateGallery(1); // Swipe left - next image
        } else {
          this.navigateGallery(-1); // Swipe right - previous image
        }
      }
    });
  }

  showLoading() {
    const loading = document.getElementById('galleryLoading');
    if (loading) {
      loading.classList.add('show');
    }
    this.isLoading = true;
  }

  hideLoading() {
    const loading = document.getElementById('galleryLoading');
    if (loading) {
      loading.classList.remove('show');
    }
    this.isLoading = false;
  }

  selectMedia(index, type, src, videoId = null) {
    if (this.isLoading || index === this.currentIndex) return;

    this.showLoading();
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const selectedThumbnail = document.querySelector(`[onclick*="selectMedia(${index}"]`);
    if (selectedThumbnail) {
      selectedThumbnail.classList.add('active');
    }

    this.currentIndex = index;

    if (type === 'image') {
      this.showImage(src);
    } else if (type === 'video') {
      this.showVideo(src);
    } else if (type === 'youtube') {
      this.showYouTubeVideo(videoId);
    }

    this.updateCounter();
    this.updateNavigationButtons();
  }

  showImage(src) {
    const mainImage = document.getElementById('mainImage');
    const mainVideo = document.getElementById('mainVideo');
    
    // Hide video container
    mainVideo.style.display = 'none';
    
    // Stop any playing video
    this.stopCurrentVideo();
    
    // Fade out current image
    mainImage.classList.add('fade-out');
    
    setTimeout(() => {
      mainImage.src = src;
      mainImage.style.display = 'block';
      
      // Wait for image to load
      mainImage.onload = () => {
        mainImage.classList.remove('fade-out');
        mainImage.classList.add('fade-in');
        this.hideLoading();
        
        setTimeout(() => {
          mainImage.classList.remove('fade-in');
        }, 300);
      };
      
      mainImage.onerror = () => {
        console.error('Failed to load image:', src);
        this.hideLoading();
      };
    }, 150);
  }

  showVideo(src) {
    const mainImage = document.getElementById('mainImage');
    const mainVideo = document.getElementById('mainVideo');
    const videoPlayer = document.getElementById('videoPlayer');
    const youtubePlayer = document.getElementById('youtubePlayer');
    
    // Hide image and YouTube player
    mainImage.style.display = 'none';
    youtubePlayer.innerHTML = '';
    
    // Show video container
    mainVideo.style.display = 'block';
    videoPlayer.style.display = 'block';
    
    // Set video source
    const source = videoPlayer.querySelector('source');
    source.src = src;
    videoPlayer.load();
    
    videoPlayer.onloadeddata = () => {
      this.hideLoading();
      mainVideo.classList.add('fade-in');
      
      setTimeout(() => {
        mainVideo.classList.remove('fade-in');
      }, 300);
    };
    
    videoPlayer.onerror = () => {
      console.error('Failed to load video:', src);
      this.hideLoading();
    };
  }

  showYouTubeVideo(videoId) {
    const mainImage = document.getElementById('mainImage');
    const mainVideo = document.getElementById('mainVideo');
    const videoPlayer = document.getElementById('videoPlayer');
    const youtubePlayer = document.getElementById('youtubePlayer');
    
    // Hide image and video player
    mainImage.style.display = 'none';
    videoPlayer.style.display = 'none';
    
    // Show video container
    mainVideo.style.display = 'block';
    
    // Create YouTube iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    
    youtubePlayer.innerHTML = '';
    youtubePlayer.appendChild(iframe);
    
    // Simulate loading time for YouTube
    setTimeout(() => {
      this.hideLoading();
      mainVideo.classList.add('fade-in');
      
      setTimeout(() => {
        mainVideo.classList.remove('fade-in');
      }, 300);
    }, 500);
  }

  stopCurrentVideo() {
    const videoPlayer = document.getElementById('videoPlayer');
    const youtubePlayer = document.getElementById('youtubePlayer');
    
    // Stop HTML5 video
    if (videoPlayer && !videoPlayer.paused) {
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }
    
    // Stop YouTube video by clearing iframe
    if (youtubePlayer) {
      youtubePlayer.innerHTML = '';
    }
  }

  navigateGallery(direction) {
    if (this.isLoading) return;

    const newIndex = this.currentIndex + direction;
    
    if (newIndex < 0 || newIndex >= this.mediaItems.length) {
      return; // Don't loop around
    }

    const mediaItem = this.mediaItems[newIndex];
    if (mediaItem) {
      this.selectMedia(mediaItem.index, mediaItem.type, mediaItem.src, mediaItem.videoId);
    }
  }

  updateCounter() {
    const currentSpan = document.getElementById('currentIndex');
    const totalSpan = document.getElementById('totalMedia');
    const mediaTypeSpan = document.getElementById('currentMediaType');
    
    if (currentSpan && totalSpan) {
      currentSpan.textContent = this.currentIndex + 1;
      totalSpan.textContent = this.mediaItems.length;
    }
    
    // Update current media type indicator
    if (mediaTypeSpan && this.mediaItems[this.currentIndex]) {
      const currentMedia = this.mediaItems[this.currentIndex];
      let displayType = 'Image';
      
      if (currentMedia.type === 'video') {
        displayType = 'Video MP4';
      } else if (currentMedia.type === 'youtube') {
        displayType = 'YouTube';
      }
      
      mediaTypeSpan.textContent = displayType;
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentIndex === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentIndex === this.mediaItems.length - 1;
    }
  }

  scrollThumbnails(direction) {
    const container = document.getElementById('thumbnailGallery');
    const scrollAmount = 200;
    
    if (container) {
      container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}

// Global functions for onclick handlers
function selectMedia(index, type, src, videoId = null) {
  if (window.productGallery) {
    window.productGallery.selectMedia(index, type, src, videoId);
  }
}

function navigateGallery(direction) {
  if (window.productGallery) {
    window.productGallery.navigateGallery(direction);
  }
}

function scrollThumbnails(direction) {
  if (window.productGallery) {
    window.productGallery.scrollThumbnails(direction);
  }
}

function hideGalleryLoading() {
  if (window.productGallery) {
    window.productGallery.hideLoading();
  }
}

// Legacy function for backward compatibility
function changeImage(src) {
  const mainImage = document.getElementById('mainImage');
  if (mainImage) {
    mainImage.src = src;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail-item').forEach(function(item) {
      item.classList.remove('active');
    });
    
    // Find and activate the clicked thumbnail
    const clickedThumbnail = document.querySelector(`[onclick*="${src}"]`);
    if (clickedThumbnail) {
      clickedThumbnail.classList.add('active');
    }
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
          // Section expanded state tracked for accessibility
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
// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.productGallery = new ProductGallery();
});