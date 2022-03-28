import "libs/polyfills";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "styled-components";
import defaultTheme from "themes/default";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Fade,
} from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import Current from "components/Current";
import PreviousList from "components/PreviousList";
import Actions from "components/Actions";
import { getMondayDate, getNextMonday, getSignedDayDiff } from "util/date";
import "./popup.css";

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// to change
// const firstMonday = getMondayDate(new Date("2/1/2021"));

const Popup = () => {
  const [firstMonday, setFirstMonday] = useState("fetching");
  const thisMonday = getMondayDate(new Date());

  const [page, setPage] = useState("current");
  const [isRefresh, setIsRefresh] = useState(false);
  const [currentMonday, setCurrentMonday] = useState(thisMonday);
  const currentMonInitRef = useRef(false);

  // initialize firstMonday value
  useEffect(async () => {
    const storage = await browser.storage.sync.get({
      firstMonday: null,
    });
    if (storage.firstMonday) {
      setFirstMonday(new Date(storage.firstMonday));
    } else {
      setFirstMonday(null);
    }
  }, []);

  // initialize currentMonday value
  useEffect(async () => {
    const storage = await browser.storage.sync.get({
      currentMonday: thisMonday.toJSON(),
    });
    const storedDate = new Date(storage.currentMonday);
    // if stored currentMonday is lagging, update to thisMonday
    if (getNextMonday(storedDate).toJSON() === thisMonday.toJSON()) {
      setCurrentMonday(thisMonday);
    } else {
      setCurrentMonday(storedDate);
    }
    currentMonInitRef.current = true;
  }, []);

  // update browser storage value of currentMonday on change
  useEffect(() => {
    if (currentMonInitRef.current) {
      browser.storage.sync.set({
        currentMonday: currentMonday.toJSON(),
      });
    }
  }, [currentMonday]);

  const handleReset = () => {
    browser.storage.sync.clear();
    window.close();
  };

  const renderPage = () => {};

  const [selectedDate, setSelectedDate] = useState(null);
  if (firstMonday === "fetching" || firstMonday === null) {
    // setTimeout(() => {}, 1000);
    return (
      <div
        style={{
          boxSizing: "border-box",
          width: 500,
          height: 600,
          padding: 20,
          paddingBottom: 100,
          background: "#fafafa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade>
          <div>
            <h3>Hey Buddy!</h3>
            <p>Pick a starting date to set up your first week.</p>
            <div>
              {firstMonday === null && (
                <DatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  placeholderText="Choose a date"
                  className="form-control"
                  filterDate={(date) => {
                    const day = date.getDay();
                    return day !== 0 && day !== 6;
                  }}
                />
              )}
            </div>
            <Button
              style={{ marginTop: 16 }}
              disabled={getSignedDayDiff(currentMonday, selectedDate) < 0}
              onClick={() => {
                // if selected date in future
                if (getSignedDayDiff(currentMonday, selectedDate) < 0) {
                  return;
                }
                browser.storage.sync.set({
                  firstMonday: getMondayDate(selectedDate).toJSON(),
                });
                setFirstMonday(getMondayDate(selectedDate));
              }}
            >
              Confirm
            </Button>
          </div>
        </Fade>
      </div>
    );
  }

  const renderFooter = () => (
    <div
      className="text-center highlight-text"
      style={{
        color: "#CCC",
        fontSize: 12,
        fontWeight: 700,
        marginTop: 40,
        marginBottom: 40,
        cursor: "pointer",
        transition: "0.3s",
      }}
      onClick={() => setIsModalOpen(true)}
    >
      Reset all settings
    </div>
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Nav
        pills
        fill
        justified
        style={{
          padding: "8px",
          background: "white",
          position: "fixed",
          width: "100%",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            active={page === "current"}
            onClick={() => setPage("current")}
          >
            Current
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            active={page === "previous"}
            onClick={() => setPage("previous")}
          >
            Previous
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            active={page === "actions"}
            onClick={() => setPage("actions")}
          >
            Action Items
          </NavLink>
        </NavItem>
      </Nav>
      <div style={{ height: 60 }} />
      <div style={{ height: 540, overflow: "scroll" }}>
        <Fade in={page === "current"}>
          {page === "current" && (
            <>
              <Current
                currentMonday={currentMonday}
                setCurrentMonday={setCurrentMonday}
                refreshActions={() => {}}
              />
              {renderFooter()}
            </>
          )}
        </Fade>
        <Fade in={page === "previous"}>
          {page === "previous" && (
            <>
              <PreviousList
                currentMonday={currentMonday}
                // to change
                firstMonday={firstMonday}
                refreshActions={setIsRefresh}
              />
              {renderFooter()}
            </>
          )}
        </Fade>

        <Fade in={page === "actions"}>
          {page === "actions" && (
            <>
              <Actions
                currentMonday={currentMonday}
                // to change
                firstMonday={firstMonday}
                isRefresh={isRefresh}
                setIsRefresh={setIsRefresh}
              />
              {renderFooter()}
            </>
          )}
        </Fade>
      </div>
      <Modal open={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader>Are you sure you want to reset all settings?</ModalHeader>
        <ModalBody>
          You will lose all your notes that have been saved on the extension.
        </ModalBody>
        <ModalFooter>
          <Button theme="danger" onClick={handleReset}>
            Reset
          </Button>
          <Button outline onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        transition={Flip}
      />
    </ThemeProvider>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
document.body.style.margin = 0;
document.body.style.background = "#fafafa";

ReactDOM.render(<Popup />, root);
