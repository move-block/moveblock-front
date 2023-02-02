import { Skeleton, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { MoveBlock, MoveFunctionWithDetail } from 'src/MoveFunction';
import CollapsableItemContainer from '~common/components/CollapsableItemContainer';
import useFunction from '~modules/hooks/useFunction';
import { FormType } from '~pages/stacks/[id]';

const StackFunctionItem = ({
  block,
  isEditing,
  control,
  functionIndex,
  onRemove,
  updateDetail,
}: {
  block: MoveBlock;
  isEditing: boolean;
  control: Control<FormType>;
  functionIndex: number;
  onRemove: () => void;
  updateDetail: (
    blockData: MoveBlock,
    functionDetail?: MoveFunctionWithDetail
  ) => void;
}) => {
  const { functionName, description, params, genericTypeParams } = block;

  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);

  const { data: functionInfo, isLoading: isFunctionInfoLoading } =
    useFunction(functionName);

  useEffect(() => {
    updateDetail(block, functionInfo || undefined);
  }, [block, functionInfo, updateDetail]);

  return (
    <CollapsableItemContainer
      isOpen={isOpen}
      title={functionName}
      toggleOpen={toggleOpen}
      className="flex flex-col gap-4"
      contentClassName="flex flex-col gap-2"
    >
      {description && <div>{description}</div>}
      <div>
        <h4>params</h4>
        <div className="flex gap-x-8 gap-y-2 flex-wrap">
          {params?.map(({ type: paramType, name: paramName }, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div>
                <Skeleton
                  active
                  title={{
                    width: '50%',
                  }}
                  paragraph={false}
                  loading={isFunctionInfoLoading}
                >
                  {paramType}
                </Skeleton>
              </div>
              <Controller
                name={`blocks.${functionIndex}.params.${index}.value`}
                control={control}
                render={({ field }) => (
                  <Input
                    className={'w-60'}
                    placeholder={paramName}
                    disabled={!isEditing}
                    {...field}
                  />
                )}
              />
            </div>
          ))}
          {!params?.length && (
            <div className="text-footnote text-gray-300">(No params)</div>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="primary"
            danger
            className="border-none h-fit py-0"
            onClick={onRemove}
          >
            Delete
          </Button>
          <Button type="primary" className="border-none h-fit py-0">
            Simulate
          </Button>
        </div>
      )}
    </CollapsableItemContainer>
  );
};

export default StackFunctionItem;
