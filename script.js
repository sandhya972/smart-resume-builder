/**
 * Smart Resume Builder - Core Application Script
 * Developer: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initial state setup
  initApp();
});

// Base64 storage for local photo upload
let uploadedPhotoBase64 = '';

// Cache DOM Elements
const elements = {
  themeToggle: document.getElementById('theme-toggle'),
  selectTemplate: document.getElementById('select-template'),
  resumePreview: document.getElementById('resume-preview'),
  btnDemoData: document.getElementById('btn-demo-data'),
  btnClearForm: document.getElementById('btn-clear-form'),
  btnGenerateResume: document.getElementById('btn-generate-resume'),
  btnDownloadPdf: document.getElementById('btn-download-pdf'),
  
  // Editor Lists
  educationList: document.getElementById('education-list'),
  projectsList: document.getElementById('projects-list'),
  certificationsList: document.getElementById('certifications-list'),
  
  // Editor Form Inputs
  fullname: document.getElementById('input-fullname'),
  title: document.getElementById('input-title'),
  email: document.getElementById('input-email'),
  phone: document.getElementById('input-phone'),
  location: document.getElementById('input-location'),
  website: document.getElementById('input-website'),
  summary: document.getElementById('input-summary'),
  skills: document.getElementById('input-skills'),
  linkedin: document.getElementById('input-linkedin'),
  github: document.getElementById('input-github'),
  inputPhoto: document.getElementById('input-photo'),
  btnUploadPhoto: document.getElementById('btn-upload-photo'),
  btnRemovePhoto: document.getElementById('btn-remove-photo'),
  photoFilename: document.getElementById('photo-filename'),
  
  // Buttons
  btnAddEducation: document.getElementById('btn-add-education'),
  btnAddProject: document.getElementById('btn-add-project'),
  btnAddCertification: document.getElementById('btn-add-certification'),
};

/**
 * Initialize the application and bind event listeners
 */
