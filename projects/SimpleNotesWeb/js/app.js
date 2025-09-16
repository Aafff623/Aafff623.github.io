// 初始化Quill编辑器
const quill = new Quill("#editor-container", {
  theme: "snow",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  },
  placeholder: "开始写作...",
});

// 数据管理
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  "工作",
  "个人",
  "学习",
];
let tags = JSON.parse(localStorage.getItem("tags")) || ["重要", "待办", "想法"];
let currentNoteId = null;
let deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || [];

// 保存数据到localStorage
function saveData() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("tags", JSON.stringify(tags));
  localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));
}

// 模块切换功能
function switchModule(moduleId) {
  [
    "module-notes",
    "module-category",
    "module-tags",
    "module-user",
    "module-recycle",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === moduleId ? "block" : "none";
  });

  // 如果切换到特定模块，刷新内容
  if (moduleId === "module-category") {
    renderCategoryManagement();
  } else if (moduleId === "module-tags") {
    renderTagManagement();
  } else if (moduleId === "module-recycle") {
    renderRecycleBin();
  }
}

// 侧边栏切换
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("notesSidebar");
  sidebar.classList.toggle("-translate-x-full");
});

// 主题切换
document.getElementById("themeToggle").addEventListener("click", () => {
  const html = document.documentElement;
  html.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    html.classList.contains("dark") ? "dark" : "light"
  );

  // 更新图标
  const icon = document.querySelector("#themeToggle i");
  if (html.classList.contains("dark")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }

  showToast(
    `已切换到${html.classList.contains("dark") ? "深色" : "浅色"}模式`,
    "success"
  );
});

// 初始化主题
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
  document.querySelector("#themeToggle i").classList.remove("fa-moon");
  document.querySelector("#themeToggle i").classList.add("fa-sun");
}

// 初始化界面
function initializeUI() {
  // 初始化笔记列表
  renderNotesList();

  // 初始化分类和标签
  renderCategories();
  renderTags();

  // 如果没有笔记，创建一个默认笔记
  if (notes.length === 0) {
    createNewNote();
  } else {
    loadNote(notes[0].id);
  }

  // 设置搜索功能
  setupSearch();

  // 设置字体大小选项
  setupFontSizeOptions();

  // 设置导出功能
  setupExportFunction();

  // 设置标签添加功能
  document
    .getElementById("add-tag-btn")
    .addEventListener("click", addTagToNote);

  // 设置标签搜索功能
  setupTagSearch();
}

