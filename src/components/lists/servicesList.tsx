import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CardFriend from "../cards/cardFriend";
import api from "@/services/api";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import ButtonService from "../buttons/buttonService";

interface SubProduct {
  id: number;
  name: string;
  price?: number;
}

interface Product {
  id: number;
  name: string;
  reference: [string],
  referenceLenght: 0,
  subProducts: SubProduct[];
}

interface Entity {
  entity_id: number;
  reference: string;
  name: string;
  balance: number;
  account_id: number;
  description: string;
  products: Product[];
  logo: string;
}

interface ApiResponse {
  success: boolean;
  entities: Entity[];
}

export default function ServicesList({setEntity}: {setEntity: Dispatch<SetStateAction<Entity>>}) {
  const [services, setServices] = useState<ApiResponse>({success: false, entities: []})
  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const {data, error} = useSWR('/getEntities', fetcher)
  
  useEffect(()=>{
    if (data) {
      setServices(data)
    }
    if (error) {
      setServices({success: false, entities: [ ]})
    }
  }, [data, error])

  return (
    <>
      {(!services && !error) && (
        <>
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
        </>
      )}
      {services && services.entities.length > 0 && !error && (
        services.entities.map((entity) => (
          entity.reference === "600001" ? null : <ButtonService onClick={()=>{
            setEntity(entity)
          }}  key={entity.entity_id} image={entity.logo} serviceName={entity.name} />
        ))
      )}
    </>
  );
}
