import { CiCircleInfo } from "react-icons/ci";

interface IProps {
	message: string | undefined;
}

export default function InfoError({ message }: IProps) {
	return (
		<span className="input_error">
			<CiCircleInfo /> {message}
		</span>
	);
}
