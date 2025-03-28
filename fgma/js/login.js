document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Reset error messages
        emailError.textContent = '';
        passwordError.textContent = '';

        // Validate email
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email không được để trống';
            isValid = false;
        }

        // Validate password
        if (!passwordInput.value.trim()) {
            passwordError.textContent = 'Mật khẩu không được để trống';
            isValid = false;
        }

        if (isValid) {
            // Check credentials against stored registration data
            const storedUser = JSON.parse(localStorage.getItem('userData'));
            
            if (storedUser && 
                storedUser.email === emailInput.value.trim() && 
                storedUser.password === passwordInput.value.trim()) {
                
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', emailInput.value.trim());
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Show error if credentials don't match
                passwordError.textContent = 'Email hoặc mật khẩu không đúng';
            }
        }
    });
});