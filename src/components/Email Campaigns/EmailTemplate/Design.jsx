import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import EmailEditor from "react-email-editor";
import styled from "styled-components";
import { CircularLoader } from "../../../pages/common/CircularLoader";
import sample from "./sample.json";
import Editor from "./Editor";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  min-height: 873px;
`;
const Bar = styled.div`
  flex: 1;
  background-color: #61dafb;
  color: #000;
  padding: 10px;
  display: flex;
  max-height: 70px;

  h1 {
    flex: 1;
    font-size: 16px;
    text-align: left;
  }

  button {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #000;
    color: #fff;
    border: 0px;
    max-width: 150px;
    cursor: pointer;
  }
`;

const Design = () => {
  const emailEditorRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [loader, setLoader] = useState(false);
  const [editor, setEditor] = useState(false);
  const navigate = useNavigate();

  const saveDesign = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.saveDesign((design) => {
      console.log("saveDesign", design);
      navigate("/campaign/create");
    });
  };
  // const exportHtml = () => {
  //   const unlayer = emailEditorRef.current?.editor;

  //   unlayer?.exportHtml((data) => {
  //     const { design, html } = data;
  //     console.log("exportHtml", html);
  //     alert("Output HTML has been logged in your developer console.");
  //   });
  // };

  const togglePreview = () => {
    const unlayer = emailEditorRef.current?.editor;

    if (preview) {
      unlayer?.hidePreview();
      setPreview(false);
    } else {
      unlayer?.showPreview("desktop");
      setPreview(true);
    }
  };

  const onDesignLoad = (data) => {
    console.log("onDesignLoad", data);
  };

  const onLoad = (unlayer) => {
    console.log("onLoad", unlayer);
    unlayer.addEventListener("design:loaded", onDesignLoad);
    unlayer.loadDesign(sample);
  };

  const onReady = (unlayer) => {
    setLoader(false);
    console.log("onReady", unlayer);
  };
  return (
    <Container>
      <Bar>
        <h1>Email Content Editor</h1>

        <button onClick={togglePreview}>
          {preview ? "Hide" : "Show"} Preview
        </button>
        <button onClick={saveDesign}>Save & Close</button>
        <button onClick={(e) => setEditor(!editor)}>Switch Editor</button>
      </Bar>
      {loader && <CircularLoader />}
      {editor ? (
        <Editor />
      ) : (
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
      )}
    </Container>
  );
};
export default Design;
