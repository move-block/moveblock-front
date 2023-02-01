export interface ModuleMutationBody {
  payload?: object;
  pubkey?: string;
}

const mutateModule = async (
  { payload, pubkey }: ModuleMutationBody,
  moduleName: string,
  account: string
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: payload, public_key: pubkey }),
  };

  const response = await fetch(
    `/api/modules?name=${moduleName}&account=${account}`,
    requestOptions
  );

  return response;
};

export default mutateModule;

