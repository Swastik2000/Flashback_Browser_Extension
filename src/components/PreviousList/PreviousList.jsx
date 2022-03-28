import React, { useState, useEffect } from "react";
import { Button, Collapse } from "shards-react";
import browser from "webextension-polyfill";
import { Copy as CopyIcon } from "react-feather";
import { toast } from "react-toastify";

import Previous from "components/Previous";
import ListContainer from "components/ListContainer";
import ListHeader from "components/ListHeader";
import { getDayDiff, getMondayDate, getddmm } from "util/date";
import getCopyText from "util/getCopyText";

const PreviousList = ({
  setMenu,
  currentMonday,
  firstMonday,
  refreshActions,
}) => {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    setDates(getDates());
  }, []);

  const [activeInd, setActiveInd] = useState(null);

  const getDates = () => {
    let daySpan = getDayDiff(currentMonday, firstMonday);
    let daysArr = [];
    let week = 1;

    while (daySpan > 0) {
      const daysToSubtract = week * 7;
      daysArr.push(daysToSubtract);

      week++;
      daySpan -= 7;
    }

    return daysArr.map(
      (days) => new Date(new Date().setDate(currentMonday.getDate() - days))
    );
  };

  const renderList = () => {
    return dates.map((date, idx) => {
      return (
        <PreviousElt
          header={idx === 0 ? "Previous week" : `Week ${dates.length - idx}`}
          date={date}
          setMenu={setMenu}
          active={activeInd === idx}
          setActive={(active) => setActiveInd(active ? null : idx)}
          refreshActions={refreshActions}
        />
      );
    });
  };

  const Copy = ({ disabled, ...props }) => {
    const onClick = async () => {
      const textField = document.createElement("textarea");
      let textToCopy = "";
      for (let i = 0; i < dates.length; i++) {
        const key = getMondayDate(dates[i]);
        const storage = await browser.storage.sync.get({
          [key]: 0,
        });
        textToCopy += `**${getddmm(key)} - ${getddmm(
          key.addDays(4)
        )}**\n\n${getCopyText(storage[key])}\n\n\n\n`;
      }
      textField.textContent = textToCopy.trim();
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
      toast.dark("Copied all to clipboard 📋", {
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
        <CopyIcon size={12} /> Copy All
      </Button>
    );
  };

  return (
    <ListContainer setMenu={setMenu} header="Review past Issues/Tasks">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "-20px 0 10px",
        }}
      >
        <Copy />
      </div>
      {renderList()}
    </ListContainer>
  );
};

const PreviousElt = ({ header, date, active, setActive, refreshActions }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <ListHeader
        header={header}
        mondayDate={date}
        isCollapsible={true}
        active={active}
        onClick={(el) => {
          if (active) el.nativeEvent.srcElement.blur();
          setActive(active);
        }}
      />
      <Collapse open={active}>
        <Previous key={date} date={date} refreshActions={refreshActions} />
      </Collapse>
    </div>
  );
};

export default PreviousList;
