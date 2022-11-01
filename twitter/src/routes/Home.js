import Nweet from "components/Nweet";
import {
  addDoc,
  collection,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { dbService } from "myBase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [totalNweet, setTotalNweet] = useState([]);
  //   const getNweets = async () => {
  //     const dbNweet = await getDocs(collection(dbService, "nweets"));
  //     dbNweet.forEach((doc) => {
  //       const nweetObj = { ...doc.data(), id: doc.id };
  //       setTotalNweet((prev) => [nweetObj, ...prev]); // 최근데이터>순서로
  //     });
  //   };

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      // db에 무슨 일이 있을때, 알림을 받음.
      const NweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTotalNweet(NweetArr);
    });
  }, []);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(dbService, "nweets"), {
        text: nweet,
        createAt: Date.now(),
        creatorId: userObj.uid,
      });
    } catch (e) {
      console.log(e);
    }
    setNweet("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={nweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Tweet" />
      </form>
      <div>
        {totalNweet.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
