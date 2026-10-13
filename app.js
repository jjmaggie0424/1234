/**
 * 桃園市立楊梅高級中等學校 - 分機資訊網核心互動控制器
 * Taoyuan Municipal Yangmei Senior High School Extension App Controller
 */

// 應用程式狀態管理
const state = {
  data: [...EXTENSION_DATA],           // 目前載入的分機列表
  filteredData: [...EXTENSION_DATA],   // 篩選搜尋後的清單
  searchQuery: "",                     // 搜尋關鍵字
  activeCategory: "all",               // 目前選中分類
  activeBuilding: "all",               // 目前選中館舍
  activeSort: "ext_asc",               // 排序方式
  activeView: "cards",                 // 視圖模式: cards | table | buildings
  favorites: new Set(),                // 常用分機清單 Set<ext>
  onlyFavorites: false,                // 是否只看常用
  activeModalExt: null,                // 目前撥號彈窗對象
  fontSizeMode: "normal"               // 字體大小: normal | lg | xl
};

// 初始化載入
document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  initCategoryPills();
  initBuildingTabs();
  initQuickGuides();
  setupEventListeners();
  render();
});

/**
 * 讀取 localStorage 偏好設定
 */
function initStorage() {
  // 1. 常用分機
  try {
    const savedFavs = localStorage.getItem("ymhs_fav_extensions");
    if (savedFavs) {
      const parsed = JSON.parse(savedFavs);
      if (Array.isArray(parsed)) {
        state.favorites = new Set(parsed);
      }
    }
  } catch (e) {
    console.warn("Error reading favorites", e);
  }

  // 2. 字體大小模式
  const savedFont = localStorage.getItem("ymhs_font_mode");
  if (savedFont) {
    setFontSize(savedFont, false);
  }

  // 3. 自訂新增或更新資料
  try {
    const customData = localStorage.getItem("ymhs_custom_extensions");
    if (customData) {
      const parsed = JSON.parse(customData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.data = parsed;
        showToast("已載入本機自訂/更新分機資料庫", "info");
      }
    }
  } catch (e) {
    console.warn("Error reading custom extensions", e);
  }
}

/**
 * 儲存常用分機到 localStorage
 */
function saveFavorites() {
  localStorage.setItem("ymhs_fav_extensions", JSON.stringify([...state.favorites]));
}

/**
 * 初始化分類篩選按鈕
 */
function initCategoryPills() {
  const container = document.getElementById("categoryPillsContainer");
  if (!container) return;

  container.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const count = cat.id === "all" 
      ? state.data.length 
      : state.data.filter(item => item.category === cat.id).length;

    const btn = document.createElement("button");
    btn.className = `cat-pill ${cat.id === state.activeCategory ? "active" : ""}`;
    btn.dataset.category = cat.id;
    btn.innerHTML = `
      <span>${cat.name}</span>
      <span class="cat-count">${count}</span>
    `;

    btn.addEventListener("click", () => {
      sounds.playClick();
      state.activeCategory = cat.id;
      state.onlyFavorites = false;
      document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });

    container.appendChild(btn);
  });
}

/**
 * 初始化館舍導覽分頁
 */