// 渲染笔记列表
function renderNotesList(filteredNotes = null) {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  const notesToRender = filteredNotes || notes;

  notesToRender.forEach((note) => {
    if (!note.deleted) {
      // 不显示已删除的笔记
      const li = document.createElement("li");
      li.className =
        "note-item p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700";
      li.dataset.id = note.id;

      // 如果是当前笔记，添加active类
      if (currentNoteId === note.id) {
        li.classList.add("active");
      }

      li.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h3 class="font-medium truncate dark:text-white">${
                          note.title
                        }</h3>
                        <span class="text-xs text-gray-500 dark:text-gray-400">${formatDate(
                          note.created
                        )}</span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">${stripHtml(
                      note.content
                    ).substring(0, 50)}...</p>
                    <div class="flex mt-2">
                        ${
                          note.category
                            ? `<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 dark:bg-blue-900 dark:text-blue-200">${note.category}</span>`
                            : ""
                        }
                        ${
                          note.tags
                            ? note.tags
                                .map(
                                  (tag) =>
                                    `<span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded mr-2 dark:bg-indigo-900 dark:text-indigo-200">${tag}</span>`
                                )
                                .join("")
                            : ""
                        }
                    </div>
                `;
      li.addEventListener("click", () => loadNote(note.id));
      notesList.appendChild(li);
    }
  });

  document.getElementById(
    "notesCount"
  ).textContent = `${notesToRender.length} 条笔记`;
}

// 渲染分类
function renderCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const noteCategory = document.getElementById("noteCategory");

  // 清空现有选项（保留第一个选项）
  while (categoryFilter.options.length > 1) categoryFilter.remove(1);
  while (noteCategory.options.length > 1) noteCategory.remove(1);

  // 添加分类选项
  categories.forEach((category) => {
    const option1 = document.createElement("option");
    option1.value = category;
    option1.textContent = category;
    categoryFilter.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = category;
    option2.textContent = category;
    noteCategory.appendChild(option2);
  });

  // 添加分类筛选功能
  categoryFilter.addEventListener("change", (e) => {
    const category = e.target.value;
    if (category === "") {
      renderNotesList();
      document.getElementById("searchStatus").textContent = "全部";
    } else {
      const filteredNotes = notes.filter((note) => note.category === category);
      renderNotesList(filteredNotes);
      document.getElementById("searchStatus").textContent = `分类: ${category}`;
    }
  });
}

// 渲染标签
function renderTags() {
  const tagFilter = document.getElementById("tagFilter");
  const tagSelector = document.getElementById("tag-selector");

  // 清空现有选项（保留第一个选项）
  while (tagFilter.options.length > 1) tagFilter.remove(1);
  while (tagSelector.options.length > 1) tagSelector.remove(1);

  // 添加标签选项
  tags.forEach((tag) => {
    const option1 = document.createElement("option");
    option1.value = tag;
    option1.textContent = tag;
    tagFilter.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = tag;
    option2.textContent = tag;
    tagSelector.appendChild(option2);
  });

  // 添加标签筛选功能
  tagFilter.addEventListener("change", (e) => {
    const tag = e.target.value;
    if (tag === "") {
      renderNotesList();
      document.getElementById("searchStatus").textContent = "全部";
    } else {
      const filteredNotes = notes.filter(
        (note) => note.tags && note.tags.includes(tag)
      );
      renderNotesList(filteredNotes);
      document.getElementById("searchStatus").textContent = `标签: ${tag}`;
    }
  });
}

// 设置标签搜索功能
function setupTagSearch() {
  const tagSearchInput = document.getElementById("tagSearchInput");
  if (!tagSearchInput) return;

  tagSearchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === "") {
      // 清空搜索，显示所有标签
      renderTagManagement();
      return;
    }

    // 过滤标签
    const filteredTags = tags.filter((tag) =>
      tag.toLowerCase().includes(searchTerm)
    );

    // 更新标签云
    const tagCloud = document.getElementById("tagCloud");
    tagCloud.innerHTML = "";

    filteredTags.forEach((tag) => {
      const count = notes.reduce((total, note) => {
        return total + (note.tags && note.tags.includes(tag) ? 1 : 0);
      }, 0);

      const span = document.createElement("span");
      span.className =
        "tag-item bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      span.textContent = `${tag} (${count})`;
      tagCloud.appendChild(span);
    });

    // 更新标签表格
    const tableBody = document.getElementById("tagTableBody");
    tableBody.innerHTML = "";

    filteredTags.forEach((tag) => {
      const count = notes.reduce((total, note) => {
        return total + (note.tags && note.tags.includes(tag) ? 1 : 0);
      }, 0);

      const row = document.createElement("tr");

      row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <i class="fas fa-tag text-blue-500 mr-2"></i>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${tag}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${count}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">-</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">蓝色</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">编辑</button>
                        <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteTag('${tag}')">删除</button>
                    </td>
                `;

      tableBody.appendChild(row);
    });
  });
}

