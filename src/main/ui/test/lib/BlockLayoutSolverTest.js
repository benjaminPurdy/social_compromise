jest.dontMock('../../javascript/lib/BlockLayoutSolver.js');

describe('BlockLayoutSolver', function() {

  it('should calculate a layout where all boxes are small', function() {
    var LayoutSolverFactory = require('../../javascript/lib/BlockLayoutSolver.js');
    expect(LayoutSolverFactory).toBeTruthy();

    var LayoutSolver = LayoutSolverFactory({
      targetColumnWidth: 100,
      minColumnCount: 1,
      maxColumnCount: 3,
      padding: 10,
      tileDimensionRatio: 0.666,
      bigTileWidthRatio: 2,
      bigTileHeightRatio: 2
    });

    var records = [
          {id: 'One'},
          {id: 'Two'},
          {id: 'Three'},
          {id: 'Four'},
          {id: 'Five'},
          {id: 'Six'},
          {id: 'Seven'}
    ],
      expectedResults = {
        One:{left:15,top:0,width:50,height:33.300000000000004},
        Two:{left:75,top:0,width:50,height:33.300000000000004},
        Three:{left:135,top:0,width:50,height:33.300000000000004},
        Four:{left:15,top:43.300000000000004,width:50,height:33.300000000000004},
        Five:{left:75,top:43.300000000000004,width:50,height:33.300000000000004},
        Six:{left:135,top:43.300000000000004,width:50,height:33.300000000000004},
        Seven:{left:15,top:86.60000000000001,width:50,height:33.300000000000004}
      };

    var styles = LayoutSolver(records, 200).tileStyles;

    Object.keys(expectedResults).forEach(function(key) {
       expect(styles[key]).toEqual(expectedResults[key]);
    });

  });

    it('should calculate a layout where one boxes is big', function() {
        var LayoutSolverFactory = require('../../javascript/lib/BlockLayoutSolver.js');
        expect(LayoutSolverFactory).toBeTruthy();

        var LayoutSolver = LayoutSolverFactory({
          targetColumnWidth: 100,
          minColumnCount: 1,
          maxColumnCount: 3,
          padding: 10,
          tileDimensionRatio: 0.666,
          bigTileWidthRatio: 2,
          bigTileHeightRatio: 2
        });

        var records = [
                {id: 'One', metadata: {is_big: true}},
                {id: 'Two'},
                {id: 'Three'},
                {id: 'Four'},
                {id: 'Five'},
                {id: 'Six'},
                {id: 'Seven'}
            ],
            expectedResults = {
              One:{left:15,top:0,width:110,height:76.60000000000001},
              Two:{left:135,top:0,width:50,height:33.300000000000004},
              Three:{left:135,top:43.300000000000004,width:50,height:33.300000000000004},
              Four:{left:135,top:86.60000000000001,width:50,height:33.300000000000004},
              Five:{left:135,top:129.9,width:50,height:33.300000000000004},
              Six:{left:15,top:173.20000000000002,width:50,height:33.300000000000004},
              Seven:{left:75,top:173.20000000000002,width:50,height:33.300000000000004}
            };

        var styles = LayoutSolver(records, 200).tileStyles;

        Object.keys(expectedResults).forEach(function(key) {
            expect(styles[key]).toEqual(expectedResults[key]);
        });

    });

});

