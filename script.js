document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    if(cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // --- 2. Loader Sequence ---
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const floatingPlayer = document.getElementById('floating-music-player');

    setTimeout(() => {
        if(loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                if(mainContent) mainContent.classList.remove('hidden');
                
                // Show Floating Player & Hero Animations
                setTimeout(() => {
                    if(floatingPlayer) {
                        floatingPlayer.style.opacity = '1';
                        floatingPlayer.style.transform = 'translateY(0)';
                    }
                    document.querySelectorAll('#hero-section .fade-up, #hero-section .slide-up, #hero-section .fade-up-seq').forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('visible');
                        }, index * 200);
                    });
                }, 100);

                // Start generating particles & sprinkles
                createBackgroundParticles();
                createSprinkles();
            }, 800);
        }
    }, 2500);

    // --- 2.5 Hero Parallax (Realistic Live Effect) ---
    const heroContent = document.querySelector('.hero-content');
    const heroShapes = document.querySelectorAll('.hero-bg-shapes .shape');
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 30;
        const y = (window.innerHeight / 2 - e.pageY) / 30;
        if(heroContent) heroContent.style.transform = `translate(${x}px, ${y}px)`;
        heroShapes.forEach((shape, index) => {
            const factor = (index + 1) * 2;
            shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });

    // --- 3. Floating Vinyl Music Player ---
    const musicPlayer = document.getElementById('floating-music-player');
    const bgMusic = document.getElementById('bg-music');
    const vinyl = document.querySelector('.vinyl-record');
    const playerText = musicPlayer ? musicPlayer.querySelector('span:nth-child(2)') : null;
    let isPlaying = false;

    if(musicPlayer && bgMusic) {
        musicPlayer.addEventListener('click', () => {
            if(isPlaying) {
                bgMusic.pause();
                if(vinyl) vinyl.classList.remove('spinning');
                if(playerText) playerText.innerText = 'Play Magic';
            } else {
                bgMusic.play().catch(e => console.log('Audio error:', e));
                if(vinyl) vinyl.classList.add('spinning');
                if(playerText) playerText.innerText = 'Pause Magic';
            }
            isPlaying = !isPlaying;
        });
    }

    // --- 4. Hero Scroll Down ---
    const scrollDownBtn = document.getElementById('scroll-down-btn');
    const bentoSection = document.getElementById('bento-section');
    if(scrollDownBtn && bentoSection) {
        scrollDownBtn.addEventListener('click', () => {
            bentoSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 5. Circular Progress Observer ---
    const progressRings = document.querySelectorAll('.progress-ring');
    const bentoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                // Find progress ring inside
                const circle = entry.target.querySelector('.progress-ring');
                if(circle) {
                    const percent = entry.target.getAttribute('data-percentage');
                    const radius = circle.r.baseVal.value;
                    const circumference = radius * 2 * Math.PI;
                    circle.style.strokeDasharray = `${circumference} ${circumference}`;
                    
                    const offset = circumference - (percent / 100) * circumference;
                    circle.style.strokeDashoffset = offset;
                }
                bentoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.circular-progress').forEach(el => bentoObserver.observe(el));

    // --- 5.5 Countdown Timer ---
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');
    
    if(cdDays && cdHours && cdMinutes && cdSeconds) {
        function updateTimer() {
            const now = new Date();
            let targetDate = new Date(now.getFullYear(), 4, 27); // Month is 0-indexed, so 4 is May
            
            if(now > targetDate) {
                targetDate.setFullYear(now.getFullYear() + 1);
            }
            
            const diff = targetDate - now;
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);
            
            cdDays.innerText = d.toString().padStart(2, '0');
            cdHours.innerText = h.toString().padStart(2, '0');
            cdMinutes.innerText = m.toString().padStart(2, '0');
            cdSeconds.innerText = s.toString().padStart(2, '0');
        }
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // --- 6. Story & Media Section (Fade Up) ---
    const fadeElements = document.querySelectorAll('.story-text, .media-card, .polaroid-card, .floating-card, .timeline-item, .generator-card, .chat-container, .voice-message-bubble, .memory-buttons, .cake-container');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- 7. Premium Envelope ---
    const envelope = document.getElementById('premium-envelope');
    if(envelope) {
        envelope.addEventListener('click', () => {
            if(!envelope.classList.contains('open')){
                envelope.classList.add('open');
            } else {
                // Scroll to finale
                document.getElementById('finale-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 8. Starry Night Finale Observer ---
    const finaleSection = document.getElementById('finale-section');
    const finaleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting && entry.intersectionRatio > 0.5) {
                // Trigger Dark Mode
                document.body.classList.add('dark-mode');
                
                if(musicPlayer) {
                    musicPlayer.style.background = 'rgba(20,20,20,0.5)';
                    musicPlayer.style.border = '1px solid rgba(255,255,255,0.2)';
                }
            } else {
                // Revert if scrolled up
                document.body.classList.remove('dark-mode');
                if(musicPlayer) {
                    musicPlayer.style.background = 'rgba(255,255,255,0.7)';
                    musicPlayer.style.border = '2px solid white';
                }
            }
        });
    }, { threshold: 0.5 });
    
    if(finaleSection) finaleObserver.observe(finaleSection);

    // --- 9. Ignite the Sky (Confetti & Credits) ---
    const igniteBtn = document.getElementById('ignite-btn');
    const finalSignature = document.querySelector('.final-signature');
    const endCredits = document.querySelector('.end-credits');
    
    if(igniteBtn) {
        igniteBtn.addEventListener('click', () => {
            // Keep button but change text to allow re-igniting
            igniteBtn.innerText = "Pop More Magic ✨";
            if(finalSignature) finalSignature.classList.add('show');
            if(endCredits) {
                setTimeout(() => endCredits.classList.add('show'), 3000);
            }
            fireConfetti();
            fireImageConfetti();
        });
    }

    // --- 9.5 Camera Flash Utility ---
    function triggerCameraFlash() {
        const flash = document.getElementById('camera-flash');
        if(flash) {
            flash.classList.add('flash-active');
            setTimeout(() => flash.classList.remove('flash-active'), 100);
        }
    }

    // --- 9.6 Choose Memory Buttons ---
    const memoryBtns = document.querySelectorAll('.memory-btn');
    const mediaSection = document.getElementById('media-section');
    memoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            triggerCameraFlash();
            if(mediaSection) {
                setTimeout(() => {
                    mediaSection.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        });
    });

    // --- 9.7 Voice Message Player ---
    const voiceBubble = document.querySelector('.voice-message-bubble');
    const voiceAudio = document.getElementById('voice-audio');
    const voiceText = document.querySelector('.voice-text');
    let isVoicePlaying = false;
    
    if(voiceBubble && voiceAudio) {
        voiceBubble.addEventListener('click', () => {
            if(isVoicePlaying) {
                voiceAudio.pause();
                voiceBubble.classList.remove('playing');
                if(voiceText) voiceText.innerText = "tap to hear something 💌";
            } else {
                voiceAudio.play().catch(e => console.log('Audio error:', e));
                voiceBubble.classList.add('playing');
                if(voiceText) voiceText.innerText = "playing...";
            }
            isVoicePlaying = !isVoicePlaying;
        });
        voiceAudio.addEventListener('ended', () => {
            isVoicePlaying = false;
            voiceBubble.classList.remove('playing');
            if(voiceText) voiceText.innerText = "tap to hear something 💌";
        });
    }

    // --- 9.8 Compliment Generator ---
    const generateBtn = document.getElementById('generate-fact-btn');
    const factDisplay = document.getElementById('fact-display');
    const jadooFacts = [
        "Universe's favorite ✨",
        "Certified comfort person 💖",
        "Too cute for legal limits 🥺",
        "Professional overthinker 🧠",
        "Emotional support human 🌷",
        "Certified chaos generator 🌪️",
        "Looks cute even when mad 😠",
        "100% Alien energy 👽"
    ];
    
    if(generateBtn && factDisplay) {
        generateBtn.addEventListener('click', () => {
            generateBtn.innerText = "Another one! ✨";
            factDisplay.classList.remove('hidden');
            
            // Animation reset trick
            factDisplay.style.animation = 'none';
            factDisplay.offsetHeight; /* trigger reflow */
            factDisplay.style.animation = null;
            
            const randomFact = jadooFacts[Math.floor(Math.random() * jadooFacts.length)];
            factDisplay.innerText = randomFact;
        });
    }

    // --- 9.9 Video Modal ---
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalClose = document.querySelector('.modal-close');
    
    videoThumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const videoSrc = thumb.getAttribute('data-video');
            if(videoSrc && videoModal && modalVideo) {
                modalVideo.src = videoSrc;
                videoModal.classList.remove('hidden');
                modalVideo.play().catch(e => console.log(e));
            }
        });
    });
    
    if(modalClose && videoModal && modalVideo) {
        const closeModal = () => {
            videoModal.classList.add('hidden');
            modalVideo.pause();
            modalVideo.currentTime = 0;
        };
        modalClose.addEventListener('click', closeModal);
        videoModal.addEventListener('click', (e) => {
            if(e.target === videoModal) closeModal();
        });
    }

    function fireImageConfetti() {
        const photoUrls = [
            './WhatsApp Image 2026-05-10 at 2.02.32 PM.jpeg',
            './WhatsApp Image 2026-05-10 at 2.02.33 PM (2).jpeg',
            './WhatsApp Image 2026-05-10 at 2.02.34 PM.jpeg',
            './WhatsApp Image 2026-05-10 at 2.03.50 PM.jpeg',
            './jadoob.jpeg',
            './jadoo.jpeg',
            './jadoo mummy.jpeg',
            './jadoomar.jpeg',
        ];
        
        for (let i = 0; i < 20; i++) {
            const img = document.createElement('img');
            img.src = photoUrls[Math.floor(Math.random() * photoUrls.length)];
            img.classList.add('confetti-img');
            
            // Random trajectory
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 500 + 200; // Fly out distance
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            const rot = Math.random() * 360 - 180;
            const duration = Math.random() * 2 + 2; // 2 to 4 seconds
            
            img.style.setProperty('--tx', `${tx}px`);
            img.style.setProperty('--ty', `${ty}px`);
            img.style.setProperty('--rot', `${rot}deg`);
            img.style.setProperty('--duration', `${duration}s`);
            
            document.body.appendChild(img);
            
            setTimeout(() => {
                if (img.parentNode) img.remove();
            }, duration * 1000);
        }
    }

    function fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ffb7b2', '#e6e6fa', '#ffdac1', '#c7ceea', '#a1c4fd', '#ffffff', '#ffd700'];

        for (let i = 0; i < 200; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height,
                r: Math.random() * 6 + 2,
                dx: Math.random() * 14 - 7,
                dy: Math.random() * -20 - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncrement: (Math.random() * 0.07) + 0.05,
                tiltAngle: 0
            });
        }

        let animationFrame;
        function animate() {
            animationFrame = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.tiltAngle += p.tiltAngleIncrement;
                p.y += (Math.cos(p.tiltAngle) + p.dy + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle) * 2;
                p.dy += 0.05; // gravity
                
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                ctx.stroke();
            });
        }
        animate();

        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 10000);
    }

    // --- 10. Background Particles ---
    function createBackgroundParticles() {
        const container = document.getElementById('particle-container');
        if(!container) return;
        
        const icons = ['✨', '🌸', '💖', '💫'];
        setInterval(() => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.innerText = icons[Math.floor(Math.random() * icons.length)];
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.setProperty('--duration', (Math.random() * 5 + 5) + 's');
            container.appendChild(particle);
            
            setTimeout(() => {
                if(container.contains(particle)) particle.remove();
            }, 10000);
        }, 1000);
    }

    // --- 11. Magical Sprinkles Generator (Enhanced Shower) ---
    function createSprinkles() {
        const showerIcons = ['✨', '🌟', '💖', '🎈', '☁️'];
        setInterval(() => {
            const sprinkle = document.createElement('div');
            sprinkle.classList.add('sprinkle');
            
            if(Math.random() > 0.4) {
                // Colored dot
                const size = Math.random() * 4 + 2;
                sprinkle.style.width = `${size}px`;
                sprinkle.style.height = `${size}px`;
                sprinkle.style.background = Math.random() > 0.5 ? '#fff' : '#ffb7b2';
            } else {
                // Emoji shower
                sprinkle.innerText = showerIcons[Math.floor(Math.random() * showerIcons.length)];
                sprinkle.style.fontSize = (Math.random() * 15 + 10) + 'px';
                sprinkle.style.background = 'transparent';
                sprinkle.style.boxShadow = 'none';
            }
            
            // Random horizontal position
            sprinkle.style.left = Math.random() * 100 + 'vw';
            
            // Random duration between 3s and 8s
            sprinkle.style.animationDuration = (Math.random() * 5 + 3) + 's';
            
            // Randomly color them pink or white
            sprinkle.style.background = Math.random() > 0.5 ? '#fff' : '#ffb7b2';
            
            document.body.appendChild(sprinkle);
            
            // Remove after falling
            setTimeout(() => {
                sprinkle.remove();
            }, 8000);
        }, 150); // Increased shower frequency
    }

    // --- 12. Cake Celebration Logic ---
    const blowBtn = document.getElementById('blow-candle-btn');
    const flame = document.getElementById('candle-flame');
    const smoke = document.getElementById('candle-smoke');
    const wishText = document.getElementById('wish-text');
    const cakeContainer = document.querySelector('.cake-container');
    const cake = document.getElementById('bday-cake');
    
    const randomWishes = [
        "Happy Birthday!! May all your wishes come true ✨💖",
        "+100 happiness unlocked ✨",
        "Birthday magic successfully activated 💖",
        "Universe sending extra love today 🌸",
        "Certified cutest human alive 🎂",
        "Main character energy detected ✨",
        "Today feels softer because of you 💫"
    ];

    if(blowBtn && flame && wishText) {
        blowBtn.addEventListener('click', () => {
            // Fix animation overriding opacity by setting display to none
            flame.style.animation = 'none';
            flame.style.display = 'none';
            
            if(smoke) {
                smoke.classList.remove('hidden');
                setTimeout(() => smoke.classList.add('hidden'), 3000);
            }
            
            if(cake) {
                cake.style.transform = 'scale(1.05)';
                setTimeout(() => cake.style.transform = 'scale(1)', 200);
            }
            
            const randomWish = randomWishes[Math.floor(Math.random() * randomWishes.length)];
            wishText.innerText = randomWish;
            
            wishText.classList.remove('hidden');
            wishText.classList.add('visible');
            blowBtn.innerText = "Yay! 🥳";
            fireConfetti(); 
            
            triggerMemoryExplosion(cakeContainer);
        });
    }

    function triggerMemoryExplosion(container) {
        if(!container) return;
        const memoryIcons = ['✨', '💖', '🌸', '🎈', '⭐', '🎀'];
        for(let i=0; i<15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('memory-particle');
            particle.innerText = memoryIcons[Math.floor(Math.random() * memoryIcons.length)];
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 150 + 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100;
            const rot = Math.random() * 360 - 180;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.setProperty('--rot', `${rot}deg`);
            
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if(particle.parentNode) particle.remove();
            }, 1000);
        }
    }
});