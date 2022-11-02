import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";

const AuthForm = ({ newAccount }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      const auth = getAuth();
      if (newAccount) {
        // create account
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // log in
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      const errorMessage = error.message.split(":")[1].split("(")[0];
      if (errorMessage !== "Error") {
        setError(errorMessage);
      }
      if (error.code === "auth/email-already-in-use") {
        setError("The email address is already in use");
      } else if (error.code === "auth/invalid-email") {
        setError("The email address is not valid.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError("Operation not allowed.");
      } else if (error.code === "auth/weak-password") {
        setError("The password is too weak.");
      }
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={onChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={onChange}
      />
      <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
      {error}
    </form>
  );
};

export default AuthForm;
