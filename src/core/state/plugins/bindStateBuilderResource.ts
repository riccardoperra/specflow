import {
  createResource,
  Resource as InternalResource,
  ResourceActions,
  ResourceFetcher,
  ResourceOptions,
  Setter,
} from "solid-js";
import { create, GenericStoreApi } from "statebuilder";

export type Resource<T> = GenericStoreApi<T, Setter<T>> &
  InternalResource<T> &
  ResourceActions<T>;

function makeResource<T>(
  resourceFetcher: ResourceFetcher<true, T, true>,
  options?: ResourceOptions<T, true>,
): Resource<T> {
  const [state, { mutate, refetch }] = createResource(
    resourceFetcher,
    options ?? {},
  );

  Reflect.set(state, "refetch", refetch);
  Reflect.set(state, "set", mutate);

  return state as unknown as Resource<T>;
}

// TODO: move to statebuilder
export const experimental__defineResource = create("resource", makeResource);
