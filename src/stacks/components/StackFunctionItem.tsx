import { Skeleton, Input } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import CollapsableItemContainer from '~common/components/CollapsableItemContainer';
import { parseFullFunctionName } from '~modules/hooks/fetchFunctionDetail';
import useFunction from '~modules/hooks/useFunction';
import useWallet, { TransactionPayload } from '~common/hooks/useWallet';
import { JsonViewer } from '@textea/json-viewer';
import { FormType, BlockFormType } from './StackEditor';
import Button from '~common/components/Button';

enum CheckStatus {
  NOT_CHECKED,
  SUCCESS,
  FAIL,
}

const StackFunctionItem = ({
  control,
  functionIndex,
  onRemove,
  functionName,
  paramValues,
  genericParamValues,
  getValues,
  onSave,
  onReset,
  isDirty = false,
}: {
  control: Control<FormType>;
  functionIndex: number;
  getValues: () => BlockFormType;
  onRemove: () => Promise<void>;
  onSave: () => Promise<void>;
  onReset: () => Promise<void>;
  isDirty: boolean;
} & BlockFormType) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);
  const { simulateFunction } = useWallet();
  /*0: 안한거, 1: 한거, 2: 실패한거*/
  const [simulationStatus, setSimulationStatus] = useState<CheckStatus>(
    CheckStatus.NOT_CHECKED
  );
  const [simulationResult, setSimulationResult] = useState('');

  const { data: functionInfo, isLoading: isFunctionInfoLoading } =
    useFunction(functionName);

  const parsedFunctionName =
    parseFullFunctionName(functionName)?.functionName || '';

  const handleSimulate = async () => {
    const { functionName, paramValues, genericParamValues } = getValues();

    const payload: TransactionPayload = {
      type_arguments: genericParamValues,
      arguments: paramValues,
      function: functionName,
    };

    const result = await simulateFunction(payload);
    if (result != null && result.success) {
      setSimulationStatus(CheckStatus.SUCCESS);
      setSimulationResult(result.events);
    } else {
      setSimulationStatus(CheckStatus.FAIL);
    }
  };

  return (
    <CollapsableItemContainer
      isOpen={isOpen}
      title={parsedFunctionName}
      toggleOpen={toggleOpen}
      className="flex flex-col gap-4"
      contentClassName="flex flex-col gap-4"
    >
      <div>{functionName}</div>
      {functionInfo?.description && <div>{functionInfo?.description}</div>}
      {paramValues?.length ? (
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
                      {...field}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {genericParamValues?.length ? (
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
                      placeholder={
                        functionInfo?.genericTypeParams?.[index]?.name
                      }
                      {...field}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {simulationStatus === CheckStatus.SUCCESS && (
        <div>
          <h4>
            Changes <CheckCircleTwoTone twoToneColor="#597EF7" />
          </h4>
          <JsonViewer
            enableClipboard={true}
            value={simulationResult}
            theme="dark"
            style={{
              backgroundColor: 'transparent',
            }}
          />
        </div>
      )}
      {simulationStatus === CheckStatus.FAIL && (
        <div>
          <h4>
            Changes <CloseCircleTwoTone twoToneColor="#eb2f96" />
          </h4>
          Simulation failed
        </div>
      )}
      <div className="mt-2 flex justify-end gap-2">
        {isDirty ? (
          <Button type="default" size="small" onClick={onReset}>
            Cancel
          </Button>
        ) : (
          <Button type="danger" size="small" onClick={onRemove}>
            Delete
          </Button>
        )}
        {isDirty ? (
          <Button type="primary" size="small" onClick={handleSimulate}>
            Simulate
          </Button>
        ) : (
          <Button type="primary" size="small" onClick={onSave}>
            Set Block
          </Button>
        )}
      </div>
    </CollapsableItemContainer>
  );
};

export default StackFunctionItem;
