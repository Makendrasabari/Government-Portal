/**
 * Government Portal - Authentication & Session Management
 * Handles:
 * - 2-Role Selectors (Citizen / Government Official)
 * - Password Show/Hide Toggle
 * - Sign Up Validation (Name, Mail, Create Password, Confirm Password)
 * - Redirection from Sign Up -> Login -> Dashboard
 * - Dynamic Name & Initials Extraction
 */

function generateInitials(fullName) {
  if (!fullName) return 'GP';
  const cleaned = fullName.trim().replace(/[^a-zA-Z\s]/g, '');
  const parts = cleaned.split(/\s+/).filter(Boolean);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  const single = parts[0];
  if (!single) return 'GP';
  if (single.length <= 2) return single.toUpperCase();
  
  const compoundMatch = single.match(/^([A-Z][a-z]+)([A-Z][a-z]+)$/);
  if (compoundMatch) {
    return (compoundMatch[1][0] + compoundMatch[2][0]).toUpperCase();
  }
  
  const compounds = ['kanth', 'kumar', 'raj', 'nath', 'dev', 'deep', 'swamy', 'prasad', 'pal', 'vel', 'moorthy', 'reddy', 'rao'];
  const lower = single.toLowerCase();
  for (const comp of compounds) {
    const idx = lower.lastIndexOf(comp);
    if (idx > 0) {
      return (single[0] + single[idx]).toUpperCase();
    }
  }
  
  return (single[0] + single[single.length - 1]).toUpperCase();
}

