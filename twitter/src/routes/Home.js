import Nweet from "components/Nweet";
import {
  addDoc,
  collection,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { dbService, storageService } from "myBase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [totalNweet, setTotalNweet] = useState([]);
  const [attachment, setAttachment] = useState();

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
    let FileUrl = "";
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      FileUrl = await getDownloadURL(response.ref);
    }
    const newNweetObj = {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl: FileUrl,
    };
    try {
      await addDoc(collection(dbService, "nweets"), newNweetObj);
    } catch (e) {
      console.log(e);
    }
    setNweet("");
    setAttachment("");
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearPhotoClick = () => {
    setAttachment(null);
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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="200px" alt="preview img" />
            <button onClick={onClearPhotoClick}>Clear</button>
          </div>
        )}
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
