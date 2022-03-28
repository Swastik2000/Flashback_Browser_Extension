import React, { useState, useContext } from "react";
import { withTheme } from "styled-components";
import {
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "shards-react";
import { MoreVertical, Trash } from "react-feather";
import { toast } from "react-toastify";

import ListContainer from "components/ListContainer";
import { ListProvider, ListContext } from "context/List";
import { ActionsProvider, ActionsContext } from "context/Actions";
import {
  SET_GREEN_ITEMS,
  SET_YELLOW_ITEMS,
  SET_RED_ITEMS,
  MOVE_ITEM,
  RESOLVE_ITEM,
} from "context/List";
import getUID from "util/getUID";

const Actions = ({ currentMonday, firstMonday, isRefresh, setIsRefresh }) => {
  return (
    <ListProvider storageKey={currentMonday}>
      <ActionsProvider
        storageKey="actions"
        currentMonday={currentMonday}
        firstMonday={firstMonday}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
      >
        <ActionsElt />
      </ActionsProvider>
    </ListProvider>
  );
};

const ActionsElt = () => {
  const [current, dispatchCurrent] = useContext(ListContext);
  const [actions, dispatchActions] = useContext(ActionsContext);
  const [tab, setTab] = useState("Y");

  return (
    <ListContainer header="Resolve these Issues/Tasks">
      <NavBar tab={tab} setTab={setTab} />
      {actions.yellowItems && actions.redItems ? (
        <Issues
          tab={tab}
          items={tab === "Y" ? actions.yellowItems : actions.redItems}
          CurrentContext={[current, dispatchCurrent]}
          ActionsContext={[actions, dispatchActions]}
        />
      ) : (
        <p align="center">Loading...</p>
      )}
    </ListContainer>
  );
};

const Issues = withTheme(({ items, theme, CurrentContext, ActionsContext }) => {
  const [current, dispatchCurrent] = CurrentContext;
  const [actions, dispatchActions] = ActionsContext;
  const [hoverIdx, setHoverIdx] = useState(null);
  const [dropdownIdx, setDropdownIdx] = useState(null);

  const getCurrentList = (id) => {
    if (id === "G") {
      return current.greenItems;
    }
    if (id === "Y") {
      return current.yellowItems;
    } else {
      return current.redItems;
    }
  };

  const setCurrentList = (id, items) => {
    if (id === "G") {
      dispatchCurrent({ type: SET_GREEN_ITEMS, payload: items });
    } else if (id === "Y") {
      dispatchCurrent({ type: SET_YELLOW_ITEMS, payload: items });
    } else {
      dispatchCurrent({ type: SET_RED_ITEMS, payload: items });
    }
  };

  const addItem = (type, item) => {
    setCurrentList(type, [item, ...getCurrentList(type)]);
  };

  const handleMove = (type, item) => {
    let toastMessage = "Moved to current week's Red 🔴";
    if (type === "G") toastMessage = "Moved to current week's Green 🟢";
    else if (type === "Y") toastMessage = "Moved to current week's Yellow 🟡";
    dispatchActions({ type: MOVE_ITEM, payload: item });
    addItem(type, { id: getUID(), body: item.body });
    toast.dark(toastMessage, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };

  const handleDelete = (item) => {
    dispatchActions({ type: RESOLVE_ITEM, payload: item });
  };

  return (
    <>
      {items.length === 0 ? (
        <h6 className="text-center" style={{ color: "#CCC" }}>
          You're all caught up!
        </h6>
      ) : (
        items.map((item, idx) => (
          <div
            style={{
              padding: 8 * 2,
              margin: "0 0 8px 0",
              boxShadow:
                dropdownIdx === idx || hoverIdx === idx
                  ? "0px 0px 10px rgba(0, 0, 0, 0.1)"
                  : "0px 0px 2px rgba(0, 0, 0, 0.2)",
              transition: "box-shadow 0.3s ease-in-out",
              position: "relative",
              background: "white",
              whiteSpace: "pre-wrap",
            }}
            onMouseEnter={() => dropdownIdx === null && setHoverIdx(idx)}
            onMouseLeave={() => dropdownIdx === null && setHoverIdx(null)}
          >
            {item.body}
            {hoverIdx === idx && (
              <div style={{ position: "absolute", top: 13, right: 8 }}>
                <Dropdown
                  open={dropdownIdx === idx}
                  toggle={() =>
                    setDropdownIdx(dropdownIdx === idx ? null : idx)
                  }
                  className="d-table"
                >
                  <DropdownToggle
                    outline
                    pill
                    theme="light"
                    style={{
                      padding: 4,
                      border: 0,
                    }}
                  >
                    <MoreVertical size={20} />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={() => handleMove("G", item)}>
                      Move to Current{" "}
                      <span style={{ color: theme.palette.green }}>Green</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleMove("Y", item)}>
                      Move to Current{" "}
                      <span style={{ color: theme.palette.yellow }}>
                        Yellow
                      </span>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleMove("R", item)}>
                      Move to Current{" "}
                      <span style={{ color: theme.palette.red }}>Red</span>
                    </DropdownItem>
                    <DropdownItem
                      style={{
                        color: theme.palette.red,
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                      onClick={() => handleDelete(item)}
                    >
                      <Trash size={14} style={{ marginRight: 4 }} /> Resolve
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
});

const NavBar = withTheme(({ tab, setTab, theme }) => (
  <Nav tabs fill style={{ marginBottom: 16 }}>
    <NavItem>
      <NavLink
        style={{ cursor: "pointer", fontSize: 14, color: theme.palette.yellow }}
        active={tab === "Y"}
        onClick={() => setTab("Y")}
      >
        Yellow
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        style={{ cursor: "pointer", fontSize: 14, color: theme.palette.red }}
        active={tab === "R"}
        onClick={() => setTab("R")}
      >
        Red
      </NavLink>
    </NavItem>
  </Nav>
));

export default Actions;
