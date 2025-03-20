export const appBarXs = {backgroundColor: '#3a506b'};

export const toolbarXs = {display: 'flex', justifyContent: 'space-between'};

export const linksBoxXs = {
  flexGrow: 1,
  display: {xs: 'none', md: 'flex'},
  flexDirection: 'row',
  gap: 3,
  padding: '10px 30px',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
};

export const menuXs = {display: {xs: 'block', md: 'none'}};

export const mdlSectionXs = {display: {xs: 'none', md: 'block'}};

export const ADD_BUTTON = {
  fontSize: '1.2rem',
  borderRadius: '11px',
  padding: '6px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: '10px 0 20px 20px',
};

export const PERMISSION_BOX = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
};

export const PERMISSION_CARD = {
  maxWidth: 400,
  textAlign: 'center',
  p: 2,
};

export const WARNING_BOX = {display: 'flex', justifyContent: 'center', mb: 2};
export const WARNING_ICON = {fontSize: 60};
export const MB2 = {mb: 2};
export const JUSTIFY_CENTER = {justifyContent: 'center'};
export const APP_DIV_STYLE = {textAlign: 'center', padding: '2rem'} as const;
export const H1_DIV_STYLE = {fontSize: '3rem', marginBottom: '1rem'};
export const P_DIV_STYLE = {fontSize: '1.2rem', lineHeight: '1.6'};
