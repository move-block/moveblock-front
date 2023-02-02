import { Skeleton, Input, Button } from 'antd';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import CollapsableItemContainer from '~common/components/CollapsableItemContainer';
import useFunction from '~modules/hooks/useFunction';
import { BlockFormType, FormType } from '~pages/stacks/[id]';

const StackFunctionItem = ({
  isEditing,
  control,
  functionIndex,
  onRemove,
  functionName,
  paramValues,
  genericParamValues,
}: {
  isEditing: boolean;
  control: Control<FormType>;
  functionIndex: number;
  onRemove: () => void;
} & BlockFormType) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);

  const { data: functionInfo, isLoading: isFunctionInfoLoading } =
    useFunction(functionName);

  return (
    <CollapsableItemContainer
      isOpen={isOpen}
      title={functionName}
      toggleOpen={toggleOpen}
      className="flex flex-col gap-4"
      contentClassName="flex flex-col gap-4"
    >
      {functionInfo?.description && <div>{functionInfo?.description}</div>}
      <div>
        <h4>params</h4>
        <div className="flex gap-x-8 gap-y-2 flex-wrap">
          {paramValues?.map((_value, index) => (
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
                  {functionInfo?.params[index + 1]?.type}
                </Skeleton>
              </div>
              <Controller
                name={`blocks.${functionIndex}.paramValues.${index}`}
                control={control}
                render={({ field }) => (
                  <Input
                    className={'w-60'}
                    placeholder={functionInfo?.params[index + 1]?.name}
                    disabled={!isEditing}
                    {...field}
                  />
                )}
              />
            </div>
          ))}
          {!paramValues?.length && (
            <div className="text-footnote text-gray-300">(No params)</div>
          )}
        </div>
      </div>
      <div>
        <h4>generic type params</h4>
        <div className="flex gap-x-8 gap-y-2 flex-wrap">
          {genericParamValues?.map((_value, index) => (
            <div key={index} className="flex flex-col gap-1">
              <Controller
                name={`blocks.${functionIndex}.genericParamValues.${index}`}
                control={control}
                render={({ field }) => (
                  <Input
                    className={'w-60'}
                    placeholder={functionInfo?.genericTypeParams?.[index]?.name}
                    disabled={!isEditing}
                    {...field}
                  />
                )}
              />
            </div>
          ))}
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
