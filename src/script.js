/**
 * Academic Timetable 2018
 * Vanilla JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const gradeSelect = document.getElementById('grade-select');
    const sectionSelect = document.getElementById('section-select');
    const timetableContainer = document.getElementById('timetable-container');
    const welcomeMessage = document.getElementById('welcome-message');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const timetableBody = document.getElementById('timetable-body');
    const mobileCards = document.getElementById('mobile-cards');
    const displayTitle = document.getElementById('display-title');
    const printBtn = document.getElementById('print-btn');

    let scheduleData = null;

    // Sections mapping
    const sectionsByGrade = {
        '11': ['A', 'B', 'C', 'D', 'E'],
        '12': ['A', 'B', 'C', 'D', 'E', 'F']
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Load JSON data
    async function loadSchedule() {
        showLoading(true);
        try {
            const response = await fetch('/src/schedule.json');
            if (!response.ok) throw new Error('Failed to load schedule');
            scheduleData = await response.json();
        } catch (error) {
            console.error(error);
            showError(true);
        } finally {
            showLoading(false);
        }
    }

    // Handle Grade Selection
    gradeSelect.addEventListener('change', (e) => {
        const grade = e.target.value;
        updateSectionOptions(grade);
        resetTimetable();
    });

    // Handle Section Selection
    sectionSelect.addEventListener('change', (e) => {
        const grade = gradeSelect.value;
        const section = e.target.value;
        const fullSectionKey = grade + section;

        if (scheduleData && scheduleData[fullSectionKey]) {
            renderTimetable(fullSectionKey, scheduleData[fullSectionKey]);
        } else {
            showError(true);
        }
    });

    // Update Section Dropdown
    function updateSectionOptions(grade) {
        sectionSelect.innerHTML = '<option value="" disabled selected>Choose Section</option>';
        if (sectionsByGrade[grade]) {
            sectionsByGrade[grade].forEach(sec => {
                const option = document.createElement('option');
                option.value = sec;
                option.textContent = `Section ${grade}${sec}`;
                sectionSelect.appendChild(option);
            });
            sectionSelect.disabled = false;
        } else {
            sectionSelect.disabled = true;
        }
    }

    // Render the Timetable
    function renderTimetable(sectionKey, data) {
        timetableBody.innerHTML = '';
        mobileCards.innerHTML = '';
        displayTitle.textContent = `Timetable for Section ${sectionKey}`;

        // Desktop Table Rows (Periods as rows, Days as columns)
        const numPeriods = 6;
        for (let p = 0; p < numPeriods; p++) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>Period ${p + 1}</td>`;
            days.forEach(day => {
                const periods = data[day] || [];
                const subject = periods[p] || '-';
                const td = document.createElement('td');
                td.className = 'subject-cell';
                td.textContent = subject;
                row.appendChild(td);
            });
            timetableBody.appendChild(row);
        }

        // Mobile Cards (Keep day-based for vertical stacking on mobile)
        days.forEach(day => {
            const periods = data[day] || [];

            const card = document.createElement('div');
            card.className = 'day-card';

            let periodItemsHtml = '';
            periods.forEach((subject, index) => {
                periodItemsHtml += `
                    <div class="period-item">
                        <span class="period-label">Period ${index + 1}</span>
                        <span class="period-subject">${subject}</span>
                    </div>
                `;
            });

            card.innerHTML = `
                <div class="day-card-header">${day}</div>
                <div class="period-list">
                    ${periodItemsHtml}
                </div>
            `;
            mobileCards.appendChild(card);
        });

        welcomeMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        timetableContainer.classList.remove('hidden');
    }

    // UI Helpers
    function showLoading(show) {
        if (show) {
            loadingIndicator.classList.remove('hidden');
            welcomeMessage.classList.add('hidden');
            timetableContainer.classList.add('hidden');
        } else {
            loadingIndicator.classList.add('hidden');
        }
    }

    function showError(show) {
        if (show) {
            errorMessage.classList.remove('hidden');
            timetableContainer.classList.add('hidden');
            welcomeMessage.classList.add('hidden');
        } else {
            errorMessage.classList.add('hidden');
        }
    }

    function resetTimetable() {
        timetableContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
        welcomeMessage.classList.remove('hidden');
    }

    // Print functionality
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Footer Year
    const footerText = document.querySelector('footer p');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.innerHTML = `&copy; ${currentYear} Developed by <a href="profile.html" style="color: inherit; text-decoration: none; font-weight: 600;">HAWI JEMAL</a>. - Timetable`;
    }

    // --- Daily Inspiration Logic ---
    const inspirationContent = document.getElementById('inspiration-content');

    // SECURITY NOTE: In a real production environment, NEVER expose your API key in client-side JavaScript.
    // This should ideally be called through a secure backend proxy to protect your API quota and billing.
    const GEMINI_API_KEY = 'AIzaSyBTfJ-LfaNU3Naz6Uhc9EYoEPJEcxo6sMw';

    // Fallback quotes if the API fails or is unavailable
    const fallbackQuotes = [
        "Every day is a fresh opportunity to learn something new.",
        "Small steps every day lead to big results.",
        "Your attitude determines your direction. Keep it positive!",
        "Focus on your goals and the path will become clear.",
        "Mistakes are proof that you are trying and learning.",
        "Believe in your potential to achieve great things today."
    ];

    async function loadDailyInspiration() {
        if (!inspirationContent) return;

        try {
            // 2. Exact prompt enforcing all business rules
            const prompt = "Generate ONE short inspirational message for school students. 15-30 words only. Simple English. School-related encouragement only. No emojis. No hashtags. No quotes from famous people. No politics. No religion. No mental health advice. No medical advice. No controversial topics. Positive and motivational tone. Output only the message text.";

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7 }
                })
            });

            if (!response.ok) throw new Error('API request failed');

            const data = await response.json();

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                let message = data.candidates[0].content.parts[0].text.trim();
                message = message.replace(/^["']|["']$/g, ''); // Safety cleanup

                // 3. Display the valid message directly
                displayInspiration(message);
            } else {
                throw new Error('Unexpected API response format');
            }
        } catch (error) {
            console.error('Failed to load inspiration from Gemini:', error);
            // 4. Fallback behavior (static quote)
            const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            displayInspiration(randomFallback);
        }
    }

    function displayInspiration(text) {
        inspirationContent.style.opacity = '0';
        setTimeout(() => {
            inspirationContent.innerHTML = `<p>"${text}"</p>`;
            inspirationContent.style.opacity = '1';
        }, 300);
    }

    // Initial load calls
    loadDailyInspiration();
    loadSchedule();
});