function initBuildingTabs() {
  const container = document.getElementById("buildingTabsContainer");
  if (!container) return;

  container.innerHTML = "";

  BUILDINGS.forEach((bld, idx) => {
    const btn = document.createElement("button");
    btn.className = `building-tab-btn ${idx === 0 ? "active" : ""}`;
    btn.dataset.building = bld.id;
    btn.innerHTML = `
      <span class="building-tab-title">${bld.name}</span>
      <span class="building-tab-sub">${bld.floors} • ${bld.desc}</span>
    `;

    btn.addEventListener("click", () => {
      sounds.playClick();
      document.querySelectorAll(".building-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderBuildingContent(bld.id);
    });

    container.appendChild(btn);
  });
}

/**
 * 初始化常見情境指南 (FAQ)
 */
function initQuickGuides() {
  const container = document.getElementById("quickGuidesContainer");
  if (!container) return;

  container.innerHTML = "";

  QUICK_GUIDE_TOPICS.forEach(topic => {
    const card = document.createElement("div");
    card.className = "guide-card-btn";
    card.innerHTML = `
      <div>
        <div class="guide-badge">${topic.badge}</div>
        <div class="guide-title">${topic.title}</div>
        <div class="guide-desc">${topic.desc}</div>
      </div>
      <div class="guide-action-text">
        <span>點擊立即篩選 (${topic.exts.map(e => '#' + e).join(', ')})</span>
        <span>→</span>
      </div>
    `;

    card.addEventListener("click", () => {
      sounds.playClick();
      // 設定搜尋為這些分機之一或直接過濾
      state.searchQuery = topic.exts[0];
      const searchInput = document.getElementById("mainSearchInput");
      if (searchInput) {
        searchInput.value = topic.exts[0];
        document.getElementById("searchClearBtn").style.display = "flex";
      }
      applyFilters();

      // 滾動至搜尋結果
      document.getElementById("resultsSummaryBar")?.scrollIntoView({ behavior: "smooth" });
    });

    container.appendChild(card);
  });
}

/**
 * 綁定各種事件處理器
 */
function setupEventListeners() {
  // 1. 搜尋輸入監聽
  const searchInput = document.getElementById("mainSearchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      searchClearBtn.style.display = state.searchQuery ? "flex" : "none";
      applyFilters();
    });

    // 鍵盤快捷鍵: "/" 或 "Ctrl+K" 快速聚焦搜尋
    document.addEventListener("keydown", (e) => {
      if ((e.key === "/" && document.activeElement !== searchInput) || 
          (e.ctrlKey && e.key === "k") || 
          (e.metaKey && e.key === "k")) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (e.key === "Escape" && document.activeElement === searchInput) {
        searchInput.value = "";
        state.searchQuery = "";
        searchClearBtn.style.display = "none";
        applyFilters();
      }
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      sounds.playClick();
      searchInput.value = "";
      state.searchQuery = "";
      searchClearBtn.style.display = "none";
      searchInput.focus();
      applyFilters();
    });
  }

  // 2. 視圖切換 (卡片 / 表格 / 館舍)
  document.querySelectorAll(".view-mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      sounds.playClick();
      const mode = btn.dataset.view;
      state.activeView = mode;
      document.querySelectorAll(".view-mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.getElementById("cardsViewContainer").style.display = mode === "cards" ? "grid" : "none";
      document.getElementById("tableViewContainer").style.display = mode === "table" ? "block" : "none";
      document.getElementById("buildingViewContainer").style.display = mode === "buildings" ? "grid" : "none";

      if (mode === "buildings") {
        renderBuildingContent(BUILDINGS[0].id);
      }
    });
  });

  // 3. 排序下拉選單
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sounds.playClick();
      state.activeSort = e.target.value;
      applyFilters();
    });
  }

  // 4. 館舍下拉選單
  const buildingFilterSelect = document.getElementById("buildingFilterSelect");
  if (buildingFilterSelect) {
    buildingFilterSelect.addEventListener("change", (e) => {
      sounds.playClick();
      state.activeBuilding = e.target.value;
      applyFilters();
    });
  }

  // 5. 常用分機按鈕篩選
  const favFilterBtn = document.getElementById("favFilterBtn");
  if (favFilterBtn) {
    favFilterBtn.addEventListener("click", () => {
      sounds.playFavorite(true);
      state.onlyFavorites = !state.onlyFavorites;
      favFilterBtn.classList.toggle("primary", state.onlyFavorites);
      favFilterBtn.innerHTML = state.onlyFavorites 
        ? `⭐ 顯示全部 (${state.data.length})` 
        : `⭐ 我的常用 (${state.favorites.size})`;
      applyFilters();
    });
  }

  // 6. 音效開關切換
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  if (soundToggleBtn) {
    updateSoundBtnUI(soundToggleBtn);
    soundToggleBtn.addEventListener("click", () => {
      const enabled = sounds.toggleSound();
      updateSoundBtnUI(soundToggleBtn);
      showToast(enabled ? "🔊 已開啟互動音效" : "🔇 已靜音", "info");
    });
  }

  // 7. 字體大小切換
  const fontToggleBtn = document.getElementById("fontToggleBtn");
  if (fontToggleBtn) {
    fontToggleBtn.addEventListener("click", () => {
      sounds.playClick();
      if (state.fontSizeMode === "normal") {
        setFontSize("lg");
      } else if (state.fontSizeMode === "lg") {
        setFontSize("xl");
      } else {
        setFontSize("normal");
      }
    });
  }

  // 8. 總機撥號快速按鈕
  document.getElementById("heroCallBtn")?.addEventListener("click", () => {
    sounds.playClick();
    openDialpadModal({
      ext: "",
      dept: "楊梅高中學校總機代表號",
      title: "總機總處室",
      name: "語音總機"
    });
  });

  // 9. 撥號彈窗關閉按鈕與背景點擊
  document.getElementById("dialpadModalClose")?.addEventListener("click", closeDialpadModal);
  document.getElementById("dialpadModalOverlay")?.addEventListener("click", (e) => {
    if (e.target.id === "dialpadModalOverlay") {
      closeDialpadModal();
    }
  });

  // 10. 撥號盤 12 鍵按鈕
  document.querySelectorAll(".dial-key").forEach(keyBtn => {
    keyBtn.addEventListener("click", () => {
      const digit = keyBtn.dataset.key;
      sounds.playDtmf(digit);
      appendDialDigit(digit);
    });
  });

  // 11. 撥號盤操作：退格與清空
  document.getElementById("dialpadBackspace")?.addEventListener("click", () => {
    sounds.playClick();
    backspaceDialDigit();
  });

  // 12. 撥號盤操作：模擬撥號測試
  document.getElementById("dialpadSimCallBtn")?.addEventListener("click", () => {
    const ext = document.getElementById("modalDialNumber").innerText.trim();
    if (!ext) {
      showToast("請先輸入欲撥打的分機號碼", "warning");
      return;
    }
    simulateDialCall(ext);
  });

  // 13. 列印按鈕
  document.getElementById("printBtn")?.addEventListener("click", () => {
    sounds.playClick();
    window.print();
  });

  // 14. 匯入 / PDF 管理按鈕
  document.getElementById("importDataBtn")?.addEventListener("click", () => {
    sounds.playClick();
    openImportModal();
  });
  document.getElementById("importModalClose")?.addEventListener("click", closeImportModal);
  document.getElementById("importModalOverlay")?.addEventListener("click", (e) => {
    if (e.target.id === "importModalOverlay") closeImportModal();
  });

  // 15. 文字解析匯入處理
  document.getElementById("doParseImportBtn")?.addEventListener("click", handleCustomTextImport);
  document.getElementById("resetDefaultDataBtn")?.addEventListener("click", handleResetDefaultData);
}

