// Admin-side JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize TinyMCE
  if (typeof tinymce !== 'undefined') {
    tinymce.init({
      selector: '.tinymce',
      height: 400,
      menubar: false,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | blocks | ' +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    });
  }

  // Change product status
  const statusSelects = document.querySelectorAll('.status-select');
  statusSelects.forEach(select => {
    select.addEventListener('change', async function() {
      const productId = this.dataset.id;
      const status = this.value;
      
      try {
        const response = await fetch(`/admin/products/${productId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert('Cập nhật trạng thái thành công');
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
