import styles from './styles.module.css';
export default function Button({ children, className, ...rest }) {
  return (
    <button className={`${styles.button} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
}
