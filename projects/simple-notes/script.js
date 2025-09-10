// 简易网页记事本 - JavaScript功能实现

// 完整版：包含所有需求功能

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const toggleSidebar = document.getElementById('toggleSidebar');
    const notesSidebar = document.getElementById('notesSidebar');
    const notesList = document.getElementById('notesList');
    const newNoteBtn = document.getElementById('newNoteBtn');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const noteContentTextarea = document.getElementById('noteContentTextarea');
    const themeToggle = document.getElementById('themeToggle');
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const exportBtn = document.getElementById('exportBtn');
    const exportAllBtn = document.getElementById('exportAllBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const trashBtn = document.getElementById('trashBtn');
    const tagList = document.getElementById('tagList');
    const editorTags = document.getElementById('editorTags');
    const currentTag = document.getElementById('currentTag');
    const notesCount = document.getElementById('notesCount');
    const searchStatus = document.getElementById('searchStatus');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const lastSaved = document.getElementById('lastSaved');
    const fontSizeOptions = document.querySelectorAll('.font-size-option');
    const previewToggleBtn = document.getElementById('previewToggleBtn');
    const markdownPreview = document.getElementById('markdownPreview');
    const emptyTrashBtn = document.getElementById('emptyTrashBtn');
    const trashNotesList = document.getElementById('trashNotesList');
    const toastLiveExample = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');

    // LocalStorage键名
    const STORAGE_KEY = 'simpleNotesApp';
    const TRASH_KEY = 'simpleNotesTrash';
    const THEME_KEY = 'simpleNotesTheme';
    const FONT_SIZE_KEY = 'simpleNotesFontSize';

    // 全局变量
    let notes = loadNotesFromStorage();
    let trashNotes = loadTrashFromStorage();
    let currentNoteId = notes.length > 0 ? notes[0].id : null;
    let searchQuery = '';
    let lastSaveTime = null;
    let isPreviewMode = false;

    // 显示提示信息
    function showToast(message) {
        toastMessage.textContent = message;
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }

    // 1. 初始化主题和字体大小
    function initSettings() {
        // 初始化主题
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // 更新切换按钮文本
        if (savedTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun me-2"></i>切换亮色模式';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon me-2"></i>切换暗色模式';
        }

        // 初始化字体大小
        const savedFontSize = localStorage.getItem(FONT_SIZE_KEY) || 'medium';
        setFontSize(savedFontSize);

        // 标记当前字体大小选项
        fontSizeOptions.forEach(option => {
            if (option.dataset.size === savedFontSize) {
                option.innerHTML = option.innerHTML + ' <i class="fas fa-check"></i>';
            }
        });
    }

    // 2. 设置字体大小
    function setFontSize(size) {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${size}`);
        localStorage.setItem(FONT_SIZE_KEY, size);
    }

    // 3. 从LocalStorage加载笔记
    function loadNotesFromStorage() {
        try {
            const savedNotes = localStorage.getItem(STORAGE_KEY);
            if (savedNotes) {
                const parsedNotes = JSON.parse(savedNotes);
                // 将字符串日期转换回Date对象
                return parsedNotes.map(note => ({
                    ...note,
                    createdAt: new Date(note.createdAt),
                    updatedAt: new Date(note.updatedAt)
                }));
            }
        } catch (error) {
            console.error('加载笔记时出错:', error);
        }

        // 如果没有保存的笔记或解析出错，使用默认数据
        return [
            {
                id: 1,
                title: '欢迎使用记事本',
                content: '这是一个简易的网页记事本应用，您可以在这里记录您的想法和笔记。\n\n## 功能特点：\n- 创建、编辑和删除笔记\n- 实时自动保存\n- 搜索笔记内容和标签\n- 亮色/暗色主题切换\n- Markdown格式支持\n- 图片插入功能\n- 回收站功能\n- 本地存储，保护您的隐私\n\n**请随意尝试各种功能！**',
                createdAt: new Date(),
                updatedAt: new Date(),
                tag: ''
            }
        ];
    }

    // 从LocalStorage加载回收站笔记
    function loadTrashFromStorage() {
        try {
            const savedTrash = localStorage.getItem(TRASH_KEY);
            if (savedTrash) {
                const parsedTrash = JSON.parse(savedTrash);
                return parsedTrash.map(note => ({
                    ...note,
                    createdAt: new Date(note.createdAt),
                    updatedAt: new Date(note.updatedAt),
                    deletedAt: new Date(note.deletedAt)
                }));
            }
        } catch (error) {
            console.error('加载回收站时出错:', error);
        }
        return [];
    }

    // 4. 保存笔记到LocalStorage
    function saveNotesToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
            lastSaveTime = new Date();
            updateLastSavedTime();
            console.log('笔记已保存到LocalStorage');
        } catch (error) {
            console.error('保存笔记时出错:', error);
            showToast('保存失败：存储空间可能已满');
        }
    }

    // 保存回收站到LocalStorage
    function saveTrashToStorage() {
        try {
            localStorage.setItem(TRASH_KEY, JSON.stringify(trashNotes));
        } catch (error) {
            console.error('保存回收站时出错:', error);
        }
    }

    // 5. 更新最后保存时间显示
    function updateLastSavedTime() {
        if (lastSaveTime) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - lastSaveTime) / 1000);
            if (diffInSeconds < 60) {
                lastSaved.textContent = '刚刚';
            } else if (diffInSeconds < 3600) {
                lastSaved.textContent = `${Math.floor(diffInSeconds / 60)}分钟前`;
            } else {
                lastSaved.textContent = lastSaveTime.toLocaleTimeString();
            }
        }
    }

    // 6. 自动保存功能（防抖处理）
    let saveTimeout = null;
    function autoSave() {
        // 清除之前的定时器
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }

        // 设置新的定时器（1秒后保存）
        saveTimeout = setTimeout(() => {
            if (currentNoteId) {
                updateCurrentNote();
                saveNotesToStorage();
                renderNotesList(); // 更新列表显示（更新时间）
                updatePreview(); // 更新预览
            }
        }, 1000);
    }

    // 7. 更新当前笔记内容
    function updateCurrentNote() {
        if (!currentNoteId) return;
        const noteIndex = notes.findIndex(note => note.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].title = noteTitleInput.value;
            notes[noteIndex].content = noteContentTextarea.value;
            notes[noteIndex].updatedAt = new Date();
        }
    }

    // 8. 删除笔记功能（移动到回收站）
    function moveNoteToTrash(noteId) {
        const noteIndex = notes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            const deletedNote = notes[noteIndex];
            deletedNote.deletedAt = new Date();
            trashNotes.push(deletedNote);
            notes.splice(noteIndex, 1);
            
            // 如果删除的是当前笔记，选择第一个笔记
            if (currentNoteId === noteId) {
                currentNoteId = notes.length > 0 ? notes[0].id : null;
                if (currentNoteId) {
                    selectNote(currentNoteId);
                } else {
                    // 如果没有笔记了，清空编辑器
                    noteTitleInput.value = '';
                    noteContentTextarea.value = '';
                    updateWordCount();
                    editorTags.style.display = 'none';
                    updatePreview();
                }
            }
            
            saveNotesToStorage();
            saveTrashToStorage();
            renderNotesList();
            showToast('笔记已移动到回收站');
        }
    }

    // 从回收站恢复笔记
    function restoreNoteFromTrash(noteId) {
        const noteIndex = trashNotes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            const restoredNote = trashNotes[noteIndex];
            delete restoredNote.deletedAt;
            notes.unshift(restoredNote);
            trashNotes.splice(noteIndex, 1);
            
            saveNotesToStorage();
            saveTrashToStorage();
            renderNotesList();
            renderTrashNotes();
            showToast('笔记已恢复');
        }
    }

    // 永久删除笔记
    function deleteNoteForever(noteId) {
        if (confirm('确定要永久删除这条笔记吗？此操作不可恢复。')) {
            trashNotes = trashNotes.filter(note => note.id !== noteId);
            saveTrashToStorage();
            renderTrashNotes();
            showToast('笔记已永久删除');
        }
    }

    // 清空回收站
    function emptyTrash() {
        if (trashNotes.length === 0) {
            showToast('回收站已经是空的');
            return;
        }
        
        if (confirm('确定要清空回收站吗？所有笔记将被永久删除，此操作不可恢复。')) {
            trashNotes = [];
            saveTrashToStorage();
            renderTrashNotes();
            showToast('回收站已清空');
        }
    }

    // 9. 渲染笔记列表
    function renderNotesList() {
        notesList.innerHTML = '';

        // 过滤笔记（基于搜索查询）
        let filteredNotes = notes;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredNotes = notes.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query) ||
                (note.tag && note.tag.toLowerCase().includes(query))
            );
        }

        // 如果没有笔记
        if (filteredNotes.length === 0) {
            if (searchQuery) {
                notesList.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search fa-2x mb-2"></i>
                        <p>没有找到匹配的笔记</p>
                        <button class="btn btn-sm btn-primary mt-2" id="clearSearchBtn">清除搜索</button>
                    </div>
                `;
                document.getElementById('clearSearchBtn').addEventListener('click', clearSearch);
            } else {
                notesList.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-sticky-note fa-2x mb-2"></i>
                        <p>还没有任何笔记</p>
                    </div>
                `;
            }
            updateNotesCount();
            return;
        }

        // 按更新时间降序排列（最新的在前面）
        const sortedNotes = [...filteredNotes].sort((a, b) => b.updatedAt - a.updatedAt);
        sortedNotes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = `note-item ${note.id === currentNoteId ? 'active' : ''}`;
            noteItem.dataset.id = note.id;

            const timeAgo = formatTimeAgo(note.updatedAt);

            // 处理标题和内容的搜索高亮
            let displayTitle = note.title;
            let displayContent = note.content.substring(0, 30) + (note.content.length > 30 ? '...' : '');

            if (searchQuery) {
                const regex = new RegExp(`(${escapeRegex(searchQuery)})`, 'gi');
                displayTitle = displayTitle.replace(regex, '<span class="highlight">$1</span>');
                displayContent = displayContent.replace(regex, '<span class="highlight">$1</span>');
            }

            const tagIndicator = note.tag ? `<span class="note-tag ${getTagColorClass(note.tag)}"></span>` : '';

            noteItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <h6 class="fw-bold mb-1">${tagIndicator}${displayTitle}</h6>
                    <small>${timeAgo}</small>
                </div>
                <p class="text-muted mb-2">${displayContent}</p>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-danger delete-note-btn" data-id="${note.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            noteItem.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-note-btn')) {
                    selectNote(note.id);
                }
            });

            const deleteBtn = noteItem.querySelector('.delete-note-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                moveNoteToTrash(note.id);
            });

            notesList.appendChild(noteItem);
        });

        updateNotesCount();
    }

    // 渲染回收站笔记
    function renderTrashNotes() {
        trashNotesList.innerHTML = '';
        
        if (trashNotes.length === 0) {
            trashNotesList.innerHTML = '<p class="text-center text-muted py-3">回收站是空的</p>';
            return;
        }
        
        // 按删除时间降序排列
        const sortedTrashNotes = [...trashNotes].sort((a, b) => b.deletedAt - a.deletedAt);
        
        sortedTrashNotes.forEach(note => {
            const trashItem = document.createElement('div');
            trashItem.className = 'trash-note-item';
            
            const deletedTimeAgo = formatTimeAgo(note.deletedAt);
            const tagIndicator = note.tag ? `<span class="note-tag ${getTagColorClass(note.tag)}"></span>` : '';
            
            trashItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <h6 class="fw-bold mb-1">${tagIndicator}${note.title}</h6>
                    <small>${deletedTimeAgo}删除</small>
                </div>
                <p class="text-muted mb-2">${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}</p>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-success me-2 restore-trash-btn" data-id="${note.id}">
                        <i class="fas fa-undo me-1"></i>恢复
                    </button>
                    <button class="btn btn-sm btn-danger delete-forever-btn" data-id="${note.id}">
                        <i class="fas fa-times me-1"></i>永久删除
                    </button>
                </div>
            `;
            
            const restoreBtn = trashItem.querySelector('.restore-trash-btn');
            restoreBtn.addEventListener('click', () => {
                restoreNoteFromTrash(note.id);
            });
            
            const deleteForeverBtn = trashItem.querySelector('.delete-forever-btn');
            deleteForeverBtn.addEventListener('click', () => {
                deleteNoteForever(note.id);
            });
            
            trashNotesList.appendChild(trashItem);
        });
    }

    // 10. 选择笔记
    function selectNote(noteId) {
        currentNoteId = noteId;
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.id) === noteId) {
                item.classList.add('active');
            }
        });

        const note = notes.find(n => n.id === noteId);
        if (note) {
            noteTitleInput.value = note.title;
            noteContentTextarea.value = note.content;
            updateWordCount();
            updateTagDisplay();
            updatePreview();
        }
    }

    // 11. 格式化时间显示
    function formatTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) {
            return '刚刚';
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)}分钟前`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)}小时前`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)}天前`;
        }
    }

    // 12. 更新笔记计数
    function updateNotesCount() {
        const totalNotes = notes.length;
        let displayedNotes = notes.length;
        if (searchQuery) {
            displayedNotes = notes.filter(note =>
                note.title.toLowerCase().includes(searchQuery) ||
                note.content.toLowerCase().includes(searchQuery) ||
                (note.tag && note.tag.toLowerCase().includes(searchQuery))
            ).length;
        }
        notesCount.textContent = totalNotes;
        if (searchQuery) {
            searchStatus.textContent = `搜索: ${displayedNotes}/${totalNotes}`;
        } else {
            searchStatus.textContent = '全部';
        }
    }

    // 13. 更新字数统计
    function updateWordCount() {
        const content = noteContentTextarea.value;
        const words = content.trim() ? content.replace(/\s+/g, ' ').trim().split(' ').length : 0;
        const chars = content.length;
        wordCount.textContent = words;
        charCount.textContent = chars;
    }

    // 14. 新建笔记
    newNoteBtn.addEventListener('click', function() {
        const newNote = {
            id: Date.now(),
            title: '无标题笔记',
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            tag: ''
        };

        notes.unshift(newNote);
        currentNoteId = newNote.id;
        renderNotesList();
        noteTitleInput.value = newNote.title;
        noteContentTextarea.value = newNote.content;
        noteTitleInput.focus();
        updateWordCount();
        editorTags.style.display = 'none';
        updatePreview();
        saveNotesToStorage();
    });

    // 15. 主题切换功能
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // 应用新主题
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(THEME_KEY, newTheme);

        // 更新按钮文本
        if (newTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun me-2"></i>切换亮色模式';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon me-2"></i>切换暗色模式';
        }
    });

    // 16. 导出笔记功能
    exportBtn.addEventListener('click', exportCurrentNote);

    function exportCurrentNote() {
        if (!currentNoteId) {
            showToast('请先选择或创建笔记');
            return;
        }

        const note = notes.find(n => n.id === currentNoteId);
        if (!note) return;

        const content = `${note.title}\n\n${note.content}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        a.href = url;
        a.download = `${note.title}_${date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('笔记导出成功！');
    }

    // 17. 导出所有笔记
    exportAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (notes.length === 0) {
            showToast('没有笔记可导出');
            return;
        }

        let content = '我的所有笔记\n\n';
        notes.forEach((note, index) => {
            content += `=== ${note.title} ===\n`;
            content += `创建时间: ${note.createdAt.toLocaleString()}\n`;
            content += `最后修改: ${note.updatedAt.toLocaleString()}\n`;
            if (note.tag) content += `标签: ${note.tag}\n`;
            content += '\n';
            content += note.content;
            content += '\n\n';
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        a.href = url;
        a.download = `所有笔记_${date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('所有笔记导出成功！');
    });

    // 18. 标签管理功能
    tagList.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('dropdown-item')) {
            const tag = e.target.dataset.tag;
            setNoteTag(tag);
        }
    });

    function setNoteTag(tag) {
        if (!currentNoteId) return;
        const noteIndex = notes.findIndex(note => note.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].tag = tag;
            saveNotesToStorage();
            updateTagDisplay();
            renderNotesList();
        }
    }

    function updateTagDisplay() {
        if (!currentNoteId) {
            editorTags.style.display = 'none';
            return;
        }

        const note = notes.find(n => n.id === currentNoteId);
        if (note && note.tag) {
            editorTags.style.display = 'block';
            currentTag.textContent = note.tag;
            // 根据标签类型设置不同的颜色
            const tagClass = getTagClass(note.tag);
            currentTag.className = `badge ${tagClass} me-1`;
        } else {
            editorTags.style.display = 'none';
        }
    }

    function getTagClass(tag) {
        switch(tag) {
            case '工作': return 'bg-primary';
            case '学习': return 'bg-success';
            case '生活': return 'bg-warning';
            case '想法': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    function getTagColorClass(tag) {
        switch(tag) {
            case '工作': return 'tag-work';
            case '学习': return 'tag-study';
            case '生活': return 'tag-life';
            case '想法': return 'tag-idea';
            default: return '';
        }
    }

    // 19. 搜索功能
    function setupSearch() {
        const performSearch = () => {
            searchQuery = searchInput.value.toLowerCase() || mobileSearchInput.value.toLowerCase();
            renderNotesList();
        };

        searchInput.addEventListener('input', performSearch);
        mobileSearchInput.addEventListener('input', performSearch);

        // 添加清除搜索的快捷键 (ESC)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchQuery) {
                clearSearch();
                e.preventDefault();
            }
        });
    }

    function clearSearch() {
        searchInput.value = '';
        mobileSearchInput.value = '';
        searchQuery = '';
        renderNotesList();
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 20. 字体大小设置
    fontSizeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const size = this.dataset.size;
            setFontSize(size);
            // 更新选中标记
            fontSizeOptions.forEach(opt => {
                opt.innerHTML = opt.innerHTML.replace(' <i class="fas fa-check"></i>', '');
            });
            this.innerHTML = this.innerHTML + ' <i class="fas fa-check"></i>';
        });
    });

    // 21. 关于模态框
    aboutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const aboutModal = new bootstrap.Modal(document.getElementById('aboutModal'));
        aboutModal.show();
    });

    // 22. 回收站功能
    trashBtn.addEventListener('click', function(e) {
        e.preventDefault();
        renderTrashNotes();
        const trashModal = new bootstrap.Modal(document.getElementById('trashModal'));
        trashModal.show();
    });

    emptyTrashBtn.addEventListener('click', emptyTrash);

    // 23. Markdown预览功能
    previewToggleBtn.addEventListener('click', function() {
        isPreviewMode = !isPreviewMode;
        if (isPreviewMode) {
            noteContentTextarea.style.display = 'none';
            markdownPreview.style.display = 'block';
            updatePreview();
            previewToggleBtn.innerHTML = '<i class="fas fa-edit"></i>';
            previewToggleBtn.setAttribute('title', '切换编辑');
        } else {
            noteContentTextarea.style.display = 'block';
            markdownPreview.style.display = 'none';
            previewToggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            previewToggleBtn.setAttribute('title', '切换预览');
        }
    });

    function updatePreview() {
        if (isPreviewMode && currentNoteId) {
            const note = notes.find(n => n.id === currentNoteId);
            if (note) {
                markdownPreview.innerHTML = marked.parse(note.content);
            }
        }
    }

    // 24. 实时更新字数统计
    noteContentTextarea.addEventListener('input', function() {
        updateWordCount();
        if (isPreviewMode) {
            updatePreview();
        }
    });

    // 25. 添加输入监听，实现自动保存
    noteTitleInput.addEventListener('input', function() {
        autoSave();
        if (isPreviewMode) {
            updatePreview();
        }
    });

    noteContentTextarea.addEventListener('input', autoSave);

    // 26. 添加页面离开前的保存
    window.addEventListener('beforeunload', function() {
        if (currentNoteId) {
            updateCurrentNote();
            saveNotesToStorage();
        }
    });

    // 27. 侧边栏切换（移动端）
    toggleSidebar.addEventListener('click', function() {
        notesSidebar.classList.toggle('active');
    });

    // 28. 初始化应用
    function initApp() {
        initSettings();
        setupSearch();
        renderNotesList();
        if (currentNoteId) {
            selectNote(currentNoteId);
        }
        updateWordCount();
        updateTagDisplay();
        // 设置定时器，每分钟更新一次最后保存时间
        setInterval(updateLastSavedTime, 60000);
        console.log('应用已初始化，已加载笔记:', notes.length);
        console.log('所有功能已启用');
    }

    // 启动应用
    initApp();
});

