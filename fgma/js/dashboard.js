document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Display current user email
    const currentUser = localStorage.getItem('currentUser');
    document.getElementById('userEmail').textContent = currentUser;

    // Initialize expense data
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseForm = document.getElementById('expenseForm');
    const expenseTable = document.getElementById('expenseTable').querySelector('tbody');
    const monthFilter = document.getElementById('monthFilter');
    const statusFilter = document.getElementById('statusFilter');
    let expenseChart = null;

    // Set up logout button
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }
    });

    // Add new expense
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const expenseName = document.getElementById('expenseName').value.trim();
        const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
        const expenseDate = document.getElementById('expenseDate').value;
        const expenseCategory = document.getElementById('expenseCategory').value;

        if (!expenseName || isNaN(expenseAmount) || !expenseDate) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (expenseAmount <= 0) {
            alert('Số tiền phải lớn hơn 0');
            return;
        }

        const newExpense = {
            id: Date.now(),
            name: expenseName,
            amount: expenseAmount,
            date: expenseDate,
            category: expenseCategory,
            status: expenseAmount > 1000000 ? 'not-achieved' : 'achieved' // Example status logic
        };

        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        // Reset form
        expenseForm.reset();
        
        // Update UI
        renderExpenses();
        updateStatistics();
        updateChart();
    });

    // Filter expenses
    monthFilter.addEventListener('change', renderExpenses);
    statusFilter.addEventListener('change', renderExpenses);

    // Render expenses table
    function renderExpenses() {
        const month = monthFilter.value;
        const status = statusFilter.value;
        
        let filteredExpenses = [...expenses];
        
        if (month !== 'all') {
            filteredExpenses = filteredExpenses.filter(expense => {
                const expenseMonth = new Date(expense.date).getMonth() + 1;
                return expenseMonth.toString() === month;
            });
        }
        
        if (status !== 'all') {
            filteredExpenses = filteredExpenses.filter(expense => expense.status === status);
        }
        
        expenseTable.innerHTML = '';
        
        if (filteredExpenses.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">Không có dữ liệu</td>';
            expenseTable.appendChild(row);
            return;
        }
        
        filteredExpenses.forEach(expense => {
            const row = document.createElement('tr');
            
            const date = new Date(expense.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.amount.toLocaleString()} VND</td>
                <td>${formattedDate}</td>
                <td>${getCategoryName(expense.category)}</td>
                <td class="${expense.status === 'achieved' ? 'achieved' : 'not-achieved'}">
                    ${expense.status === 'achieved' ? 'Đạt' : 'Không đạt'}
                </td>
            `;
            
            expenseTable.appendChild(row);
        });
    }

    // Update statistics
    function updateStatistics() {
        const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
        
        document.getElementById('totalExpense').textContent = `${totalExpense.toLocaleString()} VND`;
        document.getElementById('averageExpense').textContent = `${averageExpense.toLocaleString()} VND`;
        
        // Find month with highest spending
        if (expenses.length > 0) {
            const monthlyTotals = {};
            expenses.forEach(expense => {
                const month = new Date(expense.date).getMonth() + 1;
                monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
            });
            
            let highestMonth = Object.keys(monthlyTotals).reduce((a, b) => 
                monthlyTotals[a] > monthlyTotals[b] ? a : b
            );
            
            document.getElementById('highestMonth').textContent = `Tháng ${highestMonth}`;
        } else {
            document.getElementById('highestMonth').textContent = '-';
        }
    }

    // Update chart
    function updateChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        
        // Group expenses by month
        const monthlyData = {};
        expenses.forEach(expense => {
            const month = new Date(expense.date).getMonth() + 1;
            monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
        });
        
        const months = Array.from({length: 12}, (_, i) => i + 1);
        const data = months.map(month => monthlyData[month] || 0);
        
        if (expenseChart) {
            expenseChart.destroy();
        }
        
        expenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months.map(month => `Tháng ${month}`),
                datasets: [{
                    label: 'Chi tiêu (VND)',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Helper function to get category name
    function getCategoryName(category) {
        const categories = {
            'food': 'Ăn uống',
            'transport': 'Đi lại',
            'entertainment': 'Giải trí',
            'utilities': 'Tiện ích',
            'other': 'Khác'
        };
        return categories[category] || category;
    }

    // Initialize month filter options
    function initMonthFilter() {
        const uniqueMonths = new Set();
        expenses.forEach(expense => {
            const month = new Date(expense.date).getMonth() + 1;
            uniqueMonths.add(month);
        });
        
        const months = Array.from(uniqueMonths).sort();
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = `Tháng ${month}`;
            monthFilter.appendChild(option);
        });
    }

    // Initialize the page
    initMonthFilter();
    renderExpenses();
    updateStatistics();
    updateChart();
});