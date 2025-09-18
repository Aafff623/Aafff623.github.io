// 菜单弹出动画控制
document.addEventListener("DOMContentLoaded", function () {
  var menuBtn = document.getElementById("menu-btn");
  var sidebar = document.getElementById("sidebar");
  if (menuBtn && sidebar) {
    menuBtn.onclick = function () {
      sidebar.classList.toggle("active");
    };
  }
});
// 技术栈标签自适应
const techTagList = [
  "JavaSE/MySQL/JDBC",
  "HTML/CSS/JavaScript",
  "Bootstrap/Tailwind CSS",
  "Git/Gitee",
  "Spring Boot",
  "Vue",
  "React",
  "Docker",
  "Linux",
  "算法",
  "LeetCode",
];

function renderTechTags() {
  const tags = document.getElementById("techTags");
  tags.innerHTML = "";
  techTagList.forEach((tag) => {
    const el = document.createElement("span");
    el.className = "tech-tag";
    el.textContent = tag;
    tags.appendChild(el);
  });
  // 自适应标签区域
  if (tags.scrollHeight > 120) {
    tags.classList.add("small");
    tags.classList.add("expanded");
  } else if (tags.scrollHeight > 60) {
    tags.classList.add("small");
    tags.classList.remove("expanded");
  } else {
    tags.classList.remove("small");
    tags.classList.remove("expanded");
  }
}

// 技术栈关系图节点数据
const techNodesRaw = [
  { id: 1, title: "Java", desc: "后端核心", checked: true },
  { id: 2, title: "Spring Boot", desc: "服务框架" },
  { id: 3, title: "MySQL", desc: "数据库" },
  { id: 4, title: "前端", desc: "React/Vue" },
  { id: 5, title: "Docker", desc: "容器化" },
  { id: 6, title: "GitHub", desc: "代码托管", checked: true },
];

const techLinks = [
  [1, 2],
  [2, 3],
  [1, 4],
  [1, 5],
  [5, 6],
];

function getResponsiveNodes(stageW, stageH) {
  const w = stageW;
  const h = stageH;
  return [
    { ...techNodesRaw[0], x: w * 0.08, y: h * 0.15 },
    { ...techNodesRaw[1], x: w * 0.45, y: h * 0.25 },
    { ...techNodesRaw[2], x: w * 0.25, y: h * 0.65 },
    { ...techNodesRaw[3], x: w * 0.12, y: h * 0.75 },
    { ...techNodesRaw[4], x: w * 0.75, y: h * 0.18 },
    { ...techNodesRaw[5], x: w * 0.75, y: h * 0.65 },
  ];
}

function renderTechGraph() {
  const graph = document.getElementById("techGraph");
  graph.innerHTML = "";
  const stageW = Math.max(graph.clientWidth, 1200);
  const stageH = Math.max(Math.floor(window.innerHeight * 0.5), 600);
  const stage = document.createElement("div");
  stage.className = "tech-stage";
  stage.style.width = stageW + "px";
  stage.style.height = stageH + "px";
  graph.appendChild(stage);

  const nodes = getResponsiveNodes(stageW, stageH);
  const line = document.createElement("canvas");
  line.className = "tech-link";
  line.width = stageW;
  line.height = stageH;
  line.style.position = "absolute";
  line.style.left = "0";
  line.style.top = "0";
  stage.appendChild(line);
  const lctx = line.getContext("2d");
  lctx.strokeStyle = "#38bdf8";
  lctx.lineWidth = 2;
  techLinks.forEach(([from, to]) => {
    const a = nodes.find((n) => n.id === from);
    const b = nodes.find((n) => n.id === to);
    if (!a || !b) return;
    lctx.beginPath();
    lctx.moveTo(a.x + 60, a.y + 24);
    lctx.lineTo(b.x + 60, b.y + 24);
    lctx.stroke();
  });
  nodes.forEach((node) => {
    const div = document.createElement("div");
    div.className = "tech-node" + (node.checked ? " checked" : "");
    div.style.left = node.x + "px";
    div.style.top = node.y + "px";
    div.innerHTML = `<div class="tech-node-title">${node.title}${
      node.checked
        ? ' <span style="font-size:1.2em;color:#fff;">&#10003;</span>'
        : ""
    }</div><div class="tech-node-desc">${node.desc}</div>`;
    stage.appendChild(div);
  });

  // 拖动画布（滚动graph来实现），支持鼠标与触摸
  let isDragging = false,
    startX = 0,
    startY = 0,
    scrollLeft = 0,
    scrollTop = 0;
  const startDrag = (x, y) => {
    isDragging = true;
    startX = x;
    startY = y;
    scrollLeft = graph.scrollLeft;
    scrollTop = graph.scrollTop;
    graph.style.cursor = "grabbing";
  };
  const onMove = (x, y) => {
    if (!isDragging) return;
    graph.scrollLeft = scrollLeft - (x - startX);
    graph.scrollTop = scrollTop - (y - startY);
  };
  const endDrag = () => {
    isDragging = false;
    graph.style.cursor = "grab";
  };

  graph.addEventListener("mousedown", (e) => startDrag(e.pageX, e.pageY));
  window.addEventListener("mousemove", (e) => onMove(e.pageX, e.pageY));
  window.addEventListener("mouseup", endDrag);
  graph.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      startDrag(t.pageX, t.pageY);
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      onMove(t.pageX, t.pageY);
    },
    { passive: true }
  );
  window.addEventListener("touchend", endDrag);

  graph.scrollLeft = (stageW - graph.clientWidth) / 2;
  graph.scrollTop = (stageH - graph.clientHeight) / 2;
}

