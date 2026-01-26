// Client-side JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Auto-hide alerts after 3 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 150);
    }, 3000);
  });

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
          alert('Đã thêm vào giỏ hàng!');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra');
      }
    });
  });
});
