export default function findHeadings(component) {
  return component.props.children.reduce((acc, child) => {
    if (typeof child === 'object') {
      if (/^h[1-6]$/.test(child.type)) {
        return acc.concat([
          {
            id: child.props.id,
            text: child.props.children[0]
          }
        ]);
      }

      if (child.props.children) {
        return acc.concat(findHeadings(child));
      }
    }

    return acc;
  }, []);
}
