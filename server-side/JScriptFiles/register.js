// Assuming you are using fetch API or another HTTP library
// Adjust the URL to match your server
const registerUrl = 'http://localhost:3000/register';

// Example using fetch API
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch(registerUrl, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
    })
    .catch(error => {
        console.error('Error:', error);
    });
});