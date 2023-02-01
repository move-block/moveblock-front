import { twMerge } from 'tailwind-merge';
import { DefaultContainerProps } from './ContainerProps';

const MainContainer = ({
  className,
  children,
  ...props
}: DefaultContainerProps) => {
  return (
    <div
      className={twMerge(
        'rounded-[10px] bg-[#262626] px-[50px] py-[20px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default MainContainer;
