class ModernNursingBot {
            constructor() {
                this.step = 0;
                this.userData = {};
                this.conversationActive = true;
                
                this.chatArea = document.getElementById('chatArea');
                this.inputField = document.getElementById('inputField');
                this.sendBtn = document.getElementById('sendBtn');
                this.statusText = document.getElementById('statusText');
                this.quickReplies = document.getElementById('quickReplies');
                this.quickRepliesContainer = document.getElementById('quickRepliesContainer');
                
                this.initializeEventListeners();
                this.startConversation();
            }

            initializeEventListeners() {
                this.sendBtn.addEventListener('click', () => this.handleInput());
                this.inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.handleInput();
                    }
                });
            }

            getCurrentTime() {
                return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            insertMessage(sender, message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${sender.toLowerCase()}`;
                
                const time = this.getCurrentTime();
                const icon = sender === 'Bot' ? '🤖' : '👤';
                const senderName = sender === 'Bot' ? 'Assistant' : 'You';
                
                messageDiv.innerHTML = `
                    <div class="message-header">
                        <span class="message-sender">${icon} ${senderName}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    <div class="message-content">${message}</div>
                `;
                
                this.chatArea.appendChild(messageDiv);
                this.scrollToBottom();
            }

            scrollToBottom() {
                setTimeout(() => {
                    this.chatArea.scrollTo({
                        top: this.chatArea.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100); // Ensures message is fully rendered before scrolling
            }


            createQuickReplies(options) {
                this.quickRepliesContainer.innerHTML = '';
                
                if (!options || options.length === 0) {
                    this.quickReplies.classList.add('hidden');
                    return;
                }

                this.quickReplies.classList.remove('hidden');
                
                options.forEach(option => {
                    const btn = document.createElement('button');
                    btn.className = 'quick-reply-btn';
                    btn.textContent = option;
                    btn.addEventListener('click', () => this.quickReplyClicked(option));
                    this.quickRepliesContainer.appendChild(btn);
                });
            }

            quickReplyClicked(option) {
                this.inputField.value = option;
                this.handleInput();
            }

            showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        🤖 Assistant is typing
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    this.statusText.innerHTML = '';
    this.statusText.appendChild(typingDiv);

    this.scrollToBottom(); // <-- ADD THIS HERE (around line 1692)
}


            hideTypingIndicator() {
                this.statusText.innerHTML = 'Type your message and press Enter or click Send';
            }

            handleInput() {
                if (!this.conversationActive) return;
                
                const userInput = this.inputField.value.trim();
                if (!userInput) return;
                
                this.insertMessage('You', userInput);
                this.inputField.value = '';
                this.createQuickReplies([]);
                this.showTypingIndicator();
                
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.processResponse(userInput.toLowerCase());
                }, 1200);
            }

            isPositive(text) {
                const positive = ["yes", "y", "haan", "ha", "sure", "ok", "okay", "batao", 
                               "tell", "chahiye", "want", "interested", "proceed", "continue", "start"];
                return positive.some(word => text.includes(word));
            }

            isNegative(text) {
                const negative = ["no", "n", "nahi", "nhi", "skip", "later", "not interested", 
                               "maybe later", "cancel", "exit"];
                return negative.some(word => text.includes(word));
            }

            endConversation(message) {
                this.insertMessage('Bot', message);
                this.conversationActive = false;
                this.inputField.disabled = true;
                this.inputField.style.backgroundColor = '#e2e8f0';
                this.sendBtn.disabled = true;
                this.statusText.innerHTML = 'Conversation ended. Thank you!';
                this.statusText.style.color = 'var(--success)';
                this.createQuickReplies([]);
            }

            startConversation() {
                const welcomeMsg = `🎉 Welcome to AIIMS Nursing College!

I'm here to help you with:
✅ Admission requirements
✅ Course information
✅ Fees & scholarships
✅ Facilities & placement

🎯 Ready to start your nursing career journey?`;
                
                setTimeout(() => {
                    this.insertMessage('Bot', welcomeMsg);
                    this.createQuickReplies([
                        "Yes, I'm interested!", 
                        "Tell me about the course", 
                        "Not right now"
                    ]);
                }, 800);
            }

            processResponse(userInput) {
                if (this.step === 0) {
                    if (this.isNegative(userInput)) {
                        const msg = `No worries at all! 😊

Feel free to return anytime you're ready. We're always here to help!

📞 Contact: +91-11-2659-3242
📧 Email: admissions@aiimsnursing.edu.in

Have a great day! 🌟`;
                        this.endConversation(msg);
                    } else {
                        const msg = `Excellent! Let's check your eligibility first. 📋

📚 B.Sc Nursing Requirements:
✅ 12th grade completed
✅ Biology as main subject
✅ Minimum 50% marks
✅ Age: 17-35 years

👨‍🎓 Did you study Biology in your 12th grade?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, I studied Biology",
                            "No, I didn't study Biology",
                            "I'm not sure"
                        ]);
                        this.step = 1;
                    }
                } else if (this.step === 1) {
                    if (this.isPositive(userInput) || userInput.includes("biology") || userInput.includes("studied")) {
                        const msg = `🎉 Perfect! You're eligible for admission!

🏥 B.Sc Nursing Program (4 Years):
• Comprehensive nursing education
• Clinical training in top hospitals
• Professional certification
• Excellent career prospects

📊 Program Stats:
• Duration: 4 years
• Seats Available: 60
• Next Batch: August 2025
• Placement Rate: 95%

What would you like to know more about?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Tell me about fees",
                            "Show facilities",
                            "Admission process"
                        ]);
                        this.step = 2;
                    } else {
                        const msg = `I understand your concern. 📚

Unfortunately, Biology is mandatory for B.Sc Nursing admission. However, you have options:

💡 Alternatives:
• Complete Biology through NIOS (Open School)
• Consider other healthcare programs
• Explore diploma courses first

📞 Our counselors can guide you: +91-11-2659-3242

Would you like information about alternative programs?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, show alternatives",
                            "I'll complete Biology first",
                            "Thank you"
                        ]);
                        this.step = 6;
                    }
                } else if (this.step === 2) {
                    if (userInput.includes("fees") || userInput.includes("cost") || userInput.includes("money")) {
                        const msg = `💰 Complete Fee Structure:

📊 Annual Fees:
• Tuition Fee: ₹75,000
• Lab & Equipment: ₹15,000
• Library Access: ₹5,000
• Registration: ₹5,000
• Total: ₹1,00,000 per year

🏠 Hostel (Optional):
• Room Rent: ₹40,000/year
• Mess Charges: ₹35,000/year

💳 Payment Options:
• Semester-wise payments
• Education loan assistance
• Multiple scholarship options

Want to know about scholarships?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, show scholarships",
                            "Tell me about facilities",
                            "How to apply?"
                        ]);
                        this.step = 3;
                    } else if (userInput.includes("facilities") || userInput.includes("hostel") || userInput.includes("campus")) {
                        const msg = `🏥 World-Class Facilities:

🏠 Hostel Features:
• AC rooms with Wi-Fi
• 24/7 security & CCTV
• Nutritious mess meals
• Recreation & sports facilities
• Dedicated study areas

📚 Academic Infrastructure:
• Modern simulation labs
• Digital library with e-books
• Smart classrooms
• High-tech equipment
• Research facilities

🚌 Additional Amenities:
• College bus service
• Medical facility on campus
• Counseling services
• Career guidance center

Ready to see our fee structure?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, show fees",
                            "Tell me about placements",
                            "How to apply?"
                        ]);
                        this.step = 3;
                    } else {
                        const msg = `📋 Admission Process:

📅 Important Timeline:
• Applications Open: March 1, 2025
• Last Date: May 15, 2025
• Entrance Exam: June 2025
• Results: July 2025
• Classes Begin: August 2025

📝 Required Documents:
• 10th & 12th mark sheets
• Transfer certificate
• Character certificate
• Medical fitness certificate
• ID proof & photos

🎯 Selection Process:
• Written entrance exam
• Personal interview
• Document verification
• Medical checkup

Want to know about the entrance exam?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, tell me about exam",
                            "What about fees?",
                            "Show me facilities"
                        ]);
                        this.step = 4;
                    }
                } else if (this.step === 3) {
                    if (userInput.includes("scholarship")) {
                        const msg = `🎓 Scholarship Opportunities:

💰 Available Scholarships:
• Merit Scholarship: Up to ₹50,000/year
• Need-based Aid: Up to ₹30,000/year
• Government Schemes: ₹20,000-₹40,000
• Minority Scholarships: As per eligibility

📋 Eligibility Criteria:
• Academic Excellence (75%+ marks)
• Family income criteria
• Category-based reservations
• Sports/cultural achievements

🏆 Special Benefits:
• Topper gets full fee waiver
• Research project funding
• International exchange programs

Ready to start your admission process?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, let's start!",
                            "Tell me about placements",
                            "I need more time"
                        ]);
                        this.step = 4;
                    } else if (userInput.includes("placement") || userInput.includes("job") || userInput.includes("career")) {
                        const msg = `📈 Outstanding Placement Record:

🎯 Placement Statistics:
• Placement Rate: 95%
• Average Package: ₹3.5-6 LPA
• Highest Package: ₹8 LPA
• Top Recruiters: AIIMS, Max, Fortis, Apollo

🌟 Career Opportunities:
• Staff Nurse in top hospitals
• Government health services
• International placements (UAE, UK)
• Higher studies (M.Sc Nursing)
• Administrative & teaching roles

🏥 Training Partners:
• AIIMS Delhi
• Safdarjung Hospital
• Max Healthcare
• Fortis Hospital Chain

Ready to begin your journey?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, I want to apply!",
                            "Tell me about scholarships",
                            "How to apply?"
                        ]);
                        this.step = 4;
                    } else {
                        const msg = `Let me help you with the admission process! 🚀

📋 Next Steps:
1. Check eligibility ✅ (You qualify!)
2. Prepare required documents
3. Fill online application
4. Appear for entrance exam
5. Complete admission formalities

🎯 Entrance Exam Details:
• Subjects: Biology, Chemistry, Physics, English, GK
• Duration: 3 hours
• Total Questions: 180
• Exam Mode: Online/Offline

📞 Need assistance?
• Call: +91-11-2659-3242
• Email: admissions@aiimsnursing.edu.in

Ready to get started?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, help me apply!",
                            "Send me application link",
                            "I'll call you"
                        ]);
                        this.step = 5;
                    }
                } else if (this.step === 4) {
                    if (userInput.includes("apply") || userInput.includes("start") || userInput.includes("yes")) {
                        const msg = `🎉 Excellent! Let's get you started!

📝 Application Process:
1. Visit: www.aiimsnursing.edu.in/apply
2. Create account with email/phone
3. Fill application form
4. Upload documents
5. Pay application fee: ₹1,000
6. Submit & print application

🎫 Special Offer:
Use referral code: CHAT2025
(For priority processing)

📞 Immediate Help:
• WhatsApp: +91-98765-43210
• Call: +91-11-2659-3242

Shall I arrange a callback for you?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "Yes, arrange callback",
                            "I'll apply online",
                            "Send me the link"
                        ]);
                        this.step = 5;
                    } else {
                        const msg = `No problem! Take your time. 😊

📋 What We've Covered:
✅ Eligibility confirmed
✅ Course details shared
✅ Fees & scholarships explained
✅ Facilities & placement info
✅ Admission process outlined

📞 When You're Ready:
• Call: +91-11-2659-3242
• Email: admissions@aiimsnursing.edu.in
• Visit: www.aiimsnursing.edu.in

🎯 Remember:
• Applications open March 1, 2025
• 60 seats available
• You meet all requirements!

Is there anything else you'd like to know?`;
                        this.insertMessage('Bot', msg);
                        this.createQuickReplies([
                            "I'm ready to apply now!",
                            "Schedule campus visit",
                            "That's all, thank you!"
                        ]);
                        this.step = 5;
                    }
                } else if (this.step === 5) {
                    if (userInput.includes("callback") || userInput.includes("call")) {
                        const msg = `📞 Callback Arranged Successfully!

✅ What happens next:
• Our admission counselor will call you within 2 hours
• They'll guide you through the entire process
• Help with document preparation
• Assist with online application

📋 Information Shared:
• Your interest in B.Sc Nursing
• Eligibility confirmed
• Preferred contact time: As per your availability

🎯 Meanwhile, you can:
• Visit: www.aiimsnursing.edu.in
• Prepare your documents
• Share with family/friends

Thank you for choosing AIIMS Nursing College! 🌟`;
                        this.endConversation(msg);
                    } else if (userInput.includes("online") || userInput.includes("link")) {
                        const msg = `🌐 Online Application Links:

📝 Direct Application:
🔗 www.aiimsnursing.edu.in/apply

📋 Information Portal:
🔗 www.aiimsnursing.edu.in/admissions

📞 Support:
• Helpline: +91-11-2659-3242
• WhatsApp: +91-98765-43210
• Email: admissions@aiimsnursing.edu.in

🎫 Don't forget:
• Use referral code: CHAT2025
• Keep documents ready
• Application fee: ₹1,000

Best of luck with your application! 🎉`;
                        this.endConversation(msg);
                    } else {
                        const msg = `🙏 Thank you for your interest in AIIMS Nursing College!

📋 Summary:
✅ Eligibility confirmed
✅ Complete information provided
✅ Ready for admission process
✅ All queries addressed

📞 Stay Connected:
• Applications open: March 1, 2025
• Call anytime: +91-11-2659-3242
• Email: admissions@aiimsnursing.edu.in
• Website: www.aiimsnursing.edu.in

🎯 We look forward to welcoming you to our nursing family!

Have a wonderful day! 🌟`;
                        this.endConversation(msg);
                    }
                } else if (this.step === 6) {
                    const msg = `Thank you for your interest! 🙏

📚 Alternative Options:
• Complete Biology through NIOS
• Diploma in Nursing (1 year)
• Healthcare Management courses
• Medical Laboratory Technology

📞 Our counselors can guide you:
• Call: +91-11-2659-3242
• Email: info@aiimsnursing.edu.in

🎯 Come back once you complete Biology - we'll be here to help!

Best wishes for your educational journey! 🌟`;
                    this.endConversation(msg);
                }
            }
        }

        // Initialize the bot when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new ModernNursingBot();
        });