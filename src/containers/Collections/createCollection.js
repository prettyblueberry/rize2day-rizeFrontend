import React, { useState, useEffect } from "react";
import cn from "classnames";
import Icon from "../../components/Icon";
import styles from "./Profile.module.sass";
import styles1 from "./ProfileEdit.module.sass";
import styles2 from "./UploadDetails.module.sass";
import { toast } from "react-toastify";
import axios from "axios";
import { config, CATEGORIES, PROPERTY_TYPES } from "app/config.js";
import Modal from "components/Modal";
import TextInput from "../../components/TextInput";
import Dropdown from "../../components/Dropdown";
import MultipleInput from "../../components/MultipleInput";
import Alert from "../../components/Alert";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "app/hooks";
// import { getValidWallet } from "../../InteractWithSmartContract/interact";

import ButtonPrimary from "shared/Button/ButtonPrimary";
import {
  selectCurrentChainId,
  selectCurrentUser,
} from "app/reducers/auth.reducers";
import { changeConsideringCollectionId } from "app/reducers/collection.reducers";
import FormItem from "components/FormItem";
import Input from "shared/Input/Input";
import Textarea from "shared/Textarea/Textarea";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Label from "components/Label/Label";
import IconButton from "@mui/material/IconButton";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { Helmet } from "react-helmet";
import { useSigningClient } from "app/cosmwasm";

const ColorModeContext = React.createContext({ CollectionSelect: () => {} });

