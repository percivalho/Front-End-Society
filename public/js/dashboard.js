const newPostButton = document.querySelector('.new-post-button');
const articleElement = document.querySelector('.sample-img');
const createButton = document.querySelector('#crate');

newPostButton.addEventListener('click', () => {
  articleElement.classList.remove('d-none');
});

const submitBlogHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#title').value.trim();
    const description = document.querySelector('#description').value.trim();
    if (title && description) {
      const response = await fetch(`/dashboard`, {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            description, description,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`/dashboard`);
      } else {
        alert('Failed to add blog.');
      }
    }
  };
  
  document
    .querySelector('#create')
    .addEventListener('submit', submitBlogHandler);
