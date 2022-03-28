import React from "react";

const PageHeader = ({ header, action }) => {
  const Action = action ? action : null;

  return (
    <div className="d-flex flex-row justify-content-between align-items-center">
      <div style={{ fontSize: 20, marginBottom: 10 }}>{header}</div>
      {action ? Action : null}
    </div>
  );
};

export default PageHeader;
