import { twMerge } from 'tailwind-merge';
import { DefaultContainerProps } from './ContainerProps';

const PageContainer = ({
  children,
  className,
  ...props
}: DefaultContainerProps) => {
  return (
    <div
      className={twMerge(
        'py-4 w-full max-w-7xl flex-1 mx-auto flex flex-col gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageContainer;
