const API_URL = "http://localhost:5000/api"; // Change for production

// =====================
// DARK MODE TOGGLE
// =====================
const toggleButton = document.getElementById("themeToggle");
if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    html.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
  });
}

// =====================
// LANDING PAGE: Show Cards
// =====================
const projectsContainer = document.getElementById("projectsContainer");
if (projectsContainer) {
  fetch(`${API_URL}/projects`)
    .then((res) => res.json())
    .then((projects) => {
      projects.forEach((p) => {
        projectsContainer.innerHTML += `
          <div class="card animate">
            <img src="${p.imageUrl}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <button>Read More</button>
          </div>`;
      });
    });
}

const clientsContainer = document.getElementById("clientsContainer");
if (clientsContainer) {
  fetch(`${API_URL}/clients`)
    .then((res) => res.json())
    .then((clients) => {
      clients.forEach((c) => {
        clientsContainer.innerHTML += `
          <div class="card animate">
            <img src="${c.imageUrl}" alt="${c.name}">
            <p>"${c.description}"</p>
            <h4>${c.name}</h4>
            <small>${c.designation}</small>
          </div>`;
      });
    });
}

// =====================
// LANDING: Contact Form
// =====================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Thank you! Message sent.");
        this.reset();
      })
      .catch(() => alert("❌ Failed to send message."));
  });
}

// =====================
// LANDING: Newsletter
// =====================
const newsletterEmail = document.getElementById("newsletterEmail");
if (newsletterEmail) {
  const form = newsletterEmail.closest("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = newsletterEmail.value;
      fetch(`${API_URL}/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then(() => {
          alert("✅ Subscribed successfully!");
          newsletterEmail.value = "";
        })
        .catch(() => alert("❌ Subscription failed!"));
    });
  }
}

// =====================
// ADMIN: Section Toggling
// =====================
function showSection(sectionId) {
  const sections = [
    "projectsSection",
    "clientsSection",
    "subscribersSection",
    "contactsSection",
  ];
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === sectionId ? "block" : "none";
  });
}

// =====================
// ADMIN: Tables Loader
// =====================
function loadProjects() {
  const tbody = document.querySelector("#projectTable tbody");
  if (tbody) {
    fetch(`${API_URL}/projects`)
      .then((res) => res.json())
      .then((projects) => {
        tbody.innerHTML = "";
        projects.forEach((p) => {
          tbody.innerHTML += `
            <tr>
              <td>${p.name}</td>
              <td>${p.description}</td>
              <td><img src="${p.imageUrl}" width="50" /></td>
            </tr>`;
        });
      });
  }
}

function loadClients() {
  const tbody = document.querySelector("#clientTable tbody");
  if (tbody) {
    fetch(`${API_URL}/clients`)
      .then((res) => res.json())
      .then((clients) => {
        tbody.innerHTML = "";
        clients.forEach((c) => {
          tbody.innerHTML += `
            <tr>
              <td>${c.name}</td>
              <td>${c.description}</td>
              <td>${c.designation}</td>
              <td><img src="${c.imageUrl}" width="50" /></td>
            </tr>`;
        });
      });
  }
}

function loadSubscribers() {
  const tbody = document.querySelector("#subscriberTable tbody");
  if (tbody) {
    fetch(`${API_URL}/subscribers`)
      .then((res) => res.json())
      .then((subs) => {
        tbody.innerHTML = "";
        subs.forEach((s) => {
          const date = new Date(
            s.createdAt || s.date || Date.now()
          ).toLocaleDateString();
          tbody.innerHTML += `
            <tr>
              <td>${s.email}</td>
              <td>${date}</td>
            </tr>`;
        });
      });
  }
}

function loadContacts() {
  const tbody = document.querySelector("#contactTable tbody");
  if (tbody) {
    fetch(`${API_URL}/contacts`)
      .then((res) => res.json())
      .then((msgs) => {
        tbody.innerHTML = "";
        msgs.forEach((c) => {
          const date = new Date(
            c.createdAt || c.date || Date.now()
          ).toLocaleDateString();
          tbody.innerHTML += `
            <tr>
              <td>${c.name}</td>
              <td>${c.email}</td>
              <td>${c.mobile}</td>
              <td>${c.city}</td>
              <td>${date}</td>
            </tr>`;
        });
      });
  }
}

// =====================
// ADMIN: Form Submission
// =====================
const projectForm = document.getElementById("addProjectForm");
if (projectForm) {
  projectForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Project added!");
        this.reset();
        loadProjects();
      });
  });
}

const clientForm = document.getElementById("addClientForm");
if (clientForm) {
  clientForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Client added!");
        this.reset();
        loadClients();
      });
  });
}

// =====================
// ON LOAD (Admin Safe)
// =====================
window.onload = function () {
  // Try these only if tables exist (admin page)
  loadProjects();
  loadClients();
  loadSubscribers();
  loadContacts();

  // Default section (admin)
  const adminSection = document.getElementById("projectsSection");
  if (adminSection) {
    showSection("projectsSection");
  }
};
