import Notifications from './features/notifications/NotificationWrapper';
import CircleProgressbarSimple from './features/progress/CircleProgressbarSimple';
import ProgressbarStylish from './features/progress/ProgressbarStylish';
import TextUIWithBeam from './features/textui/TextUIWithBeam';
import InputDialog from './features/dialog/InputDialog';
import ContextMenuTilted from './features/menu/context/ContextMenuTilted';
import { useNuiEvent } from './hooks/useNuiEvent';
import { setClipboard } from './utils/setClipboard';
import { fetchNui } from './utils/fetchNui';
import AlertDialog from './features/dialog/AlertDialog';
import ListMenu from './features/menu/list';
import Dev from './features/dev';
import { isEnvBrowser } from './utils/misc';
import SkillCheckClean from './features/skillcheck/SkillCheckClean';
import RadialMenu from './features/menu/radial';
import { theme } from './theme';
import { MantineProvider } from '@mantine/core';
import { useConfig } from './providers/ConfigProvider';

const App: React.FC = () => {
  const { config } = useConfig();

  useNuiEvent('setClipboard', (data: string) => {
    setClipboard(data);
  });

  fetchNui('init');

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles theme={{ ...theme, ...config }}>
      <ProgressbarStylish />
      <CircleProgressbarSimple />
      <Notifications />
      <TextUIWithBeam />
      <InputDialog />
      <AlertDialog />
      <ContextMenuTilted />
      <ListMenu />
      <RadialMenu />
      <SkillCheckClean />
      {isEnvBrowser() && <Dev />}
    </MantineProvider>
  );
};

export default App;
