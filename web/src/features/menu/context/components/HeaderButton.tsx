import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: 4,
    flex: '1 15%',
    alignSelf: 'stretch',
    height: 'auto',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 2,
    backgroundColor: 'transparent',
    border: '1px solid #00ffff',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
    '&:hover': {
      boxShadow: '0 0 15px rgba(0, 255, 255, 0.6)',
    },
  },
  root: {
    border: 'none',
  },
  label: {
    color: params.canClose === false ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
    textShadow: params.canClose === false ? 'none' : '0 0 8px #ffffff',
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;
