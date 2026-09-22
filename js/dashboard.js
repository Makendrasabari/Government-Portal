/**
 * Government Portal - Dashboard Controller
 * Supports dual role modes: Citizen and Government Official
 * Features:
 * - Distinct sidebar navigation headings per role
 * - Distinct section contents and analytics per role
 * - Seamless topbar & profile dropdown role switcher
 * - Alternating slide scroll animations (Sections 1 & 3 from left, Sections 2 & 4 from right)
 * - Letter-by-letter heading entry animations from the right
 * - Responsive full-width mobile navigation drawer with cross-mark close button
 */

const ROLE_CONFIGS = {
  'Citizen': {
    roleName: 'Citizen',
    portalBadge: 'Citizen Portal',
    badgeClass: 'role-badge-citizen',
    switchBtnText: 'Switch to Official Portal',
    tabs: {
      '1': { title: 'My Dashboard', crumb: 'Portal / Citizen / Overview & Quick Actions' },
      '2': { title: 'Citizen Services', crumb: 'Portal / Citizen / Service Catalog & Applications' },
      '3': { title: 'My Applications', crumb: 'Portal / Citizen / Track Submitted Requests' },
      '4': { title: 'Document Locker', crumb: 'Portal / Citizen / DigiLocker Vault & E-Certificates' },
      '5': { title: 'Grievance Desk', crumb: 'Portal / Citizen / Public Redressal & Support' }
    },
    navTitles: {
      '1': 'My Dashboard',
      '2': 'Citizen Services',
      '3': 'My Applications',
      '4': 'Document Locker',
      '5': 'Grievance Desk'
    }
  },
  'Government Official': {
    roleName: 'Government Official',
    portalBadge: 'Official Portal',
    badgeClass: 'role-badge-official',
    switchBtnText: 'Switch to Citizen Portal',
    tabs: {
      '1': { title: 'Admin Overview', crumb: 'Portal / Official / Mission Control & Velocity' },
      '2': { title: 'Department Ops', crumb: 'Portal / Official / Inter-Agency Pipeline' },
      '3': { title: 'Officer Scrutiny', crumb: 'Portal / Official / Verification & Approval Desk' },
      '4': { title: 'Reports & SLA', crumb: 'Portal / Official / SLA Intelligence & Audit Logs' },
      '5': { title: 'System Control', crumb: 'Portal / Official / Node Governance & Security' }
    },
    navTitles: {
      '1': 'Admin Overview',
      '2': 'Department Ops',
      '3': 'Officer Scrutiny',
      '4': 'Reports & SLA',
      '5': 'System Control'
    }
  }
};

let currentRole = 'Citizen';
let activeTab = '1';
let scrollAnimationObserver = null;

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initUserProfile();
  initSidebarNavigation();
  initRoleSwitcher();
  
  // Set initial role & active tab
  setDashboardRole(currentRole, activeTab);
});

/**
 * Professional Government Portal Preloading Screen
 */
