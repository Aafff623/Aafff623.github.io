(function () {
  var config = {
    colorDot: "#ffffff", // 粒子颜色（白色）
    colorLine: "#cccccc", // 连线颜色（深灰）
    dotRadius: 2.2, // 粒子半径
    lineMaxDist: 180, // 连线最大距离
    dotCount: 50, // 粒子数量
    lineWidth: 1, // 连线宽度
    speed: 0.18, // 粒子速度
  };
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var w = (canvas.width = window.innerWidth);
  var h = (canvas.height = window.innerHeight);
  canvas.style.cssText =
    "position:fixed;top:0;left:0;z-index:-1;opacity:1;pointer-events:none;background:#fff";
  document.body.appendChild(canvas);
  var dots = [];
  for (var i = 0; i < config.dotCount; i++) {
    dots.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
    });
  }
  var mouse = { x: null, y: null, paused: false };
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.paused = false;
  });
  window.addEventListener("mouseout", function () {
    mouse.x = null;
    mouse.y = null;
    mouse.paused = true;
  });
  window.addEventListener("click", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var dist = Math.sqrt(
        (d.x - mouse.x) * (d.x - mouse.x) + (d.y - mouse.y) * (d.y - mouse.y)
      );
      if (dist < config.lineMaxDist * 1.2) {
        var angle = Math.atan2(d.y - mouse.y, d.x - mouse.x);
        d.vx += Math.cos(angle) * config.speed * 2.5;
        d.vy += Math.sin(angle) * config.speed * 2.5;
      }
    }
  });
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      if (mouse.x !== null && mouse.y !== null && !mouse.paused) {
        var distMouse = Math.sqrt(
          (d.x - mouse.x) * (d.x - mouse.x) + (d.y - mouse.y) * (d.y - mouse.y)
        );
        if (distMouse < config.lineMaxDist * 0.8) {
          var angle = Math.atan2(mouse.y - d.y, mouse.x - d.x);
          d.vx += Math.cos(angle) * config.speed * 0.08;
          d.vy += Math.sin(angle) * config.speed * 0.08;
        }
      }
      if (mouse.paused && mouse.x !== null && mouse.y !== null) {
        var distMouse = Math.sqrt(
          (d.x - mouse.x) * (d.x - mouse.x) + (d.y - mouse.y) * (d.y - mouse.y)
        );
        if (distMouse < config.lineMaxDist * 0.7) {
          var angle = Math.atan2(mouse.y - d.y, mouse.x - d.x);
          d.vx += Math.cos(angle) * config.speed * 0.04;
          d.vy += Math.sin(angle) * config.speed * 0.04;
        }
      }
      // 绘制粒子
      ctx.beginPath();
      ctx.arc(d.x, d.y, config.dotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = config.colorDot;
      // 粒子的发光效果和模拟程度
      ctx.shadowColor = "#9575cd";
      ctx.shadowBlur = 15;

      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.shadowBlur = 0;
      // 绘制连线
      for (var j = i + 1; j < dots.length; j++) {
        var d2 = dots[j];
        var dist = Math.sqrt(
          (d.x - d2.x) * (d.x - d2.x) + (d.y - d2.y) * (d.y - d2.y)
        );
        if (dist < config.lineMaxDist) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d2.x, d2.y);
          ctx.strokeStyle = config.colorLine;
          ctx.globalAlpha = 0.7 - (dist / config.lineMaxDist) * 0.7;
          ctx.lineWidth = config.lineWidth;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      // 鼠标连线
      if (mouse.x !== null && mouse.y !== null) {
        var distMouse = Math.sqrt(
          (d.x - mouse.x) * (d.x - mouse.x) + (d.y - mouse.y) * (d.y - mouse.y)
        );
        if (distMouse < config.lineMaxDist) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = "#9575cd";
          ctx.globalAlpha = 0.8 - (distMouse / config.lineMaxDist) * 0.8;
          ctx.lineWidth = config.lineWidth + 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener("resize", function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
})();

// 暗色模式适配
(function () {
  // 检测暗色模式
  var isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  var config = isDark
    ? {
        colorDot: "#b39ddb", // 暗色模式粒子（浅紫）
        colorLine: "#9575cd", // 暗色模式连线（紫色）
        dotRadius: 2.5,
        lineMaxDist: 180,
        dotCount: 50,
        lineWidth: 1.2,
        speed: 0.18,
        bgColor: "#232526", // 暗色背景
        shadowColor: "#b39ddb",
      }
    : {
        colorDot: "#ffffff", // 亮色模式粒子（白色）
        colorLine: "#cccccc", // 亮色模式连线（浅灰）
        dotRadius: 2.2,
        lineMaxDist: 180,
        dotCount: 50,
        lineWidth: 1,
        speed: 0.18,
        bgColor: "#fff", // 亮色背景
        shadowColor: "#9575cd",
      };

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var w = (canvas.width = window.innerWidth);
  var h = (canvas.height = window.innerHeight);
  canvas.style.cssText =
    "position:fixed;top:0;left:0;z-index:-1;opacity:1;pointer-events:none;background:" +
    config.bgColor;
  document.body.appendChild(canvas);

  var dots = [];
  for (var i = 0; i < config.dotCount; i++) {
    dots.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
    });
  }
  var mouse = { x: null, y: null, paused: false };
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.paused = false;
  });
  window.addEventListener("mouseout", function () {
    mouse.x = null;
    mouse.y = null;
    mouse.paused = true;
  });
  window.addEventListener("click", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var dist = Math.sqrt(
        (d.x - mouse.x) * (d.x - mouse.x) + (d.y - mouse.y) * (d.y - mouse.y)
      );
      if (dist < config.lineMaxDist * 1.2) {
        var angle = Math.atan2(d.y - mouse.y, d.x - mouse.x);
        d.vx += Math.cos(angle) * config.speed * 2.5;
        d.vy += Math.sin(angle) * config.speed * 2.5;
      }
    }
  });
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      if (mouse.x !== null && mouse.y !== null && !mouse.paused) {
        var distMouse = Math.sqrt(
          (d.x - mouse.x) * (d.x - mouse.x) + (d.y - mouse.y) * (d.y - mouse.y)
        );
        if (distMouse < config.lineMaxDist * 0.8) {
          var angle = Math.atan2(mouse.y - d.y, mouse.x - d.x);
          d.vx += Math.cos(angle) * config.speed * 0.08;
          d.vy += Math.sin(angle) * config.speed * 0.08;
        }
      }
      if (mouse.paused && mouse.x !== null && mouse.y !== null) {
        var distMouse = Math.sqrt(
          (d.x - mouse.x) * (d.x - mouse.x) + (d.y - mouse.y) * (d.y - mouse.y)
        );
        if (distMouse < config.lineMaxDist * 0.7) {
          var angle = Math.atan2(mouse.y - d.y, mouse.x - d.x);
          d.vx += Math.cos(angle) * config.speed * 0.04;
          d.vy += Math.sin(angle) * config.speed * 0.04;
        }
      }
      // 绘制粒子
      ctx.beginPath();
      ctx.arc(d.x, d.y, config.dotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = config.colorDot;
      ctx.shadowColor = config.shadowColor;
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.shadowBlur = 0;
      // 绘制连线
      for (var j = i + 1; j < dots.length; j++) {
        var d2 = dots[j];
        var dist = Math.sqrt(
          (d.x - d2.x) * (d.x - d2.x) + (d.y - d2.y) * (d.y - d2.y)
        );
        if (dist < config.lineMaxDist) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d2.x, d2.y);
          ctx.strokeStyle = config.colorLine;
          ctx.globalAlpha = 0.7 - (dist / config.lineMaxDist) * 0.7;
          ctx.lineWidth = config.lineWidth;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      // 鼠标连线
      if (mouse.x !== null && mouse.y !== null) {
        var distMouse = Math.sqrt(
          (d.x - mouse.x) * (d.x - mouse.x) + (d.y - mouse.y) * (d.y - mouse.y)
        );
        if (distMouse < config.lineMaxDist) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = config.shadowColor;
          ctx.globalAlpha = 0.8 - (distMouse / config.lineMaxDist) * 0.8;
          ctx.lineWidth = config.lineWidth + 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener("resize", function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
})();

// js控制弹出菜单
document.getElementById("menu-btn").onclick = function () {
  document.getElementById("sidebar").classList.toggle("active");
};
