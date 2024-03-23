import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

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
          {props.name}
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" variant={"flat"} items={items}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.key === "delete" ? "danger" : "default"}
            className={item.key === "4" ? "text-danger" : ""}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}