const renderElement = ({ tagName, attrs, children }) => {
  const $element = document.createElement(tagName);

  // sets attributes
  for (const [k, v] of Object.entries(attrs)) {
    $element.setAttribute(k, v);
  }

  // sets children(array of virtual doms)
  for (const child of children) {
    const $child = render(child);
    $element.appendChild($child);
  }

  return $element;
};

const render = (virtualNode) => {
  if (typeof virtualNode === "string") {
    return document.createTextNode(virtualNode);
  }

  return renderElement(virtualNode);
};

export default render;