function initPreloader() {
  const preloader = document.getElementById('gov-preloader');
  if (!preloader) return;

  document.body.classList.add('preloader-active');

  // Trigger opening doors after 1.5 seconds hold
  setTimeout(() => {
    preloader.classList.add('open');
    document.body.classList.remove('preloader-active');

    // Remove preloader after transition finishes (total duration: 1.5-2 seconds)
    setTimeout(() => {
      preloader.classList.add('done');
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 550);
  }, 1500);
}

/**
 * User Profile Initialization and Session Storage Retrieval
 */
function initUserProfile() {
  let user = {
    name: 'Citizen User',
    email: 'citizen@gov.portal.in',
    role: 'Citizen',
    initials: 'CU'
  };

  // Check URL param first (?role=citizen or ?role=official)
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  if (roleParam) {
    if (roleParam.toLowerCase().includes('official') || roleParam.toLowerCase().includes('admin')) {
      currentRole = 'Government Official';
      user.name = 'Shri Rajesh Kumar, IAS';
      user.email = 'rajesh.kumar@nic.in';
      user.role = 'Government Official';
      user.initials = 'RK';
    } else {
      currentRole = 'Citizen';
      user.name = 'Ananya Sharma';
      user.email = 'ananya.sharma@gov.citizen.in';
      user.role = 'Citizen';
      user.initials = 'AS';
    }
  } else {
    try {
      const stored = localStorage.getItem('gov_portal_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) user.name = parsed.name;
        if (parsed.email) user.email = parsed.email;
        if (parsed.role) {
          user.role = parsed.role;
          if (parsed.role.toLowerCase().includes('official') || parsed.role.toLowerCase().includes('admin')) {
            currentRole = 'Government Official';
          } else {
            currentRole = 'Citizen';
          }
        }
        user.initials = parsed.initials || (user.name ? user.name.substring(0, 2).toUpperCase() : 'CU');
      } else {
        // Default sample if no session stored
        currentRole = 'Citizen';
        user.name = 'Ananya Sharma';
        user.email = 'ananya.sharma@gov.citizen.in';
        user.role = 'Citizen';
        user.initials = 'AS';
      }
    } catch (err) {
      console.warn('Session reading fallback', err);
    }
  }

  // Update Avatar Initials in topbar
  const avatarInitialsEl = document.getElementById('user-avatar-initials');
  if (avatarInitialsEl) avatarInitialsEl.textContent = user.initials;

  // Update Display Name in topbar
  const userNameEl = document.getElementById('user-display-name');
  if (userNameEl) userNameEl.textContent = user.name;

  // Update Email in topbar
  const userEmailEl = document.getElementById('user-display-email');
  if (userEmailEl) userEmailEl.textContent = user.email;

  // Update Dropdown Values
  const dropNameEl = document.getElementById('dropdown-user-name');
  if (dropNameEl) dropNameEl.textContent = user.name;

  const dropEmailEl = document.getElementById('dropdown-user-email');
  if (dropEmailEl) dropEmailEl.textContent = user.email;

  const dropRoleEl = document.getElementById('dropdown-user-role');
  if (dropRoleEl) dropRoleEl.textContent = user.role;

  // Profile Widget Click Toggle
  const profileWidget = document.getElementById('dash-user-profile-menu');
  if (profileWidget) {
    profileWidget.addEventListener('click', (e) => {
      e.stopPropagation();
      profileWidget.classList.toggle('menu-open');
    });

    document.addEventListener('click', () => {
      profileWidget.classList.remove('menu-open');
    });
  }

  // Logout / Sign Out action
  const logoutBtns = document.querySelectorAll('.action-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        localStorage.removeItem('gov_portal_session');
      } catch (err) {}
      window.location.href = 'login.html';
    });
  });
}

/**
 * Role Switcher Controller
 * Toggles between Citizen and Government Official modes
 */
function initRoleSwitcher() {
  const btnCitizen = document.getElementById('role-btn-citizen');
  const btnOfficial = document.getElementById('role-btn-official');
  const btnDropdownSwitch = document.getElementById('dropdown-role-switch-btn');

  if (btnCitizen) {
    btnCitizen.addEventListener('click', (e) => {
      e.stopPropagation();
      setDashboardRole('Citizen');
    });
  }

  if (btnOfficial) {
    btnOfficial.addEventListener('click', (e) => {
      e.stopPropagation();
      setDashboardRole('Government Official');
    });
  }

  if (btnDropdownSwitch) {
    btnDropdownSwitch.addEventListener('click', (e) => {
      e.stopPropagation();
      const newRole = currentRole === 'Citizen' ? 'Government Official' : 'Citizen';
      setDashboardRole(newRole);
      
      // Close dropdown menu
      const profileWidget = document.getElementById('dash-user-profile-menu');
      if (profileWidget) profileWidget.classList.remove('menu-open');
    });
  }
}

/**
 * Apply Dashboard Role
 * Updates headings, panel visibility, active pills, badges, and saves to localStorage
 */
