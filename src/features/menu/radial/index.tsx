import { Box, createStyles, Grid } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    height: '400px',
  },
  gridContainer: {
    width: '100%',
    height: '100%',
    padding: '15px',
    gap: '10px',
  },
  menuItem: {
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '80px',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255, 255, 255, 0.6)',
      transform: 'scale(1.02)',
      boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
    },
  },
  emptySlot: {
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    minHeight: '80px',
  },
  itemIcon: {
    color: '#ffffff',
    marginBottom: '6px',
    filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
  },
  itemLabel: {
    color: '#ffffff',
    fontSize: '11px',
    textAlign: 'center',
    fontWeight: 500,
    textShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
    lineHeight: '1.2',
  },
  categoryLabel: {
    position: 'absolute',
    left: '-50px',
    top: '50%',
    transform: 'translateY(-50%) rotate(-90deg)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
    whiteSpace: 'nowrap',
  },
  navigationButton: {
    position: 'absolute',
    bottom: '15px',
    right: '15px',
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255, 255, 255, 0.6)',
      transform: 'scale(1.1)',
      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
    },
  },
  navIcon: {
    color: '#ffffff',
    filter: 'drop-shadow(0 0 5px #ffffff)',
  },
}));

const PAGE_ITEMS = 12; // 3x4 grid = 12 items per page

const splitTextIntoLines = (text: string, maxCharPerLine: number = 12): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxCharPerLine) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};



const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);

    const didTransition: boolean = await fetchNui('radialTransition');

    if (!didTransition) return;

    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  // Create a 3x4 grid (12 slots)
  const gridItems = Array.from({ length: 12 }, (_, index) => {
    const item = menuItems[index];
    return item || null;
  });

  return (
    <>
      <Box
        className={classes.wrapper}
        onContextMenu={async () => {
          if (menu.page > 1) await changePage();
          else if (menu.sub) fetchNui('radialBack');
        }}
      >
        <ScaleFade visible={visible}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Category label */}
            <div className={classes.categoryLabel}>
              menu
            </div>

            {/* Grid container */}
            <Grid className={classes.gridContainer} columns={3} gutter="md">
              {gridItems.map((item, index) => (
                <Grid.Col span={1} key={index}>
                  {item ? (
                    <div
                      className={classes.menuItem}
                      onClick={async () => {
                        const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                        if (!item.isMore) fetchNui('radialClick', clickIndex);
                        else {
                          await changePage(true);
                        }
                      }}
                    >
                      {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                        <img
                          src={item.icon}
                          alt={item.label}
                          style={{
                            width: Math.min(Math.max(item.iconWidth || 30, 0), 45),
                            height: Math.min(Math.max(item.iconHeight || 30, 0), 45),
                            marginBottom: '6px',
                            filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
                          }}
                        />
                      ) : (
                        <LibIcon
                          icon={item.icon as IconProp}
                          size="lg"
                          className={classes.itemIcon}
                          fixedWidth
                        />
                      )}
                      <div className={classes.itemLabel}>
                        {splitTextIntoLines(item.label, 12).map((line, lineIndex) => (
                          <div key={lineIndex}>{line}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={classes.emptySlot} />
                  )}
                </Grid.Col>
              ))}
            </Grid>

            {/* Navigation button */}
            <div
              className={classes.navigationButton}
              onClick={async () => {
                if (menu.page > 1) await changePage();
                else {
                  if (menu.sub) fetchNui('radialBack');
                  else {
                    setVisible(false);
                    fetchNui('radialClose');
                  }
                }
              }}
            >
              <LibIcon
                icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
                className={classes.navIcon}
                fixedWidth
              />
            </div>
          </div>
        </ScaleFade>
      </Box>
    </>
  );
};

export default RadialMenu;
