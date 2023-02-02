import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Skeleton, Input } from 'antd';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const StackTitle = ({
  control,
  isLoading,
  value,
  onSave,
}: {
  control: any;
  isLoading: boolean;
  value: string;
  onSave: () => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async () => {
    try {
      await onSave();
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Skeleton
      className="flex h-[70px] items-center"
      active
      title={{
        width: '20rem',
      }}
      paragraph={false}
      loading={isLoading}
    >
      <div className="flex items-end gap-1">
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
          <h1 className="mb-0">{value}</h1>
        )}
        {isEditing ? (
          <button onClick={onSubmit}>
            <CheckOutlined className="text-h4" />
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)}>
            <EditOutlined className="text-h4" />
          </button>
        )}
      </div>
    </Skeleton>
  );
};

export default StackTitle;