function setDashboardRole(role, targetTab = null) {
  if (!ROLE_CONFIGS[role]) role = 'Citizen';
  currentRole = role;

  const config = ROLE_CONFIGS[role];

  // 1. Update Topbar Role Switcher Buttons
  const btnCitizen = document.getElementById('role-btn-citizen');
  const btnOfficial = document.getElementById('role-btn-official');

  if (btnCitizen && btnOfficial) {
    if (role === 'Citizen') {
      btnCitizen.classList.add('active');
      btnOfficial.classList.remove('active');
    } else {
      btnOfficial.classList.add('active');
      btnCitizen.classList.remove('active');
    }
  }

  // 2. Update Sidebar Headings
  for (let i = 1; i <= 5; i++) {
    const titleEl = document.getElementById(`tab-title-${i}`);
    if (titleEl && config.navTitles[i]) {
      titleEl.textContent = config.navTitles[i];
    }
  }

  // 3. Update Dropdown Elements
  const dropRoleEl = document.getElementById('dropdown-user-role');
  if (dropRoleEl) dropRoleEl.textContent = role;

  const btnDropdownSwitch = document.getElementById('dropdown-role-switch-btn');
  if (btnDropdownSwitch) {
    btnDropdownSwitch.innerHTML = `
      <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
      </svg>
      <span>${config.switchBtnText}</span>
    `;
  }

  // 4. Update Portal Badge if present
  const portalBadgeEl = document.getElementById('dash-role-badge');
  if (portalBadgeEl) {
    portalBadgeEl.textContent = config.portalBadge;
  }

  // 5. Toggle Content Panel Groups
  const panelCitizenGroup = document.getElementById('panel-group-citizen');
  const panelOfficialGroup = document.getElementById('panel-group-official');

  if (role === 'Citizen') {
    if (panelCitizenGroup) panelCitizenGroup.style.display = 'block';
    if (panelOfficialGroup) panelOfficialGroup.style.display = 'none';
  } else {
    if (panelOfficialGroup) panelOfficialGroup.style.display = 'block';
    if (panelCitizenGroup) panelCitizenGroup.style.display = 'none';
  }

  // 6. Update LocalStorage session
  try {
    const stored = localStorage.getItem('gov_portal_session');
    let session = stored ? JSON.parse(stored) : {};
    session.role = role;
    if (role === 'Citizen' && (!session.name || session.name.includes('IAS') || session.name.includes('Admin'))) {
      session.name = 'Ananya Sharma';
      session.email = 'ananya.sharma@gov.citizen.in';
      session.initials = 'AS';
    } else if (role === 'Government Official' && (!session.name || session.name.includes('Ananya') || session.name.includes('Citizen'))) {
      session.name = 'Shri Rajesh Kumar, IAS';
      session.email = 'rajesh.kumar@nic.in';
      session.initials = 'RK';
    }
    localStorage.setItem('gov_portal_session', JSON.stringify(session));

    // Update displayed names to match
    const userNameEl = document.getElementById('user-display-name');
    if (userNameEl && session.name) userNameEl.textContent = session.name;

    const userEmailEl = document.getElementById('user-display-email');
    if (userEmailEl && session.email) userEmailEl.textContent = session.email;

    const avatarInitialsEl = document.getElementById('user-avatar-initials');
    if (avatarInitialsEl && session.initials) avatarInitialsEl.textContent = session.initials;

    const dropNameEl = document.getElementById('dropdown-user-name');
    if (dropNameEl && session.name) dropNameEl.textContent = session.name;

    const dropEmailEl = document.getElementById('dropdown-user-email');
    if (dropEmailEl && session.email) dropEmailEl.textContent = session.email;
  } catch (err) {}

  // 7. Activate Selected Tab
  const destTab = targetTab || activeTab || '1';
  switchTab(destTab);
}

/**
 * Switch Active Tab (1 to 5)
 */
