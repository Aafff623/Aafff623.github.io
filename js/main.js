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

// 初始化应用
function initApp() {
  initTheme();
  initEventListeners();
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
document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("light-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/光照.json", // 你的动画json路径
  });
});
document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("study-plan-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/气压.json", // 你的动画json路径
  });
});

// 添加新的动画（例如飞行无人机）
document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("drone-animation"), // 新容器的 id
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/飞行无人机.json", // 新 JSON 文件路径
  });
});

document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("loading-animation"), // 新容器的 id
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/lottie-iconfont/加载loading5.json", // 修正路径
  });
});

document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("carRun-animation"), // 新容器的 id
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/lottie-iconfont/carCycle.json", // 修正路径
  });
});

document.addEventListener("DOMContentLoaded", function () {
  lottie.loadAnimation({
    container: document.getElementById("colorfulLoading-animation"), // 新容器的 id
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "json/lottie-iconfont/colorfulLoading.json", // 修正路径
  });
});



