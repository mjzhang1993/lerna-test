import * as React from 'react';
import { useRouter } from 'next/router';
import MdxHub from '~docs/MdxHub';

const Components: React.FC = () => {
  const router = useRouter();
  React.useEffect(() => {
    router.replace(MdxHub[0].path);
  });

  return null;
};

export default Components;
