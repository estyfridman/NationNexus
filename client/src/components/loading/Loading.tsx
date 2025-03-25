import {DotLottieReact} from '@lottiefiles/dotlottie-react';
import {LOADING_DIV, LOADING_IMG} from '../../constants/sxConstants';

const Loading = () => {
  return (
    <div style={LOADING_DIV} data-testid='loading'>
      <script src='https://unpkg.com/@lottiefiles/dotlottie-wc@0.3.0/dist/dotlottie-wc.js' type='module'></script>
      <DotLottieReact
        src='https://lottie.host/56494940-8d70-489a-a4d9-68148e9f6c4e/NaF6Mk9qdR.lottie'
        autoplay
        loop
        style={LOADING_IMG}></DotLottieReact>
    </div>
  );
};

export default Loading;
