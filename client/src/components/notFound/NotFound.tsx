import { Link } from 'react-router-dom';
import styles from './not-found.module.scss'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface NotFoundProps {
  title?: string;
  message?: string;
}

export default function NotFound({ title, message }: NotFoundProps) {
  return (
    <div className={styles.notFoundContainer}>
         <h2 className={styles.heading}>{ title ? title : "The page you were looking for doesn't exist"}</h2>
      <p className={styles.message}>{ message ? message : "This page appears to have been removed or no longer exists"}</p>
      <Link to="/" > Back to Home Page </Link>
      <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.3.0/dist/dotlottie-wc.js" type="module"></script>
      <DotLottieReact
      src="https://lottie.host/405fa504-85f4-4798-843c-5ecd89aa3da0/9RcqJopDaB.lottie"
      loop
      autoplay
      style={{ width: '550px', height: '370px', backgroundColor: 'transparent',
      }}
    />
       
    </div>
  )
}