import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { DefaultContainerProps } from './ContainerProps';
import MainContainer from './MainContainer';

const HoverableItemContainer = ({
  children,
  className,
  title,
  _hover,
  _hoverClassName,
  replace = false,
  center = true,
  ...props
}: DefaultContainerProps & {
  _hover?: React.ReactNode;
  _hoverClassName?: string;
  replace?: boolean;
  center?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MainContainer
      className={twMerge(
        'flex relative hover:bg-[#141414] cursor-pointer text-[#F0F0F0]',
        center ? 'justify-center items-center text-center' : '',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {replace ? (
        isHovered ? (
          _hover
        ) : (
          children
        )
      ) : (
        <>
          {children}
          <div
            className={twMerge(
              'absolute top-0 left-0 w-full h-full z-1',
              center ? 'justify-center items-center' : '',
              isHovered ? 'flex' : 'hidden',
              _hoverClassName
            )}
          >
            {_hover}
          </div>
        </>
      )}
    </MainContainer>
  );
};

export default HoverableItemContainer;