// 项目弹窗逻辑
function showProjectModal() {
  document.getElementById("projectModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function hideProjectModal() {
  document.getElementById("projectModal").style.display = "none";
  document.body.style.overflow = "";
}

// 主题切换逻辑
function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById("themeIcon");
  const moonPath = themeIcon.querySelector(".moon-icon");
  const sunPaths = themeIcon.querySelectorAll(".sun-icon");

  if (isDark) {
    moonPath.style.display = "none";
    sunPaths.forEach((path) => (path.style.display = "block"));
  } else {
    moonPath.style.display = "block";
    sunPaths.forEach((path) => (path.style.display = "none"));
  }
}

function setTheme(isDark) {
  const theme = isDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeIcon(isDark);

  // 主题变化时重新初始化粒子背景
  if (window.particleBackground) {
    window.particleBackground.destroy();
  }
  window.particleBackground = new ParticleBackground(theme);
  window.particleBackground.init();
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  setTheme(savedTheme === "dark" || (!savedTheme && prefersDark));
}

// 事件监听器
function initEventListeners() {
  // 技术标签和图谱
  window.addEventListener("DOMContentLoaded", renderTechTags);
  window.addEventListener("resize", renderTechTags);
  window.addEventListener("DOMContentLoaded", renderTechGraph);
  window.addEventListener("resize", renderTechGraph);

  // 项目弹窗
  document.getElementById("projectShowBtn").onclick = showProjectModal;
  document.getElementById("projectLink").onclick = function (e) {
    e.preventDefault();
    showProjectModal();
  };
  document.getElementById("modalCloseBtn").onclick = hideProjectModal;
  document.getElementById("modalBg").onclick = function (e) {
    if (e.target === this) hideProjectModal();
  };

  // 确保项目链接可以正常工作
  document.addEventListener("DOMContentLoaded", function () {
    const projectLinks = document.querySelectorAll(".project-list a");
    projectLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        // 确保链接可以正常工作
        e.stopPropagation();
        console.log("Clicking project link:", this.href);
      });
    });
  });

  // 主题切换
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme !== "dark");
  });

  // 监听系统主题变化
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches);
      }
    });
}

// 粒子背景类
class ParticleBackground {
  constructor(theme) {
    this.theme = theme;
    this.config = this.getConfig(theme);
    this.canvas = null;
    this.ctx = null;
    this.dots = [];
    this.animationId = null;
    this.eventHandlers = {};
  }

  getConfig(theme) {
    return theme === "dark"
      ? {
          colorDot: "#b39ddb",
          colorLine: "#9575cd",
          dotRadius: 2.5,
          lineMaxDist: 180,
          dotCount: 50,
          lineWidth: 1.2,
          speed: 0.18,
          bgColor: "#232526",
          shadowColor: "#b39ddb",
        }
      : {
          colorDot: "#ffffff", // 粒子颜色（白色）
          colorLine: "#cccccc", // 连线颜色（浅灰）
          dotRadius: 2.2, // 粒子半径
          lineMaxDist: 180, // 连线最大距离
          dotCount: 50, // 粒子数量
          lineWidth: 1, // 连线宽度
          speed: 0.18, // 粒子速度
          bgColor: "#fff", // 背景色
          shadowColor: "#9575cd", // 发光色
        };
  }

  init() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.cssText =
      "position:fixed;top:0;left:0;z-index:-1;opacity:1;pointer-events:none;background:" +
      this.config.bgColor;
    document.body.appendChild(this.canvas);

