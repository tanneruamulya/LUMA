/* ==========================================================================
   LUMA LANDING & AUTHENTICATION SCRIPT
   - Navbar scroll effects
   - Mobile navigation toggle
   - Interactive assessment pathway tabs
   - Session checking & Navbar profile avatar swapping
   - Tabs toggle (Login / Signup) in auth.html
   - Password toggles (Show/Hide)
   - Live signup validation & strength meter
   - Authentication session management
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize local user storage without hardcoded demo accounts
    if (!localStorage.getItem('luma_users')) {
        localStorage.setItem('luma_users', JSON.stringify([]));
    }

    // Auto logout on landing page load to always display Login & Sign Up buttons as requested
    if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '') {
        localStorage.removeItem('luma_logged_in');
        localStorage.removeItem('luma_user');
    }

    // --------------------------------------------------------------------------
    // 1. STICKY NAVBAR SCROLL ACTION
    // --------------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --------------------------------------------------------------------------
    // 2. MOBILE MENU NAVIGATION TOGGLE
    // --------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking links
        const navLinksList = document.querySelectorAll('.nav-link');
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 3. INTERACTIVE ASSESSMENT CAREER SWITCHER (landing page preview)
    // --------------------------------------------------------------------------
    const interestBtns = document.querySelectorAll('.interest-btn');
    const demoCards = document.querySelectorAll('.demo-result-card');

    interestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            interestBtns.forEach(b => b.classList.remove('active'));
            demoCards.forEach(c => {
                c.style.display = 'none';
                c.classList.remove('active');
            });

            btn.classList.add('active');

            const careerId = btn.getAttribute('data-career');
            const targetCard = document.getElementById(`demo-${careerId}`);
            if (targetCard) {
                targetCard.style.display = 'grid';
                void targetCard.offsetWidth;
                targetCard.classList.add('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 4. ACTIVE SECTION LINK HIGHLIGHT ON SCROLL
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));
    }

    // --------------------------------------------------------------------------
    // 5. SESSION CHECKING & PROFILE DROPDOWN TRANSITIONS
    // --------------------------------------------------------------------------
    const checkSession = () => {
        const loggedIn = localStorage.getItem('luma_logged_in') === 'true';
        
        const isAuthPage = window.location.pathname.includes('/discovery-assessment') || 
                           window.location.pathname.includes('/recommendations') || 
                           window.location.pathname.includes('/dashboard') || 
                           window.location.pathname.includes('/learning-hub') || 
                           window.location.pathname.includes('/learning-concept') ||
                           window.location.pathname.includes('/journey') ||
                           window.location.pathname.includes('/explorer-hub') ||
                           window.location.pathname.includes('/summary') ||
                           window.location.pathname.includes('/profile') ||
                           window.location.pathname.endsWith('/assessment.html') ||
                           window.location.pathname.endsWith('/recommendations.html') ||
                           window.location.pathname.endsWith('/dashboard.html') ||
                           window.location.pathname.endsWith('/learning.html') ||
                           window.location.pathname.endsWith('/learning-concept.html') ||
                           window.location.pathname.endsWith('/journey.html') ||
                           window.location.pathname.endsWith('/explorer.html') ||
                           window.location.pathname.endsWith('/summary.html') ||
                           window.location.pathname.endsWith('/profile.html');

        const isLoginPage = window.location.pathname === '/login' || 
                            window.location.pathname === '/signup' || 
                            window.location.pathname.endsWith('/auth.html');

        if (loggedIn && isLoginPage) {
            window.location.replace('/discovery-assessment');
            return;
        }

        if (!loggedIn && isAuthPage) {
            window.location.replace('/login');
            return;
        }
        
        // Grab navbar containers
        const actionsDesktop = document.getElementById('nav-actions-desktop-wrapper');
        const actionsMobile = document.getElementById('nav-actions-mobile-wrapper');
        const profileDesktop = document.getElementById('profile-menu-desktop');
        const profileMobile = document.getElementById('profile-menu-mobile');

        if (loggedIn) {
            const userStr = localStorage.getItem('luma_user');
            let user = { name: 'Amulya Tanneru', email: 'you@example.com' };
            if (userStr) {
                user = JSON.parse(userStr);
            }

            // Hide standard actions
            if (actionsDesktop) actionsDesktop.style.display = 'none';
            if (actionsMobile) actionsMobile.style.display = 'none';

            // Show avatar menus
            if (profileDesktop) {
                profileDesktop.style.display = '';
                document.getElementById('dropdown-name-desktop').textContent = user.name;
                document.getElementById('dropdown-email-desktop').textContent = user.email;
            }
            if (profileMobile) {
                profileMobile.style.display = '';
                document.getElementById('dropdown-name-mobile').textContent = user.name;
                document.getElementById('dropdown-email-mobile').textContent = user.email;
            }
        } else {
            // Restore standard actions
            if (actionsDesktop) actionsDesktop.style.display = '';
            if (actionsMobile) actionsMobile.style.display = '';

            // Hide avatar menus
            if (profileDesktop) profileDesktop.style.display = 'none';
            if (profileMobile) profileMobile.style.display = 'none';
        }
    };

    checkSession();

    // Toggle dropdown visibility on clicking profile avatars
    const avatarBtnDesktop = document.getElementById('avatar-btn-desktop');
    const dropdownMenuDesktop = document.getElementById('dropdown-menu-desktop');
    if (avatarBtnDesktop && dropdownMenuDesktop) {
        avatarBtnDesktop.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenuDesktop.classList.toggle('active');
        });
        document.addEventListener('click', () => {
            dropdownMenuDesktop.classList.remove('active');
        });
    }

    const avatarBtnMobile = document.getElementById('avatar-btn-mobile');
    const dropdownMenuMobile = document.getElementById('dropdown-menu-mobile');
    if (avatarBtnMobile && dropdownMenuMobile) {
        avatarBtnMobile.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenuMobile.classList.toggle('active');
        });
    }

    // Bind log out buttons
    const logoutBtns = document.querySelectorAll('.logout-action-btn, #dash-logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('luma_logged_in');
            localStorage.removeItem('luma_user');
            
            const isAuthPath = window.location.pathname === '/login' || 
                               window.location.pathname === '/signup' || 
                               window.location.pathname === '/discovery-assessment' ||
                               window.location.pathname === '/recommendations' ||
                               window.location.pathname === '/dashboard' ||
                               window.location.pathname === '/learning-hub' ||
                               window.location.pathname === '/learning-concept' ||
                               window.location.pathname === '/journey' ||
                               window.location.pathname === '/explorer-hub' ||
                               window.location.pathname === '/summary' ||
                               window.location.pathname === '/profile' ||
                               window.location.pathname.endsWith('/assessment.html') ||
                               window.location.pathname.endsWith('/recommendations.html') ||
                               window.location.pathname.endsWith('/dashboard.html') ||
                               window.location.pathname.endsWith('/learning.html') ||
                               window.location.pathname.endsWith('/learning-concept.html') ||
                               window.location.pathname.endsWith('/journey.html') ||
                               window.location.pathname.endsWith('/explorer.html') ||
                               window.location.pathname.endsWith('/summary.html') ||
                               window.location.pathname.endsWith('/profile.html');

            if (isAuthPath) {
                window.location.replace('/');
            } else {
                checkSession();
                if (dropdownMenuDesktop) dropdownMenuDesktop.classList.remove('active');
                if (dropdownMenuMobile) dropdownMenuMobile.classList.remove('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 6. AUTHENTICATION PAGES HANDLERS (auth.html)
    // --------------------------------------------------------------------------
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const panelLogin = document.getElementById('panel-login');
    const panelSignup = document.getElementById('panel-signup');

    if (tabLogin && tabSignup && panelLogin && panelSignup) {
        // Tab switching functions
        const activateLoginTab = (updateUrl = true) => {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            panelLogin.classList.add('active');
            panelSignup.classList.remove('active');
            if (updateUrl && window.location.pathname !== '/login') {
                history.pushState(null, '', '/login');
            }
        };

        const activateSignupTab = (updateUrl = true) => {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            panelSignup.classList.add('active');
            panelLogin.classList.remove('active');
            if (updateUrl && window.location.pathname !== '/signup') {
                history.pushState(null, '', '/signup');
            }
        };

        tabLogin.addEventListener('click', () => activateLoginTab());
        tabSignup.addEventListener('click', () => activateSignupTab());

        // Bind switching prompts at the bottom
        const linkToSignup = document.getElementById('link-go-to-signup');
        const linkToLogin = document.getElementById('link-go-to-login');
        if (linkToSignup) linkToSignup.addEventListener('click', (e) => { e.preventDefault(); activateSignupTab(); });
        if (linkToLogin) linkToLogin.addEventListener('click', (e) => { e.preventDefault(); activateLoginTab(); });

        // Route initially on page load based on pathname
        const syncTabWithUrl = () => {
            if (window.location.pathname === '/signup') {
                activateSignupTab(false);
            } else {
                activateLoginTab(false);
            }
        };

        syncTabWithUrl();

        // Listen for browser back/forward buttons
        window.addEventListener('popstate', syncTabWithUrl);
    }

    // --------------------------------------------------------------------------
    // 7. PASSWORD SHOW/HIDE TOGGLES
    // --------------------------------------------------------------------------
    const togglePwBtns = document.querySelectorAll('.password-toggle-icon');
    togglePwBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const eyeOff = btn.querySelector('.eye-off-svg');
            const eyeOn = btn.querySelector('.eye-on-svg');

            if (input && input.type === 'password') {
                input.type = 'text';
                if (eyeOff) eyeOff.style.display = 'none';
                if (eyeOn) eyeOn.style.display = 'block';
            } else if (input) {
                input.type = 'password';
                if (eyeOff) eyeOff.style.display = 'block';
                if (eyeOn) eyeOn.style.display = 'none';
            }
        });
    });

    // --------------------------------------------------------------------------
    // 8. SIGNUP PASSWORD LIVE CHECKER & STRENGTH METER
    // --------------------------------------------------------------------------
    const signupPassword = document.getElementById('signup-password');
    const ruleLength = document.getElementById('rule-length');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleNumber = document.getElementById('rule-number');
    const strengthBar = document.getElementById('strength-bar');

    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            const val = signupPassword.value;
            
            // Rules flags
            const hasLength = val.length >= 8;
            const hasUpper = /[A-Z]/.test(val);
            const hasNumber = /[0-9]/.test(val);

            // Toggle criteria styles
            if (hasLength) ruleLength.classList.add('met'); else ruleLength.classList.remove('met');
            if (hasUpper) ruleUpper.classList.add('met'); else ruleUpper.classList.remove('met');
            if (hasNumber) ruleNumber.classList.add('met'); else ruleNumber.classList.remove('met');

            // Calculate strength score
            let score = 0;
            if (hasLength) score++;
            if (hasUpper) score++;
            if (hasNumber) score++;

            // Update strength bar fill
            if (strengthBar) {
                // Clear active states
                strengthBar.className = 'strength-bar-fill';
                if (score === 1) {
                    strengthBar.classList.add('weak');
                } else if (score === 2) {
                    strengthBar.classList.add('medium');
                } else if (score === 3) {
                    strengthBar.classList.add('strong');
                }
            }
        });
    }

    // --------------------------------------------------------------------------
    // 9. SUBMIT MOCK ACTIONS & REDIRECTS
    // --------------------------------------------------------------------------
    const showLoginError = (message) => {
        const errorDiv = document.getElementById('login-error-msg');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    };

    const showSignupError = (message) => {
        const errorDiv = document.getElementById('signup-error-msg');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    };

    const showAuthStatus = (message, isError = false) => {
        const errorDiv = document.getElementById('login-error-msg') || document.getElementById('signup-error-msg');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.style.color = isError ? '#EA4335' : '#0f766e';
            errorDiv.style.backgroundColor = isError ? 'rgba(234, 67, 53, 0.08)' : 'rgba(20, 184, 166, 0.12)';
            errorDiv.style.borderColor = isError ? 'rgba(234, 67, 53, 0.2)' : 'rgba(20, 184, 166, 0.2)';
        }
    };

    const clearAuthStatus = () => {
        const errorDiv = document.getElementById('login-error-msg') || document.getElementById('signup-error-msg');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    };

    const decodeJwtPayload = (token) => {
        try {
            const payload = token.split('.')[1];
            const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = atob(normalized);
            const jsonPayload = decodeURIComponent(decoded.split('').map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    };

    const triggerAuthRedirect = (name, email, picture = '') => {
        const loginBtn = document.querySelector('#form-login-action button[type="submit"]');
        const signupBtn = document.querySelector('#form-signup-action button[type="submit"]');
        
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="btn-spinner"></span> Signing in...';
        }
        if (signupBtn) {
            signupBtn.disabled = true;
            signupBtn.innerHTML = '<span class="btn-spinner"></span> Registering...';
        }

        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            // Force reflow
            void loadingScreen.offsetWidth;
            loadingScreen.classList.add('active');
        }
        
        localStorage.setItem('luma_logged_in', 'true');
        localStorage.setItem('luma_auth_provider', 'local');
        localStorage.setItem('luma_user', JSON.stringify({
            name: name || 'Luma User',
            email: email || 'user@luma.local',
            picture: picture || ''
        }));

        setTimeout(() => {
            const completed = localStorage.getItem('luma_assessment_completed') === 'true';
            if (completed) {
                window.location.replace('/dashboard');
            } else {
                window.location.replace('/discovery-assessment');
            }
        }, 750); // 500-800ms loading duration
    };

    const formLogin = document.getElementById('form-login-action');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            // Clear previous errors
            const errorDiv = document.getElementById('login-error-msg');
            if (errorDiv) errorDiv.style.display = 'none';

            // Validate Email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showLoginError('Please enter a valid email address.');
                return;
            }

            if (!password) {
                showLoginError('Please enter your password.');
                return;
            }

            // Verify credentials in users list
            let users = JSON.parse(localStorage.getItem('luma_users') || '[]');
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user || user.password !== password) {
                showLoginError('Incorrect email or password. Please try again.');
                return;
            }

            triggerAuthRedirect(user.name, user.email);
        });
    }

    const formSignup = document.getElementById('form-signup-action');
    if (formSignup) {
        formSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;

            // Clear previous errors
            const errorDiv = document.getElementById('signup-error-msg');
            if (errorDiv) errorDiv.style.display = 'none';

            // Validate Email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showSignupError('Please enter a valid email address.');
                return;
            }

            // Enforce criteria checks
            const hasLength = password.length >= 8;
            const hasUpper = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);

            if (!hasLength || !hasUpper || !hasNumber) {
                showSignupError('Please ensure your password meets all strength criteria.');
                return;
            }

            if (password !== confirm) {
                showSignupError('Passwords do not match. Please verify.');
                return;
            }

            // Save user to simulated local storage database
            let users = JSON.parse(localStorage.getItem('luma_users') || '[]');
            const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (userExists) {
                showSignupError('An account with this email address already exists.');
                return;
            }

            users.push({ name, email, password });
            localStorage.setItem('luma_users', JSON.stringify(users));

            triggerAuthRedirect(name, email);
        });
    }

    const handleGoogleCredentialResponse = (response) => {
        if (!response?.credential) {
            showAuthStatus('Authentication failed. Please try again.', true);
            return;
        }

        const payload = decodeJwtPayload(response.credential);
        if (!payload?.email) {
            showAuthStatus('Authentication failed. Please try again.', true);
            return;
        }

        const user = {
            name: payload.name || payload.given_name || payload.email.split('@')[0],
            email: payload.email,
            picture: payload.picture || '',
            google_id: payload.sub || ''
        };

        let users = JSON.parse(localStorage.getItem('luma_users') || '[]');
        const userExists = users.some((entry) => entry.email.toLowerCase() === user.email.toLowerCase());
        if (!userExists) {
            users.push({ name: user.name, email: user.email, password: '' });
            localStorage.setItem('luma_users', JSON.stringify(users));
        }

        localStorage.setItem('luma_auth_provider', 'google');
        triggerAuthRedirect(user.name, user.email, user.picture);
    };

    const initializeGoogleAuth = () => {
        const clientId = window.GOOGLE_CLIENT_ID || '';
        if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
            return;
        }

        if (!window.google?.accounts?.id) {
            return;
        }

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            context: 'signin',
            ux_mode: 'popup'
        });
    };

    const startGoogleSignIn = () => {
        clearAuthStatus();

        const clientId = window.GOOGLE_CLIENT_ID || '';
        if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
            showAuthStatus('Google Sign-In is not configured yet. Add your Google Client ID to enable it.', true);
            return;
        }

        if (!window.google?.accounts?.id) {
            showAuthStatus('Google Sign-In is unavailable right now. Please try again later.', true);
            return;
        }

        try {
            window.google.accounts.id.prompt((notification) => {
                if (!notification) {
                    showAuthStatus('Authentication failed. Please try again.', true);
                    return;
                }

                if (notification.isSkippedMoment?.()) {
                    showAuthStatus('Google Sign-In cancelled.', true);
                    return;
                }

                if (notification.getDismissedReason?.() === 'user_cancel') {
                    showAuthStatus('Google Sign-In cancelled.', true);
                    return;
                }

                if (notification.getNotDisplayedReason?.() || notification.getSkippedReason?.()) {
                    showAuthStatus('Authentication failed. Please try again.', true);
                }
            });
        } catch (error) {
            showAuthStatus('Authentication failed. Please try again.', true);
        }
    };

    initializeGoogleAuth();

    const googleBtns = document.querySelectorAll('#login-google-btn, #signup-google-btn');
    googleBtns.forEach((btn) => {
        btn.addEventListener('click', startGoogleSignIn);
    });

    // --------------------------------------------------------------------------
    // 10. REAL PROGRESS TRACKING & DASHBOARD STATE
    // --------------------------------------------------------------------------
    const progressStorageKey = 'luma_progress_state';
    const resourceLibraryKey = 'luma_resource_library';
    const defaultResourceLibrary = [
        { id: 'design-thinking-guide', title: 'Guide: The 5 Phases of Design Thinking', minutes: 8, concept: 'design-thinking' },
        { id: 'design-thinking-brainstorm', title: 'Article: Brainstorming without Constraints', minutes: 7, concept: 'design-thinking' },
        { id: 'user-research-interviews', title: 'Guide: Conducting Effective User Interviews', minutes: 10, concept: 'user-research' },
        { id: 'user-research-personas', title: 'Article: Creating Realistic User Personas', minutes: 8, concept: 'user-research' },
        { id: 'user-research-script', title: 'Challenge: Draft Your First Interview Script', minutes: 7, concept: 'user-research' },
        { id: 'wireframing-sketching', title: 'Guide: Low-Fidelity Sketching Techniques', minutes: 15, concept: 'wireframing' },
        { id: 'wireframing-tools', title: 'Article: Digital Wireframing Tools Guide', minutes: 10, concept: 'wireframing' },
        { id: 'wireframing-landing-page', title: 'Challenge: Design a Landing Page Sketch', minutes: 15, concept: 'wireframing' },
        { id: 'ia-card-sorting', title: 'Guide: Card Sorting Methodologies', minutes: 12, concept: 'information-architecture' },
        { id: 'ia-sitemaps', title: 'Article: Creating Comprehensive Sitemaps', minutes: 10, concept: 'information-architecture' },
        { id: 'visual-design-grids', title: 'Guide: Grid Systems & Layout Layouts', minutes: 20, concept: 'visual-design' },
        { id: 'visual-design-color', title: 'Article: Selecting Color Palettes', minutes: 15, concept: 'visual-design' },
        { id: 'prototyping-micro', title: 'Guide: Interactive Micro-Animations', minutes: 15, concept: 'prototyping' },
        { id: 'prototyping-flow', title: 'Challenge: Connect a 3-Screen App Flow', minutes: 20, concept: 'prototyping' }
    ];

    const getProgressState = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(progressStorageKey) || '{}');
            return {
                completedResourceIds: Array.isArray(saved.completedResourceIds) ? saved.completedResourceIds : [],
                completedWeeklyTasks: Array.isArray(saved.completedWeeklyTasks) ? saved.completedWeeklyTasks : [],
                completedProjects: Number.isFinite(saved.completedProjects) ? saved.completedProjects : 0,
                completedChallenges: Number.isFinite(saved.completedChallenges) ? saved.completedChallenges : 0,
                completedCertificates: Number.isFinite(saved.completedCertificates) ? saved.completedCertificates : 0,
                streak: Number.isFinite(saved.streak) ? saved.streak : 0,
                lastCompletedDate: saved.lastCompletedDate || null
            };
        } catch (error) {
            return {
                completedResourceIds: [],
                completedWeeklyTasks: [],
                completedProjects: 0,
                completedChallenges: 0,
                completedCertificates: 0,
                streak: 0,
                lastCompletedDate: null
            };
        }
    };

    const saveProgressState = (state) => {
        localStorage.setItem(progressStorageKey, JSON.stringify(state));
    };

    const getResourceLibrary = () => {
        try {
            const stored = JSON.parse(localStorage.getItem(resourceLibraryKey) || 'null');
            if (Array.isArray(stored) && stored.length) {
                return stored;
            }
        } catch (error) {
            // Fall back to the built-in library below.
        }

        localStorage.setItem(resourceLibraryKey, JSON.stringify(defaultResourceLibrary));
        return defaultResourceLibrary;
    };

    const formatMinutes = (minutes) => {
        if (!minutes || minutes <= 0) return '0 minutes';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours && mins) return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
        if (hours) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return `${mins} minute${mins > 1 ? 's' : ''}`;
    };

    const getProgressSummary = (state = getProgressState()) => {
        const resources = getResourceLibrary();
        const completedResources = resources.filter((resource) => state.completedResourceIds.includes(resource.id));
        const completedCount = completedResources.length;
        const totalCount = resources.length;
        const overallProgress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
        const completedModules = new Set(completedResources.map((resource) => resource.concept)).size;
        const estimatedMinutes = completedResources.reduce((total, resource) => total + (resource.minutes || 0), 0);
        const estimatedTimeLabel = formatMinutes(estimatedMinutes);
        const weeklyCompletedCount = state.completedWeeklyTasks.length;
        const projectsCompleted = state.completedProjects;
        const certificates = state.completedCertificates;
        const streak = state.streak || 0;
        const emptyStateMessage = completedCount === 0
            ? 'Your journey starts today. Complete your first lesson to begin tracking your progress.'
            : '';

        return {
            completedResources: completedCount,
            totalResources: totalCount,
            overallProgress,
            completedModules,
            weeklyCompletedCount,
            projectsCompleted,
            certificates,
            streak,
            estimatedMinutes,
            estimatedTimeLabel,
            emptyStateMessage,
            hasProgress: completedCount > 0
        };
    };

    const syncWeeklyChecklist = (state = getProgressState()) => {
        const checklistItems = document.querySelectorAll('#dash-plan-checklist .plan-checkbox-item');
        checklistItems.forEach((item) => {
            const label = item.querySelector('span')?.textContent?.trim() || '';
            const shouldBeChecked = state.completedWeeklyTasks.includes(label);
            item.classList.toggle('checked', shouldBeChecked);
        });
    };

    const updateProgressUI = (state = getProgressState()) => {
        const summary = getProgressSummary(state);
        const progressCircle = document.querySelector('.progress-circle-fill');
        if (progressCircle) {
            const radius = 54;
            const circumference = 2 * Math.PI * radius;
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = circumference - (summary.overallProgress / 100) * circumference;
        }

        const progressPercentLabel = document.querySelector('.progress-percentage-label');
        if (progressPercentLabel) {
            progressPercentLabel.textContent = `${summary.overallProgress}%`;
        }

        const milestoneText = document.getElementById('dash-milestone-progress-text');
        if (milestoneText) {
            milestoneText.textContent = `${summary.overallProgress}%`;
        }

        const milestoneBar = document.getElementById('dash-milestone-progress-bar');
        if (milestoneBar) {
            milestoneBar.style.width = `${summary.overallProgress}%`;
        }

        const dashboardMessage = document.getElementById('dash-progress-message');
        if (dashboardMessage) {
            dashboardMessage.textContent = summary.hasProgress
                ? `You have completed ${summary.completedResources} resource${summary.completedResources === 1 ? '' : 's'} and ${summary.estimatedTimeLabel} of learning time.`
                : summary.emptyStateMessage;
        }

        const dashboardLearningTime = document.getElementById('dash-learning-time-value');
        if (dashboardLearningTime) {
            dashboardLearningTime.textContent = summary.estimatedTimeLabel;
        }

        const dashboardResourcesCount = document.getElementById('dash-resources-count');
        if (dashboardResourcesCount) {
            dashboardResourcesCount.textContent = String(summary.completedResources);
        }

        const dashboardModulesCount = document.getElementById('dash-modules-count');
        if (dashboardModulesCount) {
            dashboardModulesCount.textContent = String(summary.completedModules);
        }

        const dashboardProjectsCount = document.getElementById('dash-projects-count');
        if (dashboardProjectsCount) {
            dashboardProjectsCount.textContent = String(summary.projectsCompleted);
        }

        const dashboardCertificatesCount = document.getElementById('dash-certificates-count');
        if (dashboardCertificatesCount) {
            dashboardCertificatesCount.textContent = String(summary.certificates);
        }

        const dashboardWeeklyCount = document.getElementById('dash-weekly-count');
        if (dashboardWeeklyCount) {
            dashboardWeeklyCount.textContent = `${summary.weeklyCompletedCount} / 5`;
        }

        const dashboardStreak = document.getElementById('dash-streak-value');
        if (dashboardStreak) {
            dashboardStreak.textContent = `${summary.streak} Day${summary.streak === 1 ? '' : 's'}`;
        }

        const dashboardReminder = document.getElementById('dash-reminder-text');
        if (dashboardReminder) {
            dashboardReminder.textContent = summary.hasProgress
                ? 'You are building momentum. Keep going and complete one more lesson today.'
                : 'Your journey starts today. Complete your first lesson to begin tracking your progress.';
        }

        const learningProgressPercent = document.getElementById('learning-progress-percent');
        if (learningProgressPercent) {
            learningProgressPercent.textContent = `${summary.overallProgress}%`;
        }

        const learningProgressBar = document.getElementById('learning-progress-bar');
        if (learningProgressBar) {
            learningProgressBar.style.width = `${summary.overallProgress}%`;
        }

        const learningProgressCaption = document.getElementById('learning-progress-caption');
        if (learningProgressCaption) {
            learningProgressCaption.textContent = summary.hasProgress
                ? `${summary.completedResources} resources completed • ${summary.estimatedTimeLabel}`
                : 'Start your first lesson to begin tracking progress.';
        }

        const journeyPercent = document.getElementById('journey-progress-percent');
        if (journeyPercent) {
            journeyPercent.textContent = `${summary.overallProgress}%`;
        }

        const journeyProgressBar = document.getElementById('journey-progress-bar');
        if (journeyProgressBar) {
            journeyProgressBar.style.width = `${summary.overallProgress}%`;
        }

        const journeyLessons = document.getElementById('journey-lessons-count');
        if (journeyLessons) {
            journeyLessons.textContent = String(summary.completedResources);
        }

        const journeyModules = document.getElementById('journey-modules-count');
        if (journeyModules) {
            journeyModules.textContent = String(summary.completedModules);
        }

        const journeyProjects = document.getElementById('journey-projects-count');
        if (journeyProjects) {
            journeyProjects.textContent = String(summary.projectsCompleted);
        }

        const journeyLearningTime = document.getElementById('journey-learning-time');
        if (journeyLearningTime) {
            journeyLearningTime.textContent = summary.estimatedTimeLabel;
        }

        const journeyStreak = document.getElementById('journey-streak-value');
        if (journeyStreak) {
            journeyStreak.textContent = `${summary.streak} Day${summary.streak === 1 ? '' : 's'}`;
        }

        const summaryCircleText = document.getElementById('sum-circle-percentage');
        if (summaryCircleText) {
            summaryCircleText.textContent = `${summary.overallProgress}%`;
        }

        const summaryCircle = document.getElementById('sum-circle-fill');
        if (summaryCircle) {
            const radius = 54;
            const circumference = 2 * Math.PI * radius;
            summaryCircle.style.strokeDasharray = circumference;
            summaryCircle.style.strokeDashoffset = circumference - (summary.overallProgress / 100) * circumference;
        }

        const summaryResources = document.getElementById('summary-resources-count');
        if (summaryResources) {
            summaryResources.textContent = `${summary.completedResources}`;
        }

        const summaryProjects = document.getElementById('summary-projects-count');
        if (summaryProjects) {
            summaryProjects.textContent = `${summary.projectsCompleted}`;
        }

        const summaryWeekly = document.getElementById('summary-weekly-count');
        if (summaryWeekly) {
            summaryWeekly.textContent = `${summary.weeklyCompletedCount}`;
        }

        const summaryCertificates = document.getElementById('summary-certificates-count');
        if (summaryCertificates) {
            summaryCertificates.textContent = `${summary.certificates}`;
        }

        const summaryStreak = document.getElementById('summary-streak-count');
        if (summaryStreak) {
            summaryStreak.textContent = `🔥 ${summary.streak} Day${summary.streak === 1 ? '' : 's'}`;
        }

        const summaryLearningTime = document.getElementById('summary-learning-time');
        if (summaryLearningTime) {
            summaryLearningTime.textContent = summary.estimatedTimeLabel;
        }

        const summaryEmptyState = document.getElementById('summary-empty-state');
        if (summaryEmptyState) {
            summaryEmptyState.textContent = summary.hasProgress
                ? ''
                : 'Your journey starts today. Complete your first lesson to begin tracking your progress.';
        }

        const profileProgress = document.getElementById('profile-progress-percent');
        if (profileProgress) {
            profileProgress.textContent = `${summary.overallProgress}%`;
        }

        const profileProgressBar = document.getElementById('profile-progress-bar');
        if (profileProgressBar) {
            profileProgressBar.style.width = `${summary.overallProgress}%`;
        }

        const profileResources = document.getElementById('profile-resources-count');
        if (profileResources) {
            profileResources.textContent = String(summary.completedResources);
        }

        const profileProjects = document.getElementById('profile-projects-count');
        if (profileProjects) {
            profileProjects.textContent = String(summary.projectsCompleted);
        }

        const profileLearningTime = document.getElementById('profile-learning-time');
        if (profileLearningTime) {
            profileLearningTime.textContent = summary.estimatedTimeLabel;
        }

        const profileStreak = document.getElementById('profile-streak-value');
        if (profileStreak) {
            profileStreak.textContent = `${summary.streak} Day${summary.streak === 1 ? '' : 's'}`;
        }

        const profileReminder = document.getElementById('profile-reminder-text');
        if (profileReminder) {
            profileReminder.textContent = summary.hasProgress
                ? 'You are building momentum. Keep going and complete one more lesson today.'
                : 'Your journey starts today. Complete your first lesson to begin tracking your progress.';
        }

        syncWeeklyChecklist(state);
    };

    window.completeLearningResource = (resourceId, title, minutes, concept = 'general') => {
        const state = getProgressState();
        if (!state.completedResourceIds.includes(resourceId)) {
            state.completedResourceIds.push(resourceId);
            const today = new Date().toISOString().slice(0, 10);
            if (state.lastCompletedDate) {
                const lastDate = new Date(state.lastCompletedDate);
                const currentDate = new Date(today);
                const diffDays = Math.round((currentDate - lastDate) / 86400000);
                if (diffDays === 1) {
                    state.streak = (state.streak || 0) + 1;
                } else if (diffDays > 1) {
                    state.streak = 1;
                }
            } else {
                state.streak = 1;
            }
            state.lastCompletedDate = today;
            if (concept === 'prototyping' || title.toLowerCase().includes('project')) {
                state.completedProjects = (state.completedProjects || 0) + 1;
            }
            saveProgressState(state);
            updateProgressUI(state);
        }
    };

    window.toggleWeeklyTask = (label) => {
        const state = getProgressState();
        const existingIndex = state.completedWeeklyTasks.indexOf(label);
        if (existingIndex >= 0) {
            state.completedWeeklyTasks.splice(existingIndex, 1);
        } else {
            state.completedWeeklyTasks.push(label);
        }
        saveProgressState(state);
        updateProgressUI(state);
    };

    const initializeProgressTracking = () => {
        updateProgressUI(getProgressState());

        const checklistItems = document.querySelectorAll('#dash-plan-checklist .plan-checkbox-item');
        checklistItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                const label = item.querySelector('span')?.textContent?.trim() || '';
                if (label) {
                    window.toggleWeeklyTask(label);
                }
            });
        });
    };

    initializeProgressTracking();

    // --------------------------------------------------------------------------
    // 10. DASHBOARD AVATAR DROPDOWN (assessment.html)
    // --------------------------------------------------------------------------
    const dashAvatarBtn = document.getElementById('dash-avatar-btn');
    const dashAvatarDropdown = document.getElementById('dash-avatar-dropdown');
    if (dashAvatarBtn && dashAvatarDropdown) {
        dashAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dashAvatarDropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => {
            dashAvatarDropdown.classList.remove('active');
        });
    }
});
