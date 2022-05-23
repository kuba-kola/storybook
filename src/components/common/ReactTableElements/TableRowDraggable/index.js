import React, {
  useState, useEffect, useCallback, useRef,
} from "react";
import { func, array } from "prop-types";
import { useTable } from "react-table";
import "react-table-6/react-table.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import dragIcon from "assets/images/drag.svg";

const DND_ITEM_TYPE = "row";

const TableRowDraggable = ({
  columns, data, loading, onRowDrop,
}) => {
  const [records, setRecords] = useState(data);

  useEffect(() => {
    setRecords(data);
  }, [data]);

  const getRowId = useCallback((row) => row.id, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    data,
    columns,
    getRowId,
  });

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      }),
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="ReactTable">
        <div className="rt-table" role="grid" {...getTableProps()}>
          <div className="rt-thead -header">
            {headerGroups.map((headerGroup) => (
              <div className="rt-tr" {...headerGroup.getHeaderGroupProps()} role="row">
                <div className="rt-th draggable">
                  <img src={dragIcon} alt="move" />
                </div>
                {headerGroup.headers.map((column) => (
                  <div
                    className="rt-th rt-resizable"
                    {...column.getHeaderProps([{
                      style: column.style,
                    }])}
                  >
                    {column.render("Header")}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="rt-tbody" {...getTableBodyProps()}>
            {rows.map(
              (row, index) => prepareRow(row) || (
              <RowDraggable
                index={index}
                row={row}
                moveRow={moveRow}
                dropRow={() => onRowDrop(records)}
                {...row.getRowProps()}
              />
              ),
            )}
          </div>
        </div>
        <div className={`-loading ${loading ? "-active" : ""}`}>
          <div className="-loading-inner">Loading...</div>
        </div>
      </div>
    </DndProvider>
  );
};

const RowDraggable = ({
  row, index, moveRow, dropRow,
}) => {
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop() {
      dropRow();
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    index,
    item: { type: DND_ITEM_TYPE, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <div className="rt-tr-group" ref={dropRef} style={{ opacity }}>
      <div className={`rt-tr ${index % 2 === 0 ? "-even" : "-odd"}`} role="row">
        <div className="rt-td draggable" row="gridcell" ref={dragRef}>
          <img src={dragIcon} alt="move" />
        </div>
        {row.cells.map((cell) => (
          <div
            className="rt-td"
            {...cell.getCellProps({
              style: cell.column.style,
            })}
          >
            {cell.render("Cell")}
          </div>
        ))}
      </div>
    </div>

  );
};

TableRowDraggable.propTypes = {
  onRowDrop: func.isRequired,
  columns: array.isRequired,
  data: array.isRequired,
};

export default TableRowDraggable;
