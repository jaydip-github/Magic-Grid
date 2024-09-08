import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DEFAULT_GRID_CELL_MARGIN_PADDING } from "../constants";
import { ICellStyle, IGridState } from "../types";
import "../css/magicGrid.css";

function MagicGrid() {
  // Hooks
  const { state } = useLocation();
  const navigate = useNavigate();

  // States
  const [gridState, setGridState] = useState<IGridState>({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    ...state,
  });

  const [cellStyle, setCellStyle] = useState<ICellStyle>({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (!state.row || !state.column || !state.aspect_ratio) {
      navigate("/form");
    } else {
      window.onresize = () => {
        setGridState((prev) => ({
          ...prev,
          width: document.body.clientWidth,
          height: document.body.clientHeight,
        }));
      };
    }
    // Memory Clean up on component Unmount from dom
    return () => {
      window.onresize = null;
    };
  }, [state, navigate]);

  useEffect(() => {
    heightWidthCalculation();
  }, [gridState]);

  //* we implemented memoization technique by wrapping heavy calculation in useCallback hook
  const heightWidthCalculation = useCallback(() => {
    // calculation for width and height as per aspect ratio;
    // aspect_ratio=width/height;

    // width=aspect_ratio*height;
    // height=width/aspect_ratio;

    const aspectRatio = gridState.aspect_ratio;

    const height = gridState.height;
    const width = gridState.width;

    let tempWidth = aspectRatio * height;
    let tempHeight = width / aspectRatio;

    // we have to check if height or width is overflowing then we have to recalculate using aspect ratio formula again
    if (tempWidth > width) {
      tempWidth = tempHeight * aspectRatio;
    }
    if (tempHeight > height) {
      tempHeight = tempWidth / aspectRatio;
    }
    const cellHeight = tempHeight / gridState.row;
    const cellWidth = tempWidth / gridState.column;
    
    // Here we are subtract 10 px so we can show gap between shell also it help us to restrict the product of total cell width and total cell height within the aspect ration margin
    setCellStyle({ height: cellHeight - 10, width: cellWidth - 10 });
  }, [gridState]);

  //* we add memoization technique by wrapping rendering in useCallback hook
  const renderGrid = useCallback(() => {
    // Percentage Wise Padding Calculation
    const cellLeftRightPadding =
      (cellStyle.width / 100) * DEFAULT_GRID_CELL_MARGIN_PADDING;
    const cellTopBottomPadding =
      (cellStyle.height / 100) * DEFAULT_GRID_CELL_MARGIN_PADDING;
    return (
      <div
        className="grid_layout"
        style={{
          height: `${gridState.height}px`,
          width: `${gridState.width}px`,
        }}
      >
        {new Array(gridState.row).fill(0).map((_r, rowIndex) => {
          return (
            <div className="cell_row" key={`row_${rowIndex}`}>
              {new Array(gridState.column).fill(0).map((_c, colIndex) => {
                return (
                  <div
                    key={`cell_${colIndex + rowIndex}`}
                    className="grid_cell"
                    style={{
                      height: cellStyle.height,
                      width: cellStyle.width,
                      padding: `${cellTopBottomPadding}px ${cellLeftRightPadding}px`,
                    }}
                  >
                    <div className="child_cell" />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }, [gridState, cellStyle]);
  return <>{renderGrid()}</>;
}

export default MagicGrid;
