document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Reset error messages
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';

        // Validate email
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email không được để trống';
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            emailError.textContent = 'Email không đúng định dạng';
            isValid = false;
        }

        // Validate password
        if (!passwordInput.value.trim()) {
            passwordError.textContent = 'Mật khẩu không được để trống';
            isValid = false;
        } else if (passwordInput.value.trim().length < 6) {
            passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPasswordInput.value.trim()) {
            confirmPasswordError.textContent = 'Xác nhận mật khẩu không được để trống';
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.textContent = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        // If form is valid, proceed with registration
        if (isValid) {
            // In a real application, you would send this data to a server
            // For this demo, we'll just store in localStorage and redirect
            const userData = {
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            alert('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
            window.location.href = 'login.html';
        }
    });
});