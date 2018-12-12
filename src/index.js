'use strict';

/**
 * @param {Array} submask
 * @param {Object} [params]
 * @param {Function} [params.preproc]
 * @param {Boolean} [params.full]
 */
function createMask(submasks, params) {
  params = params instanceof Object ? params : {};

  var preproc = params.preproc;
  var full = params.full;

  if (!(submasks instanceof Array)) {
    throw new Error('First params createMask is not Array');
  }

  if (preproc && !(preproc instanceof Function)) {
    throw new Error('Second params createMask is not Function');
  }

  /**
   * @param {Stromg} value
   * @param {Number} cursor
   */
  function Mask(value, cursor) {
    var valuePreproc = preproc && preproc(value, cursor);
    var valueCurrent = valuePreproc
      ? (valuePreproc.value !== undefined ? valuePreproc.value : value)
      : value;
    var valueResult = '';
    var valueResultReplace = '';
    var applied = false;
    var cursorResult = valuePreproc
      ? (valuePreproc.cursor || cursor || value.length)
      : (cursor || value.length);

    for (var submasksIndex = 0; submasksIndex < submasks.length; submasksIndex++) {
      var submaskResult = procSubmask({
        submask: submasks[submasksIndex],
        valueCurrent: valueCurrent,
        valueResult: valueResult,
        valueResultReplace: valueResultReplace,
        cursor: cursor === undefined ? cursorResult : cursor,
        cursorResult: cursorResult,
      });

      valueCurrent = submaskResult.valueCurrent;
      valueResult = submaskResult.valueResult;
      cursorResult = submaskResult.cursorResult;
      valueResultReplace = submaskResult.valueResultReplace;

      if (valueResult) {
        break;
      }
    }

    if (valueResult && valueResult !== value) {
      applied = true;
    } else if (!valueResult && valuePreproc) {
      valueResult = valuePreproc.value || value;
      cursorResult = valuePreproc.cursor || cursor;
    } else {
      valueResult = value;
      cursorResult = cursor;
    }

    return full === true
      ? {
        value: value,
        cursor: cursor,
        valuePreproc: valuePreproc,
        valueResult: valueResult,
        valueResultReplace: valueResultReplace,
        cursorResult: cursorResult,
        applied: applied
      }
      : {
        value: valueResult,
        cursor: cursorResult,
        applied: applied
      };
  }

  return Mask;
};

/**
 * @param {Object} params
 * @param {Object[]} params.submask
 * @param {String} params.valueCurrent
 * @param {String} params.valueResult
 * @param {Number} params.cursor
 * @param {Number} params.cursorResult
 */
function procSubmask(params) {
  var submask = params.submask;
  var valueCurrent = params.valueCurrent;
  var valueResult = params.valueResult;
  var valueResultReplace = params.valueResult;
  var cursor = params.cursor;
  var cursorResult = params.cursorResult;
  var setupCursor = false;

  for (var index = 0; index < submask.length; index++) {
    var submaskElement = submask[index];
    var matchResult = valueCurrent.match(submaskElement.match);

    if (matchResult && submaskElement.replace) {
      var valueReplace = matchResult[0].replace(
        submaskElement.match,
        submaskElement.replace
      );
      var smElCursor = submaskElement.cursor;

      valueResult = valueResult + valueReplace;
      valueResultReplace = valueResultReplace + valueReplace;
      valueCurrent = valueCurrent.replace(submaskElement.match, '');

      if (smElCursor && !setupCursor) {
        var isCursor = smElCursor.position
          && smElCursor.position[0] <= cursor
          && cursor <= smElCursor.position[1];
        var isFunction = smElCursor.value instanceof Function;

        if (isCursor || isFunction) {
          if (typeof smElCursor.value === 'number') {
            setupCursor = true;
            cursorResult = smElCursor.value;
          } else if (isFunction) {
            var smElCursorValueResult = smElCursor.value(
              valueReplace,
              cursor,
              matchResult
            );

            if (typeof smElCursorValueResult === 'number') {
              setupCursor = true;
              cursorResult = smElCursorValueResult;
            }
          }
        }
      }
    } else if (submaskElement.space) {
      valueResult = valueResult + submaskElement.space;
    } else {
      break;
    }
  }

  return {
    valueCurrent: valueCurrent,
    valueResult: valueResult,
    cursorResult: cursorResult,
    valueResultReplace: valueResultReplace
  };
}

createMask.submasksArray = function (submasks) {
  return Object.keys(submasks).map(function (key) {
    return submasks[key];
  });
};