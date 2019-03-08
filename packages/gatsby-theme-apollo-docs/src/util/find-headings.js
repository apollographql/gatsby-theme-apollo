export default function findHeadings(component) {
  return component.props.children.reduce((acc, child) => {
    if (typeof child === 'object') {
      if (/^h[1-6]$/.test(child.type)) {
        return child.props.id
          ? acc.concat([
              {
                id: child.props.id,
                text: child.props.children[0]
              }
            ])
          : acc;
      }

      if (Array.isArray(child.props.children)) {
        return acc.concat(findHeadings(child));
      }
    }

    return acc;
  }, []);
}
