import { Button, Input, Skeleton } from 'antd';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import { useEffect, useState } from 'react';
import { MoveBlock, MoveBlockPreview } from 'src/MoveFunction';
import Container from '~common/components/Container';
import useStack from '~stacks/hooks/useStack';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import HoverableItemContainer from '~common/components/HoverableItemContainer';
import { PlusCircleFilled } from '@ant-design/icons';
import useWallet from '~common/hooks/useWallet';
import StackFunctionItem from '~stacks/components/StackFunctionItem';

export type FormType = {
  stackName: string;
  blocks: (MoveBlockPreview | MoveBlock)[];
};

const EMPTY_FORM: FormType = {
  stackName: '',
  blocks: [],
};

const StackDetailPage = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isEditing, setIsEditing] = useState(false);
  const { account } = useWallet();

  const { data: stack, isLoading } = useStack({
    id,
    address: account?.address,
  });

  const {
    control,
    handleSubmit,
    setValue,
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
      replaceBlock(stack.blocks.slice());
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
        {(isEditing ? editingBlocks : stack?.blocks || []).map(
          (block, index) => (
            <StackFunctionItem
              key={`${id}-${index}`}
              block={block as MoveBlock}
              isEditing={isEditing}
              control={control}
              functionIndex={index}
              onRemove={() => removeBlock(index)}
              updateDetail={(blockData, functionDetail) => {
                const description = functionDetail?.description || '';
                const params = blockData.params.map(({ value }, index) => ({
                  value,
                  type: functionDetail?.params[index].type || '',
                  name: functionDetail?.params[index].name || '',
                }));
                const genericTypeParams = blockData.genericTypeParams.map(
                  ({ value }, index) => ({
                    value,
                    ability:
                      functionDetail?.genericTypeParams?.[index]?.ability || '',
                  })
                );

                setValue(`blocks.${index}.description`, description);
                setValue(`blocks.${index}.params`, params);
                setValue(
                  `blocks.${index}.genericTypeParams`,
                  genericTypeParams
                );
              }}
            />
          )
        )}
      </div>
      {isEditing && (
        <button
          onClick={() =>
            appendBlock({
              functionName: 'new block',
              description: 'should be selected from the list',
              params: [
                {
                  type: 'string',
                  name: 'param1 description',
                },
              ],
            } as MoveBlock)
          }
        >
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
    </Container>
  );
};

interface ServerProps {
  id: number;
}
export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const { id } = context.query;

  return {
    props: {
      id: parseInt(id as string),
    },
  };
};

export default StackDetailPage;
