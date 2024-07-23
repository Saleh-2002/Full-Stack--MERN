function handleButtonClick(event) {
    const method = event.target.getAttribute('data-method');
    if (method === 'DELETE') {
        alert('Post deleted');
    } else if (method === 'PUT') {
        alert('Post edited');
    }
}