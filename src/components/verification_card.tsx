import '@/styles/verification.css'

export default function Verification_Card() {
    return (
        <div className="verification_container">
            <div className="verification_card">
                <h1 className='basic_text'>Introduza o código e verificação</h1>
                <div className='fragments_container'>
                    <input type="text" className="phone_fragment" maxLength={1} />
                    <input type="text" className="phone_fragment" maxLength={1} />
                    <input type="text" className="phone_fragment" maxLength={1} />
                    <input type="text" className="phone_fragment" maxLength={1} />
                    <input type="text" className="phone_fragment" maxLength={1} />
                    <input type="text" className="phone_fragment" maxLength={1} />
                </div>
                <p className="basic_text">Reenvie em 00:58s</p>
                <div className='buttons_container'>
                    <button>Cancelar</button>
                    <button>Confirmar</button>
                </div>
            </div>
        </div>
    )
}