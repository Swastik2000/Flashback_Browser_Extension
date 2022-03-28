import React from "react";
import { Button } from "shards-react";
import { ChevronDown, ChevronUp } from "react-feather";

import { getddmm } from "util/date";

const ListHeader = ({
  header,
  mondayDate,
  isCollapsible,
  active,
  action,
  ...props
}) => {
  const Action = action ? action : null;
  return (
    <Button
      outline
      block
      theme="light"
      style={{
        fontSize: 16,
      }}
      className="d-flex flex-row justify-content-between align-items-center"
      {...props}
    >
      <h5 style={{ margin: 0 }}>{header}</h5>
      {action ? Action : null}
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: active ? "#333" : "#BBB",
          transition: "0.3s",
        }}
      >
        {`${getddmm(mondayDate)} - ${getddmm(mondayDate.addDays(4))}`}
        <ChevronUp
          style={{
            transform: active ? "rotateX(0deg)" : "rotateX(180deg)",
            transition: "0.3s",
            marginLeft: 5,
            marginRight: -10,
          }}
        />
      </div>
    </Button>
  );
};

export default ListHeader;