// 加载笔记
function loadNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  currentNoteId = id;
  document.getElementById("editorTitle").textContent = note.title;
  document.getElementById("noteTitleInput").value = note.title;
  document.getElementById("noteCategory").value = note.category || "";

  // 设置编辑器内容
  quill.root.innerHTML = note.content;

  // 渲染标签
  const selectedTags = document.getElementById("selected-tags");
  selectedTags.innerHTML = "";
  if (note.tags && note.tags.length > 0) {
    note.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className =
        "px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded text-sm mr-2 mb-2";
      span.textContent = tag;
      selectedTags.appendChild(span);
    });
  }

  // 更新最后保存时间
  document.getElementById("last-saved").textContent = formatDate(note.updated);

  // 更新字数统计
  updateWordCount();

  // 高亮当前笔记
  document.querySelectorAll(".note-item").forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.id === id) {
      item.classList.add("active");
    }
  });
}

// 创建新笔记
function createNewNote() {
  const newNote = {
    id: Date.now().toString(),
    title: "新建笔记",
    content: "",
    category: "",
    tags: [],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    deleted: false,
  };

  notes.unshift(newNote);
  saveData();
  renderNotesList();
  loadNote(newNote.id);

  // 更新UI
  document.getElementById("editorTitle").textContent = "新建笔记";
  document.getElementById("noteTitleInput").value = "";
  document.getElementById("noteCategory").value = "";
  quill.root.innerHTML = "";
  document.getElementById("selected-tags").innerHTML = "";
  document.getElementById("last-saved").textContent = "刚刚";

  showToast("已创建新笔记", "success");
  return newNote;
}

// 保存笔记
function saveCurrentNote() {
  if (!currentNoteId) return;

  const title = document.getElementById("noteTitleInput").value.trim();
  const category = document.getElementById("noteCategory").value;
  const content = quill.root.innerHTML;

  // 获取标签
  const tagElements = document
    .getElementById("selected-tags")
    .querySelectorAll("span");
  const tags = Array.from(tagElements).map((tag) => tag.textContent);

  // 更新笔记
  const noteIndex = notes.findIndex((note) => note.id === currentNoteId);
  if (noteIndex !== -1) {
    notes[noteIndex].title = title || "无标题笔记";
    notes[noteIndex].content = content;
    notes[noteIndex].category = category;
    notes[noteIndex].tags = tags;
    notes[noteIndex].updated = new Date().toISOString();

    saveData();
    renderNotesList();

    // 更新最后保存时间
    document.getElementById("last-saved").textContent = formatDate(new Date());

    // 显示保存成功提示
    showToast("笔记已保存", "success");
  }
}

// 删除当前笔记
function deleteCurrentNote() {
  if (!currentNoteId) return;

  if (confirm("确定要删除这个笔记吗？")) {
    const noteIndex = notes.findIndex((note) => note.id === currentNoteId);
    if (noteIndex !== -1) {
      // 添加到回收站
      const deletedNote = notes[noteIndex];
      deletedNote.deleted = true;
      deletedNote.deletedAt = new Date().toISOString();
      deletedNotes.push(deletedNote);

      // 从笔记列表中移除
      notes.splice(noteIndex, 1);

      saveData();

      // 加载下一个笔记或创建新笔记
      if (notes.length > 0) {
        loadNote(notes[0].id);
      } else {
        createNewNote();
      }

      renderNotesList();
      showToast("笔记已移动到回收站", "info");
    }
  }
}

// 添加标签到笔记
function addTagToNote() {
  if (!currentNoteId) {
    showToast("请先选择或创建一个笔记", "error");
    return;
  }

  const tagSelector = document.getElementById("tag-selector");
  const tag = tagSelector.value;

  if (!tag) {
    showToast("请选择一个标签", "error");
    return;
  }

  const selectedTags = document.getElementById("selected-tags");
  const existingTags = Array.from(selectedTags.querySelectorAll("span")).map(
    (span) => span.textContent
  );

  if (existingTags.includes(tag)) {
    showToast("该标签已添加", "error");
    return;
  }

  // 添加标签到UI
  const span = document.createElement("span");
  span.className =
    "px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded text-sm mr-2 mb-2";
  span.textContent = tag;
  selectedTags.appendChild(span);

  // 自动保存笔记
  saveCurrentNote();
}

