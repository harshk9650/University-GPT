// Main Application Router
class UniversityPortal {
    constructor() {
        this.currentPage = 'login';
        this.userData = null;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadPage();
        this.checkRememberedUser();
    }

    initializeEventListeners() {
        // Event delegation for dynamic elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('#logoutBtn, .logout-btn')) {
                this.logout();
            }
            
            if (e.target.closest('.menu-item')) {
                const menuItem = e.target.closest('.menu-item');
                const page = menuItem.dataset.page;
                this.loadPortalPage(page);
            }
            
            if (e.target.closest('.quick-btn')) {
                this.handleQuickAction(e.target.closest('.quick-btn').textContent);
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin();
            }
            
            if (e.target.id === 'signupForm') {
                e.preventDefault();
                this.handleSignup();
            }
        });

        // Toggle between login and signup
        document.addEventListener('click', (e) => {
            if (e.target.id === 'showSignup') {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('signupForm').style.display = 'block';
            }
            
            if (e.target.id === 'showLogin') {
                document.getElementById('signupForm').style.display = 'none';
                document.getElementById('loginForm').style.display = 'block';
            }
        });
    }

    async loadPage() {
        const app = document.getElementById('app');
        
        switch(this.currentPage) {
            case 'login':
                const loginHtml = await this.fetchHtml('login.html');
                app.innerHTML = loginHtml;
                this.initializeLoginPage();
                break;
                
            case 'portal':
                const portalHtml = await this.fetchHtml('portal.html');
                app.innerHTML = portalHtml;
                this.loadPortalPage('dashboard');
                break;
        }
    }

    async fetchHtml(file) {
        const response = await fetch(file);
        return await response.text();
    }

    initializeLoginPage() {
        // Add any login page specific initialization
    }

    handleLogin() {
        const studentId = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked;

        // Simple validation
        if (!studentId || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // For demo purposes, accept any non-empty credentials
        // In real app, validate against backend
        if (studentId && password) {
            this.userData = {
                id: studentId,
                name: "John Doe",
                email: "john.doe@university.edu"
            };

            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify(this.userData));
            }

            this.currentPage = 'portal';
            this.loadPage();
        }
    }

    handleSignup() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const studentId = document.getElementById('newStudentId').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!fullName || !email || !studentId || !password || !confirmPassword) {
            this.showError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        // For demo, auto login after signup
        this.userData = {
            id: studentId,
            name: fullName,
            email: email
        };

        localStorage.setItem('rememberedUser', JSON.stringify(this.userData));
        this.currentPage = 'portal';
        this.loadPage();
    }

    checkRememberedUser() {
        const remembered = localStorage.getItem('rememberedUser');
        if (remembered) {
            this.userData = JSON.parse(remembered);
            // Auto-login could be implemented here
        }
    }

    logout() {
        this.userData = null;
        localStorage.removeItem('rememberedUser');
        this.currentPage = 'login';
        this.loadPage();
    }

    showError(message) {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    loadPortalPage(pageName) {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });

        // Show loading
        pageContent.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

        // Load page content after delay
        setTimeout(() => {
            switch(pageName) {
                case 'dashboard':
                    this.renderDashboard();
                    break;
                case 'chatbot':
                    this.renderChatbot();
                    break;
                case 'timetable':
                    this.renderTimetable();
                    break;
                case 'attendance':
                    this.renderAttendance();
                    break;
                case 'exams':
                    this.renderExams();
                    break;
                case 'resources':
                    this.renderResources();
                    break;
                case 'reminders':
                    this.renderReminders();
                    break;
            }
        }, 300);
    }

    renderDashboard() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page">
                <h2>Welcome, ${this.userData?.name || 'Student'}!</h2>
                <p>Here's your academic overview</p>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">95%</div>
                        <div class="stat-label">Attendance</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">3.8</div>
                        <div class="stat-label">GPA</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">2</div>
                        <div class="stat-label">Upcoming Exams</div>
                    </div>
                </div>
                
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Today's Classes</div>
                            <span class="badge">3 classes</span>
                        </div>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                <strong>Mathematics</strong><br>
                                <small>9:00 AM - 10:00 AM | Room 101</small>
                            </li>
                            <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                <strong>Physics Lab</strong><br>
                                <small>11:00 AM - 1:00 PM | Lab B</small>
                            </li>
                            <li style="padding: 10px 0;">
                                <strong>Computer Science</strong><br>
                                <small>2:00 PM - 3:30 PM | Room 205</small>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Quick Actions</div>
                        </div>
                        <div style="display: grid; gap: 10px;">
                            <button class="quick-btn" onclick="portal.loadPortalPage('chatbot')">
                                <i class="fas fa-robot"></i> Ask Campus GPT
                            </button>
                            <button class="quick-btn" onclick="portal.loadPortalPage('timetable')">
                                <i class="fas fa-calendar"></i> View Timetable
                            </button>
                            <button class="quick-btn" onclick="portal.loadPortalPage('exams')">
                                <i class="fas fa-file-alt"></i> Exam Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderChatbot() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page">
                <h2><i class="fas fa-robot"></i> Campus GPT</h2>
                <p>Your AI university assistant</p>
                
                <div class="chat-container">
                    <div class="chat-header">
                        <h3>Campus Assistant</h3>
                        <small>Ask me about timetable, events, and more</small>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="message bot-message">
                            Hello! I'm your university assistant. How can I help you today?
                            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
                        <button class="login-btn" style="width: auto; padding: 10px 20px;" id="sendMessage">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <button class="quick-btn" data-query="timetable">Show Timetable</button>
                    <button class="quick-btn" data-query="events">Upcoming Events</button>
                    <button class="quick-btn" data-query="exams">Exam Schedule</button>
                    <button class="quick-btn" data-query="attendance">My Attendance</button>
                </div>
            </div>
        `;

        this.initializeChatbot();
    }

    initializeChatbot() {
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendMessage');

        const addMessage = (text, isUser = false) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
            messageDiv.innerHTML = `
                ${text}
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const handleSend = () => {
            const message = chatInput.value.trim();
            if (!message) return;

            addMessage(message, true);
            chatInput.value = '';

            // Show typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot-message';
            typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            chatMessages.appendChild(typingDiv);

            setTimeout(() => {
                typingDiv.remove();
                const response = this.generateBotResponse(message);
                addMessage(response);
            }, 1000);
        };

        sendButton.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn[data-query]').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                addMessage(query, true);
                
                const typingDiv = document.createElement('div');
                typingDiv.className = 'message bot-message';
                typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
                chatMessages.appendChild(typingDiv);

                setTimeout(() => {
                    typingDiv.remove();
                    const response = this.generateBotResponse(query);
                    addMessage(response);
                }, 1000);
            });
        });
    }

    generateBotResponse(query) {
        const responses = {
            timetable: `Here's your weekly timetable:<br><br>
                <strong>Monday:</strong> Mathematics (9-10), Physics (11-12)<br>
                <strong>Tuesday:</strong> Chemistry (10-11), Biology Lab (2-4)<br>
                <strong>Wednesday:</strong> Computer Science (9-11), Mathematics (2-3)<br>
                <strong>Thursday:</strong> Physics Lab (10-1), Sports (3-4)<br>
                <strong>Friday:</strong> Project Work (9-12), Seminar (2-4)`,
                
            events: `Upcoming Events:<br><br>
                • <strong>Science Fair:</strong> Oct 15, Main Auditorium<br>
                • <strong>Career Workshop:</strong> Oct 18, Room 201<br>
                • <strong>Sports Day:</strong> Oct 22, University Ground<br>
                • <strong>Library Workshop:</strong> Oct 25, Central Library`,
                
            exams: `Exam Schedule:<br><br>
                • <strong>Mathematics:</strong> Nov 5, 9:00 AM<br>
                • <strong>Physics:</strong> Nov 7, 9:00 AM<br>
                • <strong>Chemistry:</strong> Nov 9, 2:00 PM<br>
                • <strong>Computer Science:</strong> Nov 12, 9:00 AM`,
                
            attendance: `Your Attendance Summary:<br><br>
                • <strong>Mathematics:</strong> 94% (47/50)<br>
                • <strong>Physics:</strong> 96% (48/50)<br>
                • <strong>Chemistry:</strong> 92% (46/50)<br>
                • <strong>Overall:</strong> 95%`
        };

        const lowerQuery = query.toLowerCase();
        for (const key in responses) {
            if (lowerQuery.includes(key)) {
                return responses[key];
            }
        }

        return "I can help you with:<br>• Timetable<br>• Upcoming events<br>• Exam schedule<br>• Attendance<br>Try asking about any of these!";
    }

    renderTimetable() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page">
                <h2><i class="fas fa-calendar-alt"></i> Weekly Timetable</h2>
                <p>Fall Semester 2024</p>
                
                <table class="timetable">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Monday</th>
                            <th>Tuesday</th>
                            <th>Wednesday</th>
                            <th>Thursday</th>
                            <th>Friday</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>9:00 - 10:00</td>
                            <td>Mathematics<br><small>Room 101</small></td>
                            <td>Physics<br><small>Room 102</small></td>
                            <td>Computer Science<br><small>Lab A</small></td>
                            <td>Mathematics<br><small>Room 101</small></td>
                            <td>Project Work<br><small>Lab B</small></td>
                        </tr>
                        <tr>
                            <td>10:00 - 11:00</td>
                            <td>Physics<br><small>Room 102</small></td>
                            <td>Chemistry<br><small>Lab C</small></td>
                            <td>Mathematics<br><small>Room 101</small></td>
                            <td>Physics Lab<br><small>Lab A</small></td>
                            <td>Seminar<br><small>Auditorium</small></td>
                        </tr>
                        <tr>
                            <td>11:00 - 12:00</td>
                            <td>Chemistry<br><small>Lab C</small></td>
                            <td>Biology<br><small>Room 103</small></td>
                            <td>Physics<br><small>Room 102</small></td>
                            <td>Computer Science<br><small>Lab B</small></td>
                            <td>Library<br><small>Self Study</small></td>
                        </tr>
                        <tr>
                            <td>1:00 - 2:00</td>
                            <td>Lunch Break</td>
                            <td>Lunch Break</td>
                            <td>Lunch Break</td>
                            <td>Lunch Break</td>
                            <td>Lunch Break</td>
                        </tr>
                        <tr>
                            <td>2:00 - 3:00</td>
                            <td>Computer Science<br><small>Lab B</small></td>
                            <td>Biology Lab<br><small>Lab D</small></td>
                            <td>Chemistry<br><small>Lab C</small></td>
                            <td>Sports<br><small>Ground</small></td>
                            <td>Tutorial<br><small>Room 104</small></td>
                        </tr>
                        <tr>
                            <td>3:00 - 4:00</td>
                            <td>Library<br><small>Self Study</small></td>
                            <td>Project Work<br><small>Lab B</small></td>
                            <td>Tutorial<br><small>Room 104</small></td>
                            <td>Club Activity</td>
                            <td>Free Period</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    renderAttendance() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page">
                <h2><i class="fas fa-clipboard-check"></i> Attendance Tracking</h2>
                <p>Fall Semester 2024</p>
                
                <div class="attendance-summary">
                    <div class="subject-attendance">
                        <h3>Overall Attendance</h3>
                        <div style="font-size: 3rem; font-weight: bold; color: #28a745;">95%</div>
                        <p>188 out of 200 classes attended</p>
                    </div>
                    
                    <div class="subject-attendance" style="border-left-color: #1a73e8;">
                        <h3>Mathematics</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: #1a73e8;">94%</div>
                        <p>47 out of 50 classes</p>
                    </div>
                    
                    <div class="subject-attendance" style="border-left-color: #fdbb2d;">
                        <h3>Physics</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: #fdbb2d;">96%</div>
                        <p>48 out of 50 classes</p>
                    </div>
                </div>
                
                <h3 style="margin-top: 30px;">Monthly Attendance Trend</h3>
                <div class="attendance-chart">
                    <div style="display: flex; align-items: flex-end; height: 200px; gap: 20px; margin-top: 20px;">
                        ${['Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => `
                            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                                <div style="width: 40px; background: linear-gradient(to top, #1a73e8, #1a2a6c); 
                                    height: ${Math.random() * 100 + 80}px; border-radius: 5px;"></div>
                                <div style="margin-top: 10px;">${month}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderExams() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page">
                <h2><i class="fas fa-file-alt"></i> Exam Portal</h2>
                <p>Fall Semester 2024 Examination Schedule</p>
                
                <div class="exam-card">
                    <h3><i class="fas fa-exclamation-circle"></i> Current Exams</h3>
                    <p><strong>Mathematics - Mid Term</strong></p>
                    <p>Date: November 5, 2024 | Time: 9:00 AM - 12:00 PM</p>
                    <p>Venue: Examination Hall A | Seat: B-25</p>
                    <button class="quick-btn" style="margin-top: 10px;">Download Hall Ticket</button>
                </div>
                
                <div class="exam-card upcoming">
                    <h3><i class="fas fa-clock"></i> Upcoming Exams</h3>
                    <p><strong>Physics - Final Exam</strong></p>
                    <p>Date: November 7, 2024 | Time: 9:00 AM - 12:00 PM</p>
                    <p>Venue: Examination Hall B</p>
                </div>
                
                <div class="exam-card upcoming">
                    <p><strong>Chemistry - Final Exam</strong></p>
                    <p>Date: November 9, 2024 | Time: 2:00 PM - 5:00 PM</p>
                    <p>Venue: Examination Hall A</p>
                </div>
                
                <div class="exam-card completed">
                    <h3><i class="fas fa-check-circle"></i> Completed Exams</h3>
                    <p><strong>Computer Science - Mid Term</strong></p>
                    <p>Date: October 28, 2024 | Score: 85/100</p>
                </div>
                
                <div style="margin-top: 30px;">
                    <h3>Exam Results</h3>
                    <table class="timetable">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Exam Type</th>
                                <th>Date</th>
                                <th>Score</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Computer Science</td>
                                <td>Mid Term</td>
                                <td>Oct 28, 2024</td>
                                <td>85/100</td>
                                <td>A</td>
                            </tr>
                            <tr>
                                <td>Mathematics</td>
                                <td>Assignment 1</td>
                                <td>Oct 15, 2024</td>
                                <td>92/100</td>
                                <td>A+</td>
                            </tr>
                            <tr>
                                <td>Physics</td>
                                <td>Lab Test</td>
                                <td>Oct 10, 2024</td>
                                <td>88/100</td>
                                <td>A</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderResources() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page">
                <h2><i class="fas fa-book"></i> Learning Resources</h2>
                <p>Download study materials and resources</p>
                
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Course Materials</div>
                        </div>
                        <div style="display: grid; gap: 10px;">
                            <button class="quick-btn">
                                <i class="fas fa-file-pdf"></i> Mathematics Syllabus
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-file-pdf"></i> Physics Lab Manual
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-file-pdf"></i> Chemistry Notes
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-file-pdf"></i> CS Programming Guide
                            </button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">University Documents</div>
                        </div>
                        <div style="display: grid; gap: 10px;">
                            <button class="quick-btn">
                                <i class="fas fa-download"></i> Academic Calendar
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-download"></i> University Handbook
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-download"></i> Exam Regulations
                            </button>
                            <button class="quick-btn">
                                <i class="fas fa-download"></i> Scholarship Form
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <h3>Video Lectures</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                            <h4><i class="fas fa-video"></i> Calculus Fundamentals</h4>
                            <p>Professor Smith | Duration: 45min</p>
                            <button class="quick-btn" style="width: 100%;">Watch Now</button>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                            <h4><i class="fas fa-video"></i> Physics Lab Demo</h4>
                            <p>Professor Johnson | Duration: 30min</p>
                            <button class="quick-btn" style="width: 100%;">Watch Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderReminders() {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = `
            <div class="page">
                <h2><i class="fas fa-bell"></i> Reminders & Notifications</h2>
                <p>Important deadlines and notifications</p>
                
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Active Reminders</div>
                            <span class="badge badge-warning">2</span>
                        </div>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
                                <div>
                                    <strong>Submit Mathematics Assignment</strong><br>
                                    <small>Due: Tomorrow, 5:00 PM</small>
                                </div>
                            </li>
                            <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-money-bill-wave" style="color: #28a745;"></i>
                                <div>
                                    <strong>Pay Semester Fees</strong><br>
                                    <small>Due: October 20, 2024</small>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">Create New Reminder</div>
                        </div>
                        <div style="display: grid; gap: 10px;">
                            <input type="text" class="chat-input" placeholder="Reminder title" id="reminderTitle">
                            <textarea class="chat-input" placeholder="Description" rows="3" id="reminderDesc"></textarea>
                            <input type="datetime-local" class="chat-input" id="reminderDate">
                            <button class="login-btn" style="width: 100%;" id="addReminder">
                                <i class="fas fa-plus"></i> Add Reminder
                            </button>
                        </div>
                    </div>
                </div>
                
                <h3 style="margin-top: 30px;">Recent Notifications</h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 10px;">
                    <p><strong>University Holiday</strong> - October 26, 2024</p>
                    <small>University will remain closed for Diwali celebration</small>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-top: 10px;">
                    <p><strong>Library Maintenance</strong> - October 28, 2024</p>
                    <small>Central library will be closed for maintenance from 9 AM to 1 PM</small>
                </div>
            </div>
        `;

        // Add reminder functionality
        document.getElementById('addReminder')?.addEventListener('click', () => {
            const title = document.getElementById('reminderTitle').value;
            const desc = document.getElementById('reminderDesc').value;
            const date = document.getElementById('reminderDate').value;

            if (title && date) {
                this.showError('Reminder added successfully!');
                document.getElementById('reminderTitle').value = '';
                document.getElementById('reminderDesc').value = '';
                document.getElementById('reminderDate').value = '';
            }
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case 'Show Timetable':
                this.loadPortalPage('timetable');
                break;
            case 'Upcoming Events':
                // Show events in chatbot
                break;
            case 'Exam Schedule':
                this.loadPortalPage('exams');
                break;
            case 'My Attendance':
                this.loadPortalPage('attendance');
                break;
        }
    }
}

// Initialize the portal when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.portal = new UniversityPortal();
});