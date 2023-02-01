import { JsonViewer } from '@textea/json-viewer';
import { useRecoilValue } from 'recoil';
import MainContainer from '~common/components/MainContainer';
import { moduleAtom } from '~pages/modules/[account]/[module]';

const Abi = () => {
  const { moveModule } = useRecoilValue(moduleAtom);
  return (
    <MainContainer>
      <JsonViewer
        value={moveModule}
        theme="dark"
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </MainContainer>
  );
};

export default Abi;
