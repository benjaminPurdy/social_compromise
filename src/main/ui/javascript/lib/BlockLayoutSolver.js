
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

function inBlock(heights, x, y, column) {
  return y === heights[column] &&
    Math.floor(x / 2) === column;
}

function inBigBlock(heights, x, y, column) {
  return (y === heights[column] || y === heights[column] + 1) &&
    Math.floor(x / 2) === column;
}

function nextSmallBlock(records, i) {
  for (; i < records.length; ++i) {
    if (!records[i].metadata.is_big) {
      return records[i];
    }
  }
  return null;
}

function insertBefore(records, elem, target) {
  var idx = records.indexOf(elem);
  idx !== -1 && records.splice(idx, 1);
  records.splice(records.indexOf(target), 0, elem);
}

function mapIndexes(main, newOrder) {
  var out = [], i;
  for (i=0;i<newOrder.length;i++) {
    out.push(main.indexOf(newOrder[i]));
  }
  return out;
}

module.exports = function(config) {

  function calculateLayoutWidth(width) {
    if (width <= 0) {return 0;}
    return width - (config.padding * 2);
  }

  function calculateColumnCountForWidth(width) {
    var layoutWidth = calculateLayoutWidth(width);

    return Math.min(
      Math.max(
        //TODO: ??? Adds padding for the targetColumnWidth because without it,
        // recounting the number of columns seems to
        // have slight negative padding when cutting it close even though targetColumnWidth
        // value passed in already accounts for this...
        Math.floor(layoutWidth / (config.targetColumnWidth + config.padding)),
        config.minColumnCount),
      config.maxColumnCount);
  }

  function createHeightsForWidth(width, shouldIncrement) {
    var columnCount, i, heights = [];
    columnCount = shouldIncrement ? (calculateColumnCountForWidth(width) + 1) : calculateColumnCountForWidth(width);

    for (i=0;i<columnCount;i++) {
      heights[i] = 0;
    }
    return heights;
  }

  function getColumn(height) {
    var i, count = height.length;

    for(i=1;i<count;i++) {
      if (height[i] < height[i-1]) {
        return i;
      }
    }
    return 0;
  }

  function getBigBlockStyle(heights, unitSize, sideMargins, isHalfColumnLayout) {
    var padding = config.padding, operatingHeights,
        column, styleToReturn;

    if (isHalfColumnLayout) {
      operatingHeights = heights.slice(0, heights.length - 1);
    } else {
      operatingHeights = heights.slice(0, heights.length);
    }
    column = getColumn(operatingHeights);


    styleToReturn =  {
      left: sideMargins + column * unitSize * 2 + (padding * column * 2) + padding,
      top: (operatingHeights[column] * (unitSize * config.tileDimensionRatio) + padding * operatingHeights[column]),
      width: (unitSize * config.bigTileWidthRatio) + (padding * (config.bigTileWidthRatio - 1)),
      height: ((unitSize * config.tileDimensionRatio) * config.bigTileHeightRatio) + (padding * (config.bigTileHeightRatio - 1))
    };

    heights[column] += 4;
    return styleToReturn;
  }

  function getSmallBlockPairStyles(height, column, smallBlocks, unitSize, sideMargins) {
    var i,
      count = smallBlocks.length,
      padding = config.padding,
      styles = [];

    for (i=0;i<count;i++) {

      styles.push({
        left : sideMargins + ((column * unitSize) * 2) + (i * unitSize) +
          (padding * column * 2 + i * padding) + padding,
        top : (height[column] * (unitSize * config.tileDimensionRatio)+ padding * height[column]),
        width : unitSize,
        height : unitSize * config.tileDimensionRatio
      });
    }

    height[column] += 1;
    return styles;
  }

  function getSideMargins(width, columnCount) {
    var padding = config.padding,
        numberOfBlocks = columnCount * 2,
        blockWidth = config.targetColumnWidth / 2,
        widthOfBlocksAndMargin = numberOfBlocks * (blockWidth + padding) + padding,
        sideMargin = (width - widthOfBlocksAndMargin)/2;

    if(sideMargin > padding) {
      return sideMargin;
    }
    return sideMargin;
  }

  function hasExtraHalfColumn(sideMargins, unitWidth) {
    return (sideMargins * 2) >= unitWidth + config.padding;
  }

  function addSideMarginToStyles(styles, sideMargins) {
    var prop;

    for (prop in styles) {
      if (styles.hasOwnProperty(prop)) {
        styles[prop].left += sideMargins;
      }
    }
  }

//TODO: Currently adding padding * 3 because there is a narrow case where a column still can't fit
  return function(blockDataFromUser, width, iterationOrder) {
      if(width <= (config.targetColumnWidth + (config.padding * 3))) {
          var styles = {},
              loopCeiling = iterationOrder ? iterationOrder.length : blockDataFromUser.length,
              unitWidth = width > 320 ? config.targetColumnWidth/2 : Math.max(width - (config.padding * 2), 320 - config.padding * 2),
              currentBlockData,
              heights = createHeightsForWidth(0, true),
              hasMargin = width > 320,
              margin = 0,
              i;

          for (i=0;i<loopCeiling;i++) {

              if (iterationOrder) {
                  currentBlockData = blockDataFromUser[iterationOrder[i]];
              } else {
                  currentBlockData = blockDataFromUser[i];
              }

              blockStyles = getSmallBlockPairStyles(heights, heights.length - 1, [currentBlockData], unitWidth, 0);
              styles[currentBlockData.id] = blockStyles[0];
          }

          if(hasMargin) {
              margin = (width - (unitWidth + config.padding * 2))/2;
              addSideMarginToStyles(styles, margin)
          }

          var maxHeight = Math.max.apply(null, heights);

          return {
              tileStyles: styles,
              containerHeight: maxHeight *  (unitWidth * config.tileDimensionRatio) + config.padding * maxHeight + config.padding,
              leftOfContainer: margin + config.padding,
              iterationOrder: iterationOrder,
              isSmallScreen: true
          }
      }

    var smallBlocks = [],
      styles = {},
      loopCeiling = iterationOrder ? iterationOrder.length : blockDataFromUser.length,
      unitWidth = config.targetColumnWidth / 2,
      columnCount = calculateColumnCountForWidth(width),
      sideMargins = getSideMargins(width, columnCount),
      hasExtraColumn = hasExtraHalfColumn(sideMargins, unitWidth),
      heights = createHeightsForWidth(width, hasExtraColumn),
      blockStyles,
      currentColumn,
      currentBlockData,
      i;

    for (i=0;i<loopCeiling;i++) {

      if (iterationOrder) {
        currentBlockData = blockDataFromUser[iterationOrder[i]];
      } else {
        currentBlockData = blockDataFromUser[i];
      }


      if (currentBlockData.metadata && currentBlockData.metadata.is_big) {
        blockStyles = getBigBlockStyle(heights, unitWidth, 0, hasExtraColumn);
        styles[currentBlockData.id] = blockStyles;
        continue;
      }

      // If that column is a halfsie, take it
      if (hasExtraColumn && heights[heights.length - 1] < heights[heights.length - 2]) {
        blockStyles = getSmallBlockPairStyles(heights, heights.length - 1, [currentBlockData], unitWidth, 0);
        styles[currentBlockData.id] = blockStyles[0];
        continue;
      }

      // Calculate the current column
      currentColumn = getColumn(heights);

      // Otherwise, do the layout pair
      smallBlocks.push(currentBlockData);
      if (smallBlocks.length === 2) {
        blockStyles = getSmallBlockPairStyles(heights, currentColumn, smallBlocks, unitWidth, 0);
        styles[smallBlocks[0].id] = blockStyles[0];
        styles[smallBlocks[1].id] = blockStyles[1];
        smallBlocks = [];
      }
    }

    // Cleanup and trailing small blocks
    if (smallBlocks.length) {

      if (heights[heights.length - 1] < heights[heights.length - 2]) {
        currentColumn = heights.length - 1;
      }

      blockStyles = getSmallBlockPairStyles(heights, currentColumn, smallBlocks, unitWidth, 0);
      for(i=0;i<smallBlocks.length;i++) {
        styles[smallBlocks[i].id] = blockStyles[i];
      }
    }

    if (hasExtraColumn && heights[heights.length - 1] === 0) {
      sideMargins = getSideMargins(width, columnCount);
    } else if (hasExtraColumn) {
      sideMargins = (sideMargins * 2 - (unitWidth + config.padding)) / 2;
    }

    addSideMarginToStyles(styles, sideMargins);

    var maxHeight = Math.max.apply(null, heights);

    return {
      tileStyles: styles,
      containerHeight: maxHeight *  (unitWidth * config.tileDimensionRatio) + config.padding * maxHeight + config.padding,
      leftOfContainer: sideMargins + config.padding,
      iterationOrder: iterationOrder,
      isSmallScreen: false,
      insert: function(blockData, x, y) {
        var heights = createHeightsForWidth(width, hasExtraColumn),
            records = blockDataFromUser.concat(),
            recordsInOrder,
            smallBlocks = [],
            i,
            position,
            currentRecord,
            isHalfColumn,
            column,
            nextSmall,
            n;

        if (iterationOrder) {
          recordsInOrder = [];

          for(i=0;i<records.length;i++) {
            recordsInOrder.push(records[iterationOrder[i]]);
          }

          records = recordsInOrder;
        }

        records.splice(records.indexOf(blockData), 1);

        for (i=0;i<records.length;i++) {
          currentRecord = records[i];
          column = getColumn(heights);
          isHalfColumn = hasExtraColumn && column === heights.length - 1;

          if (currentRecord.metadata.is_big) {

            if (inBigBlock(heights, x, y, column)) {
              nextSmall = nextSmallBlock(records, i);
              if (!nextSmall) {
                heights[column] += 2;
                continue;
              }
              records.splice(records.indexOf(nextSmall), 1);
              records.splice(i, 0, nextSmall);
              i--;
              continue;
            }

            heights[column] += 2;

          } else {
            smallBlocks.push(currentRecord);

            if (isHalfColumn || smallBlocks.length === 2) {

              if (inBlock(heights, x, y, column)) {
                position = blockData.metadata.is_big ? 0 : x % 2;
                insertBefore(records, blockData, smallBlocks[position]);
                return mapIndexes(blockDataFromUser, records);
              }

              heights[column] += 1;
              smallBlocks = [];
            }

          }

        }

        if (smallBlocks.length) {
          n = x % 2;
          if (inBlock(heights, x, y, column) && n === 0) {
            insertBefore(records, blockData, smallBlocks[n]);
            return mapIndexes(blockDataFromUser, records);
          }
        }

        records.push(blockData);

        return mapIndexes(blockDataFromUser, records);
      }

    }
  }
};