// 设置搜索功能
function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === "") {
      renderNotesList();
      document.getElementById("searchStatus").textContent = "全部";
      return;
    }

    const filteredNotes = notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        (note.category && note.category.toLowerCase().includes(searchTerm)) ||
        (note.tags &&
          note.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
      );
    });

    renderNotesList(filteredNotes);
    document.getElementById("searchStatus").textContent = `搜索: ${searchTerm}`;
  });
}

// 更新字数统计
function updateWordCount() {
  const text = quill.getText();
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;

  document.getElementById("wordCount").textContent = wordCount;
  document.getElementById("charCount").textContent = charCount;
}

// 辅助函数：去除HTML标签
function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// 辅助函数：格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "今天";
  } else if (diffDays === 1) {
    return "昨天";
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }
}

// 添加新分类
function addNewCategory() {
  const categoryName = prompt("请输入新分类名称:");
  if (categoryName && categoryName.trim() !== "") {
    if (!categories.includes(categoryName)) {
      categories.push(categoryName);
      saveData();
      renderCategories(); // 立即刷新分类下拉和选择
      renderCategoryManagement && renderCategoryManagement(); // 如果有分类管理页面也刷新
      showToast(`分类 "${categoryName}" 已添加`, "success");
    } else {
      showToast("该分类已存在", "error");
    }
  }
}

// 添加新标签
function addNewTag() {
  const tagName = prompt("请输入新标签名称:");
  if (tagName && tagName.trim() !== "") {
    if (!tags.includes(tagName)) {
      tags.push(tagName);
      saveData();
      renderTags(); // 立即刷新标签下拉和选择
      renderTagManagement && renderTagManagement(); // 如果有标签管理页面也刷新
      showToast(`标签 "${tagName}" 已添加`, "success");
    } else {
      showToast("该标签已存在", "error");
    }
  }
}

// 删除标签
function deleteTag(tagName) {
  if (confirm(`确定要删除标签"${tagName}"吗？`)) {
    // 从标签列表中移除
    const index = tags.indexOf(tagName);
    if (index !== -1) {
      tags.splice(index, 1);
    }

    // 从所有笔记中移除该标签
    notes.forEach((note) => {
      if (note.tags && note.tags.includes(tagName)) {
        const tagIndex = note.tags.indexOf(tagName);
        note.tags.splice(tagIndex, 1);
      }
    });

    saveData();
    renderTags();
    renderTagManagement && renderTagManagement();
    showToast(`标签"${tagName}"已删除`, "success");
  }
}

// 渲染分类管理页面
function renderCategoryManagement() {
  document.getElementById("categoryCount").textContent = categories.length;

  // 计算笔记最多的分类
  const categoryCounts = {};
  notes.forEach((note) => {
    if (note.category) {
      categoryCounts[note.category] = (categoryCounts[note.category] || 0) + 1;
    }
  });

  let mostUsedCategory = "-";
  let maxCount = 0;
  for (const category in categoryCounts) {
    if (categoryCounts[category] > maxCount) {
      mostUsedCategory = category;
      maxCount = categoryCounts[category];
    }
  }
  document.getElementById("mostUsedCategory").textContent = mostUsedCategory;

  // 填充分类表格
  const tableBody = document.getElementById("categoryTableBody");
  tableBody.innerHTML = "";

  categories.forEach((category) => {
    const count = categoryCounts[category] || 0;
    const row = document.createElement("tr");

    row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <i class="fas fa-folder text-yellow-500 mr-2"></i>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">${category}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${count}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">-</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">编辑</button>
                    <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteCategory('${category}')">删除</button>
                </td>
            `;

    tableBody.appendChild(row);
  });
}

// 渲染标签管理页面
function renderTagManagement() {
  document.getElementById("tagCount").textContent = tags.length;

  // 计算最常用标签
  const tagCounts = {};
  notes.forEach((note) => {
    if (note.tags) {
      note.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  let mostUsedTag = "-";
  let maxCount = 0;
  for (const tag in tagCounts) {
    if (tagCounts[tag] > maxCount) {
      mostUsedTag = tag;
      maxCount = tagCounts[tag];
    }
  }
  document.getElementById("mostUsedTag").textContent = mostUsedTag;

  // 渲染标签云
  const tagCloud = document.getElementById("tagCloud");
  tagCloud.innerHTML = "";

  tags.forEach((tag) => {
    const count = tagCounts[tag] || 0;
    const span = document.createElement("span");
    span.className =
      "tag-item bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    span.textContent = `${tag} (${count})`;
    tagCloud.appendChild(span);
  });

  // 填充标签表格
  const tableBody = document.getElementById("tagTableBody");
  tableBody.innerHTML = "";

  tags.forEach((tag) => {
    const count = tagCounts[tag] || 0;
    const row = document.createElement("tr");

    row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <i class="fas fa-tag text-blue-500 mr-2"></i>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">${tag}</div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${count}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">-</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">蓝色</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">编辑</button>
                    <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteTag('${tag}')">删除</button>
                </td>
            `;

    tableBody.appendChild(row);
  });
}

