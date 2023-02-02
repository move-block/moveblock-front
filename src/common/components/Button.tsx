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
      className={
        size === 'small'
          ? 'h-[26px] min-w-[5rem] px-6 text-footnote flex justify-center items-center border-none'
          : 'border-none h-[28px] min-w-[5rem] py-0'
      }
      onClick={onClick}
    >
      {children}
    </AndButton>
  );
};

export default Button;
