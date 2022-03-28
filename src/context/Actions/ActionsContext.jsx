import React, { useReducer, useEffect, useRef } from "react";
import browser from "webextension-polyfill";

import { INIT, reducer } from "context/List";
import { getMondayDate, getDayDiff } from "util/date";

// global list object
const ActionsContext = React.createContext({});

const ActionsProvider = ({
  storageKey,
  currentMonday,
  firstMonday,
  isRefresh,
  setIsRefresh,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    yellowItems: [],
    redItems: [],
    moved: {},
    resolved: {},
  });
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

  const getPreviousKeys = () => {
    let daySpan = getDayDiff(currentMonday, firstMonday);
    let daysArr = [];
    let week = 1;

    while (daySpan > 0) {
      const daysToSubtract = week * 7;
      daysArr.push(daysToSubtract);

      week++;
      daySpan -= 7;
    }

    return daysArr.map((days) =>
      getMondayDate(
        new Date(new Date().setDate(currentMonday.getDate() - days))
      )
    );
  };

  const aggregatePreviousItems = (
    state,
    { yellowItems, redItems },
    actionsList
  ) => {
    let newActionsList = {};
    newActionsList.yellowItems = actionsList.yellowItems.concat(
      yellowItems.filter(
        (item) =>
          (!state.moved || !state.moved[item.id]) &&
          (!state.resolved || !state?.resolved[item.id])
      )
    );
    newActionsList.redItems = actionsList.redItems.concat(
      redItems.filter(
        (item) =>
          (!state.moved || !state.moved[item.id]) &&
          (!state.resolved || !state?.resolved[item.id])
      )
    );

    return newActionsList;
  };

  const initActions = async (state) => {
    const previousKeys = getPreviousKeys();

    let actionsList = { yellowItems: [], redItems: [] };

    let i = 0;
    while (i < previousKeys.length) {
      const key = previousKeys[i];
      const storage = await browser.storage.sync.get({ [key]: 0 });
      const list = storage[key];
      actionsList = aggregatePreviousItems(state, list, actionsList);

      i++;
    }
    dispatch({ type: INIT, payload: { ...state, ...actionsList } });
  };

  // initialize with yellow and red items from all previous lists
  useEffect(async () => {
    const storage = await browser.storage.sync.get({
      [storageKey]: state,
    });
    initActions(storage[storageKey]);
    initRef.current = true;
    setIsRefresh(false);
  }, [isRefresh, storageKey]);

  return (
    <ActionsContext.Provider value={[state, dispatch]}>
      {children}
    </ActionsContext.Provider>
  );
};

export { ActionsContext, ActionsProvider };
