document.addEventListener('DOMContentLoaded', () => {
    // 1. Gemini AI Syllabus Matcher Interaction
    const geminiActionButton = document.querySelector('.gemini-action-btn');
    
    if (geminiActionButton) {
        geminiActionButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Gemini AI Syllabus Matcher running...');
            alert('Gemini AI Analysis: Uploading your profile and running advanced job-matching algorithm. Results will appear in My Applications soon!');
        });
    }

    // 2. Chatbot Interaction (Simulated - Enhanced for Gemini)
    const chatbotWidget = document.querySelector('.chatbot-widget');
    
    chatbotWidget.addEventListener('click', (e) => {
        e.preventDefault(); 
        console.log('SarkarAI Chatbot (Powered by Gemini) initialized.');
        // Using a non-blocking alert for demonstration
        alert('SarkarAI (Powered by Gemini): Hello! Ask me anything about eligibility, syllabus comparison, or form queries. I can access all job data!');
    });

    // 3. File Upload/Drag and Drop Logic (No change from your original code, kept for completeness)
    const uploadBox = document.querySelector('.upload-box');
    const uploadText = document.querySelector('.upload-text');

    // Simulate file input click when the box is clicked (excluding the button)
    uploadBox.addEventListener('click', (e) => {
        if (e.target.closest('.apply-now-btn')) {
            console.log('Apply Now button clicked.');
            return;
        }
        console.log('Opening file explorer...');
        alert('Opening file explorer to upload documents...');
    });

    // Drag over effect (Visual feedback)
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#00b4d8';
        uploadText.textContent = 'Drop your Dtp file here!';
    });

    // Drag leave effect (Visual feedback reset)
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.borderColor = '#ccc';
        uploadText.textContent = 'Upload or drop Dtp';
    });

    // Drop handler (Simulated processing)
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#ccc';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            console.log(`File dropped: ${files[0].name}.`);
            uploadText.textContent = `File: ${files[0].name} (Ready!)`;
            alert(`File dropped: ${files[0].name}. Uploading started.`);
        } else {
            uploadText.textContent = 'Upload failed. Try again.';
        }
    });

    // 4. Status Button Hover (UX Improvement - No change)
    document.querySelectorAll('.app-actions button').forEach(button => {
        // Only apply to the "Save Job" button for the specific visual effect
        if (button.classList.contains('save-btn')) {
            const originalText = button.textContent;
            button.addEventListener('mouseover', () => {
                button.textContent = 'Click to Save!';
            });
            button.addEventListener('mouseout', () => {
                button.textContent = originalText;
            });
        }
    });
    
    // 5. Job Card Click Handler (No change)
    document.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('click', () => {
            const jobTitleElement = card.querySelector('h3');
            if (jobTitleElement) {
                const jobTitle = jobTitleElement.textContent;
                console.log(`Navigating to details for: ${jobTitle}`);
            }
        });
    });
});