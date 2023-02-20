// code for theme - Dark or Light Mode
const theme = document.getElementById("theme");
theme.addEventListener("click", () => {
  const btn = theme.querySelector("span");
  const body = document.querySelector("body");
  const langHead = document.querySelector("#language p");
  const codeInp = document.querySelector("#enterCode textarea");
  const popups = document.querySelectorAll(".popup");
  const popupInp = document.querySelector("#takeInput textarea");
  const output = document.querySelector("#output p");
  btn.classList.toggle("toggleTheme");
  if (btn.classList.contains("toggleTheme")) {
    theme.style.backgroundColor = "rgb(165, 165, 165)";
    body.style.backgroundColor = "rgb(245, 245, 245)";
    langHead.style.backgroundColor = "rgb(245, 245, 245)";
    codeInp.style.backgroundColor = "white";
    body.style.color = "black";
    codeInp.style.color = "black";

    popupInp.style.backgroundColor = "white";
    popupInp.style.color = "black";
    output.style.backgroundColor = "white";
    popups.forEach((item) => {
      item.style.backgroundColor = "#eeeeee";
      item.style.color = "black";
    });
  } else {
    theme.style.backgroundColor = "rgba(255, 255, 255, 0.17)";
    body.style.backgroundColor = "rgb(39, 30, 49)";
    langHead.style.backgroundColor = "rgb(39, 30, 49)";
    codeInp.style.backgroundColor = "rgba(41, 41, 41, 0.2)";
    body.style.color = "white";
    codeInp.style.color = "white";

    popupInp.style.backgroundColor = "rgba(41, 41, 41, 0.2)";
    popupInp.style.color = "white";
    output.style.backgroundColor = "rgba(41, 41, 41, 0.2)";
    popups.forEach((item) => {
      item.style.backgroundColor = "rgb(58, 43, 76)";
      item.style.color = "white";
    });
  }
});

// code to selecting language
let activeLang = undefined;
document.querySelectorAll(".languages").forEach((lang) => {
  lang.addEventListener("click", () => {
    activeLang?.classList.remove("activeLanguage");
    lang.classList.toggle("activeLanguage");
    activeLang = lang;
  });
});

let requireInput = false;
document.querySelector("#language div input").addEventListener("change", () => {
  requireInput = !requireInput;
});

// executing code by fetching CodeX API
function executionOutput(code, lang, input) {
  const selectLang = document.getElementById("selectLanguage");
  const takeInput = document.getElementById("takeInput");
  const executing = document.getElementById("underExecution");
  const output = document.getElementById("output");

  selectLang.style.display = "none";
  takeInput.style.display = "none";
  executing.style.display = "flex";
  output.style.display = "none";

  const data = {
    code: code,
    language: lang,
    input: input,
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  fetch("https://api.codex.jaagrav.in", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const outputStatus = output.querySelector("h3");
      const outputText = output.querySelector("p");
      if (data.status === 200 && data.output.length) {
        outputStatus.innerText = "Success (200)";
        outputStatus.style.color = "#04e52c";
        outputText.innerText = data.output;
      } else {
        outputStatus.innerText = `Error (${data.status})`;
        outputStatus.style.color = "#fc5b5b";
        outputText.innerText = data.error;
      }
      executing.style.display = "none";
      output.style.display = "flex";
      console.log(data);
    })
    .catch((error) => console.log(error));
}

// code to check if ready to execute or not
function executeCode(code, lang) {
  // display popup window
  const loading = document.getElementById("popupWindow");
  loading.style.animation = "fadeIn 0.4s 0s";
  loading.style.display = "flex";

  const selectLang = document.getElementById("selectLanguage");
  const takeInput = document.getElementById("takeInput");
  const executing = document.getElementById("underExecution");
  const output = document.getElementById("output");
  const codeAvailable = code?.length;

  if (!lang || !codeAvailable) {
    // display invalid popup
    const image = selectLang.querySelector("img");
    const text = selectLang.querySelector("p");

    if (!codeAvailable) {
      image.setAttribute("src", "images/noCode.png");
      text.innerText = "No Code Found!";
    } else {
      image.setAttribute("src", "images/choose.png");
      text.innerText = "Please Select Language";
    }

    selectLang.style.display = "flex";
    takeInput.style.display = "none";
    executing.style.display = "none";
    output.style.display = "none";

    setTimeout(() => {
      loading.style.animation = "fadeOut 0.3s 0s";
    }, 1200);

    setTimeout(() => {
      loading.style.display = "none";
    }, 1500);
  } else if (requireInput) {
    // display input popup
    selectLang.style.display = "none";
    takeInput.style.display = "flex";
    executing.style.display = "none";
    output.style.display = "none";
  } else {
    // start executing the code
    executionOutput(code, lang, "");
  }
}

const language_Ext = {
  python: "py",
  java: "java",
  "C++": "cpp",
  GO: "go",
  "C#": "cs",
};

// added event when code is executed using form input
document.getElementById("enterCode").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.querySelector("#enterCode textarea").value;
  const lang =
    language_Ext[activeLang?.querySelector("img").getAttribute("alt")];
  executeCode(code, lang);
});

// added event when code is executed through the input form
document.getElementById("takeInput").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#takeInput textarea");
  const code = document.querySelector("#enterCode textarea").value;
  const lang =
    language_Ext[activeLang?.querySelector("img").getAttribute("alt")];
  executionOutput(code, lang, input.value);
  input.value = "";
});

// close popup when clicked on close popup
document.getElementById("closePopup").addEventListener("click", () => {
  const popup = document.getElementById("popupWindow");
  popup.style.animation = "fadeOut 0.2s 0s";
  setTimeout(() => {
    popup.style.display = "none";
  }, 200);
});

// get selected text from content script and executing that code
document.getElementById("runCode").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "getSelectedText" },
      function (response) {
        console.log("Selected Text :", response);
        if (response)
          document.querySelector("#enterCode textarea").value = response;
        const lang =
          language_Ext[activeLang?.querySelector("img").getAttribute("alt")];
        executeCode(response, lang);
      }
    );
  });
});
