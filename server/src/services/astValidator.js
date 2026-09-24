import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = _traverse.default || _traverse;

/**
 * Subsystem A: AST Invariant & Constraint Validator
 * Parses JavaScript code into Babel AST and enforces structural constraints.
 * Returns ASTValidationResult invariant contract.
 */
export function validateAST(code, constraints = {}) {
  const {
    forbiddenMethods = [],
    forbiddenNodeTypes = [],
    requiredNodeTypes = [],
    maxNestingDepth = 5,
    requireRecursion = false,
  } = constraints;

  const violations = [];
  const nodeTypeCounts = {};
  let maxDepthSeen = 0;
  let usesRecursion = false;

  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
      errorRecovery: true,
    });
  } catch (err) {
    return {
      passed: false,
      violations: [{
        rule: 'SyntaxError',
        line: err.loc?.line || 1,
        column: err.loc?.column || 0,
        message: `Failed to parse code AST: ${err.message}`,
      }],
      astSummary: {},
      maxDepthSeen: 0,
      usesRecursion: false,
    };
  }

  // Active Function Scope Stack for recursion tracking
  const currentFunctionNames = [];

  traverse(ast, {
    enter(path) {
      const type = path.node.type;
      nodeTypeCounts[type] = (nodeTypeCounts[type] || 0) + 1;

      // Track nesting depth
      const currentDepth = path.ancestors ? path.ancestors.length : 0;
      if (currentDepth > maxDepthSeen) {
        maxDepthSeen = currentDepth;
      }

      // Check forbidden node types
      if (forbiddenNodeTypes.includes(type)) {
        violations.push({
          rule: 'ForbiddenNodeType',
          nodeType: type,
          line: path.node.loc?.start?.line || 1,
          column: path.node.loc?.start?.column || 0,
          message: `Forbidden syntax node type detected: ${type}`,
        });
      }

      // Track function scope for recursion check
      if (path.isFunctionDeclaration() && path.node.id?.name) {
        currentFunctionNames.push(path.node.id.name);
      } else if ((path.isFunctionExpression() || path.isArrowFunctionExpression()) && path.parentPath?.isVariableDeclarator() && path.parentPath.node.id?.name) {
        currentFunctionNames.push(path.parentPath.node.id.name);
      }

      // Check method calls
      if (path.isCallExpression()) {
        const callee = path.node.callee;
        
        // MemberExpression method calls e.g. arr.sort()
        if (callee.type === 'MemberExpression' && callee.property?.name) {
          const methodName = callee.property.name;
          if (forbiddenMethods.includes(methodName) || forbiddenMethods.includes(`.${methodName}`)) {
            violations.push({
              rule: 'ForbiddenMethodCall',
              nodeType: 'CallExpression',
              line: callee.loc?.start?.line || 1,
              column: callee.loc?.start?.column || 0,
              message: `Call to forbidden method '.${methodName}()' detected.`,
            });
          }
        }

        // Direct identifier call e.g. fn() -> recursion check or forbidden global
        if (callee.type === 'Identifier') {
          const calledName = callee.name;
          if (forbiddenMethods.includes(calledName)) {
            violations.push({
              rule: 'ForbiddenMethodCall',
              nodeType: 'CallExpression',
              line: callee.loc?.start?.line || 1,
              column: callee.loc?.start?.column || 0,
              message: `Forbidden function call '${calledName}()' detected.`,
            });
          }

          if (currentFunctionNames.length > 0 && currentFunctionNames[currentFunctionNames.length - 1] === calledName) {
            usesRecursion = true;
          }
        }
      }
    },

    exit(path) {
      if (path.isFunctionDeclaration() && path.node.id?.name) {
        currentFunctionNames.pop();
      } else if ((path.isFunctionExpression() || path.isArrowFunctionExpression()) && path.parentPath?.isVariableDeclarator() && path.parentPath.node.id?.name) {
        currentFunctionNames.pop();
      }
    },
  });

  // Check required node types
  for (const reqType of requiredNodeTypes) {
    if (!nodeTypeCounts[reqType]) {
      violations.push({
        rule: 'MissingRequiredNodeType',
        nodeType: reqType,
        line: 1,
        column: 0,
        message: `Required syntax pattern missing: ${reqType}`,
      });
    }
  }

  // Check nesting depth
  if (maxNestingDepth && maxDepthSeen > maxNestingDepth) {
    violations.push({
      rule: 'NestingDepthExceeded',
      line: 1,
      column: 0,
      message: `Maximum nesting depth exceeded: ${maxDepthSeen} > ${maxNestingDepth}`,
    });
  }

  // Check required recursion
  if (requireRecursion && !usesRecursion) {
    violations.push({
      rule: 'MissingRecursion',
      line: 1,
      column: 0,
      message: 'Solution is required to use recursive function calls.',
    });
  }

  return {
    passed: violations.length === 0,
    violations,
    astSummary: nodeTypeCounts,
    maxDepthSeen,
    usesRecursion,
  };
}
