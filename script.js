fetch("config.json")
  .then(res => res.json())
  .then(config => {
    const body = document.body;

    // Theme memory
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) body.dataset.theme = savedTheme;

document.getElementById("themeToggle").onclick = () => {
  const newTheme = body.dataset.theme === "dark" ? "light" : "dark";
  body.dataset.theme = newTheme;
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
};

// Set icon on load
updateThemeIcon(body.dataset.theme);

function updateThemeIcon(theme) {
  const icon = theme === "dark" ? "☀️" : "🌙";
  document.getElementById("themeToggle").textContent = icon;
}


    // Profile
    document.getElementById("avatar").src = config.avatar;
    document.getElementById("name").textContent = config.name;

    // Time-based greeting
    const h = new Date().getHours();
    const greeting = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    document.getElementById("greeting").textContent = `${greeting}, I’m ${config.name.split(" ")[0]} 🌙`;

    // Typing effect
    const bioEl = document.getElementById("bio");
    let i = 0;
    const typeText = () => {
      if (i <= config.bio.length) {
        bioEl.textContent = config.bio.slice(0, i++);
        setTimeout(typeText, 40);
      }
    };
    typeText();

    // Profile card
    document.getElementById("profileCard").innerHTML = `
      <p><strong>Alternative Names:</strong> ${config.profile.altnames}</p>
      <p><strong>Pronouns:</strong> ${config.profile.pronouns}</p>
      <p><strong>Location:</strong> ${config.profile.location}</p>
    `;

    // Links
    const linksEl = document.getElementById("links");
    config.categories.forEach(cat => {
      // Add category title as a plain heading
      const title = document.createElement("h2");
      title.textContent = cat.name;
      title.className = "link-category-title"; // Optional for styling
      linksEl.appendChild(title);
    
      // Render links directly under the heading
      cat.links.forEach(link => {
        const a = document.createElement("a");
        a.className = "link-card";
        a.href = link.url;
        a.target = "_blank";
        a.innerHTML = `
          <div class="link-emoji">${link.emoji}</div>
          <div>
            <div><strong>${link.title}</strong></div>
            <div class="link-preview">${link.desc}</div>
          </div>`;
        linksEl.appendChild(a);
      });
    });

    // Discord status badge
if (config.discordId) {
  fetch(`https://api.lanyard.rest/v1/users/${config.discordId}`)
    .then(res => res.json())
    .then(data => {
      const d = data.data;
      const user = d.discord_user;
      const status = d.discord_status;
      const activities = d.activities || [];
      const flags = user.public_flags || 0;

      const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
      const decorationUrl = user.avatar_decoration
        ? `https://cdn.discordapp.com/avatar-decorations/${user.id}/${user.avatar_decoration}.png`
        : null;

      const statusColors = {
        online: "#43b581",
        idle: "#faa61a",
        dnd: "#f04747",
        offline: "#747f8d"
      };

      // BADGES (from public_flags)
      const flagBadges = {
        "64": "/svgs/hypesquadbravery.svg",
        "128": "/svgs/hypesquadbrilliance.svg",
        "256": "/svgs/hypesquadbalance.svg",
        "4194304": "/svgs/activedeveloper.svg"
      };

      let badgesHTML = "";
      for (const [bitmask, url] of Object.entries(flagBadges)) {
        if ((flags & bitmask) !== 0) {
          badgesHTML += `<img src="${url}" alt="badge" class="badge" />`;
        }
      }

      const customStatus = activities.find(a => a.type === 4);
      const gameActivity = activities.find(a => a.type === 0);
      const spotify = d.spotify;

      const statusCard = document.createElement("div");
      statusCard.className = "discord-card";

      statusCard.innerHTML = `
        <div class="dc-header">
          <div class="avatar-wrapper">
            <img src="${avatarUrl}" class="dc-avatar" />
            ${decorationUrl ? `<img src="${decorationUrl}" class="dc-deco" />` : ""}
          </div>
          <div>
            <div class="dc-name">
              ${user.username}
              <span class="dc-badges-inline">${badgesHTML}</span>
            </div>
            <div class="dc-server-tag">${config.serverTag || ""}</div>
            <div class="dc-statusline">
              <span class="dc-status-badge" style="background: ${statusColors[status]};"></span>
              <span class="dc-status-text">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          </div>
        </div>

        ${customStatus ? `
          <div class="dc-activity">
            <div class="dc-label">Custom Status</div>
            <div class="dc-content">
              ${customStatus.emoji?.id ? `
                <img class="emoji" src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? "gif" : "png"}" />
              ` : ""}
              ${customStatus.state || ""}
            </div>
          </div>
        ` : ""}

        ${gameActivity ? `
          <div class="dc-activity">
            <div class="dc-label">Playing</div>
            <div class="dc-content">
              ${gameActivity.name}
            </div>
          </div>
        ` : ""}

        ${spotify ? `
          <div class="dc-activity">
            <div class="dc-label">Listening to Spotify</div>
            <div class="dc-content">
              <strong>${spotify.song}</strong><br />
              <span>${spotify.artist}</span>
            </div>
          </div>
        ` : ""}
      `;

      document.getElementById("status").innerHTML = "";
      document.getElementById("status").appendChild(statusCard);
    });
}

    // Terminal mode toggle (optional button)
    if (config.bioStyle === "terminal") {
      bioEl.classList.add("terminal");
      bioEl.textContent = `$ whoami\n> ${config.bio}`;
    }
  });

// Background animation
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let w, h, particles = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function spawnParticles(count = 100) {
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1
  }));
}
spawnParticles();

function animate() {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(168, 168, 168, 0.5)";
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
animate();