function initApp() {
  // Theme Toggle (Dark/Light Mode)
  elements.themeToggle.addEventListener('click', toggleTheme);
  
  // Load initial theme from localStorage if available
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Accordion Logic (Global function exposed below)
  
  // Template Selector
  elements.selectTemplate.addEventListener('change', (e) => {
    updateTemplateClass(e.target.value);
    updatePreview();
  });
  
  // Color Accent Picker
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      // Remove active from all options
      colorOptions.forEach(opt => opt.classList.remove('active'));
      // Add active to current
      e.target.classList.add('active');
      
      const selectedColor = e.target.getAttribute('data-color');
      setAccentColor(selectedColor);
    });
  });
  
  // Repeatable Field Add Buttons
  elements.btnAddEducation.addEventListener('click', () => {
    addEducationField();
    updatePreview();
  });
  
  elements.btnAddProject.addEventListener('click', () => {
    addProjectField();
    updatePreview();
  });
  
  elements.btnAddCertification.addEventListener('click', () => {
    addCertificationField();
    updatePreview();
  });
  
  // Real-time update binding for text inputs
  const textInputs = [
    elements.fullname, elements.title, elements.email, 
    elements.phone, elements.location, elements.website, 
    elements.linkedin, elements.github,
    elements.summary, elements.skills
  ];
  
  textInputs.forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  
  // Live listener on container to capture dynamic inputs
  document.getElementById('resume-form').addEventListener('input', (e) => {
    if (e.target.classList.contains('input-field')) {
      updatePreview();
    }
  });

  // Action Buttons
  elements.btnDemoData.addEventListener('click', loadDemoData);
  elements.btnGenerateResume.addEventListener('click', () => {
    updatePreview();
    // Scroll preview into view on mobile
    elements.resumePreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Add success feedback
    const originalText = elements.btnGenerateResume.innerHTML;
    elements.btnGenerateResume.innerHTML = '<i class="fa-solid fa-circle-check"></i> Generated!';
    const originalBg = elements.btnGenerateResume.style.backgroundColor;
    const originalColor = elements.btnGenerateResume.style.color;
    elements.btnGenerateResume.style.backgroundColor = '#10b981';
    elements.btnGenerateResume.style.color = 'white';
    setTimeout(() => {
      elements.btnGenerateResume.innerHTML = originalText;
      elements.btnGenerateResume.style.backgroundColor = originalBg;
      elements.btnGenerateResume.style.color = originalColor;
    }, 1500);
  });
  // Profile Photo Upload Handling
  elements.btnUploadPhoto.addEventListener('click', () => {
    elements.inputPhoto.click();
  });

  elements.inputPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedPhotoBase64 = event.target.result;
        elements.photoFilename.textContent = file.name;
        elements.btnRemovePhoto.style.display = 'inline-flex';
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  elements.btnRemovePhoto.addEventListener('click', () => {
    uploadedPhotoBase64 = '';
    elements.inputPhoto.value = '';
    elements.photoFilename.textContent = 'No photo uploaded';
    elements.btnRemovePhoto.style.display = 'none';
    updatePreview();
  });

  // Landing Page CTA Button Scroll
  const btnCta = document.getElementById('btn-cta');
  if (btnCta) {
    btnCta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(btnCta.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  elements.btnDownloadPdf.addEventListener('click', triggerDownloadPdf);
  
  // Clear Form Event Listener
  elements.btnClearForm.addEventListener('click', () => {
    // Reset personal details inputs
    elements.fullname.value = '';
    elements.title.value = '';
    elements.email.value = '';
    elements.phone.value = '';
    elements.location.value = '';
    elements.website.value = '';
    elements.linkedin.value = '';
    elements.github.value = '';
    elements.summary.value = '';
    elements.skills.value = '';
    
    // Reset profile photo state
    uploadedPhotoBase64 = '';
    elements.inputPhoto.value = '';
    elements.photoFilename.textContent = 'No photo uploaded';
    elements.btnRemovePhoto.style.display = 'none';
    
    // Remove all repeatable cards
    elements.educationList.innerHTML = '';
    elements.projectsList.innerHTML = '';
    elements.certificationsList.innerHTML = '';
    
    // Refresh live preview (will display default placeholder values)
    updatePreview();
    
    // Scroll editor to top
    elements.fullname.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Success feedback
    const originalText = elements.btnClearForm.innerHTML;
    elements.btnClearForm.innerHTML = '<i class="fa-solid fa-circle-check"></i> Cleared!';
    setTimeout(() => {
      elements.btnClearForm.innerHTML = originalText;
    }, 1200);
  });
  
  // Preload the candidate's actual details by default so recruiters see a completed resume instantly
  loadDemoData();
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

/**
 * Handle accordion expanding/collapsing
 */
window.toggleAccordion = function(accordionId) {
  const accordion = document.getElementById(accordionId);
  const isActive = accordion.classList.contains('active');
  
  // Collapse all accordions in editor
  const allAccordions = document.querySelectorAll('.accordion');
  allAccordions.forEach(acc => acc.classList.remove('active'));
  
  // Toggle current accordion
  if (!isActive) {
    accordion.classList.add('active');
  }
};

/**
 * Switch template style class on the paper preview container
 */
function updateTemplateClass(templateName) {
  elements.resumePreview.className = `resume-paper template-${templateName}`;
}

/**
 * Adjust the CSS accent variables on the preview container
 */
function setAccentColor(colorHex) {
  elements.resumePreview.style.setProperty('--resume-accent', colorHex);
  
  // Pre-calculate light and dark counterparts for printing contrast
  let lightColor = colorHex + '1a'; // Default 10% alpha in hex
  let darkColor = colorHex;
  
  if (colorHex === '#2563eb') { // Royal Blue
    lightColor = '#e6f0ff';
    darkColor = '#1d4ed8';
  } else if (colorHex === '#059669') { // Emerald
    lightColor = '#e6f4ea';
    darkColor = '#047857';
  } else if (colorHex === '#7c3aed') { // Purple
    lightColor = '#f5f3ff';
    darkColor = '#6d28d9';
  } else if (colorHex === '#e11d48') { // Crimson
    lightColor = '#fff1f2';
    darkColor = '#be123c';
  } else if (colorHex === '#4b5563') { // Charcoal
    lightColor = '#f3f4f6';
    darkColor = '#374151';
  }
  
  elements.resumePreview.style.setProperty('--resume-accent-light', lightColor);
  elements.resumePreview.style.setProperty('--resume-accent-dark', darkColor);
}

/**
 * Generate and download PDF using html2pdf.js
 */
function triggerDownloadPdf() {
  const element = document.getElementById('resume-preview');
  const btn = elements.btnDownloadPdf;
  const originalHtml = btn.innerHTML;
  
  // Visual feedback: show spinner
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Exporting PDF...';
  
  // Apply CSS class that removes card shadows/borders during export
  element.classList.add('pdf-export-mode');
  
  const opt = {
    margin: 0,
    filename: `${(elements.fullname.value.trim() || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      letterRendering: true
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // html2pdf workflow
  html2pdf()
    .from(element)
    .set(opt)
    .save()
    .then(() => {
      element.classList.remove('pdf-export-mode');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Downloaded!';
      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 2000);
    })
    .catch(err => {
      console.error('PDF Generation Error:', err);
      element.classList.remove('pdf-export-mode');
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Error!';
      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 2000);
    });
}

/**
 * Generate unique IDs for repeatable cards
 */
function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

/* ==========================================================================
   DYNAMIC FORM FIELD MANAGERS
   ========================================================================== */

/**
 * Render dynamic item card HTML template
 */
function createCardWrapper(id, listType, titleLabel, fieldsHtml) {
  const card = document.createElement('div');
  card.className = 'repeated-item-card';
  card.id = id;
  card.dataset.type = listType;
  
  card.innerHTML = `
    <div class="repeated-item-header">
      <span class="repeated-item-title">${titleLabel}</span>
      <div class="repeated-item-actions">
        <button type="button" class="btn btn-secondary btn-icon btn-sm" onclick="moveItem('${id}', 'up')" title="Move Up" aria-label="Move Up">
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button type="button" class="btn btn-secondary btn-icon btn-sm" onclick="moveItem('${id}', 'down')" title="Move Down" aria-label="Move Down">
          <i class="fa-solid fa-arrow-down"></i>
        </button>
        <button type="button" class="btn btn-danger btn-icon btn-sm" onclick="removeItem('${id}')" title="Delete" aria-label="Delete">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
    <div class="repeated-item-fields">
      ${fieldsHtml}
    </div>
  `;
  return card;
}

/**
 * Add Education Form Card
 */
function addEducationField(data = {}) {
  const id = generateId();
  const fields = `
    <div class="form-group" style="margin-bottom: 0.75rem;">
      <label>School / Institution</label>
      <input type="text" class="input-field edu-school" placeholder="e.g. Stanford University" value="${data.school || ''}">
    </div>
    <div class="form-row" style="margin-bottom: 0.75rem;">
      <div class="form-group">
        <label>Degree / Program</label>
        <input type="text" class="input-field edu-degree" placeholder="e.g. BS Computer Science" value="${data.degree || ''}">
      </div>
      <div class="form-group">
        <label>Location</label>
        <input type="text" class="input-field edu-location" placeholder="e.g. Stanford, CA" value="${data.location || ''}">
      </div>
    </div>
    <div class="form-row" style="margin-bottom: 0.75rem;">
      <div class="form-group">
        <label>Start Date</label>
        <input type="text" class="input-field edu-start" placeholder="e.g. Sep 2018" value="${data.start || ''}">
      </div>
      <div class="form-group">
        <label>End Date</label>
        <input type="text" class="input-field edu-end" placeholder="e.g. Jun 2022 / Present" value="${data.end || ''}">
      </div>
    </div>
    <div class="form-group">
      <label>Description / Honors</label>
      <textarea class="input-field edu-desc" placeholder="Details about your curriculum, GPA, activities..." style="height: 60px;">${data.desc || ''}</textarea>
    </div>
  `;
  const card = createCardWrapper(id, 'education', 'Education Entry', fields);
  elements.educationList.appendChild(card);
}

/**
 * Add Project Form Card
 */
function addProjectField(data = {}) {
  const id = generateId();
  const fields = `
    <div class="form-row" style="margin-bottom: 0.75rem;">
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" class="input-field proj-title" placeholder="e.g. E-Commerce Platform" value="${data.title || ''}">
      </div>
      <div class="form-group">
        <label>Role / Position</label>
        <input type="text" class="input-field proj-role" placeholder="e.g. Lead Developer" value="${data.role || ''}">
      </div>
    </div>
    <div class="form-row" style="margin-bottom: 0.75rem;">
      <div class="form-group">
        <label>Project Link / URL</label>
        <input type="url" class="input-field proj-link" placeholder="e.g. https://myproject.com" value="${data.link || ''}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Start Date</label>
          <input type="text" class="input-field proj-start" placeholder="e.g. Jan 2023" value="${data.start || ''}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="text" class="input-field proj-end" placeholder="e.g. Present" value="${data.end || ''}">
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Project Details / Responsibilities</label>
      <textarea class="input-field proj-desc" placeholder="Describe what you built, stack used, and achievements..." style="height: 80px;">${data.desc || ''}</textarea>
    </div>
  `;
  const card = createCardWrapper(id, 'projects', 'Project / Experience Entry', fields);
  elements.projectsList.appendChild(card);
}

/**
 * Add Certification Form Card
 */
function addCertificationField(data = {}) {
  const id = generateId();
  const fields = `
    <div class="form-row" style="margin-bottom: 0.75rem;">
      <div class="form-group">
        <label>Certification Name</label>
        <input type="text" class="input-field cert-name" placeholder="e.g. AWS Certified Solutions Architect" value="${data.name || ''}">
      </div>
      <div class="form-group">
        <label>Issuing Organization</label>
        <input type="text" class="input-field cert-org" placeholder="e.g. Amazon Web Services" value="${data.org || ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Date Earned</label>
        <input type="text" class="input-field cert-date" placeholder="e.g. Dec 2022" value="${data.date || ''}">
      </div>
      <div class="form-group">
        <label>Credential Link / Info</label>
        <input type="text" class="input-field cert-link" placeholder="e.g. ID: 129A8C or Verification URL" value="${data.link || ''}">
      </div>
    </div>
  `;
  const card = createCardWrapper(id, 'certifications', 'Certification Entry', fields);
  elements.certificationsList.appendChild(card);
}

/**
 * Remove repeatable item card
 */
window.removeItem = function(id) {
  const card = document.getElementById(id);
  if (card) {
    card.remove();
    updatePreview();
  }
};

/**
 * Re-order items (Move Up/Down)
 */
window.moveItem = function(id, direction) {
  const card = document.getElementById(id);
  if (!card) return;
  
  const parent = card.parentNode;
  if (direction === 'up') {
    const prev = card.previousElementSibling;
    if (prev) {
      parent.insertBefore(card, prev);
    }
  } else if (direction === 'down') {
    const next = card.nextElementSibling;
    if (next) {
      parent.insertBefore(next, card);
    }
  }
  
  // Flash animation to show position changed
  card.style.transform = 'scale(1.02)';
  setTimeout(() => {
    card.style.transform = 'none';
  }, 200);
  
  updatePreview();
};

/* ==========================================================================
   LIVE PREVIEW RENDERER
   ========================================================================== */

/**
 * Reads data from Form Editor and renders the Resume Paper HTML
 */
function updatePreview() {
  // 1. Read values from personal fields
  const data = {
    fullname: elements.fullname.value.trim() || 'Your Name',
    title: elements.title.value.trim() || 'Professional Subtitle',
    email: elements.email.value.trim() || 'email@example.com',
    phone: elements.phone.value.trim() || '+1 (555) 000-0000',
    location: elements.location.value.trim() || 'City, State',
    website: elements.website.value.trim() || '',
    linkedin: elements.linkedin.value.trim() || '',
    github: elements.github.value.trim() || '',
    photo: uploadedPhotoBase64,
    summary: elements.summary.value.trim() || 'A brief summary about your professional path, career goals, and experience highlights.',
    skills: elements.skills.value.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
  };

  // 2. Read Education items
  data.education = [];
  const eduCards = elements.educationList.querySelectorAll('.repeated-item-card');
  eduCards.forEach(card => {
    data.education.push({
      school: card.querySelector('.edu-school').value.trim(),
      degree: card.querySelector('.edu-degree').value.trim(),
      location: card.querySelector('.edu-location').value.trim(),
      start: card.querySelector('.edu-start').value.trim(),
      end: card.querySelector('.edu-end').value.trim(),
      desc: card.querySelector('.edu-desc').value.trim()
    });
  });

  // 3. Read Project items
  data.projects = [];
  const projCards = elements.projectsList.querySelectorAll('.repeated-item-card');
  projCards.forEach(card => {
    data.projects.push({
      title: card.querySelector('.proj-title').value.trim(),
      role: card.querySelector('.proj-role').value.trim(),
      link: card.querySelector('.proj-link').value.trim(),
      start: card.querySelector('.proj-start').value.trim(),
      end: card.querySelector('.proj-end').value.trim(),
      desc: card.querySelector('.proj-desc').value.trim()
    });
  });

  // 4. Read Certification items
  data.certifications = [];
  const certCards = elements.certificationsList.querySelectorAll('.repeated-item-card');
  certCards.forEach(card => {
    data.certifications.push({
      name: card.querySelector('.cert-name').value.trim(),
      org: card.querySelector('.cert-org').value.trim(),
      date: card.querySelector('.cert-date').value.trim(),
      link: card.querySelector('.cert-link').value.trim()
    });
  });

  // 5. Select template layout and output markup
  const template = elements.selectTemplate.value;
  
  if (template === 'creative') {
    elements.resumePreview.innerHTML = renderCreativeTemplate(data);
  } else if (template === 'classic') {
    elements.resumePreview.innerHTML = renderClassicTemplate(data);
  } else {
    elements.resumePreview.innerHTML = renderModernTemplate(data);
  }
}

/**
 * Render Modern Sleek Template
 */
function renderModernTemplate(data) {
  // Generate contact details with professional icons
  let contactHtml = '';
  if (data.email) contactHtml += `<span class="resume-contact-item"><i class="fa-solid fa-envelope"></i> <a href="mailto:${data.email}" style="text-decoration:none;color:inherit;">${data.email}</a></span>`;
  if (data.phone) contactHtml += `<span class="resume-contact-item"><i class="fa-solid fa-phone"></i> ${data.phone}</span>`;
  if (data.location) contactHtml += `<span class="resume-contact-item"><i class="fa-solid fa-location-dot"></i> ${data.location}</span>`;
  if (data.website) {
    const displayWeb = data.website.replace(/^(https?:\/\/)?(www\.)?/, '');
    contactHtml += `<span class="resume-contact-item"><i class="fa-solid fa-globe"></i> <a href="${data.website}" target="_blank" style="text-decoration:none;color:inherit;">${displayWeb}</a></span>`;
  }
  if (data.linkedin) {
    const displayLinkedIn = data.linkedin.replace(/^(https?:\/\/)?(www\.)?(linkedin\.com\/in\/)?/, '');
    contactHtml += `<span class="resume-contact-item"><i class="fa-brands fa-linkedin"></i> <a href="${data.linkedin}" target="_blank" style="text-decoration:none;color:inherit;">${displayLinkedIn}</a></span>`;
  }
  if (data.github) {
    const displayGitHub = data.github.replace(/^(https?:\/\/)?(www\.)?(github\.com\/)?/, '');
    contactHtml += `<span class="resume-contact-item"><i class="fa-brands fa-github"></i> <a href="${data.github}" target="_blank" style="text-decoration:none;color:inherit;">${displayGitHub}</a></span>`;
  }

  // Generate education
  let eduHtml = '';
  if (data.education.length > 0) {
    const itemsHtml = data.education.map(edu => `
      <div class="resume-item">
        <div class="resume-item-header">
          <div class="resume-item-title">${edu.school || 'Institution'}</div>
          <div class="resume-item-date">${edu.start || ''} ${edu.start && edu.end ? '–' : ''} ${edu.end || ''}</div>
        </div>
        <div class="resume-item-header">
          <div class="resume-item-subtitle">${edu.degree || 'Degree'} ${edu.location ? `, ${edu.location}` : ''}</div>
        </div>
        ${edu.desc ? `<div class="resume-item-description">${edu.desc}</div>` : ''}
      </div>
    `).join('');
    
    eduHtml = `
      <section class="resume-section">
        <div class="resume-section-title">Education</div>
        <div class="resume-grid">${itemsHtml}</div>
      </section>
    `;
  }

  // Generate skills
  let skillsHtml = '';
  if (data.skills.length > 0) {
    const badgesHtml = data.skills.map(s => `<span class="skill-badge">${s}</span>`).join('');
    skillsHtml = `
      <section class="resume-section">
        <div class="resume-section-title">Skills</div>
        <div class="skills-container">${badgesHtml}</div>
      </section>
    `;
  }

  // Generate projects
  let projHtml = '';
  if (data.projects.length > 0) {
    const itemsHtml = data.projects.map(proj => {
      const displayLink = proj.link ? proj.link.replace(/^(https?:\/\/)?(www\.)?/, '') : '';
      return `
        <div class="resume-item">
          <div class="resume-item-header">
            <div class="resume-item-title">
              ${proj.title || 'Project Title'}
              ${proj.link ? ` <a href="${proj.link}" target="_blank" style="font-size:8pt;font-weight:normal;color:var(--resume-accent);margin-left:0.5rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${displayLink}</a>` : ''}
            </div>
            <div class="resume-item-date">${proj.start || ''} ${proj.start && proj.end ? '–' : ''} ${proj.end || ''}</div>
          </div>
          ${proj.role ? `<div class="resume-item-subtitle">${proj.role}</div>` : ''}
          ${proj.desc ? `<div class="resume-item-description">${proj.desc}</div>` : ''}
        </div>
      `;
    }).join('');

    projHtml = `
      <section class="resume-section">
        <div class="resume-section-title">Projects & Experience</div>
        <div class="resume-grid">${itemsHtml}</div>
      </section>
    `;
  }

  // Generate certifications
  let certHtml = '';
  if (data.certifications.length > 0) {
    const itemsHtml = data.certifications.map(cert => `
      <div class="resume-item">
        <div class="resume-item-header">
          <div class="resume-item-title">${cert.name || 'Certification Name'}</div>
          <div class="resume-item-date">${cert.date || ''}</div>
        </div>
        <div class="resume-item-header">
          <div class="resume-item-subtitle">${cert.org || ''} ${cert.link ? `• <span style="font-size:8.5pt;color:#64748b;">${cert.link}</span>` : ''}</div>
        </div>
      </div>
    `).join('');

    certHtml = `
      <section class="resume-section">
        <div class="resume-section-title">Certifications</div>
        <div class="resume-grid">${itemsHtml}</div>
      </section>
    `;
  }

  let photoHtml = '';
  if (data.photo) {
    photoHtml = `<img src="${data.photo}" class="resume-photo" alt="Profile Photo">`;
  }

  return `
    <header class="resume-header" style="${data.photo ? 'display: flex; gap: 1.5rem; align-items: center;' : ''}">
      ${photoHtml}
      <div style="flex: 1;">
        <h1 class="resume-name" style="margin: 0; line-height: 1.15;">${data.fullname}</h1>
        <div style="font-size: 11pt; font-weight: 600; color: var(--resume-accent); margin-top: 0.25rem;">${data.title}</div>
        <div class="resume-contact" style="margin-top: 0.35rem;">
          ${contactHtml}
        </div>
      </div>
    </header>
    
    ${data.summary ? `
    <section class="resume-section">
      <div class="resume-section-title">Profile Summary</div>
      <p class="resume-item-description" style="font-size: 10pt; line-height: 1.6;">${data.summary}</p>
    </section>
    ` : ''}

    ${projHtml}
    ${eduHtml}
    ${skillsHtml}
    ${certHtml}
  `;
}

/**
 * Render Classic Executive Template
 */
function renderClassicTemplate(data) {
  // Generate contact details with professional icons
  let contactHtml = '';
  if (data.email) contactHtml += `<span class="resume-contact-item"><i class="fa-solid fa-envelope"></i> <a href="mailto:${data.email}" style="text-decoration:none;color:inherit;">${data.email}</a></span>`;
  if (data.phone) contactHtml += `<span class="resume-contact-item"><i class="fa-solid fa-phone"></i> ${data.phone}</span>`;
  if (data.location) contactHtml += `<span class="resume-contact-item"><i class="fa-solid fa-location-dot"></i> ${data.location}</span>`;
  if (data.website) {
    const displayWeb = data.website.replace(/^(https?:\/\/)?(www\.)?/, '');
    contactHtml += `<span class="resume-contact-item"><i class="fa-solid fa-globe"></i> <a href="${data.website}" target="_blank" style="text-decoration:none;color:inherit;">${displayWeb}</a></span>`;
  }
  if (data.linkedin) {
    const displayLinkedIn = data.linkedin.replace(/^(https?:\/\/)?(www\.)?(linkedin\.com\/in\/)?/, '');
    contactHtml += `<span class="resume-contact-item"><i class="fa-brands fa-linkedin"></i> <a href="${data.linkedin}" target="_blank" style="text-decoration:none;color:inherit;">${displayLinkedIn}</a></span>`;
  }
  if (data.github) {
    const displayGitHub = data.github.replace(/^(https?:\/\/)?(www\.)?(github\.com\/)?/, '');
    contactHtml += `<span class="resume-contact-item"><i class="fa-brands fa-github"></i> <a href="${data.github}" target="_blank" style="text-decoration:none;color:inherit;">${displayGitHub}</a></span>`;
  }

  // Generate education
  let eduHtml = '';
  if (data.education.length > 0) {
    const itemsHtml = data.education.map(edu => `
      <div class="resume-item" style="margin-bottom: 0.5rem;">
        <div class="resume-item-header">
          <div class="resume-item-title" style="font-style: italic;">${edu.school || 'Institution'}</div>
          <div class="resume-item-date">${edu.start || ''} ${edu.start && edu.end ? '–' : ''} ${edu.end || ''}</div>
        </div>
        <div class="resume-item-header">
          <div class="resume-item-subtitle" style="font-weight: normal; color: #1e293b;">${edu.degree || 'Degree'} ${edu.location ? `— ${edu.location}` : ''}</div>
        </div>
        ${edu.desc ? `<div class="resume-item-description" style="margin-top: 0.125rem;">${edu.desc}</div>` : ''}
      </div>
    `).join('');
    
    eduHtml = `
      <section class="resume-section">
        <div class="resume-section-title" style="text-align: center; justify-content: center;">Education</div>
        <div class="resume-grid">${itemsHtml}</div>
      </section>
    `;
  }

  // Generate skills
  let skillsHtml = '';
  if (data.skills.length > 0) {
    const skillsString = data.skills.join(', ');
    skillsHtml = `
      <section class="resume-section">
        <div class="resume-section-title" style="text-align: center; justify-content: center;">Skills</div>
        <div class="skills-container" style="display:block; text-align: center;">${skillsString}</div>
      </section>
    `;
  }

  // Generate projects
  let projHtml = '';
  if (data.projects.length > 0) {
    const itemsHtml = data.projects.map(proj => `
      <div class="resume-item" style="margin-bottom: 0.5rem;">
        <div class="resume-item-header">
          <div class="resume-item-title">
            ${proj.title || 'Project Title'}
            ${proj.link ? ` <span style="font-size: 8pt; font-weight: normal; font-family: var(--font-resume-sans);">[<a href="${proj.link}" target="_blank" style="text-decoration:none;color:inherit;">Link</a>]</span>` : ''}
          </div>
          <div class="resume-item-date">${proj.start || ''} ${proj.start && proj.end ? '–' : ''} ${proj.end || ''}</div>
        </div>
        ${proj.role ? `<div class="resume-item-subtitle" style="font-weight: normal; font-style: italic;">${proj.role}</div>` : ''}
        ${proj.desc ? `<div class="resume-item-description" style="margin-top: 0.125rem;">${proj.desc}</div>` : ''}
      </div>
    `).join('');

    projHtml = `
      <section class="resume-section">
        <div class="resume-section-title" style="text-align: center; justify-content: center;">Professional Experience</div>
        <div class="resume-grid">${itemsHtml}</div>
      </section>
    `;
  }

  // Generate certifications
  let certHtml = '';
  if (data.certifications.length > 0) {
    const itemsHtml = data.certifications.map(cert => `
      <div class="resume-item" style="margin-bottom: 0.35rem;">
        <div class="resume-item-header">
          <div class="resume-item-title">${cert.name || 'Certification Name'}</div>
          <div class="resume-item-date">${cert.date || ''}</div>
        </div>
        <div class="resume-item-header">
          <div class="resume-item-subtitle" style="font-weight: normal; color: #1e293b;">${cert.org || ''} ${cert.link ? `— ${cert.link}` : ''}</div>
        </div>
      </div>
    `).join('');

    certHtml = `
      <section class="resume-section">
        <div class="resume-section-title" style="text-align: center; justify-content: center;">Certifications</div>
        <div class="resume-grid">${itemsHtml}</div>
      </section>
    `;
  }

  return `
    <header class="resume-header">
      ${data.photo ? `<img src="${data.photo}" class="resume-photo" alt="Profile Photo">` : ''}
      <h1 class="resume-name" style="margin: 0;">${data.fullname}</h1>
      <div style="font-size: 11pt; font-style: italic; color: #475569; text-align: center; margin-top: 0.25rem;">${data.title}</div>
      <div class="resume-contact">
        ${contactHtml}
      </div>
    </header>
    
    ${data.summary ? `
    <section class="resume-section">
      <div class="resume-section-title" style="text-align: center; justify-content: center;">Executive Summary</div>
      <p class="resume-item-description" style="text-align: center; line-height: 1.5; font-size: 9.5pt;">${data.summary}</p>
    </section>
    ` : ''}

    ${projHtml}
    ${eduHtml}
    ${skillsHtml}
    ${certHtml}
  `;
}

/**
 * Render Creative Tech (Two Column) Template
 */
function renderCreativeTemplate(data) {
  // Generate left column contact
  let contactHtml = '';
  if (data.email) contactHtml += `<div class="sidebar-contact-item"><i class="fa-solid fa-envelope"></i> <a href="mailto:${data.email}" style="color:inherit;text-decoration:none;">${data.email}</a></div>`;
  if (data.phone) contactHtml += `<div class="sidebar-contact-item"><i class="fa-solid fa-phone"></i> ${data.phone}</div>`;
  if (data.location) contactHtml += `<div class="sidebar-contact-item"><i class="fa-solid fa-location-dot"></i> ${data.location}</div>`;
  if (data.website) {
    const displayWeb = data.website.replace(/^(https?:\/\/)?(www\.)?/, '');
    contactHtml += `<div class="sidebar-contact-item"><i class="fa-solid fa-globe"></i> <a href="${data.website}" target="_blank" style="color:inherit;text-decoration:none;">${displayWeb}</a></div>`;
  }
  if (data.linkedin) {
    const displayLinkedIn = data.linkedin.replace(/^(https?:\/\/)?(www\.)?(linkedin\.com\/in\/)?/, '');
    contactHtml += `<div class="sidebar-contact-item"><i class="fa-brands fa-linkedin"></i> <a href="${data.linkedin}" target="_blank" style="color:inherit;text-decoration:none;">${displayLinkedIn}</a></div>`;
  }
  if (data.github) {
    const displayGitHub = data.github.replace(/^(https?:\/\/)?(www\.)?(github\.com\/)?/, '');
    contactHtml += `<div class="sidebar-contact-item"><i class="fa-brands fa-github"></i> <a href="${data.github}" target="_blank" style="color:inherit;text-decoration:none;">${displayGitHub}</a></div>`;
  }

  // Generate left column skills
  let skillsHtml = '';
  if (data.skills.length > 0) {
    const listHtml = data.skills.map(s => `<div class="sidebar-skill-badge">${s}</div>`).join('');
    skillsHtml = `
      <div>
        <h3 class="sidebar-section-title">Skills</h3>
        <div class="sidebar-skills">${listHtml}</div>
      </div>
    `;
  }

  // Generate left column certifications
  let certHtml = '';
  if (data.certifications.length > 0) {
    const listHtml = data.certifications.map(cert => `
      <div class="sidebar-cert-item">
        <div class="sidebar-cert-title">${cert.name}</div>
        <div class="sidebar-cert-detail">${cert.org || ''} ${cert.date ? `(${cert.date})` : ''}</div>
      </div>
    `).join('');
    
    certHtml = `
      <div>
        <h3 class="sidebar-section-title">Certifications</h3>
        <div class="sidebar-certifications">${listHtml}</div>
      </div>
    `;
  }

  // Generate right column projects
  let projHtml = '';
  if (data.projects.length > 0) {
    const itemsHtml = data.projects.map(proj => {
      const displayLink = proj.link ? proj.link.replace(/^(https?:\/\/)?(www\.)?/, '') : '';
      return `
        <div class="resume-item">
          <div class="resume-item-header">
            <div class="resume-item-title">
              ${proj.title || 'Project Title'}
              ${proj.link ? ` <a href="${proj.link}" target="_blank" style="font-size:7.5pt;font-weight:normal;color:var(--resume-accent);margin-left:0.3rem;"><i class="fa-solid fa-link"></i></a>` : ''}
            </div>
            <div class="resume-item-date">${proj.start || ''} ${proj.start && proj.end ? '–' : ''} ${proj.end || ''}</div>
          </div>
          ${proj.role ? `<div class="resume-item-subtitle">${proj.role}</div>` : ''}
          ${proj.desc ? `<div class="resume-item-description" style="font-size:9pt;">${proj.desc}</div>` : ''}
        </div>
      `;
    }).join('');

    projHtml = `
      <section class="resume-section">
        <div class="resume-section-title">Projects & Experience</div>
        <div class="resume-grid">${itemsHtml}</div>
      </section>
    `;
  }

  // Generate right column education
  let eduHtml = '';
  if (data.education.length > 0) {
    const itemsHtml = data.education.map(edu => `
      <div class="resume-item">
        <div class="resume-item-header">
          <div class="resume-item-title">${edu.school || 'Institution'}</div>
          <div class="resume-item-date">${edu.start || ''} ${edu.start && edu.end ? '–' : ''} ${edu.end || ''}</div>
        </div>
        <div class="resume-item-header">
          <div class="resume-item-subtitle">${edu.degree || 'Degree'} ${edu.location ? `, ${edu.location}` : ''}</div>
        </div>
        ${edu.desc ? `<div class="resume-item-description" style="font-size:9pt;">${edu.desc}</div>` : ''}
      </div>
    `).join('');

    eduHtml = `
      <section class="resume-section">
        <div class="resume-section-title">Education</div>
        <div class="resume-grid">${itemsHtml}</div>
      </section>
    `;
  }

  return `
    <div class="creative-wrapper">
      <!-- Sidebar Panel (Dark) -->
      <aside class="creative-sidebar">
        ${data.photo ? `<img src="${data.photo}" class="resume-photo" alt="Profile Photo">` : ''}
        <div>
          <h1 class="resume-name" style="margin-bottom:0.25rem;">${data.fullname}</h1>
          <div style="font-size:9pt;font-weight:700;color:var(--resume-accent);text-transform:uppercase;letter-spacing:1px;">${data.title}</div>
        </div>
        
        <div>
          <h3 class="sidebar-section-title">Contact</h3>
          <div class="sidebar-contact">${contactHtml}</div>
        </div>
        
        ${skillsHtml}
        ${certHtml}
      </aside>
      
      <!-- Main Content Panel (Light) -->
      <div class="creative-main">
        ${data.summary ? `
        <section class="resume-section" style="margin-bottom:1rem;">
          <div class="resume-section-title">Profile Summary</div>
          <p class="resume-item-description" style="font-size:9.5pt;line-height:1.5;margin-top:0.25rem;">${data.summary}</p>
        </section>
        ` : ''}
        
        ${projHtml}
        ${eduHtml}
      </div>
    </div>
  `;
}

/**
 * Populates the builder form with Yerragudi Sandhya's actual profile details
 * and triggers a live preview refresh. This helps recruiters view the completed
 * resume immediately on page load, while still allowing the form to be cleared.
 */
function loadDemoData() {
  // Clear any existing repeatable fields first to prevent duplication
  elements.educationList.innerHTML = '';
  elements.projectsList.innerHTML = '';
  elements.certificationsList.innerHTML = '';
  
  // Set personal details form inputs
  elements.fullname.value = 'Yerragudi Sandhya';
  elements.title.value = 'Aspiring Software Engineer | Computer Science Student';
  elements.email.value = 'yerragudisandhya71@gmail.com';
  elements.phone.value = '6300319675';
  elements.location.value = 'Kurnool, Andhra Pradesh';
  elements.website.value = '';
  elements.linkedin.value = 'https://www.linkedin.com/in/YOUR-LINKEDIN';
  elements.github.value = 'https://github.com/YOUR-GITHUB-USERNAME';
  
  // Cache check for summary element
  elements.summary = document.getElementById('input-summary');
  elements.summary.value = 'Aspiring Software Engineer and Computer Science student with strong foundations in C++, Python, DSA, DBMS, and Full Stack Development. Passionate about building real-world software solutions and actively seeking software development internships.';
  
  // Core technical skills string
  elements.skills.value = 'C, C++, Python, HTML, CSS, JavaScript, Flask, SQL, GitHub, VS Code';
  
  // Education entry data
  const educationData = [
    {
      school: 'SRM University, Amaravati',
      degree: 'B.Tech in Computer Science Engineering',
      location: 'Amaravati, AP',
      start: '2022',
      end: '2026 (Expected)',
      desc: 'Current Cumulative Grade Point Average (CGPA): 9.3/10. Relevant coursework: Data Structures and Algorithms (DSA), Database Management Systems (DBMS), Software Engineering, and Web Development.'
    }
  ];
  
  // Project listing data
  const projectsData = [
    {
      title: 'Smart Complaint Management System',
      role: 'Full Stack Developer',
      link: '',
      start: '2024',
      end: '2024',
      desc: 'Designed and implemented a responsive web portal to streamline public grievance registration and status tracking. Built secure authentication, database logging, and automated notification alerts.'
    },
    {
      title: 'Nivesha – Smart Space Rental Platform',
      role: 'Backend & Database Engineer',
      link: '',
      start: '2023',
      end: '2024',
      desc: 'Developed a peer-to-peer space booking and rental solution using Flask, HTML/CSS, and SQL database engines. Programmed location search queries, host/tenant dashboards, and property listing managers.'
    },
    {
      title: 'IBM Data Analytics Project',
      role: 'Data Analyst',
      link: '',
      start: '2024',
      end: '2024',
      desc: 'Conducted exploratory data analysis (EDA) and predictive modeling workflows on structured and unstructured datasets. Programmed analytical models and generated clean, visual dashboards to represent target KPIs.'
    }
  ];
  
  // Default certifications preloaded for candidate profile
  const certificationsData = [
    {
      name: 'Machine Learning Certification Course',
      org: 'Intellipaat',
      date: '2026',
      link: ''
    },
    {
      name: 'MongoDB Node.js Developer Path',
      org: 'SmartBridge',
      date: '2026',
      link: ''
    },
    {
      name: 'IBM Data Analytics Professional Certificate',
      org: 'IBM',
      date: '2025',
      link: ''
    }
  ];

  // Append education, projects, and certifications nodes to the form DOM
  educationData.forEach(edu => addEducationField(edu));
  projectsData.forEach(proj => addProjectField(proj));
  certificationsData.forEach(cert => addCertificationField(cert));

  // Render the filled resume onto the preview paper pane
  updatePreview();
}
