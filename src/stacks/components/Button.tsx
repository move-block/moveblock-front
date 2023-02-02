import { Button as AndButton } from 'antd';

const Button = ({
  type,
  onClick,
  children,
  size,
}: {
  type: 'primary' | 'default' | 'danger';
  size: 'middle' | 'small';
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <AndButton
      type={type === 'default' ? 'default' : 'primary'}
      danger={type === 'danger'}
      className={size === 'middle' ? 'border-none h-fit py-0' : ''}
      onClick={onClick}
    >
      {children}
    </AndButton>
  );
};

export default Button;
