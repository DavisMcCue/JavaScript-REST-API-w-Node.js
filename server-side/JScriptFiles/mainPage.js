// mainPageScript.js
$(document).ready(function () {
    // Fetch user info from the server
    $.ajax({
        url: '/getUserInfo',
        method: 'GET',
        success: function (data) {
            if (data.success) {
                // Display the username in the top right corner
                const userInfoDiv = $('#user-info');
                userInfoDiv.html(`Welcome, ${data.username}!`);
            } else {
                window.location.href = '/login'; // Redirect to login if not authenticated
            }
        },
        error: function (error) {
            console.error('Error fetching user info:', error);
        }
    });
});