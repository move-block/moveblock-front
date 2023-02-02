
const executeStack = () => {

  const getBytecode = async (address : string, id : number) => {
    const response = await fetch(`/api/stacks/bytecode/${address}/${id}`);
    const data: string = await response.text();
    console.log(data);
    return data;
  }

  const execute = async (address : string, id : number) => {
    const response = await fetch(`/api/stacks/execution/${address}/${id}`);
    const data: string = await response.text();
    console.log(data);
    return data;
  }

  return {
    getBytecode,
    execute,
  }
};

export default executeStack;
