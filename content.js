console.log("Emulating VI keybindings on Whatsapp Web");

var globals = { currentMode: "n", loaded: false };

let config = {
  n: {
    options: {
      preventDefault: true,
    },
    keybindings: {
      "C-;": switchToReplyMode,
      "C- ": openExtendedSearch,
      i: switchToInsertMode,
      j: nextChat,
      k: previousChat,
    },
  },
  i: {
    options: {
      preventDefault: false,
    },
    keybindings: {
      "C-[": switchToNormalMode,
      "C-;": switchToReplyMode,
      "C- ": openExtendedSearch,
    },
  },
  r: {
    options: {
      preventDefault: true,
    },
    keybindings: {
      "C- ": openExtendedSearch,
      l: switchToInsertMode,
      j: replyModeDown,
      k: replyModeUp,
    },
  },
};

var checkLoaded = setInterval(() => {
  let result = document.querySelectorAll("[data-testid='chat-list-search']");
  if (result.length) {
    searchBar = result[0];
    globals.loaded = true;
    clearInterval(checkLoaded);
  }
}, 100);

document.addEventListener("keydown", (e) => {
  if (!globals.loaded) return;
  let { options, keybindings } = config[globals.currentMode];
  options.preventDefault && e.preventDefault();

  currentBinding = e.key;
  if (e.ctrlKey) {
    currentBinding = "C-" + e.key;
  }
  if (e.altKey) {
    currentBinding = "M-" + e.key;
  }
  if (keybindings[currentBinding]) {
    e.preventDefault();
    keybindings[currentBinding]();
  }

  // if (e.key == "p" && e.ctrlKey) {
  //   e.preventDefault();
  //   let event = new KeyboardEvent("keydown", {
  //     isTruested: true,
  //     key: "k",
  //     altKey: true,
  //   });
  //   document.dispatchEvent(event);
  // }
  // // if (e.key === "k") {
  // //   e.preventDefault();
  // //   replyNumber += 1;
  // // }
  // // if (e.key === "j") {
  // //   e.preventDefault();
  // //   replyNumber -= 1;
  // // }
  // // let result = document.querySelectorAll("[data-testid='msg-container']");
  // // console.log(replyNumber);
  // // result[result.length - replyNumber].dispatchEvent(doubleClick);
});

// Switching Modes
var replyLine = 0;
function switchToReplyMode() {
  replyLine = 0;
  globals.currentMode = "r";
}

function switchToInsertMode() {
  globals.currentMode = "i";
}

function switchToNormalMode() {
  if (globals.currentMode === "n") {
    switchToInsertMode();
    sendEscapeKeyEvent();
  }
  globals.currentMode = "n";
}

// Core
function sendEscapeKeyEvent() {
  let event = new KeyboardEvent("keydown", {
    isTruested: true,
    key: "Escape",
  });
  document.dispatchEvent(event);
}

function openExtendedSearch() {
  switchToInsertMode();
  let event = new KeyboardEvent("keydown", {
    isTruested: true,
    key: "k",
    altKey: true,
  });
  document.dispatchEvent(event);
}

// Reply Mode
function replyModeUp() {
  replyLine += 1;
  replyToCurrentLine();
}

function replyModeDown() {
  replyLine -= 1;
  if (replyLine < 0) {
    replyLine = 0;
  }
  replyToCurrentLine();
}

function replyToCurrentLine() {
  var doubleClick = new MouseEvent("dblclick", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  let result = document.querySelectorAll("[data-testid='msg-container']");
  result[result.length - replyLine].dispatchEvent(doubleClick);
}

// Normal Mode
function nextChat() {
  switchToInsertMode();
  let event = new KeyboardEvent("keydown", {
    isTruested: true,
    key: "Tab",
    altKey: true,
    ctrlKey: true,
  });
  document.dispatchEvent(event);
  switchToNormalMode();
}

function previousChat() {
  switchToInsertMode();
  let event = new KeyboardEvent("keydown", {
    isTruested: true,
    key: "Tab",
    altKey: true,
    ctrlKey: true,
    shiftKey: true,
  });
  document.dispatchEvent(event);
  switchToNormalMode();
}
