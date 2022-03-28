import React, { useReducer, useEffect, useRef } from "react";
import browser from "webextension-polyfill";

import getStubList from "./getStubList";
import { INIT } from "./actions";
import reducer from "./reducer";

// global list object
const ListContext = React.createContext({});

const ListProvider = ({ storageKey, children }) => {
  const [state, dispatch] = useReducer(reducer, {});
  const initRef = useRef(false);

  // sync with browser storage
  useEffect(() => {
    if (initRef.current) {
      browser.storage.sync.set({ [storageKey]: state });
    }
  }, [state]);

  // listen to storage change and update context
  useEffect(() => {
    browser.storage.onChanged.addListener((changes) => {
      if (changes[storageKey]) {
        dispatch({ type: INIT, payload: changes[storageKey].newValue });
      }
    });
  }, []);

  // initialize with stub list
  useEffect(async () => {
    const storage = await browser.storage.sync.get({
      [storageKey]: getStubList(),
    });
    dispatch({ type: INIT, payload: storage[storageKey] });
    initRef.current = true;
  }, [storageKey]);

  return (
    <ListContext.Provider value={[state, dispatch]}>
      {children}
    </ListContext.Provider>
  );
};

export { ListContext, ListProvider };
