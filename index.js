document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Add skill category toggle functionality
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        category.querySelector('.skill-category-header').addEventListener('click', () => {
            category.classList.toggle('active');
        });
    });

    // Terminal typing effect
    const typeWriter = (text, element, speed = 50) => {
        let i = 0;
        element.innerHTML = '';
        const typing = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    };

    // Apply typing effect to elements with typewriter class
    document.querySelectorAll('.typewriter').forEach(element => {
        const text = element.textContent;
        typeWriter(text, element);
    });

    // Matrix rain effect
    const createMatrixRain = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const chars = '01';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);
    };

    createMatrixRain();

    const terminalCommands = {
        currentDir: '~',
        history: [],
        historyIndex: -1,
        
        data: {
            'skills/cybersec': [
                "GRC Fundamentals",
                "Penetration Testing",
                "Vulnerability Management (Nessus, WPS scan)",
                "Threat Hunting (Redline, Mandiant IOCe)",
                "Burp Suite",
                "Nmap",
                "Metasploit",
                "OWASP Top 10",
                "Web Application Security"
            ],
            'skills/programming': [
                "HTML/CSS/JavaScript",
                "Flutter/Dart",
                "Firebase",
                "React",
                "Python",
                "Bash",
                "PowerShell"
            ],
            'skills/os': [
                "Kali Linux",
                "Windows",
                "Ubuntu",
                "ParrotOS"
            ],
            'skills/other': [
                "Git bash",
                "GitHub"
            ],
            'skills/soft': [
                "Problem Solver",
                "Team Player",
                "Good Interpersonal Skills"
            ]
        },

        getPrompt() {
            return `root@kali:${this.currentDir}# `;
        },
        
        handleCommand(cmd) {
            if (!cmd) return '';
            this.history.push(cmd);
            this.historyIndex = this.history.length;
            
            const args = cmd.split(' ');
            const command = args[0].toLowerCase();
            
            switch(command) {
                case 'clear':
                    document.querySelector('.terminal-content').innerHTML = '';
                    return '';
                case 'whoami':
                    return 'root';
                case 'pwd':
                    return `/root${this.currentDir}`;
                case 'cd':
                    const newDir = args[1] || '~';
                    if (newDir === 'skills' || newDir.startsWith('skills/')) {
                        this.currentDir = newDir;
                        return '';
                    }
                    return 'bash: cd: No such directory';
                case 'ls':
                    if (this.currentDir === '~') {
                        return 'skills/  projects/  certifications/  contact\n';
                    }
                    if (this.currentDir === 'skills') {
                        return 'cybersec  programming  os  other  soft\n';
                    }
                    return 'No such directory';
                case 'cat':
                    const path = args[1];
                    return this.data[path] ? this.data[path].join('\n') : `cat: ${path}: No such file or directory`;
                case 'help':
                    return 'Available commands:\nwhoami\npwd\ncd\nls\ncat <filename>\nclear\nhelp';
                default:
                    return `bash: ${command}: command not found`;
            }
        }
    };

    const createTerminal = () => {
        const terminal = document.querySelector('.terminal-prompt');
        const toggle = document.querySelector('.terminal-toggle');
        
        terminal.innerHTML = `
            <div class="terminal-header">
                <div class="terminal-controls">
                    <span class="terminal-close"></span>
                    <span class="terminal-minimize"></span>
                    <span class="terminal-maximize"></span>
                </div>
                <div class="terminal-title">root@kali</div>
            </div>
            <div class="terminal-content"></div>
        `;

        toggle.addEventListener('click', () => {
            terminal.style.display = terminal.style.display === 'none' ? 'block' : 'none';
            if (terminal.style.display === 'block') {
                terminal.querySelector('.terminal-input')?.focus();
            }
        });

        const createNewPrompt = () => {
            const line = document.createElement('div');
            line.className = 'terminal-input-line';
            line.innerHTML = `
                <span class="terminal-prompt-text">${terminalCommands.getPrompt()}</span>
                <input type="text" class="terminal-input" autocomplete="off" spellcheck="false">
            `;
            return line;
        };

        const content = terminal.querySelector('.terminal-content');
        content.appendChild(createNewPrompt());

        document.addEventListener('keydown', (e) => {
            if (!terminal.contains(e.target)) return;
            const input = terminal.querySelector('.terminal-input');
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (terminalCommands.historyIndex > 0) {
                    terminalCommands.historyIndex--;
                    input.value = terminalCommands.history[terminalCommands.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (terminalCommands.historyIndex < terminalCommands.history.length - 1) {
                    terminalCommands.historyIndex++;
                    input.value = terminalCommands.history[terminalCommands.historyIndex];
                } else {
                    terminalCommands.historyIndex = terminalCommands.history.length;
                    input.value = '';
                }
            }
        });

        terminal.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const input = terminal.querySelector('.terminal-input');
                const cmd = input.value;

                const result = terminalCommands.handleCommand(cmd);
                if (result) {
                    const resultLine = document.createElement('div');
                    resultLine.className = 'terminal-output-line';
                    resultLine.textContent = result;
                    content.appendChild(resultLine);
                }

                const newPrompt = createNewPrompt();
                content.appendChild(newPrompt);
                newPrompt.querySelector('.terminal-input').focus();
                content.scrollTop = content.scrollHeight;
                input.remove();
            }
        });
    };

    createTerminal();

    // Lightbox functionality
    const createLightbox = () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-nav lightbox-prev">&lt;</button>
                <button class="lightbox-nav lightbox-next">&gt;</button>
                <img class="lightbox-image" src="" alt="Fullsize Image">
            </div>
        `;
        document.body.appendChild(lightbox);

        let currentImageIndex = 0;
        let currentGalleryImages = [];

        const showImage = (index) => {
            const img = currentGalleryImages[index];
            const lightboxImg = lightbox.querySelector('.lightbox-image');
            lightboxImg.src = img.src;
            currentImageIndex = index;
        };

        document.addEventListener('click', (e) => {
            const clickedImage = e.target.closest('.gallery-image, .cert-image');
            if (clickedImage) {
                const gallery = clickedImage.closest('.image-gallery');
                if (gallery) {
                    currentGalleryImages = Array.from(gallery.querySelectorAll('img'));
                } else {
                    currentGalleryImages = [clickedImage];
                }
                currentImageIndex = currentGalleryImages.indexOf(clickedImage);
                showImage(currentImageIndex);
                lightbox.classList.add('active');
            }
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            if (currentImageIndex > 0) {
                showImage(currentImageIndex - 1);
            }
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            if (currentImageIndex < currentGalleryImages.length - 1) {
                showImage(currentImageIndex + 1);
            }
        });

        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    };

    createLightbox();
});
