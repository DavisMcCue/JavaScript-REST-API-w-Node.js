// script.js
$(document).ready(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            url: '/login',
            method: 'POST',
            data: { username, password },
            success: function (data) {
                if (data.success) {
                    // Assuming you have a div with id 'user-info' in your mainPage.html
                    $('#user-info').html(`Welcome, ${data.username}!`);
                    window.location.href = '/mainPage'; // Redirect to main page
                } else {
                    alert(data.message);
                }
            },
            error: function (error) {
                console.error('Error during login:', error);
            }
        });
    });
});