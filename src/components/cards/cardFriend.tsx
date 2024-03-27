import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection} from "@nextui-org/react";

interface IProps {
  name: string,
  email?: string,
  imageUrl?: string
}

const items = [
  {
    key: "1",
    label: "Editar",
  },
  {
    key: "2",
    label: "Solicitar dinheiro",
  },
  {
    key: "3",
    label: "Enviar dinheiro",
  },
  {
    key: "4",
    label: "Remover",
  }
];

export default function CardFriend(props: IProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button type="button" className="cardFriend">
          <div className="layoutProfile" style={{backgroundImage: `url(${props.imageUrl})`}}/>
          <div className="text">
            <p>{props.name}</p>
            <p>{props.email}</p>
          </div>
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Example with disabled actions">
        <DropdownSection title="Opções">
          <DropdownItem key="new">Enviar dinehrio</DropdownItem>
          <DropdownItem key="copy">Solicitar dinehiro</DropdownItem>
        </DropdownSection>
        <DropdownSection title="Zona vermelha">  
          <DropdownItem key="edit">Editar</DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">Remover amigo</DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}