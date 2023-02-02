import {CheckCircleFilled, CheckCircleOutlined, CloseOutlined, CopyOutlined} from '@ant-design/icons';
import {Button, Input, Modal} from 'antd';

const FunctionModal = ({
  isOpen,
  onClose,
  byteCode,
  transactionHash,
}: {
  isOpen: boolean;
  onClose: () => void;
  byteCode: string | null;
  transactionHash: string | null;
}) => {

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      closeIcon={<div />}
      width="25%"
      className="overflow-auto"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-start">
          <button onClick={() => onClose()}>
            <CloseOutlined />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h4>
            <CheckCircleFilled className="text-3xl text-primary"/>
          </h4>
          <p className="text-4xl font-bold">Transaction</p>
          <p className="text-4xl font-bold">Success!</p>
        </div>
        <div>
          <a href={`https://explorer.aptoslabs.com/txn/${transactionHash}`}
             target="_blank" rel="noreferrer">https://explorer.aptoslabs.com/txn/{transactionHash}</a>
        </div>
        <div className="flex flex-row">
          <p className="items-center text-lg">Byte code</p>
          <Button type="ghost" icon={<CopyOutlined />} />
        </div>
        <Input.TextArea
          style={{ width: "calc(100% - 10px)" }}
          value={byteCode || ''}
          autoSize={{ minRows: 6, maxRows: 6 }}
        />
        <br/>

      </div>
    </Modal>
  );
};

export default FunctionModal;
