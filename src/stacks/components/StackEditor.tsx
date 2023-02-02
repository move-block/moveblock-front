import { LeftOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Skeleton } from 'antd';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import PageContainer from '~common/components/PageContainer';
import HoverableItemContainer from '~common/components/HoverableItemContainer';
import useWallet from '~common/hooks/useWallet';
import Button from '../../common/components/Button';
import FunctionModal from './FunctionModal';
import StackFunctionItem from './StackFunctionItem';
import StackTitle from './StackTitle';
import { MoveStack } from 'src/MoveFunction';

export type BlockFormType = {
  functionName: string;
  paramValues: string[];
  genericParamValues: string[];
};
export type FormType = {
  stackName: string;
  blocks: BlockFormType[];
};

const getEmptyForm = (): FormType => ({
  stackName: 'New Stack',
  blocks: [],
});

const StackEditor = ({
  stack,
  isLoading = false,
  isNew = false,
  onSubmit,
  onDelete,
  onExecute,
}: {
  stack?: MoveStack;
  isLoading?: boolean;
  isNew?: boolean;
  onSubmit: (stack: FormType) => Promise<void>;
  onDelete?: () => Promise<void>;
  onExecute?: () => Promise<void>;
}) => {
  const { account } = useWallet();
  const address = account?.address;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset: resetForm,
    resetField,
    formState: { isDirty },
  } = useForm<FormType>({
    defaultValues: getEmptyForm(),
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

  const onClickSave = handleSubmit(async (stack) => {
    if (!address) {
      return;
    }

    await onSubmit(stack);
  });

  const onClickDelete = async () => {
    if (!address || !onDelete) {
      return;
    }

    await onDelete();
  };

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
      resetForm(getEmptyForm());
    }
  }, [replaceBlock, resetForm, setValue, stack]);

  return (
    <PageContainer>
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <Link href="/stacks">
            <button className="text-white hover:text-primary">
              <LeftOutlined />
            </button>
          </Link>
          <StackTitle
            control={control}
            isLoading={isLoading}
            value={stack?.stackName || ''}
            onSave={onClickSave}
            isNew={isNew}
          />
        </div>
        <div className="flex gap-2">
          {isLoading ? (
            <Skeleton.Button active />
          ) : (
            <Button
              disabled={isNew}
              type="danger"
              size="middle"
              onClick={() => onClickDelete()}
            >
              Delete
            </Button>
          )}
          {isLoading ? (
            <Skeleton.Button active />
          ) : (
            <Button
              disabled={isNew}
              type="primary"
              size="middle"
              onClick={onExecute}
            >
              Execute
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {editingBlocks.map(
          ({ functionName, paramValues, genericParamValues }, index) => (
            <StackFunctionItem
              key={`${index}`}
              control={control}
              functionIndex={index}
              onRemove={async () => {
                removeBlock(index);
                await onClickSave();
              }}
              functionName={functionName}
              paramValues={paramValues}
              genericParamValues={genericParamValues}
              getValues={() => getValues(`blocks.${index}`)}
              onSave={onClickSave}
              onReset={async () => {
                resetField(`blocks.${index}`);
              }}
              isDirty={isDirty}
            />
          )
        )}
      </div>
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
            paramValues: new Array(paramLength - 1).fill(''), // -1 because the first param is the &signer
            genericParamValues: new Array(genericParamLength).fill(''),
          });
        }}
      />
    </PageContainer>
  );
};

export default StackEditor;