// 渲染回收站
function renderRecycleBin() {
  document.getElementById("recycleCount").textContent = deletedNotes.length;

  // 填充回收站表格
  const tableBody = document.getElementById("recycleTableBody");
  tableBody.innerHTML = "";

  if (deletedNotes.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        回收站是空的
                    </td>
                `;
    tableBody.appendChild(row);
    return;
  }

  deletedNotes.forEach((note) => {
    const deletedDate = new Date(note.deletedAt);
    const daysSinceDeletion = Math.floor(
      (new Date() - deletedDate) / (1000 * 60 * 60 * 24)
    );
    const daysRemaining = Math.max(0, 30 - daysSinceDeletion);

    const row = document.createElement("tr");

    row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <i class="fas fa-sticky-note text-gray-500 mr-2"></i>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${
                              note.title
                            }</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">笔记</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${formatDate(
                      note.deletedAt
                    )}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${daysRemaining}天</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3" onclick="restoreNote('${
                          note.id
                        }')">恢复</button>
                        <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="permanentlyDeleteNote('${
                          note.id
                        }')">永久删除</button>
                    </td>
                `;

    tableBody.appendChild(row);
  });
}

// 清空回收站
function emptyRecycleBin() {
  if (deletedNotes.length === 0) {
    showToast("回收站已是空的", "info");
    return;
  }

  if (confirm("确定要永久删除回收站中的所有项目吗？此操作不可恢复。")) {
    deletedNotes = [];
    saveData();
    renderRecycleBin();
    showToast("回收站已清空", "success");
  }
}

// 恢复所有删除的笔记
function restoreAllNotes() {
  if (deletedNotes.length === 0) {
    showToast("回收站中没有可恢复的项目", "info");
    return;
  }

  deletedNotes.forEach((note) => {
    note.deleted = false;
    notes.push(note);
  });

  deletedNotes = [];
  saveData();
  renderRecycleBin();
  showToast("所有项目已恢复", "success");
}

// 恢复单个笔记
function restoreNote(noteId) {
  const noteIndex = deletedNotes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    const note = deletedNotes[noteIndex];
    note.deleted = false;
    notes.push(note);
    deletedNotes.splice(noteIndex, 1);

    saveData();
    renderRecycleBin();
    showToast("笔记已恢复", "success");
  }
}

// 永久删除笔记
function permanentlyDeleteNote(noteId) {
  if (confirm("确定要永久删除这个笔记吗？此操作不可恢复。")) {
    const noteIndex = deletedNotes.findIndex((note) => note.id === noteId);
    if (noteIndex !== -1) {
      deletedNotes.splice(noteIndex, 1);
      saveData();
      renderRecycleBin();
      showToast("笔记已永久删除", "success");
    }
  }
}

