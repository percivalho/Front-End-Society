const submitCommentHandler = async (event) => {
    event.preventDefault();
  
    const comment = document.querySelector('#comment').value.trim();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    
    if (comment) {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'POST',
        body: JSON.stringify({comment}),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`/blog/${id}`);
      } else {
        alert('Failed to add comment.');
      }
    }
  };
  
  document
    .querySelector('.comment-form')
    .addEventListener('submit', submitCommentHandler);