const CreateCollection = () => {
  const categoriesOptions = CATEGORIES;
  const typeOptions = PROPERTY_TYPES;

  // const [visible, setVisible] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [logoImg, setLogoImg] = useState("");
  const [bannerImg, setBannerImg] = useState("");
  const [textName, setTextName] = useState("");
  const [textDescription, setTextDescription] = useState("");
  const [termsCondtions, setTermsConditions] = useState("");
  const [categories, setCategories] = useState(categoriesOptions[0]);
  const [floorPrice, setFloorPrice] = useState(0);
  const [metaFields, setMetaFields] = useState([]);
  const [working, setWorking] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { addCollection, balances, getOwnedCollections } = useSigningClient();

  const [mode, setMode] = React.useState("light");
  const colorMode = React.useContext(ColorModeContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUsr = useAppSelector(selectCurrentUser);
  const currentChainId = useAppSelector(selectCurrentChainId);

  useEffect(() => {
    if (localStorage.theme === undefined || localStorage.theme === null) {
      setMode("dark");
    } else if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setMode("dark");
    } else {
      setMode("dark");
    }
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiStack: {
            styleOverrides: {
              root: {
                width: "100% !important",
                border: "2px solid #353945",
                borderRadius: "12px",
                color: "text-black dark:text-white",
              },
            },
          },
        },
      }),
    [mode]
  );

  const checkNativeCurrencyAndTokenBalances = async (tokenAmountShouldPay) => {
    if (
      balances[config.COIN_MINIMAL_DENOM] <= 0 ||
      (tokenAmountShouldPay > 0 && balances.cw20 <= tokenAmountShouldPay)
    ) {
      toast.warn("Insufficient TESTCORE or RIZE");
      return false;
    }
    return true;
  };

  const changeBanner = (event) => {
    var file = event.target.files[0];
    if (file == null) return;
    setSelectedBannerFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBannerImg(reader.result);
    };
    reader.onerror = function (error) {};
  };

  const changeAvatar = (event) => {
    var file = event.target.files[0];
    if (file == null) return;
    setSelectedAvatarFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setLogoImg(reader.result);
    };
    reader.onerror = function (error) {};
    document.getElementById("preSelectSentence").style.display = "none";
  };

  const saveCollection = async (params) => {
    let newCollectionId = 0;
    await axios({
      method: "post",
      url: `${config.API_URL}api/collection/`,
      data: params,
    })
      .then(async function (response) {
        newCollectionId = response.data?.data?._id || "";
        let isCreatingNewItem = localStorage.getItem("isNewItemCreating");
        if (isCreatingNewItem)
          localStorage.setItem("newCollectionId", newCollectionId);
        dispatch(changeConsideringCollectionId(newCollectionId));
        try {
          let balanceCheck = await checkNativeCurrencyAndTokenBalances(0);
          if (balanceCheck == false) {
            axios({
              method: "post",
              url: `${config.API_URL}api/collection/delete`,
              data: {
                _id: newCollectionId,
                owner: currentUsr._id || "",
              },
            })
              .then((data) => {})
              .catch((errror) => {});
            return;
          }
          const cratedTx = await addCollection(
            currentUsr.address,
            10000,
            textName,
            "Rize2DayNFT",
            config.CW721_CODE_ID,
            100000,
            [
              {
                address: currentUsr.address,
                rate: 50000,
              },
              {
                address: "testcore125y885enkegnqzsyxq4rgnswsqhqjrmgdratml",
                // "address": "devcore18a97jc79x8mt5hxzchf6h039gn7vk43dwrjnt6",
                rate: 10000,
              },
            ],
            newCollectionId
          );
          if (cratedTx != -1) {
            //read created collection info here
            let newCollections = await getOwnedCollections(currentUsr.address);
            if (newCollections?.list.length > 0) {
              let newCollectionInfo =
                newCollections.list[newCollections.list.length - 1];
              axios({
                method: "put",
                url: `${config.API_URL}api/collection/${newCollectionId}`,
                data: {
                  collectionNumber: newCollectionInfo.id,
                  address: newCollectionInfo.collection_address,
                  cw721address: newCollectionInfo.cw721_address,
                },
              })
                .then((response) => {
                  if (response.data.code == 0) {
                    toast.success(<div>You 've created a new collection.</div>);
                    navigate("/collectionList");
                  }
                })
                .catch((error) => {});
            }
          } else {
            toast.error("Transaction failed!");
            axios({
              method: "post",
              url: `${config.API_URL}api/collection/delete`,
              data: {
                _id: newCollectionId,
                owner: currentUsr._id || "",
              },
            })
              .then((data) => {})
              .catch((errror) => {});
          }
        } catch (error) {
          toast.error(error.message);
          //delete collection data using newCollectionId and ownner
          await axios({
            method: "post",
            url: `${config.API_URL}api/collection/delete`,
            data: {
              _id: newCollectionId,
              owner: currentUsr._id || "",
            },
          })
            .then((data) => {})
            .catch((errror) => {});
        }
      })
      .catch(function (error) {
        console.log("creating collection error : ", error);
        toast.error("Uploading failed");
      })
      .finally(() => {
        setWorking(false);
      });
  };

  const createCollection = async () => {
    if (currentUsr === null || currentUsr === undefined) {
      toast.warn("Please sign in and try again.");
      return;
    }
    if (selectedAvatarFile === null || selectedBannerFile === null) {
      toast.warn("You have to select logo and banner image.");
      return;
    }
    if (textName === "") {
      toast.warn("Collection name can not be empty.");
      return;
    }

    for (let i = 0; i < metaFields.length; i++) {
      const field = metaFields[i];
      if (!field.trait_type) {
        toast.warning("Please input the property name");
        return;
      }
      if (
        (field.type.text === "string" || field.type.text === "number") &&
        field.property.length === 0
      ) {
        toast.warning("Please input the property value");
        return;
      }
    }

    setWorking(true);
    var formData = new FormData();
    formData.append("itemFile", selectedAvatarFile);
    formData.append("authorId", "hch");

    const params = {};
    await axios({
      method: "post",
      url: `${config.API_URL}api/utils/upload_file`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        params.collectionLogoURL = response.data.path;
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Uploading failed.");
        setWorking(false);
        return;
      });

    formData = new FormData();
    formData.append("itemFile", selectedBannerFile);
    formData.append("authorId", "hch");
    await axios({
      method: "post",
      url: `${config.API_URL}api/utils/upload_file`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        params.collectionBannerURL = response.data.path;
        params.collectionName = textName;
        params.collectionDescription = textDescription;
        params.collectionCategory = categories.value;
        params.collectionTerms = termsCondtions;
        params.price = floorPrice;
        params.owner = currentUsr._id;
        params.metaData = metaFields;
        saveCollection(params);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Uploading failed.");
        setWorking(false);
      });
  };

  const setAddMetaField = () => {
    const mfs = metaFields;
    if (
      mfs.length > 0 &&
      (!mfs[mfs.length - 1].trait_type ||
        ((mfs[mfs.length - 1].type.text === "string" ||
          mfs[mfs.length - 1].type.text === "number") &&
          mfs[mfs.length - 1].property.length === 0))
    ) {
      toast.warning("Please input the property name and value");
      return;
    }
    mfs.push({
      trait_type: "",
      type: { value: 0, text: "string" },
      property: [],
      required: false,
    });
    setMetaFields(mfs);
    setRefresh(!refresh);
  };

  const removeMetaField = (index) => {
    const mfs = metaFields;
    mfs.splice(index, 1);
    setMetaFields(mfs);
    setRefresh(!refresh);
  };

  const handleChangeInput = (e, index) => {
    const mfs = metaFields;
    mfs[index].trait_type = e.target.value;
    setMetaFields(mfs);
    setRefresh(!refresh);
  };

  const handleChangeProperty = (v, index) => {
    if (Array.isArray(v)) {
      const mfs = metaFields;
      mfs[index].property = v;
      setMetaFields(mfs);
      setRefresh(!refresh);
    }
  };

  const handleChangeText = (e, index) => {
    const mfs = metaFields;
    mfs[index].property = e.target.value;
    setMetaFields(mfs);
    setRefresh(!refresh);
  };

  const handleChangeCheck = (e, index) => {
    const mfs = metaFields;
    mfs[index].required = e.target.checked;
    setMetaFields(mfs);
    setRefresh(!refresh);
  };

  const handlePropertyTypes = (v, index) => {
    const mfs = metaFields;
    mfs[index].type = v;
    setMetaFields(mfs);
    setRefresh(!refresh);
  };

  return (
    <>
      <Helmet>
        <title>Create a collection || Rize2Day </title>
      </Helmet>
      <div className="container">
        <div style={{ paddingTop: "3rem", paddingRight: "3rem" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
            Create a collection
          </h1>
        </div>
        <div
          className={styles1.user}
          style={{
            marginTop: "1rem",
          }}
        >
          <div className={styles1.details}>
            <div className={styles1.stage}>Logo image</div>
            <div className={styles1.text}>
              This image will also be used for navigation. 350x350 recommend
            </div>
            <div
              className={styles2.file}
              style={{
                border: "3px dashed rgb(204, 204, 204)",
                borderRadius: "50%",
                width: "160px",
                height: "160px",
              }}
            >
              <div id="preSelectSentence" style={{ position: "absolute" }}>
                <div className={styles2.icon}>
                  <Icon name="upload-file" size="24px" />
                </div>
              </div>
              <input
                className={styles1.load}
                type="file"
                onChange={changeAvatar}
              />
              <div className={styles1.avatar}>
                {logoImg !== "" && (
                  <img id="avatarImg" src={logoImg} alt="Avatar" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles1.user}
          style={{
            marginTop: "1rem",
          }}
        >
          <div className={styles1.details}>
            <div className={styles1.stage}>Banner image</div>
          </div>
        </div>
        <div
          className={styles2.item}
          style={{ border: "3px dashed rgb(204, 204, 204)", height: "200px" }}
        >
          <div className={styles2.file}>
            <div className={styles2.icon}>
              <Icon name="upload-file" size="48px" />
            </div>
            {!bannerImg && (
              <div className={cn(styles1.text, "text-center")}>
                This image will be appear at the top of your collection page.
                Avoid including too much text in this banner image, <br />
                as the dimensions change on different devices. 1400x400
                recommend.
              </div>
            )}
            <input
              className={styles2.load}
              type="file"
              onChange={changeBanner}
            />
            <div>
              {bannerImg !== "" && (
                <img
                  id="BannerImg"
                  className={styles2.image}
                  src={bannerImg}
                  alt="Banner"
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles1.stage}>Collection Details</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-full flex flex-col gap-4">
              <FormItem label="Name *">
                <Input
                  defaultValue="name"
                  placeholder="Enter Collection Name"
                  value={textName}
                  onChange={(event) => {
                    setTextName(event.target.value);
                  }}
                />
              </FormItem>
              <FormItem label="FLOOR PRICE">
                <Input
                  placeholder="Enter the floor price"
                  value={floorPrice}
                  type="number"
                  min="0"
                  step="0.001"
                  onChange={(event) => {
                    setFloorPrice(event.target.value);
                  }}
                />
              </FormItem>
              <FormItem label="CATEGORY">
                <Dropdown
                  className={styles.dropdown}
                  value={categories}
                  setValue={setCategories}
                  options={categoriesOptions}
                />
              </FormItem>
            </div>
            <div className="flex flex-col h-full">
              <Label>Description</Label>
              <Textarea
                className="mt-1.5 h-full"
                placeholder="Enter collection description over here"
                value={textDescription}
                onChange={(event) => {
                  setTextDescription(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col mt-5">
            <Label>Add custom terms and conditions</Label>
            <Textarea
              className="mt-1.5 h-full"
              placeholder="Enter custon terms and conditions over here"
              value={termsCondtions}
              onChange={(event) => {
                setTermsConditions(event.target.value);
              }}
            />
          </div>
          <div className="flex flex-col mt-5">
            <Label>Schema Properties</Label>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <div className="flex flex-col">
                  {metaFields &&
                    metaFields.length > 0 &&
                    metaFields.map((field, index) => {
                      let tag = "";
                      let placeholder = "";
                      switch (field.type.text) {
                        case "string":
                          placeholder = "Enter Property Name (e.g Eye)";
                          tag = (
                            <MultipleInput
                              label={""}
                              type="text"
                              metaIndex={index}
                              placeholder="Enter Property Value (e.g Black, Blue, Brown)"
                              value={field?.property}
                              onChange={(values, id) =>
                                handleChangeProperty(values, id)
                              }
                            />
                          );
                          break;
                        case "number":
                          placeholder = "Enter Property Name (e.g Fingers)";
                          tag = (
                            <MultipleInput
                              label={""}
                              type="number"
                              metaIndex={index}
                              placeholder="Enter Property Value"
                              value={field?.property}
                              onChange={(values, id) =>
                                handleChangeProperty(values, id)
                              }
                            />
                          );
                          break;
                        case "textarea":
                          placeholder = "Enter Property Name (e.g Description)";
                          break;
                        case "boolean":
                          placeholder = "Enter Property Name (e.g Cap)";
                          break;
                        default:
                      }
                      return (
                        <div
                          className="flex justify-between gap-4 mt-[14px]"
                          key={index}
                        >
                          <IconButton onClick={() => removeMetaField(index)}>
                            <AiOutlineMinusCircle size={28} />
                          </IconButton>
                          <Input
                            placeholder={placeholder}
                            className="w-1/3"
                            value={field?.input}
                            onChange={(e) => handleChangeInput(e, index)}
                          />
                          <div className="w-1/3">
                            <Dropdown
                              value={field?.type}
                              setValue={(v) => handlePropertyTypes(v, index)}
                              options={typeOptions}
                            />
                          </div>
                          <div className="w-1/3">{tag}</div>
                          <FormControlLabel
                            label="Required"
                            className="items-center"
                            control={
                              <Checkbox
                                className="items-center"
                                checked={field?.required}
                                onChange={(e) => handleChangeCheck(e, index)}
                              />
                            }
                          />
                        </div>
                      );
                    })}
                </div>
              </ThemeProvider>
            </ColorModeContext.Provider>
            <button
              className="rounded-2xl mt-2 p-2 border-dashed border-2 border-neutral-200 dark:border-neutral-600"
              onClick={setAddMetaField}
            >
              ADD PROPERTY
            </button>
          </div>
          <div
            className={styles2.foot}
            style={{
              marginTop: "1rem",
              marginBottom: "5rem",
            }}
          >
            <ButtonPrimary
              className={cn("button", styles2.button)}
              onClick={() => createCollection()}
              // type="button" hide after form customization
              type="button"
            >
              <span>Create Collection</span>
            </ButtonPrimary>
          </div>
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={working}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};

export default CreateCollection;
