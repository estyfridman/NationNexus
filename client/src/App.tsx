import './App.css';
import {APP_DIV_STYLE, H1_DIV_STYLE, P_DIV_STYLE} from '../src/constants/sxConstants';
import {LABELS} from '../src/constants/constants';

function App() {
  return (
    <>
      <div style={APP_DIV_STYLE}>
        <h1 style={H1_DIV_STYLE}>{LABELS.WELCOME}</h1>
        <p style={P_DIV_STYLE}>{LABELS.APP_TEXT1} </p>
        <p style={P_DIV_STYLE}>{LABELS.APP_TEXT2}</p>
      </div>
    </>
  );
}

export default App;
