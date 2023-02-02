import { PlusCircleFilled } from '@ant-design/icons';
import { Input, Skeleton, Button } from 'antd';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Container from '~common/components/Container';
import HoverableItemContainer from '~common/components/HoverableItemContainer';
import useWallet from '~common/hooks/useWallet';
import useStack from '~stacks/hooks/useStack';
import FunctionModal from './FunctionModal';
import StackFunctionItem from './StackFunctionItem';

export type BlockFormType = {
  functionName: string;
  paramValues: string[];
  genericParamValues: string[];
};
export type FormType = {
  stackName: string;
  blocks: BlockFormType[];
};

const EMPTY_FORM: FormType = {
  stackName: '',
  blocks: [],
};

const StackEditor = ({ id }: { id?: number }) => {
  const [isEditing, setIsEditing] = useState(id ? false : true);
  const { account } = useWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: stack, isLoading } = useStack({
    id,
    address: account?.address,
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset: resetForm,
  } = useForm<FormType>({
    defaultValues: EMPTY_FORM,
  });

  const {
    fields: editingBlocks,
    append: appendBlock,
    remove: removeBlock,
    replace: replaceBlock,
  } = useFieldArray<FormType>({
    control,
    name: 'blocks',
  });

  const onClickSave = handleSubmit((data) => {
    console.log(data);
    setIsEditing(false);
  });

  useEffect(() => {
    if (stack) {
      setValue('stackName', stack.stackName);
      replaceBlock(
        stack.blocks.map(({ functionName, params, genericTypeParams }) => ({
          functionName,
          paramValues: params.map(({ value }) => value),
          genericParamValues: genericTypeParams.map(({ value }) => value),
        }))
      );
    } else {
      resetForm(EMPTY_FORM);
    }
  }, [replaceBlock, resetForm, setValue, stack]);

  return (
    <Container>
      <div className="flex justify-between items-end">
        {isEditing ? (
          <Controller
            name="stackName"
            control={control}
            render={({ field }) => (
              <Input
                className="w-96 h-[70px] text-h1 font-bold"
                placeholder="Stack Title"
                {...field}
              />
            )}
          />
        ) : (
          <Skeleton
            className="flex h-[70px] items-center"
            active
            title={{
              width: '20rem',
            }}
            paragraph={false}
            loading={isLoading}
          >
            <h1 className="mb-0">{stack?.stackName}</h1>
          </Skeleton>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button type="primary" danger className="border-none h-fit py-0">
                Delete
              </Button>
              <Button
                className="border-none h-fit py-0"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className="border-none h-fit py-0"
                onClick={onClickSave}
              >
                Save Stack
              </Button>
            </>
          ) : (
            <>
              {isLoading ? (
                <Skeleton.Button active />
              ) : (
                <Button
                  className="border-none h-fit py-0"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
              {isLoading ? (
                <Skeleton.Button active />
              ) : (
                <Button type="primary" className="border-none h-fit py-0">
                  Execute
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {editingBlocks.map(
          ({ functionName, paramValues, genericParamValues }, index) => (
            <StackFunctionItem
              key={`${id}-${index}`}
              isEditing={isEditing}
              control={control}
              functionIndex={index}
              onRemove={() => removeBlock(index)}
              functionName={functionName}
              paramValues={paramValues}
              genericParamValues={genericParamValues}
              getValues={() => getValues(`blocks.${index}`)}
            />
          )
        )}
      </div>
      {isEditing && (
        <button onClick={() => setIsModalOpen(true)}>
          <HoverableItemContainer
            className="flex flex-col gap-4 h-[198px]"
            _hover={
              <h2 className="text-inherit">
                Add a new
                <br />
                Block
              </h2>
            }
          >
            <PlusCircleFilled className="text-primary text-[60px]" />
          </HoverableItemContainer>
        </button>
      )}
      <FunctionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={({
          accountAddress,
          moduleName,
          functionName,
          paramLength,
          genericParamLength,
        }) => {
          const fullFunctionName = `${accountAddress}::${moduleName}::${functionName}`;
          appendBlock({
            functionName: fullFunctionName,
            paramValues: new Array(paramLength).fill(''),
            genericParamValues: new Array(genericParamLength).fill(''),
          });
        }}
      />
    </Container>
  );
};

export default StackEditor;
