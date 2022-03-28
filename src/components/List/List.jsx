import React, { useState, useContext, useRef, useEffect } from "react";
import { withTheme } from "styled-components";
import { FormTextarea, Button } from "shards-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Edit2, Inbox, Minus, Plus } from "react-feather";

import Box from "components/Box";
import {
  ListContext,
  SET_GREEN_ITEMS,
  SET_YELLOW_ITEMS,
  SET_RED_ITEMS,
} from "context/List";
import getUID from "../../util/getUID";

const getItemStyle = (isDragging, draggableStyle, isHovered) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: "0 0 8px 0",
  boxShadow:
    isDragging || isHovered
      ? "0px 0px 10px rgba(0, 0, 0, 0.1)"
      : "0px 0px 2px rgba(0, 0, 0, 0.2)",
  transition: "box-shadow 0.3s ease-in-out",
  position: "relative",
  //   height: 40,

  // change background colour if dragging
  background: "white",
  whiteSpace: "pre-wrap",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "transparent",
  //   display: "flex",
  //   flexDirection: "column",
  //   height: items * 40 || 40,
  //   paddingBottom: isDraggingOver ? 40 : 0,
  //   marginBottom: 40,
  //   transition: "all 0.3s",
  padding: 8,
  //   width: 250,
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list).slice();
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const List = ({ theme, refreshActions }) => {
  const [list, dispatch] = useContext(ListContext);
  const [hoveredList, setHoveredList] = useState(null);

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    return [sourceClone, destClone];
  };

  const getList = (id) => {
    if (id === "G") {
      return list.greenItems;
    }
    if (id === "Y") {
      return list.yellowItems;
    } else {
      return list.redItems;
    }
  };

  const setList = (id, items) => {
    if (id === "G") {
      dispatch({ type: SET_GREEN_ITEMS, payload: items });
    } else if (id === "Y") {
      dispatch({ type: SET_YELLOW_ITEMS, payload: items });
    } else {
      dispatch({ type: SET_RED_ITEMS, payload: items });
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const reorderedItems = reorder(
        getList(source.droppableId),
        result.source.index,
        result.destination.index
      );
      setList(source.droppableId, reorderedItems);
    } else {
      const moveResult = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setList(source.droppableId, moveResult[0]);
      setList(destination.droppableId, moveResult[1]);
    }
  };

  const addItem = (type) => {
    setList(type, [
      {
        id: getUID(),
        body: "",
      },
      ...getList(type),
    ]);

    refreshActions(true);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          onMouseLeave={() => setHoveredList(null)}
          onMouseEnter={() => setHoveredList("G")}
        >
          <Title
            color={theme.palette.green}
            addItem={() => addItem("G")}
            showAddButton={hoveredList === "G"}
          >
            Green
          </Title>
          {list.greenItems ? (
            <DroppableList
              id="G"
              items={list.greenItems}
              setItems={(items) => setList("G", items)}
              refreshActions={refreshActions}
            />
          ) : (
            <p align="center">Loading...</p>
          )}
        </div>

        <div
          onMouseLeave={() => setHoveredList(null)}
          onMouseEnter={() => setHoveredList("Y")}
        >
          <Title
            color={theme.palette.yellow}
            addItem={() => addItem("Y")}
            showAddButton={hoveredList === "Y"}
          >
            Yellow
          </Title>
          {list.greenItems ? (
            <DroppableList
              id="Y"
              items={list.yellowItems}
              setItems={(items) => setList("Y", items)}
              refreshActions={refreshActions}
            />
          ) : (
            <p align="center">Loading...</p>
          )}
        </div>

        <div
          onMouseLeave={() => setHoveredList(null)}
          onMouseEnter={() => setHoveredList("R")}
        >
          <Title
            color={theme.palette.red}
            addItem={() => addItem("R")}
            showAddButton={hoveredList === "R"}
          >
            Red
          </Title>
          {list.greenItems ? (
            <DroppableList
              id="R"
              items={list.redItems}
              setItems={(items) => setList("R", items)}
              refreshActions={refreshActions}
            />
          ) : (
            <p align="center">Loading...</p>
          )}
        </div>
      </DragDropContext>
    </Box>
  );
};

const Title = ({ color, addItem, children, showAddButton }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        <h5 style={{ color, margin: 0 }}>{children}</h5>
        {showAddButton && (
          <Button
            onClick={addItem}
            outline
            pill
            style={{
              padding: 0,
            }}
          >
            <Plus size={18} />
          </Button>
        )}
      </div>
      <div>
        <div
          style={{
            height: 1,
            width: "100%",
            background: "#CCC",
            marginBottom: 8,
          }}
        />
      </div>
    </>
  );
};

const DroppableList = ({ id, items, setItems, refreshActions }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const autoGrow = (element) => {
    element.style.height = "54px";
    element.style.height = element.scrollHeight + "px";
  };

  const handleInputChange = ({ target }) => {
    setEditValue(target.value.trim());
    autoGrow(target);
  };

  const onKeyPress = (event) => {
    if (event.key.toLowerCase() === "enter" && !event.shiftKey) {
      editItem();
    }
  };

  const editItem = () => {
    const result = Array.from(items);
    if (editValue === "" && result[editIndex].body === "") return deleteItem();
    if (editValue) result[editIndex].body = editValue;
    setItems(result);
    setEditValue("");
    setEditIndex(null);

    refreshActions(true);
  };

  const deleteItem = () => {
    const index = editIndex;
    const result = Array.from(items);
    result.splice(index, 1);

    setEditValue("");
    setEditIndex(null);
    setTimeout(() => {
      setItems(result);
    }, 50);

    refreshActions(true);
  };

  useEffect(() => {
    if (items.length > 0 && items[0].body === "") {
      setEditIndex(0);
    }
  }, [items]);

  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {items.length === 0 && !snapshot.isDraggingOver ? (
            <h6 className="text-center" style={{ color: "#CCC" }}>
              Nothing to show
            </h6>
          ) : (
            items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={
                      editIndex === index
                        ? {
                            ...provided.draggableProps.style,
                            position: "relative",
                          }
                        : getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            hoverIndex === index
                          )
                    }
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => {
                      setEditIndex(index);
                      setEditValue(item.body);
                    }}
                  >
                    {editIndex === index ? (
                      <>
                        <FormTextarea
                          innerRef={(input) => {
                            input && input.focus();
                          }}
                          value={editValue}
                          style={{
                            padding: 16,
                            margin: "0 0 7px 0",
                            height: 54,
                            resize: "none",
                            overflow: "hidden",
                          }}
                          onFocus={(el) => autoGrow(el.srcElement)}
                          onBlur={editItem}
                          onChange={handleInputChange}
                          onKeyPress={onKeyPress}
                        />
                        <Button
                          onClick={deleteItem}
                          pill
                          theme="danger"
                          style={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            padding: 0,
                          }}
                        >
                          <Minus size={18} />
                        </Button>
                      </>
                    ) : (
                      <div>{item.body}</div>
                    )}

                    {hoverIndex === index && editIndex !== index && (
                      <Button
                        onClick={() => {
                          setEditIndex(index);
                          setEditValue(item.body);
                        }}
                        pill
                        theme="light"
                        style={{
                          position: "absolute",
                          top: 15,
                          right: 15,
                          padding: 4,
                        }}
                      >
                        <Edit2 size={16} />
                      </Button>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default withTheme(List);
