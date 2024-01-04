import { useEffect, useState, useCallback, useContext } from "react";
import {
  BlockManager,
  BasicType,
  AdvancedType,
  JsonToMjml,
} from "easy-email-core";
import { EmailEditor, EmailEditorProvider } from "easy-email-editor";
import "easy-email-extensions/lib/style.css";
import { StandardLayout } from "easy-email-extensions";
import { useWindowSize } from "react-use";
import "easy-email-editor/lib/style.css";
import "@arco-themes/react-easy-email-theme/css/arco.css";
import { isEqual } from "lodash";
import mjml from "mjml-browser";
import { Liquid } from "liquidjs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { Message, PageHeader } from "@arco-design/web-react";
import styled from "styled-components";
import { templateApi } from "../../../apis/templateApi";
import { Toaster } from "../../../pages/common/Toaster";
import { CircularLoader } from "../../../pages/common/CircularLoader";
import {
  getMethodError,
  restMethodError,
} from "../../../constants/errorMessages";
import { Input } from "@arco-design/web-react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { DataContext } from "../../../context";
import { defaultCategories, fontList } from "./defaultTemplate";
import { CircularProgress } from "@mui/material";
import { handleHtmlToBlob } from "../../../utils";

const imageCompression = import("browser-image-compression");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  min-height: 873px;
`;
const Bar = styled.div`
  button {
    cursor: pointer;
    margin-left: 2px;
    border: none;
  }
`;

const Btn = styled.button`
  background: #fff;
  border-radius: 8px;
  padding: 8px 10px;
  border: 1px solid #e8e8ed !important;
`;

const PopperBtn = styled.button`
  background: #fff;
  border-radius: 4px;
  padding: 16px 36px;
  border: 1px solid #e8e8ed !important;
  box-shadow: 0px 0px 10px 0px #e8e8ed;
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 999;
  font-size: 14px;
