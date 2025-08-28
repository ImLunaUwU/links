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

    // Trigger Birthday Effect
    function showBirthdayBanner(message) {
      const banner = document.getElementById("birthdayBanner");
      banner.textContent = message;
      banner.style.display = "block";
      banner.style.background = "#ff4081";
      banner.style.color = "#fff";
      banner.style.textAlign = "center";
      banner.style.padding = "10px";
      banner.style.fontSize = "1rem";
      banner.style.fontWeight = "bold";
      banner.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
    }

    function triggerBirthdayEffect() {
      const canvas = document.createElement("canvas");
      canvas.id = "confetti";
      canvas.style.position = "fixed";
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "9999";
      document.body.appendChild(canvas);
    
      const ctx = canvas.getContext("2d");
      let W = (canvas.width = window.innerWidth);
      let H = (canvas.height = window.innerHeight);
    
      const confetti = [];
      const confettiCount = 100;
      const gravity = 0.15;
      const drag = 0.02;
      const terminalVelocity = 2.5;
    
      const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#577590", "#43aa8b"];
    
      window.addEventListener("resize", () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      });
    
      for (let i = 0; i < confettiCount; i++) {
        confetti.push({
          color: colors[Math.floor(Math.random() * colors.length)],
          x: Math.random() * W,
          y: Math.random() * -H,
          dx: Math.random() * 2 - 1,
          dy: Math.random() * 1,
          radius: Math.random() * 6 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 4,
          wobble: Math.random() * 2 * Math.PI,
          wobbleSpeed: 0.01 + Math.random() * 0.015,
          opacity: Math.random() * 0.5 + 0.4
        });
      }
    
      function drawConfetti() {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < confetti.length; i++) {
          const p = confetti[i];
    
          p.dy += gravity;
          p.dy = Math.min(p.dy, terminalVelocity);
          p.dx *= (1 - drag);
          p.x += p.dx + Math.cos(p.wobble);
          p.y += p.dy;
          p.rotation += p.rotationSpeed;
          p.wobble += p.wobbleSpeed;
    
          // Respawn when off screen
          if (p.y > H) {
            p.x = Math.random() * W;
            p.y = -20;
            p.dy = 0;
            p.dx = Math.random() * 2 - 1;
          }
    
          ctx.save();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.radius * 0.6, p.radius, p.rotation, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
    
        requestAnimationFrame(drawConfetti);
      }
    
      drawConfetti();
    
      setTimeout(() => {
        canvas.style.transition = "opacity 1.5s ease";
        canvas.style.opacity = 0;
        setTimeout(() => canvas.remove(), 2000);
      }, 12000);
    }

    // Profile
    document.getElementById("avatar").src = config.avatar;
    document.getElementById("name").textContent = config.name;

    // Time-based greeting
    const h = new Date().getHours();
    const greeting = h < 6 ? "Hello there, fellow insomniac!" : h < 12 ? "Good morning," : h < 18 ? "Good afternoon," : "Good evening,";
    document.getElementById("greeting").textContent = `${greeting} I’m ${config.name.split(" ")[0]} 🌙`;

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

    // Bio card & birthday effect 🎂
    const birthday = new Date(config.birthday.date);
    const now = new Date().toLocaleString("en-US", { timeZone: config.birthday.timezone });
    const today = new Date(now);
    
    // Normalize year for comparison
    const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    const diffMs = thisYearBirthday - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    let age = today.getFullYear() - birthday.getFullYear();
    if (diffDays > 0) age--; // hasn't had birthday yet this year
    
    const isToday = diffDays === 0;
    const isSoon = diffDays > 0 && diffDays <= 7;
    
    if (isToday) {
      triggerBirthdayEffect();
      showBirthdayBanner(`🎉 Today is ${config.name.split(" ")[0]}'s birthday! 🎉`);
    } else if (isSoon) {
      showBirthdayBanner(`🎂 It is ${config.name.split(" ")[0]}'s birthday in ${diffDays} day${diffDays > 1 ? "s" : ""}`);
    }
    
    // Info in profile
    document.getElementById("profileCard").innerHTML = `
      <p><strong>Alternative Names:</strong> ${config.profile.altnames}</p>
      <p><strong>Pronouns:</strong> ${config.profile.pronouns}</p>
      <p><strong>Location:</strong> ${config.profile.location}</p>
      <p><strong>Relationship:</strong> ${config.profile.relationship}</p>
      <p><strong>Age:</strong> ${age}</p>
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

// Next Con
if (config.nextCon && config.nextCon.name && config.nextCon.startDate && config.nextCon.endDate) {
  const tz =
    config.nextCon.timezone ||
    (config.birthday && config.birthday.timezone) ||
    "Europe/Copenhagen";

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
  const startDate = new Date(config.nextCon.startDate + "T00:00:00");
  const endDate   = new Date(config.nextCon.endDate   + "T23:59:59");

  const dayMs = 1000 * 60 * 60 * 24;
  const diffToStart   = Math.ceil((startDate - now) / dayMs);
  const diffToEnd     = Math.ceil((endDate   - now) / dayMs);
  const diffAfterEnd  = Math.floor((now - endDate) / dayMs);

  if (diffAfterEnd <= 3) {
    const conBanner = document.createElement("div");

    conBanner.id = "conBanner";
    conBanner.style.display = "block";
    conBanner.style.background = "linear-gradient(90deg, #5865F2, #404EED)";
    conBanner.style.color = "#fff";
    conBanner.style.textAlign = "center";
    conBanner.style.padding = "10px";
    conBanner.style.fontSize = "1rem";
    conBanner.style.fontWeight = "bold";
    conBanner.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
    conBanner.style.maxWidth = "100%";
    conBanner.style.boxSizing = "border-box";
    conBanner.style.overflow = "hidden";
    conBanner.style.wordBreak = "break-word";
    conBanner.style.overflowWrap = "anywhere"; 

    let msg = "";
    if (diffToStart > 0) {
      msg = `🎉 Next convention: ${config.nextCon.name} in ${diffToStart} day${diffToStart !== 1 ? "s" : ""} — ${config.nextCon.location}`;
    } else if (diffToStart <= 0 && diffToEnd >= 0) {
      msg = `🦊 ${config.nextCon.name} is happening now! — ${config.nextCon.location}`;
    } else {
      msg = `✨ ${config.nextCon.name} has ended — hope you had an amazing time in ${config.nextCon.location}!`;
    }
    conBanner.textContent = msg;

    document.body.prepend(conBanner);
  }
}

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
            <div class="dc-label">Current Status</div>
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
              <strong>${spotify.song}</strong><br><i>by</i><br>
              <strong><span>${spotify.artist}</span></strong>
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

    document.getElementById("secretFox").onclick = () => {
      const mediaContainer = document.createElement("div");
      mediaContainer.style.position = "fixed";
      mediaContainer.style.top = "50%";
      mediaContainer.style.left = "50%";
      mediaContainer.style.transform = "translate(-50%, -50%)";
      mediaContainer.style.zIndex = "10000";
      mediaContainer.style.background = "rgba(0,0,0,0.7)";
      mediaContainer.style.borderRadius = "16px";
      mediaContainer.style.padding = "16px";
      mediaContainer.style.boxShadow = "0 4px 16px rgba(0,0,0,0.4)";
      mediaContainer.style.display = "flex";
      mediaContainer.style.flexDirection = "column";
      mediaContainer.style.alignItems = "center";

      // Play audio
      const audio = new Audio("funky.mp3");
      audio.volume = 0.1;
      audio.play();

      // Show fox.gif or eepy.webp randomly
      let mediaEl;
      if (Math.random() < 0.5) {
        mediaEl = document.createElement("img");
        mediaEl.src = "fox.gif";
        mediaEl.alt = "Fox";
        mediaEl.style.maxWidth = "320px";
        mediaEl.style.borderRadius = "12px";
      } else {
        mediaEl = document.createElement("img");
        mediaEl.src = "eepy.webp";
        mediaEl.alt = "Eepy";
        mediaEl.style.maxWidth = "320px";
        mediaEl.style.borderRadius = "12px";
      }
      mediaContainer.appendChild(mediaEl);

      // Close button
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Close";
      closeBtn.style.marginTop = "12px";
      closeBtn.style.padding = "6px 18px";
      closeBtn.style.borderRadius = "8px";
      closeBtn.style.border = "none";
      closeBtn.style.background = "#ff4081";
      closeBtn.style.color = "#fff";
      closeBtn.style.fontWeight = "bold";
      closeBtn.style.cursor = "pointer";
      closeBtn.onclick = () => {
        audio.pause();
        mediaContainer.remove();
      };
      mediaContainer.appendChild(closeBtn);

      document.body.appendChild(mediaContainer);
    };