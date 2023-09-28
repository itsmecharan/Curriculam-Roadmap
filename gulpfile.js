'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - lint - src/webparts/curriculamHome/components/CurriculamHome.tsx(undefined,undefined): error null: Parsing error: DeprecationError: 'originalKeywordKind' has been deprecated since v5.0.0 and can no longer be used. Use 'identifierToKeywordKind(identifier)' instead.`);
build.addSuppression(`Warning - lint - src\\webparts\\curriculamHome\\CurriculamHomeWebPart.ts(undefined,undefined): error null: Parsing error: DeprecationError: 'originalKeywordKind' has been deprecated since v5.0.0 and can no longer be used. Use 'identifierToKeywordKind(identifier)' instead.`);
build.addSuppression(`Warning - lint - src\\webparts\\curriculamHome\\components\\ICurriculamHomeProps.ts(undefined,undefined): error null: Parsing error: DeprecationError: 'originalKeywordKind' has been deprecated since v5.0.0 and can no longer be used. Use 'identifierToKeywordKind(identifier)' instead.`);

let getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  let result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));
