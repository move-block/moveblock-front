import { twMerge } from 'tailwind-merge';
import { DefaultContainerProps } from './ContainerProps';

const CenterContainer = ({
  children,
  className,
  ...props
}: DefaultContainerProps) => {
  return (
    <div
      className={twMerge(
        'py-8 flex-1 flex flex-col items-center justify-center text-center gap-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default CenterContainer;

// <div className="p-4 max-w-3xl mx-auto flex flex-col gap-4">
