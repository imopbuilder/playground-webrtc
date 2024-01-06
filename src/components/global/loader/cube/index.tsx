import styles from './styles.module.scss';

export function CubeLoader() {
	return (
		<div className={styles.scene}>
			<div className={styles['cube-wrapper']}>
				<div className={styles.cube}>
					<div className={styles['cube-faces']}>
						<div className={`${styles['cube-face']} ${styles.shadow}`} />
						<div className={`${styles['cube-face']} ${styles.bottom}`} />
						<div className={`${styles['cube-face']} ${styles.top}`} />
						<div className={`${styles['cube-face']} ${styles.left}`} />
						<div className={`${styles['cube-face']} ${styles.right}`} />
						<div className={`${styles['cube-face']} ${styles.back}`} />
						<div className={`${styles['cube-face']} ${styles.front}`} />
					</div>
				</div>
			</div>
		</div>
	);
}
