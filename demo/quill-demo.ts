import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
// @ts-ignore
import { QuillBinding } from "../src/y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";

Quill.register("modules/cursors", QuillCursors);

const context = {
  bindings: [] as any[],
};

// @ts-ignore
window.context = context;

const ydoc = new Y.Doc();

function addQuillContainer(i: number) {
  const provider = new WebrtcProvider(`quill-demo-${i}`, ydoc);
  const type = ydoc.getText("quill");

  const editorContainer = document.createElement("div");
  editorContainer.setAttribute("id", `editor-${i}`);
  editorContainer.setAttribute("class", "editor-container");
  document.body.insertBefore(editorContainer, null);

  var editor = new Quill(editorContainer, {
    modules: {
      cursors: true,
      // toolbar: [
      //   [{ header: [1, 2, false] }],
      //   ['bold', 'italic', 'underline'],
      //   ['image', 'code-block']
      // ],
      toolbar: false,
      history: {
        userOnly: true,
      },
    },
    theme: "snow", // or 'bubble'
  });

  const binding = new QuillBinding(type, editor, provider.awareness);
  context.bindings.push({ provider, ydoc, type, binding, Y });
}

window.addEventListener("load", () => {
  addQuillContainer(0);
  addQuillContainer(1);

  /*
  // Define user name and user name
  // Check the quill-cursors package on how to change the way cursors are rendered
  provider.awareness.setLocalStateField('user', {
    name: 'Typing Jimmy',
    color: 'blue'
  })
  */

  const connectBtn = document.getElementById("y-connect-btn")!;
  connectBtn.addEventListener("click", () => {
    for (const binding of context.bindings) {
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
