import React, { useState, useEffect, useContext, useRef } from "react";
//mui
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import "./NotesPopup.css";
import { NoteAPI } from "../../../apis/NoteApi";
import { DataContext } from "../../../context";
import { useParams } from "react-router";
import { Addlink } from "../../../assets";
import { CloseIcon } from "../../../assets";
import CloseIcons from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import { Toaster } from "../../../pages/common/Toaster";
import { ButtonLoader } from "../../../pages/common/ButtonLoader";
import { restMethodError } from "../../../constants/errorMessages";

const LeadnotesPopup = ({
  note,
  closeDrawer,
  isEdit,
  type,
  setPage,
  page,
  getData,
  setLoadMoreClick,
}) => {
  const [title, settitle] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [description, setdescription] = useState("");
  const [descriptionErrorMessage, setdescriptionErrorMessage] = useState("");
  const { notes, setNotes } = useContext(DataContext);
  const [imgurl, setImgurl] = useState(null);
  const [fileValue, setfileValue] = useState(null);
  const [fileChanged, setFileChanged] = useState(false)
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();
  let param = useParams();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const base64FileURL = (element, callback) => {
    let file = element;
    let reader = new window.FileReader();
    reader.onload = (e) => {
      setfileValue(e.target.result);
    };
    reader.onloadend = function (e) {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    setFileChanged(true);
    setImgurl(e.target.files[0]);
    base64FileURL(e.target.files[0], (obj) => {
      setfileValue(obj);
    });
  };

  const handleTitleChanges = (e) => {
    settitle(e.target.value);
    if (e.target.value) {
      setTitleErrorMessage("");
    } else {
      setTitleErrorMessage("Title can't be empty");
    }
  };

  const handleDesciptionChanges = (e) => {
    setdescription(e.target.value);
    if (e.target.value) {
      setdescriptionErrorMessage("");
    } else {
      setdescriptionErrorMessage("Description can't be empty");
    }
  };

  const handleValidation = () => {
    let isFocus = true;
    if (!title) {
      if (isFocus) {
        titleRef.current.focus();
        isFocus = false;
      }
      setTitleErrorMessage("Title can't be empty");
    }
    if (!description) {
      if (isFocus) {
        descriptionRef.current.focus();
        isFocus = false;
      }
      setdescriptionErrorMessage("Description can't be empty");
    }
  };

  const handleClose = () => {
    settitle("");
    setdescription("");
    setfileValue("");
    closeDrawer();
  };

  useEffect(() => {
    if (note && Object.keys(note)?.length > 0 && isEdit) {
      setfileValue(note?.attributes?.attachment?.url);
      settitle(note?.attributes?.title);
      setdescription(note?.attributes?.description);
      setImgurl(note?.attributes?.attachment?.url)
    }
  }, [setfileValue]);

  const handleSubmit = () => {
    handleValidation();
    const formData = new FormData();
    let types = type;
    if (title?.length !== 0 && description?.length !== 0) {
      formData.append("data[title]", title);
      formData.append("data[description]", description);
      formData.append("data[noteable_type]", types);
      formData.append("data[noteable_id]", parseInt(param?.id));
      formData.append("data[attachment]", imgurl);
      if (!note?.id) {
        setLoading(true);
        NoteAPI.create({ formData })
          .then((response) => {
            if (response?.data?.attributes) {
              closeDrawer();
              setLoadMoreClick(false);
              if (page === 1) {
                getData();
              } else {
                setPage(1);
              }
              Toaster.TOAST("Note created successfully", "success");
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Toaster.TOAST(restMethodError(error), "error");
            console.log(error);
          });
      } else {
        setLoading(true);
        if (!fileChanged) {
          formData.delete("data[attachment]")
        }
        NoteAPI.update(note?.id, types, param?.id, { formData })
          .then((response) => {
            if (response?.data?.attributes) {
              closeDrawer();
              const updatedNotes = notes?.map((elem, key) => {
                return elem?.id === response?.data?.id ? response?.data : elem;
              });
              if (page === 1) {
                getData();
              } else {
                setPage(1);
              }
              setNotes(updatedNotes);
              Toaster.TOAST("Note updated successfully", "success");
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            Toaster.TOAST(restMethodError(error), "error");
            console.log(error);
          });
      }
    }
  };

  const handleRemove = () => {
    setfileValue(null)
    setFileChanged(true)
  }

  return (
    <>
      <Paper sx={{ overflowX: "hidden" }} className="ma-popupAll-side mb-3">
        <div>
          <button className="createtask_btn">
            {note?.id ? (
              <span className="createtask_txt">Edit Note</span>
            ) : (
              <span className="createtask_txt">Create Note</span>
            )}
            <CloseIcons sx={{ color: "#fff" }} onClick={() => handleClose()} />
          </button>
          <h6 className="filldetails_txt">Fill Details</h6>
        </div>
        <div className="ma-calls-field">
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label className="status_text">
                  <span className="requreiedField">*</span>Title
                </label>
                <TextField
                  name="title"
                  inputRef={titleRef}
                  size="medium"
                  id="title"
                  placeholder="Note title"
                  className="textfield_txt placeholder_field"
                  autoFocus
                  value={title}
                  onChange={(e) => handleTitleChanges(e)}
                  helperText={
                    <span className="ma-error">{titleErrorMessage}</span>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <label className="status_text">
                  <span className="requreiedField">*</span>Description
                </label>
                <TextField
                  size="medium"
                  name="Description"
                  inputRef={descriptionRef}
                  id="Description"
                  className="description_textfield_txt placeholder_field"
                  multiline
                  rows={4}
                  placeholder="Write some description here"
                  value={description}
                  onChange={(e) => handleDesciptionChanges(e)}
                  helperText={
                    <span className="ma-error">{descriptionErrorMessage}</span>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <div className="link_container my-0" onClick={triggerFileInput}>
                  {fileValue && (
                    <div className="imgPreview">
                      <div className="selected_Img">
                        <img src={fileValue} alt="" />
                      </div>
                      <img
                        className="previewClose"
                        src={CloseIcon}
                        alt="CloseIcon"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemove()}
                      />
                    </div>
                  )}

                  <img src={Addlink} alt="Addlink" width={"40"} />
                  <input
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleFileChange}
                  />
                  <span className="attached_txt">Attach Image (jpg/png)</span>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <ButtonLoader
                    loading={loading}
                    classStyle={"create_btn"}
                    handleClick={() => handleSubmit()}
                    title={note?.id ? "SAVE" : "CREATE"}
                    spanTextClass={"create_btn_txt"}
                  />
                  <button className="cancel_btn ms-3" onClick={() => handleClose()}>
                    <span className="cancel_btn_txt"> CANCEL</span>
                  </button>
                </div>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default LeadnotesPopup;