`;

export default function Editor() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { toPreviewData, setToPreviewData } = useContext(DataContext);
  const { width } = useWindowSize();
  const [loader, setLoader] = useState("");
  const [title, setTitle] = useState("");
  const [displayBtn, setDisplayBtn] = useState(false);
  const id = params?.id;
  const [defaultValues, setValues] = useState({
    subject: null,
    content: BlockManager.getBlockByType(BasicType.PAGE).create({
      children: [BlockManager.getBlockByType(AdvancedType.WRAPPER).create()],
    }),
  });
  let checkLoader = loader === "create" || loader === "update";
  const [defaultCategory, setDefaultCategory] = useState(defaultCategories);
  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(() => {
    if (id) {
      setLoader("getTemplate");
      getTemplate(id);
    } else if (
      params.label === "load" &&
      toPreviewData.content_json &&
      toPreviewData.content_json !== "undefined"
    ) {
      const content = JSON.parse(toPreviewData.content_json);
      setValues({
        ...content,
        content: content.content,
      });
    }
    callTagsApi();
  }, []);

  const callTagsApi = () => {
    templateApi
      .getTags()
      .then((response) => {
        if (response?.data) {
          let data = response?.data?.map((elem, idx) => {
            return {
              title: elem.attributes.name,
              type: AdvancedType.TEXT,
              payload: {
                data: {
                  value: {
                    content: elem.attributes.tag,
                  },
                },
              },
            };
          });
          setDefaultCategory([
            ...defaultCategories, // setting default categories instead of prev to ensure length to be accurate with no glitches
            {
              label: "Tags",
              active: true,
              blocks: data,
            },
          ]);
        }
      })
      .catch((error) => console.log(error));
  };

  const getTemplate = (id) => {
    templateApi
      .getById(id)
      .then((res) => {
        if (!res.data) return null;
        if (res.data) {
          const content = JSON.parse(res.data.attributes.content_json);
          setTitle(res.data.attributes.name);
          setValues({
            ...content,
            content: content.content,
            subject: res.data.attributes.name,
          });
          setLoader("");
        }
      })
      .catch((error) => {
        Toaster.TOAST(getMethodError(error), "error");
        setLoader("");
        console.log(error);
      });
  };
  const createTemplate = (data) => {
    setLoader("create");
    templateApi
      .create(data)
      .then((res) => {
        setLoader("");
        if (res.data) {
          Message.success("Saved success!");
          navigate(-1, {
            state: {
              template_id: res.data.attributes.id,
            },
          });
        }
      })
      .catch((error) => {
        setLoader("");
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };
  const updateTemplate = (id, data) => {
    setLoader("update");
    templateApi
      .update(id, data)
      .then((res) => {
        setLoader("");
        if (res.data) {
          Message.success("Updated success!");
          // navigate("/campaign/templates");
          navigate(-1);
        }
      })
      .catch((error) => {
        setLoader("");
        Toaster.TOAST(restMethodError(error), "error");
        console.log(error);
      });
  };
  const saveAndExit = useCallback(
    async (values, form) => {
      setDisableBtn(true);
      const mjmlString = JsonToMjml({
        data: values.content,
        mode: process.env.REACT_APP_ENV,
        context: values.content,
        // dataSource: mergeTags,
      });
      const html = mjml(mjmlString, {}).html; //html from mjml
      const json = JSON.stringify(values, null, 2);
      let obj = await handleHtmlToBlob(html).then((res) => res);
      setToPreviewData((prev) => ({
        ...prev,
        image: obj.imageUrl,
        blob: obj.blob,
        content_html: html,
        content_json: json,
      }));
      navigate(-1);
    },
    [id, title]
  );
  const onSubmit = useCallback(
    async (values, form) => {
      if (!title) {
        Message.error("Please enter Template title");
        return null;
      }
      setDisplayBtn(false);
      const mjmlString = JsonToMjml({
        data: values.content,
        mode: process.env.REACT_APP_ENV,
        context: values.content,
        // dataSource: mergeTags,
      });

      const html = mjml(mjmlString, {}).html; //html from mjml
      const json = JSON.stringify(values, null, 2);
      let obj = await handleHtmlToBlob(html).then((res) => res);
      const formData = new FormData();
      formData.append("data[name]", title);
      formData.append("data[content_html]", html || null);
      formData.append("data[content_json]", json || null);
      formData.append("data[preview_image]", obj.blob);
      setToPreviewData((prev) => ({
        ...prev,
        image: obj.imageUrl,
        blob: obj.blob,
        content_html: html,
        content_json: json,
      }));

      if (id) {
        const isChanged = !(
          isEqual(defaultValues?.content, values.content) &&
          isEqual(defaultValues?.subject, title)
        );

        if (!isChanged) {
          Message.success("Updated success!");
          return;
        }
        await updateTemplate(id, formData);
        //update api
      } else {
        //create api
        await createTemplate(formData);
      }
    },
    [id, title]
  );

  const smallScene = width < 1400;
  const onBeforePreview = useCallback((html, mergeTags) => {
    const engine = new Liquid();
    const tpl = engine.parse(html);
    return engine.renderSync(tpl, mergeTags);
  }, []);
  const onUploadImage = async (blob) => {
    const compressionFile = await (
      await imageCompression
    ).default(blob, {
      maxWidthOrHeight: 1440,
    });
    const formData = new FormData();
    formData.append("data[image]", compressionFile);
    let url = await templateApi.uploadImage(formData);
    return url.data.attributes.image.url;
  };

  const handleTitle = (value) => {
    setTitle(value);
  };

  const handleBack = () => {
    if (location?.state?.from === "templateEdit") {
      setToPreviewData({});
    }
    navigate(-1);
  };

  return (
    <Container>
      {loader === "getTemplate" ? (
        <CircularLoader />
      ) : (
        <EmailEditorProvider
          key={id}
          data={defaultValues}
          height={"calc(100vh - 68px)"}
          autoComplete
          dashed={false}
          fontList={fontList}
          onBeforePreview={onBeforePreview}
          onUploadImage={onUploadImage}
        >
          {({ values }) => {
            return (
              <>
                <PageHeader
                  style={{ background: "var(--color-bg-2)" }}
                  backIcon
                  title={id ? "Edit" : "Create"}
                  onBack={() => handleBack()}
                  extra={
                    <Stack direction="row" spacing={5}>
                      {id ||
                      location?.state?.from === "Templates" ||
                      displayBtn ? (
                        <Input
                          placeholder="Enter Template Title"
                          value={title}
                          onChange={handleTitle}
                          status={!title && "error"}
                        />
                      ) : null}

                      <Bar>
                        {!id && (
                          <button
                            disabled={disableBtn}
                            onClick={() => {
                              location?.state?.from === "Templates"
                                ? onSubmit(values)
                                : saveAndExit(values);
                            }}
                            className="createlead-buttons__saveButton savebtntext editor-btn"
                          >
                            {" "}
                            {checkLoader ? (
                              <CircularProgress className="mt-1" />
                            ) : (
                              "Save & Close"
                            )}
                          </button>
                        )}

                        {id && (
                          <button
                            onClick={() => onSubmit(values)}
                            className="createlead-buttons__saveButton savebtntext editor-save-btn"
                          >
                            {" "}
                            {checkLoader ? (
                              <CircularProgress />
                            ) : (
                              "Save Template"
                            )}
                          </button>
                        )}
                      </Bar>
                      {!id && location?.state?.from !== "Templates" && (
                        <Bar>
                          <Btn
                            style={{
                              border: "1px solid #e8e8ed",
                            }}
                            type="button"
                            aria-describedby={id}
                            onClick={() => setDisplayBtn((prev) => !prev)}
                          >
                            <MoreHorizIcon />
                          </Btn>
                          {displayBtn && (
                            <PopperBtn onClick={() => onSubmit(values)}>
                              {" "}
                              {checkLoader ? (
                                <CircularProgress />
                              ) : (
                                "Save as Template"
                              )}
                            </PopperBtn>
                          )}
                        </Bar>
                      )}
                    </Stack>
                  }
                />

                <StandardLayout
                  compact={!smallScene}
                  categories={defaultCategory}
                >
                  <EmailEditor />
                </StandardLayout>
              </>
            );
          }}
        </EmailEditorProvider>
      )}
    </Container>
  );
}