// 设置字体大小选项
function setupFontSizeOptions() {
  const fontSizeOptions = document.querySelectorAll(".font-size-option");

  fontSizeOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const size = option.dataset.size;

      // 移除现有的字体大小类
      document
        .querySelector("body")
        .classList.remove("text-small", "text-medium", "text-large");

      // 添加选中的字体大小类
      if (size !== "medium") {
        document.querySelector("body").classList.add(`text-${size}`);
      }

      // 保存偏好设置
      localStorage.setItem("fontSize", size);
      showToast(
        `字体大小已设置为${
          size === "small" ? "小" : size === "large" ? "大" : "中"
        }`,
        "success"
      );
    });
  });

  // 应用保存的字体大小设置
  const savedSize = localStorage.getItem("fontSize");
  if (savedSize && savedSize !== "medium") {
    document.querySelector("body").classList.add(`text-${savedSize}`);
  }
}

// 设置导出功能
function setupExportFunction() {
  // 导出单个笔记
  document.getElementById("exportNoteBtn").addEventListener("click", () => {
    if (!currentNoteId) {
      showToast("没有可导出的笔记", "error");
      return;
    }

    const note = notes.find((n) => n.id === currentNoteId);
    if (note) {
      exportNote(note);
    }
  });

  // 导出所有笔记
  document.getElementById("exportAllBtn").addEventListener("click", () => {
    if (notes.length === 0) {
      showToast("没有可导出的笔记", "error");
      return;
    }

    exportAllNotes();
  });
}

// 导出单个笔记
function exportNote(note) {
  const dataStr = JSON.stringify(note, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `${note.title}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();

  showToast(`笔记 "${note.title}" 已导出`, "success");
}

// 导出所有笔记
function exportAllNotes() {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `简易网页笔记应用备份_${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();

  showToast("所有笔记已导出", "success");
}

// 显示Toast通知
function showToast(message, type = "info") {
  // 移除现有的toast
  const existingToast = document.getElementById("custom-toast");
  if (existingToast) {
    existingToast.remove();
  }

  // 创建toast元素
  const toast = document.createElement("div");
  toast.id = "custom-toast";
  toast.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white transition-opacity duration-300 ${
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-blue-500"
  }`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // 3秒后自动消失
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 修改事件监听器
document.addEventListener("DOMContentLoaded", () => {
  initializeUI();

  // 编辑器内容变化监听
  quill.on(
    "text-change",
    debounce(() => {
      updateWordCount();
      // 自动保存
      if (currentNoteId) {
        saveCurrentNote();
      }
    }, 1000)
  );

  // 新建笔记按钮
  document.getElementById("newNoteBtn").addEventListener("click", () => {
    createNewNote();
  });

  document.getElementById("newNoteBtn2").addEventListener("click", () => {
    createNewNote();
  });

  // 保存笔记按钮
  document.getElementById("saveNoteBtn").addEventListener("click", () => {
    saveCurrentNote();
  });

  // 删除笔记按钮
  document.getElementById("deleteNoteBtn").addEventListener("click", () => {
    deleteCurrentNote();
  });

  // 关于按钮
  document.getElementById("aboutBtn").addEventListener("click", () => {
    const aboutModal = new bootstrap.Modal(
      document.getElementById("aboutModal")
    );
    aboutModal.show();
  });

  // 添加防抖函数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});

// 预览功能
document.getElementById("togglePreviewBtn").addEventListener("click", () => {
  const preview = document.getElementById("markdownPreview");
  const content = document.getElementById("markdownContent");

  if (preview.style.display === "none") {
    // 直接显示富文本内容（HTML格式）
    content.innerHTML = quill.root.innerHTML;
    preview.style.display = "block";
    document.getElementById("togglePreviewBtn").innerHTML =
      '<i class="fas fa-eye-slash mr-1"></i>关闭预览';
  } else {
    preview.style.display = "none";
    document.getElementById("togglePreviewBtn").innerHTML =
      '<i class="fas fa-eye mr-1"></i>预览';
  }
});
