export default function ButtonIcon({
	children,
}: { children: React.ReactNode }) {
	return (
		<button type="button" className="button_icon">
			{children}
		</button>
	);
}