// 在renderNotesList函数中，修改笔记项的HTML，添加标签显示
noteItem.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
        <h6 class="fw-bold mb-1">${tagIndicator}${displayTitle}</h6>
        <small>${timeAgo}</small>
    </div>
    ${note.tag ? `<p class="mb-1"><span class="badge ${getTagClass(note.tag)} note-tag-badge" data-tag="${note.tag}">${note.tag}</span></p>` : ''}
    <p class="text-muted mb-2">${displayContent}</p>
    <div class="d-flex justify-content-end">
        <button class="btn btn-sm btn-outline-danger delete-note-btn" data-id="${note.id}">
            <i class="fas fa-trash"></i>
        </button>
    </div>
`;

// 在笔记项添加到DOM后，添加标签点击事件
const tagBadge = noteItem.querySelector('.note-tag-badge');
if (tagBadge) {
    tagBadge.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发笔记项点击事件
        const tag = tagBadge.dataset.tag;
        searchInput.value = tag;
        mobileSearchInput.value = tag;
        searchQuery = tag.toLowerCase();
        renderNotesList();
    });
}

// 在updateTagDisplay函数中，为当前标签添加点击事件
function updateTagDisplay() {
    if (!currentNoteId) {
        editorTags.style.display = 'none';
        return;
    }

    const note = notes.find(n => n.id === currentNoteId);
    if (note && note.tag) {
        editorTags.style.display = 'block';
        currentTag.textContent = note.tag;
        // 根据标签类型设置不同的颜色
        const tagClass = getTagClass(note.tag);
        currentTag.className = `badge ${tagClass} me-1`;
        
        // 添加点击事件 - 搜索该标签
        currentTag.onclick = () => {
            searchInput.value = note.tag;
            mobileSearchInput.value = note.tag;
            searchQuery = note.tag.toLowerCase();
            renderNotesList();
        };
        
        // 添加提示
        currentTag.title = '点击搜索该标签';
    } else {
        editorTags.style.display = 'none';
    }
}