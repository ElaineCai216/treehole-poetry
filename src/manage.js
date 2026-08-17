// 树洞诗集 · 诗库管理
// 在网页里直接增删改诗：改动自动保存到本机浏览器，立即生效；
// 可一键导出 poems.js，或用 GitHub Token 一键发布到仓库（自动重新部署）。

import {
  loadPoems,
  savePoems,
  resetPoems,
  generatePoemsJs,
  EMOTION_IDS,
  loadToken,
  saveToken,
} from "./poemStore.js";
import { EMOTIONS } from "./mood.js";

const $ = (sel) => document.querySelector(sel);
const LABELS = Object.fromEntries(EMOTIONS.map((e) => [e.id, e.label]));

let toastTimer = 0;
function showToast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

export function initManage({ onOpen, onClose } = {}) {
  const el = {
    btn: $("#manage-btn"),
    view: $("#manage"),
    back: $("#manage-back"),
    list: $("#manage-list"),
    exportBtn: $("#manage-export"),
    resetBtn: $("#manage-reset"),
    publishBtn: $("#manage-publish"),
    pubRepo: $("#manage-repo"),
    pubToken: $("#manage-token"),
    pubStatus: $("#manage-pub-status"),
    clearToken: $("#manage-clear-token"),
    saveHint: $("#manage-save-hint"),
  };
  if (!el.view) return;

  let data = loadPoems();
  let editing = null; // { emotion, index } | { emotion, index: -1 }

  function persist() {
    const ok = savePoems(data);
    el.saveHint.textContent = ok ? "已保存到本机 ✓" : "保存失败";
    el.saveHint.classList.add("show");
    clearTimeout(persist.timer);
    persist.timer = setTimeout(() => el.saveHint.classList.remove("show"), 2400);
  }

  function editorForm(emotion, index, poem) {
    const wrap = document.createElement("div");
    wrap.className = "m-form";
    const sel = document.createElement("select");
    sel.className = "m-style";
    sel.innerHTML = '<option value="modern">现代诗</option><option value="classical">古风</option>';
    sel.value = poem.style || "modern";
    const ta = document.createElement("textarea");
    ta.className = "m-textarea";
    ta.rows = 5;
    ta.placeholder = "每行一句诗，直接换行。古风建议正好四句、每句五或七字。";
    ta.value = poem.text || "";
    const actions = document.createElement("div");
    actions.className = "m-form-actions";
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "m-btn";
    saveBtn.textContent = "保存";
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "m-btn ghost";
    cancelBtn.textContent = "取消";
    actions.append(saveBtn, cancelBtn);
    wrap.append(sel, ta, actions);

    cancelBtn.addEventListener("click", () => {
      editing = null;
      render();
    });
    saveBtn.addEventListener("click", () => {
      const text = ta.value.trim();
      if (!text) {
        showToast("诗不能是空的");
        return;
      }
      const style = sel.value;
      const lines = text.split("\n");
      if (style === "classical" && lines.length !== 4) {
        showToast("古风建议正好 4 句（也可以先存下来）");
      }
      const item = { style, text };
      const arr = data[emotion] || [];
      if (index >= 0) arr[index] = item;
      else arr.push(item);
      data[emotion] = arr;
      editing = null;
      persist();
      render();
    });
    return wrap;
  }

  function render() {
    el.list.innerHTML = "";
    for (const id of EMOTION_IDS) {
      const list = data[id] || [];
      const card = document.createElement("div");
      card.className = "m-card";

      const head = document.createElement("div");
      head.className = "m-card-head";
      const label = document.createElement("span");
      label.className = "m-label";
      label.textContent = `${LABELS[id] || id}（${list.length} 首）`;
      const add = document.createElement("button");
      add.type = "button";
      add.className = "m-add";
      add.textContent = "＋ 添加";
      add.addEventListener("click", () => {
        editing = { emotion: id, index: -1 };
        render();
      });
      head.append(label, add);
      card.appendChild(head);

      const body = document.createElement("div");
      body.className = "m-body";
      list.forEach((poem, idx) => {
        const row = document.createElement("div");
        row.className = "m-row";
        if (editing && editing.emotion === id && editing.index === idx) {
          row.appendChild(editorForm(id, idx, poem));
        } else {
          const badge = document.createElement("span");
          badge.className = `m-badge ${poem.style === "classical" ? "classical" : "modern"}`;
          badge.textContent = poem.style === "classical" ? "古风" : "现代";
          const txt = document.createElement("span");
          txt.className = "m-text";
          txt.textContent = (poem.text || "").replace(/\n/g, " / ");
          const edit = document.createElement("button");
          edit.type = "button";
          edit.className = "m-mini";
          edit.textContent = "编辑";
          edit.addEventListener("click", () => {
            editing = { emotion: id, index: idx };
            render();
          });
          const del = document.createElement("button");
          del.type = "button";
          del.className = "m-mini danger";
          del.textContent = "删除";
          del.addEventListener("click", () => {
            if (!confirm(`删除这首诗？\n${(poem.text || "").slice(0, 30)}`)) return;
            list.splice(idx, 1);
            data[id] = list;
            editing = null;
            persist();
            render();
          });
          row.append(badge, txt, edit, del);
        }
        body.appendChild(row);
      });
      if (editing && editing.emotion === id && editing.index === -1) {
        const row = document.createElement("div");
        row.className = "m-row";
        row.appendChild(editorForm(id, -1, { style: "modern", text: "" }));
        body.appendChild(row);
      }
      card.appendChild(body);
      el.list.appendChild(card);
    }
  }

  function open() {
    data = loadPoems();
    editing = null;
    el.view.classList.remove("hidden");
    el.view.setAttribute("aria-hidden", "false");
    document.querySelector("#home").classList.add("hidden");
    document.querySelector("#poem-view").classList.add("hidden");
    render();
    if (onOpen) onOpen();
  }

  function close() {
    el.view.classList.add("hidden");
    el.view.setAttribute("aria-hidden", "true");
    document.querySelector("#poem-view").classList.add("hidden");
    document.querySelector("#home").classList.remove("hidden");
    if (onClose) onClose();
  }

  el.btn.addEventListener("click", open);
  el.back.addEventListener("click", close);

  // 导出 poems.js：复制 + 下载
  el.exportBtn.addEventListener("click", async () => {
    const code = generatePoemsJs(data);
    let copied = false;
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
    } catch {
      copied = false;
    }
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poems.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    showToast(copied ? "已复制到剪贴板，并下载了 poems.js" : "已下载 poems.js（复制被浏览器拦截）");
  });

  // 恢复内置诗库
  el.resetBtn.addEventListener("click", () => {
    if (!confirm("确定恢复成内置诗库吗？本机改过的都会丢。")) return;
    resetPoems();
    data = loadPoems();
    editing = null;
    render();
    showToast("已恢复内置诗库");
  });

  // 发布到 GitHub
  el.pubToken.value = loadToken();
  el.clearToken.addEventListener("click", () => {
    saveToken("");
    el.pubToken.value = "";
    showToast("已清除 Token");
  });

  el.publishBtn.addEventListener("click", async () => {
    const token = el.pubToken.value.trim();
    if (!token) {
      showToast("请先填入 GitHub Token（建议仅本仓库读写的 fine-grained token）");
      return;
    }
    saveToken(token);
    const repo = el.pubRepo.value.trim() || "ElaineCai216/treehole-poetry";
    const code = generatePoemsJs(data);
    const bytes = new TextEncoder().encode(code);
    let bin = "";
    bytes.forEach((b) => {
      bin += String.fromCharCode(b);
    });
    const content = btoa(bin);
    const api = `https://api.github.com/repos/${repo}/contents/src/poems.js`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    el.publishBtn.disabled = true;
    el.publishBtn.textContent = "发布中…";
    try {
      let sha = null;
      const getRes = await fetch(`${api}?ref=main`, { headers });
      if (getRes.ok) {
        const meta = await getRes.json();
        sha = meta.sha;
      } else if (getRes.status !== 404) {
        throw new Error(`读取 poems.js 失败（${getRes.status}）`);
      }
      const body = { message: "更新诗库（来自诗库管理）", content, branch: "main" };
      if (sha) body.sha = sha;
      const putRes = await fetch(api, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!putRes.ok) {
        const text = await putRes.text().catch(() => "");
        throw new Error(`发布失败（${putRes.status}）${text.slice(0, 120)}`);
      }
      el.pubStatus.textContent = "已发布 ✓";
      showToast("已发布！GitHub 约 1-2 分钟后自动部署全站更新");
    } catch (err) {
      el.pubStatus.textContent = "";
      showToast(String(err.message || err));
    } finally {
      el.publishBtn.disabled = false;
      el.publishBtn.textContent = "发布到 GitHub";
    }
  });
}
