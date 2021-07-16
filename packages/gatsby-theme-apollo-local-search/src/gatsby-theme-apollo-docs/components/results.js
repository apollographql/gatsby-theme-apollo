import React from 'react';
import {Link, withPrefix} from 'gatsby';

const WHITESPACE = {
    'whiteSpace': 'normal',
};

function result({id, title, description, excerpt, path, selected}, tabIndex) {
    return (<div key={id} className="ds-suggestion" role="option"
                 aria-selected={selected}>
        <Link className="algolia-docsearch-suggestion
    algolia-docsearch-suggestion__main
    algolia-docsearch-suggestion__secondary
    "
              tabIndex={tabIndex}
              aria-label="Link to the result"
              title={description}
              to={withPrefix(path).replace(/\.mdx?$/, '')}
              style={WHITESPACE}
        >
            <div className="algolia-docsearch-suggestion--category-header">
                <span className="algolia-docsearch-suggestion--category-header-lvl0">{description || title}</span>
            </div>
            <div className="algolia-docsearch-suggestion--wrapper">
                <div className="algolia-docsearch-suggestion--content">
                    <div className="algolia-docsearch-suggestion--text">{excerpt}…</div>
                </div>
            </div>
        </Link>
    </div>);
}

const STYLE = {
    position: 'absolute',
    top: '100%',
    zIndex: 200,
    left: 0,
    right: 'auto',
    display: 'block',
};

const BLOCK = {display: 'block'};

export function Results({results, onClick,}) {
    return (
        <span className="ds-dropdown-menu ds-with-1"
              role="listbox"
              tabIndex={0}
              style={STYLE}
              onClick={onClick}>
     <div className="ds-dataset-1">
       <span className="ds-suggestions" style={BLOCK}>{results.map(result)}</span>
     </div>
  </span>
    );
}
