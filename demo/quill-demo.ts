import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
// @ts-ignore
import { QuillBinding } from "../src/y-quill";
// @ts-ignore
import Quill from "quill";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

class Context {
  doc = new Y.Doc();
  history = new Y.UndoManager([], {
    trackedOrigins: new Set([this.doc.clientID]),
    doc: this.doc
  });
  containers: any[] = [];
}

const ctx = new Context();
// @ts-ignore
window.ctx = ctx;

function addQuillContainer(i: number) {
  const provider = new WebrtcProvider(`quill-demo-${i}`, ctx.doc);
  const yText = ctx.doc.getText(`q-${i}`);
  ctx.history.addToScope([yText]);

  const editorContainer = document.createElement("div");
  editorContainer.setAttribute("id", `editor-${i}`);
  editorContainer.setAttribute("class", "editor-container");
  document.body.appendChild(editorContainer);

  const quill = new Quill(editorContainer, {
    modules: {
      cursors: true,
      toolbar: false,
      history: {
        maxStack: 0,
        userOnly: true,
      },
      keyboard: {
        bindings: {
          undo: {
            key: "z",
            shortKey: true,
            handler() {
              ctx.history.undo();
              return false;
            },
          },
          redo: {
            key: "z",
            shiftKey: true,
            shortKey: true,
            handler() {
              ctx.history.redo();
              return false;
            },
          },
        },
      },
    },
    theme: "snow", // or 'bubble'
  });

  const binding = new QuillBinding(yText, quill, provider.awareness);
  ctx.containers.push({ provider, quill, yText, binding });
}

window.addEventListener("load", () => {
  addQuillContainer(0);
  addQuillContainer(1);

  const connectBtn = document.getElementById("y-connect-btn")!;
  connectBtn.addEventListener("click", () => {
    for (const binding of ctx.containers) {
      const { provider } = binding;
      if (provider.shouldConnect) {
        provider.disconnect();
        connectBtn.textContent = "Connect";
      } else {
        provider.connect();
        connectBtn.textContent = "Disconnect";
      }
    }
  });
});
