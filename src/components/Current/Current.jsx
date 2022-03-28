import React, { useState, useEffect, useContext } from "react";
import { Button } from "shards-react";
import { toast } from "react-toastify";

import List from "components/List";
import ListContainer from "components/ListContainer";
import { ListProvider, ListContext } from "context/List";
import { getMondayDate, getNextMonday, getDayDiff, getddmm } from "util/date";
import getCopyText from "util/getCopyText";
import { Copy as CopyIcon, Plus } from "react-feather";

const getCurrentMonday = () => {
  return getMondayDate(new Date()); // Monday of this week
};

const Save = ({ disabled, ...props }) => {
  return (
    <Button
      outline
      pill
      disabled={disabled}
      theme="primary"
      size="sm"
      {...props}
    >
      <Plus
        size={16}
        style={{ marginTop: -2, marginLeft: -5, marginRight: 2 }}
      />
      Start New Week
    </Button>
  );
};

const Copy = ({ disabled, ...props }) => {
  const [list, dispatch] = useContext(ListContext);
  const onClick = () => {
    const textField = document.createElement("textarea");
    textField.textContent = getCopyText(list);
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.dark("Copied to clipboard 📋", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <Button
      outline
      pill
      disabled={disabled}
      theme={disabled ? "danger" : "primary"}
      size="sm"
      onClick={onClick}
      {...props}
    >
      <CopyIcon size={12} /> Copy
    </Button>
  );
};

const Current = ({
  setMenu,
  currentMonday,
  setCurrentMonday,
  refreshActions,
}) => {
  const [key, setKey] = useState(currentMonday);

  useEffect(() => {
    setKey(currentMonday);
  }, [currentMonday]);

  const isSaveable = () => {
    return getDayDiff(getCurrentMonday(), getNextMonday(key)) <= 7;
  };

  const handleSave = () => {
    const nextMonday = getNextMonday(key);
    setKey(nextMonday);
    setCurrentMonday(nextMonday);
  };

  return (
    <ListProvider storageKey={key}>
      <ListContainer setMenu={setMenu} header="Conclusion of the week">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#333",
            }}
          >
            {`${getddmm(key)} - ${getddmm(key.addDays ? key.addDays(4) : key)}`}
          </div>
          <div>
            <Copy style={{ marginRight: 8 }} />
            <Save
              onClick={isSaveable() ? handleSave : () => {}}
              style={!isSaveable() ? { cursor: "not-allowed" } : null}
              disabled={!isSaveable()}
            />
          </div>
        </div>
        <List refreshActions={refreshActions} />
      </ListContainer>
    </ListProvider>
  );
};

export default Current;
