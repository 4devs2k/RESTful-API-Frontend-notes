"use strict";

function todoApp() {
  this.container = "";
  this.mode = "guest"; // start in guest mode
  this.guestStarted = false;
  this.currentTodo = {};

  this.init = function () {
    this.container = document.querySelector("#content");
    this.container.innerHTML = "";

    if (!this.guestStarted) {
      // Show guest button
      this.printGuestStart();
    } else if (this.mode === "list") {
      this.printBtn();
      this.getAllTodos();
    } else if (this.mode === "form") {
      this.printBtn();
      this.printForm();
    }
  };

  this.printGuestStart = function () {
    const html = `
      <div style="text-align:center; margin-top:2rem;">
        <button class="btn-todo btn-guest" id="btn-guest">Als Gast starten</button>
      </div>
    `;
    this.container.insertAdjacentHTML("beforeend", html);
    const btn = this.container.querySelector("#btn-guest");
    btn.addEventListener("click", () => {
      this.guestStarted = true;
      this.mode = "list";
      // Trigger initial request to set cookie
      this.apiHandler("https://api-notes.dev2k.space/api", "GET")
        .then(() => {
          this.init();
        })
        .catch((err) => {
          console.error("Fehler beim Gastzugang:", err);
        });
    });
  };

  this.resetCurrentTodo = function () {
    this.currentTodo = {
      id: 0,
      title: "",
      description: "",
      completed: 0,
    };
  };

  this.changeMode = function (mode) {
    this.mode = mode;
    this.container.innerHTML = "";
    this.init();
  };

  // existing printBtn, printTodo, printForm, etc. remain unchanged
  // ...

  /**
   * API handler mit Cookie-Support
   */
  this.apiHandler = function (url, method, data = null) {
    const options = {
      method: method,
      cache: "no-cache",
      credentials: "include", // send cookies
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data !== null) {
      options.body = JSON.stringify(data);
    }

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) throw new Error("Netzwerkantwort war nicht ok");
        return response.json();
      })
      .catch((error) => {
        console.error("Fehler bei API-Anfrage:", error);
        throw error;
      });
  };
}

// === Beim DOM ready ===
document.addEventListener("DOMContentLoaded", function () {
  const todoAppInstance = new todoApp();
  todoAppInstance.init();
});
