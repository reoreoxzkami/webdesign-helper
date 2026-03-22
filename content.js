let selectedElement = null;

// --- サイドバーをページに挿入 ---
const sidebar = document.createElement("iframe");
sidebar.src = browser.runtime.getURL("sidebar.html");
sidebar.style.position = "fixed";
sidebar.style.top = "0";
sidebar.style.right = "0";
sidebar.style.width = "300px";
sidebar.style.height = "100vh";
sidebar.style.border = "none";
sidebar.style.zIndex = "999999";
document.body.appendChild(sidebar);

// --- 要素ハイライト ---
document.addEventListener("mouseover", (e) => {
  if (e.target !== selectedElement) {
    e.target.style.outline = "2px solid #4A90E2";
  }
});

document.addEventListener("mouseout", (e) => {
  if (e.target !== selectedElement) {
    e.target.style.outline = "";
  }
});

// --- 要素をクリックして選択 ---
document.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (selectedElement) {
    selectedElement.style.outline = "";
  }

  selectedElement = e.target;
  selectedElement.style.outline = "2px solid red";

  const styles = getComputedStyle(selectedElement);

  sidebar.contentWindow.postMessage({
    type: "elementSelected",
    tag: selectedElement.tagName.toLowerCase(),
    text: selectedElement.innerText.slice(0, 50),
    styles: {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
      padding: styles.padding,
      margin: styles.margin,
      borderRadius: styles.borderRadius,
      fontFamily: styles.fontFamily
    }
  }, "*");
});

// --- サイドバーからのメッセージ ---
window.addEventListener("message", (event) => {
  if (!selectedElement) return;

  // スタイル更新
  if (event.data.type === "updateStyle") {
    const { property, value } = event.data;
    selectedElement.style[property] = value;
  }

  // CSSエクスポート
  if (event.data.type === "requestCss") {
    const style = selectedElement.style;
    let css = "";

    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      const val = style.getPropertyValue(prop);
      css += `${prop}: ${val};\n`;
    }

    sidebar.contentWindow.postMessage({
      type: "responseCss",
      css
    }, "*");
  }
});