/**
 * 字體大小切換核心
 */
function setFontSize(mode, shouldToast = true) {
  state.fontSizeMode = mode;
  localStorage.setItem("ymhs_font_mode", mode);

  document.body.classList.remove("font-lg-mode", "font-xl-mode");
  const fontBtn = document.getElementById("fontToggleBtn");

  if (mode === "lg") {
    document.body.classList.add("font-lg-mode");
    if (fontBtn) fontBtn.innerHTML = `🔤 字體：加大 A+`;
    if (shouldToast) showToast("已切換為【加大字體】以利舒適閱讀", "info");
  } else if (mode === "xl") {
    document.body.classList.add("font-xl-mode");
    if (fontBtn) fontBtn.innerHTML = `🔤 字體：特大 A++`;
    if (shouldToast) showToast("已切換為【特大字體】以利清晰閱讀", "info");
  } else {
    if (fontBtn) fontBtn.innerHTML = `🔤 字體：標準 A`;
    if (shouldToast) showToast("已切換為【標準字體】", "info");
  }
}

/**
 * 更新音效按鈕外觀
 */
function updateSoundBtnUI(btn) {
  if (sounds.isSoundEnabled()) {
    btn.innerHTML = `🔊 音效開`;
    btn.classList.add("primary");
  } else {
    btn.innerHTML = `🔇 靜音`;
    btn.classList.remove("primary");
  }
}

/**
 * 篩選與排序邏輯
 */
