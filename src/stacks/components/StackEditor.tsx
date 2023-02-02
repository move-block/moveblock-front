import { LeftOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Skeleton } from 'antd';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import PageContainer from '~common/components/PageContainer';
import HoverableItemContainer from '~common/components/HoverableItemContainer';
import useWallet from '~common/hooks/useWallet';
import useStack from '~stacks/hooks/useStack';
import useStackMutation from '~stacks/hooks/useStackMutation';
import Button from '../../common/components/Button';
import FunctionModal from './FunctionModal';
import StackFunctionItem from './StackFunctionItem';
import StackTitle from './StackTitle';
import ExecutionModal from '~stacks/components/ExecutionModal';
import usePetraWallet from '~common/hooks/useWallet';
import executeStack from '~stacks/hooks/executeStack';

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

declare enum ExecutionStatus {
  IDLE,
  EXECUTING,
  EXECUTED,
}

const StackEditor = ({ id }: { id?: number }) => {
  const [isEditing, setIsEditing] = useState(id ? false : true);
  const { account } = useWallet();
  const address = account?.address;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: stack, isLoading } = useStack({
    id,
    address,
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

  const {
    create: createStack,
    update: updateStack,
    delete: deleteStack,
  } = useStackMutation({
    id,
    address,
  });

  const onClickSave = handleSubmit(async (stack) => {
    if (!address) {
      return;
    }

    const saveStack = id ? updateStack : createStack;

    try {
      await saveStack({ stack });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  });

  const onClickDelete = async () => {
    if (!address || !id) {
      return;
    }

    try {
      await deleteStack();
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>(
    ExecutionStatus.IDLE
  );
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);

  const [byteCode, setByteCode] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const { getSignMessagePayload } = usePetraWallet();
  const { getBytecode, execute } = executeStack();

  const onClickExecute = async () => {
    if (!id || !address) {
      return;
    }

    setExecutionStatus(ExecutionStatus.EXECUTING);
    const byteCode = await getBytecode(address, id);
    if (byteCode === null || byteCode === undefined || byteCode === '') {
      alert('Execution failed');
      return;
    }
    setByteCode(byteCode);
    const sign = await getSignMessagePayload(byteCode);
    if (sign == null) return;

    // TODO show spinner
    const result = await execute(address, id);
    setTransactionHash(result);
    setExecutionStatus(ExecutionStatus.EXECUTED);
    setIsExecutionModalOpen(true);

    console.log(result);
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
      resetForm(EMPTY_FORM);
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
          />
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                type="danger"
                size="middle"
                onClick={() => onClickDelete()}
              >
                Delete
              </Button>
              <Button
                type="default"
                size="middle"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="primary" size="middle" onClick={onClickSave}>
                Save Stack
              </Button>
            </>
          ) : (
            <>
              {isLoading ? (
                <Skeleton.Button active />
              ) : (
                <Button
                  type="default"
                  size="middle"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
              {isLoading ? (
                <Skeleton.Button active />
              ) : (
                <Button type="primary" size="middle" onClick={onClickExecute}>
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
            paramValues: new Array(paramLength - 1).fill(''), // -1 because the first param is the &signer
            genericParamValues: new Array(genericParamLength).fill(''),
          });
        }}
      />
      <ExecutionModal
        isOpen={isExecutionModalOpen}
        onClose={() => setIsExecutionModalOpen(false)}
        byteCode={byteCode}
        transactionHash={transactionHash}
      />
    </PageContainer>
  );
};

export default StackEditor;