function parseDisplayName(input) {
  if (!input) return 'Citizen User';
  let trimmed = input.trim();
  
  if (trimmed.includes('@')) {
    trimmed = trimmed.split('@')[0];
    trimmed = trimmed.replace(/[._-]+/g, ' ');
  }
  
  return trimmed
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

document.addEventListener('DOMContentLoaded', () => {
  const alertBox = document.getElementById('auth-alert-box');

  function showAlert(msg, isSuccess = false) {
    if (!alertBox) return;
    alertBox.className = `auth-alert ${isSuccess ? 'auth-alert-success' : 'auth-alert-error'}`;
    alertBox.innerHTML = `
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
        ${isSuccess 
          ? '<path d="M20 6L9 17l-5-5"/>' 
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      <span>${msg}</span>
    `;
    alertBox.style.display = 'flex';
  }

  function hideAlert() {
    if (alertBox) alertBox.style.display = 'none';
  }

  // --------------------------------------------------------------------------
  // ROLE SELECTORS (Citizen / Government Official)
  // --------------------------------------------------------------------------
  function setupRoleSelectors(containerId, hiddenInputId) {
    const group = document.getElementById(containerId);
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!group || !hiddenInput) return;

    const cards = group.querySelectorAll('.role-card-btn');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-pressed', 'true');
        const roleVal = card.getAttribute('data-role-val');
        hiddenInput.value = roleVal;
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  setupRoleSelectors('login-role-group', 'login-role');
  setupRoleSelectors('signup-role-group', 'signup-role');

  // --------------------------------------------------------------------------
  // PASSWORD VISIBILITY TOGGLES
  // --------------------------------------------------------------------------
  const toggleButtons = document.querySelectorAll('.auth-toggle-password');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      btn.innerHTML = isPassword
        ? `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  });

  // --------------------------------------------------------------------------
  // LOGIN PAGE LOGIC
  // --------------------------------------------------------------------------
  const loginForm = document.getElementById('gov-login-form');
  if (loginForm) {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const roleInput = document.getElementById('login-role');
    const demoBtns = document.querySelectorAll('.demo-pill-btn');

    // Check query params if redirected after sign up
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      const registeredEmail = urlParams.get('email');
      if (registeredEmail && emailInput) {
        emailInput.value = registeredEmail;
      }
      showAlert('Account registered successfully! Please enter your password to sign in.', true);
    }

    // Demo Fill Pills
    demoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const demoEmail = btn.getAttribute('data-email');
        const demoRole = btn.getAttribute('data-role');

        if (emailInput && demoEmail) emailInput.value = demoEmail;
        if (passInput) passInput.value = 'GovPortal@2026';

        if (demoRole) {
          const roleCards = document.querySelectorAll('#login-role-group .role-card-btn');
          roleCards.forEach(c => {
            const isMatch = c.getAttribute('data-role-val') === demoRole;
            c.classList.toggle('active', isMatch);
            c.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
          });
          if (roleInput) roleInput.value = demoRole;
        }
        hideAlert();
      });
    });

    const emailErrorEl = document.getElementById('login-email-error');
    const passErrorEl = document.getElementById('login-password-error');

    function showFieldError(input, errorEl, msg) {
      if (input) input.classList.add('input-error');
      if (errorEl) {
        errorEl.innerHTML = `
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="flex-shrink:0;">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>${msg}</span>
        `;
        errorEl.classList.add('show');
      }
    }

    function clearFieldError(input, errorEl) {
      if (input) input.classList.remove('input-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
      }
    }

    // Clear errors on typing
    if (emailInput) {
      emailInput.addEventListener('input', () => clearFieldError(emailInput, emailErrorEl));
    }
    if (passInput) {
      passInput.addEventListener('input', () => clearFieldError(passInput, passErrorEl));
    }

    // Login Submission
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAlert();
      clearFieldError(emailInput, emailErrorEl);
      clearFieldError(passInput, passErrorEl);

      const rawInput = emailInput ? emailInput.value.trim() : '';
      const password = passInput ? passInput.value.trim() : '';
      const role = roleInput ? roleInput.value : 'Citizen';

      let hasError = false;

      // Validate Email or Username (at least 3 characters for username, or valid @gmail.com)
      const isEmail = rawInput.includes('@');
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (!rawInput || (isEmail && !gmailRegex.test(rawInput)) || (!isEmail && rawInput.length < 3)) {
        showFieldError(emailInput, emailErrorEl, isEmail ? 'Enter email in @gmail.com format' : 'Enter valid username (at least 3 characters)');
        hasError = true;
      }

      // Validate Password (at least 8 characters)
      if (!password || password.length < 8) {
        showFieldError(passInput, passErrorEl, 'Enter at least 8 characters');
        hasError = true;
      }

      if (hasError) {
        if (!rawInput || (isEmail && !gmailRegex.test(rawInput)) || (!isEmail && rawInput.length < 3)) {
          emailInput?.focus();
        } else {
          passInput?.focus();
        }
        return;
      }

      // Generate displayName and initials
      const displayName = parseDisplayName(rawInput);
      const email = isEmail ? rawInput : `${rawInput.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
      const initials = generateInitials(displayName);

      const sessionData = {
        name: displayName,
        email: email,
        role: role,
        initials: initials,
        loggedInAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('gov_portal_session', JSON.stringify(sessionData));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // Loading state on button
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; margin-right: 8px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Authenticating...
        `;
      }

      showAlert('Authentication successful! Loading dashboard...', true);

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 600);
    });
  }

  // --------------------------------------------------------------------------
  // SIGN UP PAGE LOGIC
  // --------------------------------------------------------------------------
  const signupForm = document.getElementById('gov-signup-form');
  if (signupForm) {
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passInput = document.getElementById('signup-password');
    const confirmPassInput = document.getElementById('signup-confirm-password');
    const roleInput = document.getElementById('signup-role');
    const matchHint = document.getElementById('password-match-hint');

    // Live password match feedback
    function checkPasswordMatch() {
      if (!matchHint || !passInput || !confirmPassInput) return;
      const pass = passInput.value;
      const confirmPass = confirmPassInput.value;

      if (!confirmPass) {
        matchHint.style.display = 'none';
        return;
      }

      if (pass === confirmPass) {
        matchHint.className = 'password-match-hint valid';
        matchHint.textContent = 'Passwords match';
      } else {
        matchHint.className = 'password-match-hint invalid';
        matchHint.textContent = 'Passwords do not match';
      }
    }

    const signupNameError = document.getElementById('signup-name-error');
    const signupEmailError = document.getElementById('signup-email-error');
    const signupPassError = document.getElementById('signup-password-error');
    const signupConfirmError = document.getElementById('signup-confirm-error');

    function showSignupError(input, errorEl, msg) {
      if (input) input.classList.add('input-error');
      if (errorEl) {
        errorEl.innerHTML = `
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="flex-shrink:0;">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>${msg}</span>
        `;
        errorEl.classList.add('show');
      }
    }

    function clearSignupError(input, errorEl) {
      if (input) input.classList.remove('input-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
      }
    }

    if (nameInput) nameInput.addEventListener('input', () => clearSignupError(nameInput, signupNameError));
    if (emailInput) emailInput.addEventListener('input', () => clearSignupError(emailInput, signupEmailError));
    if (passInput) passInput.addEventListener('input', () => clearSignupError(passInput, signupPassError));
    if (confirmPassInput) confirmPassInput.addEventListener('input', () => clearSignupError(confirmPassInput, signupConfirmError));

    // Form Submit
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAlert();
      clearSignupError(nameInput, signupNameError);
      clearSignupError(emailInput, signupEmailError);
      clearSignupError(passInput, signupPassError);
      clearSignupError(confirmPassInput, signupConfirmError);

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const pass = passInput ? passInput.value.trim() : '';
      const confirmPass = confirmPassInput ? confirmPassInput.value.trim() : '';
      const role = roleInput ? roleInput.value : 'Citizen';

      let hasError = false;

      // 1. Validate Name
      if (!name || name.length < 2) {
        showSignupError(nameInput, signupNameError, 'Please enter your full name (at least 2 characters)');
        hasError = true;
      }

      // 2. Validate Email (strictly @gmail.com)
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (!email || !gmailRegex.test(email)) {
        showSignupError(emailInput, signupEmailError, 'Enter email in @gmail.com format');
        hasError = true;
      }

      // 3. Validate Create Password (at least 8 characters)
      if (!pass || pass.length < 8) {
        showSignupError(passInput, signupPassError, 'Enter at least 8 characters');
        hasError = true;
      }

      // 4. Validate Confirm Password (at least 8 characters & match)
      if (!confirmPass || confirmPass.length < 8) {
        showSignupError(confirmPassInput, signupConfirmError, 'Enter at least 8 characters');
        hasError = true;
      } else if (pass !== confirmPass) {
        showSignupError(confirmPassInput, signupConfirmError, 'Passwords do not match');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      // Store registered profile in localStorage
      const registeredUser = {
        name: name,
        email: email,
        role: role,
        registeredAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('gov_registered_user', JSON.stringify(registeredUser));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // Button loading effect
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; margin-right: 8px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Creating Account...
        `;
      }

      showAlert('Account created successfully! Navigating to login...', true);

      // Navigate to login page
      setTimeout(() => {
        window.location.href = `login.html?registered=true&email=${encodeURIComponent(email)}`;
      }, 700);
    });
  }
});
