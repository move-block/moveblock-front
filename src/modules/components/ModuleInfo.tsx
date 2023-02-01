import { Input, Divider as AntDivider, Button, Typography } from 'antd';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { moduleAtom } from '~pages/modules/[account]/[module]';
import useWallet from '~common/hooks/useWallet';
import { authAtom } from '~pages/modules/[account]/[module]';

import useModuleMutation, {
  ModuleMutationOptions,
} from '~modules/hooks/useModuleMutation';
import MainContainer from '~common/components/MainContainer';

const NO_DATA_MESSAGE = 'No data';
const DEFAULT_ADDRESS_MESSAGE = 'Set alias of address';
const DEFAULT_DESCRIPTION_MESSAGE = 'Set description of this module';
const DEFAULT_GITHUB_URL_MESSAGE = 'Set github url of source code file';
const DEFAULT_GITHUB_REV_MESSAGE = 'Set github rev of source code file';
const DEFAULT_GITHUB_SUBDIR_MESSAGE = 'Set github subdir of source code file';

const Divider = () => {
  return <AntDivider className="bg-[#F0F0F0] max-w-[100px] min-w-0" />;
};

const ModuleInfo = () => {
  const { hasAuth } = useRecoilValue(authAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [inputAlias, setInputAlias] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [inputGithubUrl, setInputGithupUrl] = useState('');
  const [inputRev, setInputRev] = useState('');
  const [inputSubdir, setInputSubdir] = useState('');

  const {
    name,
    address,
    alias,
    description,
    github_url,
    rev,
    subdir,
    bytecode,
    friends,
  } = useRecoilValue(moduleAtom);

  const { checkAuth } = useWallet();
  const { Paragraph } = Typography;

  const checkOwner = async () => {
    setInputAlias(alias);
    setInputDescription(description);
    setInputGithupUrl(github_url);
    setInputRev(rev);
    setInputSubdir(subdir);
    (await checkAuth(address)) ? setIsEditing(true) : setIsEditing(false);
  };

  const verifyGithub = () => {
    alert('Verify Success');
  };

  const copyDependency = () => {
    alert('Copy Success');
  };

  const moduleMutation = useModuleMutation();

  const onSaveButtonClicked = async () => {
    await moduleMutation.mutate({
      alias: inputAlias,
      description: inputDescription,
      github_url: inputGithubUrl,
      rev: inputRev,
      subdir: inputSubdir,
      name: name,
      account: address,
    } as ModuleMutationOptions);

    setIsEditing(false);
  };

  return (
    <MainContainer>
      <h4> Module </h4>
      {name}
      <Divider />
      {!isEditing ? (
        <>
          <h4> Address </h4>
          {alias ? `${alias}(${address})` : address}
          <Divider />
          <h4> Description </h4>
          {description ? description : NO_DATA_MESSAGE}
          <Divider />
          <h4>Github Dependency</h4>
          <Paragraph style={{ maxWidth: 'calc(100% - 70px)', marginTop: 24 }}>
            <pre style={{ border: 'none' }}>
              {'[dependencies.' +
                name +
                ']\n' +
                "git = '" +
                (github_url ? github_url : '') +
                "'" +
                '\n' +
                "rev = '" +
                (rev ? rev : '') +
                "'" +
                '\n' +
                "subdir = '" +
                (subdir ? subdir : '') +
                "'"}
            </pre>
          </Paragraph>

          <Button type="primary" onClick={copyDependency}>
            Copy
          </Button>
          <Divider />
        </>
      ) : (
        <>
          <h4> Address </h4>
          <Input
            defaultValue={alias ? alias : ''}
            placeholder={`${DEFAULT_ADDRESS_MESSAGE}`}
            onChange={(e) => setInputAlias(e.target.value)}
          />
          {alias ? `${alias}(${address})` : address}
          <Divider />
          <h4> Description </h4>
          <Input
            defaultValue={description ? description : ''}
            placeholder={DEFAULT_DESCRIPTION_MESSAGE}
            onChange={(e) => setInputDescription(e.target.value)}
          />
          <Divider />
          <h4> Github Dependency </h4>
          URL :
          <Input
            style={{ width: 'calc(100% - 70px)' }}
            defaultValue={github_url ? github_url : ''}
            placeholder={DEFAULT_GITHUB_URL_MESSAGE}
            onChange={(e) => setInputGithupUrl(e.target.value)}
          />
          <br />
          Rev :
          <Input
            style={{ width: 'calc(100% - 70px)' }}
            defaultValue={rev ? rev : ''}
            placeholder={DEFAULT_GITHUB_REV_MESSAGE}
            onChange={(e) => setInputRev(e.target.value)}
          />
          <br />
          Subdir :
          <Input
            style={{ width: 'calc(100% - 70px)' }}
            defaultValue={subdir ? subdir : ''}
            placeholder={DEFAULT_GITHUB_SUBDIR_MESSAGE}
            onChange={(e) => setInputSubdir(e.target.value)}
          />
          <br />
          <Button type="primary" onClick={() => verifyGithub()}>
            Verify
          </Button>
          <Divider />
        </>
      )}

      <h4> Bytecode </h4>
      <Input.TextArea
        value={bytecode.join('')}
        autoSize={{ minRows: 6, maxRows: 6 }}
      />
      <Divider />
      <h4> Friends </h4>
      {friends ? `[${friends.join(',')}]` : NO_DATA_MESSAGE}
      <Divider />
      <div className="float-right">
      { 
        !hasAuth ? (<div/>) :
        !isEditing ? (
        <Button type="primary" onClick={() => checkOwner()}>
          Set Information
        </Button>
        ) : 
        (
          <div>
            <Button className="mx-1" danger onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              className="mx-1"
              type="primary"
              onClick={onSaveButtonClicked}
            >
              Save
            </Button>
          </div>
        )
      }
      </div>
    </MainContainer>
  )
}

export default ModuleInfo;