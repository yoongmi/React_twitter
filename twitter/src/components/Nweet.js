import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { dbService } from "myBase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      //delete nweet
      await deleteDoc(NweetTextRef);
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
  };
  const onChange = (e) => {
    const { value } = e.target;
    setNewNweet(value);
  };
  return (
    <div>
      {editing ? (
        <form>
          <input value={newNweet} require />
          <input type="" />
        </form>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweeet</button>
              <button onClick={toggleEditing}>Edit Nweeet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
