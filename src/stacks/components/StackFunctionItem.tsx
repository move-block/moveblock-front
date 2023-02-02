import { Skeleton, Input } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import CollapsableItemContainer from '~common/components/CollapsableItemContainer';
import { parseFullFunctionName } from '~modules/hooks/fetchFunctionDetail';
import useFunction from '~modules/hooks/useFunction';
import useWallet, { TransactionPayload } from '~common/hooks/useWallet';
import { JsonViewer } from '@textea/json-viewer';
import { BlockFormType } from './StackEditor';
import Button from '~common/components/Button';

enum SimulationStatus {
  NOT_CHANGED,
  CHANGED,
  SIMULATION_SUCCESS,
  SIMULATION_FAIL,
}

const StackFunctionItem = ({
  functionIndex,
  onRemove,
  onSave,
  onReset,
  functionName,
  paramValues,
  genericParamValues,
}: {
  functionIndex: number;
  onRemove: () => Promise<void>;
  onSave: () => Promise<void>;
  onReset: () => Promise<void>;
} & BlockFormType) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);
  const { simulateFunction } = useWallet();

  const [simulationResult, setSimulationResult] = useState('');

  const {
    control,
    getValues: getFormValues,
    formState: { dirtyFields },
  } = useFormContext();

  const getValues = () => getFormValues(`blocks.${functionIndex}`);
  const isDirty = useMemo(() => {
    const blockDirtyFields = dirtyFields.blocks?.[functionIndex] as Partial<
      Readonly<{
        functionName?: boolean | undefined;
        paramValues?: boolean[] | undefined;
        genericParamValues?: boolean[] | undefined;
      }>
    >;
    if (!blockDirtyFields) {
      return false;
    }

    const { functionName, paramValues, genericParamValues } = blockDirtyFields;
    const dirtyParamCount = (paramValues || []).filter(
      (value) => !!value
    ).length;
    const dirtyGenericCount = (genericParamValues || []).filter(
      (value) => !!value
    ).length;
    return functionName || dirtyParamCount > 0 || dirtyGenericCount > 0;
  }, [dirtyFields.blocks, functionIndex]);

  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>(
    isDirty ? SimulationStatus.CHANGED : SimulationStatus.NOT_CHANGED
  );
  useEffect(() => {
    if (isDirty) {
      setSimulationStatus(SimulationStatus.CHANGED);
    } else {
      setSimulationStatus(SimulationStatus.NOT_CHANGED);
    }
  }, [isDirty]);

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
    if (result?.success) {
      setSimulationStatus(SimulationStatus.SIMULATION_SUCCESS);
      setSimulationResult(result.events);
    } else {
      setSimulationStatus(SimulationStatus.SIMULATION_FAIL);
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
      {simulationStatus === SimulationStatus.SIMULATION_SUCCESS && (
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
      {simulationStatus === SimulationStatus.SIMULATION_FAIL && (
        <div>
          <h4>
            Changes <CloseCircleTwoTone twoToneColor="#eb2f96" />
          </h4>
          Simulation failed
        </div>
      )}
      <div className="mt-2 flex justify-end gap-2">
        {simulationStatus === SimulationStatus.CHANGED && (
          <Button type="default" size="small" onClick={onReset}>
            Cancel
          </Button>
        )}
        {simulationStatus !== SimulationStatus.CHANGED && (
          <Button type="danger" size="small" onClick={onRemove}>
            Delete
          </Button>
        )}
        {simulationStatus === SimulationStatus.CHANGED && (
          <Button type="primary" size="small" onClick={handleSimulate}>
            Simulate
          </Button>
        )}
        {simulationStatus === SimulationStatus.SIMULATION_SUCCESS && (
          <Button type="primary" size="small" onClick={onSave}>
            Set Block
          </Button>
        )}
      </div>
    </CollapsableItemContainer>
  );
};

export default StackFunctionItem;
