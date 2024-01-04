import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import global css
import "../../styles/global/common.css";
import {
  importLeadSuccessful,
  download,
  importUpload,
  leadimportProcess,
} from "../../assets";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { ButtonLoader } from "./ButtonLoader";
import { ImportError } from "./ImportError";

const ImportDialogBox = ({
  opens,
  handleToClose,
  leadImport,
  donwloadLeadfile,
  uploadFile,
  leadImportProcess,
  handleController,
  leadImportSucessfull,
  handleOkay,
  downloading,
  uploading,
  importErr
}) => {
  return (
    <>
      <div className="ma-main-dailogBox">
        <Dialog
          open={opens}
          onClose={handleToClose}
          className="ma-leadModal-import ma-leadImport-popup"
        >
          <DialogTitle className="ma-leadTitle p-0">
            <DialogActions>
              <Button
                style={{ minWidth: 0, padding: "5px" }}
                onClick={handleToClose}
                color="primary"
                autoFocus
              >
                <CloseIcon className="close-btn"></CloseIcon>
              </Button>
            </DialogActions>{" "}
          </DialogTitle>
          <DialogContent>
            {leadImport && (
              <DialogContentText>
                <div className="ma-parentBox">
                  <div className="ma-title-box">
                    <h5>Download template or import your data</h5>
                  </div>
                  <>
                    <div className="ma-content-popup">
                      <div className="ma-download-file">
                        <img
                          src={download}
                          alt="file"
                          className="ma-import-image"
                        />
                        <h6>Download</h6>
                        <p>
                          Download Marketing automation standard templated and
                          start importing your data
                        </p>
                        <ButtonLoader
                          loading={downloading}
                          classStyle={
                            "createlead-buttons__saveButton savebtntext"
                          }
                          btnType={"submit"}
                          handleClick={() => donwloadLeadfile()}
                          title={"Download"}
                        />
                      </div>
                      <div className="ma-download-file">
                        <img
                          src={importUpload}
                          alt="file"
                          className="ma-import-image"
                        />
                        <h6>Import</h6>
                        <p>Once your template is ready, import the template</p>

                        <label className="ma-leadLabel-import name">
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={uploadFile}
                          />

                          <LoadingButton
                            loading={uploading}
                            loadingIndicator={<CircularProgress />}
                            disabled={uploading}
                            className="createlead-buttons__saveButton savebtntext"
                            type="submit"
                            variant="contained"
                            color="info"
                            component="span"
                          >
                            Import
                          </LoadingButton>
                        </label>
                      </div>
                    </div>
                    {
                      importErr?.length > 0 &&
                      <div className="ma-import-error">
                        <ImportError importErr={importErr} />
                      </div>
                    }
                  </>
                </div>
              </DialogContentText>
            )}
            {uploading && (
              <DialogContentText>
                <div className="ma-parentBox">
                  <div className="ma-title-box">
                    <label>We’re uploading your template</label>
                  </div>
                  <>
                    <div className="ma-content-box">
                      <div className="ma-import">
                        <img
                          src={leadimportProcess}
                          alt="file"
                          className="ma-import-image"
                        />
                        <label>Uploading</label>
                        <p>
                          This would hardly take a minute depending on the size
                          of template
                        </p>
                        <Button
                          className="ma-import-Okay ma-import-okay-text"
                          type="submit"
                          variant="contained"
                          color="info"
                          onClick={handleController}
                        >
                          CANCEL
                        </Button>
                      </div>
                    </div>
                  </>
                </div>
              </DialogContentText>
            )}
            {leadImportSucessfull && (
              <DialogContentText>
                <div className="ma-parentBox">
                  <div className="ma-title-box">
                    <label>Your template has been Imported!</label>
                  </div>
                  <>
                    <div className="ma-content-box">
                      <div className="ma-import">
                        <img
                          src={importLeadSuccessful}
                          alt="file"
                          className="ma-import-image"
                        />
                        <label>Successful</label>
                        <Button
                          className="ma-import-Okay"
                          type="submit"
                          variant="contained"
                          color="info"
                          onClick={handleOkay}
                        >
                          Okay
                        </Button>
                      </div>
                    </div>
                  </>
                </div>
              </DialogContentText>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ImportDialogBox;
