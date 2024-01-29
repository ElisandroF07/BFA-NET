"use client"

import { useEffect } from "react";
import '@/styles/upload.css'
import { IoCloudUpload } from "react-icons/io5";
import Button_Next from "@/components/button_next";
import Button_Back from "@/components/button_back";
import Button_Menu from "@/components/button_menu";

export default function Step3() {


    function acenar() {
        alert("Avanteeee")
    }

    return (
        <div className="main_container">
			<div className="container_header">
				<Button_Back/>
				<h1 className="title">Abertura de contas </h1>
				<Button_Menu/>
				<p className="subtitle basic_text">
					Faça upload das fotografias do seu documento de identificação
				</p>
			</div>
			<div className="container_body">
				<div className="upload_container">
					<p className="simple_text">Frente</p>
					<div className="upload_card">
						<IoCloudUpload className="iconOutButton" />
						<p className="simple_text">
							
								Arraste e solte o seu arquivo ou clique <br /> para fazer
								upload.
							
						</p>
						<p className="simple_text small">PNG, JPG, JPEG, maximo 10MB</p>
						<input
							type="file"
							name="identityCard_Back"
							className="input_file"
						/>
					</div>
				</div>
				<div className="upload_container">
					<p className="simple_text">Verso</p>
					<div className="upload_card">
						<IoCloudUpload className="iconOutButton" />
						<p className="simple_text">
							
								Arraste e solte o seu arquivo ou clique <br /> para fazer
								upload.
							
						</p>
						<p className="simple_text small">PNG, JPG, JPEG, maximo 10MB</p>
						<input
							type="file"
							name="identityCard_Back"
							className="input_file"
						/>
					</div>
				</div>
			</div>
			<div className="container_footer">
				<Button_Next id="step3_next"/>
			</div>
		</div>
    )
}