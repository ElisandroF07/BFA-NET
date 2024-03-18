import Image from "next/image";
import { RefObject } from "react";
import { FaX } from "react-icons/fa6";
import jpeg from "@/assets/images/JPEG.svg";
import jpg from "@/assets/images/JPG.svg";
import png from "@/assets/images/PNG.svg";
import svg from "@/assets/images/SVG.svg";
import webp from "@/assets/images/WEBP.svg";

interface IProps {
	imageType: string;
	imageAlt: string;
	fileName: string;
	fileSize: string;
	imageRef: RefObject<HTMLImageElement>;
	file: File;
	handleClick: () => void;
}

export default function Uploader({
	imageType,
	imageAlt,
	fileName,
	imageRef,
	fileSize,
	file,
	handleClick,
}: IProps) {
	return (
		<div className="uploader">
			<div className="top">
				<div className="text">
					<Image
						src={
							imageType === "png"
								? png
								: imageType === "jpg"
								  ? jpg
								  : imageType === "jpeg"
									  ? jpeg
									  : imageType === "webp"
										  ? webp
										  : imageType === "svg"
											  ? svg
											  : jpg
						}
						width={60}
						alt={imageAlt}
					/>
					<div>
						<p className="basic_text">{fileName}</p>
						<p className="basic_text">{fileSize} KB</p>
					</div>
				</div>
				<div className="end">
					<button type="button" onClick={handleClick}>
						<FaX />
					</button>
				</div>
			</div>
			<Image
				ref={imageRef}
				src={URL.createObjectURL(file || new File([], ""))}
				alt={"image"}
				width={0}
				height={0}
				style={{
					visibility: "hidden",
					opacity: "0",
					position: "absolute",
					top: "0px",
					left: "0px",
				}}
			/>
		</div>
	);
}
