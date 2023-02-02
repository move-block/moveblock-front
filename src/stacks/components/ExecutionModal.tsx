import {CheckCircleTwoTone, CloseCircleTwoTone, CloseOutlined, CopyOutlined} from '@ant-design/icons';
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
      width="30%"
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
            <CheckCircleTwoTone twoToneColor="#597EF7" />
          </h4>
          <p>Transaction Success!</p>
        </div>
        <div>
          <a href={`https://explorer.aptoslabs.com/txn/${transactionHash}`}
             target="_blank" rel="noreferrer">https://explorer.aptoslabs.com/txn/{transactionHash}</a>
        </div>
        <div className="flex flex-row">
          <h4>Byte code</h4>
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
