import { localStorageKeys } from "common/config";
import { RowFlex } from "common/styles";
import { useEffect, useState } from "react";
import { Grid, List } from "./styles";

const LIST_VIEW_TYPES = {
  LIST: "LIST",
  CARD: "CARD",
};

const useListView = () => {
  const [view, setView] = useState(
    localStorage.getItem(localStorageKeys.listView) || LIST_VIEW_TYPES.LIST
  );

  useEffect(() => {
    if (view) {
      localStorage.setItem(localStorageKeys.listView, view);
    }
  }, [view]);

  const isList = view === LIST_VIEW_TYPES.LIST;
  const listViewComponent = (
    <RowFlex>
      <Grid
        isSelected={!isList}
        onClick={() => setView(LIST_VIEW_TYPES.CARD)}
      />
      <List isSelected={isList} onClick={() => setView(LIST_VIEW_TYPES.LIST)} />
    </RowFlex>
  );

  return { isList, listViewComponent };
};

export default useListView;