function applyFilters() {
  const query = state.searchQuery;

  state.filteredData = state.data.filter(item => {
    // 1. 常用分機限定
    if (state.onlyFavorites && !state.favorites.has(item.ext)) {
      return false;
    }

    // 2. 處室分類
    if (state.activeCategory !== "all" && item.category !== state.activeCategory) {
      return false;
    }

    // 3. 館舍分類
    if (state.activeBuilding !== "all" && item.building !== state.activeBuilding) {
      return false;
    }

    // 4. 關鍵字搜尋 (支援分機、處室、職稱、姓名、地點、職掌、標籤)
    if (query) {
      const matchExt = item.ext.includes(query);
      const matchDept = item.dept.toLowerCase().includes(query);
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchName = item.name.toLowerCase().includes(query);
      const matchLoc = item.location.toLowerCase().includes(query);
      const matchDuties = item.duties.toLowerCase().includes(query);
      const matchTags = item.tags && item.tags.some(t => t.toLowerCase().includes(query));

      return matchExt || matchDept || matchTitle || matchName || matchLoc || matchDuties || matchTags;
    }

    return true;
  });

  // 排序
  state.filteredData.sort((a, b) => {
    // 收藏優先？
    if (state.activeSort === "fav_first") {
      const aFav = state.favorites.has(a.ext) ? 1 : 0;
      const bFav = state.favorites.has(b.ext) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;
    }

    if (state.activeSort === "ext_asc") {
      return parseInt(a.ext, 10) - parseInt(b.ext, 10);
    } else if (state.activeSort === "ext_desc") {
      return parseInt(b.ext, 10) - parseInt(a.ext, 10);
    } else if (state.activeSort === "dept") {
      return a.dept.localeCompare(b.dept, 'zh-Hant');
    }
    return 0;
  });

  render();
}

/**
 * 渲染主入口
 */
function render() {
  updateSummaryBar();
  renderCardsView();
  renderTableView();
  if (state.activeView === "buildings") {
    const activeTab = document.querySelector(".building-tab-btn.active");
    const bldId = activeTab ? activeTab.dataset.building : BUILDINGS[0].id;
    renderBuildingContent(bldId);
  }
}

/**
 * 更新結果摘要統計列
 */
function updateSummaryBar() {
  const summaryElem = document.getElementById("resultsSummaryBar");
  if (!summaryElem) return;

  const count = state.filteredData.length;
  let statusText = `顯示中：共 <span class="highlight-count">${count}</span> 筆分機項目`;

  if (state.searchQuery) {
    statusText += ` (符合「${escapeHtml(state.searchQuery)}」)`;
  }
  if (state.onlyFavorites) {
    statusText += ` (⭐ 僅顯示常用分機)`;
  }

  summaryElem.innerHTML = `
    <div>${statusText}</div>
    <div style="font-size: var(--font-xs); color: var(--text-light);">
      提示：點擊號碼可模擬撥號，點擊複製可貼上
    </div>
  `;
}

/**
 * 視圖 1：處室卡片網格渲染
 */
