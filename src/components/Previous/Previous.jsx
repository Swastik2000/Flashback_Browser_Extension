import React, { useContext } from "react";
import { toast } from "react-toastify";

import List from "components/List";
import { ListProvider, ListContext } from "context/List";
import { getMondayDate } from "util/date";
import { Button } from "shards-react";
import { Copy as CopyIcon } from "react-feather";
import getCopyText from "util/getCopyText";

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

const Previous = ({ date, refreshActions }) => {
  const key = getMondayDate(date);

  return (
    <ListProvider storageKey={key}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px 0 5px",
        }}
      >
        <Copy />
      </div>
      <div className="mb-4">
        <List refreshActions={refreshActions} />
      </div>
    </ListProvider>
  );
};

export default Previous;
