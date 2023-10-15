import { GetStoreApiState, makePlugin, Store } from "statebuilder";

export function withEntityPlugin() {
  return <TStore extends Store<any[]>>(store: TStore) => {
    type T = GetStoreApiState<TStore>;
    type TItem = T extends (infer U)[] ? U : never;
    return makePlugin(
      (storeApi) => {
        storeApi = storeApi as any as TStore;
        return {
          entity: {
            push(item: TItem) {
              return storeApi.set(storeApi.get.length, item);
            },
            updateBy(
              matcherFn: (data: TItem) => boolean,
              updaterFn: (oldValue: TItem) => TItem,
            ) {
              return storeApi.set((items) => {
                return items.map((item) => {
                  if (matcherFn(item)) {
                    return updaterFn(item);
                  }
                  return item as TItem;
                }) as T;
              });
            },
            removeBy(matcherFn: (data: TItem) => boolean) {
              return storeApi.set(
                (items) => items.filter((item) => !matcherFn(item)) as T,
              );
            },
          },
        };
      },
      { name: "storeName" },
    );
  };
}
