document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and update navigation
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const mainMenu = document.querySelector('.main-menu ul');
    
    if (isLoggedIn === 'true') {
        const currentUser = localStorage.getItem('currentUser');
        
        // Update navigation for logged in users
        mainMenu.innerHTML = `
            <li><a href="index.html">Trang chủ</a></li>
            <li><a href="dashboard.html">Quản lý chi tiêu</a></li>
            <li><a href="#" id="logoutBtn">Đăng xuất</a></li>
        `;
        
        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('isLoggedIn');
                window.location.href = 'index.html';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animation for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
    });
});