function renderCardsView() {
  const container = document.getElementById("cardsViewContainer");
  if (!container) return;

  if (state.filteredData.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #FFFFFF; border-radius: var(--radius-lg); border: 2px dashed var(--border-color);">
        <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
        <h3 style="font-size: var(--font-xl); color: var(--text-main); margin-bottom: 8px;">沒有找到符合的分機項目</h3>
        <p style="color: var(--text-muted); font-size: var(--font-base);">請嘗試不同的關鍵字（例如：教務、1201、護理師、警衛室），或清除篩選條件。</p>
        <button class="icon-btn primary" style="margin-top: 16px;" onclick="clearAllFilters()">
          清除所有搜尋條件
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.filteredData.map(item => {
    const isFav = state.favorites.has(item.ext);
    const catObj = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[0];
    const highExt = highlightText(item.ext, state.searchQuery);
    const highTitle = highlightText(item.title, state.searchQuery);
    const highDept = highlightText(item.dept, state.searchQuery);
    const highDuties = highlightText(item.duties, state.searchQuery);
    const highPerson = highlightText(item.name, state.searchQuery);

    return `
      <div class="ext-card ${item.isEmergency ? 'emergency-card' : ''} ${isFav ? 'favorite-card' : ''}" data-ext="${item.ext}">
        <div>
          <div class="card-top-row">
            <span class="dept-badge" style="background: ${catObj.lightBg}; color: ${catObj.color};">
              ${highDept}
            </span>
            <button class="favorite-star-btn ${isFav ? 'active' : ''}" title="${isFav ? '取消常用' : '加入常用'}" onclick="toggleFavorite('${item.ext}')">
              ${isFav ? '★' : '☆'}
            </button>
          </div>

          <div class="ext-number-box">
            <span class="ext-number-label">分機</span>
            <span class="ext-number">${highExt}</span>
            ${item.isEmergency ? '<span class="brand-badge pulse-emergency" style="background: #FEE2E2; color: #DC2626; border-color: #FECDD3;">🚨 緊急/重要</span>' : ''}
          </div>

          <div class="ext-title">${highTitle}</div>
          <div class="ext-person">
            <span>👤</span>
            <span>${highPerson}</span>
          </div>

          <div class="ext-location">
            <span>📍</span>
            <span>${item.location}</span>
            ${item.fax ? `<span style="margin-left: 8px; color: var(--accent-cyan);">📠 傳真: ${item.fax}</span>` : ''}
          </div>

          <div class="ext-duties" title="${escapeHtml(item.duties)}">
            ${highDuties}
          </div>

          <div class="ext-tags-row">
            ${(item.tags || []).map(t => `<span class="item-tag">#${highlightText(t, state.searchQuery)}</span>`).join('')}
          </div>
        </div>

        <div class="card-actions-row">
          <button class="action-btn copy-btn" onclick="copyExtension('${item.ext}', '${escapeHtml(item.title)}')">
            <span>📋</span>
            <span>複製分機</span>
          </button>
          <button class="action-btn dial-btn" onclick="handleCardDial('${item.ext}')">
            <span>📞</span>
            <span>撥打通話</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 視圖 2：列表表格視圖渲染
 */
function renderTableView() {
  const tbody = document.getElementById("tableBodyContainer");
  if (!tbody) return;

  if (state.filteredData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 36px; color: var(--text-muted);">
          沒有符合的分機資料
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = state.filteredData.map(item => {
    const isFav = state.favorites.has(item.ext);
    const highExt = highlightText(item.ext, state.searchQuery);
    const highDept = highlightText(item.dept, state.searchQuery);
    const highTitle = highlightText(item.title, state.searchQuery);
    const highName = highlightText(item.name, state.searchQuery);
    const highDuties = highlightText(item.duties, state.searchQuery);

    return `
      <tr>
        <td style="text-align: center;">
          <button class="favorite-star-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${item.ext}')">
            ${isFav ? '★' : '☆'}
          </button>
        </td>
        <td class="table-ext-cell">#${highExt}</td>
        <td style="font-weight: 700;">${highDept}</td>
        <td style="font-weight: 700; color: var(--text-main);">${highTitle}</td>
        <td>${highName}</td>
        <td style="color: var(--text-light);">${item.location}</td>
        <td style="max-width: 280px; font-size: var(--font-sm); color: var(--text-muted);">${highDuties}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn copy-btn" style="padding: 6px 10px; font-size: 13px;" onclick="copyExtension('${item.ext}', '${escapeHtml(item.title)}')">
              複製
            </button>
            <button class="action-btn dial-btn" style="padding: 6px 10px; font-size: 13px;" onclick="handleCardDial('${item.ext}')">
              撥號
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * 視圖 3：館舍導覽內容渲染
 */
function renderBuildingContent(buildingId) {
  const container = document.getElementById("buildingContentPanel");
  if (!container) return;

  const bld = BUILDINGS.find(b => b.id === buildingId);
  if (!bld) return;

  const bldItems = state.data.filter(item => item.building === buildingId);

  container.innerHTML = `
    <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
      <h3 style="font-size: var(--font-2xl); font-weight: 800; color: var(--text-main); margin-bottom: 4px;">
        🏛️ ${bld.name}
      </h3>
      <p style="color: var(--text-muted); font-size: var(--font-base);">
        樓層範圍：${bld.floors} | 主要配置處室：${bld.desc} (共有 ${bldItems.length} 個分機據點)
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
      ${bldItems.map(item => `
        <div style="background: #F8FAFC; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: var(--font-xs); color: var(--primary); font-weight: 700;">${item.dept} • ${item.location}</div>
            <div style="font-size: var(--font-lg); font-weight: 800; color: var(--text-main);">${item.title}</div>
            <div style="font-size: var(--font-sm); color: var(--text-muted);">${item.name}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 24px; font-weight: 900; color: var(--primary); font-family: monospace;">#${item.ext}</div>
            <button class="action-btn dial-btn" style="padding: 4px 10px; font-size: 12px; margin-top: 6px;" onclick="handleCardDial('${item.ext}')">
              撥打
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 常用分機星號切換
 */
function toggleFavorite(ext) {
  const isNowFav = !state.favorites.has(ext);
  if (isNowFav) {
    state.favorites.add(ext);
    sounds.playFavorite(true);
    showToast(`已將分機 #${ext} 加入常用名單 ⭐`, "success");
  } else {
    state.favorites.delete(ext);
    sounds.playFavorite(false);
    showToast(`已自常用名單移除分機 #${ext}`, "info");
  }

  saveFavorites();
  
  // 更新常用篩選按鈕數量
  const favBtn = document.getElementById("favFilterBtn");
  if (favBtn && !state.onlyFavorites) {
    favBtn.innerHTML = `⭐ 我的常用 (${state.favorites.size})`;
  }

  applyFilters();
}

/**
 * 一鍵複製分機與總機
 */
function copyExtension(ext, title) {
  sounds.playSuccess();
  const fullText = `桃園市立楊梅高中 (03)478-9618 分機 ${ext} (${title})`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullText).then(() => {
      showToast(`已複製：分機 #${ext} (含總機與處室)`, "success");
    }).catch(() => {
      fallbackCopy(ext);
    });
  } else {
    fallbackCopy(ext);
  }
}

function fallbackCopy(text) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  showToast(`已複製分機 #${text}`, "success");
}

/**
 * 處理卡片撥打按鈕 (判斷裝置或桌面模擬)
 */
function handleCardDial(ext) {
  sounds.playClick();
  const target = state.data.find(d => d.ext === ext);
  if (!target) return;

  // 手機平板觸發撥打或開啟虛擬撥盤
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // 手機裝置提供自動接分機語法 (逗號為等待 2 秒)
    const telUri = `tel:034789618,${ext}`;
    window.location.href = telUri;
    showToast(`正在喚起手機撥號至分機 #${ext}...`, "info");
  } else {
    openDialpadModal(target);
  }
}

/**
 * 開啟虛擬撥號對話框
 */
function openDialpadModal(target) {
  state.activeModalExt = target;
  const overlay = document.getElementById("dialpadModalOverlay");
  const numberView = document.getElementById("modalDialNumber");
  const targetView = document.getElementById("modalTargetName");
  const realCallBtn = document.getElementById("modalRealCallLink");

  if (!overlay || !numberView || !targetView) return;

  numberView.innerText = target.ext || "";
  targetView.innerText = `${target.dept} - ${target.title} (${target.name || ''})`;

  if (realCallBtn) {
    realCallBtn.href = target.ext ? `tel:034789618,${target.ext}` : `tel:034789618`;
  }

  document.getElementById("modalDialStatus").innerText = "楊梅高中代表號 (03) 478-9618";
  overlay.classList.add("active");
  sounds.playDing();
}

/**
 * 關閉虛擬撥號對話框
 */
function closeDialpadModal() {
  const overlay = document.getElementById("dialpadModalOverlay");
  if (overlay) overlay.classList.remove("active");
}

/**
 * 撥號盤鍵入數字
 */
function appendDialDigit(char) {
  const numberView = document.getElementById("modalDialNumber");
  if (!numberView) return;

  let current = numberView.innerText.trim();
  if (current.length < 6) {
    current += char;
    numberView.innerText = current;

    // 尋找符合的分機
    const matched = state.data.find(d => d.ext === current);
    const targetView = document.getElementById("modalTargetName");
    if (matched && targetView) {
      targetView.innerText = `🔍 符合：${matched.dept} - ${matched.title} (${matched.name})`;
    }
  }
}

/**
 * 撥號盤退格
 */
function backspaceDialDigit() {
  const numberView = document.getElementById("modalDialNumber");
  if (!numberView) return;

  let current = numberView.innerText.trim();
  if (current.length > 0) {
    current = current.slice(0, -1);
    numberView.innerText = current;
  }
}

/**
 * 模擬撥號呼叫流程 (撥號音 + 回鈴音 + 接通)
 */
function simulateDialCall(ext) {
  const statusElem = document.getElementById("modalDialStatus");
  const simBtn = document.getElementById("dialpadSimCallBtn");

  if (statusElem) statusElem.innerText = `📞 正在模擬送出 DTMF 撥號音...`;
  if (simBtn) simBtn.disabled = true;

  sounds.playExtensionSequence(ext, () => {
    if (statusElem) statusElem.innerText = `🔔 分機撥打中，等待受話端應答 (嘟--嘟--)...`;
    
    sounds.playRingback(2, () => {
      const matched = state.data.find(d => d.ext === ext);
      const name = matched ? `${matched.dept} ${matched.title}` : `分機 #${ext}`;
      if (statusElem) statusElem.innerHTML = `✅ <span style="color: #10B981; font-weight: 800;">通話已接通：${name}</span>`;
      if (simBtn) simBtn.disabled = false;
      showToast(`通話模擬已完成！成功接通 ${name}`, "success");
    });
  });
}

/**
 * 顯示快顯通知 (Toast)
 */
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3200);
}

/**
 * 清除所有篩選條件
 */
function clearAllFilters() {
  sounds.playClick();
  state.searchQuery = "";
  state.activeCategory = "all";
  state.activeBuilding = "all";
  state.onlyFavorites = false;

  const searchInput = document.getElementById("mainSearchInput");
  if (searchInput) searchInput.value = "";
  document.getElementById("searchClearBtn").style.display = "none";

  document.querySelectorAll(".cat-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.category === "all");
  });

  const bldSelect = document.getElementById("buildingFilterSelect");
  if (bldSelect) bldSelect.value = "all";

  const favBtn = document.getElementById("favFilterBtn");
  if (favBtn) {
    favBtn.classList.remove("primary");
    favBtn.innerHTML = `⭐ 我的常用 (${state.favorites.size})`;
  }

  applyFilters();
}

/**
 * 關鍵字高亮工具函式
 */
function highlightText(text, query) {
  if (!text || !query) return escapeHtml(text || "");
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
  return escaped.replace(regex, `<mark style="background: #FEF08A; color: #854D0E; padding: 0 2px; border-radius: 2px;">$1</mark>`);
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/**
 * 匯入資料彈窗
 */
function openImportModal() {
  document.getElementById("importModalOverlay")?.classList.add("active");
}

function closeImportModal() {
  document.getElementById("importModalOverlay")?.classList.remove("active");
}

/**
 * 處理自訂文字解析與匯入
 */
function handleCustomTextImport() {
  const textarea = document.getElementById("importRawText");
  if (!textarea) return;

  const raw = textarea.value.trim();
  if (!raw) {
    showToast("請先貼上欲解析的分機清單文字或內容", "warning");
    return;
  }

  // 嘗試解析 JSON 格式
  try {
    const jsonParsed = JSON.parse(raw);
    if (Array.isArray(jsonParsed) && jsonParsed.length > 0 && jsonParsed[0].ext) {
      state.data = jsonParsed;
      localStorage.setItem("ymhs_custom_extensions", JSON.stringify(state.data));
      closeImportModal();
      initCategoryPills();
      applyFilters();
      sounds.playSuccess();
      showToast(`成功匯入 ${state.data.length} 筆自訂分機資料！`, "success");
      return;
    }
  } catch (e) {
    // 非 JSON，使用正則文字解析器
  }

  // 智慧文字解析器：一行行尋找 4 位數分機與處室文字
  const lines = raw.split(/\r?\n/);
  const newItems = [];

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // 比對 4 位數字 (如 1102, 1201)
    const extMatch = line.match(/\b(1\d{3})\b/);
    if (extMatch) {
      const ext = extMatch[1];
      // 移除分機數字剩下的文字作為處室職稱
      const remain = line.replace(ext, '').replace(/[:：#號]/g, '').trim();
      const parts = remain.split(/[\s\t,，/]+/).filter(Boolean);

      newItems.push({
        ext: ext,
        dept: parts[0] || "新增單位",
        category: "faculty",
        title: parts[1] || parts[0] || "業務承辦",
        name: parts[2] || "校內分機",
        location: "楊梅高中校區",
        building: "admin",
        duties: remain || "校內業務聯繫與分機通話",
        tags: [parts[0] || "校內"]
      });
    }
  });

  if (newItems.length > 0) {
    state.data = newItems;
    localStorage.setItem("ymhs_custom_extensions", JSON.stringify(state.data));
    closeImportModal();
    initCategoryPills();
    applyFilters();
    sounds.playSuccess();
    showToast(`成功解析並匯入 ${newItems.length} 筆分機項目！`, "success");
  } else {
    showToast("未能在文字中辨識出 4 碼分機號碼，請確認格式", "warning");
  }
}

/**
 * 重設回官方預設資料
 */
function handleResetDefaultData() {
  if (confirm("確定要將分機資料庫還原為官方最新完整預設值嗎？")) {
    localStorage.removeItem("ymhs_custom_extensions");
    state.data = [...EXTENSION_DATA];
    closeImportModal();
    initCategoryPills();
    applyFilters();
    sounds.playSuccess();
    showToast("已成功還原為楊梅高中官方完整分機資料！", "success");
  }
}
