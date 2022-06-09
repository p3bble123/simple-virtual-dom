import render from "./render";

const zip = (xs, ys) => {
  const zipped = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
};

const diffAttributes = (oldAttributes, newAttributes) => {
  const patches = [];

  // sets new attributes
  for (const [key, value] of Object.entries(newAttributes)) {
    patches.push(($node) => {
      $node.setAttribute(key, value);
      return $node;
    });
  }

  // removes old attributes
  for (const key in oldAttributes) {
    if (!(key in newAttributes)) {
      patches.push(($node) => {
        $node.removeAttribute(key);
        return $node;
      });
    }
  }

  return ($node) => {
    for (const patch of patches) {
      patch($node);
    }
  };
};

const diffChildren = (oldVirtualChildren, newVirtualChildren) => {
  const childPatches = [];
  for (const [oldVirtualChild, newVirtualChild] of zip(
    oldVirtualChildren,
    newVirtualChildren
  )) {
    childPatches.push(diff(oldVirtualChild, newVirtualChild));
  }

  const additionalPatches = [];
  for (const additionalVirtualChild of newVirtualChildren.slice(
    oldVirtualChildren.length
  )) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(additionalVirtualChild));
      return $node;
    });
  }

  return ($parent) => {
    for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
      patch(child);
    }
    for (const patch of additionalPatches) {
      patch($parent);
    }

    return $parent;
  };
};

const diff = (virtualOldNode, virtualNewNode) => {
  if (virtualNewNode === undefined) {
    return ($node) => {
      $node.remove();
      return undefined;
    };
  }

  if (virtualOldNode.tagname !== virtualNewNode.tagname) {
    return ($node) => {
      const $newNode = render(virtualNewNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  if (
    typeof virtualOldNode === "string" ||
    typeof virtualNewNode === "string"
  ) {
    if (virtualOldNode !== virtualNewNode) {
      return ($node) => {
        const $newNode = render(virtualNewNode);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return ($node) => undefined;
    }
  }

  const patchAttributes = diffAttributes(
    virtualOldNode.attrs,
    virtualNewNode.attrs
  );
  const patchChildren = diffChildren(
    virtualOldNode.children,
    virtualNewNode.children
  );

  return ($node) => {
    patchAttributes($node);
    patchChildren($node);
    return $node;
  };
};

export default diff;
