import createElement from "./virtualdom/createElement";
import render from "./virtualdom/render";
import mount from "./virtualdom/mount";
import diff from "./virtualdom/diff";
import "./main.css";

const createVirtualApp = (count) =>
  createElement("div", {
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      createElement("img", {
        attrs: {
          id: "mew-giphy",
          src: "https://media.giphy.com/media/jOQ91yKFFdSgu7HZqh/giphy.gif",
        },
      }),
      `🍥 ✨ 뮤가 ` + (count + 1) + `번째 도는중  ✨ 🍥`,
    ],
  });

let count = 0;

let virtualApp = createVirtualApp(count);
const $app = render(virtualApp);

let $rootElement = mount($app, document.getElementById("app"));

setInterval(() => {
  count++;
  const virtualNewApp = createVirtualApp(count);
  const patch = diff(virtualApp, virtualNewApp);
  $rootElement = patch($rootElement);
  virtualApp = virtualNewApp;
}, 2000);

mount($rootElement, document.getElementById("app"));
