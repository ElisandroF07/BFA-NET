import { useEffect, useState } from "react";
import CardFriend from "../cards/cardFriend";
import api from "@/services/api";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";

interface IPersonalData {
  name: string[];
  gender: string;
  birthDate: Date;
}

interface IInfoFriend {
	personalData?: IPersonalData;
	image: string; 
	friendId: number,
	nickname: string,
	email: string
}

interface IFriends {
  success: boolean;
  friends: IInfoFriend[]; 
  message: string;
}

interface IProps {
  biNumber: string,
  accountNumber: string,
  email: string,
  friends: IFriends | null,
  error: ""
}

export default function FriendList({ biNumber, accountNumber, email, friends, error }: IProps) {
  



  return (
    <>
      {(!friends && !error) && (
        <>
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
          <Skeleton borderRadius={10} height={50} style={{ width: "100%" }} />
        </>
      )}
      {friends && friends.friends.length === 0 && !error && (
        <div className="withoutTransactions">
          Não há amigos
        </div>
      )}
      {friends && friends.friends.length > 0 && !error && (
        friends.friends.map((friend) => (
          <CardFriend key={friend.friendId} id={friend.friendId} name={friend.nickname} email={friend.email} imageUrl={friend.image} biNumber={biNumber} accountNumber={accountNumber} emailFrom={email} />
        ))
      )}
    </>
  );
}