    // 初始化粒子
    this.dots = [];
    for (let i = 0; i < this.config.dotCount; i++) {
      this.dots.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
      });
    }

    // 初始化鼠标状态
    this.mouse = { x: null, y: null, paused: false };

    // 绑定事件
    this.bindEvents();

    // 开始动画
    this.draw();
  }

  bindEvents() {
    // 鼠标移动事件
    this.eventHandlers.mousemove = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.paused = false;
    };

    // 鼠标离开事件
    this.eventHandlers.mouseout = () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.mouse.paused = true;
    };

    // 点击事件
    this.eventHandlers.click = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      for (let i = 0; i < this.dots.length; i++) {
        const d = this.dots[i];
        const dist = Math.sqrt(
          (d.x - this.mouse.x) * (d.x - this.mouse.x) +
            (d.y - this.mouse.y) * (d.y - this.mouse.y)
        );
        if (dist < this.config.lineMaxDist * 1.2) {
          const angle = Math.atan2(d.y - this.mouse.y, d.x - this.mouse.x);
          d.vx += Math.cos(angle) * this.config.speed * 2.5;
          d.vy += Math.sin(angle) * this.config.speed * 2.5;
        }
      }
    };

    // 窗口调整大小事件
    this.eventHandlers.resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };

    // 添加事件监听
    window.addEventListener("mousemove", this.eventHandlers.mousemove);
    window.addEventListener("mouseout", this.eventHandlers.mouseout);
    window.addEventListener("click", this.eventHandlers.click);
    window.addEventListener("resize", this.eventHandlers.resize);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.dots.length; i++) {
      const d = this.dots[i];
      d.x += d.vx;
      d.y += d.vy;

      // 边界检查
      if (d.x < 0 || d.x > this.canvas.width) d.vx *= -1;
      if (d.y < 0 || d.y > this.canvas.height) d.vy *= -1;

      // 鼠标互动
      if (
        this.mouse.x !== null &&
        this.mouse.y !== null &&
        !this.mouse.paused
      ) {
        const distMouse = Math.sqrt(
          (d.x - this.mouse.x) * (d.x - this.mouse.x) +
            (d.y - this.mouse.y) * (d.y - this.mouse.y)
        );
        if (distMouse < this.config.lineMaxDist * 0.8) {
          const angle = Math.atan2(this.mouse.y - d.y, this.mouse.x - d.x);
          d.vx += Math.cos(angle) * this.config.speed * 0.08;
          d.vy += Math.sin(angle) * this.config.speed * 0.08;
        }
      }

      if (this.mouse.paused && this.mouse.x !== null && this.mouse.y !== null) {
        const distMouse = Math.sqrt(
          (d.x - this.mouse.x) * (d.x - this.mouse.x) +
            (d.y - this.mouse.y) * (d.y - this.mouse.y)
        );
        if (distMouse < this.config.lineMaxDist * 0.7) {
          const angle = Math.atan2(this.mouse.y - d.y, this.mouse.x - d.x);
          d.vx += Math.cos(angle) * this.config.speed * 0.04;
          d.vy += Math.sin(angle) * this.config.speed * 0.04;
        }
      }

      // 绘制粒子
      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, this.config.dotRadius, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.config.colorDot;
      this.ctx.shadowColor = this.config.shadowColor;
      this.ctx.shadowBlur = 12;
      this.ctx.globalAlpha = 1;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // 绘制连线
      for (let j = i + 1; j < this.dots.length; j++) {
        const d2 = this.dots[j];
        const dist = Math.sqrt(
          (d.x - d2.x) * (d.x - d2.x) + (d.y - d2.y) * (d.y - d2.y)
        );
        if (dist < this.config.lineMaxDist) {
          this.ctx.beginPath();
          this.ctx.moveTo(d.x, d.y);
          this.ctx.lineTo(d2.x, d2.y);
          this.ctx.strokeStyle = this.config.colorLine;
          this.ctx.globalAlpha = 0.7 - (dist / this.config.lineMaxDist) * 0.7;
          this.ctx.lineWidth = this.config.lineWidth;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }
      }

      // 鼠标连线
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const distMouse = Math.sqrt(
          (d.x - this.mouse.x) * (d.x - this.mouse.x) +
            (d.y - this.mouse.y) * (d.y - this.mouse.y)
        );
        if (distMouse < this.config.lineMaxDist) {
          this.ctx.beginPath();
          this.ctx.moveTo(d.x, d.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = this.config.shadowColor;
          this.ctx.globalAlpha =
            0.8 - (distMouse / this.config.lineMaxDist) * 0.8;
          this.ctx.lineWidth = this.config.lineWidth + 0.5;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this.draw());
  }

  destroy() {
    // 停止动画
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // 移除事件监听
    if (this.eventHandlers.mousemove) {
      window.removeEventListener("mousemove", this.eventHandlers.mousemove);
      window.removeEventListener("mouseout", this.eventHandlers.mouseout);
      window.removeEventListener("click", this.eventHandlers.click);
      window.removeEventListener("resize", this.eventHandlers.resize);
    }

    // 移除画布
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// 初始化应用
function initApp() {
  initTheme();
  initEventListeners();

  // 初始化粒子背景
  const currentTheme = document.documentElement.getAttribute("data-theme");
  window.particleBackground = new ParticleBackground(currentTheme);
  window.particleBackground.init();
}

// 启动应用
document.addEventListener("DOMContentLoaded", initApp);

// 简单选中效果（仅前端展示，不存储）
document.querySelectorAll(".week-mood").forEach(function (moodBar) {
  moodBar.querySelectorAll(".mood-icon").forEach(function (icon) {
    icon.addEventListener("click", function () {
      moodBar.querySelectorAll(".mood-icon").forEach(function (i) {
        i.classList.remove("selected");
      });
      icon.classList.add("selected");
    });
  });
});

// Lottie动画初始化
document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("light-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/光照.json",
  });
});

document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("study-plan-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/气压.json",
  });
});

document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("carRun-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/lottie-iconfont/carCycle.json",
  });
});

document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("colorfulLoading-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/lottie-iconfont/colorfulLoading.json",
  });
});
