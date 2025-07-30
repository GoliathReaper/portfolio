// Portfolio Website JavaScript

let openTabs = ['about.js'];
let activeTab = 'about.js';

// Toggle folder expansion
function toggleFolder(folderId) {
    const content = document.getElementById(`${folderId}-content`);
    const icon = document.getElementById(`${folderId}-icon`);
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        icon.style.transform = 'rotate(90deg)';
    } else {
        content.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
}

// Open file in editor
function openFile(fileName) {
    // Add to open tabs if not already open
    if (!openTabs.includes(fileName)) {
        openTabs.push(fileName);
        createTab(fileName);
    }
    
    // Switch to the file
    switchToFile(fileName);
    
    // Close sidebar on mobile
    closeMobileSidebar();
}

// Create a new tab
function createTab(fileName) {
    const tabsContainer = document.getElementById('tabs-container');
    const tabElement = document.createElement('div');
    tabElement.className = 'tab flex items-center px-4 py-2 bg-editor-tab border-r border-editor-border cursor-pointer hover:bg-editor-active transition-colors';
    tabElement.setAttribute('data-file', fileName);
    tabElement.innerHTML = `
        <span class="text-sm">${fileName}</span>
        <button class="ml-2 hover:bg-editor-border rounded p-1" onclick="closeTab(event, '${fileName}')">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 7.293l2.146-2.147a.5.5 0 0 1 .708.708L8.707 8l2.147 2.146a.5.5 0 0 1-.708.708L8 8.707l-2.146 2.147a.5.5 0 0 1-.708-.708L7.293 8 5.146 5.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
            </svg>
        </button>
    `;
    
    tabElement.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'svg' && e.target.tagName !== 'path') {
            switchToFile(fileName);
        }
    });
    
    tabsContainer.appendChild(tabElement);
}

// Switch to a file
function switchToFile(fileName) {
    activeTab = fileName;
    
    // Update tab appearance
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab', 'bg-editor-active');
        tab.classList.add('bg-editor-tab');
    });
    
    const activeTabElement = document.querySelector(`[data-file="${fileName}"]`);
    if (activeTabElement) {
        activeTabElement.classList.add('active-tab', 'bg-editor-active');
        activeTabElement.classList.remove('bg-editor-tab');
    }
    
    // Show/hide file content
    document.querySelectorAll('.file-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const fileContent = document.getElementById(fileName);
    if (fileContent) {
        fileContent.classList.remove('hidden');
    }
    
    // Update status bar
    updateStatusBar(fileName);
}

// Close a tab
function closeTab(event, fileName) {
    event.stopPropagation();
    
    // Remove from open tabs
    openTabs = openTabs.filter(tab => tab !== fileName);
    
    // Remove tab element
    const tabElement = document.querySelector(`[data-file="${fileName}"]`);
    if (tabElement) {
        tabElement.remove();
    }
    
    // If this was the active tab, switch to another tab
    if (activeTab === fileName) {
        if (openTabs.length > 0) {
            switchToFile(openTabs[openTabs.length - 1]);
        } else {
            // No tabs open, show welcome screen or default
            document.querySelectorAll('.file-content').forEach(content => {
                content.classList.add('hidden');
            });
        }
    }
}

// Update status bar
function updateStatusBar(fileName) {
    const statusBar = document.querySelector('.bg-editor-accent');
    const fileTypes = {
        'about.js': 'JavaScript',
        'projects.json': 'JSON',
        'skills.py': 'Python',
        'contact.md': 'Markdown'
    };
    
    const fileType = fileTypes[fileName] || 'Text';
    statusBar.innerHTML = `
        <div class="flex items-center space-x-4">
            <span>📍 Line 1, Column 1</span>
            <span>UTF-8</span>
            <span>${fileType}</span>
        </div>
        <div class="flex items-center space-x-4">
            <span>🔄 Git: main</span>
            <span>✓ All changes saved</span>
        </div>
    `;
}

// Mobile sidebar toggle
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isOpen = sidebar.classList.contains('mobile-open');
    
    if (isOpen) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
}

function openMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('mobile-open');
    sidebar.style.width = '256px';
    sidebar.style.overflow = 'visible';
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('mobile-open');
    if (window.innerWidth < 768) {
        sidebar.style.width = '0';
        sidebar.style.overflow = 'hidden';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up mobile sidebar toggle
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', toggleMobileSidebar);
    }
    
    // Initialize with portfolio folder open
    toggleFolder('portfolio');
    
    // Set initial status
    updateStatusBar('about.js');
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            const sidebar = document.getElementById('sidebar');
            sidebar.style.width = '';
            sidebar.style.overflow = '';
        }
    });
    
    // Add file selection highlighting
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all file items
            document.querySelectorAll('.file-item').forEach(f => f.classList.remove('bg-editor-active'));
            // Add active class to clicked item
            this.classList.add('bg-editor-active');
        });
    });
    
    // Set initial active file
    document.querySelector('.file-item').classList.add('bg-editor-active');
});

// Add some dynamic line numbers based on content
function updateLineNumbers() {
    document.querySelectorAll('.file-content').forEach(content => {
        const lineNumbersContainer = content.querySelector('.line-numbers');
        const preElement = content.querySelector('pre');
        
        if (lineNumbersContainer && preElement) {
            const lines = preElement.textContent.split('\n').length;
            let numbers = '';
            for (let i = 1; i <= lines; i++) {
                numbers += i + '<br>';
            }
            lineNumbersContainer.innerHTML = numbers;
        }
    });
}

// Update line numbers on load
document.addEventListener('DOMContentLoaded', updateLineNumbers);

// Add typing animation for a more authentic feel
function addTypingEffect() {
    const codeElements = document.querySelectorAll('pre');
    
    codeElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'subtle-glow 2s ease-in-out infinite alternate';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
}

// Add CSS animation for glow effect
const style = document.createElement('style');
style.textContent = `
    @keyframes subtle-glow {
        from { box-shadow: 0 0 5px rgba(0, 122, 204, 0.1); }
        to { box-shadow: 0 0 10px rgba(0, 122, 204, 0.2); }
    }
    
    .tab {
        transition: all 0.2s ease;
    }
    
    .tab:hover {
        background-color: #2d2d30;
    }
    
    .file-item:hover, .folder-item:hover {
        background-color: #2d2d30;
    }
    
    .active-tab {
        position: relative;
    }
    
    .active-tab::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #007acc;
    }
`;

document.head.appendChild(style);

// Initialize typing effect
document.addEventListener('DOMContentLoaded', addTypingEffect);