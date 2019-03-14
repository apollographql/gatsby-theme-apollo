import escape from 'lodash/escape';
import extend from 'lodash/extend';
import handlebars from 'handlebars/dist/handlebars.min.js';
import html from 'raw-loader!hexo-typescript-api-box/typescript-api-box.html'; // eslint-disable-line import/no-unresolved
import map from 'lodash/map';
import partition from 'lodash/partition';
import showdown from 'showdown';
import visit from 'unist-util-visit';

const converter = new showdown.Converter();

// this code is ported from hexo-typescript-api-box
// https://github.com/apollographql/hexo-typescript-api-box/blob/master/typescript-api-box.js

function _link(id, name) {
  if (!name) {
    name = id;
  }

  return '<a href="#' + id + '">' + name + '</a>';
}

const template = handlebars.compile(html);
const pattern = /\{% tsapibox (\S+) %\}/;
export default function attacher({docs}) {
  const dataByKey = {};
  function traverse(tree, parentName) {
    let name = tree.name;
    if (['Constructor', 'Method', 'Property'].includes(tree.kindString)) {
      name = parentName + '.' + tree.name;
      // add the parentName to the data so we can reference it for ids
      tree.parentName = parentName;
      tree.fullName = name;
    }
    dataByKey[name] = tree;

    if (tree.children) {
      tree.children.forEach(child => {
        traverse(child, name);
      });
    }
  }

  if (docs) {
    traverse(docs);
  }

  function templateArgs(rawData) {
    const parameters = _parameters(rawData);
    const split = partition(parameters, 'isOptions');

    const groups = [];
    if (split[1].length > 0) {
      groups.push({
        name: 'Arguments',
        members: split[1]
      });
    }
    if (split[0].length > 0) {
      groups.push({
        name: 'Options',
        // the properties of the options parameter are the things listed in this group
        members: split[0][0].properties
      });
    }

    if ('Interface' === rawData.kindString) {
      groups.push({
        name: 'Properties',
        members: _objectProperties(rawData)
      });
    }

    let type;
    if ('Type alias' === rawData.kindString) {
      // this means it's an object type
      if (rawData.type.declaration && rawData.type.declaration.children) {
        groups.push({
          name: 'Properties',
          members: _objectProperties(rawData.type.declaration)
        });
      } else {
        type = _type(rawData);
      }
    }

    return {
      id: _typeId(rawData),
      name: rawData.name,
      type,
      signature: _signature(rawData, parameters),
      summary: _summary(rawData),
      groups,
      repo: 'apollostack/apollo-client',
      filepath: rawData.sources[0].fileName,
      lineno: rawData.sources[0].line
    };
  }

  // XXX: not sure whether to use the 'kind' enum from TS or just run with the
  // strings. Strings seem safe enough I guess
  function _signature(rawData, parameters) {
    let dataForSignature = rawData;
    if (_isReflectedProperty(rawData)) {
      dataForSignature = rawData.type.declaration;
    }

    const escapedName = escape(rawData.name);

    // if it is a function, and therefore has arguments
    const signature =
      dataForSignature.signatures && dataForSignature.signatures[0];
    if (signature) {
      const name = rawData.name;
      const parameterString = _parameterString(map(parameters, 'name'));
      let returnType = '';
      if (rawData.kindString !== 'Constructor') {
        const type = _type(signature, true);
        if (type !== 'void') {
          returnType = ': ' + _type(signature, true);
        }
      }

      return name + parameterString + returnType;
    }

    return escapedName;
  }

  function _summary(rawData) {
    if (rawData.comment) {
      return rawData.comment.shortText;
    }
    return (
      rawData.signatures &&
      rawData.signatures[0].comment &&
      rawData.signatures[0].comment.shortText
    );
  }

  // Takes the data about a function / constructor and parses out the named params
  function _parameters(rawData) {
    if (_isReflectedProperty(rawData)) {
      return _parameters(rawData.type.declaration);
    }

    const signature = rawData.signatures && rawData.signatures[0];
    if (!signature) {
      return [];
    }

    return map(signature.parameters, function(param) {
      let name;
      if (isReadableName(param.name)) {
        name = param.name;
      } else if (isReadableName(param.originalName)) {
        name = param.originalName;
      } else {
        // XXX: not sure if this is the correct logic, but it feel OK
        name = 'options';
      }

      let properties = [];
      if (param.type && param.type.declaration) {
        properties = map(param.type.declaration.children, _parameter);
      } else if (param.type && param.type.type === 'reference') {
        const dataForProperties = dataByKey[param.type.name] || {};
        properties = map(dataForProperties.children, _parameter);
      }

      return extend(_parameter(param), {
        name,
        isOptions: name === 'options',
        optional: !!param.defaultValue,
        properties
      });
    });
  }

  function _isReflectedProperty(data) {
    return (
      data.kindString === 'Property' &&
      data.type &&
      data.type.type === 'reflection'
    );
  }

  function _parameter(parameter) {
    return {
      name: parameter.name,
      type: _type(parameter),
      description:
        parameter.comment &&
        (parameter.comment.text || parameter.comment.shortText)
    };
  }

  function _objectProperties(rawData) {
    return [].concat(
      map(rawData.indexSignature, function(signature) {
        const parameterString = _indexParameterString(signature);
        return extend(_parameter(signature), {name: parameterString});
      }),
      map(rawData.children, _parameter)
    );
  }

  function _indexParameterString(signature) {
    const parameterNamesAndTypes = map(signature.parameters, function(
      parameter
    ) {
      return parameter.name + ':' + _typeName(parameter.type);
    });
    return _parameterString(parameterNamesAndTypes, '[', ']');
  }

  function _parameterString(names, leftDelim, rightDelim) {
    leftDelim = leftDelim || '(';
    rightDelim = rightDelim || ')';
    return leftDelim + names.join(', ') + rightDelim;
  }

  // Render the type of a data object. It's pretty confusing, to say the least
  function _type(data, skipSignature) {
    const type = data.type;

    if (data.kindString === 'Method') {
      return _type(data.signatures[0]);
    }

    if (data.kindString === 'Call signature' && !skipSignature) {
      const args = '(' + map(data.parameters, _type).join(', ') + ')';
      return args + ' => ' + _type(data, true);
    }

    const isReflected =
      data.kindString === 'Type alias' || type.type === 'reflection';
    if (isReflected && type.declaration) {
      const declaration = type.declaration;
      if (declaration.signatures) {
        return _type(declaration.signatures[0]);
      }

      if (declaration.indexSignature) {
        const signature = declaration.indexSignature[0];
        return _indexParameterString(signature) + ':' + _type(signature);
      }
    }

    let typeName = _typeName(type);
    if (!typeName) {
      console.error(
        'unknown type name for',
        data.name,
        'using the type name `any`'
      );
      // console.trace();
      typeName = 'any';
    }

    if (type.typeArguments) {
      return (
        typeName +
        _parameterString(map(type.typeArguments, _typeName), '<', '>')
      );
    }
    return typeName;
  }

  // This is just literally the name of the type, nothing fancy, except for references
  function _typeName(type) {
    if (type.type === 'instrinct') {
      if (type.isArray) {
        return '[' + type.name + ']';
      }
      return type.name;
    } else if (type.type === 'union') {
      const typeNames = [];
      for (let i = 0; i < type.types.length; i++) {
        // Try to get the type name for this type.
        const typeName = _typeName(type.types[i]);
        // Propogate undefined type names by returning early. Otherwise just add the
        // type name to our array.
        if (typeof typeName === 'undefined') {
          return;
        } else {
          typeNames.push(typeName);
        }
      }
      // Join all of the types together.
      return typeNames.join(' | ');
    } else if (type.type === 'reference') {
      // check to see if the reference type is a simple type alias
      const referencedData = dataByKey[type.name];
      if (referencedData && referencedData.kindString === 'Type alias') {
        // Is it an "objecty" type? We can't display it in one line if so
        if (
          !referencedData.type.declaration ||
          !referencedData.type.declaration.children
        ) {
          return _type(referencedData);
        }
      }
      return _link(_typeId(type), type.name);
    } else if (type.type === 'stringLiteral') {
      return '"' + type.value + '"';
    }
  }

  function _typeId(type) {
    return type.fullName || type.name;
  }

  function isReadableName(name) {
    return name.substring(0, 2) !== '__';
  }

  return function transformer(tree) {
    visit(tree, 'text', visitor);

    function visitor(node) {
      const matches = node.value.match(RegExp(pattern, 'g'));
      if (matches) {
        node.type = 'html';
        node.value = matches
          .map(match => {
            const result = match.match(pattern)[1];
            const rawData = dataByKey[result];
            const args = templateArgs(rawData);
            const html = template(args);
            return html;
          })
          .join('\n');
      }
    }
  };
}

handlebars.registerHelper('markdown', function(text) {
  if (text) {
    // replace {@link Foo} with <a href="#Foo">Foo</a>
    text = text.replace(/\{@link (\w*)\}/g, function(m, part) {
      return _link(part);
    });
  }

  return converter.makeHtml(text);
});

// All h3s for now, will revisit
handlebars.registerHelper('hTag', function() {
  // return this.nested ? 'h3' : 'h2';
  return 'h3';
});
