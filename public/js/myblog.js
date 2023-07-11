const submitUpdateHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#title').value.trim();
    const description = document.querySelector('#description').value.trim();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    
    if (title && description) {
      const response = await fetch(`/myblog/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: title,
          description: description,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`/myPlaylist`);
      } else {
        alert('Failed to update blog.');
      }
    }
  };

  const submitDeleteHandler = async (event) => {
    event.preventDefault();
  
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    
    const response = await fetch(`/myblog/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace(`/myPlaylist`);
    } else {
      alert('Failed to delete blog.');
    }
  };




document
  .getElementById('updatepost')
  .addEventListener('click', submitUpdateHandler);

document
.getElementById('delete')
.addEventListener('click', submitDeleteHandler);
