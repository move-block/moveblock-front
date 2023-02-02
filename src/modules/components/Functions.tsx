import { Button, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useForm, Controller } from 'react-hook-form';
import { MoveFunctionWithDetail } from 'src/MoveFunction';
import { twMerge } from 'tailwind-merge';
import { moduleAtom } from '~pages/modules/[account]/[module]';
import useFunctionMutation from '~modules/hooks/useFunctionMutation';
import CollapsableItemContainer from '~common/components/CollapsableItemContainer';
import { authAtom } from '~pages/modules/[account]/[module]';
import useWallet from '~common/hooks/useWallet';

const FunctionItem = ({
  name,
  account: { address },
  description,
  visibility,
  isEntry,
  genericTypeParams = [],
  params = [],
  returnTypes,
  isSelected = false,
}: MoveFunctionWithDetail & {
  isSelected?: boolean;
}) => {
  const { hasAuth } = useRecoilValue(authAtom);
  const [isOpen, setIsOpen] = useState(isSelected);
  const toggleOpen = () => setIsOpen(!isOpen);
  const [isEditing, setIsEditing] = useState(false);
  const { checkAuth } = useWallet();

  const { control, handleSubmit, reset } = useForm<{
    description: string;
    paramNames: string[];
    genericParams: string[];
  }>({
    defaultValues: {
      description: description || '',
      paramNames: params.map(({ name: paramName }) => paramName || ''),
      genericParams: genericTypeParams.map(
        ({ name: genericParamName }) => genericParamName || ''
      ),
    },
  });

  const { address: accountAddress, name: moduleName } =
    useRecoilValue(moduleAtom);

  const functionMutation = useFunctionMutation({
    accountAddress,
    moduleName,
    functionName: name,
  });

  const handleClickEdit = async () => {
    const isOwner = await checkAuth(address);
    if (isOwner) {
      setIsEditing(true);
    }
  };

  const onClickSave = handleSubmit(
    async ({ description, paramNames, genericParams }) => {
      await functionMutation.mutateAsync({
        description,
        paramNames,
        genericParams,
      });
      setIsEditing(false);
    }
  );

  useEffect(() => {
    reset({
      description,
      paramNames: params.map(({ name: paramName }) => paramName || ''),
      genericParams: genericTypeParams.map(
        ({ name: genericParamName }) => genericParamName || ''
      ),
    });
  }, [description, genericTypeParams, params, reset]);

  const returnTypesInfo = useMemo(
    () => JSON.stringify(returnTypes),
    [returnTypes]
  );

  return (
    <CollapsableItemContainer
      isOpen={isOpen}
      title={name}
      toggleOpen={toggleOpen}
    >
      <div className="flex flex-col gap-4">
        <Controller
          name={`description`}
          control={control}
          render={({ field }) => (
            <Input.TextArea
              autoFocus
              placeholder="Description about this function"
              className={isEditing ? "" : "hidden"}
              {...field}
            />
          )}
        />
        {!isEditing && description && <div>{description}</div>}
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col flex-[1_0_100px]">
            <h4>Visibility</h4>
            <div>{visibility}</div>
          </div>
          <div className="flex flex-col flex-[1_0_100px]">
            <h4>is_entry</h4>
            <div>{isEntry ? "true" : "false"}</div>
          </div>
          <div className="flex flex-col flex-[2_0_auto]">
            <h4>return</h4>
            <div>{returnTypesInfo}</div>
          </div>
          <div className="flex flex-col flex-[2_0_auto]">
            <h4>genericTypeParams</h4>
            <div className="flex gap-x-8 gap-y-2 flex-wrap">
              {genericTypeParams.map(
                ({ ability: ability, name: genericParamName }, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div>{ability}</div>
                    {!isEditing && genericParamName && (
                      <div className="text-footnote">{genericParamName}</div>
                    )}
                    <Controller //여기수정하고 input 받는 부분
                      name={`genericParams.${index}`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          className={twMerge(isEditing ? "" : "hidden", "w-30")}
                          placeholder="Name of this generic param"
                          {...field}
                        />
                      )}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div>
          <h4>params</h4>
          <div className="flex gap-x-8 gap-y-2 flex-wrap">
            {params.map(({ type: paramType, name: paramName }, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div>{paramType}</div>
                {!isEditing && paramName && (
                  <div className="text-footnote">{paramName}</div>
                )}
                <Controller
                  name={`paramNames.${index}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      className={twMerge(isEditing ? "" : "hidden", "w-60")}
                      placeholder="Name of this param"
                      {...field}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        {hasAuth ? (
          isEditing ? (
            <div className="flex gap-2">
              <Button
                className="text-footnote py-[7px] px-[24px] border-none"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className="text-footnote py-[7px] px-[24px]"
                onClick={onClickSave}
              >
                Save
              </Button>
            </div>
          ) : (
            <Button
              type="primary"
              className="text-footnote py-[7px] px-[24px]"
              onClick={() => handleClickEdit()}
            >
              Edit
            </Button>
          )
        ) : (
          <div />
        )}
      </div>
    </CollapsableItemContainer>
  );
};

interface Props {
  selectedFunction: string;
}
const Functions = ({ selectedFunction }: Props) => {
  const { moveFunctions } = useRecoilValue(moduleAtom);
  const selectedFunctionIndex = moveFunctions.findIndex(
    (moveFunction) => moveFunction.name === selectedFunction
  );
  const selectedFunctionInfo = moveFunctions[selectedFunctionIndex];
  const restFunctions = [
    ...moveFunctions.slice(0, selectedFunctionIndex),
    ...moveFunctions.slice(selectedFunctionIndex + 1),
  ];

  return (
    <div className="flex flex-col gap-[24px]">
      {selectedFunctionInfo && (
        <FunctionItem {...selectedFunctionInfo} isSelected />
      )}
      {restFunctions.map((moveFunction) => (
        <FunctionItem key={moveFunction.id} {...moveFunction} />
      ))}
    </div>
  );
};

export default Functions;
