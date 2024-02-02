import Button_Back from '@/components/button_back'
import Button_Menu from '@/components/button_menu'
import '@/styles/info.css'
import '@/styles/upload.css'
import '@/styles/terms.css'
import Link from 'next/link'
import Button_Next from '@/components/button_next'

export default function PrivacyPolicies() {
	return (
		<div className="container">
        	<div className="container_header">
				<Button_Back/>
				<h1 className="title">Políticas </h1>
				<Button_Menu/>
				<p className="subtitle basic_text">
					Política de privacidade BFA EDUCAR
				</p>
			</div>
			<div className="info_body">
				<form className='terms_form' action="#">
					<h1 className="terms_title">Política de Privacidade</h1>
					<p className="basic_text">
						A Aplicação BFA EDUCAR destina-se a sensibilizar e promover conceitos de literacia financeira junto do público mais jovens e com idades maior de 14 anos. Toda a informação disponibilizada tem como objectivo o conhecimento geral e partilha de conhecimento quanto a Literacia Financeira, sendo abordada de uma forma acessível e não substitui de forma alguma o conselho e o recurso a especialistas em caso de necessidade. O Banco de Fomento Angola construiu a app BFA Educar como uma app gratuita. Este SERVIÇO é fornecido pelo Banco de Fomento Angola sem qualquer custo e destina-se a ser utilizado tal como está. Esta página é usada para informar os visitantes sobre nossas políticas de colecta, uso e divulgação de informações pessoais, caso alguém decida usar nosso serviço. Se você optar por usar nosso Serviço, concorda com a colecta e o uso de informações relacionadas a esta política. As informações pessoais que colectamos são usadas para fornecer e melhorar o serviço. Não usaremos ou compartilharemos as suas informações com ninguém, excepto conforme descrito nesta Política de Privacidade. Os termos utilizados nesta Política de Privacidade têm os mesmos significados que os nossos Termos e Condições, acessíveis no BFA Educar, salvo disposição em contrário nesta Política de Privacidade.
					</p>
					<h1 className="terms_title">Colecta e uso de informações</h1>
					<p className="basic_text">Para uma melhor experiência, ao usar nosso Serviço, podemos exigir que nos forneça certas informações de identificação pessoal, um nome(nickname) e e-mail. As informações que solicitamos serão retidas por nós e usadas conforme descrito nesta política de privacidade. O aplicativo usa serviços de terceiros que podem colectar informações usadas para identificá-lo. Link para a política de privacidade de provedores de serviços terceirizados usados pelo app: • Serviços do Google Play</p>
					<h1 className="terms_title">Dados de registo</h1>
					<p className="basic_text">Queremos informar que sempre que usar o nosso Serviço, em caso de erro no aplicativo, colectamos dados e informações (através de produtos de terceiros) em seu telefone chamado Log Data. Esses dados de registo podem incluir informações como endereço de protocolo de Internet (IP) do dispositivo, nome do dispositivo, versão do sistema operacional, configuração do aplicativo ao utilizar nosso serviço, hora e data de uso do serviço e outras estatísticas.</p>
					<h1 className="terms_title">Cookies</h1>
					<p className="basic_text">Cookies são arquivos com uma pequena quantidade de dados que são comumente usados como identificadores únicos anónimos. Estes são enviados para o seu navegador a partir dos sites que você visita e são armazenados na memória interna do seu dispositivo. <br/>Este Serviço não usa esses “cookies” explicitamente. No entanto, o aplicativo pode usar código e bibliotecas de terceiros que usam “cookies” para colectar informações e melhorar seus serviços. Tem a opção de aceitar ou recusar esses cookies e saber quando um cookie está sendo enviado ao seu dispositivo. Se você optar por recusar nossos cookies, talvez não consiga usar algumas partes deste Serviço.</p>
					<h1 className="terms_title">Provedores de serviço</h1>
					<p className="basic_text">Podemos empregar empresas e indivíduos terceirizados devido aos seguintes motivos: • Para facilitar nosso Serviço <br/> • Para fornecer o Serviço em nosso nome; <br/> • Para realizar serviços relacionados ao Serviço; ou <br/> • Para nos ajudar a analisar como nosso Serviço é usado. <br/> Queremos informar aos usuários deste Serviço que esses terceiros têm acesso às suas Informações Pessoais. O motivo é realizar as tarefas atribuídas a eles em nosso nome. No entanto, eles são obrigados a não divulgar ou usar as informações para qualquer outra finalidade.</p>
					<h1 className="terms_title">Segurança</h1>
					<p className="basic_text">Valorizamos sua confiança em nos fornecer suas informações pessoais, portanto, estamos conscientes para usar meios comercialmente aceitáveis de protegê-las. Mas lembre-se que nenhum método de transmissão pela internet, ou método de armazenamento electrónico é 100% seguro e confiável, e não podemos garantir sua segurança absoluta. Implementamos medidas de segurança adequadas para proteger as informações pessoais das crianças contra perda, uso indevido, acesso não autorizado, divulgação, alteração ou destruição não autorizada. Essas medidas incluem, mas não se limitam a controles de acesso físico e electrónico, criptografia de dados e treinamento de funcionários.</p>
					<h1 className="terms_title">Privacidade das crianças</h1>
					<p className="basic_text">Esses Serviços não se destinam a menores de 14 anos. Não colectamos intencionalmente informações de identificação pessoal de crianças menores. No caso de descobrirmos que uma criança menor de 14 anos nos forneceu informações pessoais, nós as excluímos imediatamente de nossos servidores. O Maior de idade (pai/Mãe) ou responsável próximos estiver ciente de que seu filho nos forneceu informações pessoais, entre em contacto connosco para que possamos tomar as medidas necessárias. <br/> Nossa aplicação colecta informações apenas com o consentimento verificável dos pais ou responsáveis legais. Antes de colectar qualquer informação pessoal, solicitaremos o consentimento dos pais ou responsáveis legais por meio de um processo adequado e seguro, de acordo com as leis aplicáveis. Informações agregadas não identificáveis ( nickname+ email dos pais) que não permitem a identificação pessoal da criança. As informações pessoais que podemos colectar incluem, unicamente: <br/> • Nick Name <br/> • Endereço de e-mail do pai, mãe ou responsável legal; <br/> Não compartilhamos informações pessoais de crianças com terceiros, excepto nas seguintes circunstâncias: • Se obtivermos o consentimento dos pais ou responsáveis legais; • Quando necessário para cumprir uma obrigação legal, como responder a uma ordem judicial ou processo legal; • Para proteger os direitos, propriedade ou segurança de nossa empresa, usuários da aplicação ou o público em geral. • Medidas de Segurança</p>	
					<h1 className="terms_title">Direitos dos Pais ou Responsáveis Legais</h1>
					<p className="basic_text">Os pais ou responsáveis legais têm o direito de revisar, corrigir, actualizar ou excluir as informações pessoais de seus filhos colectadas pela aplicação. Eles também podem retirar seu consentimento a qualquer momento, solicitando a exclusão das informações pessoais da criança. Para exercer esses direitos, entre em contacto connosco por meio das informações fornecidas no final desta política.</p>
					<h1 className="terms_title">Mudanças nesta Política de Privacidade</h1>
					<p className="basic_text">Podemos actualizar nossa Política de Privacidade de tempos em tempos. Assim, você é aconselhado a revisar esta página periodicamente para quaisquer alterações. Iremos notificá-lo sobre quaisquer alterações publicando a nova Política de Privacidade nesta página. <br/> Esta política é efectiva a partir de 2023-06-13</p>
					<h1 className="terms_title">Contacte-nos</h1>
					<p className="basic_text">Todos os dados, marcas registadas e todo o conteúdo em geral constante da APP BFA EDUCAR são da propriedade do Banco de Fomento Angola ou de alguma empresa sua parceira e estão protegidas nos termos gerais do direito, pela legislação nacional e internacional de protecção da Propriedade Intelectual Se tiver alguma dúvida ou sugestão sobre a nossa Política de Privacidade, não hesite em contactar-nos para <Link href="https://bfa.educar@bfa.ao" target='_blank' rel='external'>bfa.educar@bfa.ao</Link>.</p>
					
				</form>
			</div>
    	</div>
    )
}