(function () {
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function parseMarkdown(md) {
        return escapeHtml(md)
            .replace(/^### (.*)$/gm, "<h3>$1</h3>")
            .replace(/^## (.*)$/gm, "<h2>$1</h2>")
            .replace(/^# (.*)$/gm, "<h1>$1</h1>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/`(.*?)`/g, "<code>$1</code>")
            .replace(/\n/g, "<br>");
    }

    function showModal(content) {
        let existing = document.getElementById("st-md-preview-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "st-md-preview-modal";

        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.background = "rgba(0,0,0,0.75)";
        modal.style.zIndex = "999999";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";

        const box = document.createElement("div");
        box.style.width = "70vw";
        box.style.maxHeight = "80vh";
        box.style.overflow = "auto";
        box.style.background = "#1e1e1e";
        box.style.color = "#fff";
        box.style.padding = "20px";
        box.style.borderRadius = "12px";
        box.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = parseMarkdown(content);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "OK";
        closeBtn.style.marginTop = "20px";
        closeBtn.onclick = () => modal.remove();

        box.appendChild(contentDiv);
        box.appendChild(closeBtn);
        modal.appendChild(box);
        document.body.appendChild(modal);
    }

    function makeButton(getContent) {
        const btn = document.createElement("button");
        btn.className = "menu_button st-md-preview-btn";
        btn.textContent = "MD";

        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const content = getContent();
            console.log("MD CLICKED", content?.slice(0, 50));
            showModal(content || "(empty)");
        });

        return btn;
    }

    function inject() {
    // Description
    const desc = document.getElementById("description_textarea");
    if (desc) {
        const host = desc.closest(".title_restorable, .flex-container, div");
        if (host && !host.querySelector(".st-md-preview-btn")) {
            host.appendChild(makeButton(() => desc.value));
        }
    }

    // First message
    const first = document.getElementById("firstmessage_textarea");
    if (first) {
        const host = first.closest(".title_restorable, .flex-container, div");
        if (host && !host.querySelector(".st-md-preview-btn")) {
            host.appendChild(makeButton(() => first.value));
        }
    }

    // Alternate greetings
    document.querySelectorAll("textarea[name='alternate_greetings']").forEach((ta) => {
    const host = ta.closest("div");
    if (!host || host.querySelector(".st-md-preview-btn")) return;

    const btn = document.createElement("button");
    btn.className = "st-md-preview-btn";
    btn.textContent = "MD";
    btn.dataset.altTarget = "true";

    host.appendChild(btn);
});
}

    document.addEventListener("click", function(e) {
    const btn = e.target.closest(".st-md-preview-btn[data-alt-target]");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const ta = btn.parentElement.querySelector("textarea[name='alternate_greetings']");
    if (ta) {
        showModal(ta.value || "(empty)");
    }
}, true);
	function hideFoldersOutsideFolderMode() {
    const folderModeBtn = document
    .querySelector('[title="Show only folders"]')
    ?.parentElement;

if (!folderModeBtn) return;

const folderModeActive = folderModeBtn.classList.contains("selected");

    document.querySelectorAll('.avatar[title^="[Folder]"]').forEach((folder) => {
        const card =
            folder.closest(".character_select, .bogus_folder_select, .group_select") ||
            folder.parentElement;

        if (card) {
            card.style.display = folderModeActive ? "" : "none";
        }
    });
}

setInterval(() => {
    inject();
    hideFoldersOutsideFolderMode();
}, 500);
})();