function switchTab(tabNum) {
  activeTab = String(tabNum);
  const config = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS['Citizen'];

  // Update active sidebar nav button
  const navBtns = document.querySelectorAll('.sidebar-nav-btn');
  navBtns.forEach(b => {
    if (b.getAttribute('data-tab') === activeTab) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  // Update Topbar Title & Breadcrumb
  const pageTitleEl = document.getElementById('dash-current-title');
  const pageBreadcrumbEl = document.getElementById('dash-current-crumb');

  const tabInfo = config.tabs[activeTab];
  if (tabInfo) {
    if (pageTitleEl) {
      pageTitleEl.textContent = tabInfo.title;
      pageTitleEl.dataset.origText = tabInfo.title;
      initLetterAnimation(pageTitleEl.parentElement);
    }
    if (pageBreadcrumbEl) {
      pageBreadcrumbEl.textContent = tabInfo.crumb;
    }
  }

  // Deactivate all view panels in both groups
  const allPanels = document.querySelectorAll('.dash-view-panel');
  allPanels.forEach(p => p.classList.remove('active'));

  // Determine prefix based on current role
  const prefix = currentRole === 'Citizen' ? 'citizen' : 'official';
  const targetPanel = document.getElementById(`view-${prefix}-${activeTab}`);

  if (targetPanel) {
    targetPanel.classList.add('active');

    // Scroll immediately to top so new view begins smoothly
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Reset visibility on all section cards in target panel
    targetPanel.querySelectorAll('.dash-section-card').forEach(card => {
      card.classList.remove('is-visible');
    });

    // Trigger letter-by-letter entrance on headings in active panel
    initLetterAnimation(targetPanel);

    // Re-initialize scroll observer for the newly active panel
    initScrollAnimations();
  }
}

/**
 * Sidebar Navigation & Mobile Drawer Controller
 */
function initSidebarNavigation() {
  const sidebar = document.getElementById('dash-sidebar');
  const toggleBtn = document.getElementById('dash-sidebar-toggle') || document.querySelector('.dash-sidebar-toggle');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const backdrop = document.getElementById('dash-sidebar-backdrop');

  function openSidebar() {
    if (sidebar) {
      sidebar.classList.add('mobile-open');
      sidebar.classList.remove('collapsed');
      if (backdrop) backdrop.classList.add('active');
      document.body.classList.add('sidebar-open-lock');
    }
  }

  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('sidebar-open-lock');
      if (window.innerWidth <= 992) {
        sidebar.classList.add('collapsed');
      }
    }
  }

  // Hamburger toggle button (placed on the left of Stackly logo in topbar)
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains('mobile-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  // Mobile cross mark close button (placed near Stackly inside sidebar header)
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  // Backdrop overlay click to dismiss
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeSidebar();
    });
  }

  // Start with sidebar closed on mobile screens
  if (window.innerWidth <= 992 && sidebar) {
    sidebar.classList.add('collapsed');
    sidebar.classList.remove('mobile-open');
  }

  // Handle window resizing cleanly
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      closeSidebar();
      if (sidebar) sidebar.classList.remove('collapsed');
    }
  });

  // Nav buttons click handler
  const navBtns = document.querySelectorAll('.sidebar-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabNum = btn.getAttribute('data-tab');
      if (!tabNum) return;

      switchTab(tabNum);

      // On mobile screens, close full-width sidebar after clicking
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });
}

/**
 * Scroll-Triggered Slide Animations for the 4 Sections
 * Section 1 & 3: Slide from Left on Scroll
 * Section 2 & 4: Slide from Right on Scroll
 */
function initScrollAnimations() {
  if (scrollAnimationObserver) {
    scrollAnimationObserver.disconnect();
  }

  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.dash-section-card').forEach(card => {
      card.classList.add('is-visible');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // When card leaves the viewport from the bottom (user scrolls back up),
        // remove is-visible so it can animate again when scrolled down to.
        const rect = entry.boundingClientRect;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top > vh) {
          entry.target.classList.remove('is-visible');
        }
      }
    });
  }, observerOptions);

  // Observe all section cards in the active view panel
  const activePanel = document.querySelector('.dash-view-panel.active');
  if (activePanel) {
    const cards = activePanel.querySelectorAll('.dash-section-card');
    cards.forEach(card => {
      scrollAnimationObserver.observe(card);
    });
  }
}

/**
 * Letter-by-Letter Entrance Animation from the Right Side
 * Each letter slides sequentially from translateX(35px) to position (0)
 */
function initLetterAnimation(root = document) {
  const headings = root.querySelectorAll('.dash-card-title, .dash-section-tag, #dash-current-title');
  
  headings.forEach(heading => {
    // Preserve original text
    if (!heading.dataset.origText) {
      heading.dataset.origText = heading.textContent.trim();
    }
    const text = heading.dataset.origText;
    heading.innerHTML = '';

    const words = text.split(/\s+/);
    let globalIndex = 0;

    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'anim-heading-word';

      for (let i = 0; i < word.length; i++) {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'anim-letter-right';
        letterSpan.textContent = word[i];
        // Stagger each letter's entry from the right side
        letterSpan.style.animationDelay = `${(globalIndex * 0.024).toFixed(3)}s`;
        wordSpan.appendChild(letterSpan);
        globalIndex++;
      }

      heading.appendChild(wordSpan);

      // Preserve space between words
      if (wIdx < words.length - 1) {
        heading.appendChild(document.createTextNode(' '));
      }
    });
  });
}
