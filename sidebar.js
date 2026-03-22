// ------------------------------
// プリセットプレビューのセット
// ------------------------------
function setPresetPreviews() {
  const readable = document.getElementById("preview-readable");
  readable.textContent = "読みやすい文字";
  readable.style.fontSize = "20px";
  readable.style.lineHeight = "1.7";
  readable.style.letterSpacing = "0.5px";

  const button = document.getElementById("preview-button");
  button.textContent = "ボタン風";
  button.style.backgroundColor = "#4A90E2";
  button.style.color = "#fff";
  button.style.padding = "8px 12px";
  button.style.borderRadius = "6px";
  button.style.textAlign = "center";

  const card = document.getElementById("preview-card");
  card.textContent = "カードの例";
  card.style.padding = "12px";
  card.style.backgroundColor = "#ffffff";
  card.style.borderRadius = "10px";
  card.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  card.style.border = "1px solid #eee";

  const shadow = document.getElementById("preview-shadow");
  shadow.textContent = "影の例";
  shadow.style.padding = "10px";
  shadow.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";

  const highlight = document.getElementById("preview-highlight");
  highlight.textContent = "強調の例";
  highlight.style.backgroundColor = "#FFF8C6";
  highlight.style.padding = "8px";
  highlight.style.borderRadius = "4px";
  highlight.style.border = "1px solid #F0D97A";
}

// ------------------------------
// ホバーでプレビュー強調
// ------------------------------
document.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("preset")) {
    const type = e.target.dataset.type;
    const preview = document.getElementById("preview-" + type);
    preview.classList.add("hover");
  }
});

document.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("preset")) {
    const type = e.target.dataset.type;
    const preview = document.getElementById("preview-" + type);
    preview.classList.remove("hover");
  }
});

// ------------------------------
// content.js からのメッセージ受信
// ------------------------------
window.addEventListener("message", (event) => {
  const data = event.data;

  if (data.type === "elementSelected") {
    document.getElementById("element-tag").textContent = "要素：" + data.tag;
    document.getElementById("element-text").textContent = "テキスト：" + data.text;

    document.getElementById("colorPicker").value = rgbToHex(data.styles.color);
    document.getElementById("bgColorPicker").value = rgbToHex(data.styles.backgroundColor);
    document.getElementById("fontSize").value = parseInt(data.styles.fontSize);
    document.getElementById("padding").value = parseInt(data.styles.padding);
    document.getElementById("margin").value = parseInt(data.styles.margin);
    document.getElementById("radius").value = parseInt(data.styles.borderRadius);

    // フォント
    document.getElementById("fontFamily").value = "";
  }

  if (data.type === "responseCss") {
    document.getElementById("css-output").textContent = data.css || "スタイルがありません。";
  }
});

// ------------------------------
// スタイル変更送信
// ------------------------------
function updateStyle(property, value) {
  parent.postMessage({
    type: "updateStyle",
    property,
    value
  });
}

// 入力欄イベント
document.getElementById("colorPicker").addEventListener("input", (e) => {
  updateStyle("color", e.target.value);
});

document.getElementById("bgColorPicker").addEventListener("input", (e) => {
  updateStyle("backgroundColor", e.target.value);
});

document.getElementById("fontSize").addEventListener("input", (e) => {
  updateStyle("fontSize", e.target.value + "px");
});

document.getElementById("padding").addEventListener("input", (e) => {
  updateStyle("padding", e.target.value + "px");
});

document.getElementById("margin").addEventListener("input", (e) => {
  updateStyle("margin", e.target.value + "px");
});

document.getElementById("radius").addEventListener("input", (e) => {
  updateStyle("borderRadius", e.target.value + "px");
});

// フォント選択
document.getElementById("fontFamily").addEventListener("change", (e) => {
  if (e.target.value) {
    updateStyle("fontFamily", e.target.value);
  }
});

// ------------------------------
// プリセット適用
// ------------------------------
document.querySelectorAll(".preset").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;

    const presets = {
      readable: {
        fontSize: "20px",
        lineHeight: "1.7",
        letterSpacing: "0.5px",
        color: "#222"
      },
      button: {
        padding: "12px 20px",
        backgroundColor: "#4A90E2",
        color: "#fff",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        display: "inline-block",
        textAlign: "center"
      },
      card: {
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        border: "1px solid #eee"
      },
      shadow: {
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
      },
      highlight: {
        backgroundColor: "#FFF8C6",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #F0D97A"
      }
    };

    const preset = presets[type];
    Object.keys(preset).forEach((key) => {
      updateStyle(key, preset[key]);
    });
  });
});

// ------------------------------
// プリセット保存機能
// ------------------------------
document.getElementById("save-preset").addEventListener("click", () => {
  const preset = {
    color: document.getElementById("colorPicker").value,
    backgroundColor: document.getElementById("bgColorPicker").value,
    fontSize: document.getElementById("fontSize").value + "px",
    padding: document.getElementById("padding").value + "px",
    margin: document.getElementById("margin").value + "px",
    borderRadius: document.getElementById("radius").value + "px",
    fontFamily: document.getElementById("fontFamily").value
  };

  const saved = JSON.parse(localStorage.getItem("savedPresets") || "[]");
  saved.push(preset);
  localStorage.setItem("savedPresets", JSON.stringify(saved));

  loadSavedPresets();
});

// 保存したプリセットを読み込み
function loadSavedPresets() {
  const container = document.getElementById("saved-presets");
  container.innerHTML = "";

  const saved = JSON.parse(localStorage.getItem("savedPresets") || "[]");

  saved.forEach((preset, index) => {
    const btn = document.createElement("button");
    btn.textContent = "プリセット " + (index + 1);
    btn.addEventListener("click", () => {
      Object.keys(preset).forEach((key) => {
        updateStyle(key, preset[key]);
      });
    });
    container.appendChild(btn);
  });
}

// ------------------------------
// CSSエクスポート
// ------------------------------
document.getElementById("export-css").addEventListener("click", () => {
  parent.postMessage({ type: "requestCss" }, "*");
});

// ------------------------------
// ダークモード
// ------------------------------
const darkToggle = document.getElementById("toggle-dark");

function applyThemeFromStorage() {
  const isDark = localStorage.getItem("sidebarDarkMode") === "true";
  document.body.classList.toggle("dark", isDark);
  darkToggle.checked = isDark;
}

darkToggle.addEventListener("change", (e) => {
  const isDark = e.target.checked;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("sidebarDarkMode", isDark);
});

// ------------------------------
// RGB → HEX
// ------------------------------
function rgbToHex(rgb) {
  if (!rgb) return "#000000";
  const result = rgb.match(/\d+/g);
  if (!result) return "#000000";
  return "#" + result.map((x) => ("0" + parseInt(x).toString(16)).slice(-2)).join("");
}

// ------------------------------
// 初期化
// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
  applyThemeFromStorage();
  setPresetPreviews();
  loadSavedPresets();
});
