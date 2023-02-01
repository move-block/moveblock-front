import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { DefaultContainerProps } from './ContainerProps';
import MainContainer from './MainContainer';

const CollapsableItemContainer = ({
  children,
  className,
  title,
  isOpen,
  toggleOpen,
  contentClassName,
  ...props
}: DefaultContainerProps & {
  title: string;
  toggleOpen: () => void;
  isOpen: boolean;
  contentClassName?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MainContainer
      className={twMerge(
        'flex flex-col text-[#F0F0F0]',
        className,
        isHovered ? 'bg-[#141414]' : ''
      )}
      {...props}
    >
      <div
        className={twMerge('flex cursor-pointer', isOpen ? 'mb-4' : 'mb-0')}
        onClick={toggleOpen}
      >
        <h2
          className="text-inherit flex-1 mb-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {title}
        </h2>
        {isOpen ? <UpOutlined /> : <DownOutlined />}
      </div>
      <div className={twMerge(contentClassName, isOpen ? '' : 'hidden')}>
        {children}
      </div>
    </MainContainer>
  );
};

export default CollapsableItemContainer;
